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
final class Str_Regexp_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::is_regexp()
	 */
	public function test_is_regexp() : void {
		$this->assertSame( true, U\Str::is_regexp( '//' ), $this->message() );
		$this->assertSame( true, U\Str::is_regexp( '//u' ), $this->message() );
		$this->assertSame( true, U\Str::is_regexp( '/foo/' ), $this->message() );
		$this->assertSame( true, U\Str::is_regexp( '/foo/u' ), $this->message() );

		$this->assertSame( '/', U\Str::is_regexp( '/foo/', true ), $this->message() );
		$this->assertSame( '~', U\Str::is_regexp( '~foo~', true ), $this->message() );
		$this->assertSame( '@', U\Str::is_regexp( '@foo@', true ), $this->message() );
		$this->assertSame( ';', U\Str::is_regexp( ';foo;', true ), $this->message() );
		$this->assertSame( '%', U\Str::is_regexp( '%foo%', true ), $this->message() );
		$this->assertSame( '`', U\Str::is_regexp( '`foo`', true ), $this->message() );
		$this->assertSame( '#', U\Str::is_regexp( '#foo#', true ), $this->message() );
	}

	/**
	 * @covers ::preg_match_in()
	 */
	public function test_preg_match_in() : void {
		$this->assertSame( 1, U\Str::preg_match_in( [ '/./ui' ], 'foo' ), $this->message() );
		$this->assertSame( 0, U\Str::preg_match_in( [ '/x/ui' ], 'foo' ), $this->message() );
		$this->assertSame( 1, U\Str::preg_match_in( [ '/x/ui', '/x/', '/x/', '/^foo$/' ], 'foo' ), $this->message() );
		$this->assertSame( 0, U\Str::preg_match_in( [ '/x/ui', '/^\.foo$/' ], 'foo' ), $this->message() );

		U\Str::preg_match_in( [ '/^(x)$/', '/^(y)$/', '/^(z)$/', '/^(foo)$/' ], 'foo', $_m );
		$this->assertSame( 'foo', $_m[ 0 ] ?? '', $this->message() );
		$this->assertSame( 'foo', $_m[ 1 ] ?? '', $this->message() );

		U\Str::preg_match_in( [ '/^(x)$/', '/^(y)$/', '/^(foo).+$/', '/^(foo)$/' ], 'foobar', $_m );
		$this->assertSame( 'foobar', $_m[ 0 ] ?? '', $this->message() );
		$this->assertSame( 'foo', $_m[ 1 ] ?? '', $this->message() );

		U\Str::preg_match_in( [ '/^(x)$/', '/^(y)$/', '/^(foo)(x)?.+$/', '/^(foo)$/' ], 'foobar', $_m, PREG_UNMATCHED_AS_NULL );
		$this->assertSame( 'foobar', $_m[ 0 ] ?? '', $this->message() );
		$this->assertSame( 'foo', $_m[ 1 ] ?? '', $this->message() );
		$this->assertSame( null, array_key_exists( 2, $_m ) ? $_m[ 2 ] : '', $this->message() );

		U\Str::preg_match_in( [ '/^(x)$/', '/^(y)$/', '/^(foo)(x)?.+$/', '/(.*?)(bar)$/' ], 'foobar', $_m, 0, 3 );
		$this->assertSame( 'bar', $_m[ 0 ] ?? '', $this->message() );
		$this->assertSame( '', $_m[ 1 ] ?? '', $this->message() );
		$this->assertSame( 'bar', $_m[ 2 ] ?? '', $this->message() );
	}
}
