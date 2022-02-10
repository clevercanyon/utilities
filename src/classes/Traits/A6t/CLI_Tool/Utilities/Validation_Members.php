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
namespace Clever_Canyon\Utilities\Traits\A6t\CLI_Tool\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\CLI_Tool
 */
trait Validation_Members {
	/**
	 * Validate and expand option value to absolute path.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed             $path           Option value to validate as a path.
	 *                                          This will also be expanded to an absolute path.
	 *
	 * @param string|array|null $req_path_types Require path type? Default is `null`, no requirement.
	 *                                          You can set this to anything returned by {@see U\Fs::real_type()}.
	 *                                          You can also pass an array of resolved path types that are acceptable.
	 *
	 * @return string Absolute path, if valid, else empty string.
	 */
	protected function v6e_abs_path( /* mixed */ $path, /* string|array|null */ $req_path_types = null ) : string {
		assert( is_string( $req_path_types ) || is_array( $req_path_types ) || is_null( $req_path_types ) );
		$req_path_types = null !== $req_path_types ? (array) $req_path_types : null;

		if ( is_string( $path ) && '' !== $path ) {
			$abs_path         = U\Fs::abs( $path );
			$is_req_path_type = null; // Initialize.

			if ( $abs_path && null !== $req_path_types ) {
				$is_req_path_type = in_array( U\Fs::real_type( $abs_path ), $req_path_types, true );
			}
			if ( $abs_path && false !== $is_req_path_type ) {
				return $abs_path;
			}
		}
		return '';
	}
}
