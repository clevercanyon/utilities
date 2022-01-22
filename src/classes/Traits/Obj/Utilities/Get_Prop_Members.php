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
trait Get_Prop_Members {
	/**
	 * Property accessor, by path.
	 *
	 * @since 2021-12-15
	 *
	 * @param object $obj       Object to query.
	 * @param string $path      Path to query object for.
	 * @param string $delimiter Delimiter used in path. Defaults to `.`.
	 *
	 * @return mixed Value, else `null` on failure to locate.
	 *
	 * @see   U\Ctn::get_prop_key()
	 */
	public static function get_prop( object $obj, string $path, string $delimiter = '.' ) /* : mixed */ {
		if ( '' === $path || '' === $delimiter ) {
			return null; // Not possible.
		}
		return array_reduce( explode( $delimiter, $path ), function ( $ctn, $var ) {
			$is_object_ctn = is_object( $ctn );
			$is_array_ctn  = ! $is_object_ctn && is_array( $ctn );

			if ( $is_object_ctn && isset( $ctn->{$var} ) ) {
				return $ctn->{$var};
			} elseif ( $is_array_ctn && isset( $ctn[ $var ] ) ) {
				return $ctn[ $var ];
			} else {
				return null;
			}
		}, $obj );
	}
}
