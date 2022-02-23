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
namespace Clever_Canyon\Utilities\Traits\Debug\Utilities;

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
 * @see   U\Debug
 */
trait Token_Members {
	/**
	 * Gets token type.
	 *
	 * @since 2022-02-23
	 *
	 * @param array $tokens Array of tokens via {@see token_get_all()}.
	 * @param int   $i      Array index to retrieve type of.
	 *
	 * @return int|string Token type.
	 */
	public static function token_type( array $tokens, int $i ) /* : int|string */ {
		if ( ! isset( $tokens[ $i ] ) ) {
			return '';
		}
		if ( is_array( $tokens[ $i ] ) ) {
			$type = $tokens[ $i ][ 0 ];
		} else {
			$type = $tokens[ $i ];
		}
		return $type;
	}

	/**
	 * Gets or sets token value.
	 *
	 * @since 2022-02-23
	 *
	 * @param array       $tokens    Array of tokens via {@see token_get_all()}.
	 * @param int         $i         Array index to retrieve|set value of.
	 * @param string|null $new_value New token value, if setting. Default is `null` (no change).
	 *
	 * @return string Token value.
	 */
	public static function token_value( array &$tokens, int $i, /* string|null */ ?string $new_value = null ) : string {
		if ( ! isset( $tokens[ $i ] ) ) {
			return ''; // Not possible.
		}
		if ( is_array( $tokens[ $i ] ) ) {
			$value = &$tokens[ $i ][ 1 ];
		} else {
			$value = &$tokens[ $i ];
		}
		if ( null !== $new_value ) {
			$value = $new_value;
		}
		return $value;
	}
}
