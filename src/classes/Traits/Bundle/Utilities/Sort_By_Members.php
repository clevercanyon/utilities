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
namespace Clever_Canyon\Utilities\Traits\Bundle\Utilities;

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
 * @see   U\Bundle
 */
trait Sort_By_Members {
	/**
	 * Sorts a bundle.
	 *
	 * @since 2021-12-17
	 *
	 * @param string       $by     One of `prop_key|value`.
	 * @param object|array $bundle Input bundle to be sorted.
	 * @param int          $flags  Optional flags. Defaults to `SORT_NATURAL`.
	 *
	 * @throws U\Exception If attempting to sort by non-scalar values.
	 * @throws U\Exception If attempting to sort by an unexpected directive.
	 *
	 * @return object|array Sorted bundle.
	 *
	 * @see   U\Obj::sort_by()
	 * @see   U\Arr::sort_by()
	 */
	public static function sort_by( string $by, /* object|array */ $bundle, int $flags = SORT_NATURAL ) /* : object|array */ {
		assert( U\Bundle::is( $bundle ) );

		return is_object( $bundle )
			? U\Obj::sort_by( 'prop_key' === $by ? 'prop' : $by, $bundle, $flags )
			: U\Arr::sort_by( 'prop_key' === $by ? 'key' : $by, $bundle, $flags );
	}
}
