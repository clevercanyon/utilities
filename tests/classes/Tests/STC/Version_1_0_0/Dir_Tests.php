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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities__Tests\Tests\STC\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\STC\Version_1_0_0\Dir
 */
final class Dir_Tests extends \Clever_Canyon\Utilities__Tests\Framework\Version_1_0_0\A7s_Tests {
	/**
	 * @covers ::join()
	 */
	public function test_join() : void {
		foreach ( [
			// Basics covered?

			[ '' => [ '' ] ],
			[ '0' => [ '0' ] ],
			[ '/0' => [ '/0' ] ],

			[ '.' => [ '.' ] ],
			[ '.' => [ './' ] ],
			[ '.' => [ './/' ] ],

			[ '/' => [ '/' ] ],
			[ '//' => [ '//' ] ],
			[ '/' => [ '\\' ] ],
			[ '//' => [ '\\\\' ] ],

			[ '/foo' => [ '/foo' ] ],
			[ '//foo' => [ '//foo' ] ],
			[ '/foo' => [ '/foo/' ] ],
			[ '/foo' => [ '/', 'foo//' ] ],
			[ '/foo/bar' => [ '/foo', '/bar' ] ],
			[ '/foo/bar' => [ '/foo/', '/bar//' ] ],

			[ '/foo/bar' => [ '\\foo', '\\bar' ] ],
			[ '/foo/bar' => [ '\\foo\\', '\\bar\\\\' ] ],

			[ '/foo/bar' => [ '\\foo\\bar' ] ],
			[ '//foo/bar' => [ '//\\foo//', '\\\\//bar//\\\\' ] ],

			[ 'c:/foo/bar' => [ 'C:\\', 'foo\\bar\\' ] ],
			[ 'c:/foo/bar' => [ 'C:\\', 'foo\\\\bar\\\\' ] ],

			[ 'c:/foo/bar' => [ 'C:\\foo/', '\\/bar/\\/' ] ],
			[ 'c:/foo/bar' => [ 'C:\\foo//', '\\//\\bar//\\//\\//' ] ],

			// Forces all paths to be separated by a slash?

			[ '/foo/bar/baz' => [ '/foo', 'bar', 'baz' ] ],
			[ '/foo/../bar/../baz' => [ '/foo', '../bar', '../baz' ] ],

			// Works with or without a root slash?

			[ 'foo/bar/baz' => [ 'foo', '/bar', '/baz' ] ],
			[ '../foo/bar/baz' => [ '../foo', '/bar', '/baz' ] ],
			[ '/foo/bar/baz' => [ '/foo', '/bar', '/baz' ] ],

			// Works with stream wrappers?

			[ 'c:/foo' => [ 'c://', 'foo' ] ],                // `:/` (one slash) is intended behavior in this wrapper.
			[ 'c:/foo' => [ 'c://', '/foo' ] ],               // ↑.
			[ 'c:/foo' => [ 'c:////', '///foo//' ] ],         // ↑.

			[ 'file:///foo' => [ 'file://', 'foo' ] ],        // `:///` (three slashes) is intended behavior in this wrapper.
			[ 'file:///foo' => [ 'file://', '/foo' ] ],       // ↑.
			[ 'file:///foo' => [ 'file:////', '///foo//' ] ], // ↑.

			[ 'file:///foo' => [ 'file://foo' ] ],            // `://` (two slashes) not possible (would break) in this wrapper.
			[ 'file:///foo/bar' => [ 'file://foo', 'bar' ] ], // ↑.
			[ 'file:/foo' => [ 'file:/', 'foo' ] ],           // ↑.
			[ 'file://' => [ 'file://' ] ],                   // ← An exception is when there is no `$path`. {@see U\Fs::normalize()}.

			[ 'foo:///bar' => [ 'foo://', 'bar' ] ],          // `:///` (three slashes) is intended behavior in arbitrary wrappers.
			[ 'foo:///bar' => [ 'foo://', '/bar' ] ],         // ↑.
			[ 'foo:///bar' => [ 'foo:////', '///bar//' ] ],   // ↑.

			[ 'foo://bar' => [ 'foo://bar' ] ],               // `://` (two slashes) ... we can get only two by calling differently.
			[ 'foo://bar/baz' => [ 'foo://bar', 'baz' ] ],    // ↑.
			[ 'foo:/bar' => [ 'foo:/', 'bar' ] ],             // ← Works also, but please don't do it! ... makes code highly ambigous!
		] as $_assertion
		) {
			$_expecting = (string) array_keys( $_assertion )[ 0 ];
			$_paths     = array_values( $_assertion )[ 0 ];

			$this->assertSame( $_expecting, U\Dir::join( ...$_paths ), $this->message( $_expecting . '=>' . implode( ',', $_paths ) ) );
		}
	}

	/**
	 * @covers ::join_ets()
	 */
	public function test_join_ets() : void {
		foreach ( [
			// Basics covered?

			[ '' => [ '' ] ],
			[ '0' => [ '0' ] ],
			[ '/0' => [ '/0' ] ],

			[ '.' => [ '.' ] ],
			[ '.' => [ './' ] ],
			[ '.' => [ './/' ] ],

			[ '/' => [ '/' ] ],
			[ '//' => [ '//' ] ],
			[ '/' => [ '\\' ] ],
			[ '//' => [ '\\\\' ] ],
			[ '/' => [ '/', '/' ] ],
			[ '/' => [ '/', '/', '/' ] ],
			[ '/./' => [ '/', '/', '/.', '/' ] ],
			[ '/../' => [ '/', '/', '/..', '/' ] ],

			[ '/foo' => [ '/foo' ] ],
			[ '//foo' => [ '//foo' ] ],
			[ '/foo' => [ '/foo/' ] ],
			[ '/foo' => [ '/', 'foo//' ] ],
			[ '/foo/bar' => [ '/foo', '/bar' ] ],
			[ '/foo/bar' => [ '/foo/', '/bar//' ] ],

			[ '/foo/bar' => [ '\\foo', '\\bar' ] ],
			[ '/foo/bar' => [ '\\foo\\', '\\bar\\\\' ] ],

			[ '/foo/bar' => [ '\\foo\\bar' ] ],
			[ '//foo/bar' => [ '//\\foo//', '\\\\//bar//\\\\' ] ],

			[ 'c:/foo/bar' => [ 'C:\\', 'foo\\bar\\' ] ],
			[ 'c:/foo/bar' => [ 'C:\\', 'foo\\\\bar\\\\' ] ],

			[ 'c:/foo/bar' => [ 'C:\\foo/', '\\/bar/\\/' ] ],
			[ 'c:/foo/bar' => [ 'C:\\foo//', '\\//\\bar//\\//\\//' ] ],

			// Explicit trailing slash covered?

			[ '/foo/' => [ '/foo', '/' ] ],
			[ '//foo/' => [ '//foo', '/' ] ],
			[ '/foo/' => [ '/foo/', '/' ] ],
			[ '/foo/' => [ '/', 'foo//', '/' ] ],
			[ '/foo/bar/' => [ '/foo', '/bar', '/' ] ],
			[ '/foo/bar/' => [ '/foo/', '/bar//', '/' ] ],

			[ '/foo/bar/' => [ '\\foo', '\\bar', '/' ] ],
			[ '/foo/bar/' => [ '\\foo\\', '\\bar\\\\', '/' ] ],

			[ '/foo/bar/' => [ '\\foo\\bar', '/' ] ],
			[ '//foo/bar/' => [ '//\\foo//', '\\\\//bar//\\\\', '/' ] ],

			[ 'c:/foo/bar/' => [ 'C:\\', 'foo\\bar\\', '/' ] ],
			[ 'c:/foo/bar/' => [ 'C:\\', 'foo\\\\bar\\\\', '/' ] ],

			[ 'c:/foo/bar/' => [ 'C:\\foo/', '\\/bar/\\/', '/' ] ],
			[ 'c:/foo/bar/' => [ 'C:\\foo//', '\\//\\bar//\\//\\//', '/' ] ],

			// Forces all paths to be separated by a slash?
			// Explicit trailing slash covered?

			[ '/foo/bar/baz/' => [ '/foo', 'bar', 'baz', '/' ] ],
			[ '/foo/../bar/../baz/' => [ '/foo', '../bar', '../baz', '/' ] ],

			// Works with or without a root slash?
			// Explicit trailing slash covered?

			[ 'foo/bar/baz/' => [ 'foo', '/bar', '/baz', '/' ] ],
			[ '../foo/bar/baz/' => [ '../foo', '/bar', '/baz', '/' ] ],
			[ '/foo/bar/baz/' => [ '/foo', '/bar', '/baz', '/' ] ],

			// Works with stream wrappers?
			// Explicit trailing slash covered?

			[ 'c:/foo/' => [ 'c://', 'foo', '/' ] ],                   // `:/` (only one slash) is intended behavior in this wrapper.
			[ 'c:/foo/' => [ 'c://', '/foo', '/' ] ],                  // ↑.
			[ 'c:/foo/' => [ 'c:////', '///foo//', '/' ] ],            // ↑.

			[ 'file:///foo/' => [ 'file://', 'foo', '/' ] ],           // `:///` (three slashes) is intended behavior in this wrapper.
			[ 'file:///foo/' => [ 'file://', '/foo', '/' ] ],          // ↑.
			[ 'file:///foo/' => [ 'file:////', '///foo//', '/' ] ],    // ↑.

			[ 'file:///foo/' => [ 'file://foo', '/' ] ],               // `://` (two slashes) not possible (would break) in this wrapper.
			[ 'file:///foo/bar/' => [ 'file://foo', 'bar', '/' ] ],    // ↑.
			[ 'file:///foo/' => [ 'file://', '//foo', '/' ] ],         // ↑.
			[ 'file://' => [ 'file://' ] ],                            // ← An exception is when there is no `$path`. {@see U\Fs::normalize()}.

			[ 'foo:///bar/' => [ 'foo://', 'bar', '/' ] ],             // `:///` (three slashes) is intended behavior in arbitrary wrappers.
			[ 'foo:///bar/' => [ 'foo://', '/bar', '/' ] ],            // ↑.
			[ 'foo:///bar/' => [ 'foo:////', '///bar//', '/' ] ],      // ↑.

			[ 'foo://bar/' => [ 'foo://bar', '/' ] ],                   // `://` (two slashes) ... we can get only two by calling differently.
			[ 'foo://bar/baz/' => [ 'foo://bar', 'baz', '/' ] ],        // ↑.

			[ 'foo://' => [ 'foo://', '/' ] ],                          // Does not add trailing slash to what is nothing but wrappers.
			[ 'foo://bar://' => [ 'foo://bar://', '/' ] ],              // ↑.
			[ 'foo://bar://baz://' => [ 'foo://bar://baz://', '/' ] ],  // ↑.
		] as $_assertion
		) {
			$_expecting = (string) array_keys( $_assertion )[ 0 ];
			$_paths     = array_values( $_assertion )[ 0 ];

			$this->assertSame( $_expecting, U\Dir::join_ets( ...$_paths ), $this->message( $_expecting . '=>' . implode( ',', $_paths ) ) );
		}
	}

	/**
	 * @covers ::name()
	 */
	public function test_name() : void {
		foreach ( [
			// Basics covered?

			[ '' => [ '' ] ],
			[ '.' => [ '0' ] ],
			[ '/' => [ '/0' ] ],

			[ '.' => [ '.' ] ],
			[ '.' => [ './' ] ],
			[ '.' => [ './/' ] ],
			[ '.' => [ 'foo/' ] ],
			[ '.' => [ 'foo' ] ],

			[ '/' => [ '/' ] ],
			[ '/' => [ '//' ] ],

			[ '/' => [ '/foo' ] ],
			[ '/' => [ '//foo' ] ],
			[ '/' => [ '/foo/' ] ],
			[ '/foo' => [ '/foo/bar' ] ],
			[ '/foo' => [ '/foo//bar//' ] ],

			[ '/' => [ '\\' ] ],
			[ '/' => [ '\\\\' ] ],

			[ '/foo' => [ '\\foo\\bar' ] ],
			[ '/foo' => [ '\\foo\\\\bar\\\\' ] ],

			[ '/foo' => [ '\\foo\\bar' ] ],
			[ '//foo' => [ '//\\foo//\\\\//bar//\\\\' ] ],

			[ 'c:/foo' => [ 'C:\\foo\\bar\\' ] ],
			[ 'c:/foo' => [ 'C:\\foo\\\\bar\\\\' ] ],

			[ 'c:/foo' => [ 'C:\\foo/\\/bar/\\/' ] ],
			[ 'c:/foo' => [ 'C:\\foo//\\//\\bar//\\//\\//' ] ],

			// Do levels + paths work properly?

			[ '/foo/bar/baz/coo/cuz/foo' => [ '/foo/bar/baz/coo/cuz/caz', 1, '/foo' ] ],
			[ '/foo/bar/baz/coo/foo' => [ '/foo/bar/baz/coo/cuz/caz', 2, '/foo' ] ],

			[ '/foo/bar/baz/coo/cuz/foo' => [ '/foo/bar/baz/coo/cuz/caz', 1, 'foo' ] ],
			[ '/foo/bar/baz/coo/foo' => [ '/foo/bar/baz/coo/cuz/caz', 2, 'foo' ] ],

			// Trying to go up `0` levels will not work, correct? It's forced to `1` or higher.

			[ '/foo/bar/baz/coo/cuz/foo' => [ '/foo/bar/baz/coo/cuz/caz', 0, '/foo' ] ],
			[ '/foo/bar/baz/coo/cuz/foo' => [ '/foo/bar/baz/coo/cuz/caz', 0, 'foo' ] ],
		] as $_assertion
		) {
			$_expecting    = (string) array_keys( $_assertion )[ 0 ];
			$_levels_paths = array_values( $_assertion )[ 0 ];

			$this->assertSame( $_expecting, U\Dir::name( ...$_levels_paths ), $this->message( $_expecting . '=>' . implode( ',', $_levels_paths ) ) );
		}
	}

	/**
	 * @covers ::subpath()
	 */
	public function test_subpath() : void {
		foreach ( [
			// Basics covered?

			[ '' => [ '', '' ] ],
			[ '' => [ '0', '0' ] ],
			[ '' => [ '/0', '/0' ] ],

			[ '' => [ '.', '.' ] ],
			[ '' => [ './', './' ] ],
			[ '' => [ './/', './/' ] ],
			[ '' => [ 'foo/', 'foo/' ] ],
			[ '' => [ 'foo', 'foo' ] ],

			[ '' => [ '/', '/' ] ],
			[ '' => [ '//', '//' ] ],

			[ '' => [ '/foo', '/foo' ] ],
			[ '' => [ '//foo', '//foo' ] ],
			[ '' => [ '/foo/', '/foo/' ] ],

			[ 'bar' => [ '/foo', '/foo/bar' ] ],
			[ 'foo/bar' => [ '/', '/foo/bar' ] ],
			[ 'foo/bar' => [ '/', '/foo/bar/' ] ],
			[ 'foo/bar' => [ '/', '/foo//bar//' ] ],

			[ '' => [ '\\', '\\' ] ],
			[ '' => [ '\\\\', '\\\\' ] ],

			[ 'bar' => [ '/foo', '\\foo\\bar' ] ],
			[ 'bar' => [ '/foo', '\\foo\\\\bar\\\\' ] ],

			[ 'bar' => [ '/foo/', '\\foo\\bar' ] ],
			[ 'bar' => [ '//foo', '//\\foo//\\\\//bar//\\\\' ] ],

			[ 'bar' => [ 'C:\\foo', 'C:\\foo\\bar\\' ] ],
			[ 'foo/bar' => [ 'C:/', 'C:\\foo\\\\bar\\\\' ] ],

			[ 'foo/bar' => [ 'C:/', 'C:\\foo/\\/bar/\\/' ] ],
			[ 'bar' => [ 'C://foo', 'C:\\foo//\\//\\bar//\\//\\//' ] ],

			// Is it working well with stream wrappers?

			[ 'bar' => [ 'foo://', 'foo://bar' ] ],
			[ 'bar' => [ 'file://', 'file://bar' ] ],
			[ 'bar' => [ 'file://foo://', 'file://foo://bar' ] ],

			[ 'bar/baz' => [ 'foo://', 'foo://bar/baz' ] ],
			[ 'baz/coo.x' => [ 'foo://bar://', 'foo://bar://baz/coo.x' ] ],
			[ 'x.x' => [ 'foo://bar/baz/coo/caz/cuz', 'foo://bar/baz/coo/caz/cuz/x.x' ] ],

			// UTF-8 characters work well?

			[ '🦠/coo.x' => [ 'foo://bar://baz/', 'foo://bar://baz/🦠/coo.x' ] ],
			[ '🐝x.x🔧' => [ 'foo:/🔧bar/🔧baz/coo/caz/cuz', 'foo:/🔧bar/🔧baz/coo/caz/cuz/🐝x.x🔧' ] ],
		] as $_assertion
		) {
			$_expecting = (string) array_keys( $_assertion )[ 0 ];
			$_args      = array_values( $_assertion )[ 0 ];

			$this->assertSame( $_expecting, U\Dir::subpath( ...$_args ), $this->message( $_expecting . '=>' . implode( ',', $_args ) ) );
		}
	}

	/**
	 * @covers ::make()
	 */
	public function test_make() : void {
		$temp_dir = $this->temp_dir();

		$this->assertSame( true, U\Dir::make( U\Dir::join( $temp_dir, U\Crypto::uuid_v4() ) ), $this->message() );
		$this->assertSame( true, U\Dir::make( U\Dir::join( $temp_dir, U\Crypto::uuid_v4(), U\Crypto::uuid_v4() ) ), $this->message() );

		$this->assertSame( true, U\Dir::make( U\Dir::join( $temp_dir, '/foo/bar' ) ), $this->message() );
		$this->assertSame( false, U\Dir::make( U\Dir::join( $temp_dir, '/foo/bar' ) ), $this->message() );
	}

	/**
	 * @covers ::make_temp()
	 */
	public function test_make_temp() : void {
		$temp_dir = $this->temp_dir();

		$this->assertSame( true, is_dir( U\Dir::make_temp( $temp_dir ) ), $this->message() );
	}

	/**
	 * @covers ::sys_temp()
	 */
	public function test_sys_temp() : void {
		$this->assertSame( true, is_dir( U\Dir::sys_temp() ), $this->message() );
	}

	/**
	 * @covers ::prune()
	 * @covers ::iterator()
	 */
	public function test_prune() : void {
		$remaining_resources = 0; // Initialize.
		$temp_dir            = $this->temp_dir( true );

		$this->assertSame( true, is_dir( $temp_dir ), $this->message() );
		$this->assertSame( true, U\Dir::prune( $temp_dir, [ '/.*/ui' ] ), $this->message() );

		/** @noinspection PhpUnusedLocalVariableInspection */
		foreach ( U\Dir::iterator( $temp_dir ) as $_resource ) {
			$remaining_resources++;
		}
		$this->assertSame( 0, $remaining_resources, $this->message() );
	}
}
