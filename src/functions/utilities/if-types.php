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
 * Returns `$value` if it's an integer, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is an integer, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_int( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_int( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's a float, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is a float, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_float( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_float( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's a number (i.e., float|int), else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is a number (i.e., float|int), returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_number( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_float( $value ) || is_int( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's numeric, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is numeric, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_numeric( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_numeric( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's a string, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is a string, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_string( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_string( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's a bool, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is a bool, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_bool( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_bool( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's an array, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is an array, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_array( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_array( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's an object, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is an object, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_object( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_object( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's a ctn (collection; i.e., array|object), else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is a ctn (collection; i.e., array|object), returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_ctn( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_object( $value ) || is_array( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's a resource, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is a resource, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_resource( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_resource( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's null, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is null, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_null( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return null === $value ? $value : $default;
}

/**
 * Returns `$value` if it's scalar, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is scalar, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_scalar( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_scalar( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's iterable, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is iterable, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_iterable( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_iterable( $value ) ? $value : $default;
}

/**
 * Returns `$value` if it's callable, else `$default` value.
 *
 * @since 2021-12-15
 *
 * @param mixed $value   Value to check and potentially return.
 * @param mixed $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` is callable, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function if_callable( /* mixed */ $value, /* mixed */ $default = null ) /* : mixed */ {
	return is_callable( $value ) ? $value : $default;
}
