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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities__Tests\Tests\STC\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\STC\Version_1_0_0\Str
 */
final class Str_Tests extends \Clever_Canyon\Utilities__Tests\Framework\Version_1_0_0\A7s_Tests {
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
		$this->assertSame( "'foo bar baz'\'''", U\Str::esc_shell_arg( 'foo bar baz\'' ), $this->message() );
		$this->assertSame( "'foo bar \"baz\"'", U\Str::esc_shell_arg( 'foo bar "baz"' ), $this->message() );
	}

	/**
	 * @covers ::replace()
	 */
	public function test_replace() : void {
		$this->assertSame( 'foo bar baz baz baz', U\Str::replace( 'x', 'baz', 'foo bar x x x' ), $this->message() );
		$this->assertSame( 'foo bar baz x x', U\Str::replace( 'x', 'baz', 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz baz x', U\Str::replace( 'x', 'baz', 'foo bar x x x', 2 ), $this->message() );
		$this->assertSame( 'foo bar X X X', U\Str::replace( 'x', 'baz', 'foo bar X X X' ), $this->message() );

		$this->assertSame( 'foo bar baz coo caz', U\Str::replace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz X coo', U\Str::replace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo caz', U\Str::replace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo baz', U\Str::replace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x' ), $this->message() );
	}

	/**
	 * @covers ::ireplace()
	 */
	public function test_ireplace() : void {
		$this->assertSame( 'foo bar baz baz baz', U\Str::ireplace( 'x', 'baz', 'foo bar x x x' ), $this->message() );
		$this->assertSame( 'foo bar baz x x', U\Str::ireplace( 'x', 'baz', 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz baz x', U\Str::ireplace( 'x', 'baz', 'foo bar x x x', 2 ), $this->message() );
		$this->assertSame( 'foo bar baz baz baz', U\Str::ireplace( 'x', 'baz', 'foo bar X X X' ), $this->message() );

		$this->assertSame( 'foo bar baz coo caz', U\Str::ireplace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x x x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo caz', U\Str::ireplace( [ 'x', 'x', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz coo caz', U\Str::ireplace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x', 1 ), $this->message() );
		$this->assertSame( 'foo bar baz baz baz', U\Str::ireplace( [ 'x', 'X', 'x' ], [ 'baz', 'coo', 'caz' ], 'foo bar x X x' ), $this->message() );
	}

	/**
	 * @covers ::stringify()
	 */
	public function test_stringify() : void {
		$this->assertSame( '[1]', U\Str::stringify( [ 1 ], false ), $this->message() );
		$this->assertSame( '[' . "\n" . '    1' . "\n" . ']', U\Str::stringify( [ 1 ], true ), $this->message() );
	}

	/**
	 * @covers ::json_encode()
	 */
	public function test_json_encode() : void {
		$this->assertSame( '[1]', U\Str::json_encode( [ 1 ], false ), $this->message() );
		$this->assertSame( '[' . "\n" . '    1' . "\n" . ']', U\Str::json_encode( [ 1 ], true ), $this->message() );
	}

	/**
	 * @covers ::json_decode()
	 */
	public function test_json_decode() : void {
		$this->assertSame( [ 'key' => 123 ], U\Str::json_decode( U\Str::json_encode( [ 'key' => 123 ], false ), true ), $this->message() );
		$this->assertSame( [ 'key' => 123 ], U\Str::json_decode( U\Str::json_encode( [ 'key' => 123 ], true ), true ), $this->message() );
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
