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
trait Namespace_Scope_Members {
	/**
	 * Gets current package namespace scope.
	 *
	 * @since 2022-01-27
	 *
	 * @return string Most of our packages are compiled with PHP Scoper using a specific namespace scope.
	 *                This returns that scope; e.g., `Xj9ier8xr3oa`; else an empty string.
	 *                {@see U\Dev\Project::$pkg_namespace_scope} for details.
	 */
	public static function namespace_scope() : string {
		static $scope; // Memoize.

		if ( ! isset( $scope ) ) {
			$scope = explode( '\\', __NAMESPACE__ )[ 0 ];
			$scope = 12 === mb_strlen( $scope ) && 'X' === $scope[ 0 ] ? $scope : '';
		}
		return $scope;
	}
}
