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
namespace Clever_Canyon\Utilities\Traits\Bundle\Utilities;

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
 * @see   U\Bundle
 */
trait Pluck_Members {
	/**
	 * Plucks props|keys from a bundle.
	 *
	 * @since 2022-03-16
	 *
	 * @param object|array $bundle     Bundle to pluck from.
	 * @param array        $props_keys Props|keys to pluck from bundle.
	 *
	 * @return object|array Bundle with plucked props|keys.
	 */
	public static function pluck( $bundle, array $props_keys ) /* : object|array */ {
		assert( U\Bundle::is( $bundle ) );

		$is_object = is_object( $bundle );
		$plucked   = $is_object ? (object) [] : [];

		foreach ( $bundle as $_prop_key => $_value ) {
			if ( in_array( $_prop_key, $props_keys, true ) ) {
				if ( $is_object ) {
					$plucked->{$_prop_key} = $_value;
				} else {
					$plucked[ $_prop_key ] = $_value;
				}
			}
		}
		return $plucked;
	}
}
