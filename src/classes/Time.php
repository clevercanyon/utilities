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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Time utilities.
 *
 * @since 2021-12-15
 */
final class Time extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\Time\Members;

	/**
	 * 1 minute in seconds.
	 *
	 * @since 2021-12-15
	 */
	public const MINUTE_IN_SECONDS = 60;

	/**
	 * 1 hour in seconds.
	 *
	 * @since 2021-12-15
	 */
	public const HOUR_IN_SECONDS = 60 * U\Time::MINUTE_IN_SECONDS;

	/**
	 * 1 day in seconds.
	 *
	 * @since 2021-12-15
	 */
	public const DAY_IN_SECONDS = 24 * U\Time::HOUR_IN_SECONDS;

	/**
	 * 1 week in seconds.
	 *
	 * @since 2021-12-15
	 */
	public const WEEK_IN_SECONDS = 7 * U\Time::DAY_IN_SECONDS;

	/**
	 * 1 month in seconds.
	 *
	 * @since 2021-12-15
	 */
	public const MONTH_IN_SECONDS = 30 * U\Time::DAY_IN_SECONDS;

	/**
	 * 1 year in seconds.
	 *
	 * @since 2021-12-15
	 */
	public const YEAR_IN_SECONDS = 365 * U\Time::DAY_IN_SECONDS;

	/**
	 * 1 second in milliseconds.
	 * A millisecond is one thousandth of a second.
	 *
	 * @since 2021-12-15
	 */
	public const SECOND_IN_MILLISECONDS = 1000;

	/**
	 * 1 second in microseconds.
	 * A microsecond is one millionth of a second.
	 *
	 * @since 2021-12-15
	 */
	public const SECOND_IN_MICROSECONDS = 1000 * U\Time::SECOND_IN_MILLISECONDS;
}
