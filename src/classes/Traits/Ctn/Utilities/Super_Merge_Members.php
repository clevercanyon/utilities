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
trait Super_Merge_Members {
	/**
	 * Merges collections recursively (deep clones) w/ declarative OPs.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array ...$ctns Collections to merge.
	 *                              First collection is considered the base collection.
	 *
	 * @return object|array Deep clone of the base, merged with deep clone of collections, recursively.
	 *                      Numerically indexed arrays will always replace the original arrays entirely.
	 *
	 * @note  Declarative operations are supported by this variant of {@see U\Ctn::merge()}.
	 *        Declarative operations work almost exactly like {@see https://github.com/clevercanyon/js-object-mc}.
	 *        Only difference is that props/keys by path are not fully supported yet; e.g., `a.0.c.*`).
	 */
	public static function super_merge( /* object|array */ ...$ctns ) /* : object|array */ {
		return U\Ctn::super_merge_helper( $ctns );
	}

	/**
	 * Helps merge collections recursively (deep clones) w/ declarative OPs.
	 *
	 * @since 2021-12-15
	 *
	 * @param object[]|array[] $ctns Collections to merge.
	 * @param array            $_d   Internal use only — do not pass.
	 * @param object|null      $_r   Internal use only — do not pass.
	 *
	 * @return object|array {@see U\Ctn::super_merge()} for details.
	 */
	protected static function super_merge_helper(
		array $ctns,
		array $_d = [],
		/* object|null */ ?object $_r = null
	) /* : object|array */ {
		// Init directives.

		$_d[ 'op' ] ??= '';

		// Initialize recursion.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// Check total collections.

		if ( ! $is_recursive ) {
			$count_ctns = count( $ctns );

			if ( $count_ctns < 1 ) {
				return []; // Nothing to do.
			}
			if ( 1 === $count_ctns ) {
				$ctns[ 1 ] = $ctns[ 0 ]; // Cloned below.
				// Run through at least once to resolve OPs.
			}
		}
		// Set up the base collection; i.e., clone, etc.

		$base_ctn           = $ctns[ 0 ];
		$is_object_base_ctn = is_object( $base_ctn );
		if ( ! $is_recursive ) {
			$base_ctn         = U\Ctn::clone_deep( $base_ctn );
			$_r->abs_base_ctn = &$base_ctn;
		}
		// Sanity check and slicing of base.

		assert( U\Ctn::is( $base_ctn ) ); // Quick sanity check on base.
		if ( $is_recursive ) {            // Initial pass does not skip base.
			$ctns = array_slice( $ctns, 1 );
		}
		// Define the special OP key used below.

		$op_key = '®$9c7b434a21614910a2d334ecb1508fd7$®';

		// Iterative merging of collections into base.

		foreach ( $ctns as $_ctn ) {
			assert( U\Ctn::is( $_ctn ) );

			if ( ! $is_recursive ) {
				$_ctn            = U\Ctn::clone_deep( $_ctn );
				$_r->current_ctn = &$_ctn; // Use as map.
			}
			foreach ( $_ctn as $_prop_key => $_value ) {
				$_value_is_object      = is_object( $_value );
				$_value_is_array       = ! $_value_is_object && is_array( $_value );
				$_value_is_assoc_array = $_value_is_array && U\Arr::is_assoc( $_value );

				switch ( $_prop_key ) {
					case '$set':
					case '$unset':
					case '$leave':
					case '$push':
					case '$merge':
					case '$concat':
					case '$extends':
					case '$extend':
						if ( $is_object_base_ctn ) {
							unset( $base_ctn->{$_prop_key} );
						} else {
							unset( $base_ctn[ $_prop_key ] );
						}
						if ( $_value_is_object || $_value_is_array ) {
							$_op_ctn = [ $op_key => $_value ];

							$_op_ctn = is_object( $_ctn ) ? (object) $_op_ctn : $_op_ctn;
							// ↑ {@see super_merge_op_helper()} learns from this data type.
							// ↑ tl;dr: OP collection type must match that of OP's container.

							$__d      = [ 'op' => $_prop_key ] + $_d; // Sets & runs merge OP ↓.
							$base_ctn = U\Ctn::super_merge_helper( [ $base_ctn, $_op_ctn ], $__d, $_r );
						}
						break; // End declarative OP detection.

					case $op_key: // Can't be an OP w/o this special key.
						// Saves some time by only checking OPs in a special case.
						if ( U\Ctn::super_merge_op_helper( $base_ctn, $is_object_base_ctn, $_ctn, $_value, $_d, $_r ) ) {
							break;
						} // ↑ NOTE: Case may fall through.

					default:
						if ( $is_object_base_ctn ) {
							$base_ctn->{$_prop_key} ??= null;
							$_base_ctn_pkvr         = &$base_ctn->{$_prop_key};
						} else {
							$base_ctn[ $_prop_key ] ??= null;
							$_base_ctn_pkvr         = &$base_ctn[ $_prop_key ];
						}
						if ( ( $_value_is_object || $_value_is_assoc_array ) && U\Ctn::is( $_base_ctn_pkvr ) ) {
							$__d            = [ 'op' => '' ] + $_d; // Clears OP key & runs merge.
							$_base_ctn_pkvr = U\Ctn::super_merge_helper( [ $_base_ctn_pkvr, $_value ], $__d, $_r );
						} else {
							$_base_ctn_pkvr = $_value; // Everything else, including numerically indexed arrays.
						}
				}
			}
		}
		return $base_ctn;
	}

	/**
	 * Helps merge collections recursively (handles declarative OPs).
	 *
	 * @since 2021-12-27
	 *
	 * @param object|array $base_ctn           Base collection by reference.
	 * @param bool         $is_object_base_ctn True if base collection is object.
	 * @param object|array $op_ctn             Collection containing current OP.
	 * @param object|array $op_data            Data for the current OP.
	 * @param array        $_d                 Current directives.
	 * @param object       $_r                 Recursive data.
	 *
	 * @return bool True if OP carried out. {@see U\Ctn::super_merge_helper()} for further details.
	 */
	protected static function super_merge_op_helper(
		/* object|array */ &$base_ctn,
		bool $is_object_base_ctn,
		/* object|array */ $op_ctn,
		/* object|array */ $op_data,
		array $_d,
		object $_r
	) : bool {
		switch ( $_d[ 'op' ] ) {
			case '$set': // Prop/key => values to set in base collection.
				// Point here is to set values explicitly w/o collection recursion.

				foreach ( $op_data as $_prop_key => $_value ) {
					if ( $is_object_base_ctn ) {
						$base_ctn->{$_prop_key} = $_value;
					} else {
						$base_ctn[ $_prop_key ] = $_value;
					}
				}
				return true;

			case '$unset': // Props/keys to unset in base collection.
				// This does an actual unset vs. just setting values to `null`.

				foreach ( $op_data as $_prop_key ) {
					if ( is_string( $_prop_key ) || is_int( $_prop_key ) ) {
						if ( $is_object_base_ctn ) {
							unset( $base_ctn->{$_prop_key} );
						} else {
							unset( $base_ctn[ $_prop_key ] );
						}
					}
				}
				return true;

			case '$leave': // Props/keys to leave in base collection, unset others.
				$op_data = (array) $op_data; // Converts object to array for checks below.

				foreach ( $base_ctn as $_prop_key => $_value ) {
					if ( ! in_array( $_prop_key, $op_data, true ) ) {
						if ( $is_object_base_ctn ) {
							unset( $base_ctn->{$_prop_key} );
						} else {
							unset( $base_ctn[ $_prop_key ] );
						}
					}
				}
				return true;

			case '$push': // Prop/key => values to push onto base collection.
				// This pushes one value as given vs. concat doing {@see array_merge()}.

				foreach ( $op_data as $_prop_key => $_value ) {
					if ( $is_object_base_ctn ) {
						if ( is_array( $base_ctn->{$_prop_key} ?? null ) ) {
							$base_ctn->{$_prop_key}[] = $_value;
						}
					} else {
						if ( is_array( $base_ctn[ $_prop_key ] ?? null ) ) {
							$base_ctn[ $_prop_key ][] = $_value;
						}
					}
				}
				return true;

			case '$merge': // Prop/key => values to merge into base collection.
			case '$concat': // Alias. Both of these do the same thing, same behavior.
				// Assoc keys merged, numeric keys concatenated. {@see array_merge()}.

				foreach ( $op_data as $_prop_key => $_value ) {
					if ( $is_object_base_ctn ) {
						if ( is_array( $base_ctn->{$_prop_key} ?? null ) ) {
							$base_ctn->{$_prop_key} = array_merge(
								$base_ctn->{$_prop_key}, is_array( $_value ) ? $_value : [ $_value ],
							);
						}
					} else {
						if ( is_array( $base_ctn[ $_prop_key ] ?? null ) ) {
							$base_ctn[ $_prop_key ] = array_merge(
								$base_ctn[ $_prop_key ], is_array( $_value ) ? $_value : [ $_value ],
							);
						}
					}
				}
				return true;

			case '$extends': // Props/keys from which to extend their values.
			case '$extend': // Singular alias. Each of these do the exact same thing.
				// Point here is making objects DRYer by extending their existing data.

				if ( is_object( $op_ctn ) ) {
					$_x_ctn_to_extend = (object) [];
				} else {
					$_x_ctn_to_extend = [];
				}
				foreach ( $op_data as $_prop_key ) {
					if ( '' === $_prop_key || ! is_string( $_prop_key ) ) {
						continue; // Not possible; nothing to query.
					}
					$_ctn_to_extend = U\Ctn::get_prop_key( $_r->current_ctn, $_prop_key );

					if ( ! $_ctn_to_extend || ! U\Ctn::is( $_ctn_to_extend ) ) {
						$_ctn_to_extend = U\Ctn::get_prop_key( $_r->abs_base_ctn, $_prop_key );

						if ( ! $_ctn_to_extend || ! U\Ctn::is( $_ctn_to_extend ) ) {
							$_ctn_to_extend = null; // Avoids extra checks below.
						}
						// ↑ If not found locally in current collection, we can search more broadly using the
						// absolute base that's coming together. This allows one object to extend another whenever
						// it happens to be aware it'll be merged into a larger structure that it wants to borrow from.
					}
					if ( $_ctn_to_extend /* Don't need type checks here, see above. */ ) {
						$__d              = [ 'op' => '' ] + $_d; // Clears OP & runs recursive merge.
						$_x_ctn_to_extend = U\Ctn::super_merge_helper( [ $_x_ctn_to_extend, $_ctn_to_extend ], $__d, $_r );
					}
				}
				if ( $_x_ctn_to_extend && ! U\Ctn::empty( $_x_ctn_to_extend ) ) {
					$__d      = [ 'op' => '' ] + $_d; // Clears OP & runs recursive merge.
					$base_ctn = U\Ctn::super_merge_helper( [ $_x_ctn_to_extend, $base_ctn ], $__d, $_r );
				}
				return true;
		}
		return false;
	}
}
