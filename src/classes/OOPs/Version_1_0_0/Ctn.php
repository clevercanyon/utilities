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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\OOPs\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Exception};

// </editor-fold>

/**
 * Collection utilities.
 *
 * @since 2021-12-15
 */
class Ctn extends Base {
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
		assert( is_object( $ctn ) || is_array( $ctn ) );

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
	 * @see   Obj::get_prop()
	 * @see   Arr::get_key()
	 */
	public static function get_prop_key( /* object|array */ $ctn, string $path, string $delimiter = '.' ) /* : mixed */ {
		assert( is_object( $ctn ) || is_array( $ctn ) );

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
	 * @throws Exception If attempting to sort by non-scalar values.
	 * @throws Exception If attempting to sort by an unexpected directive.
	 *
	 * @return object|array Sorted collection.
	 *
	 * @see   Obj::sort_by()
	 * @see   Arr::sort_by()
	 */
	public static function sort_by( string $by, /* object|array */ $ctn, int $flags = SORT_NATURAL ) /* : object|array */ {
		assert( is_object( $ctn ) || is_array( $ctn ) );

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
	 * @param bool|null    $pretty_print Pretty print? Default is `null`,
	 *                                   which defaults to {@see U\Str::stringify()} default.
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
	 * @see   U\Str::json_encode()
	 *
	 * @note  This is NOT purely a JSON-encoder.
	 *        For example, null, scalar, and resource values are simply converted to strings.
	 *        To actually JSON-encode a collection you should use {@see U\Str::json_encode()}.
	 */
	public static function stringify( /* object|array */ $ctn, /* bool|null */ ?bool $pretty_print = null, int $max_depth = -1, int $_depth = 0 ) /* : object|array|string */ {
		assert( is_object( $ctn ) || is_array( $ctn ) );

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
		unset( $_value ); // Reference.

		return $ctn;
	}

	/**
	 * Merges collections recursively.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $base_ctn Base collection.
	 * @param object|array ...$ctns  Collections to merge.
	 *
	 * @return object|array Shallow clone of the base, merged with shallow clone of collections, recursively.
	 *                      Numerically indexed arrays will always replace the original arrays entirely.
	 */
	public static function merge( /* object|array */ $base_ctn, /* object|array */ ...$ctns ) /* : object|array */ {
		assert( is_object( $base_ctn ) || is_array( $base_ctn ) );
		$is_object_base_ctn = is_object( $base_ctn );

		if ( $is_object_base_ctn ) {
			$base_ctn = clone $base_ctn;
		}
		foreach ( $ctns as $_ctn ) {
			assert( is_object( $_ctn ) || is_array( $_ctn ) );

			foreach ( $_ctn as $_prop_key => $_value ) {
				$_value_is_object = is_object( $_value );

				switch ( $is_object_base_ctn ) {
					case true:
						if ( $_value_is_object && is_object( $base_ctn->{$_prop_key} ?? null ) ) {
							$base_ctn->{$_prop_key} = U\Ctn::merge( $base_ctn->{$_prop_key}, $_value );
						} elseif ( $_value_is_object ) {
							$base_ctn->{$_prop_key} = clone $_value;
						} else {
							$base_ctn->{$_prop_key} = $_value;
						}
						break;

					case false:
					default:
						if ( $_value_is_object && is_object( $base_ctn[ $_prop_key ] ?? null ) ) {
							$base_ctn[ $_prop_key ] = U\Ctn::merge( $base_ctn[ $_prop_key ], $_value );
						} elseif ( $_value_is_object ) {
							$base_ctn[ $_prop_key ] = clone $_value;
						} else {
							$base_ctn[ $_prop_key ] = $_value;
						}
						break;
				}
			}
		}
		return $base_ctn;
	}

	/**
	 * Resolves `~/`, `${HOME}`, and other environment vars recursively.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array   $ctn      Value(s) to resolve deeply.
	 *                                 This will recurse arrays/objects.
	 *
	 * @param array          $env_vars An array of any additional environment vars. Defaults to `[]`.
	 *                                 These will override any existing environment vars with same name.
	 *
	 * @param \stdClass|null $_r       Internal use only — do not pass.
	 *
	 * @return object|array The collection after having resolved environment vars recursively.
	 */
	public static function resolve_env_vars(
		/* object|array */ $ctn,
		array $env_vars = [],
		/* \stdClass|null */ ?\stdClass $_r = null
	) /* : object|array */ {
		assert( is_object( $ctn ) || is_array( $ctn ) );
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
		unset( $_value ); // Reference.

		return $ctn;
	}

	/**
	 * Resolves `@extends` directives recursively.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $base_ctn Base collection.
	 * @param object|null  $_r       Internal use only — do not pass.
	 *
	 * @throws Exception If `$base_ctn` contains invalid an `@extends` directive.
	 * @return object|array Collection after having resolved `@extends` directives recursively.
	 */
	public static function resolve_extends( /* object|array */ $base_ctn, /* object|null */ ?object $_r = null ) /* : object|array */ {
		assert( is_object( $base_ctn ) || is_array( $base_ctn ) );

		$is_recursive       = isset( $_r );
		$_r                 ??= (object) [];
		$is_object_base_ctn = is_object( $base_ctn );

		if ( $is_object_base_ctn ) {
			$base_ctn = clone $base_ctn;
		}
		if ( ! $is_recursive ) { // Store root collection as a map.
			$_r->root_ctn = $is_object_base_ctn ? clone $base_ctn : $base_ctn;
		}
		foreach ( $base_ctn as $_prop_key => &$_value ) {
			if ( '@extends' === $_prop_key ) {
				if ( $is_object_base_ctn ) {
					$_extends_ctn = (object) [];
					unset( $base_ctn->{$_prop_key} );
				} else {
					$_extends_ctn = [];
					unset( $base_ctn[ $_prop_key ] );
				}
				if ( '' === $_value || ( ! is_array( $_value ) && ! is_string( $_value ) ) ) {
					throw new Exception( 'Invalid `@extends` directive. Must be array or string !== \'\'.' );
				}
				foreach ( (array) $_value as $__value ) {
					if ( ! is_string( $__value ) ) {
						throw new Exception( 'Invalid `@extends` directive. Each item must be a string.' );
					}
					$__extends_ctn = U\Ctn::get_prop_key( $_r->root_ctn, $__value );

					if ( ! U\Ctn::is( $__extends_ctn ) ) {
						throw new Exception( 'Invalid item in `@extends`. Could not resolve: `' . $__value . '` to a collection.' );
					}
					if ( $__extends_ctn ) {
						$_extends_ctn = U\Ctn::merge( $_extends_ctn, $__extends_ctn );
						$_extends_ctn = U\Ctn::resolve_extends( $_extends_ctn, $_r );
					}
				}
				if ( $_extends_ctn ) {
					$base_ctn = U\Ctn::merge( $_extends_ctn, $base_ctn );
				}
			} elseif ( U\Ctn::is( $_value ) ) {
				$_value = U\Ctn::resolve_extends( $_value, $_r );
			}
		}
		unset( $_value ); // Reference.

		return $base_ctn;
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
			assert( is_object( $_ctn ) || is_array( $_ctn ) );

			foreach ( $_ctn as &$_value ) {
				if ( U\Ctn::is( $_value ) ) {
					$_value = U\Ctn::map( $callback, $_value );
				} else {
					$_value = $callback( $_value );
				}
			}
			unset( $_value ); // Reference.
		}
		unset( $_ctn ); // Reference.

		return count( $ctns ) > 1 ? $ctns : $ctns[ 0 ];
	}
}
