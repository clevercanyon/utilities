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
trait WP_Plugin_Members {
	/**
	 * Is a WordPress plugin active?
	 *
	 * @since 2021-12-18
	 *
	 * @param string $subpath Plugin basename.
	 *
	 * @return bool `true` if WordPress plugin is active.
	 *              Returns `true` if active or network-active.
	 */
	public static function is_wp_plugin_active( string $subpath ) : bool {
		static $is; // Memoize.

		if ( false === $is ) {
			return $is; // Saves time.
		}
		if ( ! U\Env::is_wordpress() ) {
			return $is = false;
		}
		$is ??= []; // Initialize.

		if ( isset( $is[ $subpath ] ) ) {
			return $is[ $subpath ]; // Saves time.
		}
		return $is[ $subpath ] = is_plugin_active( $subpath );
	}

	/**
	 * Is a WordPress plugin network-active?
	 *
	 * @since 2021-12-18
	 *
	 * @param string $subpath Plugin basename.
	 *
	 * @return bool `true` if WordPress plugin is network-active.
	 *              Does not return `true` if plugin is active otherwise.
	 */
	public static function is_wp_plugin_network_active( string $subpath ) : bool {
		static $is; // Memoize.

		if ( false === $is ) {
			return $is; // Saves time.
		}
		if ( ! U\Env::is_wordpress() || ! is_multisite() ) {
			return $is = false; // Not applicable.
		}
		$is ??= []; // Initialize.

		if ( isset( $is[ $subpath ] ) ) {
			return $is[ $subpath ]; // Saves time.
		}
		return $is[ $subpath ] = is_plugin_active_for_network( $subpath );
	}

	/**
	 * Gets WordPress active plugins.
	 *
	 * @since 2021-12-18
	 *
	 * @return string[] WordPress active plugins.
	 *                  Returns plugin basenames; i.e., subpaths.
	 */
	public static function wp_active_plugins() : array {
		static $plugins; // Memoize.

		if ( null !== $plugins ) {
			return $plugins; // Saves time.
		}
		if ( ! U\Env::is_wordpress() ) {
			return $plugins = []; // Not applicable.
		}
		return $plugins = u\if_array( get_option( 'active_plugins' ), [] );
	}

	/**
	 * Gets WordPress network-active plugins.
	 *
	 * @since 2021-12-18
	 *
	 * @return string[] WordPress network-active plugins.
	 *                  Returns plugin basenames; i.e., subpaths.
	 */
	public static function wp_network_active_plugins() : array {
		static $plugins; // Memoize.

		if ( null !== $plugins ) {
			return $plugins; // Saves time.
		}
		if ( ! U\Env::is_wordpress() || ! is_multisite() ) {
			return $plugins = []; // Not applicable.
		}
		return $plugins = array_keys( u\if_array( get_site_option( 'active_sitewide_plugins' ), [] ) );
	}
}
