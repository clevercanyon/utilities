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
 * @coversDefaultClass \Clever_Canyon\Utilities\Code_Stream_Closure
 */
final class Code_Stream_Closure_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::__construct()
	 * @covers ::call()
	 * @covers ::get()
	 * @covers ::get_closure()
	 * @covers ::__serialize()
	 * @covers ::__unserialize()
	 */
	public function test_closure() : void {
		$code_stream_closure = new U\Code_Stream_Closure(
			<<<'ooo'
			function() {
				return gethostname();
			};
			ooo
		);
		$code_stream_closure = U\Str::serialize( $code_stream_closure );
		$code_stream_closure = U\Str::unserialize( $code_stream_closure );

		$this->assertSame( gethostname(), $code_stream_closure->call(), $this->message() );
		$this->assertSame( \Closure::class, get_class( $code_stream_closure->get() ), $this->message() );
		$this->assertSame( \Closure::class, get_class( $code_stream_closure->get_closure() ), $this->message() );
	}
}
