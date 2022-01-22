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
namespace Clever_Canyon\Utilities\Traits\Str\Utilities;

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
 * @see   U\Str
 */
trait Is_Name_Slug_Var_Members {
	/**
	 * Checks name validity; e.g., `My Name`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a prefix?
	 *                       Default is ``, no required prefix.
	 *
	 * @return bool True if it's a valid name.
	 */
	public static function is_name( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128, '/^.+$/ui', $prefix );
	}

	/**
	 * Checks slug validity; e.g., `my-slug`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a prefix?
	 *                       Default is ``, no required prefix.
	 *
	 * @return bool True if it's a valid slug.
	 */
	public static function is_slug( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128, '/^[a-z](?:-{0,2}[a-z0-9])+$/u', $prefix );
	}

	/**
	 * Checks var validity; e.g., `my_var`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a prefix?
	 *                       Default is ``, no required prefix.
	 *
	 * @return bool True if it's a valid var.
	 */
	public static function is_var( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128, '/^[a-z](?:_{0,2}[a-z0-9])+$/u', $prefix );
	}
}
