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
trait Var_Members {
	/**
	 * Checks brand var validity; e.g., `my_brand`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid brand var.
	 *
	 * @see   U\Str::is_brand_slug()
	 */
	public static function is_brand_var( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 32, '/^(?!^x_|.*_x_|.*_x$)[a-z](?:_?[a-z0-9])+$/u', $starting_with );
	}

	/**
	 * Checks brand var prefix validity; e.g., `my_brand_`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid brand var prefix.
	 *
	 * @see   U\Str::is_brand_slug_prefix()
	 */
	public static function is_brand_var_prefix( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 33, '/^(?!^x_|.*_x_|.*_x$)[a-z](?:_?[a-z0-9])+_$/u', $starting_with );
	}

	/**
	 * Checks lede var validity; e.g., `my_brand_my_var`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid lede var.
	 *
	 * @see   U\Str::is_lede_slug()
	 */
	public static function is_lede_var( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 64, '/^(?!^x_|.*_x_|.*_x$)[a-z](?:_?[a-z0-9])+$/u', $starting_with );
	}

	/**
	 * Checks lede var prefix validity; e.g., `my_brand_my_var_x_`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid lede var prefix.
	 *
	 * @see   U\Str::is_lede_slug_prefix()
	 */
	public static function is_lede_var_prefix( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 67, '/^(?!^x_|.*_x_.)[a-z](?:_?[a-z0-9])+_x_$/u', $starting_with );
	}

	/**
	 * Checks var validity; e.g., `my_brand`, `my_brand_my_var`, `my_brand_my_var_x_foo`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a specific prefix?
	 *                       Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid var.
	 *
	 * @see   U\Str::is_slug()
	 */
	public static function is_var( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128, '/^[a-z](?:_?[a-z0-9])+$/u', $prefix );
	}

	/**
	 * Checks var prefix validity; e.g., `my_brand_x_`, `my_brand_my_var_x_`, `my_brand_my_var_x_foo_x_`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid var prefix.
	 *
	 * @see   U\Str::is_slug_prefix()
	 */
	public static function is_var_prefix( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128 - 40, '/^[a-z](?:_?[a-z0-9])+_x_$/u', $starting_with );
	}

	/**
	 * Converts string to brand var; e.g., `my_brand`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to brand var.
	 * @param bool   $strict Strict definition validations? Default is `true`.
	 *                       {@see U\Str::to_brand_slug()} for further details.
	 *
	 * @return string String converted to brand var.
	 *                {@see U\Str::to_brand_slug()} for further details.
	 *
	 * @see   U\Str::to_brand_slug()
	 */
	public static function to_brand_var( string $str, bool $strict = true ) : string {
		return str_replace( '-', '_', U\Str::to_brand_slug( $str, $strict ) );
	}

	/**
	 * Converts string to brand var prefix; e.g., `my_brand_`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to brand var prefix.
	 * @param bool   $strict Strict validation? Default is `true`.
	 *                       {@see U\Str::to_brand_slug_prefix()} for further details.
	 *
	 * @return string String converted to brand var prefix.
	 *                {@see U\Str::to_brand_slug_prefix()} for further details.
	 *
	 * @see   U\Str::to_brand_slug_prefix()
	 */
	public static function to_brand_var_prefix( string $str, bool $strict = true ) : string {
		return str_replace( '-', '_', U\Str::to_brand_slug_prefix( $str, $strict ) );
	}

	/**
	 * Converts string to lede var; e.g., `my_brand_my_var`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to lede var.
	 * @param bool   $strict Strict definition validations? Default is `true`.
	 *                       {@see U\Str::to_lede_slug()} for further details.
	 *
	 * @return string String converted to lede var.
	 *                {@see U\Str::to_lede_slug()} for further details.
	 *
	 * @see   U\Str::to_lede_slug()
	 */
	public static function to_lede_var( string $str, bool $strict = true ) : string {
		return str_replace( '-', '_', U\Str::to_lede_slug( $str, $strict ) );
	}

	/**
	 * Converts string to lede var prefix; e.g., `my_brand_my_var_x_`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to lede var prefix.
	 * @param bool   $strict Strict validation? Default is `true`.
	 *                       {@see U\Str::to_lede_slug_prefix()} for further details.
	 *
	 * @return string String converted to lede var prefix.
	 *                {@see U\Str::to_lede_slug_prefix()} for further details.
	 *
	 * @see   U\Str::to_lede_slug_prefix()
	 */
	public static function to_lede_var_prefix( string $str, bool $strict = true ) : string {
		return str_replace( '-', '_', U\Str::to_lede_slug_prefix( $str, $strict ) );
	}

	/**
	 * Converts string to var; e.g., `my_brand`, `my_brand_my_var`, `my_brand_my_var_x_foo`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to var.
	 * @param bool   $strict Strict definition validations? Default is `true`.
	 *                       {@see U\Str::to_slug()} for further details.
	 *
	 * @param array  $_d     Internal use only — do not pass.
	 *
	 * @return string String converted to var.
	 *                {@see U\Str::to_slug()} for further details.
	 *
	 * @see   U\Str::to_slug()
	 */
	public static function to_var( string $str, bool $strict = true, array $_d = [] ) : string {
		return str_replace( '-', '_', U\Str::to_slug( $str, $strict, $_d ) );
	}

	/**
	 * Converts string to var prefix; e.g., `my_brand_x_`, `my_brand_my_var_x_`, `my_brand_my_var_x_foo_x_`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to var prefix.
	 * @param bool   $strict Strict validation? Default is `true`.
	 *                       {@see U\Str::to_slug_prefix()} for further details.
	 *
	 * @return string String converted to var prefix.
	 *                {@see U\Str::to_slug_prefix()} for further details.
	 *
	 * @see   U\Str::to_slug_prefix()
	 */
	public static function to_var_prefix( string $str, bool $strict = true ) : string {
		return str_replace( '-', '_', U\Str::to_slug_prefix( $str, $strict ) );
	}
}
