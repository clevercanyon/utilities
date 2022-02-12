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
 * @coversDefaultClass \Clever_Canyon\Utilities\Crypto
 */
final class Crypto_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::salt()
	 */
	public function test_salt() : void {
		$this->assertSame( 128, strlen( U\Crypto::salt() ), $this->message() );
		$this->assertSame( 128, strlen( U\Crypto::salt( 'phpunit' ) ), $this->message() );
	}

	/**
	 * @covers ::keygen()
	 */
	public function test_keygen() : void {
		$this->assertSame( 32, strlen( U\Crypto::keygen() ), $this->message() );
		$this->assertSame( 36, strlen( U\Crypto::keygen( 36 ) ), $this->message() );
	}

	/**
	 * @covers ::uuid_v4()
	 */
	public function test_uuid_v4() : void {
		$this->assertSame( 32, strlen( U\Crypto::uuid_v4() ), $this->message() );
		$this->assertSame( 36, strlen( U\Crypto::uuid_v4( false ) ), $this->message() );
	}

	/**
	 * @covers ::sha1_key()
	 */
	public function test_sha1_key() : void {
		$this->assertSame( 'a335579258a2f7408a22e881c778d1c86bd5ba12', U\Crypto::sha1_key( '' ), $this->message() );
		$this->assertSame( '47cc18f19d54b7c007af6ca779b76029b6238391', U\Crypto::sha1_key( [] ), $this->message() );
		$this->assertSame( '007e504c433d95ad2e0301e2a88f167418cc619e', U\Crypto::sha1_key( null ), $this->message() );
		$this->assertSame( '9bf32e80145f792f7f13a7798eee9b75ac9adee0', U\Crypto::sha1_key( true ), $this->message() );
		$this->assertSame( 'df6a91655ea2a5388741181bdb94a963904a0a09', U\Crypto::sha1_key( false ), $this->message() );
		$this->assertSame( '593ab6b7cad4e10e694dbff4a48015cca60bf829', U\Crypto::sha1_key( [ 1, 2, 3 ] ), $this->message() );
		$this->assertSame( '885e5a2ad584ca2a5d339d18c6540769882cc9e1', U\Crypto::sha1_key( 'c10n' ), $this->message() );
	}

	/**
	 * @covers ::x_sha()
	 */
	public function test_x_sha() : void {
		$this->assertSame( 'xda39a3ee5e6b4b0', U\Crypto::x_sha( '' ), $this->message() );
		$this->assertSame( 'x2be88ca4242c76e', U\Crypto::x_sha( 'null' ), $this->message() );
		$this->assertSame( 'x5ffe533b830f08a', U\Crypto::x_sha( 'true' ), $this->message() );
		$this->assertSame( 'x7cb6efb98ba5972', U\Crypto::x_sha( 'false' ), $this->message() );
		$this->assertSame( 'xeeb789c66ddd92f', U\Crypto::x_sha( '[ 1, 2, 3 ]' ), $this->message() );
		$this->assertSame( 'x7b9ef9fce64cac7', U\Crypto::x_sha( 'c10n' ), $this->message() );
	}
}
