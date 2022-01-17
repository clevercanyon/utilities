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
		$this->assertSame( 'coo', U\File::ext( '/foo/bar/baz.coo' ), $this->message() );
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
}
