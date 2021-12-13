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
 * Dir.
 *
 * @since 1.0.0
 */
class Dir extends Base {
	/**
	 * Gets a temp directory path.
	 *
	 * @return string     Temp directory path.
	 *
	 * @internal          Note: The directory is created automagically.
	 *
	 * @throws \Exception On any failure.
	 */
	public static function temp() : string {
		$dir = U\Dir::tmp() . '/' . U\Crypto::uuid_v4();

		if ( ! mkdir( $dir, 0700, true ) ) {
			throw new \Exception( 'Unable to create temp directory.' );
		}
		return $dir;
	}

	/**
	 * Gets TMP directory.
	 *
	 * @return string     TMP directory.
	 *
	 * @throws \Exception On failure to locate TMP directory.
	 */
	public static function tmp() : string {
		static $cache;

		if ( isset( $cache ) ) {
			return $cache; // From cache.
		}
		$haystack = []; // Initialize.

		if ( defined( 'WP_TEMP_DIR' ) ) {
			$haystack[] = WP_TEMP_DIR;
		}
		$haystack[] = sys_get_temp_dir();
		$haystack[] = ini_get( 'upload_tmp_dir' );

		if ( ! empty( $_SERVER['TEMP'] ) ) {
			$haystack[] = $_SERVER['TEMP']; // phpcs:ignore
		}
		if ( ! empty( $_SERVER['TMPDIR'] ) ) {
			$haystack[] = $_SERVER['TMPDIR']; // phpcs:ignore
		}
		if ( ! empty( $_SERVER['TMP'] ) ) {
			$haystack[] = $_SERVER['TMP']; // phpcs:ignore
		}
		if ( 0 === stripos( PHP_OS, 'win' ) ) {
			$haystack[] = 'C:/Temp';
		} else {
			$haystack[] = '/tmp';
		}

		foreach ( $haystack as $_dir ) {
			$_dir = rtrim( U\Fs::normalize( realpath( $_dir ) ), '/' );

			if ( $_dir && is_dir( $_dir ) && is_writable( $_dir ) ) {
				$_dir = $_dir . '/clevercanyon/.tmp';

				if ( is_dir( $_dir ) ) {
					return $cache = $_dir;
				}
				if ( ! U\Fs::path_exists( $_dir ) && mkdir( $_dir, 0700, true ) ) {
					return $cache = $_dir;
				}
			}
		}

		$cache = ''; // Empty string and exception on failure.
		throw new \Exception( 'Unable to locate a tmp directory.' );
	}

	/**
	 * Prunes a directory.
	 *
	 * @since 1.0.0
	 *
	 * @param  string      $path             Directory to prune.
	 * @param  array       $prune            Array of regex expressions to prune.
	 * @param  array       $prune_exceptions Array of regex expressions to keep (i.e., prune exceptions).
	 * @param  null|string $base_path        Base path, which gets stripped prior to regex matching. Defaults to `$path`.
	 *                                       Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @return bool                          True on success.
	 */
	public static function prune( string $path, array $prune, array $prune_exceptions = [], ?string $base_path = null ) : bool {
		// Initialization.

		$paths_to_prune = [];

		// `$path` validation.

		$path                   = U\Fs::normalize( $path );
		$path_no_trailing_slash = rtrim( $path, '/' );
		$path_is_dir            = is_dir( $path );

		if ( ! $path_is_dir ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $path ) ) {
			return false; // Not possible.
		}

		// Base path collection.

		$base_path                 ??= $path; // Default value.
		$base_path                   = U\Fs::normalize( $base_path );
		$base_path_no_trailing_slash = rtrim( $base_path, '/' );

		// Recursive directory pruning.

		if ( ! ( $_path_open = opendir( $path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_path_open ) ) ) {
			if ( in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_path         = $path_no_trailing_slash . '/' . $_subpath;
			$_base_subpath = str_replace( $base_path_no_trailing_slash . '/', '', $_path );

			foreach ( $prune as $_prune ) {
				if ( preg_match( $_prune, $_base_subpath ) ) {

					foreach ( $prune_exceptions as $_prune_exception ) {
						if ( preg_match( $_prune_exception, $_base_subpath ) ) {
							continue 2; // Continue iterating prunes.
							// i.e., bypassing addition of a new `$_path` below.
						}
					}

					$paths_to_prune[] = $_path;
					continue 2; // Continue iterating subpaths.
					// i.e., avoiding unnecessary directory recursion below.
				}
			}

			if ( 'dir' === U\Fs::type( $_path ) ) {
				if ( ! U\Dir::prune( $_path, $prune, $prune_exceptions, $base_path ) ) {
					closedir( $_path_open );
					return false;
				}
			}
		}
		closedir( $_path_open );

		foreach ( $paths_to_prune as $_path ) {
			if ( ! U\Fs::delete( $_path ) ) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Gets a directory iterator.
	 *
	 * @since 1.0.0
	 *
	 * @param  string $path   Directory to iterate.
	 * @param  string $regex  Regular expression.
	 *
	 * @return \RegexIterator Recursive directory regex iterator.
	 *
	 * @throws \Exception     If either of the input parameters are empty.
	 * @throws \Exception     If `$path` is not a readable/iterable directory.
	 *
	 * @internal              Note: This intentionally does not follow symlinks.
	 *                        i.e., A link is just a link, so this does not recurse into symlinked directories.
	 */
	public static function iterator( string $path, string $regex = '/.+/u' ) : \RegexIterator {
		if ( ! $path || ! $regex ) {
			throw new \Exception( 'Missing required parameters.' );
		}
		if ( ! is_dir( $path ) || ! is_readable( $path ) ) {
			throw new \Exception( 'Not a readable/iterable directory.' );
		}

		$iterator = new \RecursiveDirectoryIterator( $path, \FilesystemIterator::KEY_AS_PATHNAME | \FilesystemIterator::CURRENT_AS_SELF | \FilesystemIterator::SKIP_DOTS | \FilesystemIterator::UNIX_PATHS );
		$iterator = new \RecursiveIteratorIterator( $iterator, \RecursiveIteratorIterator::CHILD_FIRST );
		$iterator = new \RegexIterator( $iterator, $regex, \RegexIterator::MATCH, \RegexIterator::USE_KEY );

		return $iterator;
	}
}
