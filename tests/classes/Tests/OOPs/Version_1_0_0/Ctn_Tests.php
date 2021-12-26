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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities__Tests\Tests\OOPs\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\OOPs\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Exception};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\OOPs\Version_1_0_0\Ctn
 */
final class Ctn_Tests extends \Clever_Canyon\Utilities__Tests\Framework\Version_1_0_0\Base {
	/**
	 * @covers ::is()
	 */
	public function test_is() : void {
		$this->assertSame( true, U\Ctn::is( (object) [] ), $this->message() );
		$this->assertSame( true, U\Ctn::is( [] ), $this->message() );

		$this->assertSame( false, U\Ctn::is( 'foo' ), $this->message() );
		$this->assertSame( false, U\Ctn::is( null ), $this->message() );
	}

	/**
	 * @covers ::empty()
	 */
	public function test_empty() : void {
		$this->assertSame( true, U\Ctn::empty( (object) [] ), $this->message() );
		$this->assertSame( false, U\Ctn::empty( (object) [ 0 ] ), $this->message() );
		$this->assertSame( false, U\Ctn::empty( (object) [ 'foo' => 'bar' ] ), $this->message() );

		$this->assertSame( true, U\Ctn::empty( [] ), $this->message() );
		$this->assertSame( false, U\Ctn::empty( [ 0 ] ), $this->message() );
		$this->assertSame( false, U\Ctn::empty( [ 'foo' => 'bar' ] ), $this->message() );
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

		$this->assertSame( '8fdf57c246a045d19f39f4151039499d', U\Ctn::get_prop_key( $obj, '0' ), $this->message() );
		$this->assertSame( '1abc7beaf3f84b88a97515d0966b0e2a', U\Ctn::get_prop_key( $obj, '1' ), $this->message() );
		$this->assertSame( '1bbf82a4d5284c4f8e311ce02c47171a', U\Ctn::get_prop_key( $obj, 'foo' ), $this->message() );
		$this->assertSame( 'ec2c798411284a8580886975ceaaa0f1', U\Ctn::get_prop_key( $obj, 'baz.foo.bar' ), $this->message() );
		$this->assertSame( 'e04536a3cc4e4a3ebe249ee86814cd15', U\Ctn::get_prop_key( $obj, 'baz.foo.0.1' ), $this->message() );
		$this->assertSame( '7d7f581121f9405ba83d342d1c696d56', U\Ctn::get_prop_key( $obj, 'foo1.foo.0.1' ), $this->message() );

		$this->assertSame( '8fdf57c246a045d19f39f4151039499d', U\Ctn::get_prop_key( $arr, '0' ), $this->message() );
		$this->assertSame( '1abc7beaf3f84b88a97515d0966b0e2a', U\Ctn::get_prop_key( $arr, '1' ), $this->message() );
		$this->assertSame( '1bbf82a4d5284c4f8e311ce02c47171a', U\Ctn::get_prop_key( $arr, 'foo' ), $this->message() );
		$this->assertSame( 'ec2c798411284a8580886975ceaaa0f1', U\Ctn::get_prop_key( $arr, 'baz.foo.bar' ), $this->message() );
		$this->assertSame( 'e04536a3cc4e4a3ebe249ee86814cd15', U\Ctn::get_prop_key( $arr, 'baz.foo.0.1' ), $this->message() );
		$this->assertSame( '7d7f581121f9405ba83d342d1c696d56', U\Ctn::get_prop_key( $arr, 'foo1.foo.0.1' ), $this->message() );
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

		foreach ( [ $obj, $arr ] as $_ctn ) {
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
			], (array) U\Ctn::sort_by( 'prop_key', $_ctn ), $this->message() );
		}
		foreach ( [ $obj, $arr ] as $_ctn ) {
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
			], (array) U\Ctn::sort_by( 'prop_key', $_ctn, SORT_NATURAL ), $this->message() );
		}
		foreach ( [ $obj, $arr ] as $_ctn ) {
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
			], (array) U\Ctn::sort_by( 'prop_key', $_ctn, SORT_REGULAR ), $this->message() );
		}
		foreach ( [ $obj, $arr ] as $_ctn ) {
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
				] ), (array) U\Ctn::sort_by( 'value', $_ctn ), $this->message()
			);
		}
		foreach ( [ $obj, $arr ] as $_ctn ) {
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
				] ), (array) U\Ctn::sort_by( 'value', $_ctn, SORT_NATURAL ), $this->message()
			);
		}
		foreach ( [ $obj, $arr ] as $_ctn ) {
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
				] ), (array) U\Ctn::sort_by( 'value', $_ctn, SORT_REGULAR ), $this->message()
			);
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

		foreach ( [ $obj, $arr ] as $_ctn ) {
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
				], (array) U\Ctn::stringify( $_ctn ), $this->message()
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
		$arr2 = (array) $obj2; // Copy of object, as array.

		foreach ( [ [ $obj1, $obj2 ], [ $arr1, $arr2 ] ] as $_ctn ) {
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
				], (array) U\Ctn::merge( $_ctn[ 0 ], $_ctn[ 1 ] ), $this->message()
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

		foreach ( [ $obj, $arr ] as $_ctn ) {
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
				], (array) U\Ctn::resolve_env_vars( $_ctn, [ 'CUSTOM' => 'c3a40ac43e52426565' ] ), $this->message()
			);
		}
	}

	/**
	 * @covers ::resolve_extends()
	 */
	public function test_resolve_extends() : void {
		$obj = (object) [
			'foo' => [
				'foo' => '3d4a3ff8f6704785bc75ac991b8c5499',
			],
			'bar' => [
				'@extends' => [ 'foo' ],
				'bar'      => '5a36d1e20e2d496ab9bd88e24727ef79',
				'baz'      => [
					'coo' => 'f6930b63c1da42e58e24d0bfdebc1177',
				],
			],
			'baz' => [
				'@extends' => [ 'bar.baz' ],
				'bar'      => [
					'@extends' => [ 'foo', 'bar.baz' ],
				],
			],
		];
		$arr = (array) $obj; // Copy of object, as an array.

		foreach ( [ $obj, $arr ] as $_ctn ) {
			$this->assertSame(
				[
					'foo' => [
						'foo' => '3d4a3ff8f6704785bc75ac991b8c5499',
					],
					'bar' => [
						'foo' => '3d4a3ff8f6704785bc75ac991b8c5499',
						'bar' => '5a36d1e20e2d496ab9bd88e24727ef79',
						'baz' => [
							'coo' => 'f6930b63c1da42e58e24d0bfdebc1177',
						],
					],
					'baz' => [
						'coo' => 'f6930b63c1da42e58e24d0bfdebc1177',
						'bar' => [
							'foo' => '3d4a3ff8f6704785bc75ac991b8c5499',
							'coo' => 'f6930b63c1da42e58e24d0bfdebc1177',
						],
					],
				], (array) U\Ctn::resolve_extends( $_ctn ), $this->message()
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

		foreach ( [ $obj, $arr ] as $_ctn ) {
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
			$this->assertSame( $_expect_array, (array) U\Ctn::map( 'trim', $_ctn ), $this->message() );
			$this->assertSame(
				[ $_expect_array, $_expect_array ],
				array_map( function ( $ctn ) {
					return (array) $ctn;
				}, U\Ctn::map( 'trim', $_ctn, $_ctn ) ), $this->message()
			);
		}
	}
}
