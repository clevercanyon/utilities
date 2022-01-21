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
 * @coversDefaultClass \Clever_Canyon\Utilities\Str
 */
final class Str_Tests extends UT\A6t\Tests {
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
		if ( U\Env::is_windows() ) { // Windows uses double-quotes instead of single quotes.
			$this->assertSame( '"foo bar baz\'"', U\Str::esc_shell_arg( 'foo bar baz\'' ), $this->message() );
			$this->assertSame( '"foo bar \\"baz\\""', U\Str::esc_shell_arg( 'foo bar "baz"' ), $this->message() );
		} elseif ( U\Env::is_unix_based() ) {
			$this->assertSame( "'foo bar baz'\'''", U\Str::esc_shell_arg( 'foo bar baz\'' ), $this->message() );
			$this->assertSame( "'foo bar \"baz\"'", U\Str::esc_shell_arg( 'foo bar "baz"' ), $this->message() );
		}
	}

	/**
	 * @covers ::begins_with()
	 */
	public function test_begins_with() : void {
		$this->assertSame( true, U\Str::begins_with( 'foo bar', 'foo' ), $this->message() );
		$this->assertSame( false, U\Str::begins_with( 'foo bar', 'Foo' ), $this->message() );
		$this->assertSame( false, U\Str::begins_with( 'foo bar', 'bar' ), $this->message() );
	}

	/**
	 * @covers ::ibegins_with()
	 */
	public function test_ibegins_with() : void {
		$this->assertSame( true, U\Str::ibegins_with( 'foo bar', 'foo' ), $this->message() );
		$this->assertSame( true, U\Str::ibegins_with( 'foo bar', 'Foo' ), $this->message() );
		$this->assertSame( false, U\Str::ibegins_with( 'foo bar', 'bar' ), $this->message() );
	}

	/**
	 * @covers ::ends_with()
	 */
	public function test_ends_with() : void {
		$this->assertSame( true, U\Str::ends_with( 'foo bar', 'bar' ), $this->message() );
		$this->assertSame( false, U\Str::ends_with( 'foo bar', 'Bar' ), $this->message() );
		$this->assertSame( false, U\Str::ends_with( 'foo bar', 'foo' ), $this->message() );
	}

	/**
	 * @covers ::iends_with()
	 */
	public function test_iends_with() : void {
		$this->assertSame( true, U\Str::iends_with( 'foo bar', 'bar' ), $this->message() );
		$this->assertSame( true, U\Str::iends_with( 'foo bar', 'Bar' ), $this->message() );
		$this->assertSame( false, U\Str::iends_with( 'foo bar', 'foo' ), $this->message() );
	}

	/**
	 * @covers ::contains()
	 */
	public function test_contains() : void {
		$this->assertSame( true, U\Str::contains( 'foo bar', 'o b' ), $this->message() );
		$this->assertSame( true, U\Str::contains( 'foo bar', 'oo' ), $this->message() );
		$this->assertSame( false, U\Str::contains( 'foo bar', 'oO' ), $this->message() );
	}

	/**
	 * @covers ::icontains()
	 */
	public function test_icontains() : void {
		$this->assertSame( true, U\Str::icontains( 'foo bar', 'o b' ), $this->message() );
		$this->assertSame( true, U\Str::icontains( 'foo bar', 'oo' ), $this->message() );
		$this->assertSame( true, U\Str::icontains( 'foo bar', 'oO' ), $this->message() );
		$this->assertSame( false, U\Str::icontains( 'foo bar', 'o0' ), $this->message() );
	}

	/**
	 * @covers ::normalize_eols()
	 */
	public function test_normalize_eols() : void {
		$this->assertSame( 'foo' . "\n\n" . 'bar', U\Str::normalize_eols( 'foo' . "\r\r\n" . 'bar' ), $this->message() );
		$this->assertSame( 'foo' . "\n\n" . 'bar', U\Str::normalize_eols( 'foo' . "\r\r\n\r\r" . 'bar' ), $this->message() );
	}

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
	 * @covers ::is_hostname()
	 */
	public function test_is_hostname() : void {
		$this->assertSame( true, U\Str::is_hostname( '45.79.7.19' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( '127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( '127.0.0.1.' ), $this->message() );

		$this->assertSame( true, U\Str::is_hostname( 'localhost' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( 'foo-bar-example' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( 'foo-bar-example.' ), $this->message() );

		$this->assertSame( true, U\Str::is_hostname( 'foo.example.com' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( 'foo.bar.example.com' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( 'foo-bar-example.com.' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( 'foo-bar--example.com.' ), $this->message() );
		$this->assertSame( true, U\Str::is_hostname( 'foo----------bar.com.' ), $this->message() );

		$this->assertSame(
			true,
			U\Str::is_hostname(
				str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 61 ) . '.'
			), $this->message()
		);
		$this->assertSame( true, U\Str::is_hostname( str_repeat( 'x', 63 ) ), $this->message() );

		// Invalid examples.

		$this->assertSame( false, U\Str::is_hostname( '.foo.bar' ), $this->message() );
		$this->assertSame( false, U\Str::is_hostname( '.foo.bar' ), $this->message() );
		$this->assertSame( false, U\Str::is_hostname( 'foo_bar' ), $this->message() );

		$this->assertSame( false, U\Str::is_hostname( '::1' ), $this->message() );
		$this->assertSame( false, U\Str::is_hostname( '::ffff:2d4f:713' ), $this->message() );

		$this->assertSame( false, U\Str::is_hostname( 'foo..bar.com.' ), $this->message() );
		$this->assertSame( false, U\Str::is_hostname( 'foo~bar.com.' ), $this->message() );
		$this->assertSame( false, U\Str::is_hostname( 'foo----=-----bar.com.' ), $this->message() );

		$this->assertSame( false, U\Str::is_hostname( '[::1]' ), $this->message() );
		$this->assertSame( false, U\Str::is_hostname( '[::ffff:2d4f:713]' ), $this->message() );
		$this->assertSame( false, U\Str::is_hostname( '[2001:db8:85a3:8d3:1319:8a2e:370:7348]' ), $this->message() );

		$this->assertSame(
			false,
			U\Str::is_hostname(
				str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 62 ) . '.'
			), $this->message()
		);
		$this->assertSame( false, U\Str::is_hostname( str_repeat( 'x', 64 ) ), $this->message() );
	}

	/**
	 * @covers ::is_url()
	 */
	public function test_is_url() : void {
		$this->assertSame( true, U\Str::is_url( 'https://45.79.7.19' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://127.0.0.1.' ), $this->message() );

		$this->assertSame( true, U\Str::is_url( 'https://localhost' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://foo-bar-example' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://foo-bar-example.' ), $this->message() );

		$this->assertSame( true, U\Str::is_url( 'https://foo.example.com' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://foo.bar.example.com' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://foo-bar-example.com.' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://foo-bar--example.com.' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://foo----------bar.com.' ), $this->message() );

		$this->assertSame( true, U\Str::is_url( 'https://[::1]' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://[::ffff:2d4f:713]' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'https://[2001:db8:85a3:8d3:1319:8a2e:370:7348]' ), $this->message() );

		$this->assertSame( true, U\Str::is_url( 'mailto:user@example.com' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'news:foo.bar.example' ), $this->message() );
		$this->assertSame( true, U\Str::is_url( 'file:///foo/bar' ), $this->message() );

		$this->assertSame(
			true,
			U\Str::is_url(
				'https://' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 61 ) . '.'
			), $this->message()
		);
		$this->assertSame( true, U\Str::is_url( 'https://' . str_repeat( 'x', 63 ) . '.' ), $this->message() );

		// Invalid examples.

		$this->assertSame( false, U\Str::is_url( 'https://.foo.bar' ), $this->message() );
		$this->assertSame( false, U\Str::is_url( 'https://.foo.bar' ), $this->message() );
		$this->assertSame( false, U\Str::is_url( 'https://foo_bar' ), $this->message() );

		$this->assertSame( false, U\Str::is_url( 'https://::1' ), $this->message() );
		$this->assertSame( false, U\Str::is_url( 'https://::ffff:2d4f:713' ), $this->message() );

		$this->assertSame( false, U\Str::is_url( 'https://foo..bar.com.' ), $this->message() );
		$this->assertSame( false, U\Str::is_url( 'https://foo~bar.com.' ), $this->message() );
		$this->assertSame( false, U\Str::is_url( 'https://foo----=-----bar.com.' ), $this->message() );

		$this->assertSame( false, U\Str::is_url( 'https://[::1].' ), $this->message() );
		$this->assertSame( false, U\Str::is_url( 'https://[::ffff:2d4f:713].' ), $this->message() );
		$this->assertSame( false, U\Str::is_url( 'https://[2001:db8:85a3:8d3:1319:8a2e:370:7348].' ), $this->message() );

		$this->assertSame(
			false,
			U\Str::is_url(
				'https://' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 63 ) .
				'.' . str_repeat( 'x', 62 ) . '.'
			), $this->message()
		);
		$this->assertSame( false, U\Str::is_url( 'https://' . str_repeat( 'x', 64 ) ), $this->message() );
	}

	/**
	 * @covers ::is_url_query()
	 */
	public function test_is_url_query() : void {
		$this->assertSame( true, U\Str::is_url_query( 'https://localhost?' ), $this->message() );
		$this->assertSame( true, U\Str::is_url_query( 'https://foo-bar-example?v=1' ), $this->message() );
		$this->assertSame( true, U\Str::is_url_query( 'https://foo-bar-example.?v=1' ), $this->message() );
		$this->assertSame( true, U\Str::is_url_query( 'https://foo-bar-example?v=1#foo' ), $this->message() );

		$this->assertSame( false, U\Str::is_url_query( 'https://localhost..?' ), $this->message() );
		$this->assertSame( false, U\Str::is_url_query( 'https://foo-bar-example..?v=1' ), $this->message() );
		$this->assertSame( false, U\Str::is_url_query( 'https://foo-bar-example.&v=1' ), $this->message() );
		$this->assertSame( false, U\Str::is_url_query( 'https://foo-bar-example#foo?v=1' ), $this->message() );
	}

	/**
	 * @covers ::is_email()
	 */
	public function test_is_email() : void {
		$this->assertSame( true, U\Str::is_email( 'user@example.com' ), $this->message() );
		$this->assertSame( true, U\Str::is_email( 'user@foo.bar.com' ), $this->message() );
		$this->assertSame( true, U\Str::is_email( 'exämple@foo.bar.com' ), $this->message() );

		$this->assertSame( false, U\Str::is_email( 'user@example' ), $this->message() );
		$this->assertSame( false, U\Str::is_email( 'user@127.0.0.1' ), $this->message() );
		$this->assertSame( false, U\Str::is_email( 'user@localhost' ), $this->message() );
		$this->assertSame( false, U\Str::is_email( 'user@example.com.' ), $this->message() );
		$this->assertSame( false, U\Str::is_email( 'user@foo.bar..com' ), $this->message() );
		$this->assertSame( false, U\Str::is_email( 'x🔧x@foo.bar.com' ), $this->message() );
	}

	/**
	 * @covers ::is_mac()
	 */
	public function test_is_mac() : void {
		$this->assertSame( true, U\Str::is_mac( '00:0C:F1:56:98:AD' ), $this->message() );
		$this->assertSame( true, U\Str::is_mac( '00-0C-F1-56-98-AD' ), $this->message() );
		$this->assertSame( true, U\Str::is_mac( '000C.F156.98AD' ), $this->message() );

		$this->assertSame( false, U\Str::is_mac( '000CF15698AD' ), $this->message() );
		$this->assertSame( false, U\Str::is_mac( '00:0C:F1:56:98:AD.' ), $this->message() );
		$this->assertSame( false, U\Str::is_mac( '00:0C:F1:56:98:AD:' ), $this->message() );
		$this->assertSame( false, U\Str::is_mac( '00-0C-F1-56-98-AD.' ), $this->message() );
	}

	/**
	 * @covers ::is_ip()
	 */
	public function test_is_ip() : void {
		$this->assertSame( true, U\Str::is_ip( '127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_ip( '45.79.7.19' ), $this->message() );
		$this->assertSame( true, U\Str::is_ip( '::1' ), $this->message() );
		$this->assertSame( true, U\Str::is_ip( '::ffff:2d4f:713' ), $this->message() );
		$this->assertSame( true, U\Str::is_ip( '0:0:0:0:0:ffff:2d4f:0713' ), $this->message() );

		$this->assertSame( false, U\Str::is_ip( '127.0.0.1.' ), $this->message() );
		$this->assertSame( false, U\Str::is_ip( '45.79.7.19.' ), $this->message() );
		$this->assertSame( false, U\Str::is_ip( '::1:' ), $this->message() );
		$this->assertSame( false, U\Str::is_ip( '::ffff:2d4f:713.' ), $this->message() );
		$this->assertSame( false, U\Str::is_ip( '0:0:0:0:0:ffff:2d4f:0713.' ), $this->message() );
	}

	/**
	 * @covers ::is_ipv4()
	 */
	public function test_is_ipv4() : void {
		$this->assertSame( true, U\Str::is_ipv4( '127.0.0.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_ipv4( '45.79.7.19' ), $this->message() );

		$this->assertSame( false, U\Str::is_ipv4( '::1' ), $this->message() );
		$this->assertSame( false, U\Str::is_ipv4( '::ffff:2d4f:713' ), $this->message() );
		$this->assertSame( false, U\Str::is_ipv4( '0:0:0:0:0:ffff:2d4f:0713' ), $this->message() );
	}

	/**
	 * @covers ::is_ipv6()
	 */
	public function test_is_ipv6() : void {
		$this->assertSame( true, U\Str::is_ipv6( '::1' ), $this->message() );
		$this->assertSame( true, U\Str::is_ipv6( '::ffff:2d4f:713' ), $this->message() );
		$this->assertSame( true, U\Str::is_ipv6( '0:0:0:0:0:ffff:2d4f:0713' ), $this->message() );

		$this->assertSame( false, U\Str::is_ipv6( '127.0.0.1' ), $this->message() );
		$this->assertSame( false, U\Str::is_ipv6( '45.79.7.19' ), $this->message() );
	}

	/**
	 * @covers ::is_name()
	 */
	public function test_is_name() : void {
		$this->assertSame( true, U\Str::is_name( 'Acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_name( 'Acme™' ), $this->message() );
		$this->assertSame( true, U\Str::is_name( 'John Smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_name( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_name( str_repeat( 'x', 129 ) ), $this->message() );
	}

	/**
	 * @covers ::is_slug()
	 */
	public function test_is_slug() : void {
		$this->assertSame( true, U\Str::is_slug( 'ac' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug( 'acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug( 'john-smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_slug( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug( 'john_smith' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug( str_repeat( 'x', 129 ) ), $this->message() );
	}

	/**
	 * @covers ::is_var()
	 */
	public function test_is_var() : void {
		$this->assertSame( true, U\Str::is_var( 'ac' ), $this->message() );
		$this->assertSame( true, U\Str::is_var( 'acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_var( 'john_smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_var( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_var( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_var( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_var( 'john-smith' ), $this->message() );
		$this->assertSame( false, U\Str::is_var( str_repeat( 'x', 129 ) ), $this->message() );
	}

	/**
	 * @covers ::is_version()
	 */
	public function test_is_version() : void {
		$this->assertSame( true, U\Str::is_version( '0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '0.0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '0.0.0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.dev.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.alpha.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.beta.1' ), $this->message() );
		$this->assertSame( true, U\Str::is_version( '1.0.0.rc.1' ), $this->message() );

		$this->assertSame( false, U\Str::is_version( '.0' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '.0.0' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0-dev.1' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0-alpha.1' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0.beta' ), $this->message() );
		$this->assertSame( false, U\Str::is_version( '1.0.0.rc' ), $this->message() );
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

	/**
	 * @covers ::dump()
	 * Needs further testing.
	 */
	public function test_dump() : void {
		$this->assertSame( '(int) 0', U\Str::dump( 0, true ), $this->message() );
		$this->assertSame( '(int) 1', U\Str::dump( 1, true ), $this->message() );

		$this->assertSame( '(float) 0', U\Str::dump( 0.0, true ), $this->message() );
		$this->assertSame( '(float) 1', U\Str::dump( 1.0, true ), $this->message() );

		$this->assertSame( '(float) 0.1', U\Str::dump( 0.1, true ), $this->message() );
		$this->assertSame( '(float) 1.1', U\Str::dump( 1.1, true ), $this->message() );

		$this->assertSame( '(bool) true', U\Str::dump( true, true ), $this->message() );
		$this->assertSame( '(bool) false', U\Str::dump( false, true ), $this->message() );

		$this->assertSame( '(string) [3/3] ' . "'foo'", U\Str::dump( 'foo', true ), $this->message() );
		$this->assertSame( '(string) [3/3] ' . "'bar'", U\Str::dump( 'bar', true ), $this->message() );
	}
}
