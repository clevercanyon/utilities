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
final class Str_Slug_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is_brand_slug()
	 */
	public function test_is_brand_slug() : void {
		$this->assertSame( true, U\Str::is_brand_slug( 'clevercanyon' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_slug( 'wpgroove' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_slug( 'hostery' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_slug( 'Clever_Canyon' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'WP_Groove' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'Hostery' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_slug( 'ac' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme-slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'my-brand-my-slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( str_repeat( 'x', 64 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_slug( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme_slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme:slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme--slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme-x-slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'acme-slug-x' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( 'x-acme-slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug( str_repeat( 'x', 65 ) ), $this->message() );
	}

	/**
	 * @covers ::to_brand_slug()
	 */
	public function test_to_brand_slug() : void {
		$this->assertSame( 'my-brand-my-slug', U\Str::to_brand_slug( 'My Brand:my\\slug' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug', U\Str::to_brand_slug( '_~My Brand--my\\slug--' ), $this->message() );
		$this->assertSame( 'acme-broadcasting', U\Str::to_brand_slug( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme-broadcasting', U\Str::to_brand_slug( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my-brand-my-slugx', U\Str::to_brand_slug( 'my-brand-my-slug-x' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug', U\Str::to_brand_slug( 'my-brand-my-slug-x-' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug', U\Str::to_brand_slug( '\\My_Brand\\My_Slug\\' ), $this->message() );
		$this->assertSame( 'my-brandxmy-slug', U\Str::to_brand_slug( '\\My_Brand_X\\My_Slug\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_brand_slug( '' ), $this->message() );
		$this->assertSame( 'x0', U\Str::to_brand_slug( '0' ), $this->message() );
		$this->assertSame( 'x1', U\Str::to_brand_slug( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx', U\Str::to_brand_slug( 'xabc\\x-x--x----x' ), $this->message() );
		$this->assertSame( 'abc-dxxx', U\Str::to_brand_slug( 'abc\\d-x--x----x' ), $this->message() );
		$this->assertSame( 'x1-0', U\Str::to_brand_slug( '1.0' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_brand_slug( 'J' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_brand_slug( 'J' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john-smith-aceeiioouu', U\Str::to_brand_slug( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john-smith-xxxxxxxxxx', U\Str::to_brand_slug( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_brand_slug_prefix()
	 */
	public function test_is_brand_slug_prefix() : void {
		$this->assertSame( true, U\Str::is_brand_slug_prefix( 'clevercanyon-' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_slug_prefix( 'clevercanyon-', 'clevercanyon' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_slug_prefix( 'wpgroove-' ), $this->message() );
		$this->assertSame( true, U\Str::is_brand_slug_prefix( 'hostery-' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_slug_prefix( 'clevercanyon-x-' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug_prefix( 'wpgroove-x-' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug_prefix( 'hostery-x-' ), $this->message() );

		$this->assertSame( false, U\Str::is_brand_slug_prefix( 'Clever_Canyon-' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug_prefix( 'WP_Groove-' ), $this->message() );
		$this->assertSame( false, U\Str::is_brand_slug_prefix( 'Hostery-' ), $this->message() );
	}

	/**
	 * @covers ::to_brand_slug_prefix()
	 */
	public function test_to_brand_slug_prefix() : void {
		$this->assertSame( 'my-brand-my-slug-', U\Str::to_brand_slug_prefix( 'My Brand:my\\slug' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-', U\Str::to_brand_slug_prefix( '_~My Brand--my\\slug--' ), $this->message() );
		$this->assertSame( 'acme-broadcasting-', U\Str::to_brand_slug_prefix( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme-broadcasting-', U\Str::to_brand_slug_prefix( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my-brand-my-slugx-', U\Str::to_brand_slug_prefix( 'my-brand-my-slug-x' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-', U\Str::to_brand_slug_prefix( 'my-brand-my-slug-x-' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-', U\Str::to_brand_slug_prefix( '\\My_Brand\\My_Slug\\' ), $this->message() );
		$this->assertSame( 'my-brandxmy-slug-', U\Str::to_brand_slug_prefix( '\\My_Brand_X\\My_Slug\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_brand_slug_prefix( '' ), $this->message() );
		$this->assertSame( 'x0-', U\Str::to_brand_slug_prefix( '0' ), $this->message() );
		$this->assertSame( 'x1-', U\Str::to_brand_slug_prefix( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx-', U\Str::to_brand_slug_prefix( 'xabc\\x-x--x----x' ), $this->message() );
		$this->assertSame( 'abc-dxxx-', U\Str::to_brand_slug_prefix( 'abc\\d-x--x----x' ), $this->message() );
		$this->assertSame( 'x1-0-', U\Str::to_brand_slug_prefix( '1.0' ), $this->message() );
		$this->assertSame( 'jx-', U\Str::to_brand_slug_prefix( 'J' ), $this->message() );
		$this->assertSame( 'jx-', U\Str::to_brand_slug_prefix( 'J' ), $this->message() );

		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_brand_slug_prefix( '0' ) . 'x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_brand_slug_prefix( '1' ) . 'x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_brand_slug_prefix( 'xabc\\x-x--x----x' ) . 'x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_brand_slug_prefix( 'abc\\d-x--x----x' ) . 'x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_brand_slug_prefix( '1.0' ) . 'x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_brand_slug_prefix( 'J' ) . 'x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_brand_slug_prefix( 'J' ) . 'x-' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john-smith-aceeiioouu-', U\Str::to_brand_slug_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john-smith-xxxxxxxxxx-', U\Str::to_brand_slug_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_lede_slug()
	 */
	public function test_is_lede_slug() : void {
		$this->assertSame( true, U\Str::is_lede_slug( 'ac' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug( 'acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug( 'acme-slug' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug( 'my-brand-my-slug' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug( str_repeat( 'x', 64 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_lede_slug( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'acme_slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'acme:slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'acme--slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'acme-x-slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'acme-slug-x' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( 'x-acme-slug' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug( str_repeat( 'x', 65 ) ), $this->message() );
	}

	/**
	 * @covers ::to_lede_slug()
	 */
	public function test_to_lede_slug() : void {
		$this->assertSame( 'my-brand-my-slug', U\Str::to_lede_slug( 'My Brand:my\\slug' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug', U\Str::to_lede_slug( '_~My Brand--my\\slug--' ), $this->message() );
		$this->assertSame( 'acme-broadcasting', U\Str::to_lede_slug( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme-broadcasting', U\Str::to_lede_slug( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my-brand-my-slugx', U\Str::to_lede_slug( 'my-brand-my-slug-x' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug', U\Str::to_lede_slug( 'my-brand-my-slug-x-' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug', U\Str::to_lede_slug( '\\My_Brand\\My_Slug\\' ), $this->message() );
		$this->assertSame( 'my-brandxmy-slug', U\Str::to_lede_slug( '\\My_Brand_X\\My_Slug\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_lede_slug( '' ), $this->message() );
		$this->assertSame( 'x0', U\Str::to_lede_slug( '0' ), $this->message() );
		$this->assertSame( 'x1', U\Str::to_lede_slug( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx', U\Str::to_lede_slug( 'xabc\\x-x--x----x' ), $this->message() );
		$this->assertSame( 'abc-dxxx', U\Str::to_lede_slug( 'abc\\d-x--x----x' ), $this->message() );
		$this->assertSame( 'x1-0', U\Str::to_lede_slug( '1.0' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_lede_slug( 'J' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_lede_slug( 'J' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john-smith-aceeiioouu', U\Str::to_lede_slug( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john-smith-xxxxxxxxxx', U\Str::to_lede_slug( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_lede_slug_prefix()
	 */
	public function test_is_lede_slug_prefix() : void {
		$this->assertSame( true, U\Str::is_lede_slug_prefix( 'clevercanyon-x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( 'wpgroove-x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( 'hostery-x-' ), $this->message() );

		$this->assertSame( false, U\Str::is_lede_slug_prefix( 'clevercanyon-' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug_prefix( 'wpgroove-' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug_prefix( 'hostery-' ), $this->message() );

		$this->assertSame( false, U\Str::is_lede_slug_prefix( 'Clever_Canyon-' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug_prefix( 'WP_Groove-' ), $this->message() );
		$this->assertSame( false, U\Str::is_lede_slug_prefix( 'Hostery-' ), $this->message() );
	}

	/**
	 * @covers ::to_lede_slug_prefix()
	 */
	public function test_to_lede_slug_prefix() : void {
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_lede_slug_prefix( 'My Brand:my\\slug' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_lede_slug_prefix( '_~My Brand--my\\slug--' ), $this->message() );
		$this->assertSame( 'acme-broadcasting-x-', U\Str::to_lede_slug_prefix( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme-broadcasting-x-', U\Str::to_lede_slug_prefix( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my-brand-my-slugx-x-', U\Str::to_lede_slug_prefix( 'my-brand-my-slug-x' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_lede_slug_prefix( 'my-brand-my-slug-x-' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_lede_slug_prefix( '\\My_Brand\\My_Slug\\' ), $this->message() );
		$this->assertSame( 'my-brandxmy-slug-x-', U\Str::to_lede_slug_prefix( '\\My_Brand_X\\My_Slug\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_lede_slug_prefix( '' ), $this->message() );
		$this->assertSame( 'x0-x-', U\Str::to_lede_slug_prefix( '0' ), $this->message() );
		$this->assertSame( 'x1-x-', U\Str::to_lede_slug_prefix( '1' ), $this->message() );
		$this->assertSame( 'xabcxxxx-x-', U\Str::to_lede_slug_prefix( 'xabc\\x-x--x----x' ), $this->message() );
		$this->assertSame( 'abc-dxxx-x-', U\Str::to_lede_slug_prefix( 'abc\\d-x--x----x' ), $this->message() );
		$this->assertSame( 'x1-0-x-', U\Str::to_lede_slug_prefix( '1.0' ), $this->message() );
		$this->assertSame( 'jx-x-', U\Str::to_lede_slug_prefix( 'J' ), $this->message() );
		$this->assertSame( 'jx-x-', U\Str::to_lede_slug_prefix( 'J' ), $this->message() );

		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_lede_slug_prefix( '0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_lede_slug_prefix( '1' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_lede_slug_prefix( 'xabc\\x-x--x----x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_lede_slug_prefix( 'abc\\d-x--x----x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_lede_slug_prefix( '1.0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_lede_slug_prefix( 'J' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_lede_slug_prefix( U\Str::to_lede_slug_prefix( 'J' ) ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john-smith-aceeiioouu-x-', U\Str::to_lede_slug_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john-smith-xxxxxxxxxx-x-', U\Str::to_lede_slug_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_slug()
	 */
	public function test_is_slug() : void {
		$this->assertSame( true, U\Str::is_slug( 'ac' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug( 'acme' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug( 'john-smith' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug( str_repeat( 'x', 128 ) ), $this->message() );

		$this->assertSame( false, U\Str::is_slug( '' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug( 'a' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug( 'acme™' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug( 'john_smith' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug( str_repeat( 'x', 129 ) ), $this->message() );
	}

	/**
	 * @covers ::to_slug()
	 */
	public function test_to_slug() : void {
		$this->assertSame( 'john-smith', U\Str::to_slug( 'John smith' ), $this->message() );
		$this->assertSame( 'john-smith', U\Str::to_slug( 'John smith' ), $this->message() );
		$this->assertSame( 'acme-broadcasting', U\Str::to_slug( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme-broadcasting', U\Str::to_slug( '- acme™™   broadcasting ' ), $this->message() );

		$this->assertSame( '', U\Str::to_slug( '' ), $this->message() );
		$this->assertSame( 'x0', U\Str::to_slug( '0' ), $this->message() );
		$this->assertSame( 'x1', U\Str::to_slug( '1' ), $this->message() );
		$this->assertSame( 'x1-0', U\Str::to_slug( '1.0' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_slug( 'J' ), $this->message() );
		$this->assertSame( 'jx', U\Str::to_slug( 'J' ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john-smith-aceeiioouu', U\Str::to_slug( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john-smith-xxxxxxxxxx', U\Str::to_slug( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}

	/**
	 * @covers ::is_slug_prefix()
	 */
	public function test_is_slug_prefix() : void {
		$this->assertSame( true, U\Str::is_slug_prefix( 'clevercanyon-x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( 'wpgroove-x-' ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( 'hostery-x-' ), $this->message() );

		$this->assertSame( false, U\Str::is_slug_prefix( 'clevercanyon-' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug_prefix( 'wpgroove-' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug_prefix( 'hostery-' ), $this->message() );

		$this->assertSame( false, U\Str::is_slug_prefix( 'Clever_Canyon-' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug_prefix( 'WP_Groove-' ), $this->message() );
		$this->assertSame( false, U\Str::is_slug_prefix( 'Hostery-' ), $this->message() );
	}

	/**
	 * @covers ::to_slug_prefix()
	 */
	public function test_to_slug_prefix() : void {
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_slug_prefix( 'My Brand:my\\slug' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_slug_prefix( '_~My Brand--my\\slug--' ), $this->message() );
		$this->assertSame( 'acme-broadcasting-x-', U\Str::to_slug_prefix( 'acme  broadcasting' ), $this->message() );
		$this->assertSame( 'acme-broadcasting-x-', U\Str::to_slug_prefix( '- acme™™   broadcasting ' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-x-x-', U\Str::to_slug_prefix( 'my-brand-my-slug-x' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_slug_prefix( 'my-brand-my-slug-x-' ), $this->message() );
		$this->assertSame( 'my-brand-my-slug-x-', U\Str::to_slug_prefix( '\\My_Brand\\My_Slug\\' ), $this->message() );
		$this->assertSame( 'my-brand-x-my-slug-x-', U\Str::to_slug_prefix( '\\My_Brand_X\\My_Slug\\' ), $this->message() );

		$this->assertSame( '', U\Str::to_slug_prefix( '' ), $this->message() );
		$this->assertSame( 'x0-x-', U\Str::to_slug_prefix( '0' ), $this->message() );
		$this->assertSame( 'x1-x-', U\Str::to_slug_prefix( '1' ), $this->message() );
		$this->assertSame( 'xabc-x-x-x-x-x-', U\Str::to_slug_prefix( 'xabc\\x-x--x----x' ), $this->message() );
		$this->assertSame( 'abc-d-x-x-x-x-', U\Str::to_slug_prefix( 'abc\\d-x--x----x' ), $this->message() );
		$this->assertSame( 'x1-0-x-', U\Str::to_slug_prefix( '1.0' ), $this->message() );
		$this->assertSame( 'jx-x-', U\Str::to_slug_prefix( 'J' ), $this->message() );
		$this->assertSame( 'jx-x-', U\Str::to_slug_prefix( 'J' ), $this->message() );

		$this->assertSame( true, U\Str::is_slug_prefix( U\Str::to_slug_prefix( '0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( U\Str::to_slug_prefix( '1' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( U\Str::to_slug_prefix( 'xabc\\x-x--x----x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( U\Str::to_slug_prefix( 'abc\\d-x--x----x' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( U\Str::to_slug_prefix( '1.0' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( U\Str::to_slug_prefix( 'J' ) ), $this->message() );
		$this->assertSame( true, U\Str::is_slug_prefix( U\Str::to_slug_prefix( 'J' ) ), $this->message() );

		if ( U\Env::can_use_extension( 'intl' ) ) {
			$this->assertSame( 'john-smith-aceeiioouu-x-', U\Str::to_slug_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		} else {
			$this->assertSame( 'john-smith-xxxxxxxxxx-x-', U\Str::to_slug_prefix( 'John smith àçéèíïóòúü' ), $this->message() );
		}
	}
}
