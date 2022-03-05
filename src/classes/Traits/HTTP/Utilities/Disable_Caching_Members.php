<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
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
namespace Clever_Canyon\Utilities\Traits\HTTP\Utilities;

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
 * @see   U\HTTP
 */
trait Disable_Caching_Members {
	/**
	 * Disables caching.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if caching disabled successfully.
	 */
	public static function disable_caching() : bool {
		return U\HTTP::cache_control( [
			'disable_page_cache'     => true,
			'disable_object_cache'   => true,
			'disable_database_cache' => true,

			'no_cache'        => true,
			'no_store'        => true,
			'must_revalidate' => true,
			'max_age'         => 0,
			's_maxage'        => 0,
		] );
	}

	/**
	 * Sets `cache-control` header and configures server.
	 *
	 * @since        2021-12-15
	 *
	 * @param array $config Cache-control configuration.
	 *
	 *     bool|null `disable_page_cache`     Default is `null`. Set as `true` to disable page caching.
	 *     bool|null `disable_object_cache`   Default is `null`. Set as `true` to disable object caching.
	 *     bool|null `disable_database_cache` Default is `null`. Set as `true` to disable database caching.
	 *
	 *     array `header` Defaults are all `null`; i.e., `cache-control` header is not set by default.
	 *                    To learn more about each of these; {@see https://o5p.me/AUuoEk}.
	 *
	 *         bool `public`                  Set as `true` to enable this flag.
	 *         bool `private`                 Set as `true` to enable this flag.
	 *         bool `no_cache`                Set as `true` to enable this flag.
	 *         bool `no_store`                Set as `true` to enable this flag.
	 *         bool `no_transform`            Set as `true` to enable this flag.
	 *         bool `must_revalidate`         Set as `true` to enable this flag.
	 *
	 *         int  `max_age`                 Set as max age, in seconds, to enable.
	 *         int  `s_maxage`                Set as max age, in seconds, to enable.
	 *         int  `stale_while_revalidate`  Set as stale time, in seconds, to enable.
	 *         int  `stale_if_error`          Set as stale time, in seconds, to enable.
	 *
	 * @return bool True if `cache-control` header set, and server configured successfully.
	 */
	public static function cache_control( array $config = [] ) : bool {
		$default_config = [
			'disable_page_cache'     => null,
			'disable_object_cache'   => null,
			'disable_database_cache' => null,

			'public'          => null,
			'private'         => null,
			'no_cache'        => null,
			'no_store'        => null,
			'no_transform'    => null,
			'must_revalidate' => null,

			'max_age'                => null,
			's_maxage'               => null,
			'stale_while_revalidate' => null,
			'stale_if_error'         => null,
		];
		$config         += $default_config; // Merge with defaults.

		$set_header           = function () use ( $config ) : bool {
			if ( headers_sent() ) {
				return false; // Not possible.
			}
			$directives = []; // Initialize.

			foreach ( [ 'public', 'private', 'no_cache', 'no_store', 'no_transform', 'must_revalidate' ] as $_flag ) {
				if ( true === $config[ $_flag ] ) {
					$directives[ $_flag ] = str_replace( '_', '-', $_flag );
				}
			}
			foreach ( [ 'max_age', 's_maxage', 'stale_while_revalidate', 'stale_if_error' ] as $_time ) {
				if ( is_numeric( $config[ $_time ] ) ) {
					$directives[ $_time ] = str_replace( '_', '-', $_flag ) . '=' . $config[ $_time ];
				}
			}
			if ( $directives ) {
				if ( isset( $directives[ 'no_store' ] ) ) {
					header_remove( 'etag' );
				}
				if ( isset( $directives[ 'max_age' ] ) ) {
					header_remove( 'expires' );
					header_remove( 'last-modified' );
				}
				header( 'cache-control: ' . implode( ', ', $directives ) );
			}
			return true; // Always true if we get this far.
		};
		$configure_server     = function () use ( $config ) : bool {
			$did_apache_setenv_no_cache = null;
			$did_set_litespeed_headers  = null;

			$did_set_wp_do_not_cache_page_constant   = null;
			$did_set_wp_do_not_cache_object_constant = null;
			$did_set_wp_do_not_cache_db_constant     = null;

			if ( U\Env::is_apache() ) {
				if ( $config[ 'disable_page_cache' ] && U\Env::can_use_function( 'apache_setenv' ) ) {
					/** @noinspection PhpUndefinedFunctionInspection */             // phpcs:ignore.
					$did_apache_setenv_no_cache = apache_setenv( 'no-cache', '1' ); // phpcs:ignore.
				}
			}
			if ( U\Env::is_litespeed() ) {
				if ( $config[ 'disable_page_cache' ] && ( $did_set_litespeed_headers = ! headers_sent() ) ) {
					header( 'x-litespeed-cache-control: no-cache, no-store, max-age=0, s-maxage=0' );
				}
			}
			if ( U\Env::is_wordpress() ) {
				if ( $config[ 'disable_page_cache' ] ) {
					$did_set_wp_do_not_cache_page_constant = U\Env::maybe_define( 'DONOTCACHEPAGE', true );
				}
				if ( $config[ 'disable_object_cache' ] ) {
					$did_set_wp_do_not_cache_object_constant = U\Env::maybe_define( 'DONOTCACHEOBJECT', true );
				}
				if ( $config[ 'disable_database_cache' ] ) {
					$did_set_wp_do_not_cache_db_constant = U\Env::maybe_define( 'DONOTCACHEDB', true );
				}
			}
			return false !== $did_apache_setenv_no_cache
				&& false !== $did_set_litespeed_headers
				&& false !== $did_set_wp_do_not_cache_page_constant
				&& false !== $did_set_wp_do_not_cache_object_constant
				&& false !== $did_set_wp_do_not_cache_db_constant;
		};
		$did_set_header       = $set_header();
		$did_configure_server = $configure_server();
		$did_set_static_var   = null !== U\Env::static_var( 'C10N_HTTP_CACHE_CONTROL', (object) $config );

		return $did_set_header
			&& $did_configure_server
			&& $did_set_static_var;
	}
}
