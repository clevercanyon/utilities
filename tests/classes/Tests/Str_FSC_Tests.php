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
final class Str_FSC_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is_fsc()
	 */
	public function test_is_fsc() : void {
		$this->assertSame( true, U\Str::is_fsc( 'a' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( 'ac' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( 'acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( 'john-smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( 'john_smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( 'john_x_smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.foo' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.-foo' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.--foo' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.-foo-' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.-foo--' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.-foo_' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.-foo-~_' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '_foo' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '._foo' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.~foo' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '~foo' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '~foo~' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '~f--o_o~' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( '.--foo-~_' ), $this->message() );
		$this->assertSame( true, U\Str::is_fsc( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_fsc( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( '..foo' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( '-foo' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'foo__' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'f~~oo' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'f..oo' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'foo~~' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'f---oo' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'foo.' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'foo.x.' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_fsc( str_repeat( 'x', 129 ) ), $this->message() );
	}

	/**
	 * @covers ::to_fsc()
	 */
	public function test_to_fsc() : void {
		$this->assertSame( 'a', U\Str::to_fsc( 'a' ), $this->message() );
		$this->assertSame( 'ac', U\Str::to_fsc( 'ac' ), $this->message() );
		$this->assertSame( 'acme', U\Str::to_fsc( 'acme' ), $this->message() );
		$this->assertSame( 'john-smith', U\Str::to_fsc( 'john-smith' ), $this->message() );
		$this->assertSame( 'john_smith', U\Str::to_fsc( 'john_smith' ), $this->message() );
		$this->assertSame( 'john_x_smith', U\Str::to_fsc( 'john_x_smith' ), $this->message() );
		$this->assertSame( '.foo', U\Str::to_fsc( '.foo' ), $this->message() );
		$this->assertSame( '.-foo', U\Str::to_fsc( '.-foo' ), $this->message() );
		$this->assertSame( '.--foo', U\Str::to_fsc( '.--foo' ), $this->message() );
		$this->assertSame( '.-foo-', U\Str::to_fsc( '.-foo-' ), $this->message() );
		$this->assertSame( '.-foo--', U\Str::to_fsc( '.-foo--' ), $this->message() );
		$this->assertSame( '.-foo_', U\Str::to_fsc( '.-foo_' ), $this->message() );
		$this->assertSame( '.-foo-~_', U\Str::to_fsc( '.-foo-~_' ), $this->message() );
		$this->assertSame( '_foo', U\Str::to_fsc( '_foo' ), $this->message() );
		$this->assertSame( '._foo', U\Str::to_fsc( '._foo' ), $this->message() );
		$this->assertSame( '.~foo', U\Str::to_fsc( '.~foo' ), $this->message() );
		$this->assertSame( '~foo', U\Str::to_fsc( '~foo' ), $this->message() );
		$this->assertSame( '~foo~', U\Str::to_fsc( '~foo~' ), $this->message() );
		$this->assertSame( '~f--o_o~', U\Str::to_fsc( '~f--o_o~' ), $this->message() );
		$this->assertSame( '.--foo-~_', U\Str::to_fsc( '.--foo-~_' ), $this->message() );
		$this->assertSame( str_repeat( 'x', 128 ), U\Str::to_fsc( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( '', U\Str::to_fsc( '' ), $this->message() );
		$this->assertSame( '._foo', U\Str::to_fsc( '..foo' ), $this->message() );
		$this->assertSame( '_foo', U\Str::to_fsc( '-foo' ), $this->message() );
		$this->assertSame( 'foo_', U\Str::to_fsc( 'foo__' ), $this->message() );
		$this->assertSame( 'f~oo', U\Str::to_fsc( 'f~~oo' ), $this->message() );
		$this->assertSame( 'f.oo', U\Str::to_fsc( 'f..oo' ), $this->message() );
		$this->assertSame( 'foo~', U\Str::to_fsc( 'foo~~' ), $this->message() );
		$this->assertSame( 'f--oo', U\Str::to_fsc( 'f---oo' ), $this->message() );
		$this->assertSame( 'foo_', U\Str::to_fsc( 'foo.' ), $this->message() );
		$this->assertSame( 'foo.x_', U\Str::to_fsc( 'foo.x.' ), $this->message() );
		$this->assertSame( 'acme', U\Str::to_fsc( 'acmê' ), $this->message() );
		$this->assertSame( 'acme-', U\Str::to_fsc( 'acme™' ), $this->message() );
		$this->assertSame( U\Crypto::x_sha( str_repeat( 'x', 129 ), 64 ), U\Str::to_fsc( str_repeat( 'x', 129 ) ), $this->message() );
	}
}
