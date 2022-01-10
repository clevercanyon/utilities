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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\STC;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Filesystem utilities.
 *
 * @since 2021-12-15
 */
class Fs extends \Clever_Canyon\Utilities\STC\Abstracts\A6t_Stc_Base {
	/**
	 * Normalizes a path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to parse.
	 * @param array  $_d   Internal use only — do not pass.
	 *
	 * @return string Normalized path, preserving wrappers.
	 *
	 * @note  This function is not URL scheme-safe. That's another set of concerns.
	 *        Therefore, don't use with `http://`, `data://` or other remote protocols.
	 *
	 * @see   U\Fs::wrappers() before updating this function.
	 */
	public static function normalize( string $path, array $_d = [] ) : string {
		// Normalize type of slashes.

		$path = str_replace( '\\', '/', $path );

		// Parse & temporarily remove wrappers.

		if ( ! U\Fs::may_have_wrappers( $path, [ 'skip:str_replace' => true ] ) ) {
			$wrappers = ''; // Saves time. No wrappers.
		} else {
			$wrappers = U\Fs::wrappers( $path, '', [
				'bypass:may_have_wrappers' => true,
				'bypass:normalize'         => true,
			] );
			$wrappers = $wrappers ? mb_strtolower( $wrappers ) : ''; // Normalize.
			$path     = $wrappers ? mb_substr( $path, mb_strlen( $wrappers ) ) : $path;
		}
		// Maybe join additional paths by directive.

		if ( ! empty( $_d[ 'join:paths' ] ) ) {
			$path = str_replace( '\\', '/', $path . '/' . implode( '/', $_d[ 'join:paths' ] ) );
		}
		// Reduce to single slashes after having removed wrappers and joined paths.

		$path = preg_replace( '/\/+/u', '/', $path );

		// If there are wrappers and a path, fix any obvious problems
		// with path, based on examination of it's last (innermost) wrapper.

		if ( $wrappers && '' !== $path && ( $split_wrappers = U\Fs::split_wrappers( $wrappers ) ) ) {
			if ( '/' !== $path[ 0 ] && [ 'file://' ] === $split_wrappers ) {
				$path = '/' . $path; // Force leading slash for validity.

			} elseif ( '/' === $path[ 0 ] ) {
				$last_wrapper = U\Arr::value_last( $split_wrappers );
				if (
					'file://' !== $last_wrapper // Just to make sure, as this saves time.
					&& preg_match( '/^(?:\/{2}|(?:s3|php|http|data|expect|ssh2\.tunnel)\:\/{2})$/ui', $last_wrapper )
				) {
					$path = ltrim( $path, '/' ); // Strip leading slash.
				}
			}
		} // Complete path normalization and return now.

		if ( '/' === $path ) {        // Nothing more to do here.
			return $wrappers . $path; // Wrappers + normalized path.
		}
		$path = rtrim( $path, '/' );  // ← This completes normalization.

		return $wrappers . $path . // Wrappers + normalized path (+ possible trailing slash).
			( ! empty( $_d[ 'append:trailing-slash' ] ) && ( ! $wrappers || '' !== $path ) ? '/' : '' );
	}

	/**
	 * Checks if path may have wrappers.
	 *
	 * @since 2021-12-30
	 *
	 * @param string $path Paath to check.
	 * @param array  $_d   Internal use only — do not pass.
	 *
	 * @return bool True if path may have wrappers.
	 */
	public static function may_have_wrappers( string $path, array $_d = [] ) : bool {
		$path = ! empty( $_d[ 'skip:str_replace' ] ) ? $path : str_replace( '\\', '/', $path );
		return '//' === mb_substr( $path, 0, 2 ) || false !== mb_strpos( $path, ':' );
	}

	/**
	 * Gets a path's wrappers.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $path        Path to parse.
	 *
	 * @param string $return_type Return type. Default is ``, indicating string.
	 *                            Set to `array` to return an array of all wrappers.
	 *                            Setting this to anything other than `array` returns a string.
	 *
	 * @param array  $_d          Internal use only — do not pass.
	 *
	 * @return string|array Wrappers. Empty string|array = no wrappers.
	 *
	 * @note  This function is not URL scheme-safe. That's another set of concerns.
	 *        Therefore, don't use with `http://`, `data://` or other remote protocols.
	 *
	 * @see   U\Fs::normalize() carefully review before updating this function.
	 * @see   U\Fs::split_wrappers() carefully review before updating this function.
	 *
	 * @see   https://regex101.com/r/elgxgZ/8
	 * @see   https://www.php.net/manual/en/wrappers.php
	 *
	 * @see   https://o5p.me/PnKPmm
	 * @see   https://o5p.me/llPqdv
	 * @see   https://stackoverflow.com/a/21194605/1219741
	 */
	public static function wrappers( string $path, string $return_type = '', array $_d = [] ) /* : string|array */ {
		if ( empty( $_d[ 'bypass:may_have_wrappers' ] ) ) {
			if ( false === U\Fs::may_have_wrappers( $path ) ) {
				return 'array' === $return_type ? [] : '';
			}
		}
		if ( empty( $_d[ 'bypass:normalize' ] ) ) {
			$path = U\Fs::normalize( $path );
		}
		if ( preg_match( U\Con::PATH_WRAPPERS_REGEXP, $path, $_m ) ) {
			return 'array' === $return_type ? U\Fs::split_wrappers( $_m[ 0 ] ) : $_m[ 0 ];
		}
		return 'array' === $return_type ? [] : '';
	}

	/**
	 * Splits a string of wrappers into an array.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $wrappers String of wrappers from {@see wrappers()}.
	 *
	 * @return array An array of all wrappers, in sequence.
	 *
	 * @see   U\Fs::wrappers() carefully review before updating this function.
	 * @see   U\Fs::normalize() carefully review before updating this function.
	 */
	public static function split_wrappers( string $wrappers ) : array {
		return preg_split( U\Con::PATH_WRAPPERS_SPLIT_REGEXP, $wrappers, -1, PREG_SPLIT_NO_EMPTY | PREG_SPLIT_DELIM_CAPTURE );
	}

	/**
	 * Path exists?
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path.
	 *
	 * @return bool True if path exists.
	 *
	 * @see   https://www.php.net/manual/en/function.file-exists.php
	 * @note  A path is different from a file or directory in this context.
	 *       {@see file_exists()} returns `false` for symlinks pointing to non-existing files.
	 */
	public static function path_exists( string $path ) : bool {
		return file_exists( $path ) || is_link( $path );
	}

	/**
	 * Gets path type.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path.
	 *
	 * @return string One of `link`, `file`, `dir`, or ``.
	 */
	public static function type( string $path ) : string {
		if ( is_link( $path ) ) {
			return 'link';
		}
		if ( is_file( $path ) ) {
			return 'file';
		}
		if ( is_dir( $path ) ) {
			return 'dir';
		}
		return ''; // Unknown/nonexistent path.
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
	 * @throws Fatal_Exception If attempting to copy into self, leading to an endless loop.
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
		$real_from_path = realpath( $from_path );
		$real_from_path = U\Fs::normalize( (string) $real_from_path );

		if ( ! $real_from_path ) {
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			$base_path ??= $from_path;
			$base_path = U\Fs::normalize( $base_path );
		}
		$from_base_subpath = U\Dir::subpath( $base_path, $from_path );

		// `$to_path` validation.

		$to_path      = U\Fs::normalize( $to_path );
		$to_path_type = U\Fs::type( $to_path );

		if ( ! $to_path ) {
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			$real_to_path = $to_path_type ? realpath( $to_path ) : $to_path;
			$real_to_path = U\Fs::normalize( (string) $real_to_path );

			if ( ! $real_to_path ) {
				return false; // Not possible.
			}
			$_r->root_to_path      = $to_path;
			$_r->root_real_to_path = $real_to_path;
		}
		// `$to_path` directory validation.

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

		if ( 0 === mb_strpos( $real_from_path, $_r->root_real_to_path ) ) {
			throw new Fatal_Exception(
				'Attempting to copy into self. Cannot continue as this results in an endless loop.' .
				' From: `' . $real_from_path . '`, to: `' . $_r->root_real_to_path . '`.'
			);
		} elseif ( 0 === mb_strpos( $from_path, $_r->root_to_path ) ) {
			throw new Fatal_Exception(
				'Attempting to copy into self. Cannot continue as this results in an endless loop.' .
				' From: `' . $from_path . '`, to: `' . $_r->root_to_path . '`.'
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

		// @todo This doesn't seem to be effective at catching cycles.
		if ( 'link' === $from_path_type && in_array( $real_from_path, $_r->cycle_stack, true ) ) {
			// Have no choice but to not follow the symlink. It's a circular reference.
			return symlink( $real_from_path, $to_path );
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
	 * Do NOT call this directly. Instead, use {@see copy()} with `/*` on the end of `$from_path`.
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
	 * Zip one path into another path.
	 *
	 * @since 2021-12-15
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
	 *                                       If `false`, symlinks are not followed. Instead, empty directories and/or files are created to hold
	 *                                       the place of what would otherwise have been followed and copied into the zip archive. Thus,
	 *                                       recommend always leaving this as `true`.
	 *
	 * @param int         $to_path_dir_perms Defaults to `0700`.
	 *                                       If `$to_path`'s parent directory does not exist, it will be created automatically.
	 *                                       This establishes the permissions for that newly created directory, when/if applicable.
	 *
	 * @param object|null $_r                Internal use only — do not pass.
	 *
	 * @throws Fatal_Exception If `ZipArchive` extension is missing.
	 * @throws Fatal_Exception If attempting to zip into self, leading to an endless loop.
	 *
	 * @return bool True if zipped successfully.
	 */
	public static function zip(
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

		if ( ! $is_recursive && ! class_exists( 'ZipArchive' ) ) {
			throw new Fatal_Exception( 'Missing PHP `ZipArchive` extension.' );
		}
		// Recursive class initialization.

		if ( ! $is_recursive ) {
			$_r = ( new class extends A6t_Generic {
				/**
				 * Cycle stack.
				 *
				 * @since 2021-12-31
				 */
				public array $cycle_stack = [];

				/**
				 * Maybe close zip file.
				 *
				 * @since 2021-12-29
				 *
				 * @param bool $is_recursive Set `true` in recursive calls.
				 *
				 * @return bool True if recursive, zip not open, or zip closes.
				 */
				public function maybe_close_zip( bool $is_recursive ) : bool {
					return $is_recursive || ! isset( $this->zip ) || $this->zip->close();
				}
			} );
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
		$real_from_path = realpath( $from_path );
		$real_from_path = U\Fs::normalize( (string) $real_from_path );

		if ( ! $real_from_path ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			$base_path ??= $from_path;
			$base_path = U\Fs::normalize( $base_path );
		}
		$from_base_subpath = U\Dir::subpath( $base_path, $from_path );

		// `$to_path` validation.

		$to_path      = U\Fs::normalize( $to_path );
		$to_path_type = U\Fs::type( $to_path );

		if ( ! $to_path ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			$real_to_path = $to_path_type ? realpath( $to_path ) : $to_path;
			$real_to_path = U\Fs::normalize( (string) $real_to_path );

			if ( ! $real_to_path ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
			$_r->root_to_path      = $to_path;
			$_r->root_real_to_path = $real_to_path;
		}
		// `$to_path` directory validation.

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

		if ( 0 === mb_strpos( $real_from_path, $_r->root_real_to_path ) ) {
			throw new Fatal_Exception(
				'Attempting to zip into self. Cannot continue as this results in an endless loop.' .
				' From: `' . $real_from_path . '`, to: `' . $_r->root_real_to_path . '`.'
			);
		} elseif ( 0 === mb_strpos( $from_path, $_r->root_to_path ) ) {
			throw new Fatal_Exception(
				'Attempting to zip into self. Cannot continue as this results in an endless loop.' .
				' From: `' . $from_path . '`, to: `' . $_r->root_to_path . '`.'
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

		// @todo This doesn't seem to be effective at catching cycles.
		if ( 'link' === $from_path_type && in_array( $real_from_path, $_r->cycle_stack, true ) ) {
			// Have no choice but to not follow the symlink. It's a circular reference.
			return true === $_r->zip->addFromString( $to_path_in_zip, '' )
				&& $_r->maybe_close_zip( $is_recursive );
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

			if ( ! U\Fs::zip( $_from_path, $_to_path, $ignore, $exceptions, $base_path, $follow_symlinks, $to_path_dir_perms, $_r ) ) {
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
	 * Deletes a path.
	 *
	 * @since 1.0.0
	 *
	 * @param string      $path        Path to delete.
	 * @param bool        $recursively Defaults to `true`.
	 *
	 * @param object|null $_r          Internal use only — do not pass.
	 *
	 * @return bool True if deleted successfully.
	 *
	 * @note  This intentionally does not follow symlinks.
	 *        i.e., A link is just a link, so this does not recurse into symlinked directories.
	 */
	public static function delete( string $path, bool $recursively = true, /* object|null */ ?object $_r = null ) : bool {
		// Recursive check.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// `$path` validation.

		$path      = U\Fs::normalize( $path );
		$path_type = U\Fs::type( $path );

		if ( ! $path_type ) {
			return true; // No longer exists.
		}
		if ( ! $path || '' === trim( $path, '/' ) ) {
			return false; // Let's not destroy the root of something.
		}
		if ( ! $is_recursive && U\Fs::may_have_wrappers( $path, [ 'skip:str_replace' => true ] ) ) {
			$wrappers         = U\Fs::wrappers( $path, '', [
				'bypass:may_have_wrappers' => true,
				'bypass:normalize'         => true,
			] );
			$path_no_wrappers = $wrappers ? mb_substr( $path, mb_strlen( $wrappers ) ) : $path;

			if ( ! $path_no_wrappers || '' === trim( $path_no_wrappers, '/' ) ) {
				return false; // Let's not destroy the root of something.
			}
		}
		if ( ! is_writable( $path ) ) {
			// Special case.
			if ( 'link' === $path_type ) {
				try { // Broken link.
					return unlink( $path );
				} catch ( \Throwable $throwable ) {
					return false;
				}
			}
			return false; // Not possible.
		}
		// Link, file, and non-recursive directory deletion.

		if ( ! $recursively || in_array( $path_type, [ 'link', 'file' ], true ) ) {
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

			if ( ! U\Fs::delete( $_path, $recursively, $_r ) ) {
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
	 * @param array $args Optional arguments that offer some additional options.
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
	public static function gitignore_phpcs_regexp_lookahead_positive( array $args = [] ) : string {
		$lookahead       = 'positive';
		$regexp_fragment = '.+/*'; // `/*` becomes `(?=/|$)`.

		$default_args = [
			'vendor'         => true,
			'except:vendor/' => '',
		];
		$args         = $args + $default_args;

		$re = '';   // Initialize for string concatenation.
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
