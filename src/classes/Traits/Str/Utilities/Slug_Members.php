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
trait Slug_Members {
	/**
	 * Checks brand slug validity; e.g., `my-brand`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid brand slug.
	 *
	 * @see   U\Str::is_brand_var()
	 */
	public static function is_brand_slug( string $str, string $starting_with = '' ) : bool {
		$is = U\Str::is_valid_helper( $str, 2, 32, '/^(?!^x-|.*-x-|.*-x$)[a-z](?:-?[a-z0-9])+$/u', $starting_with );

		if ( ! $is ) {
			return false; // Saves time.
		}
		foreach ( U\Brand::by_n7m() as $_brand ) {
			if ( $str === $_brand->slug ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks brand slug prefix validity; e.g., `my-brand-`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid brand slug prefix.
	 *
	 * @see   U\Str::is_brand_var_prefix()
	 */
	public static function is_brand_slug_prefix( string $str, string $starting_with = '' ) : bool {
		$is = U\Str::is_valid_helper( $str, 2, 33, '/^(?!^x-|.*-x-|.*-x$)[a-z](?:-?[a-z0-9])+-$/u', $starting_with );

		if ( ! $is ) {
			return false; // Saves time.
		}
		foreach ( U\Brand::by_n7m() as $_brand ) {
			if ( $str === $_brand->slug_prefix ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks lede slug validity; e.g., `my-brand-my-slug`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid lede slug.
	 *
	 * @see   U\Str::is_lede_var()
	 */
	public static function is_lede_slug( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 64, '/^(?!^x-|.*-x-|.*-x$)[a-z](?:-?[a-z0-9])+$/u', $starting_with );
	}

	/**
	 * Checks lede slug prefix validity; e.g., `my-brand-my-slug-x-`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid lede slug prefix.
	 *
	 * @see   U\Str::is_lede_var_prefix()
	 */
	public static function is_lede_slug_prefix( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 67, '/^(?!^x-|.*-x-.)[a-z](?:-?[a-z0-9])+-x-$/u', $starting_with );
	}

	/**
	 * Checks slug validity; e.g., `my-brand`, `my-brand-my-slug`, `my-brand-my-slug-x-foo`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to check.
	 * @param string $prefix Require it to have a specific prefix?
	 *                       Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid slug.
	 *
	 * @see   U\Str::is_var()
	 */
	public static function is_slug( string $str, string $prefix = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128, '/^[a-z](?:-?[a-z0-9])+$/u', $prefix );
	}

	/**
	 * Checks slug prefix validity; e.g., `my-brand-x-`, `my-brand-my-slug-x-`, `my-brand-my-slug-x-foo-x-`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str           String to check.
	 * @param string $starting_with Require it to start with something specific?
	 *                              Default is an empty string; i.e., no requirement.
	 *
	 * @return bool True if it's a valid slug prefix.
	 *
	 * @see   U\Str::is_var_prefix()
	 */
	public static function is_slug_prefix( string $str, string $starting_with = '' ) : bool {
		return U\Str::is_valid_helper( $str, 2, 128 - 40, '/^[a-z](?:-?[a-z0-9])+-x-$/u', $starting_with );
	}

	/**
	 * Converts string to brand slug; e.g., `my-brand`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to brand slug.
	 * @param bool   $strict Strict definition validations? Default is `true`.
	 *                       {@see U\Str::to_slug()} for further details.
	 *
	 * @return string String converted to brand slug.
	 *                {@see U\Str::to_slug()} for further details.
	 *
	 * @see   U\Str::to_brand_var()
	 */
	public static function to_brand_slug( string $str, bool $strict = true ) : string {
		return U\Str::to_slug( $str, $strict, [ 'for:brand' => true ] );
	}

	/**
	 * Converts string to brand slug prefix; e.g., `my-brand-`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to brand slug prefix.
	 * @param bool   $strict Strict validation? Default is `true`.
	 *                       {@see U\Str::to_slug()} for further details.
	 *
	 * @return string String converted to brand slug prefix.
	 *                {@see U\Str::to_slug()} for further details.
	 *
	 * @see   U\Str::to_brand_var_prefix()
	 */
	public static function to_brand_slug_prefix( string $str, bool $strict = true ) : string {
		return '' === ( $slug = U\Str::to_slug( $str, $strict, [ 'for:brand' => true, 'for:prefix' => true ] ) ) ? '' : $slug . '-';
	}

	/**
	 * Converts string to lede slug; e.g., `my-brand-my-slug`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to lede slug.
	 * @param bool   $strict Strict definition validations? Default is `true`.
	 *                       {@see U\Str::to_slug()} for further details.
	 *
	 * @return string String converted to lede slug.
	 *                {@see U\Str::to_slug()} for further details.
	 *
	 * @see   U\Str::to_lede_var()
	 */
	public static function to_lede_slug( string $str, bool $strict = true ) : string {
		return U\Str::to_slug( $str, $strict, [ 'for:lede' => true ] );
	}

	/**
	 * Converts string to lede slug prefix; e.g., `my-brand-my-slug-x-`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to lede slug prefix.
	 * @param bool   $strict Strict validation? Default is `true`.
	 *                       {@see U\Str::to_slug()} for further details.
	 *
	 * @return string String converted to lede slug prefix.
	 *                {@see U\Str::to_slug()} for further details.
	 *
	 * @see   U\Str::to_lede_var_prefix()
	 */
	public static function to_lede_slug_prefix( string $str, bool $strict = true ) : string {
		return '' === ( $slug = U\Str::to_slug( $str, $strict, [ 'for:lede' => true, 'for:prefix' => true ] ) ) ? '' : $slug . '-x-';
	}

	/**
	 * Converts string to slug; e.g., `my-brand`, `my-brand-my-slug`, `my-brand-my-slug-x-foo`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to slug.
	 * @param bool   $strict Strict definition validations? Default is `true`.
	 *
	 *                       * Strict mode validates first byte and maximum of 128 bytes.
	 *                         First byte must be alphabetic; otherwise it gets prefixed with `x`.
	 *
	 *                       * Loose mode does not enforce an alphabetic first byte.
	 *                         Loose mode allows up to 255 bytes in length, which is also
	 *                         the absolute maximum length of {@see U\Str::to_fsc()}.
	 *
	 *                       * In both modes, slugs exceeding max length in bytes
	 *                         get converted into a 64-byte {@see U\Crypto::x_sha()}.
	 *
	 * @param array  $_d     Internal use only — do not pass.
	 *
	 * @return string String converted to slug. Always 2...255 bytes in length.
	 *                In strict (default) mode, always 2...128 bytes in length.
	 *
	 *                * Except, if `$str` given is zero-length, no conversion is done.
	 *                  In which case the return value of this method will be an empty string.
	 *
	 * @see   U\Str::to_var()
	 */
	public static function to_slug( string $str, bool $strict = true, array $_d = [] ) : string {
		if ( '' === $str ) {
			return $str; // Not possible.
		}
		$slug = $str; // Working copy.

		// Detect special directives.

		$for_brand  = ! empty( $_d[ 'for:brand' ] );
		$for_lede   = ! empty( $_d[ 'for:lede' ] );
		$for_prefix = ! empty( $_d[ 'for:prefix' ] );

		// In case of simple var-to-slug conversion.
		// Or, in case of string already being a slug.

		$slug = str_replace( '_', '-', $slug );

		if ( $for_brand && ! $for_lede && ! $for_prefix && U\Str::is_brand_slug( $slug ) ) {
			return $slug; // Saves time.
		} elseif ( $for_brand && ! $for_lede && $for_prefix && U\Str::is_brand_slug_prefix( $slug . '-' ) ) {
			return $slug; // Saves time.
		} elseif ( ! $for_brand && $for_lede && ! $for_prefix && U\Str::is_lede_slug( $slug ) ) {
			return $slug; // Saves time.
		} elseif ( ! $for_brand && $for_lede && $for_prefix && U\Str::is_lede_slug_prefix( $slug . '-x-' ) ) {
			return $slug; // Saves time.
		} elseif ( ! $for_brand && ! $for_lede && ! $for_prefix && U\Str::is_slug( $slug ) ) {
			return $slug; // Saves time.
		} elseif ( ! $for_brand && ! $for_lede && $for_prefix && U\Str::is_slug_prefix( $slug . '-x-' ) ) {
			return $slug; // Saves time.
		}
		// Trim whitespace.

		$slug = trim( $slug );

		// Convert international chars to ASCII.

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$slug = U\Str::to_ascii_er( $slug );
		} else { // Replace non-ASCII alphanumerics with `x`.
			$slug = preg_replace( '/(?![a-z0-9])[\p{L}\p{N}]/ui', 'x', $slug );
		}
		// Force lowercase.

		$slug = mb_strtolower( $slug );

		// Convert invalid characters into dashes `-`.
		// Also trims dashes to prevent leading or trailing `-`.

		// NOTE: It is possible for the string to become empty here.
		// If the string contains all invalid characters those become
		// all dashes, which are then trimmed away. This is why there's
		// a minimum length check below; even when `$strict` is `false`.

		$slug = trim( preg_replace( '/[^a-z0-9]+/u', '-', $slug ), '-' );

		// If brand|lede, replace invalid `x-|-x-|-x` sequences with `x`.

		if ( $for_brand || $for_lede ) {
			$slug = preg_replace( '/^x-|-x-|-x$/u', 'x', $slug );
		}
		// Check first byte and min/max byte length validations.
		// In strict mode, validates first byte and maximum of 128 bytes.
		// In loose mode, no first-byte check, maximum is 255 bytes.

		// Brand slugs always have a max length of 32 bytes; in either mode.
		// Lede slugs always have a max length of 64 bytes; in either mode.

		// Prefixes must leave `3` bytes for `-x-` and `40` bytes for next slug; in either mode.
		// `40` is the lenth of a sha-1 hash, which seems like a reasonable expectation.

		if ( $strict ) {
			if ( ! preg_match( '/^[a-z]/', $slug ) ) {
				$slug = 'x' . $slug;
			}
			if ( ( $bytes = strlen( $slug ) ) < 2 ) {
				$slug .= str_repeat( 'x', 2 - $bytes );
			} elseif ( $bytes > ( $for_brand ? 32 : ( $for_lede ? 64 : ( $for_prefix ? 128 - 3 - 40 : 128 ) ) ) ) {
				$slug = U\Crypto::x_sha( trim( $str ), 64 ); // Hash the original string.
			}
		} else {
			if ( ( $bytes = strlen( $slug ) ) < 2 ) {
				$slug .= str_repeat( 'x', 2 - $bytes );
			} elseif ( $bytes > ( $for_brand ? 32 : ( $for_lede ? 64 : ( $for_prefix ? 255 - 3 - 40 : 255 ) ) ) ) {
				$slug = U\Crypto::x_sha( trim( $str ), 64 ); // Hash the original string.
			}
		}
		return $slug;
	}

	/**
	 * Converts string to slug prefix; e.g., `my-brand-x-`, `my-brand-my-slug-x-`, `my-brand-my-slug-x-foo-x-`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str    String to convert to slug prefix.
	 * @param bool   $strict Strict validation? Default is `true`.
	 *                       {@see U\Str::to_slug()} for further details.
	 *
	 * @return string String converted to slug prefix.
	 *                {@see U\Str::to_slug()} for further details.
	 *
	 * @see   U\Str::to_var_prefix()
	 */
	public static function to_slug_prefix( string $str, bool $strict = true ) : string {
		return '' === ( $slug = U\Str::to_slug( $str, $strict, [ 'for:prefix' => true ] ) ) ? '' : $slug . '-x-';
	}
}
