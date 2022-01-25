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
 * @param mixed               $value   Value to check and potentially return.
 *
 * @param callable|callable[] $v7r     Validator(s); e.g., type check, or other callback(s).
 *                                     e.g., `is_int`, `is_float`, `is_string`, `is_bool`, `is_array`, `is_object`, `is_resource`.
 *                                     e.g., `fn( $v ) => ( is_float( $v ) || is_int( $v ) ) && $v > 0`.
 *
 * @param mixed               $default Value to return on failure. Default is `null`.
 *
 * @return mixed If `$value` validates, returns `$value`.
 *               Otherwise, returns `$default` value.
 */
function iff( /* mixed */ $value, /* callable|array */ $v7r, /* mixed */ $default = null ) /* : mixed */ {
	foreach ( (array) $v7r as $_v7r ) {
		if ( ! $_v7r( $value ) ) {
			return $default;
		}
	}
	return $value;
}

/**
 * (int) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return int {@see u\iff()}.
 */
function int( /* mixed */ ...$args ) : int {
	$args[ 1 ] ??= 'is_int';
	return (int) iff( ...$args );
}

/**
 * (float) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return float {@see u\iff()}.
 */
function flt( /* mixed */ ...$args ) : float {
	$args[ 1 ] ??= 'is_float';
	return (float) iff( ...$args );
}

/**
 * (int|float) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return int|float {@see u\iff()}.
 */
function num( /* mixed */ ...$args ) /* : object|array */ {
	$args[ 1 ] ??= [ U\Cb::class, 'noop_rev' ];
	return is_int( $v = iff( ...$args ) ) || is_float( $v ) ? $v : (float) $v;
}

/**
 * (string) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return string {@see u\iff()}.
 */
function str( /* mixed */ ...$args ) : string {
	$args[ 1 ] = [ 'is_string', ...(array) ( $args[ 1 ] ?? [] ) ];
	return iff( ...$args );
}

/**
 * (bool) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return bool {@see u\iff()}.
 */
function bln( /* mixed */ ...$args ) : bool {
	$args[ 1 ] ??= 'is_bool';
	return (bool) iff( ...$args );
}

/**
 * (array) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return array {@see u\iff()}.
 */
function arr( /* mixed */ ...$args ) : array {
	$args[ 1 ] ??= 'is_array';
	return (array) iff( ...$args );
}

/**
 * (object) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return object {@see u\iff()}.
 */
function obj( /* mixed */ ...$args ) : object {
	$args[ 1 ] ??= 'is_object';
	return (object) iff( ...$args );
}

/**
 * (object|array) {@see u\iff()} variant.
 *
 * @since 2022-01-24
 *
 * @param mixed ...$args {@see u\iff()}.
 *
 * @return object|array {@see u\iff()}.
 */
function ctn( /* mixed */ ...$args ) /* : object|array */ {
	$args[ 1 ] ??= [ U\Cb::class, 'noop_rev' ];
	return is_object( $v = iff( ...$args ) ) || is_array( $v ) ? $v : [];
}
