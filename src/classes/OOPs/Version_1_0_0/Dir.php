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
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\OOPs\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Exception};

// </editor-fold>

/**
 * Directory utilities.
 *
 * @since 2021-12-15
 */
class Dir extends Base {
	/**
	 * Joins paths.
	 *
	 * @since 2021-12-19
	 *
	 * @param string ...$paths Path(s) to join.
	 *
	 * @return string New path formed by the joins.
	 */
	public static function join( string ...$paths ) : string {
		$paths = array_filter( $paths, function ( $value, $key ) {
			return '' !== $value && ( 0 === $key || '' !== trim( $value, '/\\' ) );
		}, ARRAY_FILTER_USE_BOTH );

		return U\Fs::normalize( implode( '/', $paths ) );
	}

	/**
	 * Joins paths ((e)xplicit (t)railing (s)lash).
	 *
	 * @since 2021-12-19
	 *
	 * @param string ...$paths Path(s) to join + optional (explicit) trailing slash.
	 *                         Note: You must set last path as `/` to get a trailing slash.
	 *                         There must be at least two paths given; `/` last, to get a trailing slash.
	 *
	 * @return string New path formed by the joins.
	 *
	 * @note  A trailing slash will never be added to a single `/` root path.
	 *        A trailing slash will never be added to what is nothing but wrappers; e.g., `foo://bar://baz://`.
	 */
	public static function join_ets( string ...$paths ) : string {
		$ets = isset( $paths[ 1 ] ) && '/' === U\Arr::value_last( $paths );

		$paths = array_filter( $paths, function ( $value, $key ) {
			return '' !== $value && ( 0 === $key || '' !== trim( $value, '/\\' ) );
		}, ARRAY_FILTER_USE_BOTH );

		return U\Fs::normalize( implode( '/', $paths ), $ets ? [ 'append:trailing-slash' ] : [] );
	}

	/**
	 * Gets directory name and does optional {@see join()}.
	 *
	 * @since 2021-12-19
	 *
	 * @param string     $path            {@see dirname()}.
	 * @param int|string ...$levels_paths Optional (int) parent levels to go up. Default is `1`. Must be `>= 1`.
	 *                                    Followed by optional (string) paths to join. Default is no join.
	 *
	 * @return string Newly formed by path, based on input parameters.
	 */
	public static function name( string $path, /* int|string */ ...$levels_paths ) : string {
		if ( $levels_paths ) {
			$is_key_0_levels = is_int( $levels_paths[ 0 ] ?? null );
			$levels          = $is_key_0_levels ? max( 1, $levels_paths[ 0 ] ) : 1;

			$paths = $is_key_0_levels ? array_slice( $levels_paths, 1 ) : $levels_paths;
			assert( array_map( 'strval', $paths ) === $paths );
		} else {
			$levels = 1; // Must be an integer >= `1`.
			$paths  = [];
		}
		$path = U\Fs::normalize( $path ); // Before passing to {@see dirname()}.

		if ( $paths ) {
			return U\Dir::join( dirname( $path, $levels ), ...$paths );
		} else {
			return U\Fs::normalize( dirname( $path, $levels ) );
		}
	}

	/**
	 * Strips base, gets subpath.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $base_path Base path to strip away.
	 * @param string $path      Path from which to strip the base.
	 *
	 * @return string New subpath formed by the removal (or failure to remove) `$base`.
	 *
	 * @note  The resulting subpath will NOT have wrappers or leading/trailing slashes.
	 *        This is done to ensure the function always returns a subpath. Thus, handling cases where a `$base_path`
	 *        cannot be removed from `$path`. In such an event, this function returns the full original `$path`, as a pseudo subpath.
	 */
	public static function subpath( string $base_path, string $path ) : string {
		$base_path = U\Fs::normalize( $base_path );
		$path      = U\Fs::normalize( $path );

		$subpath = preg_replace( '/^' . U\Str::esc_reg( rtrim( $base_path, '/' ) ) . '(?:\/|$)/u', '', $path, 1, $_rp );

		if ( ! $_rp && false !== mb_strpos( $subpath, ':/' ) ) {
			$subpath = mb_substr( $subpath, mb_strlen( U\Fs::wrappers( $subpath ) ) );
		}
		$subpath = trim( $subpath, '/' );

		return $subpath;
	}

	/**
	 * Makes a directory.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $dir         Directory path.
	 * @param int    $perms       Permissions. Default is `0700`.
	 * @param bool   $recursively Recursively? Default is `true`.
	 *
	 * @return bool True if all directories created successfully.
	 */
	public static function make( string $dir, int $perms = 0700, bool $recursively = true ) : bool {
		$dir = U\Fs::normalize( $dir );

		return ! file_exists( $dir ) && U\Fs::delete( $dir )
			&& mkdir( $dir, $perms, $recursively );
	}

	/**
	 * Makes a temp directory.
	 *
	 * @param string $dir         Directory to create directory in.
	 *                            Defaults to {@see U\Dir::sys_temp()}.
	 *
	 * @param int    $perms       Permissions. Default is `0700`.
	 * @param bool   $recursively Recursively? Default is `true`.
	 *
	 * @throws Exception On any failure.
	 * @return string Absolute path to temporary directory.
	 */
	public static function make_temp( string $dir = '', int $perms = 0700, bool $recursively = true ) : string {
		$dir = $dir ?: U\Dir::sys_temp();
		$dir = U\Dir::join( $dir, '/' . U\Crypto::uuid_v4() );

		if ( ! U\Dir::make( $dir, $perms, $recursively ) ) {
			throw new Exception( 'Unable to create temp directory: `' . $dir . '`.' );
		}
		return $dir;
	}

	/**
	 * Gets system temp directory.
	 *
	 * @throws Exception On any failure.
	 * @return string Absolute path to system temp directory.
	 *
	 * @see U\Env::var() When modifying this function.
	 */
	public static function sys_temp() : string {
		if ( null !== ( $cache = &static::oops_cache( __FUNCTION__ ) ) ) {
			return $cache; // Cached already.
		}
		$haystack = []; // Initialize.

		if ( defined( 'WP_TEMP_DIR' ) ) {
			$haystack[] = WP_TEMP_DIR;
		}
		$haystack[] = sys_get_temp_dir();          // {@see https://o5p.me/Yoz1zI}.
		$haystack[] = ini_get( 'upload_tmp_dir' ); // {@see https://o5p.me/Zrk78z}.

		if ( $_needle = U\Env::var( 'TMPDIR', [ 'bypass:U\\Dir::sys_temp' ] ) ) {
			$haystack[] = $_needle; // {@see U\Env::var()} for more details.
		}
		if ( U\Env::is_windows() ) {
			$haystack[] = 'C:/Temp';
		} else {
			$haystack[] = '/tmp';
		}
		$haystack = array_unique( $haystack );

		foreach ( $haystack as $_dir ) {
			$_dir = U\Fs::normalize( (string) realpath( $_dir ) );

			if ( ! $_dir || ! is_dir( $_dir ) || ! is_writable( $_dir ) ) {
				continue; // Not going to work.
			}
			$__dir = U\Dir::join( $_dir, '/clevercanyon/.tmp' );

			if ( is_dir( $__dir ) || U\Dir::make( $__dir ) ) {
				return $cache = $__dir;
			}
		}
		$cache = ''; // Empty string and exception on failure.
		throw new Exception( 'Unable to locate system temp directory.' );
	}

	/**
	 * Prunes a directory.
	 *
	 * @since 2021-12-15
	 *
	 * @param string         $path             Directory to prune.
	 * @param array          $prune            Array of regex expressions to prune.
	 * @param array          $prune_exceptions Array of regex expressions to keep (i.e., prune exceptions).
	 *
	 * @param string|null    $base_path        Base path, which gets stripped prior to regex matching. Defaults to `$path`.
	 *                                         Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param \stdClass|null $_r               For internal use only. Used in recursion.
	 *
	 * @return bool True on success.
	 */
	public static function prune(
		string $path,
		array $prune,
		array $prune_exceptions = [],
		/* string|null */ ?string $base_path = null,
		/* \stdClass|null */ ?\stdClass $_r = null
	) : bool {
		// Recursion info.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// Initialization.

		$paths_to_prune = [];

		// `$path` validation.

		$path        = U\Fs::normalize( $path );
		$path_is_dir = is_dir( $path );

		if ( ! $path_is_dir ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $path ) ) {
			return false; // Not possible.
		}

		// Base path collection.

		if ( ! $is_recursive ) {
			$base_path ??= $path; // Default value.
			$base_path = U\Fs::normalize( $base_path );
		}
		// Recursive directory pruning.

		if ( ! ( $_path_open = opendir( $path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_path_open ) ) ) {
			if ( in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_path         = U\Dir::join( $path, '/' . $_subpath );
			$_base_subpath = U\Dir::subpath( $base_path, $_path );

			foreach ( $prune as $_prune ) { // @todo Create an array-based preg_match?
				if ( preg_match( $_prune, $_base_subpath ) ) {
					foreach ( $prune_exceptions as $_prune_exception ) {
						if ( preg_match( $_prune_exception, $_base_subpath ) ) {
							continue 2; // Continue iterating prunes.
							// i.e., bypassing addition of a new `$_path` below.
						}
					}
					$paths_to_prune[] = $_path;
					continue 2; // Continue iterating subpaths.
					// i.e., Avoiding unnecessary directory recursion below.
				}
			}
			if ( is_dir( $_path ) && ! U\Dir::prune( $_path, $prune, $prune_exceptions, $base_path, $_r ) ) {
				closedir( $_path_open );
				return false;
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
	 * @since 2021-12-15
	 *
	 * @param string      $path   Directory to iterate.
	 * @param string|null $regexp Regular expression to use in filtering.
	 *                            Default is everything except `.gitignore` items.
	 *
	 * @throws Exception If either of the input parameters are empty.
	 * @throws Exception If `$path` is not a readable/iterable directory.
	 * @throws Exception On failure to construct iterator.
	 *
	 * @return \RegexIterator Recursive directory regex iterator.
	 *
	 * @see   U\Fs::gitignore_regexp() — PLEASE REVIEW CAREFULLY!
	 * @see   https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php
	 *
	 * @note  Please {@see U\Fs::gitignore_regexp()} and note the use of the `x` modifier.
	 *        Whitespace may not be included without careful attention. Use `\s` or `\S` instead please.
	 *
	 * @note  Note: This intentionally does not follow symlinks.
	 *        i.e., A link is just a link. This does not recurse into symlinked directories.
	 */
	public static function iterator( string $path, /* string|null */ ?string $regexp = null ) : \RegexIterator {
		$regexp ??= U\Fs::gitignore_regexp( '.+' );

		if ( ! $path || ! $regexp ) {
			throw new Exception( 'Missing required parameters.' );
		}
		if ( ! is_dir( $path ) || ! is_readable( $path ) ) {
			throw new Exception( 'Not a readable/iterable directory.' );
		}
		try {
			$iterator = new \RecursiveDirectoryIterator(
				$path, // Path to begin from.
				\FilesystemIterator::KEY_AS_PATHNAME
				| \FilesystemIterator::CURRENT_AS_SELF
				| \FilesystemIterator::SKIP_DOTS
				| \FilesystemIterator::UNIX_PATHS
			);
			$iterator = new \RecursiveIteratorIterator( $iterator, \RecursiveIteratorIterator::CHILD_FIRST );
			$iterator = new \RegexIterator( $iterator, $regexp, \RegexIterator::MATCH, \RegexIterator::USE_KEY );
		} catch ( \Throwable $throwable ) {
			throw new Exception( $throwable->getMessage() );
		}
		return $iterator;
	}
}
