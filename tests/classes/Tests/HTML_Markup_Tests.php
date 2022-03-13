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
 * @coversDefaultClass \Clever_Canyon\Utilities\HTML
 */
final class HTML_Markup_Tests extends U_Tests\A6t\Base {
	/**
	 * @covers ::markup()
	 */
	public function test_markup() : void {
		$this->assertSame(
			'<p><code>foo</code> bar</p>',
			U\HTML::markup( '`foo` bar' ), $this->message()
		);
		$this->assertSame(
			'<p>Foo’s Bar</p>',
			U\HTML::markup( 'Foo\'s Bar' ), $this->message()
		);
		$this->assertSame(
			'<p><strong>Foo’s Bar</strong></p>',
			U\HTML::markup( '<strong>Foo\'s Bar</strong>' ), $this->message()
		);
		$this->assertSame(
			'<p><code class="code" id="code">foo</code> bar</p>',
			U\HTML::markup( '`foo`{#code .code} bar' ), $this->message()
		);
		$this->assertSame(
			'<p><code class="code" id="code">foo</code> bar</p>',
			U\HTML::markup( '`foo`{.code #code} bar' ), $this->message()
		);
		$this->assertSame(
			'<div>`foo` bar</div>',
			U\HTML::markup( '<div>`foo` bar</div>' ), $this->message()
		);
		$this->assertSame(
			'<p><code>foo</code> <del>bar</del></p>',
			U\HTML::markup( '`foo` ~~bar~~' ), $this->message()
		);
		$this->assertSame(
			'<p>example.com</p>',
			U\HTML::markup( 'example.com' ), $this->message()
		);
		$this->assertSame(
			'<p>//example.com</p>',
			U\HTML::markup( '//example.com' ), $this->message()
		);
		$this->assertSame(
			'<p>//www.example.com</p>',
			U\HTML::markup( '//www.example.com' ), $this->message()
		);
		$this->assertSame(
			'<p><a href="https://foo.bar.com">https://foo.bar.com</a></p>',
			U\HTML::markup( 'https://foo.bar.com' ), $this->message()
		);
		$this->assertSame(
			'<p><a href="https://foo.bar.com:123">https://foo.bar.com:123</a></p>',
			U\HTML::markup( 'https://foo.bar.com:123' ), $this->message()
		);
		$this->assertSame(
			'<p><a rel="nofollow noopener noreferrer" target="_blank" class="m6d-x-link" href="http://www.example.com">www.example.com</a></p>',
			U\HTML::markup( 'www.example.com' ), $this->message()
		);
		$this->assertSame(
			'<p><a rel="nofollow noopener noreferrer" target="_blank" class="m6d-x-link" href="https://example.com">https://example.com</a></p>',
			U\HTML::markup( 'https://example.com' ), $this->message()
		);
		$this->assertSame(
			'<p><a rel="nofollow noopener noreferrer" target="_blank" class="m6d-x-link" href="https://twitter.com/clevercanyon">@clevercanyon</a></p>',
			U\HTML::markup( '@clevercanyon' ), $this->message()
		);
		$this->assertSame(
			'<p><a rel="nofollow noopener noreferrer" target="_blank" class="m6d-x-link" href="https://github.com/clevercanyon/utilities/issues/1">&amp;/utilities#1</a></p>',
			U\HTML::markup( '&/utilities#1' ), $this->message()
		);
		$this->assertSame(
			'<h2>Heading<a id="m6d-a4r-x8809edb77f3" href="#m6d-a4r-x8809edb77f3" class="m6d-heading-permalink hidden" aria-hidden="true" title="Permalink"></a></h2>',
			U\HTML::markup( '## Heading' ), $this->message()
		);
		$this->assertSame(
			'<h2 class="foo">Heading<a id="m6d-a4r-ox8809edb77f3" href="#m6d-a4r-ox8809edb77f3" class="m6d-heading-permalink hidden" aria-hidden="true" title="Permalink"></a></h2>',
			U\HTML::markup( '## Heading {.foo}' ), $this->message()
		);
		$this->assertSame(
			<<<'ooo'
			<ul class="m6d-table-of-contents">
			<li>
			<a href="#m6d-a4r-x6c500e7dee1">Foo Heading</a>
			</li>
			<li>
			<a href="#m6d-a4r-xa02c3d8228b">Bar Heading</a>
			</li>
			<li>
			<a href="#m6d-a4r-xd54b0510f7b">Baz Heading</a>
			</li>
			</ul>
			<h2 class="foo x" id="foo">Foo Heading<a id="m6d-a4r-x6c500e7dee1" href="#m6d-a4r-x6c500e7dee1" class="m6d-heading-permalink hidden" aria-hidden="true" title="Permalink"></a></h2>
			<p>Foo content.</p>
			<h2 class="bar">Bar Heading<a id="m6d-a4r-xa02c3d8228b" href="#m6d-a4r-xa02c3d8228b" class="m6d-heading-permalink hidden" aria-hidden="true" title="Permalink"></a></h2>
			<p>Content; <code>code</code>.</p>
			<h2 class="bar bar">Baz Heading<a id="m6d-a4r-xd54b0510f7b" href="#m6d-a4r-xd54b0510f7b" class="m6d-heading-permalink hidden" aria-hidden="true" title="Permalink"></a></h2>
			<p>Content with a fenced code block.</p>
			<pre><code>&lt;?php
			echo 'Hello world.';
			</code></pre>
			<pre><code class="language-php">&lt;?php
			echo 'Hello world.';
			</code></pre>
			ooo,
			U\HTML::markup(
				<<<'ooo'
				[table-of-contents]

				## Foo Heading {#foo .foo .x}

				Foo content.

				## Bar Heading {.bar}

				Content; `code`.

				## Baz Heading {.bar .bar}

				Content with a fenced code block.

				```
				<?php
				echo 'Hello world.';
				```

				```php
				<?php
				echo 'Hello world.';
				```
				ooo
			), $this->message()
		);
	}

	/**
	 * @covers ::markup_io()
	 */
	public function test_markup_io() : void {
		$this->assertSame(
			'<code>foo</code> bar',
			U\HTML::markup_io( '`foo` bar' ), $this->message()
		);
		$this->assertSame(
			'Foo’s Bar',
			U\HTML::markup_io( 'Foo\'s Bar' ), $this->message()
		);
		$this->assertSame(
			'<code class="code" id="code">foo</code> bar',
			U\HTML::markup_io( '`foo`{#code .code} bar' ), $this->message()
		);
		$this->assertSame(
			'<code class="code" id="code">foo</code> bar',
			U\HTML::markup_io( '`foo`{.code #code} bar' ), $this->message()
		);
	}

	/**
	 * @covers ::markup_safe()
	 */
	public function test_markup_safe() : void {
		$this->assertSame(
			'<p><code>foo</code> bar</p>',
			U\HTML::markup_safe( '`foo` bar' ), $this->message()
		);
		$this->assertSame(
			'<p>Foo’s Bar</p>',
			U\HTML::markup_safe( 'Foo\'s <strong>Bar</strong>' ), $this->message()
		);
		$this->assertSame(
			'<p><code>foo</code>{#code .code} bar</p>',
			U\HTML::markup_safe( '`foo`{#code .code} <i>bar</i>' ), $this->message()
		);
		$this->assertSame(
			'<p><code>foo</code>{.code #code} bar</p>',
			U\HTML::markup_safe( '`foo`{.code #code} <bar>bar</bar>' ), $this->message()
		);
	}

	/**
	 * @covers ::markup_safe_io()
	 */
	public function test_markup_safe_io() : void {
		$this->assertSame(
			'<code>foo</code> bar',
			U\HTML::markup_safe_io( '`foo` bar' ), $this->message()
		);
		$this->assertSame(
			'Foo’s Bar',
			U\HTML::markup_safe_io( 'Foo\'s <strong>Bar</strong>' ), $this->message()
		);
		$this->assertSame(
			'<code>foo</code>{#code .code} bar',
			U\HTML::markup_safe_io( '`foo`{#code .code} <i>bar</i>' ), $this->message()
		);
		$this->assertSame(
			'<code>foo</code>{.code #code} bar',
			U\HTML::markup_safe_io( '`foo`{.code #code} <bar>bar</bar>' ), $this->message()
		);
	}
}
