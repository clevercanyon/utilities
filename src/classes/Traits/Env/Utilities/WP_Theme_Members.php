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
trait WP_Theme_Members {
	/**
	 * Is a WordPress theme active?
	 *
	 * @since 2021-12-18
	 *
	 * @param string      $name Theme template|stylesheet name.
	 *
	 * @param string|null $type Can be set to `template` or `stylesheet`.
	 *                          Default is `null`; i.e., checks both template & stylsheet.
	 *
	 * @return bool `true` if WordPress theme template|stylesheet is active.
	 *              Returns `true` only if it is the current theme template|stylesheet.
	 */
	public static function is_wp_theme_active( string $name, /* string|null */ ?string $type = null ) : bool {
		static $is; // Memoize.

		if ( false === $is ) {
			return $is; // Saves time.
		}
		if ( ! U\Env::is_wordpress() ) {
			return $is = false;
		}
		$is          ??= []; // Initialize.
		$type        = $type && in_array( $type, [ 'template', 'stylesheet' ], true ) ? $type : '';
		$is[ $type ] ??= []; // Initialize names by `$type`.

		if ( isset( $is[ $type ][ $name ] ) ) {
			return $is[ $type ][ $name ]; // Saves time.
		}
		return $is[ $type ][ $name ] = in_array( $name, U\Env::wp_active_themes( $type ), true );
	}

	/**
	 * Is a WordPress theme network-active?
	 *
	 * @since 2021-12-18
	 *
	 * @param string $name Theme template|stylesheet name.
	 *
	 * @return bool `true` if WordPress theme template|stylesheet is network-active (i.e., enabled).
	 *              Does not return `true` if theme template|stylesheet is active otherwise whatsoever.
	 */
	public static function is_wp_theme_network_active( string $name ) : bool {
		static $is; // Memoize.

		if ( false === $is ) {
			return $is; // Saves time.
		}
		if ( ! U\Env::is_wordpress() ) {
			return $is = false;
		}
		$is ??= []; // Initialize.

		if ( isset( $is[ $name ] ) ) {
			return $is[ $name ]; // Saves time.
		}
		return $is[ $name ] = in_array( $name, U\Env::wp_network_active_themes(), true );
	}

	/**
	 * Gets WordPress active themes.
	 *
	 * @since 2021-12-18
	 *
	 * @param string|null $type Can be set to `template` or `stylesheet`.
	 *                          Default is `null`; i.e., both template & stylsheet.
	 *
	 * @return array WordPress active theme template, stylesheet, or both.
	 *               Return value is dependent on the value of `$type`.
	 */
	public static function wp_active_themes( /* string|null */ ?string $type = null ) : array {
		static $themes; // Memoize.

		if ( false === $themes ) {
			return []; // Saves time.
		}
		if ( ! U\Env::is_wordpress() ) {
			$themes = false; // Not possible.
			return [];       // Return empty array.
		}
		$themes ??= []; // Initialize themes by type.
		$type   = $type && in_array( $type, [ 'template', 'stylesheet' ], true ) ? $type : '';

		if ( isset( $themes[ $type ] ) ) {
			return $themes[ $type ]; // Saves time.
		}
		if ( ! $type ) { // Return all types.
			return $themes[ $type ] = array_unique( [ get_template(), get_stylesheet() ] );
		}
		return $themes[ $type ] = 'stylesheet' === $type ? [ get_stylesheet() ] : [ get_template() ];
	}

	/**
	 * Gets WordPress network-active themes.
	 *
	 * @since 2021-12-18
	 *
	 * @return string[] WordPress network-active themes.
	 *                  Returns active theme template|stylesheet names.
	 */
	public static function wp_network_active_themes() : array {
		static $themes; // Memoize.

		if ( null !== $themes ) {
			return $themes; // Saves time.
		}
		if ( ! U\Env::is_wordpress() || ! is_multisite() ) {
			return $themes = []; // Not possible.
		}
		return $themes = array_keys( array_filter( u\if_array( get_site_option( 'allowedthemes' ), [] ) ) );
	}
}
