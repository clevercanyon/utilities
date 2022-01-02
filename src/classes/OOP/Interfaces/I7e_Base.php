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
namespace Clever_Canyon\Utilities\OOP\Interfaces;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * OOP: I7e_Base.
 *
 * @since 2021-12-15
 *
 * @note  {@see \Stringable} interface implicit. {@see https://o5p.me/SGdNMV}
 *        Starting with PHP 8+ we should add it to our classes to be explicit.
 *
 * @note  Signature compatibility rules should considered carefully.
 *        {@see https://www.php.net/manual/en/language.oop5.basic.php#language.oop.lsp}.
 */
interface I7e_Base extends \Clever_Canyon\Utilities\STC\Interfaces\I7e_Stc_Base, \JsonSerializable {
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
	 *        that whomever (or whatever library) will be doing the proper sanity checks before attempting to clone.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.cloning.php
	 * @see   https://www.php.net/manual/en/reflectionclass.iscloneable.php
	 * @see   https://git.io/JygBt Example of cloneable check.
	 */
	public function __clone(); /* : void */

	/**
	 * Tells {@see var_dump()} what to show.
	 *
	 * @since 2021-12-27
	 *
	 * @return array What {@see var_dump()} will show.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.magic.php#object.debuginfo
	 */
	public function __debugInfo() : array;

	/**
	 * Defines string representation of object.
	 *
	 * @since 2021-12-27
	 *
	 * @return string String representation of object.
	 *
	 * @see   https://www.php.net/manual/en/class.stringable.php
	 */
	public function __toString() : string;

	/**
	 * Defines what to serialize.
	 *
	 * @since 2021-12-27
	 *
	 * @return array What {@see serialize()} should serialize.
	 *
	 * @see   https://www.php.net/manual/en/class.serializable.php
	 */
	public function __serialize() : array;

	/**
	 * Handles unserialization.
	 *
	 * Instead of {@see __construct()},
	 * {@see unserialize()} fires this function.
	 *
	 * @since 2021-12-27
	 *
	 * @param array $props Incoming properties; i.e., desired state.
	 *
	 * @see   https://www.php.net/manual/en/class.serializable.php
	 */
	public function __unserialize( array $props ) : void;

	/**
	 * Handles class invocation.
	 *
	 * @since 2021-12-15
	 *
	 * @param array ...$args Invocation args.
	 *
	 * @return mixed Invocation's return value.
	 *
	 * @note  {@see __invoke()} is called when calling an object as a function.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.magic.php#object.invoke
	 */
	public function __invoke( ...$args ); /* : mixed */

	/**
	 * Tests inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @return bool True if property exists.
	 */
	public function __isset( string $prop ) : bool;

	/**
	 * Gets inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @return mixed Property value.
	 */
	public function __get( string $prop ); /* : mixed */

	/**
	 * Sets inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop  Property name.
	 * @param mixed  $value Property value.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	public function __set( string $prop, /* mixed */ $value ) : void;

	/**
	 * Unsets inaccessible properties.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	public function __unset( string $prop ) : void;

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
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	public function __call( string $method, array $args ); /* : mixed */

	/**
	 * Handles shutdown on object destruction.
	 *
	 * @since 2021-12-27
	 *
	 * @note  The destructor method will be called as soon as there are no other references
	 *        to a particular object, or in any order during the shutdown sequence.
	 *
	 * @note  The destructor will be called even if script execution is stopped using {@see exit()}.
	 *        Calling {@see exit()} in a destructor will prevent the remaining shutdown routines from executing.
	 *
	 * @note  Destructors called during the script shutdown have HTTP headers already sent.
	 *        The working directory in the script shutdown phase can be different with some SAPIs (e.g. Apache).
	 *
	 * @note  Attempting to throw an exception from a destructor (called at time of script termination) causes a fatal error.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.decon.php
	 */
	public function __destruct(); /* : void */

	/**
	 * Checks equality with another instance.
	 *
	 * @since 2021-12-27
	 *
	 * @param I7e_Base $other Instance to compare equality with.
	 *
	 * @return bool True if equal; e.g., based on {@see __debugInfo()}.
	 *
	 * @note  This is very helpful when PHPUnit testing.
	 * @see   https://phpunit.readthedocs.io/en/9.5/assertions.html#assertobjectequals
	 */
	public function equals( I7e_Base $other ) : bool;

	/**
	 * Provides access to all properties, by value.
	 *
	 * @since 2021-12-27
	 *
	 * @param string $filter Optional filter. Default is `` indicating all props.
	 *                       Classes implementing this interface must handle a `public` filter.
	 *                       If a caller requests only publicly accessible props, the return value
	 *                       must be filtered appropriately. It's OK to support other custom filters
	 *                       so long as `` returns all props and `public` returns only public props.
	 *
	 * @return array All properties.
	 *
	 * @note  This is very helpful when PHPUnit testing.
	 *        It's a much cleaner way of converting an object to an array.
	 */
	public function props( string $filter = '' ) : array;
}
