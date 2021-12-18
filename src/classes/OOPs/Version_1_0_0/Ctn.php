<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

/**
 * Collection.
 *
 * @since 1.0.0
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
		return is_object( $ctn ) ? U\Obj::empty( $ctn ) : empty( $ctn );
	}

	/**
	 * Property/key accessor.
	 *
	 * @since 1.0.0
	 *
	 * @param object|array $ctn       Collection to query.
	 * @param string       $path      Path to query object for.
	 * @param string       $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   Obj::get_prop For further details.
	 * @see   Arr::get_key For further details.
	 */
	public static function get_prop_key( /* object|array */ $ctn, string $path, string $delimiter = '.' ) /* : mixed */ {
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
	 * @see   Obj::sort_by For further details.
	 * @see   Arr::sort_by For further details.
	 */
	public static function sort_by( string $by, /* object|array */ $ctn, int $flags = SORT_NATURAL ) /* : object|array */ {
		return is_object( $ctn )
			? U\Obj::sort_by( 'prop_key' === $by ? 'prop' : $by, $ctn, $flags )
			: U\Arr::sort_by( 'prop_key' === $by ? 'key' : $by, $ctn, $flags );
	}

	/**
	 * Merges collections recursively.
	 *
	 * @since 1.0.0
	 *
	 * @param object|array $base_ctn Base collection.
	 * @param object|array ...$ctns  Collections to merge.
	 *
	 * @throws Exception If `$base_ctn` is not an `object|array`.
	 * @return object|array Shallow clone of the base, merged with shallow clone of collections, recursively.
	 *                      Numerically indexed arrays will always replace the original arrays entirely.
	 */
	public static function merge( /* object|array */ $base_ctn, /* object|array */ ...$ctns ) /* : object|array */ {
		$is_object_base_ctn = is_object( $base_ctn );

		if ( $is_object_base_ctn ) {
			$base_ctn = clone $base_ctn;
		} elseif ( ! is_array( $base_ctn ) ) {
			throw new Exception( 'Base collection must be object|array.' );
		}
		foreach ( $ctns as $_ctn ) {
			if ( ! U\Ctn::is( $_ctn ) ) {
				continue; // Not possible.
			}
			foreach ( $_ctn as $_prop_key => $_value ) {
				$_value_is_object = is_object( $_value );

				switch ( $is_object_base_ctn ) {
					case true :
						if ( $_value_is_object && is_object( $base_ctn->{$_prop_key} ?? null ) ) {
							$base_ctn->{$_prop_key} = U\Ctn::merge( $base_ctn->{$_prop_key}, $_value );
						} elseif ( $_value_is_object ) {
							$base_ctn->{$_prop_key} = clone $_value;
						} else {
							$base_ctn->{$_prop_key} = $_value;
						}
						break;

					case false :
					default :
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
	 * @since 1.0.0
	 *
	 * @param mixed          $value      Value(s) to resolve deeply.
	 *                                   This will recurse arrays/objects.
	 *
	 * @param array          $env_vars   An array of any additional environment vars. Defaults to `[]`.
	 *
	 * @param \StdClass|null $_r         Internal use only. Do NOT pass.
	 *
	 * @return mixed The `$value` after having resolved environment vars recursively.
	 */
	public static function resolve_env_vars( /* mixed */ $value, array $env_vars = [], /* \StdClass|null */ ?\StdClass $_r = null ) /* : mixed */ {
		$_r           ??= (object) [];
		$_r->env_vars ??= (object) array_map(
			'strval', [
				'CWD'  => U\Fs::normalize( getcwd() ),
				'PWD'  => U\Fs::normalize( getenv( 'PWD' ) ),
				'HOME' => U\Fs::normalize( getenv( 'HOME' ) ),
			] + getenv() + $env_vars
		);
		if ( is_string( $value ) ) {
			$value = preg_replace( '/^~\//u', rtrim( $_r->env_vars->HOME, '/' ) . '/', $value );
			foreach ( $_r->env_vars as $_env_var => $_env_var_value ) {
				$value = str_replace( '${' . $_env_var . '}', $_env_var_value, $value );
			}
		} elseif ( U\Ctn::is( $value ) ) {
			foreach ( $value as &$_value ) {
				$_value = U\Ctn::resolve_env_vars( $_value, [], $_r );
			}
			unset( $_value ); // Reference.
		}
		return $value;
	}

	/**
	 * Resolves `@extends` directives recursively.
	 *
	 * @since 1.0.0
	 *
	 * @param object|array $base_ctn Base collection.
	 * @param object|null  $_r       For internal recursive use only.
	 *
	 * @throws Exception If `$base_ctn` is not an `object|array`.
	 * @throws Exception If `$base_ctn` contains invalid an `@extends` directive.
	 *
	 * @return object|array Collection after having resolved `@extends` directives recursively.
	 */
	public static function resolve_extends( /* object|array */ $base_ctn, /* object|null */ ?object $_r = null ) /* : object|array */ {
		$is_recursive       = isset( $_r );
		$_r                 ??= (object) [];
		$is_object_base_ctn = is_object( $base_ctn );

		if ( $is_object_base_ctn ) {
			$base_ctn = clone $base_ctn;
		} elseif ( ! is_array( $base_ctn ) ) {
			throw new Exception( 'Base collection must be object|array.' );
		}
		if ( ! $is_recursive ) {             // Store root collection.
			$_r->root_ctn = clone $base_ctn; // Re-clone. This copy is a map.
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
}
