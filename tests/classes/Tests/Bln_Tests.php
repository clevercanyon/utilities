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
 * @coversDefaultClass \Clever_Canyon\Utilities\Bln
 */
final class Bln_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::validate()
	 */
	public function test_validate() : void {
		foreach ( [ 1.0, 1, '1', true, 'true', 'trUe', 'on', 'oN', 'yes', 'yEs' ] as $_truthy ) {
			$this->assertSame( true, U\Bln::validate( $_truthy ), $this->message() );
			$this->assertSame( true, U\Bln::validate( $_truthy, true ), $this->message() );
		}
		foreach ( [ 0.0, 0, '0', false, 'false', 'faLse', 'off', 'oFf', 'no', 'nO', '' ] as $_falsy ) {
			$this->assertSame( false, U\Bln::validate( $_falsy ), $this->message() );
			$this->assertSame( false, U\Bln::validate( $_falsy, true ), $this->message() );
		}
		foreach ( [
			[ false, '' ],
			[ false, 2 ],
			[ false, [ 1 ] ],
			[ false, (object) [ 1 ] ],

			[ false, '', true ],
			[ null, 2, true ],
			[ null, [ 1 ], true ],
			[ null, (object) [ 1 ], true ],
		] as $_args
		) {
			$this->assertSame( $_args[ 0 ], U\Bln::validate( ...array_slice( $_args, 1 ) ), $this->message() );
		}
	}
}
