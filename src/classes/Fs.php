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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Filesystem utilities.
 *
 * @since 2021-12-15
 */
final class Fs extends U\A6t\Stc_Utilities {
	/**
	 * Resolves and normalizes path (symlinks *not* resolved).
	 *
	 * @since 2022-01-15
	 *
	 * @param string $path Path to parse.
	 *
	 * @throws U\Fatal_Exception On failure; {@see U\Fs::normalize()}.
	 * @return string Absolute path normalized (symlinks *not* resolved).
	 *
	 * @note  This expands to absolute path. It is CWD-aware, but not filesystem-aware.
	 *        Therefore, the absolute path it returns may or may not *actually* exist.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::abs()
	 */
	public static function abs( string $path ) : string {
		return U\Fs::normalize( $path, [ 'resolve:relative-path' => true ] );
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
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::realize()
	 */
	public static function realize( string $path ) : string {
		return false !== ( $rp = realpath( $path ) ) ? U\Fs::normalize( $rp ) : '';
	}

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
			&& null !== ( $cache = &static::cache( [ __FUNCTION__, $path, $_d ] ) ) ) {
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
			$_last_wrapper_file_to_no_cwd_wrappers  = $wrappers && ! $cwd_wrappers && 'file://' === $last_wrapper;
			$_last_wrapper_to_matching_cwd_wrappers = $wrappers && $cwd_wrappers && $last_wrapper === $cwd_wrappers;
			$_no_wrappers_to_compat_cwd_wrappers    = ! $wrappers && $cwd_wrappers && preg_match( '/^(?:\/{2}|[a-z]{1}\:)$/ui', $cwd_wrappers );

			$_have_compatible_wrappers_to_cwd_wrappers = // Any of the following scenarios are compatible.
				$_no_wrappers_to_no_cwd_wrappers           // Don't need to worry about wrappers.
				|| $_last_wrapper_file_to_no_cwd_wrappers  // Use the already-compatible `$last_wrapper`.
				|| $_last_wrapper_to_matching_cwd_wrappers // Use the already-compatible `$last_wrapper`.
				|| $_no_wrappers_to_compat_cwd_wrappers;   // Use `$cwd_wrappers` and renormalize.

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
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::may_have_wrappers()
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
	 * @see   U\Fs::normalize()
	 * @see   U\Fs::split_wrappers()
	 *
	 * @see   https://regex101.com/r/elgxgZ/8
	 * @see   https://www.php.net/manual/en/wrappers.php
	 *
	 * @see   https://o5p.me/PnKPmm
	 * @see   https://o5p.me/llPqdv
	 * @see   https://o5p.me/z52z8j
	 * @see   https://stackoverflow.com/a/21194605/1219741
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::wrappers()
	 */
	public static function wrappers( string $path, string $rtn_type = '', array $_d = [] ) /* : string|array */ {
		if ( empty( $_d[ 'bypass:may_have_wrappers' ] ) && false === U\Fs::may_have_wrappers( $path ) ) {
			return 'array' === $rtn_type ? [] : '';
		}
		if ( empty( $_d[ 'bypass:normalize' ] ) ) {
			$path = U\Fs::normalize( $path );
		}
		if ( preg_match( U\Con::PATH_WRAPPERS_REGEXP, $path, $_m ) ) {
			return 'array' === $rtn_type ? U\Fs::split_wrappers( $_m[ 0 ] ) : $_m[ 0 ];
		}
		return 'array' === $rtn_type ? [] : '';
	}

	/**
	 * Splits a string of wrappers into an array.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $wrappers String of wrappers from {@see U\Fs::wrappers()}.
	 *
	 * @return array An array of all wrappers, in sequence.
	 *
	 * @see   U\Fs::wrappers()
	 * @see   U\Fs::normalize()
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::split_wrappers()
	 */
	public static function split_wrappers( string $wrappers ) : array {
		return preg_split( U\Con::PATH_WRAPPERS_SPLIT_REGEXP, $wrappers, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE );
	}

	/**
	 * Gets path type.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to check.
	 *
	 * @return string One of `link`, `dir`, `file`, or `` (nonexistent).
	 *
	 * @note  A `link` may or may not point to a location that exists.
	 *       i.e., A link can exist, but be broken; {@see U\Fs::real_type()}.
	 */
	public static function type( string $path ) : string {
		if ( is_link( $path ) ) {
			return 'link';
		}
		if ( is_dir( $path ) ) {
			return 'dir';
		}
		if ( is_file( $path ) ) {
			return 'file';
		}
		return ''; // Nonexistent path.
	}

	/**
	 * Gets real path type.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to check.
	 *
	 * @return string One of `dir`, `file`, `broken-link`, or `` (nonexistent).
	 *
	 * @note  The difference here is the order of the FS checks.
	 *        Instead of checking for a link first, we attempt to resolve
	 *        to `dir`, `file`, and then if it's a link, it's a `broken-link`.
	 */
	public static function real_type( string $path ) : string {
		if ( is_dir( $path ) ) {
			return 'dir';
		}
		if ( is_file( $path ) ) {
			return 'file';
		}
		if ( is_link( $path ) ) {
			return 'broken-link';
		}
		return ''; // Nonexistent path.
	}

	/**
	 * Gets a path's permissions.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path  Path.
	 * @param bool   $octal Return octal representation? Default is `false`.
	 *
	 * @return int|string Permissions.
	 */
	public static function perms( string $path, bool $octal = false ) /* : int|string */ {
		$perms = 0; // Initialize.

		if ( file_exists( $path ) ) {
			$perms = fileperms( $path );
		}
		return $octal ? mb_substr( sprintf( '%o', $perms ), -4 ) : $perms;
	}

	/**
	 * Filesystem path exists?
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to check.
	 *
	 * @return bool True if filesystem path exists.
	 *
	 * @see   https://www.php.net/manual/en/function.file-exists.php
	 * @note  A path is different from a file or directory in this context.
	 *        {@see file_exists()} returns `false` for symlinks pointing to nonexistent paths.
	 *        This returns `true` if it exists in any way, even if it's a broken symlink.
	 */
	public static function exists( string $path ) : bool {
		return file_exists( $path ) || is_link( $path );
	}

	/**
	 * Copies one path to another path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $from_path         Path to copy.
	 *                                       Note: If this ends with `/*`, the contents of `$from_path` will be copied to
	 *                                       the contents of `$to_path`, such that a merge into `$to_path` occurs;
	 *                                       i.e., instead of deleting & replacing `$to_path` entirely.
	 *
	 * @param string      $to_path           Destination path.
	 *
	 * @param array       $ignore            Array of regex expressions to ignore; i.e., not copy.
	 * @param array       $exceptions        Array of regex expressions to not ignore (i.e., exceptions to the ignore list).
	 *
	 * @param string|null $base_path         Base path, which gets stripped prior to regex matching. Defaults to `$from_path`.
	 *                                       Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param bool        $follow_symlinks   Follow symlinks? Default is `true`.
	 *
	 * @param int         $to_path_dir_perms Defaults to `0700`.
	 *                                       If `$to_path`'s parent directories do not exist, they'll be created automatically.
	 *                                       This establishes the permissions for those newly created directories, when/if applicable.
	 *
	 * @param object|null $_r                Internal use only — do not pass.
	 *
	 * @throws U\Fatal_Exception If attempting to copy into self, leading to an infinite loop.
	 * @throws U\Fatal_Exception If a circular symlink is detected, leading to an infinite loop.
	 *
	 * @return bool True if copied successfully.
	 */
	public static function copy(
		string $from_path,
		string $to_path,
		array $ignore = [],
		array $exceptions = [],
		/* string|null */ ?string $base_path = null,
		bool $follow_symlinks = true,
		int $to_path_dir_perms = 0700,
		/* object|null */ ?object $_r = null
	) : bool {
		// Check recursion.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [ 'cycle_stack' => [] ];

		// Copy directory contents check.

		if ( ! $is_recursive && '/*' === mb_substr( $from_path, -2 ) ) {
			return U\Fs::copy_dir_contents_helper(
				mb_substr( $from_path, 0, -2 ),
				$to_path,
				$ignore,
				$exceptions,
				$base_path,
				$follow_symlinks,
				$to_path_dir_perms,
			);
		}
		// `$from_path` validation.

		$from_path       = U\Fs::normalize( $from_path );
		$from_path_type  = U\Fs::type( $from_path );
		$from_path_perms = U\Fs::perms( $from_path );

		if ( ! $from_path_type ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			return false; // Not possible.
		}
		$real_from_path = U\Fs::realize( $from_path );

		if ( ! $real_from_path ) {
			return false; // Not possible.
		}
		// `$base_path` validation.

		if ( ! $is_recursive ) {
			$base_path ??= $from_path;
			$base_path = U\Fs::normalize( $base_path );
		}
		// `$from_base_subpath` validation.

		$from_base_subpath = U\Dir::subpath( $base_path, $from_path );

		// `$to_path` validation.

		$to_path      = U\Fs::normalize( $to_path );
		$to_path_type = U\Fs::type( $to_path );

		if ( ! $to_path ) {
			return false; // Not possible.
		}
		// This may or may not exist, so fall back on `$to_path`.
		$real_to_path = $to_path_type ? U\Fs::realize( $to_path ) : $to_path;

		if ( ! $real_to_path ) {
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			$_rtps             = U\Dir::subpath( $base_path, $to_path, false );
			$_will_ignore_rtps = false !== $_rtps && $ignore && U\Str::preg_match_in( $ignore, $_rtps );
			$_will_ignore_rtps = $_will_ignore_rtps && ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $_rtps ) );

			// ↑ Goal is to determine if the root `$to_path` is within the `$base_path`; i.e., if {@see U\Dir::subpath()} generation works.
			// Then take the root `$to_path` subpath (i.e., rtps) and check if that subpath will be ignored while traversing `$from_path`.
			// If so, then one of the tests below can be bypassed safely. Calculating this one time, saves a little time.

			$_r->root_real_to_path = $real_to_path;
			$_r->will_ignore_rtps  = $_will_ignore_rtps;
		}
		// `$to_path_dir` validation.

		$to_path_dir      = U\Dir::name( $to_path );
		$to_path_dir_type = U\Fs::type( $to_path_dir );

		if ( $to_path_dir_type && ! is_writable( $to_path_dir ) ) {
			return false; // Not possible.
		}
		// Are we ignoring this `$from_base_subpath`?

		if ( '' !== $from_base_subpath && $ignore && U\Str::preg_match_in( $ignore, $from_base_subpath ) ) {
			if ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $from_base_subpath ) ) {
				return true; // Ignoring.
			}
		}
		// After checking ignores, are we attempting to copy into self?
		// The examples given are caught because we're copying recursively `$from_path` and into `$to_path`.
		// Also, because `$to_path` is deleted prior to copying, which means we can't copy from it!

		// e.g., from: /foo/bar/foo, to: /foo               (invalid: /foo ...includes /foo/bar/foo).
		// e.g., from: /foo/bar/foo, to: /foo/bar/foo/bar   (invalid: /foo/bar/foo ...includes /foo/bar/foo/bar).

		if ( preg_match( '/^' . U\Str::esc_reg( $_r->root_real_to_path ) . '(?:$|\/)/u', $real_from_path ) ) {
			throw new U\Fatal_Exception(
				'Attempting to copy into self. Cannot continue as this results in an infinite loop.' .
				' The root to-path is also deleted recursively prior to copying. So not possible to copy from it!' .
				' From: `' . $real_from_path . '`; while considering root to-path: `' . $_r->root_real_to_path . '`.'
			);
		} elseif ( ! $_r->will_ignore_rtps && preg_match( '/^' . U\Str::esc_reg( $real_from_path ) . '(?:$|\/)/u', $real_to_path ) ) {
			throw new U\Fatal_Exception(
				'Attempting to copy into self. Cannot continue as this results in an infinite loop.' .
				' From: `' . $real_from_path . '`, to: `' . $real_to_path . '`.'
			);
		}
		// `$to_path` deletion before copy.

		if ( $to_path_type && ! U\Fs::delete( $to_path ) ) {
			return false; // Not possible.
		}
		// `$to_path_dir` creation.

		if ( ! $to_path_dir_type && ! U\Dir::make( $to_path_dir, $to_path_dir_perms, true ) ) {
			return false; // Not possible.
		}
		// Link copy.

		if ( 'link' === $from_path_type && ! $follow_symlinks ) {
			return symlink( $real_from_path, $to_path );
		}
		// File copy.

		if ( 'file' === $from_path_type || ( 'link' === $from_path_type && $follow_symlinks && is_file( $from_path ) ) ) {
			return copy( $from_path, $to_path ) && chmod( $to_path, $from_path_perms );
		}
		// Recursive directory copy.

		if ( 'link' === $from_path_type && in_array( $real_from_path, $_r->cycle_stack, true ) ) {
			throw new U\Fatal_Exception(
				'Copy failure. Circular link: `' . $from_path . '` points to: `' . $real_from_path . '`,' .
				' which is currently being traversed. Following this link would result in an infinite loop.'
			);
		} else {
			$_r->cycle_stack[] = $real_from_path;
		}
		if ( ! mkdir( $to_path, $from_path_perms ) ) {
			return false; // Not possible.
		}
		if ( ! ( $_from_path_opendir = opendir( $from_path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_from_path = U\Dir::join( $from_path, '/' . $_subpath );
			$_to_path   = U\Dir::join( $to_path, '/' . $_subpath );

			if ( ! U\Fs::copy( $_from_path, $_to_path, $ignore, $exceptions, $base_path, $follow_symlinks, $to_path_dir_perms, $_r ) ) {
				closedir( $_from_path_opendir );
				return false;
			}
		}
		closedir( $_from_path_opendir );
		array_pop( $_r->cycle_stack );
		return true;
	}

	/**
	 * Helps copy contents of one directory to contents of another directory.
	 *
	 * Do NOT call this directly. Instead, use {@see U\Fs::copy()} with `/*` on the end of `$from_path`.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $from_path         Directory to copy.
	 * @param string      $to_path           Destination directory.
	 *
	 * @param array       $ignore            Array of regex expressions to ignore; i.e., not copy.
	 * @param array       $exceptions        Array of regex expressions to keep (i.e., exceptions to the ignore list).
	 *
	 * @param string|null $base_path         Base path, which gets stripped prior to regex matching. Defaults to `$from_path`.
	 *                                       Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param bool        $follow_symlinks   Follow symlinks? Default is `true`.
	 *
	 * @param int         $to_path_dir_perms Defaults to `0700`.
	 *                                       If `$to_path`'s parent directories do not exist, they'll be created automatically.
	 *                                       This establishes the permissions for those newly created directories, when/if applicable.
	 *
	 * @return bool True if copied successfully.
	 */
	protected static function copy_dir_contents_helper(
		string $from_path,
		string $to_path,
		array $ignore = [],
		array $exceptions = [],
		/* string|null */ ?string $base_path = null,
		bool $follow_symlinks = true,
		int $to_path_dir_perms = 0700
	) : bool {
		// `$from_path` validation.

		if ( ! is_dir( $from_path ) ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			return false; // Not possible.
		}
		$base_path ??= $from_path;
		$base_path = U\Fs::normalize( $base_path );

		// `$to_path` validation.

		if ( ! $to_path ) {
			return false; // Not possible.
		}
		// Copy directory contents.

		if ( ! ( $_from_path_opendir = opendir( $from_path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_from_path = U\Dir::join( $from_path, '/' . $_subpath );
			$_to_path   = U\Dir::join( $to_path, '/' . $_subpath );

			if ( ! U\Fs::copy( $_from_path, $_to_path, $ignore, $exceptions, $base_path, $follow_symlinks, $to_path_dir_perms ) ) {
				closedir( $_from_path_opendir );
				return false;
			}
		}
		closedir( $_from_path_opendir );
		return true;
	}

	/**
	 * Zip one path into another path (`zip` extension required).
	 *
	 * @since        2021-12-15
	 *
	 * @param string      $from_path         Path to zip.
	 * @param string      $to_path           Destination path.
	 *
	 * @param array       $ignore            Array of regex expressions to ignore; i.e., not add to zip.
	 * @param array       $exceptions        Array of regex expressions to not ignore (i.e., exceptions to the ignore list).
	 *
	 * @param string|null $base_path         Base path, which gets stripped prior to regex matching. Defaults to `$from_path`.
	 *                                       Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param bool        $follow_symlinks   Follow symlinks? Default is `true`. This should almost always be `true` for zip files.
	 *                                       If `false`, symlinks are not followed. Instead, empty directories and/or files are created
	 *                                       to hold the place of what would otherwise have been followed and copied into the zip archive.
	 *                                       Thus, it is recommended to always leave this as `true` unless there is a very special case.
	 *
	 * @param int         $to_path_dir_perms Defaults to `0700`.
	 *                                       If `$to_path`'s parent directory does not exist, it will be created automatically.
	 *                                       This establishes the permissions for that newly created directory, when/if applicable.
	 *
	 * @param object|null $_r                Internal use only — do not pass.
	 *
	 * @throws U\Fatal_Exception If `ZipArchive` extension is missing.
	 * @throws U\Fatal_Exception If attempting to zip into self, leading to an infinite loop.
	 * @throws U\Fatal_Exception If a circular symlink is detected, leading to an infinite loop.
	 *
	 * @return bool True if zipped successfully.
	 *
	 * @noinspection PhpComposerExtensionStubsInspection
	 */
	public static function zip_er(
		string $from_path,
		string $to_path,
		array $ignore = [],
		array $exceptions = [],
		/* string|null */ ?string $base_path = null,
		bool $follow_symlinks = true,
		int $to_path_dir_perms = 0700,
		/* object|null */ ?object $_r = null
	) : bool {
		// Recursive check.

		$is_recursive = isset( $_r );

		// Dependency check.

		if ( ! $is_recursive && ! U\Env::can_use_extension( 'zip' ) ) {
			throw new U\Fatal_Exception( 'Missing PHP `zip` extension.' );
		}
		// Recursive class initialization.

		if ( ! $is_recursive ) {
			$_r = ( new class extends U\A6t\Generic {
				/**
				 * Maybe close zip file.
				 *
				 * @param bool $is_recursive Set `true` in recursive calls.
				 *
				 * @return bool True if recursive, zip not open, or zip closes.
				 */
				public function maybe_close_zip( bool $is_recursive ) : bool {
					return $is_recursive || ! isset( $this->zip )
						|| ! is_object( $this->zip )
						|| $this->zip->close();
				}
			} );
			// Initialize.
			$_r->cycle_stack = [];
		}
		// `$from_path` validation.

		$from_path = U\Fs::normalize( $from_path );

		if ( ! $is_recursive ) {
			if ( preg_match( '/-\>([^\/]+)$/u', $from_path, $_m ) ) {
				$_r->root_from_path_basename = basename( $_m[ 1 ] );
				$from_path                   = preg_replace( '/-\>([^\/]+)$/u', '', $from_path );
			} else {
				$_r->root_from_path_basename = basename( $from_path );
			}
		} // Now get type, in case of alias.
		$from_path_type = U\Fs::type( $from_path );

		if ( ! $from_path_type ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		$real_from_path = U\Fs::realize( $from_path );

		if ( ! $real_from_path ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		// `$base_path` validation.

		if ( ! $is_recursive ) {
			$base_path ??= $from_path;
			$base_path = U\Fs::normalize( $base_path );
		}
		// `$from_base_subpath` validation.

		$from_base_subpath = U\Dir::subpath( $base_path, $from_path );

		// `$to_path` validation.

		$to_path      = U\Fs::normalize( $to_path );
		$to_path_type = U\Fs::type( $to_path );

		if ( ! $to_path ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		// This may or may not exist, so fall back on `$to_path`.
		$real_to_path = $to_path_type ? U\Fs::realize( $to_path ) : $to_path;

		if ( ! $real_to_path ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			if ( 'zip' !== U\File::ext( $to_path ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
			$_rtps             = U\Dir::subpath( $base_path, $to_path, false );
			$_will_ignore_rtps = false !== $_rtps && $ignore && U\Str::preg_match_in( $ignore, $_rtps );
			$_will_ignore_rtps = $_will_ignore_rtps && ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $_rtps ) );

			// ↑ Goal is to determine if the root `$to_path` is within the `$base_path`; i.e., if {@see U\Dir::subpath()} generation works.
			// Then take the root `$to_path` subpath (i.e., rtps) and check if that subpath will be ignored while traversing `$from_path`.
			// If so, then one of the tests below can be bypassed safely. Calculating this one time, saves a little time.

			$_r->root_to_path     = $to_path;
			$_r->will_ignore_rtps = $_will_ignore_rtps;
		}
		// `$to_path_dir` validation.

		if ( ! $is_recursive ) {
			$to_path_dir      = U\Dir::name( $to_path );
			$to_path_dir_type = U\Fs::type( $to_path_dir );

			if ( $to_path_dir_type && ! is_writable( $to_path_dir ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
		}
		// `$to_path_in_zip` validation.

		$to_path_in_zip    = '/' . $_r->root_from_path_basename;
		$to_subpath_in_zip = U\Dir::subpath( $_r->root_to_path, $to_path );
		$to_path_in_zip    = U\Dir::join( $to_path_in_zip, '/' . $to_subpath_in_zip );

		// Are we ignoring this `$from_base_subpath`?

		if ( '' !== $from_base_subpath && $ignore && U\Str::preg_match_in( $ignore, $from_base_subpath ) ) {
			if ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $from_base_subpath ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return true; // Ignoring.
			}
		}
		// After checking ignores, are we attempting to zip into self?
		// The examples given are caught because we're copying recursively `$from_path`.

		// From: /foo/bar/foo, to: /foo/bar/foo/bar[/foo.zip]     (invalid: /foo/bar/foo ...includes /foo/bar/foo/bar).
		// From: /foo, to: /foo/bar[/foo.zip]                     (invalid: /foo ...includes /foo/bar).

		if ( ! $_r->will_ignore_rtps && preg_match( '/^' . U\Str::esc_reg( $real_from_path ) . '(?:$|\/)/u', $real_to_path ) ) {
			$_r->maybe_close_zip( $is_recursive );
			throw new U\Fatal_Exception(
				'Attempting to zip into self. Cannot continue as this results in an infinite loop.' .
				' From: `' . $real_from_path . '`, to: `' . $real_to_path . '`.'
			);
		}
		// `$to_path` deletion ahead of zip.

		if ( ! $is_recursive ) {
			if ( $to_path_type && ! U\Fs::delete( $to_path ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
		}
		// `$to_path_dir` directory creation.

		if ( ! $is_recursive ) {
			if ( ! $to_path_dir_type && ! U\Dir::make( $to_path_dir, $to_path_dir_perms, true ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
		}
		// Zip archive.

		if ( ! $is_recursive ) {
			$_r->zip = new \ZipArchive();
			if ( true !== $_r->zip->open( $to_path, \ZipArchive::CREATE | \ZipArchive::OVERWRITE ) ) {
				return false; // Not possible.
			}
		}
		// Link zip.

		if ( 'link' === $from_path_type && ! $follow_symlinks ) {
			return true === $_r->zip->addFromString( $to_path_in_zip, '' )
				&& $_r->maybe_close_zip( $is_recursive );
		}
		// File zip.

		if ( 'file' === $from_path_type || ( 'link' === $from_path_type && $follow_symlinks && is_file( $from_path ) ) ) {
			return true === $_r->zip->addFile( $from_path, $to_path_in_zip )
				&& $_r->maybe_close_zip( $is_recursive );
		}
		// Recursive directory zip.

		if ( 'link' === $from_path_type && in_array( $real_from_path, $_r->cycle_stack, true ) ) {
			throw new U\Fatal_Exception(
				'Zip failure. Circular link: `' . $from_path . '` points to: `' . $real_from_path . '`,' .
				' which is currently being traversed. Following this link would result in an infinite loop.'
			);
		} else {
			$_r->cycle_stack[] = $real_from_path;
		}
		if ( true !== $_r->zip->addEmptyDir( $to_path_in_zip ) ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! ( $_from_path_opendir = opendir( $from_path ) ) ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_from_path = U\Dir::join( $from_path, '/' . $_subpath );
			$_to_path   = U\Dir::join( $to_path, '/' . $_subpath );

			if ( ! U\Fs::zip_er( $_from_path, $_to_path, $ignore, $exceptions, $base_path, $follow_symlinks, $to_path_dir_perms, $_r ) ) {
				closedir( $_from_path_opendir );
				$_r->maybe_close_zip( $is_recursive );
				return false;
			}
		}
		closedir( $_from_path_opendir );
		array_pop( $_r->cycle_stack );
		return $_r->maybe_close_zip( $is_recursive );
	}

	/**
	 * Deletes a path recursively (by default).
	 *
	 * @since 1.0.0
	 *
	 * @param string      $path           Path to delete.
	 * @param bool        $recursively    Recursively? Default is `true`.
	 *
	 * @param bool        $x_confirmation Added confirmation. Default is `false`.
	 *                                    This is needed when attempting to delete the root of anything.
	 *
	 * @param object|null $_r             Internal use only — do not pass.
	 *
	 * @return bool True if deleted successfully.
	 *
	 * @note  This intentionally does not follow symlinks. It deletes them.
	 *        A link is just a link. This does not recurse into symlinked directories.
	 *
	 * @note  After reviewing PHP source code, confirming {@see unlink()} and {@see rmdir()}
	 *        both fire {@see clearstatcache()} whenever a directory and/or file is deleted.
	 *        So not necessary to do that here.
	 */
	public static function delete(
		string $path,
		bool $recursively = true,
		bool $x_confirmation = false,
		/* object|null */ ?object $_r = null
	) : bool {
		// Recursive check.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// `$path` validation.

		$path      = U\Fs::normalize( $path );
		$path_type = U\Fs::type( $path );

		if ( ! $path || ! $path_type ) {
			return true; // No longer exists.
		}
		if ( ! $x_confirmation && '' === trim( $path, '/' ) ) {
			// Refuse when we're missing added confirmation.
			return false; // Don't destroy the root of anything.
		}
		if ( ! $is_recursive && ! $x_confirmation
			&& U\Fs::may_have_wrappers( $path, [ 'skip:str_replace' => true ] )
		) {
			$wrappers = U\Fs::wrappers( $path, 'string', [
				'bypass:may_have_wrappers' => true,
				'bypass:normalize'         => true,
			] );
			if ( $wrappers ) { // Let's take a closer look.
				$wrappers         = mb_strtolower( $wrappers );
				$path_no_wrappers = mb_substr( $path, mb_strlen( $wrappers ) );
				$last_wrapper     = U\Arr::value_last( U\Fs::split_wrappers( $wrappers ) );

				if ( ! $path_no_wrappers || '' === trim( $path_no_wrappers, '/' ) ) {
					// Refuse when we're missing added confirmation.
					return false; // Don't destroy the root of anything.
				}
				if ( false === mb_strpos( trim( $path_no_wrappers, '/' ), '/' )
					&& preg_match( '/^(?:\/{2}|(?:s3|php|http|data|expect|ssh2\.tunnel)\:\/{2})$/ui', $last_wrapper ) ) {
					// Must have `foo/bar` at minimum. Refuse when we're missing added confirmation.
					return false; // Don't destroy the root of anything.
				}
			} // End `$wrappers` check from above.
		}
		// If it's not writable, and it's a link, then it's possibly a broken link.
		// We skip over it here and instead let the next section handle link deletion.

		if ( ! is_writable( $path ) && 'link' !== $path_type ) {
			return false; // Not possible.
		}
		// Link, file, and non-recursive directory deletion.

		if ( ! $recursively || in_array( $path_type, [ 'link', 'file' ], true ) ) {
			if ( 'link' === $path_type && U\Env::is_windows() ) {
				return rmdir( $path ); // Link removal requires {@see rmdir()} on Windows.
			}
			return 'dir' === $path_type ? rmdir( $path ) : unlink( $path );
		}
		// Recursive directory deletion.

		if ( ! ( $_path_opendir = opendir( $path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_path = U\Dir::join( $path, '/' . $_subpath );

			if ( ! U\Fs::delete( $_path, $recursively, $x_confirmation, $_r ) ) {
				closedir( $_path_opendir );
				return false;
			}
		}
		closedir( $_path_opendir );
		return rmdir( $path );
	}

	/**
	 * Regexp with `.gitignore` exclusions as a positive|negative lookahead pattern.
	 *
	 * @since 2021-12-18
	 *
	 * @param string      $lookahead       One of `positive` or `negative`.
	 *                                     This indicates whether you want a positive or negative lookahead.
	 *
	 * @param string|null $regexp_fragment Optional regexp fragment to append to generated full regexp pattern.
	 *                                     Default is `.+$`. You get back simply the lookahead pattern in front of `.+$`.
	 *
	 * @param array       $args            Optional arguments that offer some additional options.
	 *
	 *    string 'modifiers'      Optional additional modifiers to append to existing always-on modifiers.
	 *                            Always-on modifiers include `ui`. If you pass in conflicting modifiers, future versions
	 *                            of this function will throw an exception if they cause conflict with this function's objectives.
	 *
	 *    bool   'vendor'         Default is `true`, as ignoring `/vendor` matches our `.gitignore` configuration.
	 *                            That said, it's often desirable to ship `/vendor` as part of a distro, so the option is here.
	 *
	 *    string 'except:vendor/' Default is ``. When `vendor` is `true`, this adds one or more exceptions.
	 *                            e.g., `[ 'except:vendor/' => 'clevercanyon' ]`.
	 *                            e.g., `[ 'except:vendor/' => '(?:clevercanyon|acme)' ]`.
	 *
	 * @return string Final regexp with `.gitignore` exclusions as a positive|negative lookahead.
	 *                The pattern is a non-capturing positive|negative lookahead for greatest flexibility.
	 *
	 * @see   https://regex101.com/r/yceJKL/1
	 * @see   https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php
	 */
	public static function gitignore_regexp_lookahead(
		string $lookahead,
		/* string|null */ ?string $regexp_fragment = null,
		array $args = []
	) : string {
		$regexp_fragment ??= '.+$';

		$default_args = [
			'modifiers'      => '',
			'vendor'         => true,
			'except:vendor/' => '',
		];
		$args         = $args + $default_args;

		$modifiers = mb_str_split( $args[ 'modifiers' ] );
		$modifiers = array_unique( array_merge( [ 'u', 'i' ], $modifiers ) );
		$modifiers = implode( '', $modifiers ); // Back together again.

		$re = '';    // Initialize for string concatenation.
		$re .= '/^'; // Beginning of line, or file path, in this case.

		$re .= '    (' . ( 'positive' === $lookahead ? '?=' : '?!' );
		$re .= '        .*';             // 0+ characters leading up to matching `.gitignore` entries.
		$re .= '        (?:^|[\/\\\]+)'; // Beginning of string or 1+ directory separators.
		$re .= '        (?:';            // Begin list of matching `.gitignore` entries.

		$re .= '            (?:\.[#_~][^\/\\\]*)'; // `.#*`, `._*`, `.~*`
		$re .= '             |(?:[^\/\\\]*~)';     // `*~` backup files.

		// This covers all ignored file extensions.
		$re .= '             |(?:[^\/\\\]*\.(?:log|bak|rej|orig|patch|diff|sublime-project|sublime-workspace|nbproject|code-workspace|ctags|tags))';

		// This covers all ignored dotfiles; i.e., names beginning with a `.`.
		$re .= '             |(?:\.(?:vagrant|idea|vscode|npmrc|yarnrc|yarn|linaria-cache|sass-cache|elasticbeanstalk|git|git-dir|svn|cvsignore|bzr|bzrignore|hg|hgignore|AppleDB|AppleDouble|AppleDesktop|com\.apple\.timemachine\.donotpresent|LSOverride|Spotlight-V100|VolumeIcon\.icns|TemporaryItems|fseventsd|DS_Store|Trashes|apdisk))';

		// This covers everything else, which is a longer list of specific names to ignore.
		$re .= '             |(?:typings' . ( $args[ 'vendor' ] ? '|vendor' . ( $args[ 'except:vendor/' ] ? '(?![\/\\\]+' . $args[ 'except:vendor/' ] . '[\/\\\]+)' : '' ) : '' ) . '|node[_\-]modules|jspm[_\-]packages|bower[_\-]components|_svn|CVS|SCCS|RCS|\$RECYCLE\.BIN|Desktop\.ini|Thumbs\.db|ehthumbs\.db|Network\sTrash\sFolder|Temporary\sItems|Icon[^s])';

		$re .= '        )';              // End list of matching `.gitignore` entries.
		$re .= '        (?:$|[\/\\\]+)'; // End of line, or 1+ directory separators.

		$re .= '    )'; // End lookahead group.

		$re .= $regexp_fragment; // Appends a regular expression fragment onto all of the above.
		$re .= '/' . $modifiers; // Ends regular expression and adds modifiers, including any custom modifiers.

		return preg_replace( '/\s+/u', '', $re ); // Removes whitespace from pattern.
	}

	/**
	 * Regexp with `.gitignore` exclusions as a positive lookahead pattern, for PHPCS/PHPCBF tools.
	 *
	 * @since 2021-12-18
	 *
	 * @param string $base_path The PHPCS/PHPCBF tools treat `--ignore=` patterns as absolute path checks.
	 *                          We can force them to be treated as relative path checks by prefixing
	 *                          our pattern with a base path that we're giving to these tools.
	 *
	 * @param array  $args      Optional arguments that offer some additional options.
	 *
	 *    bool   'vendor'         Default is `true`, as ignoring `/vendor` matches our `.gitignore` configuration.
	 *                            That said, it's often desirable to ship `/vendor` as part of a distro, so the option is here.
	 *
	 *    string 'except:vendor/' Default is ``. When `vendor` is `true`, this adds one or more exceptions.
	 *                            e.g., `[ 'except:vendor/' => 'clevercanyon' ]`.
	 *                            e.g., `[ 'except:vendor/' => '(?:clevercanyon|acme)' ]`.
	 *
	 * @return string Final regexp with `.gitignore` exclusions as a positive lookahead.
	 *                The pattern is a non-capturing positive lookahead for greatest flexibility.
	 *
	 * @note  Regarding PHPCS/PHPCBF tools. {@see https://git.io/J9nrw}.
	 *
	 *        In PHPCS/PHPCBF, `*` is auto-expanded into `.*` at runtime.
	 *        Unescaped commas are pattern delimiters. To get a real comma, must escape: `\\,`.
	 *
	 *        Directory separators, on Windows, are replaced with `\\` on-the-fly at runtime, so use only `/` here.
	 *        The regular expression pattern is encapsulated by `backticks`i at runtime and uses an `i` modifier only.
	 *
	 *        Patterns that end with `/*` are tested against both directories and files. Otherwise, files only.
	 *        A `/*` on the end of the pattern is replaced by `(?=/|$)` at runtime.
	 */
	public static function gitignore_phpcs_regexp_lookahead_positive( string $base_path, array $args = [] ) : string {
		$lookahead       = 'positive';
		$regexp_fragment = '.+/*'; // `/*` becomes `(?=/|$)`.

		$default_args = [
			'vendor'         => true,
			'except:vendor/' => '',
		];
		$args         = $args + $default_args;

		$re = '';   // Initialize for string concatenation.
		$re .= U\Str::esc_reg( U\Fs::normalize( $base_path ), '`' );

		$re .= '^'; // Beginning of line, or file path, in this case.

		$re .= '    (' . ( 'positive' === $lookahead ? '?=' : '?!' );
		$re .= '        *';        // 0+ characters leading up to matching `.gitignore` entries.
		$re .= '        (?:^|/+)'; // Beginning of string or 1+ directory separators.
		$re .= '        (?:';      // Begin list of matching `.gitignore` entries.

		$re .= '            (?:\.[#_~][^/]{0\\,})'; // `.#*`, `._*`, `.~*`
		$re .= '             |(?:[^/]{0\\,}~)';     // `*~` backup files.

		// This covers all ignored file extensions.
		$re .= '             |(?:[^/]{0\\,}\.(?:log|bak|rej|orig|patch|diff|sublime-project|sublime-workspace|nbproject|code-workspace|ctags|tags))';

		// This covers all ignored dotfiles; i.e., names beginning with a `.`.
		$re .= '             |(?:\.(?:vagrant|idea|vscode|npmrc|yarnrc|yarn|linaria-cache|sass-cache|elasticbeanstalk|git|git-dir|svn|cvsignore|bzr|bzrignore|hg|hgignore|AppleDB|AppleDouble|AppleDesktop|com\.apple\.timemachine\.donotpresent|LSOverride|Spotlight-V100|VolumeIcon\.icns|TemporaryItems|fseventsd|DS_Store|Trashes|apdisk))';

		// This covers everything else, which is a longer list of specific names to ignore.
		$re .= '             |(?:typings' . ( $args[ 'vendor' ] ? '|vendor' . ( $args[ 'except:vendor/' ] ? '(?!/+' . $args[ 'except:vendor/' ] . '/+)' : '' ) : '' ) . '|node[_\-]modules|jspm[_\-]packages|bower[_\-]components|_svn|CVS|SCCS|RCS|\$RECYCLE\.BIN|Desktop\.ini|Thumbs\.db|ehthumbs\.db|Network\sTrash\sFolder|Temporary\sItems|Icon[^s])';

		$re .= '        )';        // End list of matching `.gitignore` entries.
		$re .= '        (?:$|/+)'; // End of line, or 1+ directory separators.

		$re .= '    )'; // End lookahead group.

		$re .= $regexp_fragment; // Appends a regular expression fragment onto all of the above.

		return preg_replace( '/\s+/u', '', $re ); // Removes whitespace from pattern.
	}
}
