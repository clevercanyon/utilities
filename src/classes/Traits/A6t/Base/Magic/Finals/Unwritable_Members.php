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
 * Lint configuration.
 *
 * @since        2021-12-15
 *
 * @noinspection PhpUndefinedMethodInspection
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\A6t\Base\Magic\Finals;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Base
 */
trait Unwritable_Members {
	/**
	 * Sets inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop  Property name.
	 * @param mixed  $value Property value.
	 *
	 * @throws U\Fatal_Exception If called in any way.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	final public function __set( string $prop, /* mixed */ $value ) : void {
		throw new U\Fatal_Exception(
			'Any attempt to set inaccessible properties of `' . get_class( $this ) . '`' .
			' is potentially dangerous and therefore not allowed at this time.'
		);
	}

	/**
	 * Unsets inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @throws U\Fatal_Exception If called in any way.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	final public function __unset( string $prop ) : void {
		throw new U\Fatal_Exception(
			'Any attempt to unset inaccessible properties of `' . get_class( $this ) . '`' .
			' is potentially dangerous and therefore not allowed at this time.'
		);
	}
}
