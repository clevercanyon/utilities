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
namespace Clever_Canyon\Utilities__Tests\Tests;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};
use Clever_Canyon\{Utilities__Tests as UT};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\Debug
 */
final class Debug_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::dump()
	 */
	public function test_dump() : void {
		$this->assertSame( '(int) 0', U\Debug::dump( 0, true ), $this->message() );
		$this->assertSame( '(int) 1', U\Debug::dump( 1, true ), $this->message() );

		$this->assertSame( '(float) 0', U\Debug::dump( 0.0, true ), $this->message() );
		$this->assertSame( '(float) 1', U\Debug::dump( 1.0, true ), $this->message() );

		$this->assertSame( '(float) 0.1', U\Debug::dump( 0.1, true ), $this->message() );
		$this->assertSame( '(float) 1.1', U\Debug::dump( 1.1, true ), $this->message() );

		$this->assertSame( '(bool) true', U\Debug::dump( true, true ), $this->message() );
		$this->assertSame( '(bool) false', U\Debug::dump( false, true ), $this->message() );

		$this->assertSame( '(string) [3/3] ' . "'foo'", U\Debug::dump( 'foo', true ), $this->message() );
		$this->assertSame( '(string) [3/3] ' . "'bar'", U\Debug::dump( 'bar', true ), $this->message() );
	}
}
