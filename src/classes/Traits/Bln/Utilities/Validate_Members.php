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
namespace Clever_Canyon\Utilities\Traits\Bln\Utilities;

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
 * @see   U\Bln
 */
trait Validate_Members {
	/**
	 * Validates a boolean value.
	 *
	 * @since         2022-01-19
	 *
	 * @param mixed $value Value to validate as a boolean.
	 *
	 * @param bool  $strict Operate in strict mode? Default is `false`.
	 *                      If `true`, only returns `false` for: `0.0`, `0`, `'0'`, `false`, `'false'`, `'off'`, `'no'`, and `''`.
	 *                      Otherwise, `null` is returned for all non-boolean values, changing the return type of this function.
	 *
	 * @return bool|null Returns `true` for: `1.0`, `1`, `'1'`, `true`, `'true'`, `'on'`, `'yes'`. Returns `false` otherwise.
	 *                   See also: `$strict` mode for `null` return on all non-boolean values.
	 *
	 * @note          None of the string values are caSe-sensitive. Any caSe will do.
	 *
	 * @future-review In PHP 8+, {@see FILTER_VALIDATE_BOOL} is the preferred constant.
	 */
	public static function validate( /* mixed */ $value, bool $strict = false ) /* : bool|null */ : ?bool {
		return filter_var( $value,
			defined( 'FILTER_VALIDATE_BOOL' ) ? FILTER_VALIDATE_BOOL : FILTER_VALIDATE_BOOLEAN,
			[ 'flags' => $strict ? FILTER_NULL_ON_FAILURE : 0 ]
		);
	}
}
