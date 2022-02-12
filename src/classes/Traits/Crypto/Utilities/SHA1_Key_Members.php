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
trait SHA1_Key_Members {
	/**
	 * Generates a SHA1 hash of any value.
	 *
	 * Hexadecimal alphabet consists of 16 bytes: `0123456789abcdef`.
	 *
	 *   16^40 (40 bytes) = 1461501637330902918203684832716283019655932542976 possibilities.
	 *
	 * @since 2022-01-05
	 *
	 * @param mixed $value Value to hash; serialized before hashing.
	 *
	 *                     * PHP does not allow a {@see \Closure} to be serialized whatsoever.
	 *                       Do not pass values containing a closure; either directly or indirectly.
	 *                       You can, however, pass a {@see U\Code_Stream_Closure}.
	 *
	 *                     * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                       Do not pass resource values, either directly or indirectly.
	 *                       Future versions of PHP will likely disallow altogether.
	 *
	 * @return string SHA1 hash; 40 bytes in length.
	 */
	public static function sha1_key( /* mixed */ $value ) : string {
		return sha1( U\Str::serialize( $value ) );
	}
}
