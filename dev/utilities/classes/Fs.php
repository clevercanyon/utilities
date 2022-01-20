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
namespace Clever_Canyon\Utilities\Dev\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\Dev\{Utilities as D};

// </editor-fold>

/**
 * Filesystem utilities.
 *
 * @since 2021-12-15
 */
final class Fs {
	/**
	 * Matches path wrappers.
	 *
	 * @since 2021-12-15
	 *
	 * @see   D\Fs::wrappers()
	 * @see   D\Fs::normalize()
	 *
	 * @see   https://regex101.com/r/elgxgZ/8
	 * @see   D\Fs::$path_wrappers_split_regexp Same pattern, just prepared differently.
	 * @see   \Clever_Canyon\Utilities\Fs::$path_wrappers_split_regexp
	 */
	protected static string $path_wrappers_regexp = '/^(?:(?:\/{2})|(?:(?:[a-z]{1}\:|[^\s\/:]{1,}\:[\/]{2}))+)/ui';

	/**
	 * Splits path wrappers.
	 *
	 * @since 2021-12-15
	 *
	 * @see   D\Fs::wrappers()
	 * @see   D\Fs::normalize()
	 *
	 * @see   https://regex101.com/r/elgxgZ/8
	 * @see   D\Fs::$path_wrappers_regexp Same pattern, just prepared differently.
	 * @see   \Clever_Canyon\Utilities\Fs::$path_wrappers_regexp
	 */
	protected static string $path_wrappers_split_regexp = '/(\/{2}|[a-z]{1}\:|[^\s\/:]{1,}\:[\/]{2})/ui';

	/**
	 * Resolves and normalizes path (symlinks *not* resolved).
	 *
	 * @since  2022-01-15
	 *
	 * @param string $path Path to parse.
	 *
	 * @throws D\Fatal_Exception On failure; {@see D\Fs::normalize()}.
	 * @return string Absolute path normalized (symlinks *not* resolved).
	 *
	 * @note   This expands to absolute path. It is CWD-aware, but not filesystem-aware.
	 *         Therefore, the absolute path it returns may or may not *actually* exist.
	 *
	 * @see    \Clever_Canyon\Utilities\Fs::abs()
	 */
	public static function abs( string $path ) : string {
		return D\Fs::normalize( $path, [ 'resolve:relative-path' => true ] );
	}

	/**
	 * Resolves, realizes (symlinks resolved), normalizes path.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $path Path to parse.
	 *
	 * @return string Realized (symlinks resolved) canonical path normalized.
	 *                This returns an empty string on failure to realize.
	 *
	 * @note  This expands/resolves everything, and it is filesystem-aware.
	 *        All symbolic links are resolved; {@see realpath()}.
	 *
	 * @see   \Clever_Canyon\Utilities\Fs::realize()
	 */
	public static function realize( string $path ) : string {
		return false !== ( $rp = realpath( $path ) ) ? D\Fs::normalize( $rp ) : '';
	}

	/**
	 * Normalizes a path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to normalize.
	 * @param array  $_d   Internal use only — do not pass.
	 *
	 * @throws D\Fatal_Exception On failure to resolve a relative path.
	 * @return string Normalized path, with wrappers considered and preserved.
	 *
	 * @note  This function takes a number of internal directives that have an impact on behavior.
	 *        However, none of the directives are part of a public API. Other utilities are available.
	 *
	 * @note  This function is not URL scheme-safe. That's another set of concerns.
	 *        While this function is scheme-agnostic, using it with (e.g., `http://`, `data://`) is not recommended.
	 *        In fact, recommend not using with any arbitrary schemes not officially known|registered as PHP stream wrappers.
	 *
	 * @see   D\Fs::abs()
	 * @see   D\Fs::realize()
	 *
	 * @see   D\Dir::name()
	 * @see   D\Dir::subpath()
	 *
	 * @see   D\Dir::join()
	 * @see   D\Dir::join_ets()
	 *
	 * @see   D\Fs::wrappers()
	 * @see   D\Fs::split_wrappers()
	 * @see   D\Fs::may_have_wrappers()
	 *
	 * @see   \Clever_Canyon\Utilities\Fs::normalize()
	 */
	public static function normalize( string $path, array $_d = [] ) : string {
		// Normalize type of slashes.

		$path = str_replace( '\\', '/', $path );

		// Parse & temporarily remove wrappers.

		if ( ! D\Fs::may_have_wrappers( $path, [ 'skip:str_replace' => true ] ) ) {
			$wrappers = ''; // Saves time; no `$wrappers` to parse.
		} else {
			$wrappers = D\Fs::wrappers( $path, 'string', [
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
				$split_wrappers ??= D\Fs::split_wrappers( $wrappers );
				$last_wrapper   ??= $split_wrappers[ array_key_last( $split_wrappers ) ];
			} else {
				$split_wrappers ??= []; // Make sure this gets set.
				$last_wrapper   ??= ''; // Same in this case.
			}
			if ( $wrappers && ! preg_match( '/^(?:\/{2}|[a-z]{1}\:|(?:file)\:\/{2})$/ui', $last_wrapper ) ) {
				throw new D\Fatal_Exception(
					'Unable to resolve relative path: `' . $path . '`, with wrappers: `' . $wrappers . '`.' .
					' The available data is incompatible with absolute path resolution in a known filesystem.'
				);
			}
			$cwd_path = D\Fs::normalize( getcwd() ); // Normalized CWD path.

			if ( ! D\Fs::may_have_wrappers( $cwd_path, [ 'skip:str_replace' => true ] ) ) {
				$cwd_wrappers = ''; // Saves time; no `$cwd_wrappers` to parse.
			} else {
				$cwd_wrappers = D\Fs::wrappers( $cwd_path, 'string', [
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
			$_last_wrapper_file_to_no_cwd_wrappers  = $wrappers && ! $cwd_wrappers && 'file://' === $last_wrapper;
			$_last_wrapper_to_matching_cwd_wrappers = $wrappers && $cwd_wrappers && $last_wrapper === $cwd_wrappers;
			$_no_wrappers_to_compat_cwd_wrappers    = ! $wrappers && $cwd_wrappers && preg_match( '/^(?:\/{2}|[a-z]{1}\:)$/ui', $cwd_wrappers );

			$_have_compatible_wrappers_to_cwd_wrappers = // Any of the following scenarios are compatible.
				$_no_wrappers_to_no_cwd_wrappers           // Don't need to worry about wrappers.
				|| $_last_wrapper_file_to_no_cwd_wrappers  // Use the already-compatible `$last_wrapper`.
				|| $_last_wrapper_to_matching_cwd_wrappers // Use the already-compatible `$last_wrapper`.
				|| $_no_wrappers_to_compat_cwd_wrappers;   // Use `$cwd_wrappers` and renormalize.

			if ( ! $_have_compatible_cwd_path_parts || ! $_have_compatible_wrappers_to_cwd_wrappers ) {
				throw new D\Fatal_Exception(
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

			if ( $_no_wrappers_to_compat_cwd_wrappers ) { // Got new `$cwd_wrappers`, must renormalize.
				return D\Fs::normalize( $cwd_wrappers . $path, array_intersect_key( $_d, [ 'append:trailing-slash' => 0 ] ) );
			}
		}
		// If there are `$wrappers` and a `$path`, fix any obvious problems with `$path`,
		// based on an examination of it's last (innermost) wrapper. Note the `file://` wrapper doesn't
		// work with relative paths whatsoever. So we make sure `$path` starts with a `/` for validity.

		if ( $wrappers && '' !== $path ) {
			$split_wrappers ??= D\Fs::split_wrappers( $wrappers );
			$last_wrapper   ??= $split_wrappers[ array_key_last( $split_wrappers ) ];

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

		if ( '/' === $path ) {        // Nothing more to do here.
			return $wrappers . $path; // `$wrappers` + normalized `$path`.
		}
		$path = rtrim( $path, '/' );  // ← This completes normalization.

		return $wrappers . $path . // `$wrappers` + normalized `$path` (+ possible trailing slash).
			( ! empty( $_d[ 'append:trailing-slash' ] ) && ( ! $wrappers || '' !== $path ) ? '/' : '' );
	}

	/**
	 * Checks if path may have wrappers.
	 *
	 * @since 2021-12-30
	 *
	 * @param string $path Path to check.
	 * @param array  $_d   Internal use only — do not pass.
	 *
	 * @return bool True if path may have wrappers.
	 *
	 * @see   \Clever_Canyon\Utilities\Fs::may_have_wrappers()
	 */
	public static function may_have_wrappers( string $path, array $_d = [] ) : bool {
		if ( empty( $_d[ 'skip:str_replace' ] ) ) {
			$path = str_replace( '\\', '/', $path );
		}
		return false !== mb_strpos( $path, ':' ) || '//' === mb_substr( $path, 0, 2 );
	}

	/**
	 * Gets a path's wrappers.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $path     Path to parse.
	 *
	 * @param string $rtn_type Return type. Default is ``, indicating string.
	 *                         Set to `array` to return an array of all wrappers.
	 *                         Setting this to anything other than `array` returns a string.
	 *
	 * @param array  $_d       Internal use only — do not pass.
	 *
	 * @return string|array Wrappers. Empty string|array = no wrappers.
	 *
	 * @note  This function is not URL scheme-safe. That's another set of concerns.
	 *        Therefore, don't use with `http://`, `data://` or other remote protocols.
	 *
	 * @see   D\Fs::normalize()
	 * @see   D\Fs::split_wrappers()
	 *
	 * @see   https://regex101.com/r/elgxgZ/8
	 * @see   https://www.php.net/manual/en/wrappers.php
	 *
	 * @see   https://o5p.me/PnKPmm
	 * @see   https://o5p.me/llPqdv
	 * @see   https://o5p.me/z52z8j
	 * @see   https://stackoverflow.com/a/21194605/1219741
	 *
	 * @see   \Clever_Canyon\Utilities\Fs::wrappers()
	 */
	public static function wrappers( string $path, string $rtn_type = '', array $_d = [] ) /* : string|array */ {
		if ( empty( $_d[ 'bypass:may_have_wrappers' ] ) && false === D\Fs::may_have_wrappers( $path ) ) {
			return 'array' === $rtn_type ? [] : '';
		}
		if ( empty( $_d[ 'bypass:normalize' ] ) ) {
			$path = D\Fs::normalize( $path );
		}
		if ( preg_match( D\Fs::$path_wrappers_regexp, $path, $_m ) ) {
			return 'array' === $rtn_type ? D\Fs::split_wrappers( $_m[ 0 ] ) : $_m[ 0 ];
		}
		return 'array' === $rtn_type ? [] : '';
	}

	/**
	 * Splits a string of wrappers into an array.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $wrappers String of wrappers from {@see D\Fs::wrappers()}.
	 *
	 * @return array An array of all wrappers, in sequence.
	 *
	 * @see   D\Fs::wrappers()
	 * @see   D\Fs::normalize()
	 *
	 * @see   \Clever_Canyon\Utilities\Fs::split_wrappers()
	 */
	public static function split_wrappers( string $wrappers ) : array {
		return preg_split( D\Fs::$path_wrappers_split_regexp, $wrappers, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE );
	}
}
