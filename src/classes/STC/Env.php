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
 * Environment utilities.
 *
 * @since 2021-12-15
 */
class Env extends \Clever_Canyon\Utilities\STC\Abstracts\A6t_Stc_Base {
	/**
	 * Is CLI?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if CLI.
	 */
	public static function is_cli() : bool {
		return 'cli' === PHP_SAPI;
	}

	/**
	 * Is OS Linux?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is Linux.
	 */
	public static function is_linux() : bool {
		return 'Linux' === PHP_OS_FAMILY;
	}

	/**
	 * Is OS Windows?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is Windows.
	 */
	public static function is_windows() : bool {
		return 'Windows' === PHP_OS_FAMILY;
	}

	/**
	 * Is OS Unix-based?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if OS is based on Unix.
	 */
	public static function is_unix_based() : bool {
		return in_array( PHP_OS_FAMILY, [ 'BSD', 'Darwin', 'Solaris', 'Linux' ], true );
	}

	/**
	 * Is WordPress?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if WordPress.
	 */
	public static function is_wordpress() : bool {
		return defined( 'WPINC' );
	}

	/**
	 * Gets environment variables.
	 *
	 * @since 2021-12-21
	 *
	 * @param string[] $others Any other custom environment vars. Default is `[]`.
	 *                         These will override any existing environment vars with same name.
	 *
	 * @return string[] Environment variables.
	 *
	 * @see   U\Env::var() When modifying.
	 * @see   https://en.wikipedia.org/wiki/Environment_variable
	 */
	public static function vars( array $others = [] ) : array {
		$vars = []; // Initialize.

		foreach ( [ // {@see var()} below.
			'USER',
			'HOME',
			'PWD',
			'TMPDIR',
			'PHP_SELF',
			'SCRIPT_NAME',
			'DOCUMENT_ROOT',
			'SCRIPT_FILENAME',
		] as $_var
		) {
			$vars[ $_var ] = U\Env::var( $_var );
		}
		$vars += getenv() + $_SERVER;
		$vars = $others + $vars; // `$others` get precedence.
		$vars = U\Ctn::stringify( $vars, true, 1 );

		return $vars;
	}

	/**
	 * Gets environment variable.
	 *
	 * @since 2021-12-21
	 *
	 * @param string $var Variable.
	 * @param array  $_d  Internal use only — do not pass.
	 *
	 * @return string Environment variable, else empty string.
	 *
	 * @see   https://en.wikipedia.org/wiki/Environment_variable
	 *
	 * @note  Absence of {@see realpath()} usage here. Callers should handle that as necessary.
	 *        One exception is `TMPDIR` via {@see U\Dir::sys_temp()}, which does do a {@see realpath()} expansion.
	 * @see   U\Env::vars() When modifying.
	 * @see   U\Env::sys_temp() When modifying.
	 */
	public static function var( string $var, array $_d = [] ) : string {
		switch ( $var ) {
			case 'USER': // Current user's username.
				$value = getenv( $var ) // POSIX: Unix/Linux, macOS.
					?: getenv( 'USERNAME' ); // Windows.
				break;

			case 'HOME': // Current user's home directory.
				// {@see https://en.wikipedia.org/wiki/Home_directory}.
				$value = getenv( $var ) // POSIX: Unix/Linux, macOS.
					?: getenv( 'USERPROFILE' ) // Windows; easier than drive+path.
						?: ( getenv( 'HOMEDRIVE' ) . getenv( 'HOMEPATH' ) ); // Windows.
				$value = U\Fs::normalize( (string) $value );
				break;

			case 'PWD': // Current working directory.
				// {@see https://en.wikipedia.org/wiki/Pwd}.
				$value = getcwd() // PHP: Unix/Linux, macOS, Windows.
					?: getenv( $var ) // POSIX: Unix/Linux, macOS.
						?: getenv( 'CD' ); // Windows.
				$value = U\Fs::normalize( (string) $value );
				break;

			case 'TMPDIR': // Temporary directory.
				// {@see https://en.wikipedia.org/wiki/TMPDIR}.
				$value = ! empty( $_d[ 'bypass:U\\Dir::sys_temp' ] ) ? '' : U\Dir::sys_temp();
				$value = $value ?: getenv( $var ) // POSIX: Unix/Linux, macOS, Windows.
					?: getenv( 'TEMP' ) ?: getenv( 'TMP' ); // Unix/Linux, macOS.
				$value = U\Fs::normalize( (string) $value );
				break;

			case 'PHP_SELF': // ↓ Normalize.
			case 'SCRIPT_NAME':
			case 'DOCUMENT_ROOT':
			case 'SCRIPT_FILENAME':
				$value = getenv( $var );
				$value = U\Fs::normalize( (string) $value );
				break;

			default: // If `$var` is not empty.
				$value = $var ? getenv( $var ) : '';
		}
		return (string) $value;
	}

	/**
	 * Gets/sets static environment var.
	 *
	 * @since 2021-12-22
	 *
	 * @param string $name  Static environment var name.
	 * @param mixed  $value Static environment var value, when/if setting.
	 *                      If not passed, this simply operates as a getter.
	 *                      If passed explicitly as `null`, var is {@see unset()}.
	 *
	 * @return mixed Value of the static environment var, else `null`.
	 */
	public static function static_var( string $name, /* mixed */ $value = null ) /* : mixed */ {
		static $static_vars = []; // Intitialize.

		if ( func_num_args() >= 2 ) {
			if ( null === $value ) {
				unset( $static_vars[ $name ] );
			} else {
				$static_vars[ $name ] = $value;
			}
		}
		return $static_vars[ $name ] ?? null;
	}

	/**
	 * Defines a constant, if not defined already.
	 *
	 * @since 2021-12-15
	 *
	 * @param string                     $name  Name.
	 * @param int|float|string|bool|null $value Value.
	 *
	 * @return bool True if defined successfully.
	 */
	public static function maybe_define( string $name, /* int|float|string|bool|null */ $value ) : bool {
		return ! defined( $name ) && define( $name, $value );
	}

	/**
	 * Can use class(es)?
	 *
	 * @since 2021-12-18
	 *
	 * @param string ...$classes Class(es).
	 *
	 * @return bool True if all classes are useable.
	 *
	 * @see   https://www.php.net/manual/en/ini.core.php#ini.disable-classes
	 */
	public static function can_use_class( string ...$classes ) : bool {
		if ( null === ( $cache = &static::stc_cache( __FUNCTION__ ) ) ) {
			$cache                  = (object) [ 'can' => [] ];
			$cache->disable_classes = mb_strtolower( (string) ini_get( 'disable_classes' ) );
			$cache->disable_classes = preg_split( '/[\s,]+/u', $cache->disable_classes, -1, PREG_SPLIT_NO_EMPTY );
		}
		$_classes = array_map( 'mb_strtolower', $classes );

		foreach ( $_classes as $_class ) {
			if ( ! $_class ) {
				continue; // Empty.
			}
			if ( isset( $cache->can[ $_class ] ) ) {
				if ( false === $cache->can[ $_class ] ) {
					return $cache->can[ $_class ];
				}
				continue; // ↑ Cached already.
			}
			if ( ! class_exists( $_class ) || in_array( $_class, $cache->disable_classes, true ) ) {
				return $cache->can[ $_class ] = false;
			}
			$_parent_classes = class_parents( $_class );
			$_parent_classes = array_map( 'mb_strtolower', $_parent_classes );

			foreach ( $_parent_classes as $_parent_class ) {
				if ( ! class_exists( $_parent_class ) || in_array( $_parent_class, $cache->disable_classes, true ) ) {
					return $cache->can[ $_class ] = false;
				}
			}
			$cache->can[ $_class ] = true; // ←↑ Adds to cache.
		}
		return true;
	}

	/**
	 * Can use function(s)?
	 *
	 * @since 2021-12-18
	 *
	 * @param string ...$functions Function(s).
	 *
	 * @return bool True if all functions are useable.
	 *
	 * @see   https://www.php.net/manual/en/ini.core.php#ini.disable-functions
	 * @see   https://php.watch/versions/8.0/disable_functions-redeclare
	 */
	public static function can_use_function( string ...$functions ) : bool {
		if ( null === ( $cache = &static::stc_cache( __FUNCTION__ ) ) ) {
			$cache                    = (object) [ 'can' => [] ];
			$cache->disable_functions = mb_strtolower( (string) ini_get( 'disable_functions' ) );
			$cache->disable_functions = preg_split( '/[\s,]+/u', $cache->disable_functions, -1, PREG_SPLIT_NO_EMPTY );

			// These are not really functions, they're language constructs. ☜(▀̿ ͜▀̿ ̿)
			// `function_exists()` returns `false`, but we're returning `true` here.
			$cache->language_constructs = [
				'__halt_compiler',
				'die',
				'echo',
				'empty',
				'eval',
				'exit',
				'include_once',
				'include',
				'isset',
				'list',
				'print',
				'require_once',
				'require',
				'return',
				'unset',
			];
		}
		$_functions = array_map( 'mb_strtolower', $functions );

		foreach ( $_functions as $_function ) {
			if ( ! $_function ) {
				continue; // Nothing to check.
			}
			if ( isset( $cache->can[ $_function ] ) ) {
				if ( false === $cache->can[ $_function ] ) {
					return $cache->can[ $_function ];
				}
				continue; // ↑ Cached already.
			}
			if ( in_array( $_function, $cache->language_constructs, true ) ) {
				$cache->can[ $_function ] = true; // ← Add to cache.
				continue;                         // Always available.
			}
			if ( ! function_exists( $_function ) || in_array( $_function, $cache->disable_functions, true ) ) {
				return $cache->can[ $_function ] = false;
			}
			$cache->can[ $_function ] = true; // ←↑ Adds to cache.
		}
		return true;
	}

	/**
	 * Sets time limit for script execution.
	 *
	 * @since 2021-12-15
	 *
	 * @param int $limit Time limit in seconds. `0` = no time limit.
	 *
	 * @return bool True if time limit set successfully.
	 *
	 * @see   https://www.php.net/manual/en/function.set-time-limit.php
	 * @see   https://www.php.net/manual/en/info.configuration.php#ini.max-execution-time
	 */
	public static function set_time_limit( int $limit ) : bool {
		if ( ! U\Env::can_use_function( 'set_time_limit' ) ) {
			return false; // Not possible.
		}
		try {                              // Catch any issues.
			set_time_limit( $limit );      // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
			return true;                   // NOTE: `set_time_limit()`'s return value is unreliable.
			// In recent tests on macOS `set_time_limit()` consistently returned `false`, yet was consistently effective.
		} catch ( \Throwable $throwable ) {
			return false; // Fail gracefully.
		}
	}

	/**
	 * Configures testing mode.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $type Optional testing tool or framework.
	 *                     e.g., `phpunit`. Default is `unknown`.
	 *
	 * @return bool True if testing mode configured successfully.
	 */
	public static function config_testing_mode( string $type = '' ) : bool {
		return (bool) U\Env::static_var( 'TESTING', $type ?: 'unknown' );
	}

	/**
	 * Configures debugging mode.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $type Optional debugging tool or framework.
	 *                     e.g., `xdebug`. Default is `unknown`.
	 *
	 * @return bool True if debugging mode configured successfully.
	 */
	public static function config_debugging_mode( string $type = '' ) : bool {
		if ( U\Env::is_wordpress() ) {
			return U\Env::maybe_define( 'WP_DEBUG', true )
				&& U\Env::maybe_define( 'WP_DEBUG_LOG', true )
				&& U\Env::maybe_define( 'WP_DEBUG_DISPLAY', true )
				&& false !== ini_set( 'zend.assertions', '1' )   // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& false !== ini_set( 'assert.exception', '1' ) // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& U\Env::static_var( 'DEBUGGING', $type ?: 'unknown' );
		} else {
			error_reporting( E_ALL );

			$php_errors_file = '/tmp/php-errors.log';
			$php_errors_dir  = U\Dir::name( $php_errors_file );

			if ( // Test ideal location.
				is_dir( $php_errors_dir )
				&& (
					is_writable( $php_errors_file )
					|| ( ! U\Fs::path_exists( $php_errors_file )
						&& is_writable( $php_errors_dir ) )
				)
			) {
				$error_log = $php_errors_file; // Use ideal location.
			} else {
				$error_log = U\Dir::join( U\Dir::sys_temp(), '/' . basename( $php_errors_file ) );
			}
			return false !== ini_set( 'error_log', $error_log )  // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& false !== ini_set( 'log_errors', '1' )        // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& false !== ini_set( 'display_errors', '1' )    // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& false !== ini_set( 'zend.assertions', '1' )   // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& false !== ini_set( 'assert.exception', '1' )  // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& U\Env::static_var( 'DEBUGGING', $type ?: 'unknown' );
		}
	}

	/**
	 * Configures robot directives w/ WordPress compat.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $config Configuration array (associative).
	 *                      e.g., `[ 'noindex' => true, 'follow' => true ]`.
	 *                      e.g., `[ 'max-image-preview' => 'standard' ]`.
	 *
	 * @return bool True if robot directives configured successfully.
	 *
	 * @see   https://o5p.me/F62KS1 WordPress source code for `wp_robots` filter.
	 * @see   https://o5p.me/R99lRZ Google article about `robots.txt` and `x-robots-tag` header.
	 */
	public static function config_robots( array $config ) : bool {
		$directives = []; // Initialize.

		foreach ( $config as $_directive => $_value ) {
			if ( ! is_string( $_directive ) ) {
				continue; // Invalid.
			}
			if ( is_string( $_value ) ) {
				$directives[] = $_directive . ':' . $_value;
			} elseif ( $_value ) {
				$directives[] = $_directive;
			}
		} // `$robots` and `$directives` (may need both).

		if ( U\Env::is_wordpress() ) {
			$set_headers = null; // Initialize.

			if ( ! headers_sent() ) {
				$set_headers = true;
				header( 'x-robots-tag: ' . implode( ', ', $directives ) );
			}
			$added_filter = add_filter(
				'wp_robots', // {@see https://o5p.me/oFOH8v}
				fn( array $wp_robots ) => array_merge( $wp_robots, $config ),
				12 // Hook priority.
			);
			return $set_headers && $added_filter
				&& U\Env::static_var( 'ROBOTS', $directives );
		} else {
			$set_headers = null; // Initialize.

			if ( ! headers_sent() ) {
				$set_headers = true;
				header( 'x-robots-tag: ' . implode( ', ', $directives ) );
			}
			return $set_headers && U\Env::static_var( 'ROBOTS', $directives );
		}
	}

	/**
	 * Disables robots w/ WordPress compat.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if robots disabled successfully.
	 */
	public static function disable_robots() : bool {
		return U\Env::config_robots( [ 'noindex' => true ] );
	}

	/**
	 * Disables caching w/ WordPress compat.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if caching disabled successfully.
	 */
	public static function disable_caching() : bool {
		if ( U\Env::is_wordpress() ) {
			$defined_constants
				= U\Env::maybe_define( 'DONOTCACHEPAGE', true )
				&& U\Env::maybe_define( 'DONOTCACHEOBJECT', true )
				&& U\Env::maybe_define( 'DONOTCACHEDB', true );

			$set_headers = null; // Initialize.

			if ( function_exists( 'nocache_headers' ) ) {
				$set_headers = ! headers_sent() && 'nill' !== nocache_headers();
			}
			return $defined_constants && $set_headers
				&& false === U\Env::static_var( 'CACHE', false );
		} else {
			$set_headers = null; // Initialize.

			if ( ! headers_sent() ) {
				$set_headers = true;
				header_remove( 'last-modified' );
				header( 'expires: Wed, 11 Jan 1984 05:00:00 GMT' );
				header( 'cache-control: no-cache, must-revalidate, max-age=0' );
			}
			return $set_headers && false === U\Env::static_var( 'CACHE', false );
		}
	}

	/**
	 * Disables GZIP compression.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if GZIP disabled successfully.
	 *
	 * @note  You may need to set `content-encoding`, `transfer-encoding`, or `content-transfer-encoding`
	 *        headers after calling this method. They are all forced to default values here.
	 *
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding
	 * @see   https://www.w3.org/Protocols/rfc1341/5_Content-Transfer-Encoding.html
	 *
	 * @see   https://stackoverflow.com/a/11664307/1219741
	 * @see   https://www.php.net/manual/en/function.headers-sent.php
	 * @see   https://www.php.net/manual/en/function.apache-setenv.php
	 * @see   https://www.php.net/manual/en/zlib.configuration.php#ini.zlib.output-compression
	 */
	public static function disable_gzip() : bool {
		try { // Catch any issues.
			$apache_setenv_response = null;
			$set_headers            = null;

			if ( ! headers_sent() ) {
				$set_headers // If all of these are true.
					= 'nill' !== header( 'content-encoding: none' )
					&& 'nill' !== header( 'transfer-encoding: binary' )
					&& 'nill' !== header( 'content-transfer-encoding: binary' )
					// This also requires that headers not be sent yet, else it triggers a warning.
					&& false !== ini_set( 'zlib.output_compression', 'off' ); // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
			}
			if ( U\Env::can_use_function( 'apache_setenv' ) ) {
				/** @noinspection PhpUndefinedFunctionInspection */        // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				$apache_setenv_response = apache_setenv( 'no-gzip', '1' ); // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
			}
			return $set_headers && false !== $apache_setenv_response;

		} catch ( \Throwable $throwable ) {
			return false; // Fail gracefully.
		}
	}

	/**
	 * Closes an open session.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if no session open, or closed successfully.
	 */
	public static function close_session() : bool {
		if ( ! extension_loaded( 'session' ) ) {
			return false; // Not possible.
		}
		if ( ! U\Env::can_use_function( 'session_status', 'session_write_close' ) ) {
			return false; // Not possible.
		}
		try { // Catch any issues.
			return ! headers_sent() // Headers must not have been sent yet.
				&& ( PHP_SESSION_ACTIVE !== session_status() || session_write_close() );
		} catch ( \Throwable $throwable ) {
			return false; // Fail gracefully.
		}
	}

	/**
	 * Ends output buffering.
	 *
	 * @since 2021-12-15
	 *
	 * @param int|null $keep_ob_level Base output buffering level. Default is `0` (i.e., end all output buffers).
	 *                                Set to something higher (e.g., `1`) to end output buffers up to,
	 *                                but excluding, a different level, which you'd like to keep.
	 *
	 * @return bool True if output buffering ended successfully.
	 *
	 * @see   https://www.php.net/manual/en/function.ob-end-clean.php
	 */
	public static function end_output_buffering( /* int|null */ ?int $keep_ob_level = null ) : bool {
		$keep_ob_level ??= ( 'phpunit' === U\Env::static_var( 'TESTING' ) ? 1 : 0 );
		$keep_ob_level = max( 0, $keep_ob_level ); // Guard against infinite loop below.

		try { // Catch any issues.
			while ( ob_get_level() !== $keep_ob_level ) {
				if ( ! ob_end_clean() ) {
					return false; // Special buffers exist ☜(▀̿ ͜▀̿ ̿).
				}
			}
			return true;
		} catch ( \Throwable $throwable ) {
			return false; // Fail gracefully.
		}
	}

	/**
	 * Prepares for special output via PHP.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if everything prepped successfully.
	 */
	public static function prep_for_special_output() : bool {
		return U\Env::disable_gzip()
			&& U\Env::close_session()
			&& U\Env::end_output_buffering();
	}

	/**
	 * Prepares for a file download via PHP.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if everything prepped successfully.
	 */
	public static function prep_for_file_download() : bool {
		return U\Env::prep_for_special_output()
			&& U\Env::set_time_limit( 900 )
			&& U\Env::disable_caching()
			&& U\Env::disable_robots();
	}
}
