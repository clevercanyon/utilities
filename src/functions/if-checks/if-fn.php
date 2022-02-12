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
 * Declarations.
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
 * Checks if a validator returns `true` explicitly.
 *
 * @since 2021-12-15
 *
 * @param mixed    $value   Value to check and potentially return.
 * @param callable $v7r     Validator (callable); e.g., `fn( $v ) => is_string( $v )`.
 *                          The validator receives a single parameter `( $value )`.
 * @param mixed    $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$v7r()` returns `true`, `$value`; else `$default` value.
 */
function if_fn( /* mixed */ $value, callable $v7r, /* mixed */ $default = null ) /* : mixed */ {
	return true === $v7r( $value ) ? $value : $default;
}
