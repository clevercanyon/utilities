<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

/**
 * Callbacks.
 *
 * @since 1.0.0
 */
class Cb extends Base {
	/**
	 * Returns `null`.
	 *
	 * @since 1.0.0
	 *
	 * @return void Null.
	 */
	public static function noop() : void {
		return; // Null.
	}

	/**
	 * Returns `true`.
	 *
	 * @since 1.0.0
	 *
	 * @return bool True.
	 */
	public static function noop_true() : bool {
		return true;
	}

	/**
	 * Returns `false`.
	 *
	 * @since 1.0.0
	 *
	 * @return bool False.
	 */
	public static function noop_false() : bool {
		return false;
	}
}
