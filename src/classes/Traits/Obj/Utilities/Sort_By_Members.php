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
namespace Clever_Canyon\Utilities\Traits\Obj\Utilities;

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
 * @see   U\Obj
 */
trait Sort_By_Members {
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
	 * @throws U\Exception If attempting to sort by non-scalar values.
	 * @throws U\Exception If attempting to sort by an unexpected directive.
	 *
	 * @return object Sorted object, converted to {@see \stdClass}.
	 *
	 * @see   U\Ctn::sort_by()
	 * @see   https://www.php.net/manual/en/array.sorting.php
	 */
	public static function sort_by( string $by, object $obj, int $flags = SORT_NATURAL ) : object {
		$obj = (array) $obj; // For sorting below.

		switch ( $by ) {
			case 'prop':
				ksort( $obj, $flags );
				break;

			case 'value':
				foreach ( $obj as $_value ) {
					if ( null !== $_value && ! is_scalar( $_value ) ) {
						throw new U\Exception( 'All values must be null|scalar.' );
					}
				}
				sort( $obj, $flags );
				break;

			default:
				throw new U\Exception( 'Unexpected sort by directive: `' . $by . '`.' );
		}
		return (object) $obj;
	}
}
