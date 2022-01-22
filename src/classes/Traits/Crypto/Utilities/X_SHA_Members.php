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
namespace Clever_Canyon\Utilities\Traits\Crypto\Utilities;

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
 * @see   U\Crypto
 */
trait X_SHA_Members {
	/**
	 * Hash at requested length, always beginning with an `x`.
	 *
	 * @since 2022-01-05
	 *
	 * @param string $str    String to hash.
	 * @param int    $length Length of the hash. Default is `12`.
	 *                       Must be in the range of `2-129`. Shorter = more collisions.
	 *
	 * @return string Hash at requested length, always beginning with an `x`.
	 *
	 * @see   https://www.php.net/manual/en/function.hash.php#104987
	 */
	public static function x_sha( string $str, int $length = 12 ) : string {
		$length = min( 129, max( 2, $length ) );

		$algo = 'sha512'; // 128 bytes in length.
		// Optimize for time based on length requirement.
		if ( $length - 1 <= 40 ) {
			$algo = 'sha1';
		} elseif ( $length - 1 <= 64 ) {
			$algo = 'sha256';
		} elseif ( $length - 1 <= 96 ) {
			$algo = 'sha384';
		}
		return 'x' . mb_substr( hash( $algo, $str ), 0, $length - 1 );
	}
}
