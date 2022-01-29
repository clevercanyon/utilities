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
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities__Tests\A6t;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Base class for tests.
 *
 * @since 2021-12-15
 */
abstract class Tests extends \PHPUnit\Framework\TestCase {
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
	 * Fires before the first method is run.
	 *
	 * @since 2021-12-15
	 */
	public static function setUpBeforeClass() : void {
		parent::setUpBeforeClass();

		U\Env::set_test_mode( 'phpunit' );
		U\Env::set_debug_mode( 'phpunit' );
	}

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
	 * Fires after the last method is run.
	 *
	 * @since 2021-12-15
	 */
	public static function tearDownAfterClass() : void {
		parent::tearDownAfterClass();
	}

	/**
	 * Assert objects are equal.
	 *
	 * @since 2021-12-28
	 *
	 * @param U\I7e\Base $expected Expected object value.
	 * @param U\I7e\Base $actual   Actual object value.
	 * @param string     $message  Optional message.
	 *
	 * @throws \PHPUnit\Framework\ExpectationFailedException On assertion failure.
	 *
	 * @see   U\A6t\Base::to_equals_string() for further details.
	 * @see   https://phpunit.readthedocs.io/en/9.5/assertions.html#assertobjectequals
	 */
	protected function assertObjEquals( U\I7e\Base $expected, U\I7e\Base $actual, string $message = '' ) : void {
		$this->assertSame( $expected->to_equals_string(), $actual->to_equals_string(), $message );
	}

	/**
	 * Assert objects are *not* equal.
	 *
	 * @since 2021-12-28
	 *
	 * @param U\I7e\Base $expected Expected object value.
	 * @param U\I7e\Base $actual   Actual object value.
	 * @param string     $message  Optional message.
	 *
	 * @throws \PHPUnit\Framework\ExpectationFailedException On assertion failure.
	 *
	 * @see   U\A6t\Base::to_equals_string() for further details.
	 * @see   https://phpunit.readthedocs.io/en/9.5/assertions.html#assertobjectequals
	 */
	protected function assertObjNotEquals( U\I7e\Base $expected, U\I7e\Base $actual, string $message = '' ) : void {
		$this->assertNotSame( $expected->to_equals_string(), $actual->to_equals_string(), $message );
	}

	/**
	 * Tears down temp FS resources.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	protected function tear_down_temp_fs_resources() : void {
		$sys_temp = U\Dir::sys_temp();

		foreach ( $this->temp_dirs as $_dir ) {
			if ( U\Fs::exists( $_dir ) ) {
				if ( 0 !== mb_stripos( $_dir, $sys_temp ) || ! U\Fs::delete( $_dir ) ) {
					throw new U\Fatal_Exception( 'Failed to cleanup dir: `' . $_dir . '`.' );
				}
			}
		}
		foreach ( $this->temp_files as $_file ) {
			if ( U\Fs::exists( $_file ) ) {
				if ( 0 !== mb_stripos( $_file, $sys_temp ) || ! U\Fs::delete( $_file ) ) {
					throw new U\Fatal_Exception( 'Failed to cleanup file: `' . $_file . '`.' );
				}
			}
		}
		foreach ( $this->temp_links as $_link ) {
			if ( U\Fs::exists( $_link ) ) {
				if ( 0 !== mb_stripos( $_link, $sys_temp ) || ! U\Fs::delete( $_link ) ) {
					throw new U\Fatal_Exception( 'Failed to cleanup link: `' . $_link . '`.' );
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
	 * Gets a temporary directory path.
	 *
	 * @since 2021-12-15
	 *
	 * @return string Temporary directory path only; i.e., does not exist.
	 */
	protected function temp_dir_path() : string {
		$dir               = U\Dir::make_unique_path();
		$this->temp_dirs[] = $dir;

		return $dir;
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
					U\Dir::make( U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/dir-' . $___i ) );
					for ( $_j = 1; $_j <= $population_multiplier; $_j++ ) {
						U\File::make( U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/file-' . $___i . '.' . $_j ) );
					}
				}
			}
		}
		return $dir;
	}

	/**
	 * Gets a temporary directory containing circular links.
	 *
	 * @since 2021-12-15
	 *
	 * @param int $population_multiplier  Optional population multiplier.
	 *                                    Default is `1`. Upper limit is `5`.
	 *
	 * @return string Absolute path to temporary directory.
	 *
	 * @uses  temp_dir() To create the temporary directory structure.
	 */
	protected function temp_dir_circular_links( int $population_multiplier = 1 ) : string {
		$population_multiplier = min( max( 1, $population_multiplier ), 5 );
		$dir                   = $this->temp_dir( true, $population_multiplier );

		for ( $_i = 1; $_i <= $population_multiplier; $_i++ ) {
			U\Fs::make_link(
				U\Dir::join( $dir, '/dir-' . $_i ),
				U\Dir::join( $dir, '/dir-' . $_i . '/cir-link-1up' )
			);
			U\Fs::make_link( $dir, U\Dir::join( $dir, '/dir-' . $_i . '/cir-link-2up' ) );

			for ( $__i = 1; $__i <= $population_multiplier; $__i++ ) {
				U\Fs::make_link(
					U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i ),
					U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/cir-link-1up' )
				);
				U\Fs::make_link(
					U\Dir::join( $dir, '/dir-' . $_i ),
					U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/cir-link-2up' )
				);
				U\Fs::make_link( $dir, U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/cir-link-3up' ) );

				for ( $___i = 1; $___i <= $population_multiplier; $___i++ ) {
					U\Fs::make_link(
						U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/dir-' . $___i ),
						U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/dir-' . $___i . '/cir-link-1up' )
					);
					U\Fs::make_link(
						U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i ),
						U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/dir-' . $___i . '/cir-link-2up' )
					);
					U\Fs::make_link(
						U\Dir::join( $dir, '/dir-' . $_i ),
						U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/dir-' . $___i . '/cir-link-3up' )
					);
					U\Fs::make_link( $dir, U\Dir::join( $dir, '/dir-' . $_i . '/dir-' . $__i . '/dir-' . $___i . '/cir-link-4up' ) );
				}
			}
		}
		return $dir;
	}

	/**
	 * Gets a temporary file path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@see U\Dir::make_temp()}.
	 *
	 * @return string Temporary file path only; i.e., does not exist.
	 */
	protected function temp_file_path( string $ext = 'tmp', string $dir = '' ) : string {
		$file               = U\File::make_unique_path( $ext, $dir );
		$this->temp_files[] = $file;

		return $file;
	}

	/**
	 * Gets a temporary file.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@see U\Dir::make_temp()}.
	 *
	 * @return string Temporary file path.
	 */
	protected function temp_file( string $ext = 'tmp', string $dir = '' ) : string {
		$file               = U\File::make_temp( $ext, $dir );
		$this->temp_files[] = $file;

		return $file;
	}

	/**
	 * Gets a temporary link.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@see U\Dir::make_temp()}.
	 *
	 * @return string     Temporary link path.
	 */
	protected function temp_link( string $ext = 'tmp', string $dir = '' ) : string {
		$file = U\File::make_temp( $ext, $dir );
		$link = $this->temp_file_path( $ext, $dir );

		$this->temp_files[] = $file;
		$this->temp_links[] = $link;

		U\Fs::make_link( $file, $link );

		return $link;
	}

	/**
	 * Gets a broken temporary link.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@see U\Dir::make_temp()}.
	 *
	 * @return string Temporary broken link path.
	 */
	protected function temp_broken_link( string $ext = 'tmp', string $dir = '' ) : string {
		$file = U\File::make_temp( $ext, $dir );
		$link = $this->temp_file_path( $ext, $dir );

		$this->temp_files[] = $file;
		$this->temp_links[] = $link;

		U\Fs::make_link( $file, $link );
		U\Fs::delete( $file );

		return $link;
	}
}
