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
 * @coversDefaultClass \Clever_Canyon\Utilities\Str
 */
final class Str_Replace_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::replace()
	 */
	public function test_replace() : void {
		$this->assertSame( 'foo bar baz baz baz', U\Str::replace( 'x', 'baz', 'foo bar x x x' ), $this->message() );
		$this->assertSame( 'foo bar baz x x', U\Str::replace( 'x', 'baz', 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz baz x', U\Str::replace( 'x', 'baz', 'foo bar x x x', 2 ), $this->message() );
		$this->assertSame( 'foo bar X X X', U\Str::replace( 'x', 'baz', 'foo bar X X X' ), $this->message() );

		$this->assertSame( 'foo bar baz coo caz', U\Str::replace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz X coo', U\Str::replace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo caz', U\Str::replace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo baz', U\Str::replace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x' ), $this->message() );
	}

	/**
	 * @covers ::ireplace()
	 */
	public function test_ireplace() : void {
		$this->assertSame( 'foo bar baz baz baz', U\Str::ireplace( 'x', 'baz', 'foo bar x x x' ), $this->message() );
		$this->assertSame( 'foo bar baz x x', U\Str::ireplace( 'x', 'baz', 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz baz x', U\Str::ireplace( 'x', 'baz', 'foo bar x x x', 2 ), $this->message() );
		$this->assertSame( 'foo bar baz baz baz', U\Str::ireplace( 'x', 'baz', 'foo bar X X X' ), $this->message() );

		$this->assertSame( 'foo bar baz coo caz', U\Str::ireplace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo caz', U\Str::ireplace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo caz', U\Str::ireplace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz baz baz', U\Str::ireplace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x' ), $this->message() );
	}
}
