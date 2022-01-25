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
namespace Clever_Canyon\Utilities\Traits\Iff\Utilities;

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
 * @see   U\Iff
 */
trait Type_Members {
	/**
	 * Returns `$value` iff `$v7r` validates; else `$default` value.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed               $value   Value to check and potentially return.
	 *
	 * @param \Closure|callable[] $v7r     Validator(s). A single {@see \Closure}, or an array of callables.
	 *
	 *                                     e.g., Single closure: `fn( $v ) => is_foo( $v )`
	 *                                     e.g., Single closure: `fn( $v ) => is_foo( $v ) || is_bar( $v )`
	 *                                     e.g., Array of callables: `[ fn( $v ) => is_foo( $v ) || is_bar( $v ) ]`
	 *
	 *                                     e.g., Array of callables: `[ [ Foo::class, 'is' ] ]`
	 *                                     e.g., Array of callables: `[ 'is_foo', 'is_bar', 'is_baz ]`
	 *                                     e.g., Array of callables: `[ 'is_foo', [ Bar::class, 'is' ] ]`
	 *
	 *                                     e.g., Invalid: `[ Foo::class, 'is' ]`
	 *
	 *                                     All callables must return `true`, else this function returns `$default`.
	 *                                     i.e., Ths function applies AND logic. If you need OR logic, use a {@see \Closure}.
	 *
	 * @param mixed               $default Value to return on failure. Default is `null`.
	 *
	 * @return mixed If `$value` validates, returns `$value`.
	 *               Otherwise, returns `$default` value.
	 */
	protected static function check(
		/* mixed */ $value,
		/* \Closure|array */ $v7r,
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		assert( $v7r instanceof \Closure || is_array( $v7r ) );

		foreach ( (array) $v7r as $_v7r ) {
			if ( is_string( $_v7r ) ) {
				switch ( $_v7r ) {
					case 'isset':
						$_v7r_says = isset( $value );
						break;

					case '!isset':
					case '! isset':
						$_v7r_says = ! isset( $value );
						break;

					case 'empty':
						$_v7r_says = empty( $value );
						break;

					case '!empty':
					case '! empty':
						$_v7r_says = ! empty( $value );
						break;

					default: // Callable.
						assert( is_callable( $_v7r ) );
						$_v7r_says = $_v7r( $value );
				}
			} else {
				assert( is_callable( $_v7r ) );
				$_v7r_says = $_v7r( $value );
			}
			if ( true !== $_v7r_says ) {
				return $default;
			}
		}
		return $value;
	}

	/**
	 * Integer {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function int(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_int', ...(array) $v7r ], $default );
	}

	/**
	 * Float {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function float(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_float', ...(array) $v7r ], $default );
	}

	/**
	 * Number {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function number(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ [ U\Number::class, 'is' ], ...(array) $v7r ], $default );
	}

	/**
	 * Boolean {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function bool(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_bool', ...(array) $v7r ], $default );
	}

	/**
	 * String {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function string(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_string', ...(array) $v7r ], $default );
	}

	/**
	 * Array {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function array(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_array', ...(array) $v7r ], $default );
	}

	/**
	 * Object {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function object(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_object', ...(array) $v7r ], $default );
	}

	/**
	 * Bundle {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function bundle(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ [ U\Bundle::class, 'is' ], ...(array) $v7r ], $default );
	}

	/**
	 * Resource {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function resource(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_resource', ...(array) $v7r ], $default );
	}

	/**
	 * Null {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function null(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_null', ...(array) $v7r ], $default );
	}

	/**
	 * Scalar {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function scalar(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_scalar', ...(array) $v7r ], $default );
	}

	/**
	 * Numeric {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function numeric(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_numeric', ...(array) $v7r ], $default );
	}

	/**
	 * Callable {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function callable(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_callable', ...(array) $v7r ], $default );
	}

	/**
	 * Iterable {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function iterable(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_iterable', ...(array) $v7r ], $default );
	}

	/**
	 * Countable {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function countable(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ 'is_countable', ...(array) $v7r ], $default );
	}

	/**
	 * Error {@see U\Iff::check()} variant.
	 *
	 * @since 2022-01-24
	 *
	 * @param mixed               $value   {@see U\Iff::check()}.
	 * @param \Closure|callable[] $v7r     {@see U\Iff::check()}. Default is `[]`.
	 * @param mixed               $default {@see U\Iff::check()}. Default is `null`.
	 *
	 * @return mixed {@see U\Iff::check()}.
	 */
	public static function error(
		/* mixed */ $value,
		/* \Closure|array */ $v7r = [],
		/* mixed */ $default = U\Func::PARAM_DEFAULT_NULL
	) /* : mixed */ {
		return U\Iff::check( $value, [ [ U\Error::class, 'is' ], ...(array) $v7r ], $default );
	}
}
