<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities__Tests\Tests\OOPs\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Exception;

use Clever_Canyon\Utilities__Tests\Framework\Version_1_0_0\{Base};

/**
 * PHPCS exceptions.
 *
 * @since 1.0.0
 *
 * @note  Don't need short description for all tests.
 * phpcs:disable Generic.Commenting.DocComment.MissingShort
 */

/**
 * Test case.
 *
 * @since 1.0.0
 * @coversDefaultClass \Clever_Canyon\Utilities\OOPs\Version_1_0_0\Fs
 */
final class Fs_Tests extends Base {
	/**
	 * @covers ::normalize()
	 */
	public function test_normalize() : void {
		foreach ( [
			'C:/foo/bar' => 'C:\\foo\\bar\\',
			'C:/foo/bar' => 'C:\\foo\\bar\\\\',

			'/foo/bar' => '\\foo\\bar',
			'/foo/bar' => '\\foo\\bar\\',

			'/foo/bar' => '/foo/bar/',
			'/foo/bar' => '/foo/bar//',

			'/foo' => '/foo/',
			'/foo' => '/foo//',

			'/foo' => '/foo',
			'/bar' => '//bar',

			'/' => '\\',
			'/' => '\\\\',

			'/' => '/',
			'/' => '//',
		] as $_expecting => $_path
		) {
			$this->assertSame( $_expecting, U\Fs::normalize( $_path ), $this->counter() );
		}
	}

	/**
	 * @covers ::path_exists()
	 */
	public function test_path_exists() : void {
		$this->assertSame( true, U\Fs::path_exists( __DIR__ ), $this->counter() );
		$this->assertSame( true, U\Fs::path_exists( __FILE__ ), $this->counter() );
	}

	/**
	 * @covers ::type()
	 */
	public function test_type() : void {
		$this->assertSame( 'dir', U\Fs::type( $this->temp_dir() ), $this->counter() );
		$this->assertSame( 'file', U\Fs::type( $this->temp_file() ), $this->counter() );
	}

	/**
	 * @covers ::perms()
	 */
	public function test_perms() : void {
		$this->assertSame( '0700', U\Fs::perms( $this->temp_dir(), true ), $this->counter() );
		$this->assertSame( '0600', U\Fs::perms( $this->temp_file(), true ), $this->counter() );
	}

	/**
	 * @covers ::copy()
	 */
	public function test_copy() : void {
		$this->assertSame( true, U\Fs::copy( $this->temp_dir(), $this->temp_dir() ), $this->counter() );
		$this->assertSame( true, U\Fs::copy( $this->temp_dir( true ), $this->temp_dir( true ) ), $this->counter() );
	}

	/**
	 * @covers ::zip()
	 */
	public function test_zip() : void {
		$this->assertSame( true, U\Fs::zip( $this->temp_dir( true ), $this->temp_file( 'zip' ) ), $this->counter() );
		$this->assertSame( true, U\Fs::zip( $this->temp_file(), $this->temp_file( 'zip' ) ), $this->counter() );
	}
}
