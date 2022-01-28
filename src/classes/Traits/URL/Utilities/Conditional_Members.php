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
namespace Clever_Canyon\Utilities\Traits\URL\Utilities;

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
 * @see   U\URL
 */
trait Conditional_Members {
	/**
	 * Checks URL validity; e.g., `https://example.com`, `https://[::ffff:2d4f:713]`.
	 *
	 * @since 2021-12-26
	 *
	 * @param mixed $value Value to check.
	 *
	 * @return bool True if it's a valid URL containing scheme & hostname.
	 *
	 * @see   https://o5p.me/kEENZa
	 * @note  See also the tests for function.
	 *
	 * @see   U\URL::is_hostname() for inherited validations for hostname.
	 * @note  Additional schemes are allowed and some do not require a hostname;
	 *        e.g., `mailto:`, `news:`, `file:`.
	 */
	public static function is( /* mixed */ $value ) : bool {
		return false !== filter_var( $value, FILTER_VALIDATE_URL );
	}

	/**
	 * Checks URL validity; e.g., `https://example.com/?v=1`.
	 *
	 * @since 2021-12-26
	 *
	 * @param mixed $value Value to check.
	 *
	 * @return bool True if it's a valid URL containing scheme, hostname, and query.
	 *              {@see U\URL::is()} for inherited validations.
	 *
	 * @see   https://o5p.me/kEENZa
	 * @note  See also the tests for function.
	 *
	 * @see   U\URL::is() for inherited validations.
	 * @note  Query string must come before an optional `#fragment`.
	 */
	public static function is_with_query( /* mixed */ $value ) : bool {
		return false !== filter_var( $value, FILTER_VALIDATE_URL, [ 'flags' => FILTER_FLAG_QUERY_REQUIRED ] );
	}

	/**
	 * Checks hostname validity; e.g., `127.0.0.1`, `localhost`, `example.com`.
	 *
	 * @since 2021-12-26
	 *
	 * @param mixed $value Value to check.
	 *
	 * @return bool True if it's a valid hostname.
	 *
	 * @see   https://o5p.me/d3ayZ8
	 * @note  See also the tests for function.
	 *
	 * @note  A trailing dot is allowed. Recommend trimming.
	 * @note  Max length of each dotted label is `63` bytes.
	 * @note  Max overall length is 253 bytes, not counting final `.`, which is optional.
	 */
	public static function is_hostname( /* mixed */ $value ) : bool {
		return false !== filter_var( $value, FILTER_VALIDATE_DOMAIN, [ 'flags' => FILTER_FLAG_HOSTNAME ] );
	}
}
