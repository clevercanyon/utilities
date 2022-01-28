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
 * Checks if {@see is_bool()}.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If {@see is_bool()}, `$value`; else `$default` value.
 */
function if_bool( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_bool( $value ) ? $value : $default;
}

/**
 * Checks if `true` explicitly.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `true`, `$value`; else `$default` value.
 */
function if_true( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return true === $value ? $value : $default;
}

/**
 * Checks if `false` explicitly.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `false`, `$value`; else `$default` value.
 */
function if_false( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return false === $value ? $value : $default;
}
