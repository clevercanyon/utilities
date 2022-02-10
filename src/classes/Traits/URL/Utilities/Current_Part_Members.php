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
namespace Clever_Canyon\Utilities\Traits\URL\Utilities;

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
 * @see   U\URL
 */
trait Current_Part_Members {
	/**
	 * Current referrer.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Current referrer.
	 */
	public static function current_referrer() : string {
		static $referrer; // Memoize.

		if ( null !== $referrer ) {
			return $referrer; // Saves time.
		}
		return $referrer = U\Env::var( 'HTTP_REFERER' );
	}

	/**
	 * Current scheme.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Current scheme.
	 */
	public static function current_scheme() : string {
		static $scheme; // Memoize.

		if ( null !== $scheme ) {
			return $scheme; // Saves time.
		}
		$is_https = // Any of these.
			'443' === U\Env::server_port()
			|| U\Bln::validate( U\Env::var( 'HTTPS' ) )
			|| 'https' === U\Env::var( 'HTTP_X_FORWARDED_PROTO' )
			|| false !== mb_stripos( U\Env::var( 'HTTP_CF_VISITOR' ), '"scheme":"https"' )
			|| ( U\Env::is_wordpress() && is_ssl() );

		return $scheme = $is_https ? 'https' : 'http';
	}

	/**
	 * Current host.
	 *
	 * - `example.com:443`.
	 * - `[2001:db8:85a3:8d3:1319:8a2e:370:7348]:443`.
	 *
	 * @since 2021-12-15
	 *
	 * @param bool $with_port Include port?
	 *                        Default is `true`.
	 *
	 * @return string Current host.
	 *
	 * @see   https://o5p.me/nui0ZU
	 */
	public static function current_host( bool $with_port = true ) : string {
		static $host = []; // Memoize.
		$with_port_key = (int) $with_port;

		if ( isset( $host[ $with_port_key ] ) ) {
			return $host[ $with_port_key ]; // Saves time.
		}
		$http_host = U\Env::var( 'HTTP_HOST' );

		if ( ! $with_port && false !== mb_strpos( $http_host, ':' ) ) {
			return $host[ $with_port_key ] = mb_strrchr( $http_host, ':', true );
		}
		return $host[ $with_port_key ] = $http_host;
	}

	/**
	 * Current root host.
	 *
	 * - `example.com:443`.
	 * - `[2001:db8:85a3:8d3:1319:8a2e:370:7348]:443`.
	 *
	 * @since 2021-12-15
	 *
	 * @param bool $with_port Include port? Default is `true`.
	 *
	 * @return string Current root host.
	 */
	public static function current_root_host( bool $with_port = true ) : string {
		static $root_host = []; // Memoize.
		$with_port_key = (int) $with_port;

		if ( isset( $root_host[ $with_port_key ] ) ) {
			return $root_host[ $with_port_key ]; // Saves time.
		}
		return $root_host[ $with_port_key ] = U\URL::root_host( '//' . U\URL::current_host(), $with_port );
	}

	/**
	 * Current port.
	 *
	 * - `example.com:443`.
	 * - `[2001:db8:85a3:8d3:1319:8a2e:370:7348]:443`.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Current port.
	 *
	 * @see   https://o5p.me/nui0ZU
	 */
	public static function current_port() : string {
		static $port; // Memoize.

		if ( null !== $port ) {
			return $port; // Saves time.
		}
		$host = U\URL::current_host();

		if ( false !== mb_strpos( $host, ':' ) ) {
			return $port = mb_substr( mb_strrchr( $host, ':' ), 1 );
		}
		return $port = '';
	}

	/**
	 * Current path.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Current path.
	 */
	public static function current_path() : string {
		static $path; // Memoize.

		if ( null !== $path ) {
			return $path; // Saves time.
		}
		return $path = U\URL::parse( U\Env::var( 'REQUEST_URI' ), PHP_URL_PATH );
	}

	/**
	 * Current query.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Current query.
	 */
	public static function current_query() : string {
		static $query; // Memoize.

		if ( null !== $query ) {
			return $query; // Saves time.
		}
		return $query = U\Env::var( 'QUERY_STRING' );
	}

	/**
	 * Current path & query.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Current path & query.
	 */
	public static function current_path_query() : string {
		static $path_query; // Memoize.

		if ( null !== $path_query ) {
			return $path_query; // Saves time.
		}
		return $path_query = U\Env::var( 'REQUEST_URI' );
	}

	/**
	 * Current URL.
	 *
	 * @since 2021-12-15
	 *
	 * @param bool $with_query Include query? Default is `true`.
	 *
	 * @return string Current URL.
	 */
	public static function current( bool $with_query = true ) : string {
		static $url = []; // Memoize.
		$with_query_key = (int) $with_query;

		if ( isset( $url[ $with_query_key ] ) ) {
			return $url[ $with_query_key ]; // Saves time.
		}
		return $url[ $with_query_key ] = U\URL::current_scheme() . '://' . U\URL::current_host() .
			( $with_query ? U\URL::current_path_query() : U\URL::current_path() );
	}
}
