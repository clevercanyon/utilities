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
 * @coversDefaultClass \Clever_Canyon\Utilities\HTML
 */
final class HTML_Utility_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is()
	 */
	public function test_is() : void {
		$this->assertSame( true, U\HTML::is( '&amp;' ), $this->message() );
		$this->assertSame( true, U\HTML::is( '&foo;' ), $this->message() );
		$this->assertSame( true, U\HTML::is( '&123;' ), $this->message() );
		$this->assertSame( true, U\HTML::is( '<foo>' ), $this->message() );
		$this->assertSame( true, U\HTML::is( '<html>' ), $this->message() );
		$this->assertSame( true, U\HTML::is( '</html>' ), $this->message() );

		$this->assertSame( false, U\HTML::is( 'html' ), $this->message() );
		$this->assertSame( false, U\HTML::is( 'foo' ), $this->message() );
		$this->assertSame( false, U\HTML::is( '&foo ;' ), $this->message() );
	}

	/**
	 * @covers ::starts_with_tag()
	 */
	public function test_starts_with_tag() : void {
		$this->assertSame( true, U\HTML::starts_with_tag( '<p>', 'p' ), $this->message() );
		$this->assertSame( true, U\HTML::starts_with_tag( '<div>', 'div' ), $this->message() );
		$this->assertSame( true, U\HTML::starts_with_tag( '<p><div>', [ 'p', 'div' ] ), $this->message() );
		$this->assertSame( true, U\HTML::starts_with_tag( '<hr>', [ 'p', 'div', 'hr' ] ), $this->message() );
		$this->assertSame( true, U\HTML::starts_with_tag( '<hr/>', [ 'p', 'div', 'hr' ] ), $this->message() );
		$this->assertSame( true, U\HTML::starts_with_tag( '<hr />', [ 'p', 'div', 'hr' ] ), $this->message() );

		$this->assertSame( false, U\HTML::starts_with_tag( 'html', 'html' ), $this->message() );
		$this->assertSame( false, U\HTML::starts_with_tag( 'foo', 'foo' ), $this->message() );
		$this->assertSame( false, U\HTML::starts_with_tag( '&foo ;', [ '&foo ;' ] ), $this->message() );
	}

	/**
	 * @covers ::has_block_tags()
	 * @covers ::block_tags_regexp()
	 */
	public function test_has_block_tags() : void {
		$this->assertSame( true, U\HTML::has_block_tags( '<p>' ), $this->message() );
		$this->assertSame( true, U\HTML::has_block_tags( '<div>' ), $this->message() );
		$this->assertSame( true, U\HTML::has_block_tags( '<p><div></div></p>' ), $this->message() );
		$this->assertSame( true, U\HTML::has_block_tags( '<hr class="foo">' ), $this->message() );
		$this->assertSame( true, U\HTML::has_block_tags( '<hr class="foo"/>' ), $this->message() );
		$this->assertSame( true, U\HTML::has_block_tags( '<hr>' ), $this->message() );
		$this->assertSame( true, U\HTML::has_block_tags( '<hr/>' ), $this->message() );
		$this->assertSame( true, U\HTML::has_block_tags( '<hr />' ), $this->message() );

		$this->assertSame( false, U\HTML::has_block_tags( 'foo' ), $this->message() );
		$this->assertSame( false, U\HTML::has_block_tags( '<span>html</span>' ), $this->message() );
		$this->assertSame( false, U\HTML::has_block_tags( '<strong>&foo ;</strong>' ), $this->message() );
	}
}
