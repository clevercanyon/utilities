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
namespace Clever_Canyon\Utilities__Tests\Tests\STC;

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
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\STC\Fs
 */
final class Fs_Tests extends \Clever_Canyon\Utilities__Tests\Framework\A7s_Tests {
	/**
	 * @covers ::normalize()
	 * @covers ::wrappers()
	 * @covers ::split_wrappers()
	 */
	public function test_normalize() : void {
		foreach ( [
			// Basics covered?

			[ '' => '' ],
			[ '0' => '0' ],
			[ '/0' => '/0' ],

			[ '.' => '.' ],
			[ '.' => './' ],
			[ '.' => './/' ],

			[ '/' => '/' ],
			[ '//' => '//' ],
			[ '/' => '\\' ],
			[ '//' => '\\\\' ],

			[ '/foo' => '/foo' ],
			[ '//foo' => '//foo' ],
			[ '/foo' => '/foo/' ],
			[ '/foo' => '/foo//' ],
			[ '/foo/bar' => '/foo/bar' ],
			[ '/foo/bar' => '/foo//bar//' ],

			[ '/foo/bar' => '\\foo\\bar' ],
			[ '/foo/bar' => '\\foo\\\\bar\\\\' ],

			[ '/foo/bar' => '\\foo\\bar' ],
			[ '//foo/bar' => '//\\foo//\\\\//bar//\\\\' ],

			[ 'c:/foo/bar' => 'C:\\foo\\bar\\' ],
			[ 'c:/foo/bar' => 'C:\\foo\\\\bar\\\\' ],

			[ 'c:/foo/bar' => 'C:\\foo/\\/bar/\\/' ],
			[ 'c:/foo/bar' => 'C:\\foo//\\//\\bar//\\//\\//' ],

			// Trailing slashes are removed?

			[ '/foo' => '/foo///' ],
			[ '/foo' => '/foo////' ],
			[ '/foo/bar' => '/foo/bar////' ],

			[ 'c:/foo' => 'C:\\foo\\\\\\' ],
			[ 'c:/foo' => 'C:\\foo\\\\\\\\' ],
			[ 'c:/foo/bar' => 'C:\\foo\\bar\\\\\\\\' ],

			// Paths are caSe-sensitive?

			[ '/foo' => '/foo' ],
			[ '//Foo' => '//Foo' ],
			[ '/foO' => '/foO/' ],
			[ '/fOo' => '/fOo//' ],

			[ '/foo/bAr' => '/foo/bAr' ],
			[ '/foo/Bar' => '/foo//Bar//' ],

			[ '/foo/bar' => '\\foo\\bar' ],
			[ '/Foo/bar' => '\\Foo\\\\bar\\\\' ],

			[ 'c:/foo/bar' => 'C:\\foo\\bar\\' ],
			[ 'c:/foo/bar' => 'c:\\foo\\\\bar\\\\' ],
			[ 'c:/foo/bar' => 'c:\\foo\\\\bar\\\\' ],

			// Wrappers preserved?

			[ 'foo://' => 'foo://' ],
			[ 'foo://bar' => 'foo://bar' ],
			[ 'foo://bar' => 'foo://bar/' ],
			[ 'foo://bar' => 'foo://bar//' ],

			[ 'foo://bar://baz' => 'foo://bar://baz' ],
			[ 'foo://bar://baz' => 'foo://bar://baz/' ],
			[ 'foo://bar://baz' => 'foo://bar://baz//' ],

			[ 'c:/' => 'C:\\' ],
			[ 'c:/foo/bar' => 'C:\\foo\\bar\\' ],
			[ 'c:/foo/bar' => 'C:\\foo\\bar\\\\' ],

			[ 'c:/foo:/bar/baz' => 'C:\\foo:\\\\bar\\baz' ],
			[ 'c:/foo:/bar/baz' => 'C:\\foo:\\\\bar\\baz\\' ],
			[ 'c:/foo:/bar/baz' => 'C:\\foo:\\\\bar\\baz\\\\' ],

			// A wrapper is invalid if it contains invalid chars?

			[ 'foo/:bar:' => 'foo//:bar:////' ],                 // The `foo//:` part is not a valid wrapper.
			[ 'foo://bar://baz/:' => 'foo://bar://baz//:////' ], // The `baz//:` part is not a valid wrapper.

			// A wrapper sequence is invalid (i.e., broken) at the point where it has too many or not enough slashes?

			[ 'file:/foo:' => 'file:/foo:///' ],                  // The `file:/` part is not a valid wrapper.
			[ 'foo:bar:' => 'foo:bar:////' ],                     // `foo:` is not a valid wrapper, therefore `bar://` isn't either.
			[ 'file:///foo:' => 'file:///foo:////' ],             // The `file://` part is a valid wrapper, but then `/foo://` is not.
			[ 'file:///foo:' => 'file:///foo:/' ],                // The `file://` part is a valid wrapper, but then `/foo:/` is not.
			[ 'c:/foo:' => 'C://foo:///' ],                       // The `C:/` part is a valid wrapper, but then `/foo://` is not.

			[ 'c:/' => 'C:/' ],
			[ 'c:/' => 'C://' ],
			[ 'c:/' => 'C:///' ],
			[ 'foo:///bar:' => 'foo:////bar://' ],

			// A root-reference slash is preserved?

			[ 'file:///' => 'file:///' ],                        // The `file://` wrapper is the same as no wrapper.
			[ 'file:///' => 'file:////' ],                       // ↑.
			[ 'file:///' => 'file://///' ],                      // ↑.

			[ 'foo://file:///' => 'foo://file:///' ],            // The `file://` wrapper is the same as no wrapper.
			[ 'foo://file:///' => 'foo://file:////' ],           // ↑.
			[ 'foo://file:///' => 'foo://file://///' ],          // ↑.

			[ 'foo:///' => 'foo:///' ],                          // An `[arbitrary]://` wrapper is allowed to have a root-reference slash.
			[ 'foo:///' => 'foo:////' ],                         // ↑.
			[ 'foo:///' => 'foo://///' ],                        // ↑.

			[ 'file://foo:///' => 'file://foo:///' ],            // An `[arbitrary]://` wrapper is allowed to have a root-reference slash.
			[ 'file://foo:///' => 'file://foo:////' ],           // ↑.
			[ 'file://foo:///' => 'file://foo://///' ],          // ↑.

			// A root-reference slash is preserved?

			[ 'file:///' => 'file:////' ],
			[ 'glob:///' => 'glob:////' ],

			[ 'ftp:///' => 'ftp:////' ],
			[ 'ftps:///' => 'ftps:////' ],

			[ 'ogg:///' => 'ogg:////' ],
			[ 'glob:///' => 'glob:////' ],

			[ 'ssh2.scp:///' => 'ssh2.scp:////' ],
			[ 'ssh2.exec:///' => 'ssh2.exec:////' ],
			[ 'ssh2.sftp:///' => 'ssh2.sftp:////' ],
			[ 'ssh2.shell:///' => 'ssh2.shell:////' ],

			[ 'rar:///' => 'rar:////' ],
			[ 'zip:///' => 'zip:////' ],
			[ 'phar:///' => 'phar:////' ],
			[ 'zlib:///' => 'zlib:////' ],
			[ 'compress.zlib:///' => 'compress.zlib:////' ],
			[ 'compress.bzip2:///' => 'compress.bzip2:////' ],

			[ 'foo:///' => 'foo:////' ],
			[ 'foo-bar:///' => 'foo-bar:////' ],
			[ 'foo.bar:///' => 'foo.bar:////' ],
			[ 'foo://bar:///' => 'foo://bar:////' ],

			// A root-reference slash is NOT preserved?

			[ 'a:/' => 'a:\\\\' ],
			[ 'b:/' => 'B:\\\\' ],
			[ 'c:/' => 'C:\\\\' ],
			[ 'd:/' => 'D:\\\\' ],
			[ 'e:/' => 'e:\\\\' ],

			[ 's3://' => 's3:///' ],
			[ 'http://' => 'http:///' ],
			[ 'data://' => 'data:///' ],

			[ 'ssh2.tunnel://' => 'ssh2.tunnel:///' ],

			[ 'php://' => 'php:///' ],
			[ 'expect://' => 'expect:///' ],

			// Path info preserved?

			[ '/foo/bar.php/path/info' => '/foo///bar.php///path///info' ],
			[ '/foo/bar/.php/path/info' => '/foo///bar//.php///path///info/' ],

			[ '/foo/bar.php/path/info~' => '/foo///bar.php///path///info~' ],
			[ '/foo/bar/.php/path/info/~' => '/foo///bar//.php///path///info/~' ],

			// Relative paths preserved?

			[ 'foo://.' => 'foo://./' ],
			[ '../../../../..' => '..///..////..//////..////////..//////////' ],
			[ './../../../../.' => './//..////..//////..////////..//////////./' ],

			[ '../foo/../bar../../..' => '..///foo///..////bar..//////..////////..//////////' ],
			[ './foo/../../../bar/../.' => './//foo/..////..//////../bar///////..//////////./' ],
			[ '../foo../bar../../..' => '..///foo..////bar..//////..////////..//////////' ],

			// UTF-8 characters preserved?

			[ '/🔧' => '/🔧///' ],
			[ '/:🦠' => '/:🦠///' ],
			[ '/🐝:' => '/🐝:///' ],
			[ '/🔧foo🐝/bar🦠' => '/🔧foo🐝//bar🦠//' ],
			[ '/🐝🦠foo/🦠bar' => '\\🐝🦠foo\\\\🦠bar\\\\' ],
			[ 'c:/🔧foo🦠/bar🐝' => 'C:\\🔧foo🦠\\\\bar🐝\\\\' ],
			[ '/🐝™/™/®®/©©©/🔧.php' => '/🐝™/™/®®/©©©/🔧.php' ],
			[ '//🦠🐝/🔧🦠/🔧🐝™®©.php' => '//🦠🐝//🔧🦠//🔧🐝™®©.php' ],
			[ '🐝file:///🔧foo🦠/bar🐝' => '🐝file:\\\\\\\\\\🔧foo🦠\\\\bar🐝\\\\' ],
			[ '🔧foo://file:///🔧foo🐝/bar🦠' => '🔧foo://file:\\\\\\\\\\🔧foo🐝\\\\bar🦠\\\\' ],
		] as $_assertion
		) {
			$_expecting = (string) array_keys( $_assertion )[ 0 ];
			$_path      = array_values( $_assertion )[ 0 ];

			$this->assertSame( $_expecting, U\Fs::normalize( $_path ), $this->message( $_expecting . '=>' . $_path ) );
		}
	}

	/**
	 * @covers ::wrappers()
	 * @covers ::split_wrappers()
	 */
	public function test_wrappers() : void {
		foreach ( [
			// Basics covered?

			[ '' => '' ],
			[ '' => '0' ],
			[ '' => '/0' ],

			[ '' => '/' ],
			[ '' => '/foo' ],
			[ '' => '/foo/bar' ],

			[ '' => '\\foo' ],
			[ '' => '\\foo\\bar' ],
			[ '' => '\\foo\\\\bar\\\\' ],

			[ 'c:' => 'C:/foo' ],
			[ 'c:' => 'C://foo' ],
			[ 'c:' => 'C:///foo' ],
			[ 'c:' => 'C:////foo' ],

			[ '0://' => '0://' ],
			[ 'foo://' => 'foo://' ],
			[ 'foo://' => 'foo://bar' ],
			[ 'foo://bar://' => 'foo://bar://baz' ],
			[ 'foo://bar://baz://' => 'foo://bar://baz://foo' ],

			// Drive letters.

			[ 'a:' => 'a:\\foo' ],
			[ 'b:' => 'B:\\foo' ],
			[ 'c:' => 'C:\\foo' ],
			[ 'd:' => 'D:\\foo' ],
			[ 'e:' => 'e:\\foo' ],

			// Protocols.

			[ 'file://' => 'file://foo' ],

			[ 'http://' => 'http://foo' ],
			[ 'data://' => 'data://foo' ],

			[ 'ftp://' => 'ftp://foo' ],
			[ 'ftps://' => 'ftps://foo' ],

			[ 'ssh2.scp://' => 'ssh2.scp://foo' ],
			[ 'ssh2.exec://' => 'ssh2.exec://foo' ],
			[ 'ssh2.sftp://' => 'ssh2.sftp://foo' ],
			[ 'ssh2.shell://' => 'ssh2.shell://foo' ],
			[ 'ssh2.tunnel://' => 'ssh2.tunnel://foo' ],

			// Command-driven.

			[ 'php://' => 'php://foo' ],
			[ 'expect://' => 'expect://foo' ],

			// Format specifiers.

			[ 'glob://' => 'glob://foo' ],

			// Stream wrappers.

			[ 'ogg://' => 'ogg://foo' ],
			[ 'rar://' => 'rar://foo' ],
			[ 'zip://' => 'zip://foo' ],
			[ 'phar://' => 'phar://foo' ],
			[ 'zlib://' => 'zlib://foo' ],
			[ 'compress.zlib://' => 'compress.zlib://foo' ],
			[ 'compress.bzip2://' => 'compress.bzip2://foo' ],

			// Windows drive letters?

			[ 'c:' => 'C:\\foo' ],
			[ 'c:' => 'C:\\\\foo' ],
			[ 'c:' => 'C:\\//\\\\foo' ],
			[ 'c:' => 'C:\\//\\//\\foo' ],

			[ 'c:' => 'C:\\foo\\bar\\foo' ],
			[ 'c:' => 'C:\\foo\\\\bar\\\\foo' ],

			[ 'c:' => 'C:\\foo/\\/bar/\\/foo' ],
			[ 'c:' => 'C:\\foo//\\//\\bar//\\//\\//foo' ],

			// CaSe of wrappers is always lowercase?

			[ 'foo://' => 'fOo://foo' ],
			[ 'foo://' => 'Foo://foo' ],

			[ 'c:' => 'C:\\foo\\bar\\foo' ],
			[ 'c:' => 'c:\\foo\\\\bar\\\\foo' ],

			// UTF-8 characters preserved?

			[ '🔧://' => '🔧://foo' ],
			[ '™://' => '™://®®/©©©/🔧foo' ],
			[ '🔧🦠🐝://' => '🔧🦠🐝://🐝🔧/🐝foo' ],
			[ 'foo🔧🦠🐝://' => 'foo🔧🦠🐝://bar🐝' ],
			[ '🔧🦠🐝foo://' => '🔧🦠🐝foo://🔧🦠🐝bar' ],
			[ 'c🔧://' => 'C🔧:\\\\🔧foo🦠\\\\bar🦠\\\\' ],
			[ '🔧file://🔧foo🐝://' => '🔧file:\\\\🔧foo🐝:\\\\bar:🦠\\\\' ],
			[ '🦠foo://🔧🦠🐝file://' => '🦠foo://🔧🦠🐝file:\\\\🔧foo:🦠\\\\bar🐝\\\\' ],
		] as $_assertion
		) {
			$_expecting = (string) array_keys( $_assertion )[ 0 ];
			$_path      = array_values( $_assertion )[ 0 ];

			$wrappers_str   = U\Fs::wrappers( $_path );
			$wrappers_arr   = U\Fs::wrappers( $_path, 'array' );
			$split_wrappers = U\Fs::split_wrappers( $wrappers_str );

			$this->assertSame( $_expecting, $wrappers_str, $this->message( $_expecting . '=>' . $_path ) );
			$this->assertSame( $split_wrappers, $wrappers_arr, $this->message( $_expecting . '=>' . $_path ) );
		}
	}

	/**
	 * @covers ::path_exists()
	 */
	public function test_path_exists() : void {
		$this->assertSame( true, U\Fs::path_exists( __DIR__ ), $this->message() );
		$this->assertSame( true, U\Fs::path_exists( __FILE__ ), $this->message() );

		$this->assertSame( true, U\Fs::path_exists( $this->temp_link() ), $this->message() );
		$this->assertSame( true, ! file_exists( $this->temp_broken_link() ), $this->message() );
		$this->assertSame( true, U\Fs::path_exists( $this->temp_broken_link() ), $this->message() );
	}

	/**
	 * @covers ::type()
	 */
	public function test_type() : void {
		$this->assertSame( 'dir', U\Fs::type( $this->temp_dir() ), $this->message() );
		$this->assertSame( 'file', U\Fs::type( $this->temp_file() ), $this->message() );
		$this->assertSame( 'link', U\Fs::type( $this->temp_link() ), $this->message() );
		$this->assertSame( 'link', U\Fs::type( $this->temp_broken_link() ), $this->message() );
		$this->assertSame( '', U\Fs::type( $this->temp_file() . '.x-nonexistent-file' ), $this->message() );
	}

	/**
	 * @covers ::perms()
	 */
	public function test_perms() : void {
		$this->assertSame( '0700', U\Fs::perms( $this->temp_dir(), true ), $this->message() );
		$this->assertSame( '0600', U\Fs::perms( $this->temp_file(), true ), $this->message() );
		$this->assertSame( '0600', U\Fs::perms( $this->temp_link(), true ), $this->message() );
	}

	/**
	 * @covers ::copy()
	 */
	public function test_copy() : void {
		$this->assertSame( true, U\Fs::copy( $this->temp_dir(), $this->temp_dir() ), $this->message() );
		$this->assertSame( true, U\Fs::copy( $this->temp_dir( true ), $this->temp_dir( true ) ), $this->message() );
		$this->assertSame( true, U\Fs::copy( $this->temp_dir( true ), $this->temp_dir( true ), [], [], null, true ), $this->message() );
		$this->assertSame( true, U\Fs::copy( $this->temp_dir( true ), $this->temp_dir( true ), [], [], null, false ), $this->message() );
	}

	/**
	 * @covers ::copy_dir_contents()
	 */
	public function test_copy_dir_contents() : void {
		$this->assertSame( true, U\Fs::copy( U\Dir::join( $this->temp_dir( true ), '/*' ), $this->temp_dir( true ) ), $this->message() );
	}

	/**
	 * @covers ::zip()
	 */
	public function test_zip() : void {
		$this->assertSame( true, U\Fs::zip( $this->temp_dir( true ), $this->temp_file( 'zip' ) ), $this->message() );
		$this->assertSame( true, U\Fs::zip( $this->temp_dir( true ) . '->foo', $this->temp_file( 'zip' ) ), $this->message() );
		$this->assertSame( true, U\Fs::zip( $this->temp_file(), $this->temp_file( 'zip' ) ), $this->message() );
	}

	/**
	 * @covers ::delete()
	 */
	public function test_delete() : void {
		$this->assertSame( true, U\Fs::delete( $this->temp_dir(), false ), $this->message() );
		$this->assertSame( true, U\Fs::delete( $this->temp_dir( true ) ), $this->message() );
		$this->assertSame( true, U\Fs::delete( $this->temp_dir( true ), true ), $this->message() );
		$this->assertSame( true, U\Fs::delete( $this->temp_file() ), $this->message() );
		$this->assertSame( true, U\Fs::delete( $this->temp_link() ), $this->message() );
		$this->assertSame( true, U\Fs::delete( $this->temp_broken_link() ), $this->message() );
	}

	/**
	 * @covers ::gitignore_regexp()
	 */
	public function test_gitignore_regexp() : void {
		$gitignore_regexp = U\Fs::gitignore_regexp( 'negative' );

		foreach ( [
			'/.git'     => 'ignored',
			'/.svn'     => 'ignored',
			'/.git-dir' => 'ignored',

			'/._' => 'ignored',
			'/.#' => 'ignored',
			'/.~' => 'ignored',

			'/._xfoo/' => 'ignored',
			'/.#x/foo' => 'ignored',
			'/.~x/foo' => 'ignored',

			'/.idea/foo'   => 'ignored',
			'/.vscode/foo' => 'ignored',

			'/foo/node_modules/foo'         => 'ignored',
			'/foo/bar/bower_components/foo' => 'ignored',
			'/vendor/foo'                   => 'ignored',
			'/foo/bar/~'                    => 'ignored',
			'/foo/bar/baz.~/foo'            => 'ignored',

			'foo/node_modules/foo'         => 'ignored',
			'foo/bar/bower_components/foo' => 'ignored',
			'vendor/foo'                   => 'ignored',
			'foo/bar/~'                    => 'ignored',
			'foo/bar/baz.~/foo'            => 'ignored',

			'.'    => 'not-ignored',
			'/'    => 'not-ignored',
			''     => 'not-ignored',
			'/foo' => 'not-ignored',

			'/foo/bar/git'     => 'not-ignored',
			'/foo/bar/git-dir' => 'not-ignored',

			'foo/bar/baz/.foo'   => 'not-ignored',
			'.foo/.bar/.baz/foo' => 'not-ignored',

			'/foo/bar/baz/.gitignore'    => 'not-ignored',
			'/foo/bar/baz/.gitattributs' => 'not-ignored',
			'/foo/bar/baz/.gitmodules'   => 'not-ignored',
			'/foo/bar/baz/.gitchange'    => 'not-ignored',

			'foo/bar/baz/.gitignore'    => 'not-ignored',
			'foo/bar/baz/.gitattributs' => 'not-ignored',
			'foo/bar/baz/.gitmodules'   => 'not-ignored',
			'foo/bar/baz/.gitchange'    => 'not-ignored',

			'/foo/bar/baz/package.json'  => 'not-ignored',
			'/foo/bar/baz/composer.json' => 'not-ignored',
		] as $_path => $_expecting
		) {
			$_result = preg_match( $gitignore_regexp, $_path ) ? 'not-ignored' : 'ignored';
			$this->assertSame( $_expecting, $_result, $this->message( $_path . '=>' . $_expecting ) );
		}
	}
}
