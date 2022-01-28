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
 * @coversDefaultClass \Clever_Canyon\Utilities\Env
 */
final class Env_Tests extends UT\A6t\Tests {
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
	 * @covers ::charset()
	 * @covers ::is_charset_utf8()
	 *
	 * @note Can be tested with PHPUnit in other charsets by passing:
	 *       e.g., `-d default_charset=iso-8859-1` to `phpunit` from command line.
	 */
	public function test_charset() : void {
		$this->assertSame( true, ! empty( U\Env::charset() ), $this->message() );
		$this->assertSame( 'utf-8' === U\Env::charset(), U\Env::is_charset_utf8(), $this->message() );
	}

	/**
	 * @covers ::vars()
	 */
	public function test_vars() : void {
		$vars = U\Env::vars();

		$this->assertSame( true, ! empty( $vars[ 'USER' ] ), $this->message() );
		$this->assertSame( true, ! empty( $vars[ 'HOME' ] ), $this->message() );
		$this->assertSame( true, ! empty( $vars[ 'CWD' ] ), $this->message() );
		$this->assertSame( true, ! empty( $vars[ 'TMPDIR' ] ), $this->message() );
	}

	/**
	 * @covers ::var()
	 */
	public function test_var() : void {
		$this->assertSame( true, ! empty( U\Env::var( 'USER' ) ), $this->message() );
		$this->assertSame( true, ! empty( U\Env::var( 'HOME' ) ), $this->message() );
		$this->assertSame( true, ! empty( U\Env::var( 'CWD' ) ), $this->message() );
		$this->assertSame( true, ! empty( U\Env::var( 'TMPDIR' ) ), $this->message() );
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
	 * @covers ::set_time_limit()
	 */
	public function test_set_time_limit() : void {
		$this->assertSame( true, U\Env::set_time_limit( 0 ), $this->message() );
		$this->assertSame( true, U\Env::set_time_limit( PHP_INT_MAX ), $this->message() );
	}

	/**
	 * @covers ::config_testing_mode()
	 */
	public function test_config_testing_mode() : void {
		$this->assertSame( true, (bool) U\Env::static_var( 'TESTING' ), $this->message() );
	}

	/**
	 * @covers ::config_debugging_mode()
	 */
	public function test_config_debugging_mode() : void {
		$this->assertSame( true, (bool) U\Env::static_var( 'DEBUGGING' ), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::end_output_buffering()
	 *
	 * @note By default, this function tries to close all out output buffers, which is problematic.
	 *       e.g., PHPUnit complains: "Test code or tested code did not (only) close its own output buffers.".
	 *       For that reason, {@see U\Env::end_output_buffering()} will leave OB level `1` intact when testing.
	 */
	public function test_end_output_buffering() : void {
		$this->assertSame( true, U\Env::end_output_buffering(), $this->message() );
		$this->assertSame( true, 1 === ob_get_level(), $this->message() );
	}
}
