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
trait Set_Time_Limit_Members {
	/**
	 * Sets time limit for script execution.
	 *
	 * @since 2021-12-15
	 *
	 * @param int $limit Time limit in seconds. `0` = no time limit.
	 *
	 * @return bool True if time limit set successfully.
	 *
	 * @see   https://www.php.net/manual/en/function.set-time-limit.php
	 * @see   https://www.php.net/manual/en/info.configuration.php#ini.max-execution-time
	 */
	public static function set_time_limit( int $limit ) : bool {
		if ( ! U\Env::can_use_function( 'set_time_limit' ) ) {
			return false; // Not possible.
		}
		set_time_limit( $limit );      // phpcs:ignore.
		return true;                   // NOTE: `set_time_limit()`'s return value is unreliable.
		// In recent tests on macOS `set_time_limit()` consistently returned `false`, yet was consistently effective.
	}
}
