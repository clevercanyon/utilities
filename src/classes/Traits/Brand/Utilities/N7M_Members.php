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
	 * Brands by N7M.
	 *
	 * @since 2022-01-27
	 *
	 * @return \Generator|U\Brand[] Brands by N7M.
	 */
	public static function by_n7m() : \Generator {
		foreach ( U\Brand::BY_N7M as $_n7m => $_brand ) {
			yield $_n7m => U\Brand::factory( $_n7m );
		}
	}

	/**
	 * Gets brand info by N7M.
	 *
	 * @since         2022-01-19
	 *
	 * @param string      $n7m    A brand's n7m (numeronym) to get object for.
	 *                            {@see U\Brand::BY_N7M} for a full list of N7Ms.
	 *                            {@see https://en.wikipedia.org/wiki/Numeronym}.
	 *
	 * @param string|null $prop   Default is `null` indicating a return object with all properties.
	 *                            Optionally pass property to get; {@see U\Traits\A6t\Brand\Properties\Property_Members}.
	 *
	 * @param string|null $format Optional format. Default is `null` (raw).
	 *                            This is only applicable when `$prop` is not `null`.
	 *                            {@see U\Brand::format_str_helper()} for further details.
	 *
	 * @return U\Brand|mixed If `$prop` is `null`, a {@see U\Brand} object containing all props; else `null` on failure.
	 *                       If `$prop` is not `null`, value of `$prop` in desired `$format`; else `null` on failure.
	 */
	public static function get( string $n7m, /* string|null */ ?string $prop = null, /* string|null */ ?string $format = null ) /* : mixed */ {
		$brand  = U\Brand::factory( $n7m );
		$format = $format ?: 'raw'; // Default is `raw`.

		if ( ! $brand ) {
			return null; // Failure.
		}
		if ( null === $prop ) {
			return $brand; // Instance.
		}
		if ( ! isset( $brand->{$prop} ) ) {
			return null; // Not available.
		}
		if ( 'raw' === $format || ! is_string( $brand->{$prop} ) ) {
			return $brand->{$prop}; // Raw property.
		}
		$cls_cache_key_parts = [ __FUNCTION__, $brand->n7m, $prop, $format ];
		$value               = &static::cls_cache( $cls_cache_key_parts );

		if ( null !== $value ) {
			return $value; // Saves time.
		}
		return $value = U\Brand::format_str_helper( $brand->{$prop}, $format );
	}

	/**
	 * Gets brand object by N7M.
	 *
	 * @since 2022-01-19
	 *
	 * @param string $n7m A brand's n7m (numeronym) to get object for.
	 *                    {@see U\Brand::BY_N7M} for a full list of N7Ms.
	 *                    {@see https://en.wikipedia.org/wiki/Numeronym}.
	 *
	 * @return U\Brand|null Brand object; else `null` on failure.
	 */
	protected static function factory( string $n7m ) /* : U\Brand|null */ : ?U\Brand {
		$n7m = '&' === $n7m ? 'c10n' : $n7m;

		if ( ! $n7m || ! isset( U\Brand::BY_N7M[ $n7m ] ) ) {
			return null; // Not available.
		}
		if ( isset( U\Brand::$instances[ $n7m ] ) ) {
			return U\Brand::$instances[ $n7m ];
		}
		$org_n7m                    = U\Brand::BY_N7M[ $n7m ][ 'org_n7m' ];
		$org                        = null === $org_n7m ? null : U\Brand::factory( $org_n7m );
		U\Brand::$instances[ $n7m ] = new U\Brand( [ 'org' => $org ] + U\Brand::BY_N7M[ $n7m ] );

		return U\Brand::$instances[ $n7m ];
	}
}
