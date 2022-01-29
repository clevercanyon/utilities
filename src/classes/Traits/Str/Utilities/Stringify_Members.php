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
trait Stringify_Members {
	/**
	 * Stringifies data.
	 *
	 * This is NOT purely a JSON-encoder (don't use it that way).
	 * For example, null, scalar, and resource values are simply converted to strings.
	 * Instead, {@see U\Str::json_encode()} for real JSON encoding.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed     $data         Data to stringify.
	 * @param bool|null $pretty_print Pretty print? {@see U\Str::json_encode()} for details.
	 *
	 * @return string String representation.
	 *
	 * @see   U\Bundle::stringify()
	 */
	public static function stringify( /* mixed */ $data, /* bool|null */ ?bool $pretty_print = null ) : string {
		if ( null === $data || is_scalar( $data ) || is_resource( $data ) ) {
			return (string) $data; // Cannot be decoded as JSON.
		}
		return U\Str::json_encode( $data, $pretty_print );
	}
}
