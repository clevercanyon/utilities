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
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

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
	 * @param array  $arr       Array to query.
	 * @param string $path      Path to query array for.
	 * @param string $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   Ctn::get_prop_key For collection use.
	 */
	public static function get_key( array $arr, string $path, string $delimiter = '.' ) /* : mixed */ {
		if ( ! strlen( $path ) ) {
			return null; // Must have at least one iteration below.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $arr, $key ) {
			if ( $arr && is_array( $arr ) ) {
				return $arr[ $key ] ?? null;
			} else {
				return null;
			}
		}, $arr );
	}

	/**
	 * Sorts an array.
	 *
	 * @since 2021-12-17
	 *
	 * @param string $by    One of `key|value`.
	 * @param array  $arr   Input array to be sorted.
	 * @param int    $flags Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws Exception If attempting to sort by non-scalar values.
	 * @throws Exception If attempting to sort by an unexpected directive.
	 *
	 * @return array Sorted array.
	 *
	 * @see   Ctn::sort_by() For collection use.
	 */
	public static function sort_by( string $by, array $arr, int $flags = SORT_NATURAL ) : array {
		switch ( $by ) {
			case 'key':
				ksort( $arr, SORT_NATURAL );
				break;

			case 'value':
				foreach ( $arr as $_value ) {
					if ( ! is_scalar( $_value ) ) {
						throw new Exception( 'All values must be scalar.' );
					}
				}
				sort( $arr, SORT_NATURAL );
				break;

			default:
				throw new Exception( 'Unexpected sort by directive: `' . $by . '`.' );
		}
		return $arr;
	}
}
