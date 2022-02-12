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
final class Str_Version_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is_version()
	 */
	public function test_is_version() : void {
		$this->assertSame( true, U\Str::is_version( '0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '0.0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '0.0.0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.dev.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.alpha.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.beta.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.rc.1' ), $this->message() );

		$this->assertSame( false, U\Str::is_version( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '.0' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '.0.0' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0-dev.1' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0-alpha.1' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0.beta' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0.rc' ), $this->message() );
	}
}
