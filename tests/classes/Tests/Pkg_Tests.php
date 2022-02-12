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
use Clever_Canyon\Utilities\{Tests as UT};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\Pkg
 */
final class Pkg_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::namespace_scope()
	 */
	public function test_namespace_scope() : void {
		$this->assertSame( 'Xae3c7c368fe2e3c', U\Pkg::namespace_scope( 'Xae3c7c368fe2e3c\\' . __CLASS__ ), $this->message() );
	}

	/**
	 * @covers ::namespace_crux()
	 * @noinspection PhpUndefinedClassInspection
	 */
	public function test_namespace_crux() : void {
		$this->assertSame( U::class, U\Pkg::namespace_crux( __CLASS__ ), $this->message() );
		$this->assertSame( U::class, U\Pkg::namespace_crux( 'Xae3c7c368fe2e3c\\' . __CLASS__ ), $this->message() );
	}

	/**
	 * @covers ::fqn_crux()
	 */
	public function test_fqn_crux() : void {
		$this->assertSame( __CLASS__, U\Pkg::fqn_crux( __CLASS__ ), $this->message() );
		$this->assertSame( __CLASS__, U\Pkg::fqn_crux( 'Xae3c7c368fe2e3c\\' . __CLASS__ ), $this->message() );
	}

	/**
	 * @covers ::data_context()
	 */
	public function test_data_context() : void {
		$this->assertSame( 'web~foo.bar.com:123', U\Pkg::data_context(), $this->message() );
		$this->assertSame( 'web-foo-bar-com-123', U\Pkg::data_context( 'slug' ), $this->message() );
	}
}
