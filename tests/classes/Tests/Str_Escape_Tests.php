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
final class Str_Escape_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::esc_sq()
	 */
	public function test_esc_sq() : void {
		$this->assertSame( 'foo’', U\Str::esc_sq( 'foo’' ), $this->message() );
		$this->assertSame( "foo\\'s bar\\'s", U\Str::esc_sq( "foo's bar's" ), $this->message() );
	}

	/**
	 * @covers ::esc_dq()
	 */
	public function test_esc_dq() : void {
		$this->assertSame( 'foo”', U\Str::esc_sq( 'foo”' ), $this->message() );
		$this->assertSame( '\\"foo\\" \\"bar\\"', U\Str::esc_dq( '"foo" "bar"' ), $this->message() );
	}

	/**
	 * @covers ::esc_reg()
	 */
	public function test_esc_reg() : void {
		$this->assertSame( '\\^', U\Str::esc_reg( '^' ), $this->message() );
		$this->assertSame( '\\/\\[\\]\\/', U\Str::esc_reg( '/[]/' ), $this->message() );
	}

	/**
	 * @covers ::esc_reg_brs()
	 */
	public function test_esc_reg_brs() : void {
		$this->assertSame( '\\$', U\Str::esc_reg_brs( '$' ), $this->message() );
		$this->assertSame( '\\$\\\\', U\Str::esc_reg_brs( '$\\' ), $this->message() );
	}

	/**
	 * @covers ::esc_html()
	 */
	public function test_esc_html() : void {
		$this->assertSame( '&amp;&amp;&apos;', U\Str::esc_html( '&amp;&\'' ), $this->message() );
		$this->assertSame( '&amp;&lt;foo&gt;', U\Str::esc_html( '&amp;<foo>' ), $this->message() );
	}

	/**
	 * @covers ::esc_attr()
	 */
	public function test_esc_attr() : void {
		$this->assertSame( '&amp;&amp;&apos;', U\Str::esc_attr( '&amp;&\'' ), $this->message() );
		$this->assertSame( '&amp;&lt;foo&gt;', U\Str::esc_attr( '&amp;<foo>' ), $this->message() );
	}

	/**
	 * @covers ::esc_url()
	 */
	public function test_esc_url() : void {
		$this->assertSame( '&amp;&amp;&apos;', U\Str::esc_url( '&amp;&\'' ), $this->message() );
		$this->assertSame( '&amp;&lt;foo&gt;', U\Str::esc_url( '&amp;<foo>' ), $this->message() );
		$this->assertSame( 'https://foo.bar/baz/?biz=buz&amp;[coo]=caz', U\Str::esc_url( 'https://foo.bar/baz/?biz=buz&[coo]=caz' ), $this->message() );
	}

	/**
	 * @covers ::esc_textarea()
	 */
	public function test_esc_textarea() : void {
		$this->assertSame( '&amp;amp;&amp;&apos;', U\Str::esc_textarea( '&amp;&\'' ), $this->message() );
		$this->assertSame( '&amp;amp;&lt;foo&gt;', U\Str::esc_textarea( '&amp;<foo>' ), $this->message() );
	}

	/**
	 * @covers ::esc_shell_arg()
	 */
	public function test_esc_shell_arg() : void {
		if ( U\Env::is_windows() ) { // Windows behaves much differently.
			// {@see https://www.php.net/manual/en/function.escapeshellarg.php}.
			$this->assertSame( '"foo bar baz\'"', U\Str::esc_shell_arg( 'foo bar baz\'' ), $this->message() );
			$this->assertSame( '"foo bar  baz "', U\Str::esc_shell_arg( 'foo bar "baz"' ), $this->message() );
		} elseif ( U\Env::is_unix_based() ) {
			$this->assertSame( "'foo bar baz'\'''", U\Str::esc_shell_arg( 'foo bar baz\'' ), $this->message() );
			$this->assertSame( "'foo bar \"baz\"'", U\Str::esc_shell_arg( 'foo bar "baz"' ), $this->message() );
		}
	}
}
