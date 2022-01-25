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
namespace Clever_Canyon\Utilities\Traits\Arr\Utilities;

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
 * @see   U\Arr
 */
trait Get_Key_Members {
	/**
	 * Key accessor, by path.
	 *
	 * @since 2021-12-15
	 *
	 * @param array  $arr       Array to query.
	 * @param string $path      Path to query array for.
	 * @param string $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   U\Bundle::get_prop_key() For bundle use.
	 */
	public static function get_key( array $arr, string $path, string $delimiter = '.' ) /* : mixed */ {
		if ( ! $arr || '' === $path || '' === $delimiter ) {
			return null; // Not possible.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $bundle, $var ) {
			$is_array_bundle  = is_array( $bundle );
			$is_object_bundle = ! $is_array_bundle && is_object( $bundle );

			if ( $is_array_bundle && isset( $bundle[ $var ] ) ) {
				return $bundle[ $var ];
			} elseif ( $is_object_bundle && isset( $bundle->{$var} ) ) {
				return $bundle->{$var};
			} else {
				return null;
			}
		}, $arr );
	}
}
