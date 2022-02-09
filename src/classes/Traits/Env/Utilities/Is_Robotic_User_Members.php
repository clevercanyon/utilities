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
trait Is_Robotic_User_Members {
	/**
	 * A robotic web server user?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if a robotic web server user.
	 */
	public static function is_robotic_web_server_user() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		$user = trim( U\Env::var( 'USER_LC' ), '_' );

		return $is = '' !== $user // Checks two variants.
			&& ( in_array( $user, U\Env::ROBOTIC_WEB_SERVER_USERS, true )
				|| in_array( '_' . $user, U\Env::ROBOTIC_WEB_SERVER_USERS, true ) );
	}
}
