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
		$this->assertSame( true, U\URL::is_with_query( 'https://localhost?v' ), $this->message() );
		$this->assertSame( true, U\URL::is_with_query( 'https://foo-bar-example?v=1' ), $this->message() );
		$this->assertSame( true, U\URL::is_with_query( 'https://foo-bar-example.?v=1' ), $this->message() );
		$this->assertSame( true, U\URL::is_with_query( 'https://foo-bar-example?v=1#foo' ), $this->message() );

		$this->assertSame( false, U\URL::is_with_query( 'https://localhost' ), $this->message() );
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

	/**
	 * @covers ::current_referrer()
	 */
	public function test_current_referrer() : void {
		$this->assertSame( 'https://example.com', U\URL::current_referrer(), $this->message() );
	}

	/**
	 * @covers ::current_scheme()
	 */
	public function test_current_scheme() : void {
		$this->assertSame( 'https', U\URL::current_scheme(), $this->message() );
	}

	/**
	 * @covers ::current_host()
	 */
	public function test_current_host() : void {
		$this->assertSame( 'foo.bar.com:123', U\URL::current_host(), $this->message() );
		$this->assertSame( 'foo.bar.com', U\URL::current_host( false ), $this->message() );
	}

	/**
	 * @covers ::current_root_host()
	 */
	public function test_current_root_host() : void {
		$this->assertSame( 'bar.com:123', U\URL::current_root_host(), $this->message() );
		$this->assertSame( 'bar.com', U\URL::current_root_host( false ), $this->message() );
	}

	/**
	 * @covers ::current_port()
	 */
	public function test_current_port() : void {
		$this->assertSame( '123', U\URL::current_port(), $this->message() );
	}

	/**
	 * @covers ::current_path()
	 */
	public function test_current_path() : void {
		$this->assertSame( '/foo.bar', U\URL::current_path(), $this->message() );
	}

	/**
	 * @covers ::current_subpath()
	 */
	public function test_current_subpath() : void {
		$this->assertSame( 'foo.bar', U\URL::current_subpath(), $this->message() );
	}

	/**
	 * @covers ::current_query()
	 */
	public function test_current_query() : void {
		$this->assertSame( 'foo=foo&bar=bar', U\URL::current_query(), $this->message() );
	}

	/**
	 * @covers ::current_path_query()
	 */
	public function test_current_path_query() : void {
		$this->assertSame( '/foo.bar?foo=foo&bar=bar', U\URL::current_path_query(), $this->message() );
	}

	/**
	 * @covers ::current()
	 */
	public function test_current() : void {
		$this->assertSame( 'https://foo.bar.com:123/foo.bar?foo=foo&bar=bar', U\URL::current(), $this->message() );
	}

	/**
	 * @covers ::current_query_var()
	 */
	public function test_current_query_var() : void {
		$this->assertSame( 'foo', U\URL::current_query_var( 'foo' ), $this->message() );
	}

	/**
	 * @covers ::current_query_vars()
	 */
	public function test_current_query_vars() : void {
		$this->assertSame( [ 'foo' => 'foo', 'bar' => 'bar' ], U\URL::current_query_vars(), $this->message() );
	}

	/**
	 * @covers ::current_request_var()
	 */
	public function test_current_request_var() : void {
		$this->assertSame( 'foo', U\URL::current_request_var( 'foo' ), $this->message() );
	}

	/**
	 * @covers ::current_request_vars()
	 */
	public function test_current_request_vars() : void {
		$this->assertSame( [ 'foo' => 'foo', 'bar' => 'bar' ], U\URL::current_request_vars(), $this->message() );
	}

	/**
	 * @covers ::current_post_var()
	 */
	public function test_current_post_var() : void {
		$this->assertSame( null, U\URL::current_post_var( 'foo' ), $this->message() );
	}

	/**
	 * @covers ::current_post_vars()
	 */
	public function test_current_post_vars() : void {
		$this->assertSame( [], U\URL::current_post_vars(), $this->message() );
	}

	/**
	 * @covers ::add_query_vars()
	 */
	public function test_add_query_vars() : void {
		$this->assertSame( '/?foo=foo&bar=bar', U\URL::add_query_vars( [ 'foo' => 'foo', 'bar' => 'bar' ], '/' ), $this->message() );
	}

	/**
	 * @covers ::assemble()
	 */
	public function test_assemble() : void {
		$parts = [
			'scheme'   => '//',
			'user'     => 'foo',
			'pass'     => 'bar',
			'host'     => 'example.com',
			'port'     => '123',
			'path'     => '/',
			'query'    => 'foo=foo',
			'fragment' => 'foo',
		];
		$this->assertSame( '//foo:bar@example.com:123/?foo=foo#foo', U\URL::assemble( $parts ), $this->message() );
	}

	/**
	 * @covers ::parse()
	 */
	public function test_parse() : void {
		$parts = [
			'scheme'   => 'https',
			'user'     => 'foo',
			'pass'     => 'bar',
			'host'     => 'example.com',
			'port'     => '123',
			'path'     => '/',
			'query'    => 'foo=foo',
			'fragment' => 'foo',
		];
		$parts = U\Arr::sort_by( 'key', $parts );
		$parse = U\Arr::sort_by( 'key', U\URL::parse( 'https://foo:bar@example.com:123/?foo=foo#foo' ) );
		$this->assertSame( $parts, $parse, $this->message() );
	}

	/**
	 * @covers ::no_scheme_query_fragment()
	 */
	public function test_no_scheme_query_fragment() : void {
		$no_scheme_query_fragment = U\URL::no_scheme_query_fragment( 'https://foo:bar@example.com:123/?foo=foo#foo' );
		$this->assertSame( 'foo:bar@example.com:123/', $no_scheme_query_fragment, $this->message() );
	}
}
