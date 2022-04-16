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
trait Cache_Control_Members {
	/**
	 * Enable caching.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True if caching enable successfully.
	 */
	public static function enable_caching() : bool {
		return U\HTTP::cache_control( [
			'public'                 => true,
			'must_revalidate'        => true,
			'max_age'                => 31536000,
			's_maxage'               => 31536000,
			'stale_while_revalidate' => 604800,
			'stale_if_error'         => 604800,
		] );
	}

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
			'no_store'               => true,
		] );
	}

	/**
	 * Sets `cache-control` header and/or disable flags.
	 *
	 * @since        2021-12-15
	 *
	 * @param array $config Cache-control configuration.
	 *
	 *     bool|null `disable_page_cache`         Set as `true` to disable page caching. Default is `null`.
	 *     bool|null `disable_object_cache`       Set as `true` to disable object caching. Default is `null`.
	 *     bool|null `disable_database_cache`     Set as `true` to disable database caching. Default is `null`.
	 *
	 *     Defaults are all `null`. `cache-control` not set by default.
	 *     To learn more about each of these; {@see https://o5p.me/AUuoEk}.
	 *
	 *     bool|null `public`                     Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `private`                    Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `no_cache`                   Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `no_store`                   Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `no_transform`               Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `must_revalidate`            Set as `true` to enable this flag. Default is `null`.
	 *
	 *     int|null  `max_age`                    Set as max age, in seconds, to enable. Default is `null`.
	 *     int|null  `s_maxage`                   Set as max age, in seconds, to enable. Default is `null`.
	 *     int|null  `stale_while_revalidate`     Set as stale time, in seconds, to enable. Default is `null`.
	 *     int|null  `stale_if_error`             Set as stale time, in seconds, to enable. Default is `null`.
	 *
	 *     Defaults are all `null`. `cdn-cache-control` not set by default.
	 *     To learn more about each of these; {@see https://o5p.me/AUuoEk}.
	 *
	 *     bool|null `cdn_public`                 Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `cdn_private`                Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `cdn_no_cache`               Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `cdn_no_store`               Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `cdn_no_transform`           Set as `true` to enable this flag. Default is `null`.
	 *     bool|null `cdn_must_revalidate`        Set as `true` to enable this flag. Default is `null`.
	 *
	 *     int|null  `cdn_max_age`                Set as max age, in seconds, to enable. Default is `null`.
	 *     int|null  `cdn_s_maxage`               Set as max age, in seconds, to enable. Default is `null`.
	 *     int|null  `cdn_stale_while_revalidate` Set as stale time, in seconds, to enable. Default is `null`.
	 *     int|null  `cdn_stale_if_error`         Set as stale time, in seconds, to enable. Default is `null`.
	 *
	 * @return bool True if `cache-control` header set, and server configured successfully.
	 */
	public static function cache_control( array $config = [] ) : bool {
		if ( headers_sent() ) {
			return false; // Not possible.
		}
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

			'cdn_public'          => null,
			'cdn_private'         => null,
			'cdn_no_cache'        => null,
			'cdn_no_store'        => null,
			'cdn_no_transform'    => null,
			'cdn_must_revalidate' => null,

			'cdn_max_age'                => null,
			'cdn_s_maxage'               => null,
			'cdn_stale_while_revalidate' => null,
			'cdn_stale_if_error'         => null,
		];
		$config         += $default_config; // Merge defaults.

		/**
		 * Sets `cache-control` header.
		 *
		 * @since 2022-04-15
		 *
		 * @return bool `true` on success.
		 */
		$set_header = function () use ( $config ) : bool {
			$directives = []; // Initialize.

			foreach ( [ 'public', 'private', 'no_cache', 'no_store', 'no_transform', 'must_revalidate' ] as $_flag ) {
				if ( true === $config[ $_flag ] ) {
					$directives[ $_flag ] = str_replace( '_', '-', $_flag );
				}
			}
			foreach ( [ 'max_age', 's_maxage', 'stale_while_revalidate', 'stale_if_error' ] as $_time ) {
				if ( is_numeric( $config[ $_time ] ) ) {
					$directives[ $_time ] = str_replace( '_', '-', $_time ) . '=' . $config[ $_time ];
				}
			}
			if ( $directives ) {
				header_remove( 'etag' );

				if ( isset( $directives[ 'max_age' ] ) ) {
					header_remove( 'expires' );
					header_remove( 'last-modified' );
				}
				header( 'cache-control: ' . implode( ', ', $directives ) );
			}
			return true; // Always true.
		};

		/**
		 * Sets `cdn-cache-control` header.
		 *
		 * @since 2022-04-15
		 *
		 * @return bool `true` on success.
		 */
		$set_cdn_header = function () use ( $config ) : bool {
			$directives = []; // Initialize.

			foreach ( [ 'cdn_public', 'cdn_private', 'cdn_no_cache', 'cdn_no_store', 'cdn_no_transform', 'cdn_must_revalidate' ] as $_flag ) {
				if ( true === $config[ $_flag ] ) {
					$directives[ $_flag ] = preg_replace( [ '/^cdn_/u', '/_/u' ], [ '', '-' ], $_flag );
				}
			}
			foreach ( [ 'cdn_max_age', 'cdn_s_maxage', 'cdn_stale_while_revalidate', 'cdn_stale_if_error' ] as $_time ) {
				if ( is_numeric( $config[ $_time ] ) ) {
					$directives[ $_time ] = preg_replace( [ '/^cdn_/u', '/_/u' ], [ '', '-' ], $_time ) . '=' . $config[ $_time ];
				}
			}
			if ( $directives ) {
				header( 'cdn-cache-control: ' . implode( ', ', $directives ) );

				if ( U\Env::is_litespeed() ) {
					header( 'x-litespeed-cache-control: ' . implode( ', ', $directives ) );
				}
			}
			return true; // Always true.
		};

		/**
		 * Sets disable flags.
		 *
		 * @since 2022-04-15
		 *
		 * @return bool `true` on success.
		 */
		$set_disable_flags = function () use ( $config ) : bool {
			if ( ! $config[ 'disable_page_cache' ]
				&& ! $config[ 'disable_object_cache' ]
				&& ! $config[ 'disable_database_cache' ] ) {
				return true; // Not applicable.
			}
			$did_set_cdn_headers        = null;
			$did_apache_setenv_no_cache = null;
			$did_set_litespeed_headers  = null;

			$did_set_wp_do_not_cache_page_constant   = null;
			$did_set_wp_do_not_cache_object_constant = null;
			$did_set_wp_do_not_cache_db_constant     = null;

			if ( $config[ 'disable_page_cache' ] ) {
				$did_set_cdn_headers = true;
				header( 'cdn-cache-control: no-store' );
			}
			if ( $config[ 'disable_page_cache' ] && U\Env::is_litespeed() ) {
				$did_set_litespeed_headers = true;
				header( 'x-litespeed-cache-control: no-store' );
			}
			if ( $config[ 'disable_page_cache' ] && U\Env::is_apache() ) {
				if ( U\Env::can_use_function( 'apache_setenv' ) ) {
					/** @noinspection PhpUndefinedFunctionInspection */             // phpcs:ignore.
					$did_apache_setenv_no_cache = apache_setenv( 'no-cache', '1' ); // phpcs:ignore.
				}
			}
			if ( U\Env::is_wordpress() ) { // Sets WordPress constants.
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
			return false !== $did_set_cdn_headers
				&& false !== $did_apache_setenv_no_cache
				&& false !== $did_set_litespeed_headers
				&& false !== $did_set_wp_do_not_cache_page_constant
				&& false !== $did_set_wp_do_not_cache_object_constant
				&& false !== $did_set_wp_do_not_cache_db_constant;
		};

		$did_set_header        = $set_header();
		$did_set_cdn_header    = $set_cdn_header();
		$did_set_disable_flags = $set_disable_flags();
		$did_set_static_var    = null !== U\Env::static_var( 'C10N_HTTP_CACHE_CONTROL', (object) $config );

		return $did_set_header
			&& $did_set_cdn_header
			&& $did_set_disable_flags
			&& $did_set_static_var;
	}
}
