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
trait Merge_Members {
	/**
	 * Merges bundles recursively (deep clones).
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array ...$bundles Bundles to merge.
	 *                                 First bundle is considered the base bundle.
	 *
	 * @return object|array Deep clone of the base, merged with deep clone of bundles, recursively.
	 *                      Numerically indexed arrays will always replace the original arrays entirely.
	 */
	public static function merge( /* object|array */ ...$bundles ) /* : object|array */ {
		return U\Bundle::merge_helper( $bundles );
	}

	/**
	 * Helps merge bundles recursively (deep clones).
	 *
	 * @since 2021-12-15
	 *
	 * @param object[]|array[] $bundles Bundles to merge.
	 * @param array            $_d      Internal use only — do not pass.
	 * @param object|null      $_r      Internal use only — do not pass.
	 *
	 * @return object|array {@see U\Bundle::merge()} for details.
	 */
	protected static function merge_helper(
		array $bundles,
		array $_d = [],
		/* object|null */ ?object $_r = null
	) /* : object|array */ {
		// Initialize recursion.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// Check total bundles.

		if ( ! $is_recursive ) {
			$count_bundles = count( $bundles );

			if ( $count_bundles < 1 ) {
				return []; // Nothing.
			}
			if ( $count_bundles < 2 ) {
				return U\Bundle::clone_deep( $bundles[ 0 ] );
			}
		}
		// Set up the base bundle; i.e., clone, etc.

		$base_bundle           = $bundles[ 0 ];
		$is_object_base_bundle = is_object( $base_bundle );
		if ( ! $is_recursive ) {
			$base_bundle = U\Bundle::clone_deep( $base_bundle );
		}
		// Sanity check and slicing of base.

		assert( U\Bundle::is( $base_bundle ) ); // Quick sanity check on base.
		$bundles = array_slice( $bundles, 1 );  // Always skip over base bundle.

		// Iterative merging of bundles into base.

		foreach ( $bundles as $_bundle ) {
			assert( U\Bundle::is( $_bundle ) );

			if ( ! $is_recursive ) {
				$_bundle = U\Bundle::clone_deep( $_bundle );
			}
			foreach ( $_bundle as $_prop_key => $_value ) {
				$_value_is_object      = is_object( $_value );
				$_value_is_array       = ! $_value_is_object && is_array( $_value );
				$_value_is_assoc_array = $_value_is_array && U\Arr::is_assoc( $_value );

				// `_pkvr` = prop key value reference.

				if ( $is_object_base_bundle ) {
					$base_bundle->{$_prop_key} ??= null;
					$_base_bundle_pkvr         = &$base_bundle->{$_prop_key};
				} else {
					$base_bundle[ $_prop_key ] ??= null;
					$_base_bundle_pkvr         = &$base_bundle[ $_prop_key ];
				}
				if ( ( $_value_is_object || $_value_is_assoc_array ) && U\Bundle::is( $_base_bundle_pkvr ) ) {
					$_base_bundle_pkvr = U\Bundle::merge_helper( [ $_base_bundle_pkvr, $_value ], $_d, $_r );
				} else {
					$_base_bundle_pkvr = $_value; // Everything else, including numerically indexed arrays.
				}
			}
		}
		return $base_bundle;
	}
}
