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
trait Own_Prop_Members {
	/**
	 * Gets an object's own property names.
	 *
	 * @since 2022-02-11
	 *
	 * @param object $obj Object to reflect.
	 *
	 * @return array Object's own property names.
	 */
	public static function own_prop_names( object $obj ) : array {
		$names = []; // Initialize.

		$rfn_obj      = new \ReflectionObject( $obj );
		$rfn_obj_name = $rfn_obj->getName();

		foreach ( $rfn_obj->getProperties(
			\ReflectionProperty::IS_PUBLIC
			| \ReflectionProperty::IS_PROTECTED
			| \ReflectionProperty::IS_PRIVATE
		) as $_rfn_prop
		) {
			if ( $_rfn_prop->getDeclaringClass()->getName() === $rfn_obj_name ) {
				$names[] = $_rfn_prop->getName();
			}
		}
		return $names;
	}
}
