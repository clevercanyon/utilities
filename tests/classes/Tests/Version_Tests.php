<?php
/**
 * Clever Canyon™ {@see https://clevercanyon.com}
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
use Clever_Canyon\Utilities\{Tests as U_Tests};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\Version
 */
final class Version_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::is()
	 */
	public function test_is() : void {
		$this->assertSame( true, U\Version::is( '0' ), $this->message() );
		$this->assertSame( true, U\Version::is( '0.0' ), $this->message() );
		$this->assertSame( true, U\Version::is( '0.0.0' ), $this->message() );
		$this->assertSame( true, U\Version::is( '1.0.0' ), $this->message() );
		$this->assertSame( true, U\Version::is( '1.0.0-dev.1' ), $this->message() );
		$this->assertSame( true, U\Version::is( '1.0.0-alpha.1' ), $this->message() );
		$this->assertSame( true, U\Version::is( '1.0.0-beta.1' ), $this->message() );
		$this->assertSame( true, U\Version::is( '1.0.0-rc.1' ), $this->message() );

		$this->assertSame( false, U\Version::is( '' ), $this->message() );
		$this->assertSame( false, U\Version::is( '.0' ), $this->message() );
		$this->assertSame( false, U\Version::is( '.0.0' ), $this->message() );
		$this->assertSame( false, U\Version::is( '1.0.0.dev.1' ), $this->message() );
		$this->assertSame( false, U\Version::is( '1.0.0.alpha.1' ), $this->message() );
		$this->assertSame( false, U\Version::is( '1.0.0.beta.1' ), $this->message() );
		$this->assertSame( false, U\Version::is( '1.0.0.beta' ), $this->message() );
		$this->assertSame( false, U\Version::is( '1.0.0.rc' ), $this->message() );
	}

	/**
	 * @covers ::parse()
	 */
	public function test_parse() : void {
		$loose_defaults  = [ 'major' => '0', 'minor' => '', 'patch' => '', 'other' => '' ];
		$strict_defaults = [ 'major' => '0', 'minor' => '', 'patch' => '', 'pre_release' => '', 'build_metadata' => '' ];

		$this->assertSame( [ 'major' => '0' ] + $strict_defaults, U\Version::parse( '0' ), $this->message() );
		$this->assertSame( [ 'major' => '0', 'minor' => '0' ] + $strict_defaults, U\Version::parse( '0.0' ), $this->message() );
		$this->assertSame( [ 'major' => '0', 'minor' => '0', 'patch' => '0' ] + $strict_defaults, U\Version::parse( '0.0.0' ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0' ] + $strict_defaults, U\Version::parse( '1.0.0' ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'pre_release' => 'dev.1' ] + $strict_defaults, U\Version::parse( '1.0.0-dev.1' ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'pre_release' => 'alpha.1' ] + $strict_defaults, U\Version::parse( '1.0.0-alpha.1' ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'pre_release' => 'beta.1' ] + $strict_defaults, U\Version::parse( '1.0.0-beta.1' ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'pre_release' => 'rc.1' ] + $strict_defaults, U\Version::parse( '1.0.0-rc.1' ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'pre_release' => 'rc.1', 'build_metadata' => '123' ] + $strict_defaults, U\Version::parse( '1.0.0-rc.1+123' ), $this->message() );

		$this->assertSame( [ 'major' => '0' ] + $loose_defaults, U\Version::parse( '0', false ), $this->message() );
		$this->assertSame( [ 'major' => '0', 'minor' => '0' ] + $loose_defaults, U\Version::parse( '0.0', false ), $this->message() );
		$this->assertSame( [ 'major' => '0', 'minor' => '0', 'patch' => '0' ] + $loose_defaults, U\Version::parse( '0.0.0', false ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0' ] + $loose_defaults, U\Version::parse( '1.0.0', false ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'other' => 'dev.1' ] + $loose_defaults, U\Version::parse( '1.0.0-dev.1', false ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'other' => 'alpha.1' ] + $loose_defaults, U\Version::parse( '1.0.0-alpha.1', false ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'other' => 'beta.1' ] + $loose_defaults, U\Version::parse( '1.0.0-beta.1', false ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'other' => 'rc.1' ] + $loose_defaults, U\Version::parse( '1.0.0-rc.1', false ), $this->message() );
		$this->assertSame( [ 'major' => '1', 'minor' => '0', 'patch' => '0', 'other' => 'rc.1+123' ] + $loose_defaults, U\Version::parse( '1.0.0-rc.1+123', false ), $this->message() );

		$this->assertSame( [], U\Version::parse( '' ), $this->message() );
		$this->assertSame( [], U\Version::parse( '.0' ), $this->message() );
		$this->assertSame( [], U\Version::parse( '.0.0' ), $this->message() );
		$this->assertSame( [], U\Version::parse( '1.0.0.dev.1' ), $this->message() );
		$this->assertSame( [], U\Version::parse( '1.0.0.alpha.1' ), $this->message() );
		$this->assertSame( [], U\Version::parse( '1.0.0.beta.1' ), $this->message() );
		$this->assertSame( [], U\Version::parse( '1.0.0.beta' ), $this->message() );
		$this->assertSame( [], U\Version::parse( '1.0.0.rc' ), $this->message() );
	}
}
