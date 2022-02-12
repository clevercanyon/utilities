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
use Clever_Canyon\Utilities\{Tests as UT};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\Str
 */
final class Str_Begins_Ends_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::begins_with()
	 */
	public function test_begins_with() : void {
		$this->assertSame( true, U\Str::begins_with( 'foo bar', 'foo' ), $this->message() );
		$this->assertSame( false, U\Str::begins_with( 'foo bar', 'Foo' ), $this->message() );
		$this->assertSame( false, U\Str::begins_with( 'foo bar', 'bar' ), $this->message() );
	}

	/**
	 * @covers ::ibegins_with()
	 */
	public function test_ibegins_with() : void {
		$this->assertSame( true, U\Str::ibegins_with( 'foo bar', 'foo' ), $this->message() );
		$this->assertSame( true, U\Str::ibegins_with( 'foo bar', 'Foo' ), $this->message() );
		$this->assertSame( false, U\Str::ibegins_with( 'foo bar', 'bar' ), $this->message() );
	}

	/**
	 * @covers ::ends_with()
	 */
	public function test_ends_with() : void {
		$this->assertSame( true, U\Str::ends_with( 'foo bar', 'bar' ), $this->message() );
		$this->assertSame( false, U\Str::ends_with( 'foo bar', 'Bar' ), $this->message() );
		$this->assertSame( false, U\Str::ends_with( 'foo bar', 'foo' ), $this->message() );
	}

	/**
	 * @covers ::iends_with()
	 */
	public function test_iends_with() : void {
		$this->assertSame( true, U\Str::iends_with( 'foo bar', 'bar' ), $this->message() );
		$this->assertSame( true, U\Str::iends_with( 'foo bar', 'Bar' ), $this->message() );
		$this->assertSame( false, U\Str::iends_with( 'foo bar', 'foo' ), $this->message() );
	}
}
