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
namespace Clever_Canyon\Utilities\Traits\Obj\Utilities;

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
 * @see   U\Obj
 */
trait Props_Members {
	/**
	 * Gets non-static properties, by value.
	 *
	 * @since 2021-12-27
	 *
	 * @param object      $obj    Object to get properties from.
	 *
	 * @param string|null $filter Optional filter. Default is `public`.
	 *
	 *                            Note: Any of the following filters can also be prefixed with `own:` to
	 *                            retrieve an object's own properties only; e.g., `own:public...protected`.
	 *
	 *                            * `public` (default) returns publicly-accessible non-static properties only.
	 *                            * `protected` returns protected non-static properties only.
	 *                            * `private` returns private non-static properties only.
	 *
	 *                            * `public...protected` returns public and protected non-static properties.
	 *                            * `protected...private` returns protected and private non-static properties.
	 *                            * `public...private` returns public, protected, and private non-static properties.
	 *
	 *                            * `debug` returns public, protected, and private non-static properties. Same as `public...private`.
	 *                            * `debug+` Includes some internals like `ins_cache`, which is not returned otherwise.
	 *
	 * @param bool        $clean  Clean property names? Default is `false`, and for good reasons.
	 *
	 *                            When `$clean` is `false` (default):
	 *
	 *                              * Protected properties are always prefixed with `"\0"*"\0"`, just like {@see get_mangled_object_vars()}.
	 *                              * Private properties are always prefixed with `"\0"[class]"\0"`, just like {@see get_mangled_object_vars()}.
	 *
	 *                            When `$clean` is `true` (please use with caution):
	 *
	 *                              * All prefixes are removed from property names, providing a cleaner read when necessary.
	 *
	 *                              * When a class has private properties `$clean` may introduce conflicts depending on which classes
	 *                                (i.e., parent classes) defined those private properties. It's possible for some properties to be lost;
	 *                                e.g., when a class has two different private properties defined by different classes, but with the same name.
	 *                                You'll end up with only the last property returned by {@see get_mangled_object_vars()}, and lose the other.
	 *
	 * @return array All accessible non-static properties using the given `$filter`.
	 *
	 * @throws U\Fatal_Exception If an unexpected `$filter` is given.
	 */
	public static function props( object $obj, /* string|null */ ?string $filter = null, bool $clean = false ) : array {
		$props = []; // Initialize.

		if ( $filter && 0 === mb_strpos( $filter, 'own:' ) ) {
			$own            = true;
			$own_prop_names = U\Obj::own_prop_names( $obj );
			$filter         = mb_substr( $filter, 4 ) ?: 'public';
		} else {
			$own            = false;
			$own_prop_names = []; // N/A.
			$filter         = $filter ?: 'public';
		}
		if ( $own && ! $own_prop_names ) {
			return []; // Saves time.
		}
		switch ( $filter ) {
			case 'public':
				$props = get_object_vars( $obj );
				break;

			case 'protected':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( is_string( $_prop ) && "\0" === ( $_prop[ 0 ] ?? '' ) && '*' === ( $_prop[ 1 ] ?? '' ) ) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'private':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( is_string( $_prop ) && "\0" === ( $_prop[ 0 ] ?? '' ) && '*' !== ( $_prop[ 1 ] ?? '' ) ) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'public...protected':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( ! is_string( $_prop ) || "\0" !== ( $_prop[ 0 ] ?? '' ) || '*' === ( $_prop[ 1 ] ?? '' ) ) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'protected...private':
				foreach ( get_mangled_object_vars( $obj ) as $_prop => $_value ) {
					if ( is_string( $_prop ) && "\0" === ( $_prop[ 0 ] ?? '' ) ) {
						$props[ $_prop ] = $_value;
					}
				}
				break;

			case 'public...private':
			case 'debug':
			case 'debug+':
				$props = get_mangled_object_vars( $obj );
				break;

			default: // Unexpected filter throws exception.
				throw new U\Fatal_Exception( 'Unexpected `$filter`: `' . $filter . '`.' );
		}
		if ( 'debug+' !== $filter ) {
			// Remove `ins_cache`, which is uninteresting & noisy.
			unset( $props[ "\0" . U\A6t\Base::class . "\0" . 'ins_cache' ] );
		}
		if ( $clean ) {
			$_props = $props;
			$props  = []; // Reinitialize.

			foreach ( $_props as $_prop => $_value ) {
				if ( is_string( $_prop ) && "\0" === ( $_prop[ 0 ] ?? '' ) ) {
					$_clean_prop = preg_replace( '/^\x00+.+\x00/u', '', $_prop );
				} else {
					$_clean_prop = $_prop; // Already clean.
				}
				$props[ $_clean_prop ] = $_value;
			}
		}
		if ( $own ) {
			$_props = $props;
			$props  = []; // Reinitialize.

			foreach ( $_props as $_prop => $_value ) {
				if ( ! $clean && is_string( $_prop ) && "\0" === ( $_prop[ 0 ] ?? '' ) ) {
					$_clean_prop = preg_replace( '/^\x00+.+\x00/u', '', $_prop );
				} else {
					$_clean_prop = $_prop; // Already clean.
				}
				if ( in_array( $_clean_prop, $own_prop_names, true ) ) {
					$props[ $_prop ] = $_value;
				}
			}
		}
		return $props;
	}
}
