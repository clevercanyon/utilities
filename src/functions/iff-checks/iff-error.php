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
 * Checks if {@see U\Error::is()}.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If {@see U\Error::is()}, `$value`; else `$default` value.
 */
function iff_error( /* mixed */ &$value, /* mixed */ $default = null ) /* : mixed */ {
	return U\Error::is( $value ) ? $value : $default;
}

/**
 * Checks if {@see U\Error::is()} and {@see U\Error::has_errors()}.
 *
 * @since 2021-12-15
 *
 * @param mixed|U\Error $value   Value to check and potentially return.
 * @param mixed         $default Value to return on failure. Default is `null`.
 *
 * @return mixed If {@see U\Error::is()} and {@see U\Error::has_errors()}, `$value`; else `$default` value.
 */
function iff_error_ne( /* mixed */ &$value, /* mixed */ $default = null ) /* : mixed */ {
	return U\Error::is( $value ) && $value->has_errors() ? $value : $default;
}
