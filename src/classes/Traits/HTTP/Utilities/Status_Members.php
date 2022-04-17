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
trait Status_Members {
	/**
	 * Sets response status headers.
	 *
	 * Need this to be queryable on the Apache/LiteSpeed side of things.
	 * Settings a `status` header allows for `%{resp:status}` to work in `.htaccess`.
	 *
	 * @since 2021-12-15
	 *
	 * @param int $status Response status code.
	 */
	public static function response_status( int $status ) : void {
		header( 'status: ' . $status );

		if ( U\Env::is_wordpress() ) {
			status_header( $status );
		} else {
			http_response_code( $status );
		}
	}
}
