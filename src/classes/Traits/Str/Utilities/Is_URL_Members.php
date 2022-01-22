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
trait Is_URL_Members {
	/**
	 * Checks URL validity; e.g., `https://example.com`, `https://[::ffff:2d4f:713]`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid URL containing scheme & hostname.
	 *
	 * @see   https://o5p.me/kEENZa
	 * @note  See also the tests for function.
	 *
	 * @see   U\Str::is_hostname() for inherited validations for hostname.
	 * @note  Additional schemes are allowed and some do not require a hostname;
	 *        e.g., `mailto:`, `news:`, `file:`.
	 */
	public static function is_url( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_URL );
	}

	/**
	 * Checks URL validity; e.g., `https://example.com/?v=1`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid URL containing scheme, hostname, and query.
	 *              {@see U\Str::is_url()} for inherited validations.
	 *
	 * @see   https://o5p.me/kEENZa
	 * @note  See also the tests for function.
	 *
	 * @see   U\Str::is_url() for inherited validations.
	 * @note  Query string must come before an optional `#fragment`.
	 */
	public static function is_url_query( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_URL, [ 'flags' => FILTER_FLAG_QUERY_REQUIRED ] );
	}
}
