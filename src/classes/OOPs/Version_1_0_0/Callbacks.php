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

/**
 * Callbacks.
 *
 * @since 1.0.0
 */
class Callbacks extends Base {
	/**
	 * No-op.
	 *
	 * @since 1.0.0
	 */
	public static function noop() : void {}

	/**
	 * Return true.
	 *
	 * @since 1.0.0
	 *
	 * @return bool True.
	 */
	public static function __true() : bool {
		return true;
	}

	/**
	 * Return false.
	 *
	 * @since 1.0.0
	 *
	 * @return bool False.
	 */
	public static function __false() : bool {
		return false;
	}

	/**
	 * Return null.
	 *
	 * @since 1.0.0
	 *
	 * @return null Null.
	 */
	public static function __null() : ?self {
		return null;
	}

	/**
	 * Return empty().
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $v Value.
	 *
	 * @return bool    True if empty.
	 */
	public static function __empty( $v ) : bool {
		return empty( $v );
	}

	/**
	 * Return !empty().
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $v Value.
	 *
	 * @return bool    True if not empty.
	 */
	public static function __not_empty( $v ) : bool {
		return ! empty( $v );
	}
}
