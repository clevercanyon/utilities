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
trait Encode_Decode_Members {
	/**
	 * Encodes a URL component.
	 *
	 * @since 2022-03-04
	 *
	 * @param string     $str      Component to encode.
	 * @param int|string $strategy Strategy. Default is {@see PHP_QUERY_RFC3986}.
	 *                             * Use {@see PHP_QUERY_RFC3986} for {@see rawurlencode()}.
	 *                             * Use {@see U\URL::QUERY_RFC3986_AWS4} for {@see rawurlencode()} with AWS v4 compat.
	 *                             * Use {@see PHP_QUERY_RFC1738} for {@see urlencode()}.
	 *
	 * @return string Encoded URL component string.
	 */
	public static function encode( string $str, /* int|string */ $strategy = PHP_QUERY_RFC3986 ) : string {
		switch ( true ) {
			case ( PHP_QUERY_RFC1738 === $strategy ):
				return urlencode( $str ); // phpcs:ignore -- `urlencode()` ok.

			case ( U\URL::QUERY_RFC3986_AWS4 === $strategy ):
				return str_replace( [ '%2D', '%2E', '%5F', '%7E' ], [ '-', '.', '_', '~' ], rawurlencode( $str ) );

			case ( PHP_QUERY_RFC3986 === $strategy ):
			default: // Default strategy.
				return rawurlencode( $str );
		}
	}

	/**
	 * Decodes a URL component.
	 *
	 * @since 2022-03-04
	 *
	 * @param string     $str      Component to decode.
	 * @param int|string $strategy Strategy. Default is {@see PHP_QUERY_RFC3986}.
	 *                             * Use {@see PHP_QUERY_RFC3986} for {@see rawurldecode()}.
	 *                             * Use {@see U\URL::QUERY_RFC3986_AWS4} for {@see rawurldecode()} with AWS v4 compat.
	 *                             * Use {@see PHP_QUERY_RFC1738} for {@see urldecode()}.
	 *
	 * @return string Decoded URL component string.
	 */
	public static function decode( string $str, /* int|string */ $strategy = PHP_QUERY_RFC3986 ) : string {
		switch ( true ) {
			case ( PHP_QUERY_RFC1738 === $strategy ):
				return urldecode( $str ); // phpcs:ignore -- `urldecode()` ok.

			case ( U\URL::QUERY_RFC3986_AWS4 === $strategy ):
			case ( PHP_QUERY_RFC3986 === $strategy ):
			default: // Default strategy.
				return rawurldecode( $str );
		}
	}
}
