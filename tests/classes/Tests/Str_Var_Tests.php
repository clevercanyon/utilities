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
 * @coversDefaultClass \Clever_Canyon\Utilities\Str
 */
final class Str_Var_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::is_brand_var()
	 */
	public function test_is_brand_var() : void {
		$this->assertSame( true, U\Str::is_brand_var( 'clevercanyon' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_var( 'wpgroove' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_var( 'hostery' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_var( 'Clever_Canyon' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'WP_Groove' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'Hostery' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_var( 'ac' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme_var' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'my_brand_my_var' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( str_repeat( 'x', 64 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_var( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme_var' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme:var' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme__var' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme_x_var' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'acme_var_x' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( 'x_acme_var' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var( str_repeat( 'x', 65 ) ), $this->message() );
	}

	/**
	 * @covers ::to_brand_var()
	 */
	public function test_to_brand_var() : void {
		$this->assertSame( 'my_brand_my_var', U\Str::to_brand_var( 'My Brand:my\\var\\' ), $this->message() );
		$this->assertSame( 'my_brand_my_var', U\Str::to_brand_var( '_~My Brand--my\\var--' ), $this->message() );
		$this->assertSame( 'acme_broadcasting', U\Str::to_brand_var( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme_broadcasting', U\Str::to_brand_var( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my_brand_my_varx', U\Str::to_brand_var( 'my-brand-my-var-x' ), $this->message() );
		$this->assertSame( 'my_brand_my_var', U\Str::to_brand_var( 'my-brand-my-var-x-' ), $this->message() );
		$this->assertSame( 'my_brand_my_var', U\Str::to_brand_var( '\\My_Brand\\My_Var\\' ), $this->message() );
		$this->assertSame( 'my_brandxmy_var', U\Str::to_brand_var( '\\My_Brand_X\\My_Var\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_brand_var( '' ), $this->message() );
		$this->assertSame( 'x0', U\Str::to_brand_var( '0' ), $this->message() );
		$this->assertSame( 'x1', U\Str::to_brand_var( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx', U\Str::to_brand_var( 'xabc\\x_x__x____x\\' ), $this->message() );
		$this->assertSame( 'abc_dxxx', U\Str::to_brand_var( 'abc\\d_x__x____x\\' ), $this->message() );
		$this->assertSame( 'x1_0', U\Str::to_brand_var( '1.0' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_brand_var( 'J' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_brand_var( 'J' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john_smith_aceeiioouu', U\Str::to_brand_var( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john_smith_xxxxxxxxxx', U\Str::to_brand_var( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_brand_var_prefix()
	 */
	public function test_is_brand_var_prefix() : void {
		$this->assertSame( true, U\Str::is_brand_var_prefix( 'clevercanyon_' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_var_prefix( 'wpgroove_' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_var_prefix( 'hostery_' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_var_prefix( 'clevercanyon_x_' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var_prefix( 'wpgroove_x_' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var_prefix( 'hostery_x_' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_var_prefix( 'Clever_Canyon_' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var_prefix( 'WP_Groove_' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_var_prefix( 'Hostery_' ), $this->message() );
	}

	/**
	 * @covers ::to_brand_var_prefix()
	 */
	public function test_to_brand_var_prefix() : void {
		$this->assertSame( 'my_brand_my_var_', U\Str::to_brand_var_prefix( 'My Brand:my\\var\\' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_', U\Str::to_brand_var_prefix( '_~My Brand--my\\var--' ), $this->message() );
		$this->assertSame( 'acme_broadcasting_', U\Str::to_brand_var_prefix( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme_broadcasting_', U\Str::to_brand_var_prefix( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my_brand_my_varx_', U\Str::to_brand_var_prefix( 'my_brand-my_var-x' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_', U\Str::to_brand_var_prefix( 'my-brand-my_var_x_' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_', U\Str::to_brand_var_prefix( '\\My_Brand\\My_Var\\' ), $this->message() );
		$this->assertSame( 'my_brandxmy_var_', U\Str::to_brand_var_prefix( '\\My_Brand_X\\My_Var\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_brand_var_prefix( '' ), $this->message() );
		$this->assertSame( 'x0_', U\Str::to_brand_var_prefix( '0' ), $this->message() );
		$this->assertSame( 'x1_', U\Str::to_brand_var_prefix( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx_', U\Str::to_brand_var_prefix( 'xabc\\x-x--x____x' ), $this->message() );
		$this->assertSame( 'abc_dxxx_', U\Str::to_brand_var_prefix( 'abc\\d-x__x____x' ), $this->message() );
		$this->assertSame( 'x1_0_', U\Str::to_brand_var_prefix( '1.0' ), $this->message() );
		$this->assertSame( 'jx_', U\Str::to_brand_var_prefix( 'J' ), $this->message() );
		$this->assertSame( 'jx_', U\Str::to_brand_var_prefix( 'J' ), $this->message() );

		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_brand_var_prefix( '0' ) . 'x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_brand_var_prefix( '1' ) . 'x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_brand_var_prefix( 'xabc\\x-x--x____x' ) . 'x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_brand_var_prefix( 'abc\\d-x__x____x' ) . 'x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_brand_var_prefix( '1.0' ) . 'x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_brand_var_prefix( 'J' ) . 'x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_brand_var_prefix( 'J' ) . 'x_' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john_smith_aceeiioouu_', U\Str::to_brand_var_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john_smith_xxxxxxxxxx_', U\Str::to_brand_var_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_lede_var_prefix()
	 */
	public function test_is_lede_var_prefix() : void {
		$this->assertSame( true, U\Str::is_lede_var_prefix( 'clevercanyon_x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( 'wpgroove_x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( 'hostery_x_' ), $this->message() );

		$this->assertSame( false, U\Str::is_lede_var_prefix( 'clevercanyon_' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var_prefix( 'wpgroove_' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var_prefix( 'hostery_' ), $this->message() );

		$this->assertSame( false, U\Str::is_lede_var_prefix( 'Clever_Canyon_' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var_prefix( 'WP_Groove_' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var_prefix( 'Hostery_' ), $this->message() );
	}

	/**
	 * @covers ::to_lede_var_prefix()
	 */
	public function test_to_lede_var_prefix() : void {
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_lede_var_prefix( 'My Brand:my\\var\\' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_lede_var_prefix( '_~My Brand--my\\var--' ), $this->message() );
		$this->assertSame( 'acme_broadcasting_x_', U\Str::to_lede_var_prefix( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme_broadcasting_x_', U\Str::to_lede_var_prefix( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my_brand_my_varx_x_', U\Str::to_lede_var_prefix( 'my_brand-my_var-x' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_lede_var_prefix( 'my-brand-my_var_x_' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_lede_var_prefix( '\\My_Brand\\My_Var\\' ), $this->message() );
		$this->assertSame( 'my_brandxmy_var_x_', U\Str::to_lede_var_prefix( '\\My_Brand_X\\My_Var\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_lede_var_prefix( '' ), $this->message() );
		$this->assertSame( 'x0_x_', U\Str::to_lede_var_prefix( '0' ), $this->message() );
		$this->assertSame( 'x1_x_', U\Str::to_lede_var_prefix( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx_x_', U\Str::to_lede_var_prefix( 'xabc\\x-x--x____x' ), $this->message() );
		$this->assertSame( 'abc_dxxx_x_', U\Str::to_lede_var_prefix( 'abc\\d-x__x____x' ), $this->message() );
		$this->assertSame( 'x1_0_x_', U\Str::to_lede_var_prefix( '1.0' ), $this->message() );
		$this->assertSame( 'jx_x_', U\Str::to_lede_var_prefix( 'J' ), $this->message() );
		$this->assertSame( 'jx_x_', U\Str::to_lede_var_prefix( 'J' ), $this->message() );

		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_lede_var_prefix( '0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_lede_var_prefix( '1' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_lede_var_prefix( 'xabc\\x-x--x____x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_lede_var_prefix( 'abc\\d-x__x____x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_lede_var_prefix( '1.0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_lede_var_prefix( 'J' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var_prefix( U\Str::to_lede_var_prefix( 'J' ) ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john_smith_aceeiioouu_x_', U\Str::to_lede_var_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john_smith_xxxxxxxxxx_x_', U\Str::to_lede_var_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_lede_var()
	 */
	public function test_is_lede_var() : void {
		$this->assertSame( true, U\Str::is_lede_var( 'ac' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var( 'acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var( 'acme_var' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var( 'my_brand_my_var' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_var( str_repeat( 'x', 64 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_lede_var( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'acme-var' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'acme:var' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'acme__var' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'acme_x_var' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'acme_var_x' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( 'x_acme_var' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_var( str_repeat( 'x', 65 ) ), $this->message() );
	}

	/**
	 * @covers ::to_lede_var()
	 */
	public function test_to_lede_var() : void {
		$this->assertSame( 'my_brand_my_var', U\Str::to_lede_var( 'My Brand:my\\var\\' ), $this->message() );
		$this->assertSame( 'my_brand_my_var', U\Str::to_lede_var( '_~My Brand__my\\var__\\' ), $this->message() );
		$this->assertSame( 'acme_broadcasting', U\Str::to_lede_var( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme_broadcasting', U\Str::to_lede_var( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my_brand_my_varx', U\Str::to_lede_var( 'my-brand-my-var-x' ), $this->message() );
		$this->assertSame( 'my_brand_my_var', U\Str::to_lede_var( 'my-brand_my_var_x_' ), $this->message() );
		$this->assertSame( 'my_brand_my_var', U\Str::to_lede_var( '\\My_Brand\\My_Var\\' ), $this->message() );
		$this->assertSame( 'my_brandxmy_var', U\Str::to_lede_var( '\\My_Brand_X\\My_Var\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_lede_var( '' ), $this->message() );
		$this->assertSame( 'x0', U\Str::to_lede_var( '0' ), $this->message() );
		$this->assertSame( 'x1', U\Str::to_lede_var( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx', U\Str::to_lede_var( 'xabc\\x_x__x____x\\' ), $this->message() );
		$this->assertSame( 'abc_dxxx', U\Str::to_lede_var( 'abc\\d_x__x____x\\' ), $this->message() );
		$this->assertSame( 'x1_0', U\Str::to_lede_var( '1.0' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_lede_var( 'J' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_lede_var( 'J' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john_smith_aceeiioouu', U\Str::to_lede_var( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john_smith_xxxxxxxxxx', U\Str::to_lede_var( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_var()
	 */
	public function test_is_var() : void {
		$this->assertSame( true, U\Str::is_var( 'ac' ), $this->message() );
		$this->assertSame( true, U\Str::is_var( 'acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_var( 'john_smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_var( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_var( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_var( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_var( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_var( 'john-smith' ), $this->message() );
		$this->assertSame( false, U\Str::is_var( str_repeat( 'x', 129 ) ), $this->message() );
	}

	/**
	 * @covers ::to_var()
	 */
	public function test_to_var() : void {
		$this->assertSame( 'john_smith', U\Str::to_var( 'John smith' ), $this->message() );
		$this->assertSame( 'john_smith', U\Str::to_var( 'John smith' ), $this->message() );
		$this->assertSame( 'acme_broadcasting', U\Str::to_var( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme_broadcasting', U\Str::to_var( '- acme™™   broadcasting ' ), $this->message() );

		$this->assertSame( '', U\Str::to_var( '' ), $this->message() );
		$this->assertSame( 'x0', U\Str::to_var( '0' ), $this->message() );
		$this->assertSame( 'x1', U\Str::to_var( '1' ), $this->message() );
		$this->assertSame( 'x1_0', U\Str::to_var( '1.0' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_var( 'J' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_var( 'J' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john_smith_aceeiioouu', U\Str::to_var( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john_smith_xxxxxxxxxx', U\Str::to_var( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_var_prefix()
	 */
	public function test_is_var_prefix() : void {
		$this->assertSame( true, U\Str::is_var_prefix( 'clevercanyon_x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( 'wpgroove_x_' ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( 'hostery_x_' ), $this->message() );

		$this->assertSame( false, U\Str::is_var_prefix( 'clevercanyon_' ), $this->message() );
		$this->assertSame( false, U\Str::is_var_prefix( 'wpgroove_' ), $this->message() );
		$this->assertSame( false, U\Str::is_var_prefix( 'hostery_' ), $this->message() );

		$this->assertSame( false, U\Str::is_var_prefix( 'Clever_Canyon_' ), $this->message() );
		$this->assertSame( false, U\Str::is_var_prefix( 'WP_Groove_' ), $this->message() );
		$this->assertSame( false, U\Str::is_var_prefix( 'Hostery_' ), $this->message() );
	}

	/**
	 * @covers ::to_var_prefix()
	 */
	public function test_to_var_prefix() : void {
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_var_prefix( 'My Brand:my\\var\\' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_var_prefix( '_~My Brand--my\\var--' ), $this->message() );
		$this->assertSame( 'acme_broadcasting_x_', U\Str::to_var_prefix( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme_broadcasting_x_', U\Str::to_var_prefix( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_x_x_', U\Str::to_var_prefix( 'my_brand-my_var-x' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_var_prefix( 'my-brand-my_var_x_' ), $this->message() );
		$this->assertSame( 'my_brand_my_var_x_', U\Str::to_var_prefix( '\\My_Brand\\My_Var\\' ), $this->message() );
		$this->assertSame( 'my_brand_x_my_var_x_', U\Str::to_var_prefix( '\\My_Brand_X\\My_Var\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_var_prefix( '' ), $this->message() );
		$this->assertSame( 'x0_x_', U\Str::to_var_prefix( '0' ), $this->message() );
		$this->assertSame( 'x1_x_', U\Str::to_var_prefix( '1' ), $this->message() );
		$this->assertSame( 'xabc_x_x_x_x_x_', U\Str::to_var_prefix( 'xabc\\x-x--x____x' ), $this->message() );
		$this->assertSame( 'abc_d_x_x_x_x_', U\Str::to_var_prefix( 'abc\\d-x__x____x' ), $this->message() );
		$this->assertSame( 'x1_0_x_', U\Str::to_var_prefix( '1.0' ), $this->message() );
		$this->assertSame( 'jx_x_', U\Str::to_var_prefix( 'J' ), $this->message() );
		$this->assertSame( 'jx_x_', U\Str::to_var_prefix( 'J' ), $this->message() );

		$this->assertSame( true, U\Str::is_var_prefix( U\Str::to_var_prefix( '0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( U\Str::to_var_prefix( '1' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( U\Str::to_var_prefix( 'xabc\\x-x--x____x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( U\Str::to_var_prefix( 'abc\\d-x__x____x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( U\Str::to_var_prefix( '1.0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( U\Str::to_var_prefix( 'J' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_var_prefix( U\Str::to_var_prefix( 'J' ) ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john_smith_aceeiioouu_x_', U\Str::to_var_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john_smith_xxxxxxxxxx_x_', U\Str::to_var_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}
}
