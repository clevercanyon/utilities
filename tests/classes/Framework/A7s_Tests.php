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
 * @noinspection PhpStaticAsDynamicMethodCallInspection
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities__Tests\Framework;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Base class for tests.
 *
 * @since 2021-12-15
 */
abstract class A7s_Tests extends \PHPUnit\Framework\TestCase {
	/**
	 * Fires before the first method is run.
	 *
	 * @since 2021-12-15
	 */
	public static function setUpBeforeClass() : void {
		parent::setUpBeforeClass();

		U\Env::config_testing_mode( 'phpunit' );
		U\Env::config_debugging_mode( 'phpunit' );
	}

	/**
	 * Fires after the last method is run.
	 *
	 * @since 2021-12-15
	 */
	public static function tearDownAfterClass() : void {
		parent::tearDownAfterClass();
	}

	/**
	 * Counter.
	 *
	 * @since 2021-12-15
	 */
	protected int $counter;

	/**
	 * Temp directories.
	 *
	 * @since 2021-12-15
	 */
	protected array $temp_dirs;

	/**
	 * Temp files.
	 *
	 * @since 2021-12-15
	 */
	protected array $temp_files;

	/**
	 * Temp links.
	 *
	 * @since 2021-12-15
	 */
	protected array $temp_links;

	/**
	 * Fires before each method is run.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://phpunit.readthedocs.io/en/9.5/fixtures.html
	 */
	protected function setUp() : void {
		parent::setUp();

		$this->counter    = 0;
		$this->temp_dirs  = [];
		$this->temp_files = [];
		$this->temp_links = [];
	}

	/**
	 * Fires after each method is run.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://phpunit.readthedocs.io/en/9.5/fixtures.html
	 */
	protected function tearDown() : void {
		parent::tearDown();

		$this->tear_down_temp_fs_resources();
	}

	/**
	 * Assert objects are equal.
	 *
	 * @since 2021-12-28
	 *
	 * @param object $expected Expected object value.
	 * @param object $actual   Actual object value.
	 * @param string $message  Optional message.
	 *
	 * @throws \PHPUnit\Framework\ExpectationFailedException {@see assertObjectEquals()}.
	 *
	 * @see   AA6t_Plugin::equals() for further details.
	 * @see   https://phpunit.readthedocs.io/en/9.5/assertions.html#assertobjectequals
	 */
	protected function assertObjEquals( object $expected, object $actual, string $message = '' ) : void {
		$this->assertObjectEquals( $expected, $actual, 'equals', $message );
	}

	/**
	 * Tears down temp FS resources.
	 *
	 * @since 2021-12-15
	 *
	 * @throws Fatal_Exception On any failure.
	 */
	protected function tear_down_temp_fs_resources() : void {
		$sys_temp = U\Dir::sys_temp();

		foreach ( $this->temp_dirs as $_dir ) {
			if ( is_dir( $_dir ) || U\Fs::path_exists( $_dir ) ) {
				if ( 0 !== mb_stripos( $_dir, $sys_temp ) || ! U\Fs::delete( $_dir ) ) {
					throw new Fatal_Exception( 'Failed to cleanup dir: `' . $_dir . '`. System temp dir is: `' . $sys_temp . '`.' );
				}
			}
		}
		foreach ( $this->temp_files as $_file ) {
			if ( is_file( $_file ) || U\Fs::path_exists( $_file ) ) {
				if ( 0 !== mb_stripos( $_file, $sys_temp ) || ! U\Fs::delete( $_file ) ) {
					throw new Fatal_Exception( 'Failed to cleanup file: `' . $_file . '`. System temp dir is: `' . $sys_temp . '`.' );
				}
			}
		}
		foreach ( $this->temp_links as $_link ) {
			if ( is_link( $_link ) || U\Fs::path_exists( $_link ) ) {
				if ( 0 !== mb_stripos( $_link, $sys_temp ) || ! U\Fs::delete( $_link ) ) {
					throw new Fatal_Exception( 'Failed to cleanup link: `' . $_link . '`. System temp dir is: `' . $sys_temp . '`.' );
				}
			}
		}
	}

	/**
	 * Gets `[assertion]-[counter][message]`.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $message Optional message. Default = empty.
	 *
	 * @return string `[assertion]-[counter][message]`.
	 */
	protected function message( string $message = '' ) : string {
		return 'assertion-' . ( ++$this->counter ) . ( $message ? '[' . $message . ']' : '' );
	}

	/**
	 * Gets a temporary directory.
	 *
	 * @since 2021-12-15
	 *
	 * @param bool $populate              Populate? Default is `false`.
	 * @param int  $population_multiplier Optional population multiplier.
	 *                                    Default is `1`. Upper limit is `5`.
	 *
	 * @return string Absolute path to temporary directory.
	 */
	protected function temp_dir( bool $populate = false, int $population_multiplier = 1 ) : string {
		$population_multiplier = min( max( 1, $population_multiplier ), 5 );
		$dir                   = U\Dir::make_temp();
		$this->temp_dirs[]     = $dir;

		for ( $_i = 1; $populate && $_i <= $population_multiplier; $_i++ ) {
			U\Dir::make( U\Dir::join( $dir, '/dir-' . $_i ) );
			for ( $_j = 1; $_j <= $population_multiplier; $_j++ ) {
				U\File::make( U\Dir::join( $dir, '/file-' . $_i . '.' . $_j ) );
			}

			for ( $__i = 1; $__i <= $population_multiplier; $__i++ ) {
				U\Dir::make( U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i ) );
				for ( $_j = 1; $_j <= $population_multiplier; $_j++ ) {
					U\File::make( U\Dir::join( $dir, '/dir-' . $_i . '/file-' . $__i . '.' . $_j ) );
				}

				for ( $___i = 1; $___i <= $population_multiplier; $___i++ ) {
					for ( $_j = 1; $_j <= $population_multiplier; $_j++ ) {
						U\File::make( U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/file-' . $___i . '.' . $_j ) );
					}
				}
			}
		}
		return $dir;
	}

	/**
	 * Gets a temp file.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@see U\Dir::make_temp()}.
	 *
	 * @return string     Temp file path.
	 */
	protected function temp_file( string $ext = 'tmp', string $dir = '' ) : string {
		$file               = U\File::make_temp( $ext, $dir );
		$this->temp_files[] = $file;

		return $file;
	}

	/**
	 * Gets a temp link.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@see U\Dir::make_temp()}.
	 *
	 * @return string     Temp link path.
	 */
	protected function temp_link( string $ext = 'tmp', string $dir = '' ) : string {
		$file               = U\File::make_temp( $ext, $dir );
		$this->temp_files[] = $file;

		$link               = U\File::make_temp( $ext, $dir );
		$this->temp_links[] = $link;

		U\Fs::delete( $link );
		symlink( $file, $link );

		return $link;
	}

	/**
	 * Gets a broken temp link.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@see U\Dir::make_temp()}.
	 *
	 * @return string     Temp broken link path.
	 */
	protected function temp_broken_link( string $ext = 'tmp', string $dir = '' ) : string {
		$file               = U\File::make_temp( $ext, $dir );
		$this->temp_files[] = $file;

		$link               = U\File::make_temp( $ext, $dir );
		$this->temp_links[] = $link;

		U\Fs::delete( $link );
		symlink( $file . '.x-nonexistent-file', $link );

		return $link;
	}
}
