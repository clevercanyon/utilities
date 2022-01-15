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
namespace Clever_Canyon\Utilities\Traits\Base\Magic;

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
trait Callable_Members {
	/**
	 * Invokes inaccessible methods.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $method Method name.
	 * @param array  $args   Invocation args.
	 *
	 * @throws U\Fatal_Exception If method is uncallable.
	 * @return mixed If callable, invocation return value.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	public function __call( string $method, array $args ) /* : mixed */ {
		$callable = $this->{$method} ?? null;

		if ( $callable && is_callable( $callable ) ) {
			return $callable( $args );
		}
		throw new U\Fatal_Exception(
			'Attempt to call `' . get_class( $this ) . '->' . $method . '()` failed.' .
			' The method|property either does not exist or is not callable.'
		);
	}
}
