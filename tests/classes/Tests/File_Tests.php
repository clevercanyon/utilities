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
 * @coversDefaultClass \Clever_Canyon\Utilities\File
 */
final class File_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::ext()
	 */
	public function test_ext() : void {
		$this->assertSame( 'log', U\File::ext( '/foo/bar/test.log' ), $this->message() );
		$this->assertSame( 'php', U\File::ext( '/foo/bar/test.php' ), $this->message() );
		$this->assertSame( 'wav', U\File::ext( '/foo/bar/text.wav' ), $this->message() );
	}

	/**
	 * @covers ::ext_type()
	 */
	public function test_ext_type() : void {
		$this->assertSame( 'Log', U\File::ext_type( '/foo/bar/test.log' ), $this->message() );
		$this->assertSame( 'PHP', U\File::ext_type( '/foo/bar/test.php' ), $this->message() );
		$this->assertSame( 'Audio', U\File::ext_type( '/foo/bar/text.wav' ), $this->message() );
	}

	/**
	 * @covers ::mime_type()
	 */
	public function test_mime_type() : void {
		$this->assertSame( 'text/plain', U\File::mime_type( '/foo/bar/test.log' ), $this->message() );
		$this->assertSame( 'text/html', U\File::mime_type( '/foo/bar/test.php' ), $this->message() );
		$this->assertSame( 'audio/wav', U\File::mime_type( '/foo/bar/text.wav' ), $this->message() );
	}

	/**
	 * @covers ::content_type()
	 */
	public function test_content_type() : void {
		$this->assertSame( 'text/plain; charset=' . U\Env::charset(), U\File::content_type( '/foo/bar/test.log' ), $this->message() );
		$this->assertSame( 'text/html; charset=' . U\Env::charset(), U\File::content_type( '/foo/bar/test.php' ), $this->message() );
		$this->assertSame( 'audio/wav', U\File::content_type( '/foo/bar/text.wav' ), $this->message() );
	}

	/**
	 * @covers ::size_abbr()
	 * @covers ::bytes_abbr()
	 */
	public function test_size_abbr() : void {
		$temp_file = $this->temp_file();

		U\File::write( $temp_file, str_repeat( 'x', 1 ) );
		$this->assertSame( '1 byte', U\File::size_abbr( $temp_file ), $this->message() );

		U\File::write( $temp_file, str_repeat( 'x', 2 ) );
		clearstatcache( true, $temp_file );
		$this->assertSame( '2 bytes', U\File::size_abbr( $temp_file ), $this->message() );

		U\File::write( $temp_file, str_repeat( 'x', 1024 ) );
		clearstatcache( true, $temp_file );
		$this->assertSame( '1 kb', U\File::size_abbr( $temp_file ), $this->message() );

		U\File::write( $temp_file, str_repeat( 'x', 1024 * 2 ) );
		clearstatcache( true, $temp_file );
		$this->assertSame( '2 kbs', U\File::size_abbr( $temp_file ), $this->message() );

		U\File::write( $temp_file, str_repeat( 'x', 1024 * 1024 ) );
		clearstatcache( true, $temp_file );
		$this->assertSame( '1 MB', U\File::size_abbr( $temp_file ), $this->message() );
	}

	/**
	 * @covers ::ini_bytes_abbr()
	 */
	public function test_ini_bytes_abbr() : void {
		$this->assertSame( '1', U\File::ini_bytes_abbr( 1 ), $this->message() );
		$this->assertSame( '2', U\File::ini_bytes_abbr( 2 ), $this->message() );
		$this->assertSame( '1K', U\File::ini_bytes_abbr( 1024 ), $this->message() );
		$this->assertSame( '2K', U\File::ini_bytes_abbr( 1024 * 2 ), $this->message() );
		$this->assertSame( '1M', U\File::ini_bytes_abbr( 1024 * 1024 ), $this->message() );
	}

	/**
	 * @covers ::bytes_abbr()
	 */
	public function test_bytes_abbr() : void {
		$this->assertSame( '1 byte', U\File::bytes_abbr( 1 ), $this->message() );
		$this->assertSame( '2 bytes', U\File::bytes_abbr( 2 ), $this->message() );
		$this->assertSame( '1 kb', U\File::bytes_abbr( 1024 ), $this->message() );
		$this->assertSame( '2 kbs', U\File::bytes_abbr( 1024 * 2 ), $this->message() );
		$this->assertSame( '1 MB', U\File::bytes_abbr( 1024 * 1024 ), $this->message() );
	}

	/**
	 * @covers ::abbr_bytes()
	 */
	public function test_abbr_bytes() : void {
		$this->assertSame( 1, U\File::abbr_bytes( '1 byte' ), $this->message() );
		$this->assertSame( 2, U\File::abbr_bytes( '2 bytes' ), $this->message() );
		$this->assertSame( 1024, U\File::abbr_bytes( '1 kb' ), $this->message() );
		$this->assertSame( 1024 * 2, U\File::abbr_bytes( '2 kbs' ), $this->message() );
		$this->assertSame( 1024 * 1024, U\File::abbr_bytes( '1 MB' ), $this->message() );

		$this->assertSame( '1', U\File::ini_bytes_abbr( 1 ), $this->message() );
		$this->assertSame( '2', U\File::ini_bytes_abbr( 2 ), $this->message() );
		$this->assertSame( '1K', U\File::ini_bytes_abbr( 1024 ), $this->message() );
		$this->assertSame( '2K', U\File::ini_bytes_abbr( 1024 * 2 ), $this->message() );
		$this->assertSame( '1M', U\File::ini_bytes_abbr( 1024 * 1024 ), $this->message() );

		$this->assertSame( 1, U\File::abbr_bytes( U\File::ini_bytes_abbr( 1 ) ), $this->message() );
		$this->assertSame( 2, U\File::abbr_bytes( U\File::ini_bytes_abbr( 2 ) ), $this->message() );
		$this->assertSame( 1024, U\File::abbr_bytes( U\File::ini_bytes_abbr( 1024 ) ), $this->message() );
		$this->assertSame( 1024 * 2, U\File::abbr_bytes( U\File::ini_bytes_abbr( 1024 * 2 ) ), $this->message() );
		$this->assertSame( 1024 * 1024, U\File::abbr_bytes( U\File::ini_bytes_abbr( 1024 * 1024 ) ), $this->message() );
	}

	/**
	 * @covers ::make()
	 */
	public function test_make() : void {
		$temp_dir = $this->temp_dir();

		$this->assertSame( true, U\File::make( U\Dir::join( $temp_dir, '/foo/bar/baz/coo.caz' ) ), $this->message() );
	}

	/**
	 * @covers ::make_temp()
	 */
	public function test_make_temp() : void {
		$temp_dir = $this->temp_dir();

		$this->assertSame( true, is_file( U\File::make_temp( 'foo', U\Dir::join( $temp_dir, '/foo/bar/baz' ) ) ), $this->message() );
	}

	/**
	 * @covers ::make_unique_path()
	 */
	public function test_make_unique_path() : void {
		$temp_dir = $this->temp_dir();

		$this->assertSame( true, ! empty( U\File::make_unique_path( '', $temp_dir ) ), $this->message() );
	}
}
