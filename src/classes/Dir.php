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
 * Directory utilities.
 *
 * @since 2021-12-15
 */
final class Dir extends U\A6t\Stc_Utilities {
	/**
	 * Joins paths.
	 *
	 * @since 2021-12-19
	 *
	 * @param string ...$paths Path(s) to join.
	 *
	 * @return string New path formed by the joins.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::join()
	 */
	public static function join( string ...$paths ) : string {
		if ( ! $paths ) {
			return ''; // Nothing to do.
		}
		$base_path  = $paths[ 0 ];
		$join_paths = array_slice( $paths, 1 );

		return U\Fs::normalize( $base_path, [ 'join:paths' => $join_paths ] );
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
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::join_ets()
	 */
	public static function join_ets( string ...$paths ) : string {
		if ( ! $paths ) {
			return ''; // Nothing to do.
		}
		$base_path  = $paths[ 0 ];
		$ets        = isset( $paths[ 1 ] ) && '/' === U\Arr::value_last( $paths );
		$join_paths = $ets ? array_slice( $paths, 1, -1 ) : array_slice( $paths, 1 );

		return U\Fs::normalize( $base_path, [
			'join:paths'            => $join_paths,
			'append:trailing-slash' => true === $ets,
		] );
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
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::name()
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
	 * @param string $base_path        Base path to strip away.
	 * @param string $path             Path from which to strip the base.
	 *
	 * @param bool   $throw_on_failure Throw on failure? Default is `true`.
	 *                                 If set to `false`, function returns `false` on failure.
	 *
	 * @throws U\Fatal_Exception On failure to strip the given base path.
	 *                           Change by setting `$throw_on_failure` to `false`.
	 *
	 * @return string|false Subpath; i.e., `$path` with `$base_path` stripped away.
	 *                      If `$throw_on_failure` is `false`, returns `false` on failure.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::subpath()
	 */
	public static function subpath( string $base_path, string $path, bool $throw_on_failure = true ) /* string|false */ {
		$base_path = U\Fs::normalize( $base_path );
		$path      = U\Fs::normalize( $path );

		$esc_reg_base_path_no_ts = U\Str::esc_reg( rtrim( $base_path, '/' ) );
		$subpath                 = preg_replace( '/^' . $esc_reg_base_path_no_ts . '(?:\/|$)/u', '', $path, 1, $_replacements );

		if ( 1 !== $_replacements && $throw_on_failure ) {
			throw new U\Fatal_Exception( // Default behavior.
				'Failed to formulate a subpath using base: `' . $base_path . '`' .
				' against `' . $path . '`. Fatal exception; cannot safely continue.'
			);
		}
		return 1 !== $_replacements ? false : trim( $subpath, '/' );
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
	 * @throws U\Fatal_Exception On any failure.
	 * @return string Absolute path to temporary directory.
	 */
	public static function make_temp( string $dir = '', int $perms = 0700, bool $recursively = true ) : string {
		$dir = $dir ?: U\Dir::sys_temp();
		$dir = U\Dir::join( $dir, '/' . U\Crypto::uuid_v4() );

		if ( ! U\Dir::make( $dir, $perms, $recursively ) ) {
			throw new U\Fatal_Exception( 'Unable to create temp directory: `' . $dir . '`.' );
		}
		return $dir;
	}

	/**
	 * Gets system temp directory.
	 *
	 * @throws U\Fatal_Exception On failure to locate temp dir.
	 * @return string Absolute path to system temp directory.
	 *
	 * @see U\Env::var() When modifying this function.
	 */
	public static function sys_temp() : string {
		if ( null !== ( $cache = &static::cache( __FUNCTION__ ) ) ) {
			return $cache; // Cached already.
		}
		$haystack = []; // Initialize.

		if ( defined( 'WP_TEMP_DIR' ) ) {
			$haystack[] = WP_TEMP_DIR;
		}
		$haystack[] = sys_get_temp_dir();          // {@see https://o5p.me/Yoz1zI}.
		$haystack[] = ini_get( 'upload_tmp_dir' ); // {@see https://o5p.me/Zrk78z}.

		if ( $_needle = U\Env::var( 'TMPDIR', [ 'bypass:U\\Dir::sys_temp' => true ] ) ) {
			$haystack[] = $_needle; // {@see U\Env::var()} for more details.
		}
		if ( U\Env::is_windows() ) {
			$haystack[] = 'c:/Temp';
		} else {
			$haystack[] = '/tmp';
		}
		$haystack = array_unique( $haystack );

		foreach ( $haystack as $_dir ) {
			$_dir = U\Fs::realize( $_dir );

			if ( ! $_dir || ! is_dir( $_dir ) || ! is_writable( $_dir ) ) {
				continue; // Not going to work.
			}
			$__dir = U\Dir::join( $_dir, '/clevercanyon/.tmp' );

			if ( is_dir( $__dir ) || U\Dir::make( $__dir ) ) {
				return $cache = $__dir;
			}
		}
		$cache = ''; // Empty string and exception on failure.
		throw new U\Fatal_Exception( 'Unable to locate system temp directory. None of the usual locations are writable.' );
	}

	/**
	 * Prunes a directory.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $path       Directory to prune.
	 *
	 * @param array       $prune      Array of regex expressions to prune.
	 * @param array       $exceptions Array of regex expressions to keep (i.e., prune exceptions).
	 *
	 * @param string|null $base_path  Base path, which gets stripped prior to regex matching. Defaults to `$path`.
	 *                                Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param object|null $_r         Internal use only — do not pass.
	 *
	 * @return bool True on success.
	 */
	public static function prune(
		string $path,
		array $prune,
		array $exceptions = [],
		/* string|null */ ?string $base_path = null,
		/* object|null */ ?object $_r = null
	) : bool {
		// Recursion info.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// Anything to prune?

		if ( ! $prune ) {
			return true; // Nothing to do.
		}
		// `$path` validation.

		$path      = U\Fs::normalize( $path );
		$path_type = U\Fs::type( $path );

		if ( 'dir' !== $path_type ) {
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

		if ( ! ( $_path_opendir = opendir( $path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_path         = U\Dir::join( $path, '/' . $_subpath );
			$_base_subpath = U\Dir::subpath( $base_path, $_path );

			if ( $prune && U\Str::preg_match_in( $prune, $_base_subpath ) ) {
				if ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $_base_subpath ) ) {
					if ( ! U\Fs::delete( $_path ) ) {
						closedir( $_path_opendir );
						return false;
					}
					continue; // Continue iterating subpaths.
					// i.e., Avoiding unnecessary recursion below.
				}
			}
			if ( // Only recurse into directores, not links.
				'dir' === U\Fs::type( $_path ) // Do not follow symlinks.
				&& ! U\Dir::prune( $_path, $prune, $exceptions, $base_path, $_r )
			) {
				closedir( $_path_opendir );
				return false;
			}
		}
		closedir( $_path_opendir );
		return true;
	}

	/**
	 * Gets a recursive directory iterator.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $path            Directory to iterate.
	 *
	 * @param string|null $regexp          Regular expression to use as a filter.
	 *                                     Default is everything except `.gitignore` items.
	 *                                     Depends on use of {@see U\Fs::gitignore_regexp_lookahead()}.
	 *
	 *                                     You can pass a complete regular expression, which must begin with `/`.
	 *                                     Or, pass a regular expression fragment, which is anything that doesn't begin with `/`.
	 *                                     Fragments are auto-expanded into `U\Fs::gitignore_regexp_lookahead( 'negative', [fragment] )`.
	 *
	 * @param bool        $follow_symlinks Default is `false`.
	 *
	 * @throws U\Exception If either of the input parameters are empty.
	 * @throws U\Exception If `$path` is not a readable/iterable directory.
	 * @throws U\Exception On failure to construct iterator.
	 *
	 * @return \Generator|\RecursiveDirectoryIterator[] Recursive directory iterator.
	 *
	 * @see   U\Fs::gitignore_regexp_lookahead() — please review carefully.
	 * @see   https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php
	 */
	public static function iterator( string $path, /* string|null */ ?string $regexp = null, bool $follow_symlinks = false ) : \Generator {
		if ( isset( $regexp ) && '' !== $regexp && '/' !== $regexp[ 0 ] ) {
			$regexp = U\Fs::gitignore_regexp_lookahead( 'negative', $regexp );
		}
		$regexp ??= U\Fs::gitignore_regexp_lookahead( 'negative' );

		if ( ! $path || ! $regexp ) {
			throw new U\Exception( 'Missing required parameters.' );
		}
		if ( ! is_dir( $path ) || ! is_readable( $path ) ) {
			throw new U\Exception( 'Not a readable/iterable directory.' );
		}
		try {
			if ( $follow_symlinks ) {
				$flags = \FilesystemIterator::KEY_AS_PATHNAME
					| \FilesystemIterator::CURRENT_AS_SELF
					| \FilesystemIterator::SKIP_DOTS
					| \FilesystemIterator::UNIX_PATHS
					| \FilesystemIterator::FOLLOW_SYMLINKS;
			} else {
				$flags = \FilesystemIterator::KEY_AS_PATHNAME
					| \FilesystemIterator::CURRENT_AS_SELF
					| \FilesystemIterator::SKIP_DOTS
					| \FilesystemIterator::UNIX_PATHS;
			}
			$iterator          = new \RecursiveDirectoryIterator( $path, $flags );
			$iterator_iterator = new \RecursiveIteratorIterator( $iterator, \RecursiveIteratorIterator::CHILD_FIRST );

			foreach ( $iterator_iterator as $_iterator ) {
				if ( preg_match( $regexp, $_iterator->getSubPathname() ) ) {
					yield $_iterator; // `\RecursiveDirectoryIterator` instance.
				}
			}
		} catch ( \Throwable $throwable ) {
			throw new U\Exception( $throwable->getMessage() );
		}
	}
}
