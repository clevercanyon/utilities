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
 * Brand class & utilities.
 *
 * @since 2021-12-15
 */
final class Brand extends U\A6t\Brand {
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
			'org_n7m' => null,
			'n7m'     => 'c10n',

			'name'      => 'Clever Canyon',
			'namespace' => 'Clever_Canyon',

			'slug' => 'clevercanyon',
			'var'  => 'clevercanyon',

			'slug_prefix' => 'clevercanyon-',
			'var_prefix'  => 'clevercanyon_',
		],
		'c13v' => [
			'org_n7m' => 'c10n',
			'n7m'     => 'c13v',

			'name'      => 'Clever Canyon Dev',
			'namespace' => 'Clever_Canyon_Dev',

			'slug' => 'clevercanyon-dev',
			'var'  => 'clevercanyon_dev',

			'slug_prefix' => 'clevercanyon-dev-',
			'var_prefix'  => 'clevercanyon_dev_',
		],
		'h5y'  => [
			'org_n7m' => 'c10n',
			'n7m'     => 'h5y',

			'name'      => 'Hostery',
			'namespace' => 'Hostery',

			'slug' => 'hostery',
			'var'  => 'hostery',

			'slug_prefix' => 'hostery-',
			'var_prefix'  => 'hostery_',
		],
		'w6e'  => [
			'org_n7m' => 'c10n',
			'n7m'     => 'w6e',

			'name'      => 'WP Groove',
			'namespace' => 'WP_Groove',

			'slug' => 'wpgroove',
			'var'  => 'wpgroove',

			'slug_prefix' => 'wpgroove-',
			'var_prefix'  => 'wpgroove_',
		],
		't5a'  => [
			'org_n7m' => 'c10n',
			'n7m'     => 't5a',

			'name'      => 'Topsica',
			'namespace' => 'Topsica',

			'slug' => 'topsica',
			'var'  => 'topsica',

			'slug_prefix' => 'topsica-',
			'var_prefix'  => 'topsica_',
		],
		'w4s'  => [
			'org_n7m' => 'c10n',
			'n7m'     => 'w4s',

			'name'      => 'Wobots',
			'namespace' => 'Wobots',

			'slug' => 'wobots',
			'var'  => 'wobots',

			'slug_prefix' => 'wobots-',
			'var_prefix'  => 'wobots_',
		],
	];
}
