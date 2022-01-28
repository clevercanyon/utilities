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
trait Name_Slug_Var_Members {
	/**
	 * Brands by IDx.
	 *
	 * @since 2021-12-15
	 */
	protected static array $by_idx = [
		'&'   => [
			'name'      => 'CLEVER CANYON',
			'namespace' => 'Clever_Canyon',

			'slug' => 'clevercanyon',
			'var'  => 'clevercanyon',

			'slug_prefix' => 'clevercanyon-',
			'var_prefix'  => 'clevercanyon_',
		],
		'w6e' => [
			'name'      => 'WP Groove',
			'namespace' => 'WP_Groove',

			'slug' => 'wpgroove',
			'var'  => 'wpgroove',

			'slug_prefix' => 'wpgroove-',
			'var_prefix'  => 'wpgroove_',
		],
	];

	/**
	 * Brands by IDx.
	 *
	 * @since 2022-01-27
	 *
	 * @return array Brands by IDx.
	 */
	public static function by_idx() : array {
		return U\Brand::$by_idx;
	}

	/**
	 * Gets brand info, by IDx.
	 *
	 * @since         2022-01-19
	 *
	 * @param string      $idx Brand IDx to get info for.
	 *                         A brand's IDx is a 3-4 character key.
	 *
	 *                         Typically follows this predictable pattern:
	 *                         - First letter in brand name (lowercase).
	 *                         - Number of letters between first & last letter.
	 *                         - Finally, last letter in brand name (lowercase).
	 *
	 *                         e.g., CLEVER CANYON = `c10n` (or `&` self-reference).
	 *                         e.g., WP Groove     = `w6e`
	 *                         {@see U\Brand::$by_idx} for all IDx keys.
	 *
	 * @param string|null $key Info key to get. Default is `null` (all keys).
	 *
	 * @return mixed If `$key` is passed, returns value of that key, else `null` on failure.
	 *               If `$key` is not passed, an object with data for `$idx`, else `null` on failure.
	 */
	public static function get( string $idx, /* string|null */ ?string $key = null ) /* mixed */ {
		$idx = 'c10n' === $idx ? '&' : $idx; // Org self-reference.

		if ( ! isset( U\Brand::$by_idx[ $idx ] ) ) {
			return null; // Not available.
		}
		if ( null !== $key ) {
			return U\Brand::$by_idx[ $idx ][ $key ] ?? null;
		}
		return (object) U\Brand::$by_idx[ $idx ];
	}
}
