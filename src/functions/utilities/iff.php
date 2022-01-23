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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Returns `$value` iff `$v7r` validates; else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed    $value   Value to check and potentially return.
 *
 * @param callable $v7r     Validator; e.g., type check, or some other callback.
 *                          e.g., `is_int`, `is_float`, `is_string`, `is_bool`, `is_array`, `is_object`, `is_resource`.
 *                          e.g., `fn( $v ) => ( is_float( $v ) || is_int( $v ) ) && $v > 0`.
 *
 * @param mixed    $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` validates, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function iff( /* mixed */ $value, callable $v7r, /* mixed */ $default = null ) /* : mixed */ {
	return $v7r( $value ) ? $value : $default;
}
