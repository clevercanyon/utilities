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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait WP_Members {
	/**
	 * Is WordPress?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool `true` if WordPress.
	 */
	public static function is_wordpress() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = defined( 'WPINC' );
	}

	/**
	 * Gets WordPress version.
	 *
	 * @since 2021-12-18
	 *
	 * @return string WordPress version; else empty string.
	 */
	public static function wp_version() : string {
		return U\Env::is_wordpress() ? get_bloginfo( 'version' ) : '';
	}

	/**
	 * Is a specific WordPress host?
	 *
	 * @since 2022-03-12
	 *
	 * @param string $host Host to check.
	 *
	 * @return bool `true` if is WordPress host.
	 */
	public static function is_wp_host( string $host ) : bool {
		static $is; // Memoize.

		if ( false === $is ) {
			return $is; // Saves time.
		}
		if ( ! U\Env::is_wordpress() ) {
			return $is = false;
		}
		$blog_id = get_current_blog_id();
		$host    = mb_strtolower( $host );

		if ( isset( $is[ $blog_id ][ $host ] ) ) {
			return $is[ $blog_id ][ $host ]; // Saves time.
		}
		$is             ??= []; // Initialize.
		$is[ $blog_id ] ??= []; // Initialize.

		if ( ! $wp_home = U\URL::parse( home_url() ) ) {
			return $is[ $blog_id ][ $host ] = false;
		}
		if ( false !== mb_strpos( $host, ':' ) ) {
			return $is[ $blog_id ][ $host ] = $wp_home[ 'host' ] . ':' . $wp_home[ 'port' ] === $host;
		} else {
			return $is[ $blog_id ][ $host ] = $wp_home[ 'host' ] === $host;
		}
	}
}
