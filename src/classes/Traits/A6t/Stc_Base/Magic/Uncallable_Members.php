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
namespace Clever_Canyon\Utilities\Traits\A6t\Stc_Base\Magic;

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
 * @see   U\I7e\Stc_Base
 */
trait Uncallable_Members {
	/**
	 * Invokes inaccessible methods.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $method Method name.
	 * @param array  $args   Invocation args.
	 *
	 * @return mixed Invocation's return value.
	 *
	 * @throws U\Fatal_Exception If called in any way.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	public static function __callStatic( string $method, array $args ) /* : mixed */ {
		throw new U\Fatal_Exception(
			'Any attempt to invoke inaccessible static methods of `' . get_called_class() . '`' .
			' is potentially dangerous and therefore not allowed at this time.'
		);
	}
}
