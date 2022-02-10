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
trait Multibyte_Members {
	/**
	 * Lowercases first character (multibyte compatible).
	 *
	 * @since 2022-01-27
	 *
	 * @param string $str String value.
	 *
	 * @return string String with first character lowercase.
	 */
	public static function lc_first( string $str ) : string {
		return $str ? mb_strtolower( $str[ 0 ] ) . mb_substr( $str, 1 ) : $str;
	}

	/**
	 * Uppercases first character (multibyte compatible).
	 *
	 * @since 2022-01-27
	 *
	 * @param string $str String value.
	 *
	 * @return string String with first character uppercase.
	 */
	public static function uc_first( string $str ) : string {
		return $str ? mb_strtoupper( $str[ 0 ] ) . mb_substr( $str, 1 ) : $str;
	}

	/**
	 * Uppercases first character in words (multibyte compatible).
	 *
	 * @since 2022-01-27
	 *
	 * @param string $str        String value.
	 * @param string $separators Word separators.
	 *
	 * @return string String with first character in words uppercased.
	 */
	public static function uc_words( string $str, string $separators = " \t\r\n\f\v" ) : string {
		if ( ! $str ) {
			return $str; // Not applicable.
		}
		$parts      = []; // Initialize.
		$separators = " \t\r\n\f\v" !== $separators
			? U\Str::esc_reg( $separators )
			: $separators;

		foreach ( preg_split( '/([' . $separators . ']+)/u', $str, -1, PREG_SPLIT_DELIM_CAPTURE ) as $_part ) {
			if ( trim( $_part ) ) {
				$_part = U\Str::uc_first( $_part );
			}
			$parts[] = $_part;
		}
		return implode( $parts );
	}
}
