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
trait Server_Members {
	/**
	 * Server API.
	 *
	 * @since 2021-12-18
	 *
	 * @return string Server API.
	 */
	public static function server_api() : string {
		static $api; // Memoize.

		if ( null !== $api ) {
			return $api; // Saves time.
		}
		return $api = mb_strtolower( PHP_SAPI );
	}

	/**
	 * Server name.
	 *
	 * @since 2021-12-18
	 *
	 * @return string Server name.
	 */
	public static function server_name() : string {
		static $name; // Memoize.

		if ( null !== $name ) {
			return $name; // Saves time.
		}
		return $name = U\Env::var( 'SERVER_NAME' );
	}

	/**
	 * Server IP.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Server IP.
	 */
	public static function server_ip() : string {
		static $ip; // Memoize.

		if ( null !== $ip ) {
			return $ip; // Saves time.
		}
		return $ip = U\Env::var( 'SERVER_ADDR' );
	}

	/**
	 * Server port.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Server port.
	 */
	public static function server_port() : string {
		static $port; // Memoize.

		if ( null !== $port ) {
			return $port; // Saves time.
		}
		return $port = U\Env::var( 'SERVER_PORT' );
	}
}
