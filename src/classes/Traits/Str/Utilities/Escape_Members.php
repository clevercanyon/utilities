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
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\Str\Utilities;

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
 * @see   U\Str
 */
trait Escape_Members {
	/**
	 * Escapes single quotes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_sq( string $str ) : string {
		return str_replace( "'", "\\'", $str );
	}

	/**
	 * Escapes double quotes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_dq( string $str ) : string {
		return str_replace( '"', '\\"', $str );
	}

	/**
	 * Escapes regexp dynamics.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str       String.
	 * @param string $delimiter Optional delimiter. Default is `/`.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_reg( string $str, string $delimiter = '/' ) : string {
		return preg_quote( $str, $delimiter );
	}

	/**
	 * Escapes regexp backreferences.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_reg_brs( string $str ) : string {
		return str_replace( [ '\\', '$' ], [ '\\\\', '\$' ], $str );
	}

	/**
	 * Escapes a string for use in HTML.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_html( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_html( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), false );
	}

	/**
	 * Escapes a string for use in HTML attributes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_attr( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_attr( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), false );
	}

	/**
	 * Escapes a string for use in HTML `src|href|...` attributes.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_url( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_url( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), false );
	}

	/**
	 * Escapes a string for use in HTML `textarea` tags.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string.
	 */
	public static function esc_textarea( string $str ) : string {
		return U\Env::is_wordpress()
			? esc_textarea( $str )
			: htmlspecialchars( $str, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, U\Env::charset(), true );
	}

	/**
	 * Escapes a string for use as a shell argument.
	 *
	 * On Windows, {@see escapeshellarg()} instead replaces percent signs, exclamation marks (delayed variable substitution)
	 * and double quotes with spaces; and adds double quotes around the string. Furthermore, each streak of
	 * consecutive backslashes (\) is escaped by one additional backslash.
	 *
	 * @since 2021-12-25
	 *
	 * @param string $str String.
	 *
	 * @return string Escaped string. It's actually an escaped and `'single-quoted'` string.
	 *
	 * @throws U\Fatal_Exception If {@see escapeshellarg()} is not available.
	 */
	public static function esc_shell_arg( string $str ) : string {
		if ( ! U\Env::can_use_function( 'escapeshellarg' ) ) {
			throw new U\Fatal_Exception( 'Unable to use PHP’s `escapeshellarg()` function. Disabled?' );
		}
		return escapeshellarg( $str );
	}
}
