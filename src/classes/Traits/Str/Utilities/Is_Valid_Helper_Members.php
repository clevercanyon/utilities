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
trait Is_Valid_Helper_Members {
	/**
	 * Checks string validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str       String to check.
	 *
	 * @param int    $min_chars Optional minimum chars. Default is `2`.
	 * @param int    $max_chars Optional maximum chars. Default is `100`.
	 * @param string $regexp    Optional valid regular expression pattern.
	 *
	 * @param string $prefix    Optional required prefix. Default is ``, no prefix requirement.
	 *                          If given, `$min_chars`, `$max_chars`, and `$regexp` are tested against
	 *                          both the full string and also the unprefixed string.
	 *
	 * @param string $suffix    Optional required suffix. Default is ``, no suffix requirement.
	 *                          If given, `$min_chars`, `$max_chars`, and `$regexp` are tested against
	 *                          both the full string and also the unsuffixed string.
	 *
	 * @return bool True if it's a valid string.
	 */
	protected static function is_valid_helper(
		string $str,
		int $min_chars = 2,
		int $max_chars = 100,
		string $regexp = '',
		string $prefix = '',
		string $suffix = ''
	) : bool {
		$str_chars = mb_strlen( $str );
		$min_chars = max( 0, $min_chars );
		$max_chars = max( 0, $max_chars );

		if ( $min_chars && $str_chars < $min_chars ) {
			return false;
		} elseif ( $max_chars && $str_chars > $max_chars ) {
			return false;
		} elseif ( $regexp && ! preg_match( $regexp, $str ) ) {
			return false;
		}
		if ( '' !== $prefix ) {
			$unprefixed_str       = mb_substr( $str, mb_strlen( $prefix ) );
			$unprefixed_str_chars = mb_strlen( $unprefixed_str );

			if ( $unprefixed_str === $str ) {
				return false;
			} elseif ( $min_chars && $unprefixed_str_chars < $min_chars ) {
				return false;
			} elseif ( $max_chars && $unprefixed_str_chars > $max_chars ) {
				return false;
			} elseif ( $regexp && ! preg_match( $regexp, $unprefixed_str ) ) {
				return false;
			}
		}
		if ( '' !== $suffix ) {
			$unsuffixed_str       = mb_substr( $str, 0, -mb_strlen( $suffix ) );
			$unsuffixed_str_chars = mb_strlen( $unsuffixed_str );

			if ( $unsuffixed_str === $str ) {
				return false;
			} elseif ( $min_chars && $unsuffixed_str_chars < $min_chars ) {
				return false;
			} elseif ( $max_chars && $unsuffixed_str_chars > $max_chars ) {
				return false;
			} elseif ( $regexp && ! preg_match( $regexp, $unsuffixed_str ) ) {
				return false;
			}
		}
		return true;
	}
}
