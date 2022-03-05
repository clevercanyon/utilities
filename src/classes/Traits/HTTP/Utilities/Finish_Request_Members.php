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
trait Finish_Request_Members {
	/**
	 * Tries to finish the request.
	 *
	 * Finishing a request flushes everything to client and ends the HTTP request.
	 * The script itself continues to hold open a process so it can finish some time later.
	 *
	 * LiteSpeed compatibility is currently untested, but there are docs; {@see https://o5p.me/hbOnQt}.
	 * The environment variables must be set using `.htaccess`, but the PHP function is also available for use.
	 * The PHP function doesn't set either of those environment variables, however. It just finishes the request.
	 * ~ PHP source code for {@litespeed_finish_request()} {@see https://o5p.me/3mjzdQ}.
	 *
	 * Best workaround for LiteSpeed, and in general, is to explicitly configure the web server
	 * to allow specific scripts, or specific script patterns, to run longer than normally allowed.
	 *
	 * @since        2021-12-15
	 *
	 * @return bool True if finished successfully.
	 *
	 * @noinspection PhpUndefinedFunctionInspection
	 */
	public static function finish_request() : bool {
		$closed_session         = U\HTTP::close_session();
		$ended_output_buffering = U\Env::end_output_buffering();

		if ( U\Env::can_use_function( 'ignore_user_abort' ) ) {
			ignore_user_abort( true );
		}
		if ( U\Env::can_use_function( 'fastcgi_finish_request' ) ) {
			fastcgi_finish_request();
		}
		if ( U\Env::is_litespeed() && U\Env::can_use_function( 'litespeed_finish_request' ) ) {
			litespeed_finish_request();
		}
		if ( $closed_session && $ended_output_buffering ) {
			echo str_pad( '', 4096 ); // phpcs:ignore -- output is ok here.
			flush();                  // Flush output so we can check connection status.
		}
		return $closed_session
			&& $ended_output_buffering
			&& connection_status() !== CONNECTION_NORMAL;
	}
}
