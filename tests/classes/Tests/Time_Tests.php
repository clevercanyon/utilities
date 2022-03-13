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
 * Lint configuration.
 *
 * @since        2021-12-15
 *
 * @noinspection PhpUnhandledExceptionInspection
 * @noinspection PhpStaticAsDynamicMethodCallInspection
 * phpcs:disable Generic.Commenting.DocComment.MissingShort
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Tests\Tests;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};
use Clever_Canyon\Utilities\{Tests as U_Tests};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\Time
 */
final class Time_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::utc()
	 */
	public function test_utc() : void {
		$utc_tz     = 'UTC';
		$eastern_tz = 'America/New_York';

		$eastern_time = (int) ( new \DateTime( 'now', new \DateTimeZone( $eastern_tz ) ) )->format( 'U' );
		$utc_time     = (int) ( new \DateTime( 'now', new \DateTimeZone( $utc_tz ) ) )->format( 'U' );

		$tz_backup = date_default_timezone_get();
		date_default_timezone_set( $eastern_tz ); // phpcs:ignore.

		$this->assertSame( $eastern_time, time(), $this->message() );
		$this->assertSame( $utc_time, U\Time::utc(), $this->message() );

		if ( $tz_backup ) {
			date_default_timezone_set( $tz_backup ); // phpcs:ignore.
		}
	}
}
