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
 * @coversDefaultClass \Clever_Canyon\Utilities\IP
 */
final class IP_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is()
	 */
	public function test_is() : void {
		$this->assertSame( true, U\IP::is( '127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\IP::is( '45.79.7.19' ), $this->message() );
		$this->assertSame( true, U\IP::is( '::1' ), $this->message() );
		$this->assertSame( true, U\IP::is( '::ffff:2d4f:713' ), $this->message() );
		$this->assertSame( true, U\IP::is( '0:0:0:0:0:ffff:2d4f:0713' ), $this->message() );

		$this->assertSame( false, U\IP::is( '127.0.0.1.' ), $this->message() );
		$this->assertSame( false, U\IP::is( '45.79.7.19.' ), $this->message() );
		$this->assertSame( false, U\IP::is( '::1:' ), $this->message() );
		$this->assertSame( false, U\IP::is( '::ffff:2d4f:713.' ), $this->message() );
		$this->assertSame( false, U\IP::is( '0:0:0:0:0:ffff:2d4f:0713.' ), $this->message() );
	}

	/**
	 * @covers ::is_v4()
	 */
	public function test_is_v4() : void {
		$this->assertSame( true, U\IP::is_v4( '127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\IP::is_v4( '45.79.7.19' ), $this->message() );

		$this->assertSame( false, U\IP::is_v4( '::1' ), $this->message() );
		$this->assertSame( false, U\IP::is_v4( '::ffff:2d4f:713' ), $this->message() );
		$this->assertSame( false, U\IP::is_v4( '0:0:0:0:0:ffff:2d4f:0713' ), $this->message() );
	}

	/**
	 * @covers ::is_v6()
	 */
	public function test_is_v6() : void {
		$this->assertSame( true, U\IP::is_v6( '::1' ), $this->message() );
		$this->assertSame( true, U\IP::is_v6( '::ffff:2d4f:713' ), $this->message() );
		$this->assertSame( true, U\IP::is_v6( '0:0:0:0:0:ffff:2d4f:0713' ), $this->message() );

		$this->assertSame( false, U\IP::is_v6( '127.0.0.1' ), $this->message() );
		$this->assertSame( false, U\IP::is_v6( '45.79.7.19' ), $this->message() );
	}

	/**
	 * @covers ::normalize()
	 */
	public function test_normalize() : void {
		$this->assertSame( '104.21.93.186', U\IP::normalize( '104.21.93.186' ), $this->message() );
		$this->assertSame( '::ffff:104.21.93.186', U\IP::normalize( '::ffff:6815:5dba' ), $this->message() );
		$this->assertSame( '::ffff:104.21.93.186', U\IP::normalize( '0:0:0:0:0:ffff:6815:5dba' ), $this->message() );
		$this->assertSame( '::ffff:104.21.93.186', U\IP::normalize( '0000:0000:0000:0000:0000:ffff:6815:5dba' ), $this->message() );

		$this->assertSame( '172.67.213.254', U\IP::normalize( '172.67.213.254' ), $this->message() );
		$this->assertSame( '::ffff:172.67.213.254', U\IP::normalize( '::ffff:ac43:d5fe' ), $this->message() );
		$this->assertSame( '::ffff:172.67.213.254', U\IP::normalize( '0:0:0:0:0:ffff:ac43:d5fe' ), $this->message() );
		$this->assertSame( '::ffff:172.67.213.254', U\IP::normalize( '0000:0000:0000:0000:0000:ffff:ac43:d5fe' ), $this->message() );

		$this->assertSame( '::1', U\IP::normalize( '::1' ), $this->message() );
		$this->assertSame( '127.0.0.1', U\IP::normalize( '127.0.0.1' ), $this->message() );
		$this->assertSame( '::ffff:127.0.0.1', U\IP::normalize( '::ffff:7f00:0001' ), $this->message() );
		$this->assertSame( '::ffff:127.0.0.1', U\IP::normalize( '0:0:0:0:0:ffff:7f00:0001' ), $this->message() );
		$this->assertSame( '::ffff:127.0.0.1', U\IP::normalize( '0000:0000:0000:0000:0000:ffff:7f00:0001' ), $this->message() );
	}
}
