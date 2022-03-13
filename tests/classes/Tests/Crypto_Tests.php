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
 * @coversDefaultClass \Clever_Canyon\Utilities\Crypto
 */
final class Crypto_Tests extends U_Tests\A6t\Base {
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
		$this->assertSame( 'b1968104bb6fa14ee0cda647fafb0a2c40c1673e', U\Crypto::sha1_key( '' ), $this->message() );
		$this->assertSame( '93f95dd258be2e7be89aa21d092955d4577f8985', U\Crypto::sha1_key( [] ), $this->message() );
		$this->assertSame( 'd2bde97d741f1e051187e849e17ec2896ca49a09', U\Crypto::sha1_key( null ), $this->message() );
		$this->assertSame( '4e87742282cc3e749024bafc367b707defa064bc', U\Crypto::sha1_key( true ), $this->message() );
		$this->assertSame( 'd882a88e2f04efee84c858ea7e115277dd4e6ead', U\Crypto::sha1_key( false ), $this->message() );
		$this->assertSame( '20325dcfb61d72dffb5ee01bad8d1690cdd78b35', U\Crypto::sha1_key( [ 1, 2, 3 ] ), $this->message() );
		$this->assertSame( '055009e82e2d2e4d38f801458f83778189e20e79', U\Crypto::sha1_key( 'c10n' ), $this->message() );
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
