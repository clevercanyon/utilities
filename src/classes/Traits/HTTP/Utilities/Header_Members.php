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
trait Header_Members {
	/**
	 * Gets the value of an existing response header.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $header Header name.
	 *
	 * @return string|null String value if header is set already; else `null`.
	 *                     It is possible for this to return an empty string, but still be `true`.
	 *                     Use `! is_null()` to test for a true return value from this function.
	 */
	public static function response_header( string $header ) /* : string|null */ : ?string {
		$header = trim( mb_strtolower( $header ), U\Str::TRIM_CHARS . ':' );

		foreach ( headers_list() as $_header ) {
			$_header_parts = explode( ':', $_header, 2 );
			$_header_name  = trim( mb_strtolower( $_header_parts[ 0 ] ) );
			$_header_value = trim( $_header_parts[ 1 ] ?? '' );

			if ( $_header_name === $header ) {
				return $_header_value;
			}
		}
		return null;
	}
}
