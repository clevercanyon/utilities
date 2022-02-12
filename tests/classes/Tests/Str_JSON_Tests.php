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
 * @coversDefaultClass \Clever_Canyon\Utilities\Str
 */
final class Str_JSON_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::json_encode()
	 */
	public function test_json_encode() : void {
		$this->assertSame( '[1]', U\Str::json_encode( [ 1 ], false ), $this->message() );
		$this->assertSame( '[' . "\n" . '    1' . "\n" . ']', U\Str::json_encode( [ 1 ], true ), $this->message() );
	}

	/**
	 * @covers ::json_decode()
	 */
	public function test_json_decode() : void {
		$this->assertSame( [ 'key' => 123 ], U\Str::json_decode( U\Str::json_encode( [ 'key' => 123 ], false ), true ), $this->message() );
		$this->assertSame( [ 'key' => 123 ], U\Str::json_decode( U\Str::json_encode( [ 'key' => 123 ], true ), true ), $this->message() );
	}

	/**
	 * @covers ::stringify()
	 */
	public function test_stringify() : void {
		$this->assertSame( '[1]', U\Str::stringify( [ 1 ], false ), $this->message() );
		$this->assertSame( '[' . "\n" . '    1' . "\n" . ']', U\Str::stringify( [ 1 ], true ), $this->message() );
	}
}
