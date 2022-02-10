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
trait Super_Merge_Members {
	/**
	 * Merges bundles recursively (deep clones) w/ declarative OPs.
	 *
	 * Declarative operations are supported by this variant of {@see U\Bundle::merge()}.
	 * Declarative operations work almost exactly like {@see https://github.com/clevercanyon/js-object-mc}.
	 * Only difference is that props/keys by path are not fully supported yet; e.g., `a.0.c.*`).
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array ...$bundles Bundles to merge.
	 *                                 First bundle is considered the base bundle.
	 *
	 * @return object|array Deep clone of the base, merged with deep clone of bundles, recursively.
	 *                      Numerically indexed arrays will always replace the original arrays entirely.
	 */
	public static function super_merge( /* object|array */ ...$bundles ) /* : object|array */ {
		return U\Bundle::super_merge_helper( $bundles );
	}

	/**
	 * Helps merge bundles recursively (deep clones) w/ declarative OPs.
	 *
	 * @since 2021-12-15
	 *
	 * @param object[]|array[] $bundles Bundles to merge.
	 * @param array            $_d      Internal use only — do not pass.
	 * @param object|null      $_r      Internal use only — do not pass.
	 *
	 * @return object|array {@see U\Bundle::super_merge()} for details.
	 */
	protected static function super_merge_helper(
		array $bundles,
		array $_d = [],
		/* object|null */ ?object $_r = null
	) /* : object|array */ {
		// Init directives.

		$_d[ 'op' ] ??= '';

		// Initialize recursion.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// Check total bundles.

		if ( ! $is_recursive ) {
			$count_bundles = count( $bundles );

			if ( $count_bundles < 1 ) {
				return []; // Nothing to do.
			}
			if ( 1 === $count_bundles ) {
				$bundles[ 1 ] = $bundles[ 0 ]; // Cloned below.
				// Run through at least once to resolve OPs.
			}
		}
		// Set up the base bundle; i.e., clone, etc.

		$base_bundle           = $bundles[ 0 ];
		$is_object_base_bundle = is_object( $base_bundle );
		if ( ! $is_recursive ) {
			$base_bundle         = U\Bundle::clone_deep( $base_bundle );
			$_r->abs_base_bundle = &$base_bundle;
		}
		// Sanity check and slicing of base.

		assert( U\Bundle::is( $base_bundle ) ); // Quick sanity check on base.
		if ( $is_recursive ) {                  // Initial pass does not skip base.
			$bundles = array_slice( $bundles, 1 );
		}
		// Define the special OP key used below.

		$op_key = '®$9c7b434a21614910a2d334ecb1508fd7$®';

		// Iterative merging of bundles into base.

		foreach ( $bundles as $_bundle ) {
			assert( U\Bundle::is( $_bundle ) );

			if ( ! $is_recursive ) {
				$_bundle            = U\Bundle::clone_deep( $_bundle );
				$_r->current_bundle = &$_bundle; // Use as map.
			}
			foreach ( $_bundle as $_prop_key => $_value ) {
				$_value_is_object      = is_object( $_value );
				$_value_is_array       = ! $_value_is_object && is_array( $_value );
				$_value_is_assoc_array = $_value_is_array && U\Arr::is_assoc( $_value );

				switch ( $_prop_key ?: '' ) { // Avoid `0` loose comparison!
					case '$set':
					case '$unset':
					case '$leave':
					case '$push':
					case '$merge':
					case '$concat':
					case '$extends':
					case '$extend':
						if ( $is_object_base_bundle ) {
							unset( $base_bundle->{$_prop_key} );
						} else {
							unset( $base_bundle[ $_prop_key ] );
						}
						if ( $_value_is_object || $_value_is_array ) {
							$_op_bundle = [ $op_key => $_value ];

							$_op_bundle = is_object( $_bundle ) ? (object) $_op_bundle : $_op_bundle;
							// ↑ {@see super_merge_op_helper()} learns from this data type.
							// ↑ tl;dr: OP bundle type must match that of OP's container.

							$__d         = [ 'op' => $_prop_key ] + $_d; // Sets & runs merge OP ↓.
							$base_bundle = U\Bundle::super_merge_helper( [ $base_bundle, $_op_bundle ], $__d, $_r );
						}
						break; // End declarative OP detection.

					case $op_key: // Can't be an OP w/o this special key.
						// Saves some time by only checking OPs in a special case.
						if ( U\Bundle::super_merge_op_helper( $base_bundle, $is_object_base_bundle, $_bundle, $_value, $_d, $_r ) ) {
							break;
						} // ↑ NOTE: Case may fall through.

					default:
						// `_pkvr` = prop key value reference.

						if ( $is_object_base_bundle ) {
							$base_bundle->{$_prop_key} ??= null;
							$_base_bundle_pkvr         = &$base_bundle->{$_prop_key};
						} else {
							$base_bundle[ $_prop_key ] ??= null;
							$_base_bundle_pkvr         = &$base_bundle[ $_prop_key ];
						}
						if ( ( $_value_is_object || $_value_is_assoc_array ) && U\Bundle::is( $_base_bundle_pkvr ) ) {
							$__d               = [ 'op' => '' ] + $_d; // Clears OP key & runs merge.
							$_base_bundle_pkvr = U\Bundle::super_merge_helper( [ $_base_bundle_pkvr, $_value ], $__d, $_r );
						} else {
							$_base_bundle_pkvr = $_value; // Everything else, including numerically indexed arrays.
						}
				}
			}
		}
		return $base_bundle;
	}

	/**
	 * Helps merge bundles recursively (handles declarative OPs).
	 *
	 * @since 2021-12-27
	 *
	 * @param object|array $base_bundle           Base bundle by reference.
	 * @param bool         $is_object_base_bundle True if base bundle is object.
	 * @param object|array $op_bundle             Bundle containing current OP.
	 * @param object|array $op_data               Data for the current OP.
	 * @param array        $_d                    Current directives.
	 * @param object       $_r                    Recursive data.
	 *
	 * @return bool True if OP carried out. {@see U\Bundle::super_merge_helper()} for further details.
	 */
	protected static function super_merge_op_helper(
		/* object|array */ &$base_bundle,
		bool $is_object_base_bundle,
		/* object|array */ $op_bundle,
		/* object|array */ $op_data,
		array $_d,
		object $_r
	) : bool {
		switch ( $_d[ 'op' ] ) {
			case '$set': // Prop/key => values to set in base bundle.
				// Point here is to set values explicitly w/o bundle recursion.

				foreach ( $op_data as $_prop_key => $_value ) {
					if ( $is_object_base_bundle ) {
						$base_bundle->{$_prop_key} = $_value;
					} else {
						$base_bundle[ $_prop_key ] = $_value;
					}
				}
				return true;

			case '$unset': // Props/keys to unset in base bundle.
				// This does an actual unset vs. just setting values to `null`.

				foreach ( $op_data as $_prop_key ) {
					if ( is_string( $_prop_key ) || is_int( $_prop_key ) ) {
						if ( $is_object_base_bundle ) {
							unset( $base_bundle->{$_prop_key} );
						} else {
							unset( $base_bundle[ $_prop_key ] );
						}
					}
				}
				return true;

			case '$leave': // Props/keys to leave in base bundle, unset others.
				$op_data = (array) $op_data; // Converts object to array for checks below.

				foreach ( $base_bundle as $_prop_key => $_value ) {
					if ( ! in_array( $_prop_key, $op_data, true ) ) {
						if ( $is_object_base_bundle ) {
							unset( $base_bundle->{$_prop_key} );
						} else {
							unset( $base_bundle[ $_prop_key ] );
						}
					}
				}
				return true;

			case '$push': // Prop/key => values to push onto base bundle.
				// This pushes one value as given vs. concat doing {@see array_merge()}.

				foreach ( $op_data as $_prop_key => $_value ) {
					if ( $is_object_base_bundle ) {
						if ( is_array( $base_bundle->{$_prop_key} ?? null ) ) {
							$base_bundle->{$_prop_key}[] = $_value;
						}
					} else {
						if ( is_array( $base_bundle[ $_prop_key ] ?? null ) ) {
							$base_bundle[ $_prop_key ][] = $_value;
						}
					}
				}
				return true;

			case '$merge': // Prop/key => values to merge into base bundle.
			case '$concat': // Alias. Both of these do the same thing, same behavior.
				// Assoc keys merged, numeric keys concatenated. {@see array_merge()}.

				foreach ( $op_data as $_prop_key => $_value ) {
					if ( $is_object_base_bundle ) {
						if ( is_array( $base_bundle->{$_prop_key} ?? null ) ) {
							$base_bundle->{$_prop_key} = array_merge(
								$base_bundle->{$_prop_key}, is_array( $_value ) ? $_value : [ $_value ],
							);
						}
					} else {
						if ( is_array( $base_bundle[ $_prop_key ] ?? null ) ) {
							$base_bundle[ $_prop_key ] = array_merge(
								$base_bundle[ $_prop_key ], is_array( $_value ) ? $_value : [ $_value ],
							);
						}
					}
				}
				return true;

			case '$extends': // Props/keys from which to extend their values.
			case '$extend': // Singular alias. Each of these do the exact same thing.
				// Point here is making objects DRYer by extending their existing data.

				if ( is_object( $op_bundle ) ) {
					$_x_bundle_to_extend = (object) [];
				} else {
					$_x_bundle_to_extend = [];
				}
				foreach ( $op_data as $_prop_key ) {
					if ( '' === $_prop_key || ! is_string( $_prop_key ) ) {
						continue; // Not possible; nothing to query.
					}
					$_bundle_to_extend = U\Bundle::get_prop_key( $_r->current_bundle, $_prop_key );

					if ( ! $_bundle_to_extend || ! U\Bundle::is( $_bundle_to_extend ) ) {
						$_bundle_to_extend = U\Bundle::get_prop_key( $_r->abs_base_bundle, $_prop_key );

						if ( ! $_bundle_to_extend || ! U\Bundle::is( $_bundle_to_extend ) ) {
							$_bundle_to_extend = null; // Avoids extra checks below.
						}
						// ↑ If not found locally in current bundle, we can search more broadly using the
						// absolute base that's coming together. This allows one object to extend another whenever
						// it happens to be aware it'll be merged into a larger structure that it wants to borrow from.
					}
					if ( $_bundle_to_extend /* Don't need type checks here, see above. */ ) {
						$__d                 = [ 'op' => '' ] + $_d; // Clears OP & runs recursive merge.
						$_x_bundle_to_extend = U\Bundle::super_merge_helper( [ $_x_bundle_to_extend, $_bundle_to_extend ], $__d, $_r );
					}
				}
				if ( $_x_bundle_to_extend && ! U\Bundle::empty( $_x_bundle_to_extend ) ) {
					$__d         = [ 'op' => '' ] + $_d; // Clears OP & runs recursive merge.
					$base_bundle = U\Bundle::super_merge_helper( [ $_x_bundle_to_extend, $base_bundle ], $__d, $_r );
				}
				return true;
		}
		return false;
	}
}
