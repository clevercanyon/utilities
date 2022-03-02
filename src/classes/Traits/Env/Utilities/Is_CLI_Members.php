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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait Is_CLI_Members {
	/**
	 * Is CLI?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if CLI.
	 */
	public static function is_cli() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = 'cli' === U\Env::server_api();
	}

	/**
	 * Is CLI w/ 256-color support?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if CLI w/ 256-color support.
	 */
	public static function is_cli_256_colors() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = U\Env::is_cli()
			&& preg_match( '/256[_\-]?color/ui', U\Env::var( 'TERM' ) );
	}
}
