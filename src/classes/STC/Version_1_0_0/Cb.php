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
namespace Clever_Canyon\Utilities\STC\Version_1_0_0;

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
 * Callback utilities.
 *
 * @since 2021-12-15
 */
class Cb extends \Clever_Canyon\Utilities\STC\Version_1_0_0\Abstracts\A6t_Stc_Base {
	/**
	 * Returns nothing.
	 *
	 * @since 2021-12-15
	 *
	 * @return void Nothing.
	 */
	public static function noop() : void {}

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
