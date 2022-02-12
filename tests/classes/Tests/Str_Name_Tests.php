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
final class Str_Name_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is_name()
	 */
	public function test_is_name() : void {
		$this->assertSame( true, U\Str::is_name( 'Acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_name( 'Acme™' ), $this->message() );
		$this->assertSame( true, U\Str::is_name( 'John Smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_name( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_name( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_name( str_repeat( 'x', 129 ) ), $this->message() );
	}

	/**
	 * @covers ::to_name()
	 */
	public function test_to_name() : void {
		$this->assertSame( '', U\Str::to_name( '' ), $this->message() );
		$this->assertSame( 'John Smith', U\Str::to_name( '"John smith"' ), $this->message() );
		$this->assertSame( 'John Smith', U\Str::to_name( "'mr. John smith sr.'" ), $this->message() );
		$this->assertSame( 'Acme Broadcasting', U\Str::to_name( 'acme broadcasting' ), $this->message() );
		$this->assertSame( 'Acme Broadcasting', U\Str::to_name( '"- acme™™   broadcasting "' ), $this->message() );
	}
}
