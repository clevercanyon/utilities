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
 * @coversDefaultClass \Clever_Canyon\Utilities\A6t\Base
 */
final class Base_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::__construct()
	 */
	public function test_stc_base_members() : void {
		$base = new class extends U\A6t\Base {
			/**
			 * Constructor.
			 *
			 * @since 2022-03-03
			 */
			public function __construct() {
				parent::__construct();
			}

			/**
			 * Tests static methods.
			 *
			 * @since 2022-03-03
			 *
			 * @return bool True on success.
			 */
			public function test_stc_methods() : bool {
				static::cls_cache( __FUNCTION__ );
				static::cls_cache_clear();

				return method_exists( $this, '__set_state' )
					&& method_exists( $this, '__callStatic' );
			}
		};
		$this->assertSame( true, $base->test_stc_methods(), $this->message() );
	}

	/**
	 * @covers ::props()
	 * @covers ::own_prop_names()
	 */
	public function test_props() : void {
		$offsets    = new class extends U\A6t\Offsets {
			/**
			 * Public foo property.
			 */
			public string $public_foo = 'foo';

			/**
			 * Protected foo property.
			 */
			protected string $protected_foo = 'foo';

			/**
			 * Private foo property.
			 */
			private string $private_foo = 'foo';

			/**
			 * Public bar property.
			 */
			public string $public_bar = 'bar';

			/**
			 * Protected bar property.
			 */
			protected string $protected_bar = 'bar';

			/**
			 * Private bar property.
			 */
			private string $private_bar = 'bar';
		};
		$class_name = get_class( $offsets );

		$public_plus_props = U\Obj::props( $offsets );

		$public_props    = U\Obj::props( $offsets, 'public' );
		$protected_props = U\Obj::props( $offsets, 'protected' );
		$private_props   = U\Obj::props( $offsets, 'private' );

		$public__protected_props  = U\Obj::props( $offsets, 'public...protected' );
		$public__private_props    = U\Obj::props( $offsets, 'public...private' );
		$protected__private_props = U\Obj::props( $offsets, 'protected...private' );

		$debug_props      = U\Obj::props( $offsets, 'debug' );
		$debug_plus_props = U\Obj::props( $offsets, 'debug+' );

		$own_debug_plus_props       = U\Obj::props( $offsets, 'own:debug+' );
		$own_debug_plus_props_clean = U\Obj::props( $offsets, 'own:debug+', true );

		// `public` prop tests.

		$this->assertArrayHasKey( 'public_foo', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_foo', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $public_props, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_bar', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_bar', $public_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $public_props, $this->message() );

		// `public+` (default) tests.

		$this->assertArrayHasKey( 'public_foo', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_foo', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $public_plus_props, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_bar', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_bar', $public_plus_props, $this->message() );

		$this->assertArrayHasKey( "\0" . '+' . "\0" . 'offsets', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public_plus_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $public_plus_props, $this->message() );

		// `protected` tests.

		$this->assertArrayNotHasKey( 'public_foo', $protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $protected_props, $this->message() );

		$this->assertArrayNotHasKey( 'public_bar', $protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_bar', $protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_bar', $protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $protected_props, $this->message() );

		// `private` tests.

		$this->assertArrayNotHasKey( 'public_foo', $private_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_foo', $private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $private_props, $this->message() );

		$this->assertArrayNotHasKey( 'public_bar', $private_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_bar', $private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_bar', $private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $private_props, $this->message() );

		// `public...protected` tests.

		$this->assertArrayHasKey( 'public_foo', $public__protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $public__protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $public__protected_props, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $public__protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_bar', $public__protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_bar', $public__protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $public__protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public__protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $public__protected_props, $this->message() );

		// `public...private` tests.

		$this->assertArrayHasKey( 'public_foo', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $public__private_props, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_bar', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_bar', $public__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $public__private_props, $this->message() );

		// `protected...private` tests.

		$this->assertArrayNotHasKey( 'public_foo', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $protected__private_props, $this->message() );

		$this->assertArrayNotHasKey( 'public_bar', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_bar', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_bar', $protected__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $protected__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $protected__private_props, $this->message() );

		// `debug` tests.

		$this->assertArrayHasKey( 'public_foo', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $debug_props, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_bar', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_bar', $debug_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $debug_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $debug_props, $this->message() );

		// `debug+` tests.

		$this->assertArrayHasKey( 'public_foo', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $debug_plus_props, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_bar', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_bar', $debug_plus_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $debug_plus_props, $this->message() );

		$this->assertArrayHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $debug_plus_props, $this->message() );

		// `own:debug+` tests.

		$this->assertArrayHasKey( 'public_foo', $own_debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $own_debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $own_debug_plus_props, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $own_debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_bar', $own_debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_bar', $own_debug_plus_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $own_debug_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $own_debug_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $own_debug_plus_props, $this->message() );

		// `own:debug+` clean tests.

		$this->assertArrayHasKey( 'public_foo', $own_debug_plus_props_clean, $this->message() );
		$this->assertArrayHasKey( 'protected_foo', $own_debug_plus_props_clean, $this->message() );
		$this->assertArrayHasKey( 'private_foo', $own_debug_plus_props_clean, $this->message() );

		$this->assertArrayHasKey( 'public_bar', $own_debug_plus_props_clean, $this->message() );
		$this->assertArrayHasKey( 'protected_bar', $own_debug_plus_props_clean, $this->message() );
		$this->assertArrayHasKey( 'private_bar', $own_debug_plus_props_clean, $this->message() );

		$this->assertArrayNotHasKey( 'offsets', $own_debug_plus_props_clean, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $own_debug_plus_props_clean, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $own_debug_plus_props_clean, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'ins_cache', $own_debug_plus_props_clean, $this->message() );
	}
}
