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
namespace Clever_Canyon\Utilities\Traits\Time\Utilities;

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
 * @see   U\Time
 */
trait Diff_Members {
	/**
	 * Human time difference.
	 *
	 * @since 2021-12-15
	 *
	 * @param int         $from   From time.
	 *
	 * @param int|null    $to     Default is {@see time()}.
	 *
	 * @param string|null $format Formatting. Default is `null`, indicating `default`.
	 *
	 *                            One of the following:
	 *                            - `abbr` = abbreviated time diff; e.g., `1s`, `1m`, `1h`, `1d`, `1w`, `1mo`, `1y`.
	 *                            - `default` (human time diff); e.g., `1 sec`, `1 min`, `1 hour`, `1 day`, etc.
	 *
	 * @return string Human time difference w/ requested formatting.
	 */
	public static function human_diff( int $from, /* int|null */ ?int $to = null, /* null|string */ ?string $format = null ) : string {
		$to   = $to ?? time();
		$diff = abs( $to - $from );

		if ( 'abbr' !== $format && 'default' !== $format ) {
			$format = 'default'; // Default format.
		}
		if ( $diff < U\Time::MINUTE_IN_SECONDS ) {
			$diff = max( 1, $diff );

			if ( 'abbr' === $format ) {
				// translators: `%1$s` is a numeric time difference, in seconds. `s` is short for `seconds`.
				return sprintf( _nx( '%1$ss', '%1$ss', $diff, 'time-human-diff-abbr' ), $diff );
			} else {
				// translators: `%1$s` is a numeric time difference, in seconds. `sec`, `secs` are short for `seconds`.
				return sprintf( _nx( '%1$s sec', '%1$s secs', $diff, 'time-human-diff' ), $diff );
			}
		} elseif ( $diff < U\Time::HOUR_IN_SECONDS ) {
			$diff = max( 1, round( $diff / U\Time::MINUTE_IN_SECONDS ) );

			if ( 'abbr' === $format ) {
				// translators: `%1$s` is a numeric time difference, in minutes. `m` is short for `minutes`.
				return sprintf( _nx( '%1$sm', '%1$sm', $diff, 'time-human-diff-abbr' ), $diff );
			} else {
				// translators: `%1$s` is a numeric time difference, in minutes. `min`, `mins` are short for `minutes`.
				return sprintf( _nx( '%1$s min', '%1$s mins', $diff, 'time-human-diff' ), $diff );
			}
		} elseif ( $diff < U\Time::DAY_IN_SECONDS ) {
			$diff = max( 1, round( $diff / U\Time::HOUR_IN_SECONDS ) );

			if ( 'abbr' === $format ) {
				// translators: `%1$s` is a numeric time difference, in hours. `h` is short for `hours`.
				return sprintf( _nx( '%1$sh', '%1$sh', $diff, 'time-human-diff-abbr' ), $diff );
			} else {
				// translators: `%1$s` is a numeric time difference, in hours.
				return sprintf( _nx( '%1$s hour', '%1$s hours', $diff, 'time-human-diff' ), $diff );
			}
		} elseif ( $diff < U\Time::WEEK_IN_SECONDS ) {
			$diff = max( 1, round( $diff / U\Time::DAY_IN_SECONDS ) );

			if ( 'abbr' === $format ) {
				// translators: `%1$s` is a numeric time difference, in days. `d` is short for `days`.
				return sprintf( _nx( '%1$sd', '%1$sd', $diff, 'time-human-diff-abbr' ), $diff );
			} else {
				// translators: `%1$s` is a numeric time difference, in days.
				return sprintf( _nx( '%1$s day', '%1$s days', $diff, 'time-human-diff' ), $diff );
			}
		} elseif ( $diff < U\Time::MONTH_IN_SECONDS ) {
			$diff = max( 1, round( $diff / U\Time::WEEK_IN_SECONDS ) );

			if ( 'abbr' === $format ) {
				// translators: `%1$s` is a numeric time difference, in weeks. `w` is short for `weeks`.
				return sprintf( _nx( '%1$sw', '%1$sw', $diff, 'time-human-diff-abbr' ), $diff );
			} else {
				// translators: `%1$s` is a numeric time difference, in weeks.
				return sprintf( _nx( '%1$s week', '%1$s weeks', $diff, 'time-human-diff' ), $diff );
			}
		} elseif ( $diff < U\Time::YEAR_IN_SECONDS ) {
			$diff = max( 1, round( $diff / U\Time::MONTH_IN_SECONDS ) );

			if ( 'abbr' === $format ) {
				// translators: `%1$s` is a numeric time difference, in months. `mo` is short for `months`.
				return sprintf( _nx( '%1$smo', '%1$smo', $diff, 'time-human-diff-abbr' ), $diff );
			} else {
				// translators: `%1$s` is a numeric time difference, in months.
				return sprintf( _nx( '%1$s month', '%1$s months', $diff, 'time-human-diff' ), $diff );
			}
		} else {
			$diff = max( 1, round( $diff / U\Time::YEAR_IN_SECONDS ) );

			if ( 'abbr' === $format ) {
				// translators: `%1$s` is a numeric time difference, in years. `y` is short for `years`.
				return sprintf( _nx( '%1$sy', '%1$sy', $diff, 'time-human-diff-abbr' ), $diff );
			} else {
				// translators: `%1$s` is a numeric time difference, in years.
				return sprintf( _nx( '%1$s year', '%1$s years', $diff, 'time-human-diff' ), $diff );
			}
		}
	}
}
