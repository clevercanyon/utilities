<?php
/**
 * CLEVER CANYON™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Strict types, namespace, use statements, and other headers.">

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\Fs\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\Fs
 */
trait Normalize_Members {
	/**
	 * Normalizes a path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to normalize.
	 * @param array  $_d   Internal use only — do not pass.
	 *
	 * @throws U\Fatal_Exception On failure to resolve a relative path.
	 * @return string Normalized path, with wrappers considered and preserved.
	 *
	 * @note  This function takes a number of internal directives that have an impact on behavior.
	 *        However, none of the directives are part of a public API. Other utilities are available.
	 *
	 * @note  This function is not URL scheme-safe. That's another set of concerns.
	 *        While this function is scheme-agnostic, using it with (e.g., `http://`, `data://`) is not recommended.
	 *        In fact, recommend not using with any arbitrary schemes not officially known|registered as PHP stream wrappers.
	 *
	 * @see   U\Fs::abs()
	 * @see   U\Fs::realize()
	 *
	 * @see   U\Dir::name()
	 * @see   U\Dir::subpath()
	 *
	 * @see   U\Dir::join()
	 * @see   U\Dir::join_ets()
	 *
	 * @see   U\Fs::wrappers()
	 * @see   U\Fs::split_wrappers()
	 * @see   U\Fs::may_have_wrappers()
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::normalize()
	 */
	public static function normalize( string $path, array $_d = [] ) : string {
		if ( ! empty( $_d[ 'cache' ] ) // Enable caching?
			&& null !== ( $cache = &static::cls_cache( [ __FUNCTION__, $path, $_d ] ) ) ) {
			return $cache; // Already cached; saves a little time.
		}
		// Normalize type of slashes.

		$path = str_replace( '\\', '/', $path );

		// Parse & temporarily remove wrappers.

		if ( ! U\Fs::may_have_wrappers( $path, [ 'skip:str_replace' => true ] ) ) {
			$wrappers = ''; // Saves time; no `$wrappers` to parse.
		} else {
			$wrappers = U\Fs::wrappers( $path, 'string', [
				'bypass:may_have_wrappers' => true,
				'bypass:normalize'         => true,
			] );
			if ( $wrappers ) {
				$wrappers = mb_strtolower( $wrappers );
				$path     = mb_substr( $path, mb_strlen( $wrappers ) );
			}
		}
		// Maybe join additional paths by directive.

		if ( ! empty( $_d[ 'join:paths' ] ) ) {
			$path = str_replace( '\\', '/', $path . '/' . implode( '/', $_d[ 'join:paths' ] ) );
		}
		// Reduce to single slashes after having removed wrappers and joined paths.

		$path = preg_replace( '/\/+/u', '/', $path );

		// Maybe resolve relative filesystem path to absolute path, by directive.
		// Only if no `$wrappers`, or when `file://`, `//`, `[a-z]:` is `$last_wrapper`.
		// For Windows, please carefully review {@see https://o5p.me/z52z8j} for further details.

		if ( ! empty( $_d[ 'resolve:relative-path' ] ) && '' !== $path && '/' !== $path[ 0 ] ) {
			if ( $wrappers ) {
				$split_wrappers ??= U\Fs::split_wrappers( $wrappers );
				$last_wrapper   ??= U\Arr::value_last( $split_wrappers );
			} else {
				$split_wrappers ??= []; // Make sure this gets set.
				$last_wrapper   ??= ''; // Same in this case.
			}
			if ( $wrappers && ! preg_match( '/^(?:\/{2}|[a-z]{1}\:|(?:file)\:\/{2})$/ui', $last_wrapper ) ) {
				throw new U\Fatal_Exception(
					'Unable to resolve relative path: `' . $path . '`, with wrappers: `' . $wrappers . '`.' .
					' The available data is incompatible with absolute path resolution in a known filesystem.'
				);
			}
			$cwd_path = U\Env::var( 'CWD' ); // Already-normalized path.

			if ( ! U\Fs::may_have_wrappers( $cwd_path, [ 'skip:str_replace' => true ] ) ) {
				$cwd_wrappers = ''; // Saves time; no `$cwd_wrappers` to parse.
			} else {
				$cwd_wrappers = U\Fs::wrappers( $cwd_path, 'string', [
					'bypass:may_have_wrappers' => true,
					'bypass:normalize'         => true,
				] );
				if ( $cwd_wrappers ) {
					$cwd_wrappers = mb_strtolower( $cwd_wrappers );
					$cwd_path     = mb_substr( $cwd_path, mb_strlen( $cwd_wrappers ) );
				}
			}
			$_cwd_path_parts                 = explode( '/', '/' === $cwd_path ? $cwd_path : rtrim( $cwd_path, '/' ) );
			$_have_compatible_cwd_path_parts = count( $_cwd_path_parts ) >= 2 && '' === $_cwd_path_parts[ 0 ];

			$_no_wrappers_to_no_cwd_wrappers        = ! $wrappers && ! $cwd_wrappers;
			$_last_wrapper_to_matching_cwd_wrappers = $wrappers && $cwd_wrappers && $last_wrapper === $cwd_wrappers;
			$_last_wrapper_file_to_no_cwd_wrappers  = $wrappers && 'file://' === $last_wrapper && ! $cwd_wrappers;
			$_last_wrapper_file_to_wdl_cwd_wrappers = $wrappers && 'file://' === $last_wrapper && $cwd_wrappers && preg_match( '/^(?:[a-z]{1}\:)$/ui', $cwd_wrappers );
			$_no_wrappers_to_compat_cwd_wrappers    = ! $wrappers && $cwd_wrappers && preg_match( '/^(?:\/{2}|[a-z]{1}\:)$/ui', $cwd_wrappers );

			$_have_compatible_wrappers_to_cwd_wrappers = // Any of the following scenarios are compatible.
				$_no_wrappers_to_no_cwd_wrappers               // Don't need to worry about wrappers.
				|| $_last_wrapper_to_matching_cwd_wrappers     // Use the already-compatible `$last_wrapper`.
				|| $_last_wrapper_file_to_no_cwd_wrappers      // Use the already-compatible `$last_wrapper`.
				|| $_last_wrapper_file_to_wdl_cwd_wrappers  // Use `$last_wrapper` + CWD inner wrapper.
				|| $_no_wrappers_to_compat_cwd_wrappers;       // Use `$cwd_wrappers` and renormalize.

			if ( ! $_have_compatible_cwd_path_parts || ! $_have_compatible_wrappers_to_cwd_wrappers ) {
				throw new U\Fatal_Exception(
					'Unable to resolve relative path: `' . $path . '`, from CWD: `' . $cwd_path . '`.' .
					' Relative path wrappers: `' . $wrappers . '`, to CWD wrappers: `' . $cwd_wrappers . '`.' .
					' The available data is incompatible with absolute path resolution in a known filesystem.'
				);
			}
			$_abs_path_parts = $_cwd_path_parts; // Start from CWD base.

			foreach ( explode( '/', $path ) as $_part_of_path ) {
				if ( '.' === $_part_of_path ) {
					continue; // No action.
				} elseif ( '..' === $_part_of_path ) {
					array_pop( $_abs_path_parts );
				} else {
					$_abs_path_parts[] = $_part_of_path;
				}
			}
			$_total_abs_path_parts = count( $_abs_path_parts );

			while ( $_total_abs_path_parts < 2 || '' !== $_abs_path_parts[ 0 ] ) {
				array_unshift( $_abs_path_parts, '' ); // i.e., `['', '']` = `/`.
				$_total_abs_path_parts = count( $_abs_path_parts );
			}
			$path = implode( '/', $_abs_path_parts ); // Absolute path now.

			if ( $_last_wrapper_file_to_wdl_cwd_wrappers ) { // Got Windows drive-letter `$cwd_wrappers`, must renormalize.
				return $cache = U\Fs::normalize( $wrappers . '/' . $cwd_wrappers . $path, array_intersect_key( $_d, [ 'append:trailing-slash' => 0 ] ) );
			}
			if ( $_no_wrappers_to_compat_cwd_wrappers ) { // Got new `$cwd_wrappers`, must renormalize.
				return $cache = U\Fs::normalize( $cwd_wrappers . $path, array_intersect_key( $_d, [ 'append:trailing-slash' => 0 ] ) );
			}
		}
		// If there are `$wrappers` and a `$path`, fix any obvious problems with `$path`,
		// based on an examination of it's last (innermost) wrapper. Note the `file://` wrapper doesn't
		// work with relative paths whatsoever. So we make sure `$path` starts with a `/` for validity.

		if ( $wrappers && '' !== $path ) {
			$split_wrappers ??= U\Fs::split_wrappers( $wrappers );
			$last_wrapper   ??= U\Arr::value_last( $split_wrappers );

			if ( '/' !== $path[ 0 ] && $last_wrapper ) {
				if ( 'file://' === $last_wrapper ) {
					$path = '/' . $path; // Force leading slash for validity.
				}
			} elseif ( '/' === $path[ 0 ] && $last_wrapper ) {
				if ( 'file://' !== $last_wrapper // Just to make sure, as this saves a little time.
					// UNC `//` should be followed by a server share, not `/`; {@see https://o5p.me/PnKPmm}.
					&& preg_match( '/^(?:\/{2}|(?:s3|php|http|data|expect|ssh2\.tunnel)\:\/{2})$/ui', $last_wrapper )
				) {
					$path = ltrim( $path, '/' ); // Strip leading slash.
				}
			}
		} // Complete `$path` normalization and return now.

		if ( '/' === $path ) {                 // Nothing more to do here.
			return $cache = $wrappers . $path; // `$wrappers` + normalized `$path`.
		}
		$path = rtrim( $path, '/' );  // ← This completes normalization.

		return $cache = $wrappers . $path . // `$wrappers` + normalized `$path` (+ possible trailing slash).
			( ! empty( $_d[ 'append:trailing-slash' ] ) && ( ! $wrappers || '' !== $path ) ? '/' : '' );
	}
}
