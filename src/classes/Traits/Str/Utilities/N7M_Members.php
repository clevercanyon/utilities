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
trait N7M_Members {
	/**
	 * Checks n7m (numeronym) validity; e.g., `c10n`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid n7m.
	 *
	 * @see   https://en.wikipedia.org/wiki/Numeronym
	 */
	public static function is_n7m( string $str ) : bool {
		return U\Str::is_valid_helper( $str, 3, 4, '/^[a-z0-9][0-9]{1,2}[a-z0-9]$/u' );
	}

	/**
	 * Converts string to n7m (numeronym); e.g., `c10n`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to convert to n7m.
	 *
	 * @return string String converted to n7m.
	 *
	 * @see   https://en.wikipedia.org/wiki/Numeronym
	 */
	public static function to_n7m( string $str ) : string {
		if ( '' === $str ) {
			return $str; // Don't modify.
		}
		$n7m = $str; // Working copy.

		// Convert international chars to ASCII.

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$n7m = U\Str::to_ascii_er( $n7m );
		} else { // Replace non-ASCII alphanumerics with `x`.
			$n7m = preg_replace( '/(?![a-z0-9])[\p{L}\p{N}]/ui', 'x', $n7m );
		}
		// Force lowercase.

		$n7m = mb_strtolower( $n7m );

		// Remove everything that's not alphanumeric.

		$n7m = preg_replace( '/[^a-z0-9]+/u', '', $n7m );

		// Must be at least three bytes in length.

		if ( ( $bytes = strlen( $n7m ) ) < 3 ) {
			$n7m   .= str_repeat( 'x', 3 - $bytes );
			$bytes = 3; // Update byte length.
		}
		// Formulate numeronym.

		return $n7m[ 0 ] . ( $bytes - 2 ) . $n7m[ $bytes - 1 ];
	}
}
