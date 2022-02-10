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
namespace Clever_Canyon\Utilities\Traits\Pkg\Utilities;

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
 * @see   U\Pkg
 */
trait FQN_Members {
	/**
	 * Gets package FQN crux of an interface, class, trait, method, function; i.e., no scope; all levels.
	 *
	 * @since 2022-01-30
	 *
	 * @param string|null $fqn    FQN to parse. Pass a `__NAMESPACE__`, `__CLASS__`, `::class`, `__TRAIT__`,
	 *                            `__METHOD__`, or `__FUNCTION__` (outside of a class). Or any other FQN in PHP.
	 *
	 * @param string|null $format Optional format. Default is `null` (raw).
	 *                            {@see U\Pkg::format_str_helper()} for further details.
	 *
	 * @return string FQN crux; i.e., no scope; all levels.
	 *
	 *                * e.g., `Level_One\Level_Two\Level_Three\Interface_Name`.
	 *                * e.g., `Level_One\Level_Two\Level_Three\Class_Name`.
	 *                * e.g., `Level_One\Level_Two\Level_Three\Trait_Name`.
	 *                * e.g., `Level_One\Level_Two\Level_Three::method_name`.
	 *                * e.g., `Level_One\Level_Two\Level_Three->method_name`.
	 *                * e.g., `Level_One\Level_Two\Level_Three\function_name`.
	 *
	 * @throws U\Fatal_Exception If there aren't at least two levels available; indicating parse failure.
	 * @throws U\Fatal_Exception If first level ends up being a namespace scope; indicating a parse failure.
	 */
	public static function fqn_crux( string $fqn, /* string|null */ ?string $format = null ) : string {
		$format = $format ?: 'raw'; // Default is `raw`.
		$crux   = &static::cls_cache( [ __FUNCTION__, $fqn, $format ] );

		if ( null !== $crux ) {
			return $crux; // Saves time.
		}
		if ( 'raw' === $format ) {
			$raw_crux = &$crux; // Same as the above.
		} else {
			$raw_crux = &static::cls_cache( [ __FUNCTION__, $fqn, 'raw' ] );
		}
		if ( null === $raw_crux ) {
			$raw_crux  = $fqn; // Start value.
			$raw_scope = U\Pkg::namespace_scope( $fqn );

			if ( $raw_scope ) { // Strip scope before anything else.
				$raw_crux = mb_substr( $raw_crux, mb_strlen( $raw_scope . '\\' ) );
			}
			$raw_crux = trim( $raw_crux, '/\\' );

			if ( ! preg_match( U\Pkg::FQN_CRUX_REGEXP, $raw_crux ) ) {
				throw new U\Fatal_Exception( 'Failed to parse a valid FQN crux. Got: `' . $raw_crux . '`.' );
			}
		}
		if ( 'raw' === $format ) {
			return $crux = $raw_crux; // Skip formatting.
		}
		return $crux = U\Pkg::format_str_helper( $raw_crux, $format );
	}
}
