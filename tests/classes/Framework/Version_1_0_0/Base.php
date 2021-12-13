<?php
/** CLEVER CANYON™ <https://clevercanyon.com>
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
namespace Clever_Canyon\Utilities__Tests\Framework\Version_1_0_0;

/**
 * Dependencies.
 *
 * @since 1.0.0
 */
use Clever_Canyon\Utilities\OOPs\Version_1_0_0 as U;
use PHPUnit\Framework\{ TestCase as Base_TestCase };

/**
 * Base class for tests.
 *
 * @since 1.0.0
 */
abstract class Base extends Base_TestCase {
	use \Clever_Canyon\Utilities\OOP\Version_1_0_0\Traits\Cache;
	use \Clever_Canyon\Utilities\OOPs\Version_1_0_0\Traits\Cache;

	/**
	 * Fires before the first method is run.
	 *
	 * @since 1.0.0
	 */
	public static function setUpBeforeClass() : void {
		parent::setUpBeforeClass();
		static::static_cache_clear();
	}

	/**
	 * Fires after the last method is run.
	 *
	 * @since 1.0.0
	 */
	public static function tearDownAfterClass() : void {
		parent::tearDownAfterClass();
		static::static_cache_clear();
	}

	/**
	 * Counter.
	 *
	 * @since 1.0.0
	 */
	protected int $counter;

	/**
	 * Temp directories.
	 *
	 * @since 1.0.0
	 */
	protected array $temp_dirs;

	/**
	 * Temp files.
	 *
	 * @since 1.0.0
	 */
	protected array $temp_files;

	/**
	 * Fires before each method is run.
	 *
	 * @since 1.0.0
	 *
	 * @internal See <https://phpunit.readthedocs.io/en/9.5/fixtures.html>
	 */
	protected function setUp() :void {
		parent::setUp();

		$this->counter    = 0;
		$this->temp_dirs  = [];
		$this->temp_files = [];
	}

	/**
	 * Fires after each method is run.
	 *
	 * @since 1.0.0
	 *
	 * @internal See <https://phpunit.readthedocs.io/en/9.5/fixtures.html>
	 */
	protected function tearDown() :void {
		parent::tearDown();

		foreach ( $this->temp_dirs as $_dir ) {
			if ( file_exists( $_dir ) ) {
				U\Fs::delete( $_dir );
			}
		}
		foreach ( $this->temp_files as $_file ) {
			if ( file_exists( $_file ) ) {
				U\Fs::delete( $_file );
			}
		}
	}

	/**
	 * Increments and gets counter.
	 *
	 * @since 1.0.0
	 *
	 * @return int Counter.
	 */
	protected function counter() : int {
		return ++$this->counter;
	}

	/**
	 * Gets a temp dir.
	 *
	 * @since 1.0.0
	 *
	 * @param  bool $populate Populate? Defaults to `false`.
	 *
	 * @return string         Temp file path.
	 */
	protected function temp_dir( bool $populate = false ) : string {
		$dir               = U\Dir::temp();
		$this->temp_dirs[] = $dir;

		for ( $_i = 1; $_i <= 1 && $populate; $_i++ ) {
			mkdir( $dir . '/dir-' . $_i );
			touch( $dir . '/file-' . $_i . '.txt' );

			for ( $__i = 1; $__i <= 1; $__i++ ) {
				mkdir( $dir . '/dir-' . $_i . '/dir-' . $__i );
				touch( $dir . '/dir-' . $_i . '/file-' . $__i . '.txt' );

				for ( $___i = 1; $___i <= 1; $___i++ ) {
					touch( $dir . '/dir-' . $_i . '/dir-' . $__i . '/file-' . $___i . '.txt' );
				}
			}
		}
		return $dir;
	}

	/**
	 * Gets a temp file.
	 *
	 * @since 1.0.0
	 *
	 * @param string $ext File extension.
	 * @param string $dir Directory. Defaults to {@link U\Dir::temp()}.
	 *
	 * @return string     Temp file path.
	 */
	protected function temp_file( string $ext = 'tmp', string $dir = '' ) : string {
		$file               = U\File::temp( $ext, $dir );
		$this->temp_files[] = $file;

		return $file;
	}
}
