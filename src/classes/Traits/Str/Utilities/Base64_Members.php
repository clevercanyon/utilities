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
trait Base64_Members {
	/**
	 * Produces a URL-safe base-64 encoded string.
	 *
	 * @since 2022-02-02
	 *
	 * @param string $str String to encode.
	 *
	 * @return string URL-safe base-64 encoded string.
	 */
	public static function base64_encode( string $str ) : string {
		return str_replace( [ '+', '/', '=' ], [ '-', '_', '' ], base64_encode( $str ) );
	}

	/**
	 * Decodes a URL-safe base-64 encoded string.
	 *
	 * @since 2022-02-02
	 *
	 * @param string $str String to decode.
	 *
	 * @return string|null Decoded string; else `null` on failure.
	 */
	public static function base64_decode( string $str ) : ?string {
		$decoded = base64_decode( str_replace( [ '-', '_' ], [ '+', '/' ], $str ) );
		return false === $decoded ? null : $decoded;
	}
}
