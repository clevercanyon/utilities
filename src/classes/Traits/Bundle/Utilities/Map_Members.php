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
trait Map_Members {
	/**
	 * Applies callables to values in a bundle.
	 *
	 * @since 2021-12-15
	 *
	 * @param \Closure|object|array|string $callables One or more callables to apply.
	 *                                                A {@see \Closure}, a bundle of callables, or a string.
	 *
	 *                                                - e.g., `fn( $v ) => trim( stripslashes( $v ) )`.
	 *                                                - e.g., `(object) [ 'trim', 'stripslashes' ]`.
	 *                                                - e.g., `[ 'trim', 'stripslashes' ]`.
	 *                                                - e.g., `'stripslashes'`.
	 *
	 *                                                * Callables will be applied in reverse order, which matches PHP.
	 *                                                  - e.g., `trim( stripslashes() )`              = slashes stripped first, then trimmed.
	 *                                                  - e.g., `[ 'trim', 'stripslashes' ]`          = slashes stripped first, then trimmed.
	 *                                                  - e.g., `(object) [ 'trim', 'stripslashes' ]` = slashes stripped first, then trimmed.
	 *
	 *                                                * If you pass a static method using array syntax, it must be within an iterable bundle.
	 *                                                  e.g., `[ [ static::class, 'method' ] ]`; and *not* `[ static::class, 'method' ]`.
	 *
	 * @param object|array                 $bundle    Bundle to map the callables to.
	 *
	 * @param string|array                 $types     Data types to map. Default is `[]` (all types).
	 *                                                This can be passed as either a string or an array.
	 *
	 * @param object|null                  $_r        Internal use only — do not pass.
	 *
	 * @return object|array Possibly modified bundle.
	 *
	 * @throws U\Fatal_Exception If any callable is not callable.
	 * @throws U\Fatal_Exception If any type is not type.
	 */
	public static function map(
		/* \Closure|object|array|string */ $callables,
		/* object|array */ $bundle,
		/* string|array */ $types = [],
		/* object|null */ ?object $_r = null
	) /* : object|array */ {
		assert( U\Bundle::is( $callables ) || is_string( $callables ) );
		assert( U\Bundle::is( $bundle ) );
		assert( is_string( $types ) || is_array( $types ) );

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		if ( ! $is_recursive ) {
			if ( $callables instanceof \Closure ) {
				$_r->callables = [ $callables ];
			} else {
				$_r->callables = (array) $callables;
			}
			$_r->types = $types ? (array) $types : [];

			foreach ( $_r->callables as $_key => $_callable ) {
				if ( ! is_callable( $_callable ) ) {
					throw new U\Fatal_Exception( 'Array key `' . $_key . '` is not callable.' );
				}
			}
			foreach ( $_r->types as $_key => $_type ) {
				if ( ! $_type || ! is_string( $_type ) ) {
					throw new U\Fatal_Exception( 'Array key `' . $_key . '` is not a data type.' );
				}
			}
			$_r->callables = array_reverse( $_r->callables );                    // See method comments.
			$_r->types     = $_r->types ? array_fill_keys( $_r->types, 0 ) : []; // Performance optimization.
		}
		foreach ( $bundle as &$_value ) {
			if ( U\Bundle::is( $_value ) ) {
				$_value = U\Bundle::map( $callables, $_value, $types, $_r );
			} else {
				if ( ! $_r->types || isset( $_r->types[ gettype( $_value ) ] ) ) {
					foreach ( $_r->callables as $_callable ) {
						$_value = $_callable( $_value );
					}
				}
			}
		}
		return $bundle;
	}
}
