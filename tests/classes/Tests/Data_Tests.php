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
 * @coversDefaultClass \Clever_Canyon\Utilities\Data
 */
final class Data_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::type()
	 * @covers ::canonicalize_type()
	 */
	public function test_type() : void {
		$temp_file          = $this->temp_file();
		$temp_file_resource = fopen( $temp_file, 'r' );

		$this->assertSame( 'int', U\Data::type( 1 ), $this->message() );
		$this->assertSame( 'float', U\Data::type( 1.0 ), $this->message() );
		$this->assertSame( 'bool', U\Data::type( true ), $this->message() );
		$this->assertSame( 'string', U\Data::type( 'foo' ), $this->message() );
		$this->assertSame( 'object', U\Data::type( (object) [ 1 ] ), $this->message() );
		$this->assertSame( 'array', U\Data::type( [ 1 ] ), $this->message() );
		$this->assertSame( 'resource', U\Data::type( $temp_file_resource ), $this->message() );

		fclose( $temp_file_resource );
	}

	/**
	 * @covers ::set_type()
	 * @covers ::canonicalize_type()
	 */
	public function test_set_type() : void {
		$this->assertSame( 1, U\Data::set_type( '1', 'int' ), $this->message() );
		$this->assertSame( 1.0, U\Data::set_type( '1.0', 'float' ), $this->message() );
		$this->assertSame( true, U\Data::set_type( 'true', 'bool' ), $this->message() );
		$this->assertSame( '1', U\Data::set_type( true, 'string' ), $this->message() );
		$this->assertSame( [ 1 ], U\Data::set_type( (object) [ 1 ], 'array' ), $this->message() );
	}
}
