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
trait Clone_Deep_Members {
	/**
	 * Clones a bundle deeply.
	 *
	 * @since         2021-12-27
	 *
	 * @param object|array $bundle Bundle to clone.
	 *
	 * @param string|null  $method Default is `null` indicating this method can decide.
	 *                             The possible values are: `serialize`, `json`, or `reflection`.
	 *                             If left as `null`, the current default approach is to use `reflection`.
	 *                             Reflection is chosen because it offers the best compatibility with `__clone()` magic,
	 *                             more granular control over how deep cloning is to be conducted, and reference-breaking.
	 *
	 *                             Please note that {@see unserialize()} can be very dangerous on untrusted data.
	 *                             That said, this method expects an object, so we aren't operating on untrusted data here.
	 *                             Another gotcha with `serialize` is that it can only serialize what `__serialize()` allows,
	 *                             which in some cases could be assessible properties only vs. `reflection` which clones *everything*.
	 *
	 *                             JSON comes with some gotchas, too. For example, JSON-encoding will not preserve any internal distinction
	 *                             between associative arrays and objects, causing associative arrays to be converted to objects when cloning.
	 *                             If the objects you're cloning contain nested objects or arrays it is important to be aware when specifying
	 *                             the `json` approach. Another gotcha with `json` is that it can only clone what `jsonSerialize()` allows,
	 *                             which in some cases could be assessible properties only vs. `reflection` which clones *everything*.
	 *
	 * @return object|array Deep clone of bundle.
	 */
	public static function clone_deep(
		/* object|array */ $bundle,
		/* string|null */ ?string $method = null
	) /* : object|array */ {
		assert( U\Bundle::is( $bundle ) );

		switch ( $method ) {
			case 'serialize':
				return unserialize( serialize( $bundle ) ); // phpcs:ignore.

			case 'json':
				return U\Str::json_decode( U\Str::json_encode( $bundle, false ) );

			case 'reflection':
			default: // Default approach.
				if ( is_object( $bundle ) ) {
					return U\Bundle::clone_deep_obj_helper( $bundle, new \SplObjectStorage() );
				} else {
					return U\Bundle::clone_deep_arr_helper( $bundle, new \SplObjectStorage() );
				}
		}
	}

	/**
	 * Helps clone deeply (handles objects).
	 *
	 * @since         2021-12-28
	 *
	 * @param object            $obj Object to clone.
	 * @param \SplObjectStorage $map Object storage map.
	 *
	 * @return object Deep clone of object.
	 *
	 * @note          In PHP, a class is cloneable if this expression is true.
	 *                ```
	 *                ! method_exists( $obj, '__clone' ) || is_callable( [ $obj, '__clone' ] )
	 *                ```
	 * @note          Throwing an exception from inside `__clone()` magic may have unexpected/unintended side effects.
	 *                e.g., If the `clone` keyword is used PHP will call the `__clone()` magic method, triggering an exception.
	 *                The same is true if `__clone()` magic method visibility is set to something other than `public`.
	 *
	 * @note          So there really is no great way to effectively disable object cloning in specific classes.
	 *                The only approach that sort of works is to set visibility to `protected` or `private`, and just hope
	 *                that whomever (or whatever library) is doing the proper sanity checks before attempting to clone.
	 *
	 * @see           https://www.php.net/manual/en/language.oop5.cloning.php
	 * @see           https://www.php.net/manual/en/reflectionclass.iscloneable.php
	 * @see           https://github.com/ZeroConfig/clone/blob/master/src/Cloner.php
	 * @see           https://github.com/myclabs/DeepCopy/blob/1.x/src/DeepCopy/DeepCopy.php
	 *
	 * @future-review As of PHP 7.4 ... 8.1 it is not possible to break references that exist in
	 *                protected/private properties of internal/built-in PHP classes (see code for details).
	 *                This should be a definite edge-case, but it's important to be aware of the limitation.
	 *
	 * @future-review As of PHP 8.1+, readonly properties cannot be modified in any way, including in clones.
	 *                This will be less of an edge case, and something we should take a closer look at soon.
	 *                {@see https://o5p.me/XZ0fGY} for some thoughts. Currently waiting for next PHP release.
	 *
	 * @noinspection  PhpElementIsNotAvailableInCurrentPhpVersionInspection
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
				$obj_clone = U\Bundle::clone_deep( $obj, 'json' );
			}
		} else { // ↑ Falls back on JSON approach.
			$obj_clone = U\Bundle::clone_deep( $obj, 'json' );
		}
		$map[ $obj ]               = $obj_clone; // Save object hash.
		$obj_clone_r8n             = new \ReflectionObject( $obj_clone );
		$obj_clone_r8n_is_internal = $obj_clone_r8n->isInternal();

		static $reference_breaker; // Closure.
		$reference_breaker ??= function ( $prop ) {
			if ( property_exists( $this, $prop ) ) {
				$value = $this->{$prop}; // Current value.
				unset( $this->{$prop} ); // Break reference.
				$this->{$prop} = $value; // Restore, by value.
			}
		};
		static $is_lt_php81; // Static cache of this boolean.
		$is_lt_php81 ??= version_compare( PHP_VERSION, '8.1.0', '<' );

		foreach ( $obj_clone_r8n->getProperties() as $_prop ) {
			if ( $_prop->isStatic() ) {
				continue; // Nothing to do.
			} elseif ( ! $is_lt_php81 && $_prop->isReadOnly() ) {
				continue; // Can't modify readonly props in PHP 8.1+.
			}
			if ( $is_lt_php81 ) {
				$_prop->setAccessible( true );
			}
			$_prop_name  = $_prop->getName();
			$_prop_value = $_prop->getValue( $obj_clone );

			if ( $_prop->isPublic() ) {
				unset( $obj_clone->{$_prop_name} );       // Breaks reference.
				$obj_clone->{$_prop_name} = $_prop_value; // Restoration by value.
			} elseif ( ! $obj_clone_r8n_is_internal ) {   // Cannot bind to internal classes.
				$reference_breaker->call( $obj_clone, $_prop_name );
			}
			$_is_object_value = is_object( $_prop_value );
			$_is_array_value  = ! $_is_object_value && is_array( $_prop_value );

			if ( $_is_object_value || $_is_array_value ) {
				$_prop->setValue(
					$obj_clone,
					$_is_object_value
						? U\Bundle::clone_deep_obj_helper( $_prop_value, $map )
						: U\Bundle::clone_deep_arr_helper( $_prop_value, $map )
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
				$arr[ $_key ] = U\Bundle::clone_deep_obj_helper( $_value, $map );
			} elseif ( is_array( $_value ) ) {
				$arr[ $_key ] = U\Bundle::clone_deep_arr_helper( $_value, $map );
			} else {
				$arr[ $_key ] = $_value;
			}
		}
		return $arr;
	}
}
