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
 * @coversDefaultClass \Clever_Canyon\Utilities\Mem
 */
final class Mem_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::__construct()
	 * @covers ::set()
	 * @covers ::get()
	 * @covers ::clear()
	 */
	public function test_dead() : void {
		if ( ! U\Env::can_use_extension( 'memcached' ) ) {
			$this->assertSame( false, U\Env::can_use_extension( 'memcached' ) );
			return; // Not possible.
		}
		$connection_id_salt = U\Crypto::uuid_v4();
		$namespace_salt     = U\Crypto::uuid_v4();
		$servers            = [ [ 'host' => 'dead.foo.bar' ] ];

		$primary_key = U\Crypto::uuid_v4();
		$sub_key     = U\Crypto::uuid_v4();

		$mem = new U\Mem( $connection_id_salt, $namespace_salt, $servers );

		try {
			$rtn_value = $mem->is_alive();
		} catch ( U\I7e\Exception $exception ) {
			$rtn_value = false; // Ignore exception.
		}
		$this->assertSame( false, $rtn_value, $this->message() );

		try {
			$rtn_value = $mem->get( $primary_key, $sub_key );
		} catch ( U\I7e\Exception $exception ) {
			$rtn_value = null; // Ignore exception.
		}
		$this->assertSame( null, $rtn_value, $this->message() );

		try {
			$rtn_value = $mem->set( $primary_key, $sub_key, 'foo' );
		} catch ( U\I7e\Exception $exception ) {
			$rtn_value = false; // Ignore exception.
		}
		$this->assertSame( false, $rtn_value, $this->message() );

		try {
			$rtn_value = $mem->get( $primary_key, $sub_key );
		} catch ( U\I7e\Exception $exception ) {
			$rtn_value = null; // Ignore exception.
		}
		$this->assertSame( null, $rtn_value, $this->message() );

		try {
			$rtn_value = $mem->clear( $primary_key, $sub_key );
		} catch ( U\I7e\Exception $exception ) {
			$rtn_value = false; // Ignore exception.
		}
		$this->assertSame( false, $rtn_value, $this->message() );
	}

	/**
	 * @covers ::instance_alive_er()
	 * @covers ::set()
	 * @covers ::get()
	 * @covers ::clear()
	 */
	public function test_set_get() : void {
		if ( ! $mem = U\Mem::instance_alive_er( true ) ) {
			$this->assertSame( null, $mem );
			return; // Not possible.
		}
		$primary_key = U\Crypto::uuid_v4();
		$sub_key     = U\Crypto::uuid_v4();

		$this->assertSame( null, $mem->get( $primary_key, $sub_key ), $this->message() );        // Gets.
		$this->assertSame( true, $mem->set( $primary_key, $sub_key, 'foo' ), $this->message() ); // Sets.
		$this->assertSame( 'foo', $mem->get( $primary_key, $sub_key ), $this->message() );       // Gets.
		$this->assertSame( true, $mem->clear( $primary_key, $sub_key ), $this->message() );      // Clears.
	}

	/**
	 * @covers ::cache()
	 */
	public function test_cache() : void {
		$primary_key = U\Crypto::uuid_v4();
		$sub_key     = U\Crypto::uuid_v4();

		$this->assertSame( null, U\Mem::cache( $primary_key, $sub_key ), $this->message() );        // Gets.
		$this->assertSame( true, U\Mem::cache( $primary_key, $sub_key, 'foo' ), $this->message() ); // Sets.
		$this->assertSame( 'foo', U\Mem::cache( $primary_key, $sub_key ), $this->message() );       // Gets.
		$this->assertSame( true, U\Mem::cache( $primary_key, $sub_key, null ), $this->message() );  // Unsets.
		$this->assertSame( null, U\Mem::cache( $primary_key, $sub_key ), $this->message() );        // Gets.

		$primary_key = [ U\Crypto::uuid_v4(), U\Crypto::uuid_v4(), [ $primary_key ] ];
		$sub_key     = [ U\Crypto::uuid_v4(), U\Crypto::uuid_v4(), [ $sub_key ] ];

		$this->assertSame( null, U\Mem::cache( $primary_key, $sub_key ), $this->message() );        // Gets.
		$this->assertSame( true, U\Mem::cache( $primary_key, $sub_key, 'foo' ), $this->message() ); // Sets.
		$this->assertSame( 'foo', U\Mem::cache( $primary_key, $sub_key ), $this->message() );       // Gets.
		$this->assertSame( true, U\Mem::cache( $primary_key, $sub_key, null ), $this->message() );  // Unsets.
		$this->assertSame( null, U\Mem::cache( $primary_key, $sub_key ), $this->message() );        // Gets.
	}
}
