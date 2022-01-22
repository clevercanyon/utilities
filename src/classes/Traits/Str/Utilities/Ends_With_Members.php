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
trait Ends_With_Members {
	/**
	 * Checks if string ends with needle.
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at end of `$haystack`.
	 */
	public static function ends_with( string $haystack, string $needle ) : bool {
		return mb_substr( $haystack, -mb_strlen( $needle ) ) === $needle;
	}

	/**
	 * Checks if string ends with needle (caSe-insensitive).
	 *
	 * @since 2022-01-08
	 *
	 * @param string $haystack Haystack string.
	 * @param string $needle   Needle string to search for.
	 *
	 * @return bool True if `$needle` is at end of `$haystack`.
	 */
	public static function iends_with( string $haystack, string $needle ) : bool {
		return mb_strtolower( mb_substr( $haystack, -mb_strlen( $needle ) ) ) === mb_strtolower( $needle );
	}
}
