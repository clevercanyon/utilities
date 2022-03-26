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

/*
 * Lint configuration.
 *
 * @since 2021-12-25
 *
 * WPCS doesn't understand the `never` return type yet.
 * phpcs:disable Squiz.Commenting.FunctionComment.InvalidNoReturn
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\HTTP\Utilities;

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
 * @see   U\HTTP
 */
trait Redirect_Members {
	/**
	 * Performs an HTTP redirection.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $location Redirect location.
	 * @param int    $status   Redirect status code. Default is `302`.
	 */
	public static function redirect( string $location, int $status = 302 ) : void {
		if ( U\Env::is_wordpress() ) {
			wp_redirect( $location, $status ); // phpcs:ignore -- redirect ok.
		} else {
			header( 'location: ' . $location, true, $status );
		}
	}

	/**
	 * Performs an HTTP redirection & exits.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $location Redirect location.
	 * @param int    $status   Redirect status code. Default is `302`.
	 *
	 * @return never Halts script execution.
	 */
	public static function redirect_exit( string $location, int $status = 302 ) /* : never */ : void {
		U\HTTP::redirect( $location, $status );
		exit(); // Halts script execution.
	}
}
