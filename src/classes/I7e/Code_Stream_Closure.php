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
 * Code stream closure interface.
 *
 * @since 2021-12-15
 */
interface Code_Stream_Closure extends U\I7e\Base {
	/**
	 * Calls closure.
	 *
	 * @since 2022-02-11
	 *
	 * @param mixed ...$args Optional arguments.
	 *
	 * @return mixed Closure return value; else `null` on failure.
	 */
	public function call( ...$args ); /* : mixed */

	/**
	 * Gets {@see \Closure}.
	 *
	 * Shorter alias is helpful in some contexts.
	 *
	 * @since 2022-02-11
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public function get() : ?\Closure;

	/**
	 * Gets {@see \Closure}.
	 *
	 * @since 2022-02-11
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public function get_closure() : ?\Closure;
}
