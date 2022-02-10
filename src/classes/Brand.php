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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Brand utilities.
 *
 * @since 2021-12-15
 */
final class Brand extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Brand\Members;

	/**
	 * Brands by n7m.
	 *
	 * @since 2021-12-15
	 */
	public const BY_N7M = [
		'c10n' => [
			'n7m'       => 'c10n',
			'name'      => 'Clever Canyon',
			'namespace' => 'Clever_Canyon',

			'slug' => 'clevercanyon',
			'var'  => 'clevercanyon',

			'slug_prefix' => 'clevercanyon-',
			'var_prefix'  => 'clevercanyon_',
		],
		'w6e'  => [
			'n7m'       => 'w6e',
			'name'      => 'WP Groove',
			'namespace' => 'WP_Groove',

			'slug' => 'wpgroove',
			'var'  => 'wpgroove',

			'slug_prefix' => 'wpgroove-',
			'var_prefix'  => 'wpgroove_',
		],
	];
}
