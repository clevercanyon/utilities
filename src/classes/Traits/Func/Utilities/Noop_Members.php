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
namespace Clever_Canyon\Utilities\Traits\Func\Utilities;

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
 * @see   U\Func
 */
trait Noop_Members {
	/**
	 * Returns nothing.
	 *
	 * @since 2021-12-15
	 *
	 * @return void Nothing.
	 */
	public static function noop() : void {}

	/**
	 * Reverberates.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $v Value.
	 *
	 * @return mixed Reverberates.
	 */
	public static function noop_rev( $v ) /* : mixed */ {
		return $v;
	}

	/**
	 * Returns `null`.
	 *
	 * @since 2021-12-15
	 *
	 * @return null Null.
	 */
	public static function noop_null() /* : null */ {
		return null;
	}

	/**
	 * Returns `true`.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool True.
	 */
	public static function noop_true() : bool {
		return true;
	}

	/**
	 * Returns `false`.
	 *
	 * @since 2021-12-15
	 *
	 * @return bool False.
	 */
	public static function noop_false() : bool {
		return false;
	}
}
