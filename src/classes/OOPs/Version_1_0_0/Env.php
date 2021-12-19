<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

/**
 * Environment.
 *
 * @since 1.0.0
 */
class Env extends Base {
	/**
	 * Is WordPress?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if WordPress.
	 */
	public static function is_wp() : bool {
		return defined( 'WPINC' );
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
		if ( null === ( $cache = &static::oops_cache( __FUNCTION__ ) ) ) {
			$cache                  = (object) [ 'can' => [] ];
			$cache->disable_classes = mb_strtolower( (string) ini_get( 'disable_classes' ) );
			$cache->disable_classes = preg_split( '/[\s,]+/u', $cache->disable_classes, -1, PREG_SPLIT_NO_EMPTY );
		}
		$_classes = array_map( 'mb_strtolower', $classes );

		foreach ( $_classes as $_class ) {
			if ( isset( $cache->can[ $_class ] ) ) {
				if ( false === $cache->can[ $_class ] ) {
					return $cache->can[ $_class ];
				}
				continue; // ↑ Cached already.
			}
			$_class_members = array_merge( [ $_class ], class_parents( $_class ) ?: [] );
			$_class_members = array_map( 'mb_strtolower', $_class_members );

			foreach ( $_class_members as $_class_member ) {
				if ( ! class_exists( $_class_member ) || in_array( $_class_member, $cache->disable_classes, true ) ) {
					return $cache->can[ $_class ] = false;
				}
				$cache->can[ $_class ] = true; // ←↑ Adds to cache.
			}
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
	 */
	public static function can_use_func( string ...$functions ) : bool {
		if ( null === ( $cache = &static::oops_cache( __FUNCTION__ ) ) ) {
			$cache                    = (object) [ 'can' => [] ];
			$cache->disable_functions = mb_strtolower( (string) ini_get( 'disable_functions' ) );
			$cache->disable_functions = preg_split( '/[\s,]+/u', $cache->disable_functions, -1, PREG_SPLIT_NO_EMPTY );
		}
		$_functions = array_map( 'mb_strtolower', $functions );

		foreach ( $_functions as $_function ) {
			if ( isset( $cache->can[ $_function ] ) ) {
				if ( false === $cache->can[ $_function ] ) {
					return $cache->can[ $_function ];
				}
				continue; // ↑ Cached already.
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
	 * @since 1.0.0
	 *
	 * @param int $limit Time limit in seconds. `0` = no time limit.
	 *
	 * @return bool True if time limit set successfully.
	 *
	 * @see   https://www.php.net/manual/en/function.set-time-limit.php
	 * @see   https://www.php.net/manual/en/info.configuration.php#ini.max-execution-time
	 */
	public static function set_time_limit( int $limit ) : bool {
		if ( ! U\Env::can_use_func( 'set_time_limit' ) ) {
			return false; // Not possible.
		}
		try {                                // Catch any issues.
			return set_time_limit( $limit ); // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
		} catch ( \Throwable $throwable ) {
			return false; // Fail gracefully.
		}
	}

	/**
	 * Defines a constant, if not defined already.
	 *
	 * @since 1.0.0
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
	 * Disables robots via header.
	 *
	 * @since 1.0.0
	 *
	 * @param string $directives Default is `noindex, nofollow`.
	 *
	 * @return bool True if robots disabled successfully.
	 */
	public static function disable_robots( string $directives = 'noindex, nofollow' ) : bool {
		return ! headers_sent() && 'nill' !== header( 'x-robots-tag: ' . $directives );
	}

	/**
	 * Disables caching via headers/constants.
	 *
	 * @since 1.0.0
	 *
	 * @return bool True if caching disabled successfully.
	 */
	public static function disable_caching() : bool {
		$is_wp = U\Env::is_wp();

		if ( $is_wp ) {
			$defined_constants
				= U\Env::maybe_define( 'DONOTCACHEPAGE', true )
				&& U\Env::maybe_define( 'DONOTCACHEOBJECT', true )
				&& U\Env::maybe_define( 'DONOTCACHEDB', true );
		} else {
			$defined_constants = U\Env::maybe_define( 'DISABLE_CACHING', true );
		}

		if ( $is_wp && U\Env::can_use_func( 'nocache_headers' ) ) {
			$set_headers = ! headers_sent() && 'nill' !== nocache_headers();
			return $defined_constants && $set_headers;
		} else {
			if ( ! headers_sent() ) {
				$set_headers = true;
				header_remove( 'last-modified' );
				header( 'expires: Wed, 11 Jan 1984 05:00:00 GMT' );
				header( 'cache-control: no-cache, must-revalidate, max-age=0' );
			}
			return $defined_constants && $set_headers;
		}
	}

	/**
	 * Disables GZIP compression.
	 *
	 * @since 1.0.0
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
				$set_headers = true;
				header( 'content-encoding: none' );
				header( 'transfer-encoding: binary' );
				header( 'content-transfer-encoding: binary' );
			}
			if ( U\Env::can_use_func( 'apache_setenv' ) ) {
				$apache_setenv_response = apache_setenv( 'no-gzip', '1' ); // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
			}
			return false !== ini_set( 'zlib.output_compression', 'off' ) // phpcs:ignore -- ☜(▀̿ ͜▀̿ ̿) ok.
				&& false !== $apache_setenv_response
				&& $set_headers;
		} catch ( \Throwable $throwable ) {
			return false; // Fail gracefully.
		}
	}

	/**
	 * Closes an open session.
	 *
	 * @since 1.0.0
	 *
	 * @return bool True if no session open, or closed successfully.
	 */
	public static function close_session() : bool {
		if ( ! extension_loaded( 'session' ) ) {
			return false; // Not possible.
		}
		if ( ! U\Env::can_use_func( 'session_status', 'session_write_close' ) ) {
			return false; // Not possible.
		}
		try { // Catch any issues.
			return PHP_SESSION_ACTIVE !== session_status() || session_write_close();
		} catch ( \Throwable $throwable ) {
			return false; // Fail gracefully.
		}
	}

	/**
	 * Ends output buffering.
	 *
	 * @since 1.0.0
	 *
	 * @return bool True if output buffering ended successfully.
	 *
	 * @see   https://www.php.net/manual/en/function.ob-end-clean.php
	 */
	public static function end_output_buffering() : bool {
		try { // Catch any issues.
			while ( 0 !== ob_get_level() ) {
				if ( ! ob_end_clean() ) {
					return false; // Special buffer ☜(▀̿ ͜▀̿ ̿), can happen.
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
	 * @since 1.0.0
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
	 * @since 1.0.0
	 *
	 * @return bool True if everything prepped successfully.
	 */
	public static function prep_for_file_download() : bool {
		return U\Env::prep_for_special_output()
			&& U\Env::set_time_limit( 0 )
			&& U\Env::disable_caching()
			&& U\Env::disable_robots();
	}
}
