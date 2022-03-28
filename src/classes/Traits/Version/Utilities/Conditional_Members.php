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
namespace Clever_Canyon\Utilities\Traits\Version\Utilities;

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
 * @see   U\Version
 */
trait Conditional_Members {
	/**
	 * Checks version validity; e.g., `1.0.0`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param bool   $strict Default is `true`.
	 *
	 * @return bool True if it's a valid version.
	 */
	public static function is( string $str, bool $strict = true ) : bool {
		if ( ! $strict ) {
			return U\Str::is_valid_helper( $str, 1, 100, U\Version::LOOSE_SEMANTIC_REGEXP );
		} else {
			return U\Str::is_valid_helper( $str, 1, 100, U\Version::SEMANTIC_REGEXP );
		}
	}
}
