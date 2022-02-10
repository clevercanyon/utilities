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
 * @coversDefaultClass \Clever_Canyon\Utilities\Func
 */
final class Func_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::noop()
	 */
	public function test_noop() : void {
		/** @noinspection PhpVoidFunctionResultUsedInspection */
		$this->assertSame( null, U\Func::noop(), $this->message() );
	}

	/**
	 * @covers ::noop_rev()
	 */
	public function test_noop_rev() : void {
		$this->assertSame( 123, U\Func::noop_rev( 123 ), $this->message() );
	}

	/**
	 * @covers ::noop_null()
	 */
	public function test_noop_null() : void {
		$this->assertSame( null, U\Func::noop_null(), $this->message() );
	}

	/**
	 * @covers ::noop_true()
	 */
	public function test_noop_true() : void {
		$this->assertSame( true, U\Func::noop_true(), $this->message() );
	}

	/**
	 * @covers ::noop_false()
	 */
	public function test_noop_false() : void {
		$this->assertSame( false, U\Func::noop_false(), $this->message() );
	}
}
