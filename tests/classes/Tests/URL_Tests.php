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
namespace Clever_Canyon\Utilities__Tests\Tests;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};
use Clever_Canyon\{Utilities__Tests as UT};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\URL
 */
final class URL_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is()
	 */
	public function test_is() : void {
		$this->assertSame( true, U\URL::is( 'https://45.79.7.19' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://127.0.0.1.' ), $this->message() );

		$this->assertSame( true, U\URL::is( 'https://localhost' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://foo-bar-example' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://foo-bar-example.' ), $this->message() );

		$this->assertSame( true, U\URL::is( 'https://foo.example.com' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://foo.bar.example.com' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://foo-bar-example.com.' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://foo-bar--example.com.' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://foo----------bar.com.' ), $this->message() );

		$this->assertSame( true, U\URL::is( 'https://[::1]' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://[::ffff:2d4f:713]' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]' ), $this->message() );

		$this->assertSame( true, U\URL::is( 'mailto:user@example.com' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'news:foo.bar.example' ), $this->message() );
		$this->assertSame( true, U\URL::is( 'file:///foo/bar' ), $this->message() );

		$this->assertSame(
			true,
			U\URL::is(
				'https://' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 61 ) . '.'
			), $this->message()
		);
		$this->assertSame( true, U\URL::is( 'https://' . str_repeat( 'x', 63 ) . '.' ), $this->message() );

		// Invalid examples.

		$this->assertSame( false, U\URL::is( 'https://.foo.bar' ), $this->message() );
		$this->assertSame( false, U\URL::is( 'https://.foo.bar' ), $this->message() );
		$this->assertSame( false, U\URL::is( 'https://foo_bar' ), $this->message() );

		$this->assertSame( false, U\URL::is( 'https://::1' ), $this->message() );
		$this->assertSame( false, U\URL::is( 'https://::ffff:2d4f:713' ), $this->message() );

		$this->assertSame( false, U\URL::is( 'https://foo..bar.com.' ), $this->message() );
		$this->assertSame( false, U\URL::is( 'https://foo~bar.com.' ), $this->message() );
		$this->assertSame( false, U\URL::is( 'https://foo----=-----bar.com.' ), $this->message() );

		$this->assertSame( false, U\URL::is( 'https://[::1].' ), $this->message() );
		$this->assertSame( false, U\URL::is( 'https://[::ffff:2d4f:713].' ), $this->message() );
		$this->assertSame( false, U\URL::is( 'https://[2001:db8:85a3:8d3:1319:8a2e:370:7348].' ), $this->message() );

		$this->assertSame(
			false,
			U\URL::is(
				'https://' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 62 ) . '.'
			), $this->message()
		);
		$this->assertSame( false, U\URL::is( 'https://' . str_repeat( 'x', 64 ) ), $this->message() );
	}

	/**
	 * @covers ::is_with_query()
	 */
	public function test_is_with_query() : void {
		$this->assertSame( true, U\URL::is_with_query( 'https://localhost?' ), $this->message() );
		$this->assertSame( true, U\URL::is_with_query( 'https://foo-bar-example?v=1' ), $this->message() );
		$this->assertSame( true, U\URL::is_with_query( 'https://foo-bar-example.?v=1' ), $this->message() );
		$this->assertSame( true, U\URL::is_with_query( 'https://foo-bar-example?v=1#foo' ), $this->message() );

		$this->assertSame( false, U\URL::is_with_query( 'https://localhost..?' ), $this->message() );
		$this->assertSame( false, U\URL::is_with_query( 'https://foo-bar-example..?v=1' ), $this->message() );
		$this->assertSame( false, U\URL::is_with_query( 'https://foo-bar-example.&v=1' ), $this->message() );
		$this->assertSame( false, U\URL::is_with_query( 'https://foo-bar-example#foo?v=1' ), $this->message() );
	}

	/**
	 * @covers ::is_hostname()
	 */
	public function test_is_hostname() : void {
		$this->assertSame( true, U\URL::is_hostname( '45.79.7.19' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( '127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( '127.0.0.1.' ), $this->message() );

		$this->assertSame( true, U\URL::is_hostname( 'localhost' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( 'foo-bar-example' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( 'foo-bar-example.' ), $this->message() );

		$this->assertSame( true, U\URL::is_hostname( 'foo.example.com' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( 'foo.bar.example.com' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( 'foo-bar-example.com.' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( 'foo-bar--example.com.' ), $this->message() );
		$this->assertSame( true, U\URL::is_hostname( 'foo----------bar.com.' ), $this->message() );

		$this->assertSame(
			true,
			U\URL::is_hostname(
				str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 61 ) . '.'
			), $this->message()
		);
		$this->assertSame( true, U\URL::is_hostname( str_repeat( 'x', 63 ) ), $this->message() );

		// Invalid examples.

		$this->assertSame( false, U\URL::is_hostname( '.foo.bar' ), $this->message() );
		$this->assertSame( false, U\URL::is_hostname( '.foo.bar' ), $this->message() );
		$this->assertSame( false, U\URL::is_hostname( 'foo_bar' ), $this->message() );

		$this->assertSame( false, U\URL::is_hostname( '::1' ), $this->message() );
		$this->assertSame( false, U\URL::is_hostname( '::ffff:2d4f:713' ), $this->message() );

		$this->assertSame( false, U\URL::is_hostname( 'foo..bar.com.' ), $this->message() );
		$this->assertSame( false, U\URL::is_hostname( 'foo~bar.com.' ), $this->message() );
		$this->assertSame( false, U\URL::is_hostname( 'foo----=-----bar.com.' ), $this->message() );

		$this->assertSame( false, U\URL::is_hostname( '[::1]' ), $this->message() );
		$this->assertSame( false, U\URL::is_hostname( '[::ffff:2d4f:713]' ), $this->message() );
		$this->assertSame( false, U\URL::is_hostname( '[2001:db8:85a3:8d3:1319:8a2e:370:7348]' ), $this->message() );

		$this->assertSame(
			false,
			U\URL::is_hostname(
				str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 62 ) . '.'
			), $this->message()
		);
		$this->assertSame( false, U\URL::is_hostname( str_repeat( 'x', 64 ) ), $this->message() );
	}
}
