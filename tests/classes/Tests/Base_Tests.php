<?php
/**
 * CLEVER CANYON™ {@see https://clevercanyon.com}
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
namespace Clever_Canyon\Utilities__Tests\Tests;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};
use Clever_Canyon\{Utilities__Tests as UT};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\A6t\Base
 */
final class Base_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::props()
	 */
	public function test_props() : void {
		$offsets    = new class extends U\A6t\Offsets {
			/**
			 * Public property.
			 */
			public string $public_foo = 'foo';

			/**
			 * Protected property.
			 */
			protected string $protected_foo = 'foo';

			/**
			 * Private property.
			 */
			private string $private_foo = 'foo';

			/**
			 * Public clone property.
			 */
			public object $public_clone;

			/**
			 * Protected clone property.
			 */
			protected object $protected_clone;

			/**
			 * Private clone property.
			 */
			private object $private_clone;

			/**
			 * Constructor.
			 */
			public function __construct() {
				parent::__construct();

				$this->public_clone    = clone $this;
				$this->protected_clone = clone $this;
				$this->private_clone   = clone $this;
			}
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

		// `public` prop tests.

		$this->assertArrayHasKey( 'public_foo', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_foo', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $public_props, $this->message() );

		$this->assertArrayHasKey( 'public_clone', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_clone', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_clone', $public_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $public_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $public_props, $this->message() );

		// `public+` (default) tests.

		$this->assertArrayHasKey( 'public_foo', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_foo', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $public_plus_props, $this->message() );

		$this->assertArrayHasKey( 'public_clone', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_clone', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_clone', $public_plus_props, $this->message() );

		$this->assertArrayHasKey( "\0" . '+' . "\0" . 'offsets', $public_plus_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public_plus_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $public_plus_props, $this->message() );

		// `protected` tests.

		$this->assertArrayNotHasKey( 'public_foo', $protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $protected_props, $this->message() );

		$this->assertArrayNotHasKey( 'public_clone', $protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_clone', $protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_clone', $protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $protected_props, $this->message() );

		// `private` tests.

		$this->assertArrayNotHasKey( 'public_foo', $private_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_foo', $private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $private_props, $this->message() );

		$this->assertArrayNotHasKey( 'public_clone', $private_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . '*' . "\0" . 'protected_clone', $private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_clone', $private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $private_props, $this->message() );

		// `public...protected` tests.

		$this->assertArrayHasKey( 'public_foo', $public__protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $public__protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_foo', $public__protected_props, $this->message() );

		$this->assertArrayHasKey( 'public_clone', $public__protected_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_clone', $public__protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . $class_name . "\0" . 'private_clone', $public__protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $public__protected_props, $this->message() );
		$this->assertArrayNotHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public__protected_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $public__protected_props, $this->message() );

		// `public...private` tests.

		$this->assertArrayHasKey( 'public_foo', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $public__private_props, $this->message() );

		$this->assertArrayHasKey( 'public_clone', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_clone', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_clone', $public__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $public__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $public__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $public__private_props, $this->message() );

		// `protected...private` tests.

		$this->assertArrayNotHasKey( 'public_foo', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $protected__private_props, $this->message() );

		$this->assertArrayNotHasKey( 'public_clone', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_clone', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_clone', $protected__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $protected__private_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $protected__private_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $protected__private_props, $this->message() );

		// `debug` tests.

		$this->assertArrayHasKey( 'public_foo', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $debug_props, $this->message() );

		$this->assertArrayHasKey( 'public_clone', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_clone', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_clone', $debug_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $debug_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $debug_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $debug_props, $this->message() );

		// `debug+` tests.

		$this->assertArrayHasKey( 'public_foo', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_foo', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_foo', $debug_plus_props, $this->message() );

		$this->assertArrayHasKey( 'public_clone', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . '*' . "\0" . 'protected_clone', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . $class_name . "\0" . 'private_clone', $debug_plus_props, $this->message() );

		$this->assertArrayNotHasKey( "\0" . '+' . "\0" . 'offsets', $debug_plus_props, $this->message() );
		$this->assertArrayHasKey( "\0" . U\A6t\Offsets::class . "\0" . 'offsets', $debug_plus_props, $this->message() );

		$this->assertArrayHasKey( "\0" . U\A6t\Base::class . "\0" . 'obj_cache', $debug_plus_props, $this->message() );
	}
}
