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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Collection utilities.
 *
 * @since 2021-12-15
 */
final class Ctn extends U\A6t\Stc_Utilities {
	/**
	 * A collection?
	 *
	 * @since 2021-12-16
	 *
	 * @param mixed $value Value to check.
	 *
	 * @return bool True if `$value` is a collection.
	 */
	public static function is( /* mixed */ $value ) : bool {
		return is_object( $value ) || is_array( $value );
	}

	/**
	 * Collection is empty?
	 *
	 * @since 2021-12-16
	 *
	 * @param object|array $ctn Collection to check.
	 *
	 * @return bool True if collection is empty.
	 */
	public static function empty( /* object|array */ $ctn ) : bool {
		assert( U\Ctn::is( $ctn ) );

		return is_object( $ctn ) ? U\Obj::empty( $ctn ) : empty( $ctn );
	}

	/**
	 * Property/key accessor.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $ctn       Collection to query.
	 * @param string       $path      Path to query object for.
	 * @param string       $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   U\Obj::get_prop()
	 * @see   U\Arr::get_key()
	 */
	public static function get_prop_key( /* object|array */ $ctn, string $path, string $delimiter = '.' ) /* : mixed */ {
		assert( U\Ctn::is( $ctn ) );

		return is_object( $ctn )
			? U\Obj::get_prop( $ctn, $path, $delimiter )
			: U\Arr::get_key( $ctn, $path, $delimiter );
	}

	/**
	 * Sorts a collection.
	 *
	 * @since 2021-12-17
	 *
	 * @param string       $by    One of `prop_key|value`.
	 * @param object|array $ctn   Input collection to be sorted.
	 * @param int          $flags Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws U\Exception If attempting to sort by non-scalar values.
	 * @throws U\Exception If attempting to sort by an unexpected directive.
	 *
	 * @return object|array Sorted collection.
	 *
	 * @see   U\Obj::sort_by()
	 * @see   U\Arr::sort_by()
	 */
	public static function sort_by( string $by, /* object|array */ $ctn, int $flags = SORT_NATURAL ) /* : object|array */ {
		assert( U\Ctn::is( $ctn ) );

		return is_object( $ctn )
			? U\Obj::sort_by( 'prop_key' === $by ? 'prop' : $by, $ctn, $flags )
			: U\Arr::sort_by( 'prop_key' === $by ? 'key' : $by, $ctn, $flags );
	}

	/**
	 * Stringifies a collection.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $ctn          Collection to stringify.
	 *
	 * @param bool|null    $pretty_print Pretty print? Default is `null`.
	 *                                   {@see U\Str::stringify()} for details.
	 *
	 * @param int          $max_depth    Max depth to traverse. Default is `-1` (infinite).
	 *                                   Setting this to `-1` traverses entire collection converting non object|array values to a string.
	 *                                   Setting this to `0` indicates the collection itself should be converted to a string.
	 *                                   Setting this to `1` would force all props/keys to a string value.
	 *                                   Setting this to `2` would go one level deeper, etc.
	 *
	 * @param int          $_depth       Internal use only — do not pass.
	 *
	 * @return object|array|string Stringified collection.
	 *
	 * @see   U\Str::stringify()
	 *
	 * @note  This is NOT purely a JSON-encoder.
	 *        For example, null, scalar, and resource values are simply converted to strings.
	 *        To actually JSON-encode a collection use {@see U\Str::json_encode()}.
	 */
	public static function stringify(
		/* object|array */ $ctn,
		/* bool|null */ ?bool $pretty_print = null,
		int $max_depth = -1,
		int $_depth = 0
	) /* : object|array|string */ {
		assert( U\Ctn::is( $ctn ) );

		if ( $max_depth >= 0 && $_depth >= $max_depth ) {
			return U\Str::stringify( $ctn, $pretty_print );
		}
		foreach ( $ctn as &$_value ) {
			if ( U\Ctn::is( $_value ) ) {
				$_value = U\Ctn::stringify( $_value, $pretty_print, $max_depth, $_depth + 1 );
			} else {
				$_value = U\Str::stringify( $_value, $pretty_print );
			}
		}
		return $ctn;
	}

	/**
	 * Clones a collection deeply.
	 *
	 * @since 2021-12-27
	 *
	 * @param object|array $ctn    Collection to clone.
	 *
	 * @param string|null  $method Default is `null` indicating this method can decide.
	 *                             The possible values are: `reflection`, `json`, or `serialize`.
	 *
	 *                             If left as `null`, the current default approach is to use `reflection`.
	 *                             Reflection is chosen because it offers the best compatibility with `__clone()` magic,
	 *                             and it offers more granular control over how deep cloning is to be conducted (see code).
	 *
	 *                             Please note that {@see unserialize()} can be very dangerous on untrusted data.
	 *                             That said, this method expects an object, so we aren't operating on untrusted data here.
	 *                             Still, JSON is a much better option than serialization in PHP, which has a number of gotchas.
	 *                             tl;dr: Serialization doesn't offer many benefits over JSON encoding, which is easier to grok.
	 *
	 *                             JSON also comes with some gotchas. For example, JSON-encoding will not preserve any internal distinction
	 *                             between associative arrays and objects, causing associative arrays to be converted to objects when cloning.
	 *                             If the objects you're cloning contain nested objects or arrays it is important to be aware when specifying
	 *                             the `json` approach. Another gotcha with `json` is that it can only clone what `jsonSerialize()` allows,
	 *                             which is typically just publicly-assessible properties vs. `reflection` which clones *everything*.
	 *
	 * @return object|array Deep clone of collection.
	 *
	 * @note  The only caveat with `reflection` is that it's currently not possible
	 *        to break internal refrences in protected or private properties.
	 *        {@see U\Ctn::clone_deep_obj_helper()} for details.
	 */
	public static function clone_deep(
		/* object|array */ $ctn,
		/* string|null */ ?string $method = null
	) /* : object|array */ {
		assert( U\Ctn::is( $ctn ) );

		switch ( $method ) {
			case 'json':
				return U\Str::json_decode( U\Str::json_encode( $ctn, false ) );

			case 'serialize':
				return unserialize( serialize( $ctn ) ); // phpcs:ignore.

			case 'reflection':
			default: // Default approach.
				if ( is_object( $ctn ) ) {
					return U\Ctn::clone_deep_obj_helper( $ctn, new \SplObjectStorage() );
				} else {
					return U\Ctn::clone_deep_arr_helper( $ctn, new \SplObjectStorage() );
				}
		}
	}

	/**
	 * Helps clone deeply (handles objects).
	 *
	 * @since 2021-12-28
	 *
	 * @param object            $obj Object to clone.
	 * @param \SplObjectStorage $map Object storage map.
	 *
	 * @return object Deep clone of object.
	 *
	 * @note  In PHP, a class is cloneable if this expression is true.
	 *        ```
	 *        ! method_exists( $obj, '__clone' ) || is_callable( [ $obj, '__clone' ] )
	 *        ```
	 * @note  Throwing an exception from inside `__clone()` magic may have unexpected/unintended side effects.
	 *        e.g., If the `clone` keyword is used PHP will call the `__clone()` magic method, triggering an exception.
	 *        The same is true if `__clone()` magic method visibility is set to something other than `public`.
	 *
	 * @note  So there really is no great way to effectively disable object cloning in specific classes.
	 *        The only approach that sort of works is to set visibility to `protected` or `private`, and just hope
	 *        that whomever (or whatever library) is doing the proper sanity checks before attempting to clone.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.cloning.php
	 * @see   https://www.php.net/manual/en/reflectionclass.iscloneable.php
	 * @see   https://github.com/ZeroConfig/clone/blob/master/src/Cloner.php
	 * @see   https://github.com/myclabs/DeepCopy/blob/1.x/src/DeepCopy/DeepCopy.php
	 */
	protected static function clone_deep_obj_helper( object $obj, \SplObjectStorage $map ) : object {
		if ( isset( $map[ $obj ] ) ) {
			return $map[ $obj ]; // Handles circular references.
		}
		$obj_r8n = new \ReflectionObject( $obj );

		if ( $obj_r8n->isCloneable() ) {
			try {
				$obj_clone = clone $obj;
			} catch ( \Throwable $throwable ) {
				$obj_clone = U\Ctn::clone_deep( $obj, 'json' );
			}
		} else { // ↑ Falls back on JSON approach.
			$obj_clone = U\Ctn::clone_deep( $obj, 'json' );
		}
		$map[ $obj ]   = $obj_clone; // Save object hash.
		$obj_clone_r8n = new \ReflectionObject( $obj_clone );

		static $must_request_property_access; // Only need this once.
		$must_request_property_access ??= version_compare( PHP_VERSION, '8.1.0', '<' );

		foreach ( $obj_clone_r8n->getProperties() as $_prop ) {
			if ( $_prop->isStatic() ) {
				continue; // Nothing to do.
			}
			if ( $must_request_property_access ) {
				$_prop->setAccessible( true );
			}
			$_value           = $_prop->getValue( $obj_clone );
			$_is_object_value = is_object( $_value );
			$_is_array_value  = ! $_is_object_value && is_array( $_value );

			if ( $_prop->isPublic() ) {
				$_prop_name = $_prop->getName();
				unset( $obj_clone->{$_prop_name} );  // Breaks reference.
				$obj_clone->{$_prop_name} = $_value; // Restoration by value.
			} // @todo: Edge case. Currently no solution for protected/private references.

			if ( $_is_object_value || $_is_array_value ) {
				$_prop->setValue(
					$obj_clone,
					$_is_object_value
						? U\Ctn::clone_deep_obj_helper( $_value, $map )
						: U\Ctn::clone_deep_arr_helper( $_value, $map )
				);
			}
		}
		return $obj_clone;
	}

	/**
	 * Helps clone deeply (handles arrays).
	 *
	 * @since 2021-12-28
	 *
	 * @param array             $arr Array to clone.
	 * @param \SplObjectStorage $map Object storage map.
	 *
	 * @return array Deep clone of array.
	 */
	protected static function clone_deep_arr_helper( array $arr, \SplObjectStorage $map ) : array {
		foreach ( $arr as $_key => $_value ) {
			unset( $arr[ $_key ] ); // Breaks reference.
			// Restoration by value below, based on type.

			if ( is_object( $_value ) ) {
				$arr[ $_key ] = U\Ctn::clone_deep_obj_helper( $_value, $map );
			} elseif ( is_array( $_value ) ) {
				$arr[ $_key ] = U\Ctn::clone_deep_arr_helper( $_value, $map );
			} else {
				$arr[ $_key ] = $_value;
			}
		}
		return $arr;
	}

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

	/**
	 * Resolves `~/`, `${HOME}`, and other environment vars recursively.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $ctn      Value(s) to resolve deeply.
	 *                               This will recurse arrays/objects.
	 *
	 * @param array        $env_vars An array of any additional environment vars. Defaults to `[]`.
	 *                               These will override any existing environment vars with same name.
	 *
	 * @param object|null  $_r       Internal use only — do not pass.
	 *
	 * @return object|array The collection after having resolved environment vars recursively.
	 */
	public static function resolve_env_vars(
		/* object|array */ $ctn,
		array $env_vars = [],
		/* object|null */ ?object $_r = null
	) /* : object|array */ {
		assert( U\Ctn::is( $ctn ) );
		$_r ??= (object) [ 'env_vars' => (object) U\Env::vars( $env_vars ) ];

		foreach ( $ctn as &$_value ) {
			if ( is_string( $_value ) ) {
				foreach ( $_r->env_vars as $_env_var => $_env_var_value ) {
					$_value = str_replace( '${' . $_env_var . '}', $_env_var_value, $_value );
				}
				$_value = preg_replace( '/^~\//u', U\Dir::join_ets( $_r->env_vars->HOME, '/' ), $_value );
				$_value = preg_replace( '/\$\{[a-z0-9_\-]+\}/ui', '', $_value );
			} elseif ( U\Ctn::is( $_value ) ) {
				$_value = U\Ctn::resolve_env_vars( $_value, [], $_r );
			}
		}
		return $ctn;
	}

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
