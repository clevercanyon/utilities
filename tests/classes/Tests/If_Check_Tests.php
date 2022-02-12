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
 */
final class If_Check_Tests extends UT\A6t\Tests {
	/**
	 * @covers u\if_array()
	 */
	public function test_if_array() : void {
		$this->assertSame( null, u\if_array( 1 ), $this->message() );
		$this->assertSame( true, u\if_array( 1, true ), $this->message() );
		$this->assertSame( true, u\if_array( null, true ), $this->message() );

		$this->assertSame( [], u\if_array( [] ), $this->message() );
		$this->assertSame( [ 1, 2, 3 ], u\if_array( [ 1, 2, 3 ], false ), $this->message() );
	}

	/**
	 * @covers u\if_bool()
	 */
	public function test_if_bool() : void {
		$this->assertSame( null, u\if_bool( 1 ), $this->message() );
		$this->assertSame( true, u\if_bool( [], true ), $this->message() );
		$this->assertSame( true, u\if_bool( null, true ), $this->message() );

		$this->assertSame( true, u\if_bool( true ), $this->message() );
		$this->assertSame( false, u\if_bool( false, 1 ), $this->message() );
	}

	/**
	 * @covers u\if_bundle()
	 */
	public function test_if_bundle() : void {
		$this->assertSame( null, u\if_bundle( 1 ), $this->message() );
		$this->assertSame( true, u\if_bundle( null, true ), $this->message() );
		$this->assertSame( true, u\if_bundle( 1.0, true ), $this->message() );

		$this->assertSame( [], u\if_bundle( [] ), $this->message() );
		$this->assertSame( [ 1, 2, 3 ], u\if_bundle( [ 1, 2, 3 ], 1 ), $this->message() );
		$this->assertSame(
			true, ( new U\Generic( u\if_bundle( [ 1, 2, 3 ], false ) ) )
			->is_equals_string_to( new U\Generic( [ 1, 2, 3 ] ) ), $this->message()
		);
	}

	/**
	 * @covers u\if_callable()
	 */
	public function test_if_callable() : void {
		$this->assertSame( null, u\if_callable( 1 ), $this->message() );
		$this->assertSame( true, u\if_callable( [], true ), $this->message() );
		$this->assertSame( true, u\if_callable( null, true ), $this->message() );

		$this->assertSame( true, u\if_callable( fn() => true ) instanceof \Closure, $this->message() );
		$this->assertSame( true, u\if_callable( fn() => true, 1 ) instanceof \Closure, $this->message() );
	}

	/**
	 * @covers u\if_closure()
	 */
	public function test_if_closure() : void {
		$this->assertSame( null, u\if_closure( 1 ), $this->message() );
		$this->assertSame( true, u\if_closure( [], true ), $this->message() );
		$this->assertSame( true, u\if_closure( null, true ), $this->message() );

		$this->assertSame( true, u\if_closure( fn() => true ) instanceof \Closure, $this->message() );
		$this->assertSame( true, u\if_closure( fn() => true, 1 ) instanceof \Closure, $this->message() );
	}

	/**
	 * @covers u\if_countable()
	 */
	public function test_if_countable() : void {
		$this->assertSame( null, u\if_countable( 1 ), $this->message() );
		$this->assertSame( true, u\if_countable( false, true ), $this->message() );
		$this->assertSame( true, u\if_countable( null, true ), $this->message() );
		$this->assertSame( null, u\if_countable( (object) [] ), $this->message() );

		$this->assertSame( [], u\if_countable( [] ), $this->message() );
		$this->assertSame(
			true, ( new U\Generic() )
			->is_equals_string_to( u\if_countable( new U\Generic(), false ) ), $this->message()
		);
	}

	/**
	 * @covers u\if_error()
	 */
	public function test_if_error() : void {
		$this->assertSame( null, u\if_error( 1 ), $this->message() );
		$this->assertSame( true, u\if_error( [], true ), $this->message() );
		$this->assertSame( true, u\if_error( null, true ), $this->message() );

		$this->assertSame( true, u\if_error( new U\Error() ) instanceof U\Error, $this->message() );
		$this->assertSame( true, u\if_error( new U\Error(), 1 ) instanceof U\Error, $this->message() );
	}

	/**
	 * @covers u\if_float()
	 */
	public function test_if_float() : void {
		$this->assertSame( null, u\if_float( 1 ), $this->message() );
		$this->assertSame( true, u\if_float( [], true ), $this->message() );
		$this->assertSame( true, u\if_float( null, true ), $this->message() );

		$this->assertSame( 0.0, u\if_float( 0.0 ), $this->message() );
		$this->assertSame( 1.0, u\if_float( 1.0, 1 ), $this->message() );
	}

	/**
	 * @covers u\if_int()
	 */
	public function test_if_int() : void {
		$this->assertSame( null, u\if_int( 1.0 ), $this->message() );
		$this->assertSame( true, u\if_int( [], true ), $this->message() );
		$this->assertSame( true, u\if_int( null, true ), $this->message() );

		$this->assertSame( 0, u\if_int( 0 ), $this->message() );
		$this->assertSame( 1, u\if_int( 1, false ), $this->message() );
	}

	/**
	 * @covers u\if_iterable()
	 */
	public function test_if_iterable() : void {
		$this->assertSame( null, u\if_iterable( 1.0 ), $this->message() );
		$this->assertSame( true, u\if_iterable( (object) [], true ), $this->message() );
		$this->assertSame( true, u\if_iterable( null, true ), $this->message() );

		$this->assertSame( [], u\if_iterable( [] ), $this->message() );
		$this->assertSame( true, u\if_iterable( new U\Generic(), false ) instanceof U\Generic, $this->message() );
	}

	/**
	 * @covers u\if_not_null()
	 */
	public function test_if_not_null() : void {
		$this->assertSame( null, u\if_not_null( null ), $this->message() );
		$this->assertSame( true, u\if_not_null( null, true ), $this->message() );
		$this->assertSame( true, u\if_not_null( null, true ), $this->message() );

		$this->assertSame( [], u\if_not_null( [] ), $this->message() );
		$this->assertSame( true, u\if_not_null( new U\Generic(), false ) instanceof U\Generic, $this->message() );
	}

	/**
	 * @covers u\if_number()
	 */
	public function test_if_number() : void {
		$this->assertSame( null, u\if_number( true ), $this->message() );
		$this->assertSame( true, u\if_number( [], true ), $this->message() );
		$this->assertSame( true, u\if_number( '1', true ), $this->message() );
		$this->assertSame( true, u\if_number( '1.0', true ), $this->message() );

		$this->assertSame( 0, u\if_number( 0 ), $this->message() );
		$this->assertSame( 1, u\if_number( 1 ), $this->message() );
		$this->assertSame( 0.0, u\if_number( 0.0 ), $this->message() );
		$this->assertSame( 1.0, u\if_number( 1.0 ), $this->message() );
	}

	/**
	 * @covers u\if_numeric()
	 */
	public function test_if_numeric() : void {
		$this->assertSame( null, u\if_numeric( true ), $this->message() );
		$this->assertSame( true, u\if_numeric( [], true ), $this->message() );
		$this->assertSame( true, u\if_numeric( 'x1', true ), $this->message() );
		$this->assertSame( true, u\if_numeric( 'x1.0', true ), $this->message() );

		$this->assertSame( 0, u\if_numeric( 0 ), $this->message() );
		$this->assertSame( 1, u\if_numeric( 1 ), $this->message() );
		$this->assertSame( 0.0, u\if_numeric( 0.0 ), $this->message() );
		$this->assertSame( 1.0, u\if_numeric( 1.0 ), $this->message() );
		$this->assertSame( '0', u\if_numeric( '0' ), $this->message() );
		$this->assertSame( '1', u\if_numeric( '1' ), $this->message() );
		$this->assertSame( '1.0', u\if_numeric( '1.0' ), $this->message() );
	}

	/**
	 * @covers u\if_object()
	 */
	public function test_if_object() : void {
		$this->assertSame( null, u\if_object( 1.0 ), $this->message() );
		$this->assertSame( true, u\if_object( false, true ), $this->message() );
		$this->assertSame( true, u\if_object( null, true ), $this->message() );
		$this->assertSame( true, u\if_object( [], true ), $this->message() );

		$this->assertSame( true, u\if_object( (object) [] ) instanceof \stdClass, $this->message() );
		$this->assertSame( true, u\if_object( new U\Generic(), false ) instanceof U\Generic, $this->message() );
	}

	/**
	 * @covers u\if_resource()
	 */
	public function test_if_resource() : void {
		$this->assertSame( null, u\if_resource( 1.0 ), $this->message() );
		$this->assertSame( true, u\if_resource( false, true ), $this->message() );
		$this->assertSame( true, u\if_resource( null, true ), $this->message() );
		$this->assertSame( true, u\if_resource( [], true ), $this->message() );

		$r = fopen( $this->temp_file(), 'r' );
		$this->assertSame( true, is_resource( u\if_resource( $r ) ), $this->message() );
		$this->assertSame( true, is_resource( u\if_resource( $r, false ) ), $this->message() );
		fclose( $r );
	}

	/**
	 * @covers u\if_scalar()
	 */
	public function test_if_scalar() : void {
		$this->assertSame( null, u\if_scalar( [] ), $this->message() );
		$this->assertSame( true, u\if_scalar( null, true ), $this->message() );
		$this->assertSame( true, u\if_scalar( (object) [], true ), $this->message() );
		$this->assertSame( true, u\if_scalar( [ 1, 2, 3 ], true ), $this->message() );

		$this->assertSame( '', u\if_scalar( '' ), $this->message() );
		$this->assertSame( '0', u\if_scalar( '0' ), $this->message() );
		$this->assertSame( '1', u\if_scalar( '1' ), $this->message() );
		$this->assertSame( 0, u\if_scalar( 0 ), $this->message() );
		$this->assertSame( 1, u\if_scalar( 1 ), $this->message() );
		$this->assertSame( 0.0, u\if_scalar( 0.0 ), $this->message() );
		$this->assertSame( 1.0, u\if_scalar( 1.0 ), $this->message() );
		$this->assertSame( true, u\if_scalar( true ), $this->message() );
		$this->assertSame( false, u\if_scalar( false ), $this->message() );
		$this->assertSame( false, u\if_scalar( false ), $this->message() );
	}

	/**
	 * @covers u\if_string()
	 */
	public function test_if_string() : void {
		$this->assertSame( null, u\if_string( 1.0 ), $this->message() );
		$this->assertSame( true, u\if_string( [], true ), $this->message() );
		$this->assertSame( true, u\if_string( null, true ), $this->message() );

		$this->assertSame( '', u\if_string( '' ), $this->message() );
		$this->assertSame( '0', u\if_string( '0' ), $this->message() );
		$this->assertSame( '1', u\if_string( '1', false ), $this->message() );
		$this->assertSame( 'foo', u\if_string( 'foo', false ), $this->message() );
	}

	/**
	 * @covers u\if_fn()
	 */
	public function test_if_fn() : void {
		$this->assertSame( null, u\if_fn( 1.0, fn( $v ) => is_int( $v ) ), $this->message() );
		$this->assertSame( null, u\if_fn( false, fn( $v ) => is_int( $v ) ), $this->message() );
		$this->assertSame( true, u\if_fn( '', fn( $v ) => is_int( $v ), true ), $this->message() );

		$this->assertSame( 0, u\if_fn( 0, fn( $v ) => is_int( $v ), true ), $this->message() );
		$this->assertSame( 1, u\if_fn( 1, fn( $v ) => is_int( $v ), true ), $this->message() );
		$this->assertSame( 'foo', u\if_fn( 'foo', fn( $v ) => is_string( $v ), false ), $this->message() );
	}
}
