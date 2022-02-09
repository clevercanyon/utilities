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
	 * Hash at custom length (`x` prefix).
	 *
	 * Hexadecimal alphabet consists of 16 bytes: `0123456789abcdef`.
	 *
	 *   16^31 (32 bytes - 1(x)) = 21267647932558653966460912964485513216 possibilities.
	 *   16^23 (24 bytes - 1(x)) = 4951760157141521099596496896 possibilities.
	 *   16^15 (16 bytes - 1(x)) = 1152921504606846976 possibilities.
	 *   16^11 (12 bytes - 1(x)) = 17592186044416 possibilities.
	 *
	 * @since 2022-01-05
	 *
	 * @param string $str    String to hash.
	 * @param int    $length Length of the hash. Default is `16`.
	 *                       Must be in the range of `12-129`. Shorter = more collisions.
	 *
	 *                       * One of the bytes will be the leading `x` prefix.
	 *                         So at 16 bytes you'll get `x` + 15 hexits from hashing.
	 *                         e.g., `xec457d0a974c48d`.
	 *
	 * @return string Hash at requested length; always beginning with an `x`.
	 *
	 *                * Always starts with an `x`. The rest are hexits.
	 *                  Hexits being `[0-9a-f]` (hexadecimals).
	 *
	 * @see   https://simple.wikipedia.org/wiki/Hexadecimal
	 * @see   https://www.php.net/manual/en/function.hash.php
	 * @see   https://www.php.net/manual/en/function.hash.php#104987
	 */
	public static function x_sha( string $str, int $length = 16 ) : string {
		$x      = 1; // `x` byte length.
		$length = min( 129, max( 12, $length ) );

		if ( $length - $x <= 40 ) {
			$algo = 'sha1';
		} elseif ( $length - $x <= 64 ) {
			$algo = 'sha256';
		} elseif ( $length - $x <= 96 ) {
			$algo = 'sha384';
		} else {              // Default.
			$algo = 'sha512'; // 128 bytes.
		}
		return 'x' . mb_substr( hash( $algo, $str ), 0, $length - $x );
	}

	/**
	 * Hash HMAC at custom length (`x` prefix).
	 *
	 * Hexadecimal alphabet consists of 16 bytes: `0123456789abcdef`.
	 *
	 *   16^31 (32 bytes - 1(x)) = 21267647932558653966460912964485513216 possibilities.
	 *   16^23 (24 bytes - 1(x)) = 4951760157141521099596496896 possibilities.
	 *   16^15 (16 bytes - 1(x)) = 1152921504606846976 possibilities.
	 *   16^11 (12 bytes - 1(x)) = 17592186044416 possibilities.
	 *
	 * @since 2022-01-05
	 *
	 * @param string $str    String to hash.
	 * @param string $key    HMAC secret key.
	 * @param int    $length Length of the hash. Default is `16`.
	 *                       Must be in the range of `12-129`. Shorter = more collisions.
	 *
	 *                       * One of the bytes will be the leading `x` prefix.
	 *                         So at 16 bytes you'll get `x` + 15 hexits from hashing.
	 *                         e.g., `xec457d0a974c48d`.
	 *
	 * @return string Hash HMAC at requested length; always beginning with an `x`.
	 *
	 *                * Always starts with an `x`. The rest are hexits.
	 *                  Hexits being `[0-9a-f]` (hexadecimals).
	 *
	 * @see   https://simple.wikipedia.org/wiki/Hexadecimal
	 * @see   https://www.php.net/manual/en/function.hash-hmac.php
	 * @see   https://www.php.net/manual/en/function.hash.php#104987
	 */
	public static function x_sha_hmac( string $str, string $key, int $length = 16 ) : string {
		$x      = 1; // `x` byte length.
		$length = min( 129, max( 12, $length ) );

		if ( $length - $x <= 40 ) {
			$algo = 'sha1';
		} elseif ( $length - $x <= 64 ) {
			$algo = 'sha256';
		} elseif ( $length - $x <= 96 ) {
			$algo = 'sha384';
		} else {              // Default.
			$algo = 'sha512'; // 128 bytes.
		}
		return 'x' . mb_substr( hash_hmac( $algo, $str, $key ), 0, $length - $x );
	}
}
