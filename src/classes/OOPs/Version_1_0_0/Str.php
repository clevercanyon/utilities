<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;

/**
 * Str.
 *
 * @since 1.0.0
 */
class Str extends Base {
	/**
	 * Stringifies data.
	 *
	 * @since 1.0.0
	 *
	 * @param  mixed $data         Data.
	 * @param  bool  $pretty_print Pretty print?
	 *
	 * @return string      String representation.
	 */
	public static function stringify( $data, bool $pretty_print = true ) : string {
		if ( is_scalar( $data ) ) {
			$string = (string) $data;
		} elseif ( $pretty_print ) {
			$string = json_encode( $data, JSON_PRETTY_PRINT );
		} else {
			$string = json_encode( $data );
		}
		return $string;
	}
}
