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
namespace Clever_Canyon\Utilities\OOP\Traits\I7e_Base\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   I7e_Base
 */
trait Cloneable_Members {
	/**
	 * Tells a new object clone what to do on instantiation.
	 *
	 * @since 2021-12-27
	 *
	 * @note  In PHP, a class is cloneable if this expression is true.
	 *        ```
	 *        ! method_exists( $obj, '__clone' ) || is_callable( [ $obj, '__clone' ] )
	 *        ```
	 * @note  Throwing an exception from inside {@see __clone()} may have unexpected/unintended side effects.
	 *        e.g., If the `clone` keyword is used PHP will call the {@see __clone()} method, triggering an exception.
	 *        The same is true if {@see __clone()} method visibility is set to something other than `public`.
	 *
	 * @note  So there really is no great way to effectively disable object cloning in specific classes.
	 *        The only approach that sort of works is to set visibility to `protected` or `private`, and just hope
	 *        that whomever (or whatever library) is doing the proper sanity checks before attempting to clone.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.cloning.php
	 * @see   https://www.php.net/manual/en/reflectionclass.iscloneable.php
	 * @see   https://git.io/JygBt Example of cloneable check.
	 */
	public function __clone() /* : void */ {
		// Doesn't disallow cloning.
	}
}
