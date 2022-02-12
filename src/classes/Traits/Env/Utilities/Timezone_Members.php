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
trait Timezone_Members {
	/**
	 * Timezone is `utc`?
	 *
	 * @since 2022-01-20
	 *
	 * @return bool True if timezone is `utc`.
	 */
	public static function is_utc() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = 'utc' === U\Env::timezone();
	}

	/**
	 * Gets environment timezone.
	 *
	 * WordPress forces PHP timezone to `UTC` in all cases.
	 *
	 * Conclusions and guidance based on the above and other research:
	 *
	 * - UTC is a good default and it's nice that WordPress forces UTC at runtime.
	 *   However, UTC is not the only timezone that must be considered across popular apps.
	 *   WordPress itself offers a timezone option and does some juggling to accomodate
	 *   the differences that exist between the UTC default and what a user chooses.
	 *
	 * - There are a number of reasons to work in different timezones. While UTC is often
	 *   used in code to make calculations, it's simply not the only timezone that code touches.
	 *
	 * - Don't use {@see time()}, {@see date()}, and other procedural time-related functions in PHP.
	 *   These are never guaranteed to be in any specific timezone, though they do default to UTC.
	 *
	 *     - In the case of WordPress specifically, everything is forced to UTC by default;
	 *       so it's fine to use them, but that doesn't make it a best practice.
	 *
	 * - It's better to use {@see U\Time::utc()}, or create new utilities as needed,
	 *   or fall back on PHP's own {@see \DateTime()}, {@see \DateTimeZone} family of classes.
	 *
	 * @since 2022-01-20
	 *
	 * @return string Current timezone.
	 */
	public static function timezone() : string {
		static $timezone; // Memoize.

		if ( null !== $timezone ) {
			return $timezone; // Saves time.
		}
		$timezone = @date_default_timezone_get(); // phpcs:ignore.
		// ^ If there is no `date.timezone` set in `php.ini`, this will trigger a warning.

		return $timezone = mb_strtolower( $timezone ?: 'utc' );
	}
}
