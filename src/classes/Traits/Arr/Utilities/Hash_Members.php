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
trait Hash_Members {
	/**
	 * Gets an array's hash.
	 *
	 * @since 2022-01-15
	 *
	 * @param array $arr Array to hash.
	 *
	 * @return string The array's hash. 40 bytes in length.
	 */
	public static function hash( array $arr ) : string {
		return sha1( serialize( U\Arr::hash_helper( $arr ) ) ); // phpcs:ignore -- `serialize()` ok.
	}

	/**
	 * Helps get an array's hash.
	 *
	 * @since 2022-01-15
	 *
	 * @param array $arr Array to hash.
	 *
	 * @return array Output array for {@see U\Arr::hash()}.
	 */
	protected static function hash_helper( array $arr ) : array {
		foreach ( $arr as $_key => $_value ) {
			unset( $arr[ $_key ] );  // Break reference.
			$arr[ $_key ] = $_value; // Restore, by value.
		}
		foreach ( $arr as &$_value ) {
			if ( is_array( $_value ) ) {
				$_value = U\Arr::hash_helper( $_value );
			} elseif ( is_object( $_value ) ) {
				$_value = '#' . "\0" . 'object:' . "\0" . spl_object_id( $_value );
			} elseif ( is_resource( $_value ) ) { // @future-review: {@see get_resource_id()} is PHP 8+.
				$_value = '#' . "\0" . 'resource:' . "\0" . ( function_exists( 'get_resource_id' ) ? get_resource_id( $_value ) : (int) $_value );
			}
		}
		return U\Arr::sort_by( 'key', $arr );
	}
}
