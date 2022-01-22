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
namespace Clever_Canyon\Utilities\Traits\Str\Utilities;

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
 * @see   U\Str
 */
trait Is_MAC_Members {
	/**
	 * Checks MAC address validity; e.g., `00:0C:F1:56:98:AD`.
	 * Also in these formats: `00-0C-F1-56-98-AD`, `000C.F156.98AD`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid MAC address.
	 *
	 * @see   https://o5p.me/q7tGiP
	 * @note  See also the tests for function.
	 */
	public static function is_mac( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_MAC );
	}
}
