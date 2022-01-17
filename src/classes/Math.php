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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Math utilities.
 *
 * @since 2021-12-15
 */
final class Math extends U\A6t\Stc_Utilities {
	/**
	 * Calculates percentage change.
	 *
	 * @param int|float $from          Calculate from (i.e., value then).
	 * @param int|float $to            Calculate to (i.e., the value now).
	 * @param int       $precision     Defaults to `0`; i.e., no decimal place.
	 * @param bool      $format_string If true, formatted as `+|-[percent]%`.
	 *
	 * @return int|float|string A float if `$precision` is passed, else an integer (default behavior).
	 *                          If `$format_string`, converted to string format: `+|-[percent]%`.
	 *
	 * @see  https://o5p.me/NPtmpS
	 * @note Relative Change = `(Final value – Initial value) / Initial value * 100`
	 */
	public static function percentage_change( float $from, float $to, int $precision = 0, bool $format_string = false ) /* : mixed */ {
		if ( ! $from ) {
			$from++;
			$to++;
		} // Stop division by `0`.

		$precision  = max( 0, $precision );
		$percentage = ( $to - $from ) / $from * 100;

		if ( $precision ) {
			$percentage = (float) number_format( $percentage, $precision, '.', '' );
		} else {
			$percentage = (int) $percentage;
		}
		if ( $format_string ) { // Format for humans.
			if ( $percentage > 0 ) {
				$percentage = '+' . $percentage . '%';
			} elseif ( $percentage < 0 ) {
				$percentage = $percentage . '%';
			} else {
				$percentage .= '%';
			}
		}
		return $percentage;
	}
}
