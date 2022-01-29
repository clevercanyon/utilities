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
 * @coversDefaultClass \Clever_Canyon\Utilities\Bundle
 */
final class Bundle_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::is()
	 */
	public function test_is() : void {
		$this->assertSame( true, U\Bundle::is( (object) [] ), $this->message() );
		$this->assertSame( true, U\Bundle::is( [] ), $this->message() );

		$this->assertSame( false, U\Bundle::is( 'foo' ), $this->message() );
		$this->assertSame( false, U\Bundle::is( null ), $this->message() );
	}

	/**
	 * @covers ::empty()
	 */
	public function test_empty() : void {
		$this->assertSame( true, U\Bundle::empty( (object) [] ), $this->message() );
		$this->assertSame( false, U\Bundle::empty( (object) [ 0 ] ), $this->message() );
		$this->assertSame( false, U\Bundle::empty( (object) [ 'foo' => 'bar' ] ), $this->message() );

		$this->assertSame( true, U\Bundle::empty( [] ), $this->message() );
		$this->assertSame( false, U\Bundle::empty( [ 0 ] ), $this->message() );
		$this->assertSame( false, U\Bundle::empty( [ 'foo' => 'bar' ] ), $this->message() );
	}

	/**
	 * @covers ::get_prop_key()
	 */
	public function test_get_prop_key() : void {
		$obj = (object) [
			0      => '8fdf57c246a045d19f39f4151039499d',
			1      => '1abc7beaf3f84b88a97515d0966b0e2a',
			'foo'  => '1bbf82a4d5284c4f8e311ce02c47171a',
			'bar'  => '3f3c0384bfe84b229b50d9f07076df96',
			'baz'  => [
				'foo' => [
					'bar' => 'ec2c798411284a8580886975ceaaa0f1',
					0     => [
						'411b58f5362844e99bc8c5764f05c1cd',
						'e04536a3cc4e4a3ebe249ee86814cd15',
						'514bd81fb93f4178823c60ce3f4c86b0',
						'7ddae09c84664e72b87f95ccd1236999',
						'6186b3fd966c4c5e9d21e5bbb25ed393',
					],
				],
			],
			'foo1' => (object) [
				'foo' => [
					'bar' => '3607bd4e237a449c87b1892fc484dd53',
					0     => [
						'2947c628c9de4b4082ca47d4d47348d8',
						'7d7f581121f9405ba83d342d1c696d56',
						'a833da3000a94b76b5e175852c6ec798',
						'fde3f1d1b21641df88e619c56b1912af',
						'a9cd6e8ad5544d07a1b256ce3410ba19',
					],
				],
			],
		];
		$arr = (array) $obj; // Copy of object, as array.

		$this->assertSame( '8fdf57c246a045d19f39f4151039499d', U\Bundle::get_prop_key( $obj, '0' ), $this->message() );
		$this->assertSame( '1abc7beaf3f84b88a97515d0966b0e2a', U\Bundle::get_prop_key( $obj, '1' ), $this->message() );
		$this->assertSame( '1bbf82a4d5284c4f8e311ce02c47171a', U\Bundle::get_prop_key( $obj, 'foo' ), $this->message() );
		$this->assertSame( 'ec2c798411284a8580886975ceaaa0f1', U\Bundle::get_prop_key( $obj, 'baz.foo.bar' ), $this->message() );
		$this->assertSame( 'e04536a3cc4e4a3ebe249ee86814cd15', U\Bundle::get_prop_key( $obj, 'baz.foo.0.1' ), $this->message() );
		$this->assertSame( '7d7f581121f9405ba83d342d1c696d56', U\Bundle::get_prop_key( $obj, 'foo1.foo.0.1' ), $this->message() );

		$this->assertSame( '8fdf57c246a045d19f39f4151039499d', U\Bundle::get_prop_key( $arr, '0' ), $this->message() );
		$this->assertSame( '1abc7beaf3f84b88a97515d0966b0e2a', U\Bundle::get_prop_key( $arr, '1' ), $this->message() );
		$this->assertSame( '1bbf82a4d5284c4f8e311ce02c47171a', U\Bundle::get_prop_key( $arr, 'foo' ), $this->message() );
		$this->assertSame( 'ec2c798411284a8580886975ceaaa0f1', U\Bundle::get_prop_key( $arr, 'baz.foo.bar' ), $this->message() );
		$this->assertSame( 'e04536a3cc4e4a3ebe249ee86814cd15', U\Bundle::get_prop_key( $arr, 'baz.foo.0.1' ), $this->message() );
		$this->assertSame( '7d7f581121f9405ba83d342d1c696d56', U\Bundle::get_prop_key( $arr, 'foo1.foo.0.1' ), $this->message() );
	}

	/**
	 * @covers ::sort_by()
	 */
	public function test_sort_by() : void {
		$obj = (object) [
			'1'           => '1',
			'2'           => '2',
			'3'           => '3',
			'11'          => '11',
			'12'          => '12',
			'13'          => '13',
			'a'           => 'a',
			'b'           => 'b',
			'c'           => 'c',
			'rfc1.txt'    => 'rfc1.txt',
			'rfc2086.txt' => 'rfc2086.txt',
			'rfc822.txt'  => 'rfc822.txt',
		];
		$arr = (array) $obj; // Copy of object, as array.

		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame( [
				'1'           => '1',
				'2'           => '2',
				'3'           => '3',
				'11'          => '11',
				'12'          => '12',
				'13'          => '13',
				'a'           => 'a',
				'b'           => 'b',
				'c'           => 'c',
				'rfc1.txt'    => 'rfc1.txt',
				'rfc822.txt'  => 'rfc822.txt',
				'rfc2086.txt' => 'rfc2086.txt',
			], (array) U\Bundle::sort_by( 'prop_key', $_bundle ), $this->message() );
		}
		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame( [
				'1'           => '1',
				'2'           => '2',
				'3'           => '3',
				'11'          => '11',
				'12'          => '12',
				'13'          => '13',
				'a'           => 'a',
				'b'           => 'b',
				'c'           => 'c',
				'rfc1.txt'    => 'rfc1.txt',
				'rfc822.txt'  => 'rfc822.txt',
				'rfc2086.txt' => 'rfc2086.txt',
			], (array) U\Bundle::sort_by( 'prop_key', $_bundle, SORT_NATURAL ), $this->message() );
		}
		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame( [
				'a'           => 'a',
				'b'           => 'b',
				'c'           => 'c',
				'rfc1.txt'    => 'rfc1.txt',
				'rfc2086.txt' => 'rfc2086.txt',
				'rfc822.txt'  => 'rfc822.txt',
				'1'           => '1',
				'2'           => '2',
				'3'           => '3',
				'11'          => '11',
				'12'          => '12',
				'13'          => '13',
			], (array) U\Bundle::sort_by( 'prop_key', $_bundle, SORT_REGULAR ), $this->message() );
		}
		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame(
				array_values( [
					'1'           => '1',
					'2'           => '2',
					'3'           => '3',
					'11'          => '11',
					'12'          => '12',
					'13'          => '13',
					'a'           => 'a',
					'b'           => 'b',
					'c'           => 'c',
					'rfc1.txt'    => 'rfc1.txt',
					'rfc822.txt'  => 'rfc822.txt',
					'rfc2086.txt' => 'rfc2086.txt',
				] ), (array) U\Bundle::sort_by( 'value', $_bundle ), $this->message()
			);
		}
		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame(
				array_values( [
					'1'           => '1',
					'2'           => '2',
					'3'           => '3',
					'11'          => '11',
					'12'          => '12',
					'13'          => '13',
					'a'           => 'a',
					'b'           => 'b',
					'c'           => 'c',
					'rfc1.txt'    => 'rfc1.txt',
					'rfc822.txt'  => 'rfc822.txt',
					'rfc2086.txt' => 'rfc2086.txt',
				] ), (array) U\Bundle::sort_by( 'value', $_bundle, SORT_NATURAL ), $this->message()
			);
		}
		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame(
				array_values( [
					'1'           => '1',
					'2'           => '2',
					'3'           => '3',
					'11'          => '11',
					'12'          => '12',
					'13'          => '13',
					'a'           => 'a',
					'b'           => 'b',
					'c'           => 'c',
					'rfc1.txt'    => 'rfc1.txt',
					'rfc2086.txt' => 'rfc2086.txt',
					'rfc822.txt'  => 'rfc822.txt',
				] ), (array) U\Bundle::sort_by( 'value', $_bundle, SORT_REGULAR ), $this->message()
			);
		}
	}

	/**
	 * @covers ::clone_deep()
	 */
	public function test_clone_deep() : void {
		$foo             = 'foo'; // For testing below.
		$obj1            = new class( $foo ) extends U\A6t\Generic {
			/**
			 * Public foo prop.
			 */
			public string $public_foo;

			/**
			 * Protected foo prop.
			 */
			protected string $protected_foo;

			/**
			 * Private foo prop.
			 */
			private string $private_foo;

			/**
			 * @param string $foo By reference.
			 */
			public function __construct( &$foo ) {
				parent::__construct();
				$this->public_foo    = &$foo;
				$this->protected_foo = &$foo;
				$this->private_foo   = &$foo;
			}

			/**
			 * @return string Public foo.
			 */
			public function get_public_foo() : string {
				return $this->public_foo;
			}

			/**
			 * @return string Protected foo.
			 */
			public function get_protected_foo() : string {
				return $this->protected_foo;
			}

			/**
			 * @return string Private foo.
			 */
			public function get_private_foo() : string {
				return $this->private_foo;
			}
		};
		$obj2            = new U\Generic( [
			'foo'  => [
				'foo' => 1,
			],
			'bar'  => [
				'foo' => 2,
				'bar' => 3,
				'baz' => (object) [
					'coo' => true,
				],
			],
			'baz'  => [
				'coo' => false,
				'bar' => [
					'foo' => null,
					'coo' => 'f6930b63c1da42e58e24d0bfdebc1177',
				],
			],
			'obj1' => $obj1,
		] );
		$uncloneable_obj = new class extends \stdClass {
			/**
			 * Public foo property.
			 */
			public string $publi_foo = 'foo';

			/**
			 * Protected (uncloneable).
			 */
			protected function __clone() {}
		};
		if ( version_compare( PHP_VERSION, '8.1.0', '>=' ) ) {
			$readonly_property_obj = require U\Dir::name( __FILE__, 3 ) . '/includes/php-gte-8.1/readonly-property-obj.php';
		}
		/**
		 * @var U\I7e\Base $obj1_cln
		 * @var U\I7e\Base $obj2_cln
		 * @var \stdClass  $uncloneable_obj_cln
		 * @var U\I7e\Base $readonly_property_obj_cln
		 */
		$obj1_cln            = U\Bundle::clone_deep( $obj1 );
		$obj2_cln            = U\Bundle::clone_deep( $obj2 );
		$uncloneable_obj_cln = U\Bundle::clone_deep( $uncloneable_obj );

		$this->assertObjEquals( $obj1, $obj1_cln, $this->message() );
		$this->assertObjEquals( $obj2, $obj2_cln, $this->message() );
		$this->assertSame( get_class( $obj1 ), get_class( $obj1_cln ), $this->message() );
		$this->assertSame( get_class( $obj2 ), get_class( $obj2_cln ), $this->message() );

		$foo = 'x.foo'; // Modifies value that properties reference.
		$this->assertSame( $foo, $obj2->obj1->get_public_foo(), $this->message() );
		$this->assertSame( $foo, $obj2->obj1->get_protected_foo(), $this->message() );
		$this->assertSame( $foo, $obj2->obj1->get_private_foo(), $this->message() );

		// Should not impact clones, making objects !== to each other.
		$this->assertObjNotEquals( $obj1, $obj1_cln, $this->message() );
		$this->assertObjNotEquals( $obj2, $obj2_cln, $this->message() );
		$this->assertSame( get_class( $obj1 ), get_class( $obj1_cln ), $this->message() );
		$this->assertSame( get_class( $obj2 ), get_class( $obj2_cln ), $this->message() );

		$this->assertSame( get_object_vars( $uncloneable_obj ), get_object_vars( $uncloneable_obj_cln ), $this->message() );

		if ( isset( $readonly_property_obj ) ) {
			$readonly_property_obj_cln = U\Bundle::clone_deep( $readonly_property_obj );
			$this->assertObjEquals( $readonly_property_obj, $readonly_property_obj_cln, $this->message() );
			$this->assertSame( get_class( $readonly_property_obj ), get_class( $readonly_property_obj_cln ), $this->message() );
		}
	}

	/**
	 * @covers ::stringify()
	 */
	public function test_stringify() : void {
		$obj = (object) [
			'foo' => [
				'foo' => 1,
			],
			'bar' => [
				'foo' => 2,
				'bar' => 3,
				'baz' => [
					'coo' => true,
				],
			],
			'baz' => [
				'coo' => false,
				'bar' => [
					'foo' => null,
					'coo' => 'f6930b63c1da42e58e24d0bfdebc1177',
				],
			],
		];
		$arr = (array) $obj; // Copy of object, as an array.

		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame(
				[
					'foo' => [
						'foo' => '1',
					],
					'bar' => [
						'foo' => '2',
						'bar' => '3',
						'baz' => [
							'coo' => '1',
						],
					],
					'baz' => [
						'coo' => '',
						'bar' => [
							'foo' => '',
							'coo' => 'f6930b63c1da42e58e24d0bfdebc1177',
						],
					],
				], (array) U\Bundle::stringify( $_bundle ), $this->message()
			);
		}
	}

	/**
	 * @covers ::merge()
	 */
	public function test_merge() : void {
		$obj1 = (object) [
			0      => '8fdf57c246a045d19f39f4151039499d',
			1      => '1abc7beaf3f84b88a97515d0966b0e2a',
			'foo'  => '1bbf82a4d5284c4f8e311ce02c47171a',
			'bar'  => '3f3c0384bfe84b229b50d9f07076df96',
			'baz'  => [
				'foo' => [
					'bar' => 'ec2c798411284a8580886975ceaaa0f1',
					0     => [
						'411b58f5362844e99bc8c5764f05c1cd',
						'e04536a3cc4e4a3ebe249ee86814cd15',
						'514bd81fb93f4178823c60ce3f4c86b0',
						'7ddae09c84664e72b87f95ccd1236999',
						'6186b3fd966c4c5e9d21e5bbb25ed393',
					],
				],
			],
			'foo1' => [
				'foo' => [
					'bar' => '3607bd4e237a449c87b1892fc484dd53',
					0     => [
						'2947c628c9de4b4082ca47d4d47348d8',
						'7d7f581121f9405ba83d342d1c696d56',
						'a833da3000a94b76b5e175852c6ec798',
						'fde3f1d1b21641df88e619c56b1912af',
						'a9cd6e8ad5544d07a1b256ce3410ba19',
					],
				],
			],
		];
		$arr1 = (array) $obj1; // Copy of object, as array.

		$obj2 = (object) [
			0      => 'a89aaefb30524d2e8a9cbe50e0e9adb2',
			1      => 'dffc962e13bd4cccb7f81ac846453095',
			'foo'  => 'ff81613a790e449a82c7a789f9dc94b2',
			'bar'  => 'c250dbfbbec943558e37a8bbaeab8660',
			'baz'  => [
				'foo' => [
					'bar' => '36c6ddacba814242b456be32767be34d',
					0     => [
						'003873769fb2491c8786c12b19c6f852',
						'c3f654020fed477698619b13d6d61a19',
						'dffdc66465fd4887ad1fdf1abf30de01',
						'506b2426b18945379d609586f1b4dabf',
						'8e232a14c3a741408e14945ad6f45464',
					],
					1     => [
						'02fe64dab9d9492ca0b616e2bae6a90a',
						'$set'   => [
							'foo' => [
								'bar' => 'ac176cfd36b441568f95be347cdc55ea',
								'baz' => '37176dda9b2f4b10b2c5fa86b1ff488f',
							],
						],
						'bar'    => '576868e375554b09bf9ba860f8f329d7',
						'baz'    => [
							'$leave' => [ 'cuz', 'doo' ],
						],
						'coo'    => '71343e39f4c943628eca7e9a441c7129',
						'$unset' => [ 'bar', 'coo' ],
					],
					'one' => [
						'afb5899d8a704751a053f8e4d03bc57c',
						'foo' => [
							'$concat' => [
								'bar' => '4cda15502b014176b052eff977a79dd0',
								'baz' => '6413da98df574b27946cc50138a07fe3',
								'coo' => 'b50591b07d484be08431c1c149503411',
								'cuz' => '80b750ff968e49d4a957b5a9e396abfb',
							],
						],
						'bar' => '5e32015892c74d4a8650cb89442390e5',
						'baz' => [
							'$push' => [
								'coo' => 'f567626af1e14f32b94c51029ed9b911',
								'cuz' => '6d89597b27b042c0afb30535617a57b9',
								'doo' => '380748133e774acf8fc71187b8bd32c6',
								'duz' => '5b513d20bf9f482d8f044df2a40d77ea',
							],
						],
						'coo' => '3dcfd6a6422141e18ada548e4416b16b',
					],
				],
			],
			'foo1' => [
				'foo' => [
					'bar'     => '2b22ec9e8b184fc5ab4e16ae634c1a98',
					0         => [
						'22554d4ac1f04155b158975261ae5703',
						'31f5e21280fe4a4b9959d62262390998',
						'd5390badb5e9424196680bc1c530a33d',
						'5893a357f40b447289c3130442167f9c',
						'daefb98b0d2a460482ad2c0072bf8eb5',
					],
					'$push'   => [
						1 => [
							'44d55453a3ae4375b73fd93310c02b41',
							'f26e276918a74e0788a8048a1619ee3e',
						],
					],
					'$concat' => [
						'one' => [
							'cef19dc57a9b48668f2a291eb5a8da94',
							'9c51d82d6eb243d8915c97112c34fa5f',
						],
					],
				],
			],
		];
		$arr2 = (array) $obj2; // Copy of object, as array.

		foreach ( [ [ $obj1, $obj2 ], [ $arr1, $arr2 ] ] as $_bundle ) {
			$this->assertSame(
				[
					0      => 'a89aaefb30524d2e8a9cbe50e0e9adb2',
					1      => 'dffc962e13bd4cccb7f81ac846453095',
					'foo'  => 'ff81613a790e449a82c7a789f9dc94b2',
					'bar'  => 'c250dbfbbec943558e37a8bbaeab8660',
					'baz'  => [
						'foo' => [
							'bar' => '36c6ddacba814242b456be32767be34d',
							0     => [
								'003873769fb2491c8786c12b19c6f852',
								'c3f654020fed477698619b13d6d61a19',
								'dffdc66465fd4887ad1fdf1abf30de01',
								'506b2426b18945379d609586f1b4dabf',
								'8e232a14c3a741408e14945ad6f45464',
							],
							1     => [
								'02fe64dab9d9492ca0b616e2bae6a90a',
								'$set'   => [
									'foo' => [
										'bar' => 'ac176cfd36b441568f95be347cdc55ea',
										'baz' => '37176dda9b2f4b10b2c5fa86b1ff488f',
									],
								],
								'bar'    => '576868e375554b09bf9ba860f8f329d7',
								'baz'    => [
									'$leave' => [ 'cuz', 'doo' ],
								],
								'coo'    => '71343e39f4c943628eca7e9a441c7129',
								'$unset' => [ 'bar', 'coo' ],
							],
							'one' => [
								'afb5899d8a704751a053f8e4d03bc57c',
								'foo' => [
									'$concat' => [
										'bar' => '4cda15502b014176b052eff977a79dd0',
										'baz' => '6413da98df574b27946cc50138a07fe3',
										'coo' => 'b50591b07d484be08431c1c149503411',
										'cuz' => '80b750ff968e49d4a957b5a9e396abfb',
									],
								],
								'bar' => '5e32015892c74d4a8650cb89442390e5',
								'baz' => [
									'$push' => [
										'coo' => 'f567626af1e14f32b94c51029ed9b911',
										'cuz' => '6d89597b27b042c0afb30535617a57b9',
										'doo' => '380748133e774acf8fc71187b8bd32c6',
										'duz' => '5b513d20bf9f482d8f044df2a40d77ea',
									],
								],
								'coo' => '3dcfd6a6422141e18ada548e4416b16b',
							],
						],
					],
					'foo1' => [
						'foo' => [
							'bar'     => '2b22ec9e8b184fc5ab4e16ae634c1a98',
							0         => [
								'22554d4ac1f04155b158975261ae5703',
								'31f5e21280fe4a4b9959d62262390998',
								'd5390badb5e9424196680bc1c530a33d',
								'5893a357f40b447289c3130442167f9c',
								'daefb98b0d2a460482ad2c0072bf8eb5',
							],
							'$push'   => [
								1 => [
									'44d55453a3ae4375b73fd93310c02b41',
									'f26e276918a74e0788a8048a1619ee3e',
								],
							],
							'$concat' => [
								'one' => [
									'cef19dc57a9b48668f2a291eb5a8da94',
									'9c51d82d6eb243d8915c97112c34fa5f',
								],
							],
						],
					],
				], (array) U\Bundle::merge( $_bundle[ 0 ], $_bundle[ 1 ] ), $this->message()
			);
		}
	}

	/**
	 * @covers ::super_merge()
	 */
	public function test_super_merge() : void {
		$obj1 = new U\Generic( [
			0      => '8fdf57c246a045d19f39f4151039499d',
			1      => '1abc7beaf3f84b88a97515d0966b0e2a',
			'foo'  => '1bbf82a4d5284c4f8e311ce02c47171a',
			'bar'  => '3f3c0384bfe84b229b50d9f07076df96',
			'baz'  => new U\Generic( [
				'foo' => [
					'bar' => 'ec2c798411284a8580886975ceaaa0f1',
					0     => [
						'411b58f5362844e99bc8c5764f05c1cd',
						'e04536a3cc4e4a3ebe249ee86814cd15',
						'514bd81fb93f4178823c60ce3f4c86b0',
						'7ddae09c84664e72b87f95ccd1236999',
						'6186b3fd966c4c5e9d21e5bbb25ed393',
					],
					1     => [
						'8705edccb81a435cb80a0bd447c80307',
						'foo' => [
							'bar' => '511e29a035b64f0ea00f40e03a779a13',
							'baz' => '3e72f99574174f0e8c329d8bee6b846a',
							'coo' => '7f3d7bb8786d4826a4c4791cbd3c450e',
							'cuz' => 'f0fdaf077c964fa4be4cffe18149e0bd',
						],
						'bar' => '5063964f47c642dbbc19646aac35b376',
						'baz' => [
							'coo' => '896b1ec6a2e14bfeb0a8c13693a071aa',
							'cuz' => 'd9b4d5f2a9ce4659b8f24d604bc80a27',
							'doo' => 'bd90e910b7254c9f9ca804818f955c2f',
							'duz' => '3000cab9820e452784a9c8d68833f48e',
						],
						'coo' => '63129a2c3c2e42bcae67ed0aecd70270',
					],
					'one' => [
						'48e107674ab14889a041ea05acb7eb55',
						'foo' => [
							'bar' => '8edf599f1e8f4d78ae0974ba595b62fb',
							'baz' => 'd414390027de452588bf322f789ee52b',
							'coo' => '159d5cde34e6416bb463077a07b585f5',
							'cuz' => 'f43f0a1de5ac484eba48f6c4bb1d2112',
						],
						'bar' => '822e981bff124ee1b093dc5247aa8539',
						'baz' => [
							'coo' => 'a56411d368fb49648961d961b325691b',
							'cuz' => '38640263b7054d8eaeea4e95a6add386',
							'doo' => 'efd208f11994456c9d1561013533bed1',
							'duz' => '279456e85a1c4c5db5c117b02cf86b89',
						],
						'coo' => '0aa8a7fc710f4d6f89e3aa1390a0a4b6',
					],
					'two' => [
						'$extends' => [ 'baz.foo.one' ],
						'$unset'   => [ 0 ],
					],
				],
			] ),
			'foo1' => [
				'foo' => [
					'bar' => '3607bd4e237a449c87b1892fc484dd53',
					0     => [
						'2947c628c9de4b4082ca47d4d47348d8',
						'7d7f581121f9405ba83d342d1c696d56',
						'a833da3000a94b76b5e175852c6ec798',
						'fde3f1d1b21641df88e619c56b1912af',
						'a9cd6e8ad5544d07a1b256ce3410ba19',
					],
					1     => [
						'05244c716d934c2c996efdbe091f970e',
						'09b26b95e8c94ddd8cb46d26d4034598',
						'5d42b68f3e7f442bb135fac81daef613',
						'fea34b7320c74159a9a33eb2ce2a4bcd',
						'1bfcf03f3c2d41469629a156479918d5',
					],
					'one' => [
						'9a06c069bb9f4670838367f3d34f45ed',
						'8ba65e687f1b4bd6ae4b5fcbf118c420',
						'2699847d3c254dbaa4438a00da23d454',
						'01969da011734e2bad2a7e15a784af14',
						'ea67e58bcf0f4f4bbd8a703bbbb51b37',
					],
				],
			],
		] );
		$arr1 = $obj1->props(); // Copy of object, as array.

		$obj2 = new U\Generic( [
			0      => 'a89aaefb30524d2e8a9cbe50e0e9adb2',
			1      => 'dffc962e13bd4cccb7f81ac846453095',
			'foo'  => 'ff81613a790e449a82c7a789f9dc94b2',
			'bar'  => 'c250dbfbbec943558e37a8bbaeab8660',
			'baz'  => new U\Generic( [
				'foo' => [
					'bar' => '36c6ddacba814242b456be32767be34d',
					0     => [
						'003873769fb2491c8786c12b19c6f852',
						'c3f654020fed477698619b13d6d61a19',
						'dffdc66465fd4887ad1fdf1abf30de01',
						'506b2426b18945379d609586f1b4dabf',
						'8e232a14c3a741408e14945ad6f45464',
					],
					1     => [
						'02fe64dab9d9492ca0b616e2bae6a90a',
						'$set'   => [
							'foo' => [
								'bar' => 'ac176cfd36b441568f95be347cdc55ea',
								'baz' => '37176dda9b2f4b10b2c5fa86b1ff488f',
							],
						],
						'bar'    => '576868e375554b09bf9ba860f8f329d7',
						'baz'    => [
							'$leave' => [ 'cuz', 'doo' ],
						],
						'coo'    => '71343e39f4c943628eca7e9a441c7129',
						'$unset' => [ 'bar', 'coo' ],
					],
					'one' => [
						'afb5899d8a704751a053f8e4d03bc57c',
						'$concat' => [
							'foo' => [
								'bar' => '4cda15502b014176b052eff977a79dd0',
								'baz' => '6413da98df574b27946cc50138a07fe3',
								'coo' => 'b50591b07d484be08431c1c149503411',
								'cuz' => '80b750ff968e49d4a957b5a9e396abfb',
							],
						],
						'bar'     => '5e32015892c74d4a8650cb89442390e5',
						'$push'   => [
							'baz' => [
								'coo' => 'f567626af1e14f32b94c51029ed9b911',
								'cuz' => '6d89597b27b042c0afb30535617a57b9',
								'doo' => '380748133e774acf8fc71187b8bd32c6',
								'duz' => '5b513d20bf9f482d8f044df2a40d77ea',
							],
						],
						'coo'     => '3dcfd6a6422141e18ada548e4416b16b',
					],
				],
			] ),
			'foo1' => [
				'foo' => [
					'bar'     => '2b22ec9e8b184fc5ab4e16ae634c1a98',
					0         => [
						'22554d4ac1f04155b158975261ae5703',
						'31f5e21280fe4a4b9959d62262390998',
						'd5390badb5e9424196680bc1c530a33d',
						'5893a357f40b447289c3130442167f9c',
						'daefb98b0d2a460482ad2c0072bf8eb5',
					],
					'$push'   => [
						1 => [
							'44d55453a3ae4375b73fd93310c02b41',
							'f26e276918a74e0788a8048a1619ee3e',
						],
					],
					'$concat' => [
						'one' => [
							'cef19dc57a9b48668f2a291eb5a8da94',
							'9c51d82d6eb243d8915c97112c34fa5f',
						],
					],
				],
			],
		] );
		$arr2 = $obj2->props(); // Copy of object, as array.

		foreach ( [ [ $obj1, $obj2 ], [ $arr1, $arr2 ] ] as $_bundle ) {
			$_new_bundle = U\Bundle::super_merge( $_bundle[ 0 ], $_bundle[ 1 ] );                                                                                      // Tests input both as an object and array.
			$_new_bundle = is_array( $_bundle[ 0 ] ) ? new U\Generic( $_new_bundle ) : $_new_bundle;                                                                   // Converts back to `Generic` for comparison.

			$this->assertObjEquals(
				new U\Generic( [
					0      => 'a89aaefb30524d2e8a9cbe50e0e9adb2',
					1      => 'dffc962e13bd4cccb7f81ac846453095',
					'foo'  => 'ff81613a790e449a82c7a789f9dc94b2',
					'bar'  => 'c250dbfbbec943558e37a8bbaeab8660',
					'baz'  => new U\Generic( [
						'foo' => [
							'bar' => '36c6ddacba814242b456be32767be34d',
							0     => [
								'003873769fb2491c8786c12b19c6f852',
								'c3f654020fed477698619b13d6d61a19',
								'dffdc66465fd4887ad1fdf1abf30de01',
								'506b2426b18945379d609586f1b4dabf',
								'8e232a14c3a741408e14945ad6f45464',
							],
							1     => [
								'02fe64dab9d9492ca0b616e2bae6a90a',
								'foo' => [
									'bar' => 'ac176cfd36b441568f95be347cdc55ea',
									'baz' => '37176dda9b2f4b10b2c5fa86b1ff488f',
								],
								'baz' => [
									'cuz' => 'd9b4d5f2a9ce4659b8f24d604bc80a27',
									'doo' => 'bd90e910b7254c9f9ca804818f955c2f',
								],
							],
							'one' => [
								'afb5899d8a704751a053f8e4d03bc57c',
								'foo' => [
									'bar' => '4cda15502b014176b052eff977a79dd0',
									'baz' => '6413da98df574b27946cc50138a07fe3',
									'coo' => 'b50591b07d484be08431c1c149503411',
									'cuz' => '80b750ff968e49d4a957b5a9e396abfb',
								],
								'bar' => '5e32015892c74d4a8650cb89442390e5',
								'baz' => [
									'coo' => 'a56411d368fb49648961d961b325691b',
									'cuz' => '38640263b7054d8eaeea4e95a6add386',
									'doo' => 'efd208f11994456c9d1561013533bed1',
									'duz' => '279456e85a1c4c5db5c117b02cf86b89',
									0     => [
										'coo' => 'f567626af1e14f32b94c51029ed9b911',
										'cuz' => '6d89597b27b042c0afb30535617a57b9',
										'doo' => '380748133e774acf8fc71187b8bd32c6',
										'duz' => '5b513d20bf9f482d8f044df2a40d77ea',
									],
								],
								'coo' => '3dcfd6a6422141e18ada548e4416b16b',
							],
							'two' => [
								'foo' => [
									'bar' => '8edf599f1e8f4d78ae0974ba595b62fb',
									'baz' => 'd414390027de452588bf322f789ee52b',
									'coo' => '159d5cde34e6416bb463077a07b585f5',
									'cuz' => 'f43f0a1de5ac484eba48f6c4bb1d2112',
								],
								'bar' => '822e981bff124ee1b093dc5247aa8539',
								'baz' => [
									'coo' => 'a56411d368fb49648961d961b325691b',
									'cuz' => '38640263b7054d8eaeea4e95a6add386',
									'doo' => 'efd208f11994456c9d1561013533bed1',
									'duz' => '279456e85a1c4c5db5c117b02cf86b89',
								],
								'coo' => '0aa8a7fc710f4d6f89e3aa1390a0a4b6',
							],
						],
					] ),
					'foo1' => [
						'foo' => [
							'bar' => '2b22ec9e8b184fc5ab4e16ae634c1a98',
							0     => [
								'22554d4ac1f04155b158975261ae5703',
								'31f5e21280fe4a4b9959d62262390998',
								'd5390badb5e9424196680bc1c530a33d',
								'5893a357f40b447289c3130442167f9c',
								'daefb98b0d2a460482ad2c0072bf8eb5',
							],
							1     => [
								'05244c716d934c2c996efdbe091f970e',
								'09b26b95e8c94ddd8cb46d26d4034598',
								'5d42b68f3e7f442bb135fac81daef613',
								'fea34b7320c74159a9a33eb2ce2a4bcd',
								'1bfcf03f3c2d41469629a156479918d5',
								[
									'44d55453a3ae4375b73fd93310c02b41',
									'f26e276918a74e0788a8048a1619ee3e',
								],
							],
							'one' => [
								'9a06c069bb9f4670838367f3d34f45ed',
								'8ba65e687f1b4bd6ae4b5fcbf118c420',
								'2699847d3c254dbaa4438a00da23d454',
								'01969da011734e2bad2a7e15a784af14',
								'ea67e58bcf0f4f4bbd8a703bbbb51b37',

								'cef19dc57a9b48668f2a291eb5a8da94',
								'9c51d82d6eb243d8915c97112c34fa5f',
							],
						],
					],
				] ), $_new_bundle, $this->message()
			);
		}
	}

	/**
	 * @covers ::resolve_env_vars()
	 */
	public function test_resolve_env_vars() : void {
		$obj = (object) [
			'~/'        => '~/',
			'HOME'      => '${HOME}',
			'USER'      => '${USER}',
			'CUSTOM'    => '${CUSTOM}',
			'UNDEFINED' => '${UNDEFINED}',

			'foo' => [
				'~/'        => '~/',
				'HOME'      => '${HOME}',
				'USER'      => '${USER}',
				'CUSTOM'    => '${CUSTOM}',
				'UNDEFINED' => '${UNDEFINED}',

				'bar' => [
					'~/'        => '~/',
					'HOME'      => '${HOME}',
					'USER'      => '${USER}',
					'CUSTOM'    => '${CUSTOM}',
					'UNDEFINED' => '${UNDEFINED}',
				],
			],
		];
		$arr = (array) $obj; // Copy of object, as an array.

		foreach ( [ $obj, $arr ] as $_bundle ) {
			$this->assertSame(
				[
					'~/'        => U\Dir::join_ets( U\Env::var( 'HOME' ), '/' ),
					'HOME'      => U\Env::var( 'HOME' ),
					'USER'      => U\Env::var( 'USER' ),
					'CUSTOM'    => 'c3a40ac43e52426565',
					'UNDEFINED' => '',

					'foo' => [
						'~/'        => U\Dir::join_ets( U\Env::var( 'HOME' ), '/' ),
						'HOME'      => U\Env::var( 'HOME' ),
						'USER'      => U\Env::var( 'USER' ),
						'CUSTOM'    => 'c3a40ac43e52426565',
						'UNDEFINED' => '',

						'bar' => [
							'~/'        => U\Dir::join_ets( U\Env::var( 'HOME' ), '/' ),
							'HOME'      => U\Env::var( 'HOME' ),
							'USER'      => U\Env::var( 'USER' ),
							'CUSTOM'    => 'c3a40ac43e52426565',
							'UNDEFINED' => '',
						],
					],
				], (array) U\Bundle::resolve_env_vars( $_bundle, [ 'CUSTOM' => 'c3a40ac43e52426565' ] ), $this->message()
			);
		}
	}

	/**
	 * @covers ::map()
	 */
	public function test_map() : void {
		$obj = (object) [
			0      => ' a89aaefb30524d2e8a9cbe50e0e9adb2 ',
			1      => ' dffc962e13bd4cccb7f81ac846453095 ',
			'foo'  => ' ff81613a790e449a82c7a789f9dc94b2 ',
			'bar'  => ' c250dbfbbec943558e37a8bbaeab8660 ',
			'baz'  => [
				'foo' => [
					'bar' => ' 36c6ddacba814242b456be32767be34d ',
					0     => [
						' 003873769fb2491c8786c12b19c6f852 ',
						' c3f654020fed477698619b13d6d61a19 ',
						' dffdc66465fd4887ad1fdf1abf30de01 ',
						' 506b2426b18945379d609586f1b4dabf ',
						' 8e232a14c3a741408e14945ad6f45464 ',
					],
				],
			],
			'foo1' => [
				'foo' => [
					'bar' => ' 2b22ec9e8b184fc5ab4e16ae634c1a98 ',
					0     => [
						' 22554d4ac1f04155b158975261ae5703 ',
						' 31f5e21280fe4a4b9959d62262390998 ',
						' d5390badb5e9424196680bc1c530a33d ',
						' 5893a357f40b447289c3130442167f9c ',
						' daefb98b0d2a460482ad2c0072bf8eb5 ',
					],
				],
			],
		];
		$arr = (array) $obj; // Copy of object, as an array.

		foreach ( [ $obj, $arr ] as $_bundle ) {
			$_expect_array = [
				0      => 'a89aaefb30524d2e8a9cbe50e0e9adb2',
				1      => 'dffc962e13bd4cccb7f81ac846453095',
				'foo'  => 'ff81613a790e449a82c7a789f9dc94b2',
				'bar'  => 'c250dbfbbec943558e37a8bbaeab8660',
				'baz'  => [
					'foo' => [
						'bar' => '36c6ddacba814242b456be32767be34d',
						0     => [
							'003873769fb2491c8786c12b19c6f852',
							'c3f654020fed477698619b13d6d61a19',
							'dffdc66465fd4887ad1fdf1abf30de01',
							'506b2426b18945379d609586f1b4dabf',
							'8e232a14c3a741408e14945ad6f45464',
						],
					],
				],
				'foo1' => [
					'foo' => [
						'bar' => '2b22ec9e8b184fc5ab4e16ae634c1a98',
						0     => [
							'22554d4ac1f04155b158975261ae5703',
							'31f5e21280fe4a4b9959d62262390998',
							'd5390badb5e9424196680bc1c530a33d',
							'5893a357f40b447289c3130442167f9c',
							'daefb98b0d2a460482ad2c0072bf8eb5',
						],
					],
				],
			];
			$this->assertSame( $_expect_array, (array) U\Bundle::map( 'trim', $_bundle ), $this->message() );
			$this->assertSame(
				[ $_expect_array, $_expect_array ],
				array_map( function ( $bundle ) {
					return (array) $bundle;
				}, U\Bundle::map( 'trim', $_bundle, $_bundle ) ), $this->message()
			);
		}
	}
}
