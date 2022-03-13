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
 * @coversDefaultClass \Clever_Canyon\Utilities\Env
 */
final class Env_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::is_linux()
	 */
	public function test_is_linux() : void {
		$this->assertSame( 'Linux' === PHP_OS_FAMILY, U\Env::is_linux(), $this->message() );
	}

	/**
	 * @covers ::is_windows()
	 */
	public function test_is_windows() : void {
		$this->assertSame( 'Windows' === PHP_OS_FAMILY, U\Env::is_windows(), $this->message() );
	}

	/**
	 * @covers ::is_unix_based()
	 */
	public function test_is_unix_based() : void {
		$this->assertSame( in_array( PHP_OS_FAMILY, [ 'BSD', 'Darwin', 'Solaris', 'Linux' ], true ), U\Env::is_unix_based(), $this->message() );
	}

	/**
	 * @covers ::is_wordpress()
	 */
	public function test_is_wordpress() : void {
		$this->assertSame( defined( 'WPINC' ), U\Env::is_wordpress(), $this->message() );
	}

	/**
	 * @covers ::is_wp_host()
	 */
	public function test_is_wp_host() : void {
		$this->assertSame( false, U\Env::is_wp_host( 'foo-nonexistent.com' ), $this->message() );
		$this->assertSame( false, U\Env::is_wp_host( 'clevercanyon-utilities.wp:00' ), $this->message() );
		$this->assertSame(
			U\Env::is_wordpress() && U\Env::is_wp_docker(),
			U\Env::is_wp_host( 'clevercanyon-utilities.wp' ),
			$this->message()
		);
	}

	/**
	 * @covers ::is_web()
	 *
	 * @covers ::is_apache()
	 * @covers ::apache_version()
	 *
	 * @covers ::is_iis()
	 * @covers ::iis_version()
	 *
	 * @covers ::is_lighttpd()
	 * @covers ::lighttpd_version()
	 *
	 * @covers ::is_litespeed()
	 * @covers ::litespeed_version()
	 *
	 * @covers ::is_nginx()
	 * @covers ::nginx_version()
	 */
	public function test_is_web() : void {
		$this->assertSame( true, U\Env::is_web(), $this->message() );

		$this->assertSame( false, U\Env::is_apache(), $this->message() );
		$this->assertSame( '', U\Env::apache_version(), $this->message() );

		$this->assertSame( false, U\Env::is_iis(), $this->message() );
		$this->assertSame( '', U\Env::iis_version(), $this->message() );

		$this->assertSame( false, U\Env::is_lighttpd(), $this->message() );
		$this->assertSame( '', U\Env::lighttpd_version(), $this->message() );

		$this->assertSame( false, U\Env::is_litespeed(), $this->message() );
		$this->assertSame( '', U\Env::litespeed_version(), $this->message() );

		$this->assertSame( false, U\Env::is_nginx(), $this->message() );
		$this->assertSame( '', U\Env::nginx_version(), $this->message() );
	}

	/**
	 * @covers ::raise_memory_limit()
	 *
	 * Can be tested with PHPUnit in other memory limits by passing:
	 * e.g., `-d memory_limit=32M` to `phpunit` from command line.
	 */
	public function test_raise_memory_limit() : void {
		$this->assertSame( U\File::abbr_bytes( '257M' ), U\Env::raise_memory_limit( 'admin', '257M' ), $this->message() );
		$this->assertSame( U\File::abbr_bytes( '512M' ), U\Env::raise_memory_limit( 'dev' ), $this->message() );
		$this->assertSame( U\File::abbr_bytes( '512M' ), U\Env::raise_memory_limit( 'dev', '257M' ), $this->message() );
	}

	/**
	 * @covers ::charset()
	 * @covers ::is_utf8()
	 *
	 * Can be tested with PHPUnit in other charsets by passing:
	 * e.g., `-d default_charset=iso-8859-1` to `phpunit` from command line.
	 */
	public function test_charset() : void {
		$this->assertSame( true, ! empty( U\Env::charset() ), $this->message() );
		$this->assertSame( 'utf-8' === U\Env::charset(), U\Env::is_utf8(), $this->message() );
	}

	/**
	 * @covers ::timezone()
	 * @covers ::is_utc()
	 *
	 * Can be tested with PHPUnit in other timezones by passing:
	 * e.g., `-d date.timezone=America/New_York` to `phpunit` from command line.
	 */
	public function test_timezone() : void {
		$this->assertSame( true, ! empty( U\Env::timezone() ), $this->message() );
		$this->assertSame( 'utc' === U\Env::timezone(), U\Env::is_utc(), $this->message() );
	}

	/**
	 * @covers ::vars()
	 */
	public function test_vars() : void {
		$vars = U\Env::vars();

		$this->assertSame( true, ! empty( $vars[ 'USER' ] ), $this->message() );
		$this->assertSame( true, ! empty( $vars[ 'HOME' ] ), $this->message() );
		$this->assertSame( true, ! empty( $vars[ 'CWD' ] ), $this->message() );
	}

	/**
	 * @covers ::var()
	 */
	public function test_var() : void {
		$this->assertSame( true, ! empty( U\Env::var( 'USER' ) ), $this->message() );
		$this->assertSame( true, ! empty( U\Env::var( 'USER_LC' ) ), $this->message() );
		$this->assertSame( true, ! empty( U\Env::var( 'USER_ID' ) ), $this->message() );
		$this->assertSame( true, ! empty( U\Env::var( 'HOME' ) ), $this->message() );
		$this->assertSame( true, ! empty( U\Env::var( 'CWD' ) ), $this->message() );
		$this->assertSame( true, is_string( U\Env::var( 'TERM' ) ), $this->message() );
		$this->assertSame( true, is_string( U\Env::var( 'APPDATA' ) ), $this->message() );
		$this->assertSame( true, is_string( U\Env::var( 'DOCUMENT_ROOT' ) ), $this->message() );
	}

	/**
	 * @covers ::static_var()
	 */
	public function test_static_var() : void {
		$this->assertSame( 'b04ec047bec8dc40', U\Env::static_var( '213DDC07853C4655', 'b04ec047bec8dc40' ), $this->message() );
		$this->assertSame( 'b04ec047bec8dc40', U\Env::static_var( '213DDC07853C4655' ), $this->message() );
	}

	/**
	 * @covers ::maybe_define()
	 */
	public function test_maybe_define() : void {
		$this->assertSame( true, U\Env::maybe_define( 'B05E5E8016E9468', '6e443c32ec444f048' ), $this->message() );
		$this->assertSame( true, U\Env::maybe_define( 'A9992BD0119D4C5', '6dadc3ed516f4cd19' ), $this->message() );
	}

	/**
	 * @covers ::can_use_extension()
	 */
	public function test_can_use_extension() : void {
		$this->assertSame( true, U\Env::can_use_extension( 'mbstring' ), $this->message() );
		$this->assertSame( false, U\Env::can_use_extension( 'foo' ), $this->message() );
	}

	/**
	 * @covers ::can_use_class()
	 */
	public function test_can_use_class() : void {
		$this->assertSame( false, U\Env::can_use_class( 'Foo' ), $this->message() );
		$this->assertSame( true, U\Env::can_use_class( 'stdClass' ), $this->message() );
		$this->assertSame( true, U\Env::can_use_class( 'RecursiveDirectoryIterator' ), $this->message() );
		$this->assertSame( false, U\Env::can_use_class( 'Foo', 'stdClass', 'RecursiveDirectoryIterator' ), $this->message() );
		$this->assertSame( false, U\Env::can_use_class( 'stdClass', 'RecursiveDirectoryIterator', 'Foo' ), $this->message() );
	}

	/**
	 * @covers ::can_use_function()
	 */
	public function test_can_use_function() : void {
		$this->assertSame( false, U\Env::can_use_function( 'foo' ), $this->message() );
		$this->assertSame( true, U\Env::can_use_function( 'getenv' ), $this->message() );
		$this->assertSame( true, U\Env::can_use_function( 'set_time_limit' ), $this->message() );
		$this->assertSame( true, U\Env::can_use_function( 'getenv', 'phpinfo', 'set_time_limit' ), $this->message() );
		$this->assertSame( false, U\Env::can_use_function( 'getenv', 'phpinfo', 'set_time_limit', 'foo' ), $this->message() );

		$language_constructs = [
			'__halt_compiler',
			'die',
			'echo',
			'empty',
			'eval',
			'exit',
			'include_once',
			'include',
			'isset',
			'list',
			'print',
			'require_once',
			'require',
			'return',
			'unset',
		];
		foreach ( $language_constructs as $_language_construct ) {
			$this->assertSame( false, function_exists( $_language_construct ), $this->message( $_language_construct ) );
		}
		$this->assertSame( true, U\Env::can_use_function( ...$language_constructs ), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::set_time_limit()
	 *
	 * Runs in a separate process so we don't allow the larger body of tests
	 * to run forever by granting unlimited execution time for all tests.
	 */
	public function test_set_time_limit() : void {
		$this->assertSame( true, U\Env::set_time_limit( 0 ), $this->message() );
		$this->assertSame( true, U\Env::set_time_limit( PHP_INT_MAX ), $this->message() );
	}

	/**
	 * @covers ::in_test_mode()
	 */
	public function test_in_test_mode() : void {
		$this->assertSame( true, U\Env::in_test_mode(), $this->message() );
		$this->assertSame( true, U\Env::in_test_mode( 'phpunit' ), $this->message() );
	}

	/**
	 * @covers ::in_debug_mode()
	 */
	public function test_in_debug_mode() : void {
		$this->assertSame( true, U\Env::in_debug_mode(), $this->message() );
		$this->assertSame( true, U\Env::in_debug_mode( 'phpunit' ), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::end_output_buffering()
	 *
	 * By default, this function tries to close all out output buffers, which is problematic.
	 * e.g., PHPUnit complains: "Test code or tested code did not (only) close its own output buffers.".
	 * For that reason, {@see U\Env::end_output_buffering()} will leave OB level `1` intact when testing.
	 */
	public function test_end_output_buffering() : void {
		$this->assertSame( true, U\Env::end_output_buffering(), $this->message() );
		$this->assertSame( true, 1 === ob_get_level(), $this->message() );
	}

	/**
	 * @covers ::sys_name()
	 */
	public function test_sys_name() : void {
		$this->assertSame( true, ! empty( U\Env::sys_name() ), $this->message() );
	}

	/**
	 * @covers ::sys_ip()
	 */
	public function test_sys_ip() : void {
		$this->assertSame( true, ! empty( U\Env::sys_ip() ), $this->message() );
	}

	/**
	 * @covers ::server_api()
	 */
	public function test_server_api() : void {
		$this->assertSame( true, ! empty( U\Env::server_api() ), $this->message() );
	}

	/**
	 * @covers ::server_name()
	 */
	public function test_server_name() : void {
		$this->assertSame( true, empty( U\Env::server_name() ), $this->message() );
	}

	/**
	 * @covers ::server_ip()
	 */
	public function test_server_ip() : void {
		$this->assertSame( true, empty( U\Env::server_ip() ), $this->message() );
	}

	/**
	 * @covers ::server_port()
	 */
	public function test_server_port() : void {
		$this->assertSame( true, empty( U\Env::server_port() ), $this->message() );
	}

	/**
	 * @covers ::is_robotic_web_server_user()
	 */
	public function test_is_robotic_web_server_user() : void {
		$this->assertSame( U\Env::is_wp_docker(), U\Env::is_robotic_web_server_user(), $this->message() );
	}

	/**
	 * @covers ::is_hostery()
	 */
	public function test_is_hostery() : void {
		$this->assertSame( false, U\Env::is_hostery(), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::is_hostery()
	 */
	public function test_is_hostery_yes() : void {
		putenv( 'HOSTERY=phpunit|cpanel|php' ); // phpcs:ignore.
		$this->assertSame( true, U\Env::is_hostery(), $this->message() );
		$this->assertSame( true, U\Env::is_hostery( 'cpanel' ), $this->message() );
		$this->assertSame( false, U\Env::is_hostery( 'digitalocean' ), $this->message() );
	}
}
