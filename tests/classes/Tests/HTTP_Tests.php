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
 * @coversDefaultClass \Clever_Canyon\Utilities\HTTP
 */
final class HTTP_Tests extends UT\A6t\Tests {
	/**
	 * @runInSeparateProcess
	 * @covers ::config_robots()
	 *
	 * Runs in separate process to avoid headers having already been sent by PHPUnit.
	 * Even so, headers are not actually sent when running PHP CLI, as the SAPI doesn't support headers.
	 */
	public function test_config_robots() : void {
		$this->assertSame( false, headers_sent(), $this->message() );
		$this->assertSame( true, U\HTTP::config_robots( [ '20ec8dee2e364f5d903fd2508d814f9f' => true ] ), $this->message() );
		$this->assertSame( [ '20ec8dee2e364f5d903fd2508d814f9f' ], U\Env::static_var( 'HTTP_ROBOTS' ), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::disable_caching()
	 *
	 * Runs in separate process to avoid headers having already been sent by PHPUnit.
	 * Even so, headers are not actually sent when running PHP CLI, as the SAPI doesn't support headers.
	 */
	public function test_disable_robots() : void {
		$this->assertSame( false, headers_sent(), $this->message() );
		$this->assertSame( true, U\HTTP::disable_robots(), $this->message() );
		$this->assertSame( [ 'none', 'noindex', 'nofollow' ], U\Env::static_var( 'HTTP_ROBOTS' ), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::disable_caching()
	 *
	 * Runs in separate process to avoid headers having already been sent by PHPUnit.
	 * Even so, headers are not actually sent when running PHP CLI, as the SAPI doesn't support headers.
	 */
	public function test_disable_caching() : void {
		$this->assertSame( false, headers_sent(), $this->message() );
		$this->assertSame( true, U\HTTP::disable_caching(), $this->message() );
		$this->assertSame( false, U\Env::static_var( 'HTTP_CACHE' ), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::disable_gzip()
	 *
	 * Runs in separate process to avoid headers having already been sent by PHPUnit.
	 * Even so, headers are not actually sent when running PHP CLI, as the SAPI doesn't support headers.
	 */
	public function test_disable_gzip() : void {
		$this->assertSame( false, headers_sent(), $this->message() );
		$this->assertSame( true, U\HTTP::disable_gzip(), $this->message() );
		$this->assertSame( true, 'off' === ini_get( 'zlib.output_compression' ), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::close_session()
	 *
	 * Runs in separate process to avoid headers having already been sent by PHPUnit.
	 * Even so, headers are not actually sent when running PHP CLI, as the SAPI doesn't support headers.
	 */
	public function test_close_session() : void {
		$this->assertSame( false, headers_sent(), $this->message() );
		$this->assertSame( true, session_start(), $this->message() );
		$this->assertSame( true, U\HTTP::close_session(), $this->message() );
		$this->assertSame( true, PHP_SESSION_ACTIVE !== session_status(), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::prep_for_special_output()
	 *
	 * By default, this function tries to close all out output buffers, which is problematic.
	 * e.g., PHPUnit complains: 'Test code or tested code did not (only) close its own output buffers.'.
	 * For that reason, {@see U\Env::end_output_buffering()} will leave OB level `1` intact when testing.
	 */
	public function test_prep_for_special_output() : void {
		$this->assertSame( true, U\HTTP::prep_for_special_output(), $this->message() );
		$this->assertSame( true, 'off' === ini_get( 'zlib.output_compression' ), $this->message() );
		$this->assertSame( true, PHP_SESSION_ACTIVE !== session_status(), $this->message() );
		$this->assertSame( true, 1 === ob_get_level(), $this->message() );
	}

	/**
	 * @runInSeparateProcess
	 * @covers ::prep_for_file_download()
	 *
	 * By default, this function tries to close all out output buffers, which is problematic.
	 * e.g., PHPUnit complains: 'Test code or tested code did not (only) close its own output buffers.'.
	 * For that reason, {@see U\Env::end_output_buffering()} will leave OB level `1` intact when testing.
	 */
	public function test_prep_for_file_download() : void {
		$this->assertSame( true, U\HTTP::prep_for_file_download(), $this->message() );
		$this->assertSame( true, 'off' === ini_get( 'zlib.output_compression' ), $this->message() );
		$this->assertSame( true, PHP_SESSION_ACTIVE !== session_status(), $this->message() );
		$this->assertSame( true, 1 === ob_get_level(), $this->message() );
		$this->assertSame( false, U\Env::static_var( 'HTTP_CACHE' ), $this->message() );
		$this->assertSame( [ 'none', 'noindex', 'nofollow' ], U\Env::static_var( 'HTTP_ROBOTS' ), $this->message() );
	}
}
