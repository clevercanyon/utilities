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
 * Declarations.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
// Global namespace for ESC polyfills.

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * WordPress provides.
 *
 * @since 2021-12-15
 */
if ( U\Env::is_wordpress() ) {
	return; // Not applicable.
}

/**
 * Global ESC functions.
 *
 * @since 2021-12-15
 */
if ( ! function_exists( 'esc_html' ) ) {
	/**
	 * Escapes a string for use in HTML.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $str Text {@see \esc_html()}.
	 *
	 * @return string Escaped string.
	 */
	function esc_html( string $str ) : string {
		return U\Str::esc_html( $str );
	}
}

if ( ! function_exists( 'esc_attr' ) ) {
	/**
	 * Escapes a string for use in HTML attributes.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $str Text {@see \esc_attr()}.
	 *
	 * @return string Escaped string.
	 */
	function esc_attr( string $str ) : string {
		return U\Str::esc_attr( $str );
	}
}

if ( ! function_exists( 'esc_url' ) ) {
	/**
	 * Escapes a string for use in HTML `src|href|...` attributes.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $str Text {@see \esc_url()}.
	 *
	 * @return string Escaped string.
	 */
	function esc_url( string $str ) : string {
		return U\Str::esc_url( $str );
	}
}

if ( ! function_exists( 'esc_textarea' ) ) {
	/**
	 * Escapes a string for use in HTML `textarea` tags.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $str Text {@see \esc_textarea()}.
	 *
	 * @return string Escaped string.
	 */
	function esc_textarea( string $str ) : string {
		return U\Str::esc_textarea( $str );
	}
}
