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
namespace Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits\I7e_Base\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   I7e_Base
 */
trait Writable_Members {
	/**
	 * Sets inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop  Property name.
	 * @param mixed  $value Property value.
	 *
	 * @throws Fatal_Exception If attempting to set a reserved property.
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 *
	 * @note  If a property already exists that means we're only here because it's inaccessible.
	 *        For that reason we will not override existing properties; i.e., they are *not* accessible.
	 *
	 * @note  Keep in mind this is only fired for nonexistent and/or inaccessible properties.
	 *        The implication is that once we set the property this won't be fired again so long as
	 *        the property is accessible. It will be, since we refuse to set inaccessible properties.
	 */
	public function __set( string $prop, /* mixed */ $value ) : void {
		if ( property_exists( $this, $prop ) ) {
			throw new Fatal_Exception(
				'Overload error. The `' . $prop . '` property name is reserved and therefore cannot be `__set()`.'
			);
		}
		$this->{$prop} = $value; // It's set now.
	}

	/**
	 * Unsets inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @throws Fatal_Exception If attempting to unset a reserved property.
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 *
	 * @note  If a property already exists that means we're only here because it's inaccessible.
	 *        For that reason we will not destroy existing properties; i.e., they are *not* accessible.
	 */
	public function __unset( string $prop ) : void {
		if ( property_exists( $this, $prop ) ) {
			throw new Fatal_Exception(
				'Overload error. The `' . $prop . '` property name is reserved and therefore cannot be `__unset()`.'
			);
		}
	}
}
