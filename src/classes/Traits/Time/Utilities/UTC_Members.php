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
namespace Clever_Canyon\Utilities\Traits\Time\Utilities;

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
 * @see   U\Time
 */
trait UTC_Members {
	/**
	 * Gets UTC timestamp; or another preferred `$format`.
	 *
	 * @since 2022-02-10
	 *
	 * @param string $str    String to convert to UTC timestamp.
	 *                       Default is `now` (current time).
	 *
	 * @param string $format Format to return. Default is `U` (unix timestamp).
	 *                       If `$format` is `U` (default), return type is an integer.
	 *                       Otherwise, return type is a string in the given date/time format.
	 *
	 * @return int|string UTC date/time according to input params.
	 *                    If `$format` is `U` (default), return type is an integer.
	 *                    Otherwise, return type is a string in the given date/time format.
	 *
	 * @see   time()
	 * @see   \DateTimeZone
	 * @see   \DateTime
	 */
	public static function utc( string $str = 'now', string $format = 'U' ) /* : int|string */ {
		static $utc; // Memoize.
		$utc ??= new \DateTimeZone( 'UTC' );

		if ( 'U' !== $format && U\Env::is_wordpress() ) {
			return wp_date( $format, strtotime( $str ), $utc );
		}
		try {
			$date_time = new \DateTime( $str, $utc );
		} catch ( \Exception $exception ) {
			return 'U' === $format ? 0 : ''; // Failure.
		}
		$date_time = $date_time->format( $format );
		return 'U' === $format ? (int) $date_time : $date_time;
	}
}
