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
trait Preg_Match_In_Members {
	/**
	 * Does a {@see preg_match()} against an array of patterns.
	 *
	 * @since 2021-12-30
	 *
	 * @param object|array $patterns Array of regexp patterns.
	 * @param string       $str      Subject string to test against patterns.
	 *
	 * @param array|null   $matches  No change. {@see preg_match()} for details.
	 *
	 * @param mixed        ...$args  No change. {@see preg_match()} for details.
	 *                               Not all args are documented here, but it's fine to pass
	 *                               in the others. Such as `$flags` and `$offset`.
	 *
	 * @return int|false Same as {@see preg_match()}.
	 */
	public static function preg_match_in(
		/* object|array */ $patterns,
		string $str,
		/* array|null */ ?array &$matches = null,
		...$args // e.g., $flags, $offset, etc.
	) /* : int|false */ {
		assert( U\Ctn::is( $patterns ) );

		foreach ( $patterns as $_pattern ) {
			if ( $_preg_match = preg_match( $_pattern, $str, $matches, ...$args ) ) {
				return $_preg_match; // Number of matches.
			}
		}
		return 0; // No match.
	}
}
