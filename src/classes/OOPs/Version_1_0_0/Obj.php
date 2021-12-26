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
 * Object utilities.
 *
 * @since 2021-12-15
 */
class Obj extends Base {
	/**
	 * Object is empty?
	 *
	 * @since 2021-12-16
	 *
	 * @param object $obj Value to check.
	 *
	 * @return bool True if object is empty.
	 */
	public static function empty( object $obj ) : bool {
		return empty( (array) $obj );
	}

	/**
	 * Property accessor.
	 *
	 * @since 2021-12-15
	 *
	 * @param object $obj       Object to query.
	 * @param string $path      Path to query object for.
	 * @param string $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   Ctn::get_prop_key()
	 */
	public static function get_prop( object $obj, string $path, string $delimiter = '.' ) /* : mixed */ {
		if ( '' === $path || '' === $delimiter ) {
			return null; // Not possible.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $ctn, $prop ) {
			if ( $ctn && is_numeric( $prop ) && is_array( $ctn ) ) {
				return $ctn[ $prop ] ?? null;
			} elseif ( $ctn && is_object( $ctn ) ) {
				return $ctn->{$prop} ?? null;
			} elseif ( $ctn && is_array( $ctn ) ) {
				return $ctn[ $prop ] ?? null;
			} else {
				return null;
			}
		}, $obj );
	}

	/**
	 * Sorts an object.
	 *
	 * @since 2021-12-17
	 *
	 * @param string $by    One of `prop|value`. Be careful by `value`.
	 *                      When sorting by `value`, props are NOT preserved.
	 *
	 * @param object $obj   Input object to be sorted.
	 * @param int    $flags Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws Exception If attempting to sort by non-scalar values.
	 * @throws Exception If attempting to sort by an unexpected directive.
	 *
	 * @return \stdClass Sorted object, converted to {@see \stdClass}.
	 *
	 * @see   Ctn::sort_by()
	 * @see   https://www.php.net/manual/en/array.sorting.php
	 */
	public static function sort_by( string $by, object $obj, int $flags = SORT_NATURAL ) : \stdClass {
		$obj = (array) $obj; // For sorting below.

		switch ( $by ) {
			case 'prop':
				ksort( $obj, $flags );
				break;

			case 'value':
				foreach ( $obj as $_value ) {
					if ( ! is_null( $_value ) && ! is_scalar( $_value ) ) {
						throw new Exception( 'All values must be null|scalar.' );
					}
				}
				sort( $obj, $flags );
				break;

			default:
				throw new Exception( 'Unexpected sort by directive: `' . $by . '`.' );
		}
		return (object) $obj;
	}
}
