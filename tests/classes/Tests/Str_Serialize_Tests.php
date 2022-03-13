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
final class Str_Serialize_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::serialize()
	 * @covers ::unserialize()
	 * @covers ::maybe_unserialize()
	 */
	public function test_serialize() : void {
		$this->assertSame( [ 'key' => 123 ], U\Str::unserialize( U\Str::serialize( [ 'key' => 123 ] ) ), $this->message() );
		$this->assertSame( [ 'key' => 123 ], U\Str::unserialize( U\Str::serialize( [ 'key' => 123 ], true ), true ), $this->message() );
		$this->assertSame( [ 'key' => 123 ], U\Str::unserialize( U\Str::serialize( [ 'key' => 123 ], false ), false ), $this->message() );

		$obj = new U\Generic( [ 0 => 0, 'foo' => 'foo', 'bar' => [ 'bar' ], 'baz' => (object) 123 ], [ 1, 2, 3 ] );
		$this->assertObjEquals( $obj, U\Str::unserialize( U\Str::serialize( $obj ) ), $this->message() );
		$this->assertObjEquals( $obj, U\Str::maybe_unserialize( U\Str::serialize( $obj ) ), $this->message() );

		$obj = new U\Code_Stream_Closure( 'fn( $v ) => return true;' );
		$this->assertObjEquals( $obj, U\Str::unserialize( U\Str::serialize( $obj ) ), $this->message() );
		$this->assertObjEquals( $obj, U\Str::maybe_unserialize( U\Str::serialize( $obj ) ), $this->message() );

		$this->assertObjEquals( $obj, U\Str::maybe_unserialize( $obj ), $this->message() );
		$this->assertSame( '1', U\Str::maybe_unserialize( '1' ), $this->message() );
		$this->assertSame( 1, U\Str::maybe_unserialize( 1 ), $this->message() );
		$this->assertSame( true, U\Str::maybe_unserialize( true ), $this->message() );
		$this->assertSame( false, U\Str::maybe_unserialize( false ), $this->message() );
		$this->assertSame( null, U\Str::maybe_unserialize( null ), $this->message() );
		$this->assertSame( 1.0, U\Str::maybe_unserialize( 1.0 ), $this->message() );
		$this->assertSame( [ 1, 2, 3 ], U\Str::maybe_unserialize( [ 1, 2, 3 ] ), $this->message() );
	}
}
