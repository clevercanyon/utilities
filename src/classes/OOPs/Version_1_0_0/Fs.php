<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;

/**
 * Fs.
 *
 * @since 1.0.0
 */
class Fs extends Base {
	/**
	 * Normalizes a path.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $path Path.
	 *
	 * @return string       Noramlized path.
	 *
	 * @internal            Matches behavior of `dirname()`.
	 *                      <https://www.php.net/manual/en/function.dirname.php>
	 */
	public static function normalize( string $path ) : string {
		$path = str_replace( '\\', '/', $path );
		$path = preg_replace( '/\/+/u', '/', $path );
		$path = '/' === $path ? $path : rtrim( $path, '/' );

		return $path;
	}

	/**
	 * Path exists?
	 *
	 * @since 1.0.0
	 *
	 * @param  string $path Path.
	 *
	 * @return bool         True if path exists.
	 *
	 * @internal            Note: {@link file_exists()} returns false for symlinks pointing to non-existing files.
	 *                      <https://www.php.net/manual/en/function.file-exists.php>
	 */
	public static function path_exists( string $path ) : bool {
		return file_exists( $path ) || is_link( $path );
	}

	/**
	 * Gets path type.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $path Path.
	 *
	 * @return string       One of `link`, `file`, `dir`, or ``.
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
	 * Expands `~/` tilde at beginning of a path, and `${HOME}`.
	 *
	 * @since 1.0.0
	 *
	 * @param  string|mixed   $value     Value(s) to expand deeply.
	 *                                   This will recurse arrays/objects.
	 *
	 * @param  string         $key_regex Only expand deeply on keys matching this pattern.
	 *
	 * @param  null|\StdClass $_r        Internal use only. Do NOT pass.
	 *
	 * @return string|mixed              Expanded value.
	 */
	public static function expand_home( $value, string $key_regex = '/(?:^|[_\-])(?:dir(?:ectory)?|file|path)$/ui', ?\StdClass $_r = null ) {
		$_r           ??= (object) [];
		$_r->home_dir ??= U\Fs::normalize( getenv( 'HOME' ) );

		if ( ! $_r->home_dir ) {
			return $value; // Not possible.
		}
		if ( is_string( $value ) ) {
			$value = preg_replace( '/^~\//u', rtrim( $_r->home_dir, '/' ) . '/', $value );
			$value = preg_replace( '/\$\{HOME\}/u', $_r->home_dir, $value );

		} elseif ( is_array( $value ) || is_object( $value ) ) {
			foreach ( $value as $_key => &$_value ) {
				if ( ! is_string( $_value ) || ( is_string( $_key ) && preg_match( $key_regex, $_key ) ) ) {
					$_value = U\Fs::expand_home( $_value, $key_regex, $_r );
				}
			}
		}
		return $value;
	}

	/**
	 * Gets a path's permissions.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $path  Path.
	 * @param  bool   $octal Return octal representation?
	 *
	 * @return int|string    Permissions.
	 */
	public static function perms( string $path, bool $octal = false ) {
		$perms = 0; // Initialize.

		if ( file_exists( $path ) ) {
			$perms = fileperms( $path );
		}
		return $octal ? mb_substr( sprintf( '%o', $perms ), -4 ) : $perms;
	}

	/**
	 * Copies one path to another path.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $from_path         Path to copy.
	 *                                   Note: If this ends with `/*`, the contents of `$from_path` will be copied to
	 *                                   the contents of `$to_path`, such that a merge into `$to_path` occurs;
	 *                                   i.e., instead of deleting & replacing `$to_path` entirely.
	 *
	 * @param  string $to_path           Destination path.
	 *
	 * @param  bool   $include_dot_paths Include dot paths? Defaults to `false`.
	 * @param  bool   $follow_symlinks   Follow symlknks? Defaults to `false`.
	 *
	 * @param  int    $to_path_dir_perms Defaults to `0700`.
	 *                                   If `$to_path`'s parent directory does not exist, it will be created automatically.
	 *                                   This establishes the permissions for that newly created directory, when/if applicable.
	 *
	 * @return bool                      True if copied successfully.
	 */
	public static function copy( string $from_path, string $to_path, bool $include_dot_paths = false, bool $follow_symlinks = false, int $to_path_dir_perms = 0700 ) : bool {
		// Copy directory contents check.

		if ( '/*' === mb_substr( $from_path, -2 ) ) {
			return U\Fs::copy_dir_contents( mb_substr( $from_path, 0, -2 ), $to_path, $include_dot_paths, $follow_symlinks, $to_path_dir_perms );
		}

		// `$from_path` validation.

		$from_path                   = U\Fs::normalize( $from_path );
		$from_path_type              = U\Fs::type( $from_path );
		$from_path_perms             = U\Fs::perms( $from_path );
		$from_path_no_trailing_slash = rtrim( $from_path, '/' );

		if ( ! $from_path_type ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			return false; // Not possible.
		}

		// `$to_path` validation.

		$to_path                   = U\Fs::normalize( $to_path );
		$to_path_type              = U\Fs::type( $to_path );
		$to_path_no_trailing_slash = rtrim( $to_path, '/' );

		if ( ! $to_path ) {
			return false; // Not possible.
		}
		if ( $to_path_type && ! U\Fs::delete( $to_path ) ) {
			return false; // Not possible.
		}

		// `$to_path` directory validation.

		$to_path_dir      = dirname( $to_path );
		$to_path_dir_type = U\Fs::type( $to_path_dir );

		if ( $to_path_dir_type && ! is_writable( $to_path_dir ) ) {
			return false; // Not possible.
		}
		if ( ! $to_path_dir_type && ! mkdir( $to_path_dir, $to_path_dir_perms, true ) ) {
			return false; // Not possible.
		}

		// Link copy.

		if ( 'link' === $from_path_type && ! $follow_symlinks ) {
			return symlink( readlink( $from_path ), $to_path );
		}

		// File copy.

		if ( 'file' === $from_path_type || ( $follow_symlinks && is_file( $from_path ) ) ) {
			return copy( $from_path, $to_path ) && chmod( $to_path, $from_path_perms );
		}

		// Recursive directory copy.

		if ( ! mkdir( $to_path, $from_path_perms ) ) {
			return false; // Not possible.
		}
		if ( ! ( $_from_path_open = opendir( $from_path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_open ) ) ) {
			if ( in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			} elseif ( ! $include_dot_paths && '.' === ( $_subpath[0] ?? '' ) ) {
				continue; // Not including dot paths.
			}
			$_from_path = $from_path_no_trailing_slash . '/' . $_subpath;
			$_to_path   = $to_path_no_trailing_slash . '/' . $_subpath;

			if ( ! U\Fs::copy( $_from_path, $_to_path, $include_dot_paths, $follow_symlinks, $to_path_dir_perms ) ) {
				closedir( $_from_path_open );
				return false;
			}
		}
		closedir( $_from_path_open );

		return true;
	}

	/**
	 * Copies contents of one path to contents of another path.
	 *
	 * Do NOT call this directly. Instead, use {@link copy()} with `/*` on the end of `$from_path`.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $from_path         Path to copy.
	 *
	 * @param  string $to_path           Destination path.
	 *
	 * @param  bool   $include_dot_paths Include dot paths? Defaults to `false`.
	 * @param  bool   $follow_symlinks   Follow symlknks? Defaults to `false`.
	 *
	 * @param  int    $to_path_dir_perms Defaults to `0700`.
	 *                                   If `$to_path`'s parent directory does not exist, it will be created automatically.
	 *                                   This establishes the permissions for that newly created directory, when/if applicable.
	 *
	 * @return bool                      True if copied successfully.
	 */
	protected static function copy_dir_contents( string $from_path, string $to_path, bool $include_dot_paths = false, bool $follow_symlinks = false, int $to_path_dir_perms = 0700 ) : bool {
		// `$from_path` validation.

		$from_path                   = U\Fs::normalize( $from_path );
		$from_path_no_trailing_slash = rtrim( $from_path, '/' );
		$from_path_is_dir            = is_dir( $from_path );

		if ( ! $from_path_is_dir ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			return false; // Not possible.
		}

		// `$to_path` validation.

		$to_path                   = U\Fs::normalize( $to_path );
		$to_path_no_trailing_slash = rtrim( $to_path, '/' );

		if ( ! $to_path ) {
			return false; // Not possible.
		}

		// Copy directory contents.

		if ( ! ( $_from_path_open = opendir( $from_path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_open ) ) ) {
			if ( in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			} elseif ( ! $include_dot_paths && '.' === ( $_subpath[0] ?? '' ) ) {
				continue; // Not including dot paths.
			}
			$_from_path = $from_path_no_trailing_slash . '/' . $_subpath;
			$_to_path   = $to_path_no_trailing_slash . '/' . $_subpath;

			if ( ! U\Fs::copy( $_from_path, $_to_path, $include_dot_paths, $follow_symlinks, $to_path_dir_perms ) ) {
				closedir( $_from_path_open );
				return false;
			}
		}
		closedir( $_from_path_open );

		return true;
	}

	/**
	 * Zip one path into another path.
	 *
	 * @since 1.0.0
	 *
	 * @param  string         $from_path         Path to zip.
	 * @param  string         $to_path           Destination path.
	 *
	 * @param  bool           $include_dot_paths Include dot paths? Defaults to `false`.
	 *
	 * @param  bool           $follow_symlinks   Follow symlknks? Defaults to `true`.
	 *                                           This should almost always be `true` for zip files.
	 *                                           If `false`, symlinks are not followed. Instead, empty directories and/or files are created to hold the place
	 *                                             of what would otherwise have been followed and copied into the zip archive. Thus, recommend always leaving this as `true`.
	 *
	 * @param  int            $to_path_dir_perms Defaults to `0700`.
	 *                                           If `$to_path`'s parent directory does not exist, it will be created automatically.
	 *                                           This establishes the permissions for that newly created directory, when/if applicable.
	 *
	 * @param  null|\StdClass $_r                For internal recursive use only. Do not pass.
	 *
	 * @return bool                              True if zipped successfully.
	 */
	public static function zip( string $from_path, string $to_path, bool $include_dot_paths = false, bool $follow_symlinks = true, int $to_path_dir_perms = 0700, ?\StdClass $_r = null ) : bool {
		// Dependency check.

		if ( ! class_exists( 'ZipArchive' ) ) {
			return false; // Not possible.
		}
		// Recursion info.

		$is_recursive = isset( $_r );
		$_r           = $_r ?? (object) [];

		// `$from_path` validation.

		$from_path          = U\Fs::normalize( $from_path );
		$from_path_basename = basename( $from_path );

		if ( ! $is_recursive && preg_match( '/-\>([^\/]+)$/ui', $from_path, $_m ) ) {
			$_r->root_from_path_alias          = dirname( $from_path ) . '/' . $_m[1];
			$_r->root_from_path_alias_basename = basename( $_r->root_from_path_alias );

			$from_path          = preg_replace( '/-\>([^\/]+)$/ui', '', $from_path );
			$from_path_basename = basename( $from_path );
		}
		$from_path_type              = U\Fs::type( $from_path );
		$from_path_no_trailing_slash = rtrim( $from_path, '/' );

		if ( ! $from_path_type ) {
			$is_recursive ?: $_r->zip->close();
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			$is_recursive ?: $_r->zip->close();
			return false; // Not possible.
		}

		// `$to_path` validation.

		$to_path                   = U\Fs::normalize( $to_path );
		$to_path_type              = U\Fs::type( $to_path );
		$to_path_no_trailing_slash = rtrim( $to_path, '/' );

		if ( ! $to_path ) {
			$is_recursive ?: $_r->zip->close();
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			if ( $to_path_type && ! U\Fs::delete( $to_path ) ) {
				$is_recursive ?: $_r->zip->close();
				return false; // Not possible.
			}
		}

		// `$to_path` directory validation.

		if ( ! $is_recursive ) {
			$to_path_dir      = dirname( $to_path );
			$to_path_dir_type = U\Fs::type( $to_path_dir );

			if ( $to_path_dir_type && ! is_writable( $to_path_dir ) ) {
				$is_recursive ?: $_r->zip->close();
				return false; // Not possible.
			}
			if ( ! $to_path_dir_type && ! mkdir( $to_path_dir, $to_path_dir_perms, true ) ) {
				$is_recursive ?: $_r->zip->close();
				return false; // Not possible.
			}
		}

		// `$to_path_in_zip` validation.

		if ( ! $is_recursive ) {
			$_r->root_to_path_in_zip_prefix_to_strip = $to_path_no_trailing_slash;
			$_r->root_to_path_in_zip_prefix_to_addon = ( $_r->root_from_path_alias_basename ?? $from_path_basename );
		}
		$to_path_in_zip = str_replace( $_r->root_to_path_in_zip_prefix_to_strip, '', $to_path_no_trailing_slash );
		$to_path_in_zip = $_r->root_to_path_in_zip_prefix_to_addon . $to_path_in_zip;

		// Zip archive.

		if ( ! $is_recursive ) {
			$_r->zip = new \ZipArchive();

			if ( $_r->zip->open( $to_path, \ZipArchive::CREATE | \ZIPARCHIVE::OVERWRITE ) !== true ) {
				return false; // Not possible.
			}
		}
		// Link zip.

		if ( 'link' === $from_path_type && ! $follow_symlinks ) {
			return $_r->zip->addFromString( $to_path_in_zip, '' ) === true && ( $is_recursive || $_r->zip->close() === true );
		}

		// File zip.

		if ( 'file' === $from_path_type || ( $follow_symlinks && is_file( $from_path ) ) ) {
			return $_r->zip->addFile( $from_path, $to_path_in_zip ) === true && ( $is_recursive || $_r->zip->close() === true );
		}

		// Recursive directory zip.

		if ( $_r->zip->addEmptyDir( $to_path_in_zip ) !== true ) {
			$is_recursive ?: $_r->zip->close();
			return false; // Not possible.
		}
		if ( ! ( $_from_path_open = opendir( $from_path ) ) ) {
			$is_recursive ?: $_r->zip->close();
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_open ) ) ) {
			if ( in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			} elseif ( ! $include_dot_paths && '.' === ( $_subpath[0] ?? '' ) ) {
				continue; // Not including dot paths.
			}
			$_from_path = $from_path_no_trailing_slash . '/' . $_subpath;
			$_to_path   = $to_path_no_trailing_slash . '/' . $_subpath;

			if ( ! U\Fs::zip( $_from_path, $_to_path, $include_dot_paths, $follow_symlinks, $to_path_dir_perms, $_r ) ) {
				closedir( $_from_path_open );
				$is_recursive ?: $_r->zip->close();
				return false;
			}
		}
		closedir( $_from_path_open );

		return $is_recursive ?: $_r->zip->close() === true;
	}

	/**
	 * Deletes a path.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $path        Path to delete.
	 * @param  bool   $recursively Defaults to `true`.
	 *
	 * @return bool                True if deleted successfully.
	 *
	 * @internal                   Note: This intentionally does not follow symlinks.
	 *                             i.e., A link is just a link, so this does not recurse into symlinked directories.
	 */
	public static function delete( string $path, bool $recursively = true ): bool {
		// `$path` validation.

		$path                   = U\Fs::normalize( $path );
		$path_type              = U\Fs::type( $path );
		$path_no_trailing_slash = rtrim( $path, '/' );

		if ( ! $path_type ) {
			return true; // No longer exists.
		}
		if ( ! is_writable( $path ) ) {
			return false; // Not possible.
		}

		// Link, file, and non-recursive direction deletion.

		if ( in_array( $path_type, [ 'link', 'file' ], true ) || ! $recursively ) {
			return 'dir' === $path_type ? rmdir( $path ) : unlink( $path );
		}

		// Recursive directory deletion.

		if ( ! ( $_path_open = 'dir' === $path_type ? opendir( $path ) : false ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_path_open ) ) ) {
			if ( in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_path = $path_no_trailing_slash . '/' . $_subpath;

			if ( ! U\Fs::delete( $_path, $recursively ) ) {
				closedir( $_path_open );
				return false;
			}
		}
		closedir( $_path_open );

		return rmdir( $path );
	}
}
