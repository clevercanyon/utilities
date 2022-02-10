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
trait Flatten_Members {
	/**
	 * Flattens a multidimensional array.
	 *
	 * @since 2022-01-09
	 *
	 * @param array $arr           Input array to flatten.
	 * @param bool  $preserve_keys Should keys be preserved? Default is `false`.
	 *
	 * @return array Flattened array.
	 */
	public static function flatten( array $arr, bool $preserve_keys = false ) : array {
		$flat = []; // Initialize.

		array_walk_recursive( $arr, function ( $value, $key ) use ( &$flat, $preserve_keys ) {
			if ( $preserve_keys ) {
				$flat[ $key ] = $value;
			} else {
				$flat[] = $value;
			}
		} );
		return $flat; // Flattened array.
	}
}
