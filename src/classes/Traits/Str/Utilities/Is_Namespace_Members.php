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
trait Is_Namespace_Members {
	/**
	 * Checks namespace scope validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid namespace scope.
	 */
	public static function is_namespace_scope( string $str ) : bool {
		return $str && preg_match( U\Pkg::NAMESPACE_SCOPE_REGEXP, $str );
	}

	/**
	 * Checks brand namespace validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string      $str String to check.
	 * @param string|null $n7m Specific brand? Default is `null` (any).
	 *
	 * @return bool True if it's a valid brand namespace.
	 */
	public static function is_brand_namespace( string $str, /* string|null */ ?string $n7m = null ) : bool {
		$is = $str && preg_match( U\Pkg::BRAND_NAMESPACE_REGEXP, $str );

		if ( ! $is ) {
			return $is; // Saves time.
		}
		if ( null !== $n7m ) {
			return U\Brand::get( $n7m, 'namespace' ) === $str;
		}
		foreach ( U\Brand::by_n7m() as $_brand ) {
			if ( $str === $_brand->namespace ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Checks namespace crux validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string      $str            String to check.
	 * @param string|null $n7m            Specific brand? Default is `null` (any).
	 * @param string|null $unbranded_slug Specific unbranded slug? Default is `null` (any).
	 *
	 * @return bool True if it's a valid namespace crux.
	 */
	public static function is_namespace_crux(
		string $str,
		/* string|null */ ?string $n7m = null,
		/* string|null */ ?string $unbranded_slug = null
	) : bool {
		$is = $str && preg_match( U\Pkg::NAMESPACE_CRUX_REGEXP, $str );

		if ( ! $is ) {
			return false; // Saves time.
		}
		$level_one = mb_substr( $str, 0, mb_strpos( $str, '\\' ) );
		$is        = U\Str::is_brand_namespace( $level_one, $n7m );

		if ( ! $is || null === $unbranded_slug ) {
			return $is; // Saves time.
		}
		$level_two = mb_substr( $str, mb_strpos( $str, '\\' ) + 1 );
		return mb_strtolower( str_replace( '_', '-', $level_two ) ) === $unbranded_slug;
	}

	/**
	 * Checks class FQN crux validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string      $str String to check.
	 * @param string|null $n7m Specific brand? Default is `null` (any).
	 *
	 * @return bool True if it's a valid class FQN crux.
	 */
	public static function is_class_fqn_crux( string $str, /* string|null */ ?string $n7m = null ) : bool {
		$is = $str && preg_match( U\Pkg::CLASS_FQN_CRUX_REGEXP, $str );

		if ( ! $is ) {
			return false; // Saves time.
		}
		$level_one = mb_substr( $str, 0, mb_strpos( $str, '\\' ) );
		return U\Str::is_brand_namespace( $level_one, $n7m );
	}

	/**
	 * Checks FQN crux validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string      $str String to check.
	 * @param string|null $n7m Specific brand? Default is `null` (any).
	 *
	 * @return bool True if it's a valid FQN crux.
	 */
	public static function is_fqn_crux( string $str, /* string|null */ ?string $n7m = null ) : bool {
		$is = $str && preg_match( U\Pkg::FQN_CRUX_REGEXP, $str );

		if ( ! $is ) {
			return false; // Saves time.
		}
		$level_one = mb_substr( $str, 0, mb_strpos( $str, '\\' ) );
		return U\Str::is_brand_namespace( $level_one, $n7m );
	}
}
