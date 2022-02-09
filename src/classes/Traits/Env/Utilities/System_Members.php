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
trait System_Members {
	/**
	 * System name.
	 *
	 * @since 2021-12-18
	 *
	 * @return string System name.
	 */
	public static function sys_name() : string {
		static $name; // Memoize.

		if ( null !== $name ) {
			return $name; // Saves time.
		}
		return $name = mb_strtolower( gethostname() ?: 'localhost' );
	}

	/**
	 * System IP.
	 *
	 * @since 2021-12-15
	 *
	 * @return string System IP.
	 */
	public static function sys_ip() : string {
		static $ip; // Memoize.

		if ( null !== $ip ) {
			return $ip; // Saves time.
		}
		return $ip = '127.0.0.1';
	}
}
