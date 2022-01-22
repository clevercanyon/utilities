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
namespace Clever_Canyon\Utilities\Traits\Ctn\Utilities;

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
 * @see   U\Ctn
 */
trait Map_Members {
	/**
	 * Applies a callback to all items in a collection.
	 *
	 * @since 2021-12-15
	 *
	 * @param callable     $callback Callback to run.
	 * @param object|array ...$ctns  Collection(s) to map.
	 *
	 * @return object|array Possibly modified collection(s).
	 *                      The returned collection will preserve the props/keys of the collection argument iff exactly one collection is
	 *                      passed. If more than one collection is passed, an array will be returned with sequential integer keys.
	 */
	public static function map( callable $callback, /* object|array */ ...$ctns ) /* : object|array */ {
		foreach ( $ctns as &$_ctn ) {
			assert( U\Ctn::is( $_ctn ) );

			foreach ( $_ctn as &$_value ) {
				if ( U\Ctn::is( $_value ) ) {
					$_value = U\Ctn::map( $callback, $_value );
				} else {
					$_value = $callback( $_value );
				}
			}
			unset( $_value ); // Reference.
		}
		return count( $ctns ) > 1 ? $ctns : $ctns[ 0 ];
	}
}
