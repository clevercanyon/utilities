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
 * Object.
 *
 * @since 1.0.0
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
	 * @since 1.0.0
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
		if ( ! strlen( $path ) ) {
			return null; // Must have at least one iteration below.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $ctn, $prop ) {
			if ( $ctn && is_numeric( $prop ) && is_array( $ctn ) ) {
				return $ctn[ $prop ] ?? null;
			} elseif ( $ctn && is_object( $ctn ) ) {
				return $ctn->{$prop} ?? null;
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
	 * @param string $by    One of `prop|value`.
	 * @param object $obj   Input object to be sorted.
	 * @param int    $flags Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws Exception If attempting to sort by non-scalar values.
	 * @throws Exception If attempting to sort by an unexpected directive.
	 *
	 * @return \StdClass Sorted object, converted to {@see \StdClass}.
	 *
	 * @see   Ctn::sort_by()
	 */
	public static function sort_by( string $by, object $obj, int $flags = SORT_NATURAL ) : \StdClass {
		$obj = (array) $obj; // For sorting below.

		switch ( $by ) {
			case 'prop':
				ksort( $obj, SORT_NATURAL );
				break;

			case 'value':
				foreach ( $obj as $_value ) {
					if ( ! is_scalar( $_value ) ) {
						throw new Exception( 'All values must be scalar.' );
					}
				}
				sort( $obj, SORT_NATURAL );
				break;

			default:
				throw new Exception( 'Unexpected sort by directive: `' . $by . '`.' );
		}
		return (object) $obj;
	}
}
