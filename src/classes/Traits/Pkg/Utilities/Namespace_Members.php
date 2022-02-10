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
trait Namespace_Members {
	/**
	 * Gets package namespace scope.
	 *
	 * Many of our packages are compiled with PHP Scoper using a namespace scope.
	 * This method returns that scope; e.g., `Xae3c7c368fe2e3c`; else an empty string.
	 *
	 * @since 2022-01-27
	 *
	 * @param string|null $fqn    FQN to parse. Default is this file's `__NAMESPACE__`.
	 *                            Pass a `__NAMESPACE__`, `__CLASS__`, `::class`, `__TRAIT__`, `__METHOD__`,
	 *                            or `__FUNCTION__` (outside of a class). Or anything else that is a FQN.
	 *
	 * @param string|null $format Optional format. Default is `null` (raw).
	 *                            {@see U\Pkg::format_str_helper()} for further details.
	 *
	 * @return string Namespace scope with desired formatting.
	 */
	public static function namespace_scope( /* string|null */ ?string $fqn = null, /* string|null */ ?string $format = null ) : string {
		$fqn    = $fqn ?: __NAMESPACE__;
		$format = $format ?: 'raw'; // Default is `raw`.
		$scope  = &static::cls_cache( [ __FUNCTION__, $fqn, $format ] );

		if ( null !== $scope ) {
			return $scope; // Saves time.
		}
		if ( 'raw' === $format ) {
			$raw_scope = &$scope; // Same as the above.
		} else {
			$raw_scope = &static::cls_cache( [ __FUNCTION__, $fqn, 'raw' ] );
		}
		if ( null === $raw_scope ) {
			$raw_scope = ''; // Default value.
			$part0     = explode( '\\', $fqn )[ 0 ];

			if ( preg_match( U\Pkg::NAMESPACE_SCOPE_REGEXP, $part0 ) ) {
				$raw_scope = $part0; // First part is scope.
			}
		}
		if ( 'raw' === $format ) {
			return $scope = $raw_scope; // Skip formatting.
		}
		return $scope = U\Pkg::format_str_helper( $raw_scope, $format );
	}

	/**
	 * Gets package namespace crux; i.e., no scope; two levels.
	 *
	 * @since 2022-01-30
	 *
	 * @param string|null $fqn    FQN to parse. Default is this file's `__NAMESPACE__`.
	 *                            Pass a `__NAMESPACE__`, `__CLASS__`, `::class`, `__TRAIT__`, `__METHOD__`,
	 *                            or `__FUNCTION__` (outside of a class). Or anything else that is a FQN.
	 *
	 * @param string|null $format Optional format. Default is `null` (raw).
	 *                            {@see U\Pkg::format_str_helper()} for further details.
	 *
	 * @return string Namespace crux; i.e., no scope; two levels.
	 *
	 *                * e.g., `Level_One\Level_Two`.
	 *                * e.g., `Clever_Canyon\Utilities`.
	 *                * e.g., `WP_Groove\Framework`.
	 *
	 * @throws U\Fatal_Exception If there aren't two levels available; indicating parse failure.
	 * @throws U\Fatal_Exception If first level ends up being a namespace scope; indicating a parse failure.
	 */
	public static function namespace_crux( /* string|null */ ?string $fqn = null, /* string|null */ ?string $format = null ) : string {
		$fqn    = $fqn ?: __NAMESPACE__;
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
			$raw_crux = str_replace( [ '\\', '::', '->' ], '/', $raw_crux );
			$raw_crux = trim( $raw_crux, '/\\' );

			while ( mb_substr_count( $raw_crux, '/' ) > 1 ) {
				$raw_crux = dirname( $raw_crux );
			}
			$raw_crux = str_replace( '/', '\\', $raw_crux );

			if ( ! preg_match( U\Pkg::NAMESPACE_CRUX_REGEXP, $raw_crux ) ) {
				throw new U\Fatal_Exception( 'Failed to parse a valid namespace crux. Got: `' . $raw_crux . '`.' );
			}
		}
		if ( 'raw' === $format ) {
			return $crux = $raw_crux; // Skip formatting.
		}
		return $crux = U\Pkg::format_str_helper( $raw_crux, $format );
	}
}
