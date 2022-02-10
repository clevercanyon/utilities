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
namespace Clever_Canyon\Utilities\Traits\Arr\Utilities;

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
 * @see   U\Arr
 */
trait Maybe_Prefix_Key_Members {
	/**
	 * Takes a desired key, a prefix, and returns shortest key available.
	 *
	 * @since 2021-12-29
	 *
	 * @param string|int $key         Desired key.
	 * @param array      $arr         Array to query.
	 * @param string     $prefix_char Optional prefix char. Default is `:`.
	 *                                If `$key` is not available we'll start prefixing.
	 *
	 * @return string Shortest key available.
	 */
	public static function maybe_prefix_key( /* string|int */ $key, array $arr, string $prefix_char = ':' ) : string {
		$starting_mb_strlen_key = mb_strlen( $key );

		while ( array_key_exists( $key, $arr ) ) {
			$key           = $prefix_char . $key;
			$mb_strlen_key = mb_strlen( $key );

			if ( $mb_strlen_key - $starting_mb_strlen_key > 32 || $mb_strlen_key > 512 ) {
				$key = $prefix_char . U\Crypto::uuid_v4() . $prefix_char . $key;
				break; // Let's not go on looking forever in an endless loop.
				// The `512` check also guards against keys growing way too long.
			}
		}
		return $key;
	}
}
