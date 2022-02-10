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
// Global namespace for i18n polyfills.

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
 * Global i18n functions.
 *
 * @since 2021-12-15
 */
if ( ! function_exists( '__' ) ) {
	/**
	 * Gets translated string.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \__()}.
	 *
	 * @return string Translated string.
	 */
	function __( string $text, ...$args ) : string {
		return $text;
	}
}

if ( ! function_exists( '_e' ) ) {
	/**
	 * Echoes translated string.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \_e()}.
	 */
	function _e( string $text, ...$args ) : void { // phpcs:ignore -- output ok.
		echo $text;                                // phpcs:ignore -- output ok.
	}
}

if ( ! function_exists( '_x' ) ) {
	/**
	 * Gets translated string (w/ gettext context).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \_x()}.
	 *
	 * @return string Translated string.
	 */
	function _x( string $text, ...$args ) : string {
		return $text;
	}
}

if ( ! function_exists( '_ex' ) ) {
	/**
	 * Echoes translated string (w/ gettext context).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \_ex()}.
	 */
	function _ex( string $text, ...$args ) : void { // phpcs:ignore -- output ok.
		echo $text;                                 // phpcs:ignore -- output ok.
	}
}

if ( ! function_exists( '_n' ) ) {
	/**
	 * Gets translated string; singular or plural; based on number.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $singular Singular text.
	 * @param string $plural   Plural text.
	 * @param int    $number   Number of something.
	 * @param mixed  ...$args  {@see \_n()}.
	 *
	 * @return string Translated string.
	 */
	function _n( string $singular, string $plural, int $number, ...$args ) : string {
		return 0 === $number || $number > 1 ? $plural : $singular;
	}
}

if ( ! function_exists( '_nx' ) ) {
	/**
	 * Gets translated string; singular or plural; based on number (w/ gettext context).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $singular Singular text.
	 * @param string $plural   Plural text.
	 * @param int    $number   Number of something.
	 * @param mixed  ...$args  {@see \_nx()}.
	 *
	 * @return string Translated string.
	 */
	function _nx( string $singular, string $plural, int $number, ...$args ) : string {
		return 0 === $number || $number > 1 ? $plural : $singular;
	}
}

if ( ! function_exists( '_n_noop' ) ) {
	/**
	 * Gets translation data, but does not translate.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $singular Singular text.
	 * @param string      $plural   Plural text.
	 * @param string|null $domain   Text domain (optional).
	 *
	 * @return array Translation info; suitable for {@see translate_nooped_plural()}.
	 *
	 * @see   _nx_noop()
	 * @see   \_n_noop()
	 * @see   translate_nooped_plural()
	 * @see   \translate_nooped_plural()
	 */
	function _n_noop( string $singular, string $plural, /* string|null */ ?string $domain = null ) : array {
		return [
			0          => $singular,
			1          => $plural,
			'singular' => $singular,
			'plural'   => $plural,
			'context'  => null,
			'domain'   => $domain,
		];
	}
}

if ( ! function_exists( '_nx_noop' ) ) {
	/**
	 * Gets translation data (w/ gettext context), but does not translate.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $singular Singular text.
	 * @param string      $plural   Plural text.
	 * @param string      $context  Context.
	 * @param string|null $domain   Text domain (optional).
	 *
	 * @return array Translation info; suitable for {@see translate_nooped_plural()}.
	 *
	 * @see   _n_noop()
	 * @see   \_nx_noop()
	 * @see   translate_nooped_plural()
	 * @see   \translate_nooped_plural()
	 */
	function _nx_noop( string $singular, string $plural, string $context, /* string|null */ ?string $domain = null ) : array {
		return [
			0          => $singular,
			1          => $plural,
			2          => $context,
			'singular' => $singular,
			'plural'   => $plural,
			'context'  => $context,
			'domain'   => $domain,
		];
	}
}

if ( ! function_exists( 'translate_nooped_plural' ) ) {
	/**
	 * Gets translated string; singular or plural; based on number; using data from: {@see _n_noop()}, {@see _nx_noop()}.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $noop_data {@see _n_noop()}, {@see _nx_noop()}.
	 * @param int   $number    Number of something.
	 * @param mixed ...$args   {@see \translate_nooped_plural()}.
	 *
	 * @return string Translated string.
	 *
	 * @see   _n_noop()
	 * @see   \_n_noop()
	 * @see   _nx_noop()
	 * @see   \_nx_noop()
	 * @see   \translate_nooped_plural()
	 */
	function translate_nooped_plural( array $noop_data, int $number, /* mixed */ ...$args ) : string {
		return 0 === $number || $number > 1 ? $noop_data[ 'plural' ] : $noop_data[ 'singular' ];
	}
}

if ( ! function_exists( 'esc_html__' ) ) {
	/**
	 * Gets translated string (HTML-escaped).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \esc_html__()}.
	 *
	 * @return string Translated string (HTML-escaped).
	 */
	function esc_html__( string $text, ...$args ) : string {
		return U\Str::esc_html( $text );
	}
}

if ( ! function_exists( 'esc_html_e' ) ) {
	/**
	 * Echoes translated string (HTML-escaped).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \esc_html_e()}.
	 */
	function esc_html_e( string $text, ...$args ) : void {
		echo U\Str::esc_html( $text ); // phpcs:ignore -- output ok.
	}
}

if ( ! function_exists( 'esc_html_x' ) ) {
	/**
	 * Gets translated string (HTML-escaped; w/ gettext content).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \esc_html_x()}.
	 *
	 * @return string Translated string (HTML-escaped).
	 */
	function esc_html_x( string $text, ...$args ) : string {
		return U\Str::esc_html( $text );
	}
}

if ( ! function_exists( 'esc_attr__' ) ) {
	/**
	 * Gets translated string (HTML attribute-escaped).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \esc_attr__()}.
	 *
	 * @return string Translated string (HTML attribute-escaped).
	 */
	function esc_attr__( string $text, ...$args ) : string {
		return U\Str::esc_attr( $text );
	}
}

if ( ! function_exists( 'esc_attr_e' ) ) {
	/**
	 * Echoes translated string (HTML attribute-escaped).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \esc_attr_e()}.
	 */
	function esc_attr_e( string $text, ...$args ) : void {
		echo U\Str::esc_attr( $text ); // phpcs:ignore -- output ok.
	}
}

if ( ! function_exists( 'esc_attr_x' ) ) {
	/**
	 * Gets translated string (HTML attribute-escaped; with gettext content).
	 *
	 * @since 2021-12-15
	 *
	 * @param string $text    Text.
	 * @param mixed  ...$args {@see \esc_attr_x()}.
	 *
	 * @return string Translated string (HTML attribute-escaped).
	 */
	function esc_attr_x( string $text, ...$args ) : string {
		return U\Str::esc_attr( $text );
	}
}
