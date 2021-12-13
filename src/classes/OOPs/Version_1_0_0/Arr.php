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
 * Array.
 *
 * @since 1.0.0
 */
class Arr extends Base {
	/**
	 * Key accessor.
	 *
	 * @since 1.0.0
	 *
	 * @param  array  $arr       Array to query.
	 * @param  string $path      Path to query array for.
	 * @param  string $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed             Value, else `null` on failure to locate.
	 */
	public static function get_key( array $arr, string $path, string $delimiter = '.' ) {
		return array_reduce( explode( $delimiter, $path ), function ( $_, $k ) {
			return $_[ $k ] ?? null;
		}, $arr );
	}
}
