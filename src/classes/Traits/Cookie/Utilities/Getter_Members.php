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
namespace Clever_Canyon\Utilities\Traits\Cookie\Utilities;

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
 * @see   U\Cookie
 */
trait Getter_Members {
	/**
	 * Gets a cookie value.
	 *
	 * @since 2022-04-25
	 *
	 * @param string $name Cookie name.
	 *
	 * @returns ?string Cookie value; else `null`.
	 */
	public static function get( string $name ) /* : string|null */ : ?string {
		if ( ! isset( $_COOKIE[ $name ] ) ) {
			return null; // Not available.
		}
		$_c = &$_COOKIE; // phpcs:ignore.
		return trim( stripslashes( (string) $_c[ $name ] ) );
	}

	/**
	 * Current cookie vars.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $names Cookie var names.
	 *
	 * @return array Current cookie vars.
	 */
	public static function vars( array $names = [] ) : array {
		$_c          = &$_COOKIE; // phpcs:ignore.
		$cookie_vars = U\Bundle::map( [ 'trim', 'stripslashes', 'strval' ], $_c );

		if ( ! $names ) {
			return $cookie_vars;
		}
		$vars = []; // Initialize.

		foreach ( $cookie_vars as $_key => $_value ) {
			if ( in_array( $_key, $names, true ) ) {
				$vars[ $_key ] = $_value;
			}
		}
		return $vars;
	}
}
