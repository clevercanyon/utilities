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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\OOPs\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\OOPs\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Exception};

// </editor-fold>

/**
 * Array utilities.
 *
 * @since 2021-12-15
 */
class Arr extends Base {
	/**
	 * Gets first value from array.
	 *
	 * @since 2021-12-23
	 *
	 * @param array $arr Array to query.
	 *
	 * @return mixed First value, else `null` if array is empty.
	 *
	 * @see   Compliments the built-in {@see array_key_first()} function.
	 */
	public static function value_first( array $arr ) /* : mixed */ {
		return $arr ? ( $arr[ array_key_first( $arr ) ] ?? null ) : null;
	}

	/**
	 * Gets last value from array.
	 *
	 * @since 2021-12-23
	 *
	 * @param array $arr Array to query.
	 *
	 * @return mixed Last value, else `null` if array is empty.
	 *
	 * @see   Compliments the built-in {@see array_key_last()} function.
	 */
	public static function value_last( array $arr ) /* : mixed */ {
		return $arr ? ( $arr[ array_key_last( $arr ) ] ?? null ) : null;
	}

	/**
	 * Key accessor.
	 *
	 * @since 2021-12-15
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
		if ( ! $arr || '' === $path || '' === $delimiter ) {
			return null; // Not possible.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $ctn, $key ) {
			if ( $ctn && is_array( $ctn ) ) {
				return $ctn[ $key ] ?? null;
			} elseif ( $ctn && is_object( $ctn ) ) {
				return $ctn->{$key} ?? null;
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
	 * @param string $by    One of `key|value`. Be careful by `value`.
	 *                      When sorting by `value`, array keys are NOT preserved.
	 *
	 * @param array  $arr   Input array to be sorted.
	 * @param int    $flags Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws Exception If attempting to sort by non-scalar values.
	 * @throws Exception If attempting to sort by an unexpected directive.
	 *
	 * @return array Sorted array.
	 *
	 * @see   Ctn::sort_by() For collection use.
	 * @see   https://www.php.net/manual/en/array.sorting.php
	 */
	public static function sort_by( string $by, array $arr, int $flags = SORT_NATURAL ) : array {
		switch ( $by ) {
			case 'key':
				ksort( $arr, $flags );
				break;

			case 'value':
				foreach ( $arr as $_value ) {
					if ( ! is_null( $_value ) && ! is_scalar( $_value ) ) {
						throw new Exception( 'All values must be null|scalar.' );
					}
				}
				sort( $arr, $flags );
				break;

			default:
				throw new Exception( 'Unexpected sort by directive: `' . $by . '`.' );
		}
		return $arr;
	}
}
