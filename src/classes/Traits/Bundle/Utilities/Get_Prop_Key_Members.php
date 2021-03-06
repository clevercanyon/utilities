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
trait Get_Prop_Key_Members {
	/**
	 * Property/key accessor, by path.
	 *
	 * @since 2021-12-15
	 *
	 * @param object|array $bundle    Bundle to query.
	 * @param string       $path      Path to query object for.
	 * @param string       $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   U\Obj::get_prop()
	 * @see   U\Arr::get_key()
	 */
	public static function get_prop_key( /* object|array */ $bundle, string $path, string $delimiter = '.' ) /* : mixed */ {
		assert( U\Bundle::is( $bundle ) );

		return is_object( $bundle )
			? U\Obj::get_prop( $bundle, $path, $delimiter )
			: U\Arr::get_key( $bundle, $path, $delimiter );
	}
}
