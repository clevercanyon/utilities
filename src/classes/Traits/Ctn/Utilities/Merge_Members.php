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
trait Merge_Members {
	/**
	 * Merges collections recursively (deep clones).
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array ...$ctns Collections to merge.
	 *                              First collection is considered the base collection.
	 *
	 * @return object|array Deep clone of the base, merged with deep clone of collections, recursively.
	 *                      Numerically indexed arrays will always replace the original arrays entirely.
	 */
	public static function merge( /* object|array */ ...$ctns ) /* : object|array */ {
		return U\Ctn::merge_helper( $ctns );
	}

	/**
	 * Helps merge collections recursively (deep clones).
	 *
	 * @since 2021-12-15
	 *
	 * @param object[]|array[] $ctns Collections to merge.
	 * @param array            $_d   Internal use only — do not pass.
	 * @param object|null      $_r   Internal use only — do not pass.
	 *
	 * @return object|array {@see U\Ctn::merge()} for details.
	 */
	protected static function merge_helper(
		array $ctns,
		array $_d = [],
		/* object|null */ ?object $_r = null
	) /* : object|array */ {
		// Initialize recursion.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// Check total collections.

		if ( ! $is_recursive ) {
			$count_ctns = count( $ctns );

			if ( $count_ctns < 1 ) {
				return []; // Nothing.
			}
			if ( $count_ctns < 2 ) {
				return U\Ctn::clone_deep( $ctns[ 0 ] );
			}
		}
		// Set up the base collection; i.e., clone, etc.

		$base_ctn           = $ctns[ 0 ];
		$is_object_base_ctn = is_object( $base_ctn );
		if ( ! $is_recursive ) {
			$base_ctn = U\Ctn::clone_deep( $base_ctn );
		}
		// Sanity check and slicing of base.

		assert( U\Ctn::is( $base_ctn ) ); // Quick sanity check on base.
		$ctns = array_slice( $ctns, 1 );  // Always skip over base collection.

		// Iterative merging of collections into base.

		foreach ( $ctns as $_ctn ) {
			assert( U\Ctn::is( $_ctn ) );

			if ( ! $is_recursive ) {
				$_ctn = U\Ctn::clone_deep( $_ctn );
			}
			foreach ( $_ctn as $_prop_key => $_value ) {
				$_value_is_object      = is_object( $_value );
				$_value_is_array       = ! $_value_is_object && is_array( $_value );
				$_value_is_assoc_array = $_value_is_array && U\Arr::is_assoc( $_value );

				if ( $is_object_base_ctn ) {
					$base_ctn->{$_prop_key} ??= null;
					$_base_ctn_pkvr         = &$base_ctn->{$_prop_key};
				} else {
					$base_ctn[ $_prop_key ] ??= null;
					$_base_ctn_pkvr         = &$base_ctn[ $_prop_key ];
				}
				if ( ( $_value_is_object || $_value_is_assoc_array ) && U\Ctn::is( $_base_ctn_pkvr ) ) {
					$_base_ctn_pkvr = U\Ctn::merge_helper( [ $_base_ctn_pkvr, $_value ], $_d, $_r );
				} else {
					$_base_ctn_pkvr = $_value; // Everything else, including numerically indexed arrays.
				}
			}
		}
		return $base_ctn;
	}
}
