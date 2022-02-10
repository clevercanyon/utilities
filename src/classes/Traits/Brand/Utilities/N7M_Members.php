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
namespace Clever_Canyon\Utilities\Traits\Brand\Utilities;

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
 * @see   U\Brand
 */
trait N7M_Members {
	/**
	 * Brands by n7m.
	 *
	 * @since 2022-01-27
	 *
	 * @return \Generator|object[] Brands by n7m.
	 */
	public static function by_n7m() : \Generator {
		foreach ( U\Brand::BY_N7M as $_n7m => $_brand ) {
			yield $_n7m => (object) $_brand;
		}
	}

	/**
	 * Gets brand info, by n7m.
	 *
	 * @since         2022-01-19
	 *
	 * @param string      $n7m    A brand's n7m (numeronym) to get info for.
	 *                            {@see U\Brand::BY_N7M} for a list of n7m keys.
	 *                            {@see https://en.wikipedia.org/wiki/Numeronym}.
	 *
	 *                            e.g., Clever Canyon = `c10n` (or `&` self-reference).
	 *                            e.g., WP Groove     = `w6e`.
	 *                            e.g., Hostery       = `h5y`.
	 *
	 * @param string|null $key    Default is `null` indicating a return object with all keys.
	 *                            Optionally pass an n7m info key to get; {@see U\Brand::BY_N7M}.
	 *
	 * @param string|null $format Optional format. Default is `null` (raw).
	 *                            This is only applicable when `$key` is not `null`.
	 *                            {@see U\Brand::format_str_helper()} for further details.
	 *
	 * @return mixed If `$key` is not `null`, value of `$key` (in desired format); else `null` on failure.
	 *               If `$key` is `null`, an object containing all keys; else `null` on failure.
	 */
	public static function get( string $n7m, /* string|null */ ?string $key = null, /* string|null */ ?string $format = null ) /* mixed */ {
		$n7m    = '&' === $n7m ? 'c10n' : $n7m;
		$format = $format ?: 'raw'; // Default is `raw`.

		if ( ! $n7m || ! isset( U\Brand::BY_N7M[ $n7m ] ) ) {
			return null; // Not available.
		} elseif ( null !== $key && ! isset( U\Brand::BY_N7M[ $n7m ][ $key ] ) ) {
			return null; // Not available.
		}
		$value = &static::cls_cache( [ __FUNCTION__, $n7m, $key, $format ] );

		if ( null !== $value ) {
			return $value; // Saves time.
		}
		if ( null !== $key ) {
			$value = U\Brand::BY_N7M[ $n7m ][ $key ];
			if ( 'raw' !== $format && is_string( $value ) ) {
				$value = U\Brand::format_str_helper( $value, $format );
			}
		} else {
			$value = (object) U\Brand::BY_N7M[ $n7m ];
		}
		return $value;
	}
}
