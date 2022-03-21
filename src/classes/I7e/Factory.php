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
namespace Clever_Canyon\Utilities\I7e;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Factory interface.
 *
 * @since 2021-12-15
 */
interface Factory extends U\I7e\Base {
	/**
	 * Factory class invocation.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $class   Fully-qualified class name.
	 * @param mixed  ...$args Optional args to class constructor.
	 *                        If passed, a 'new' instance is returned.
	 *
	 * @return object Requested class instance.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.magic.php#object.invoke
	 */
	public function __invoke( string $class, ...$args ) : object;
}
