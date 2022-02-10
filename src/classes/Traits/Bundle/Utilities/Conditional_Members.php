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
trait Conditional_Members {
	/**
	 * A bundle?
	 *
	 * @since 2021-12-16
	 *
	 * @param mixed $value Value to check.
	 *
	 * @return bool True if `$value` is a bundle.
	 */
	public static function is( /* mixed */ $value ) : bool {
		return is_object( $value ) || is_array( $value );
	}

	/**
	 * Bundle is empty?
	 *
	 * @since 2021-12-16
	 *
	 * @param object|array $bundle Bundle to check.
	 *
	 * @return bool True if bundle is empty.
	 */
	public static function empty( /* object|array */ $bundle ) : bool {
		assert( U\Bundle::is( $bundle ) );
		return is_object( $bundle ) ? U\Obj::empty( $bundle ) : empty( $bundle );
	}
}
