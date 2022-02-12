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
final class Str_N7M_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is_n7m()
	 */
	public function test_is_n7m() : void {
		$this->assertSame( true, U\Str::is_n7m( 'a12' ), $this->message() );
		$this->assertSame( true, U\Str::is_n7m( 'a1c' ), $this->message() );

		$this->assertSame( false, U\Str::is_n7m( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_n7m( '.c10n' ), $this->message() );
		$this->assertSame( false, U\Str::is_n7m( 'c100n' ), $this->message() );
	}

	/**
	 * @covers ::to_n7m()
	 */
	public function test_to_n7m() : void {
		$this->assertSame( '', U\Str::to_n7m( '' ), $this->message() );
		$this->assertSame( 'c2n', U\Str::to_n7m( '.c10n' ), $this->message() );
		$this->assertSame( 'c3n', U\Str::to_n7m( 'c100n' ), $this->message() );

		$this->assertSame( 'c10n', U\Str::to_n7m( 'Clever Canyon' ), $this->message() );
		$this->assertSame( 'w6e', U\Str::to_n7m( 'WP Groove' ), $this->message() );
		$this->assertSame( 'h5y', U\Str::to_n7m( 'Hostery' ), $this->message() );
	}
}
