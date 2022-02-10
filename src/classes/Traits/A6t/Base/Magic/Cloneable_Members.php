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
namespace Clever_Canyon\Utilities\Traits\A6t\Base\Magic;

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
trait Cloneable_Members {
	/**
	 * Tells a new object clone what to do on instantiation.
	 *
	 * In PHP, a class is cloneable if this expression is true.
	 * ```
	 * ! method_exists( $obj, '__clone' ) || is_callable( [ $obj, '__clone' ] )
	 * ```
	 * Throwing an exception from inside this function may have unexpected/unintended side effects.
	 * e.g., If the `clone` keyword is used PHP will call this method, triggering an exception.
	 * The same is true if this method's visibility is set to something other than `public`.
	 *
	 * So there really is no great way to effectively disable object cloning in specific classes.
	 * The only approach that sort of works is to set visibility to `protected` or `private`, and just hope
	 * that whomever (or whatever library) is doing the proper sanity checks before attempting to clone.
	 *
	 * @since 2021-12-27
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.cloning.php
	 * @see   https://www.php.net/manual/en/reflectionclass.iscloneable.php
	 * @see   https://git.io/JygBt Example of cloneable check.
	 */
	public function __clone() /* : void */ {
		// Doesn't disallow cloning.
	}
}
