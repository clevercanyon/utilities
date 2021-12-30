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
namespace Clever_Canyon\Utilities__Tests\Tests\STC\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Test case.
 *
 * @since 2021-12-15
 * @coversDefaultClass \Clever_Canyon\Utilities\STC\Version_1_0_0\Obj
 */
final class Obj_Tests extends \Clever_Canyon\Utilities__Tests\Framework\Version_1_0_0\A7s_Tests {
	/**
	 * @covers ::empty()
	 */
	public function test_empty() : void {
		$this->assertSame( true, U\Obj::empty( (object) [] ), $this->message() );
		$this->assertSame( false, U\Obj::empty( (object) [ 0 ] ), $this->message() );
		$this->assertSame( false, U\Obj::empty( (object) [ 'foo' => 'bar' ] ), $this->message() );
	}

	/**
	 * @covers ::get_prop()
	 */
	public function test_get_prop() : void {
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
		$this->assertSame( '8fdf57c246a045d19f39f4151039499d', U\Obj::get_prop( $obj, '0' ), $this->message() );
		$this->assertSame( '1abc7beaf3f84b88a97515d0966b0e2a', U\Obj::get_prop( $obj, '1' ), $this->message() );
		$this->assertSame( '1bbf82a4d5284c4f8e311ce02c47171a', U\Obj::get_prop( $obj, 'foo' ), $this->message() );
		$this->assertSame( 'ec2c798411284a8580886975ceaaa0f1', U\Obj::get_prop( $obj, 'baz.foo.bar' ), $this->message() );
		$this->assertSame( 'e04536a3cc4e4a3ebe249ee86814cd15', U\Obj::get_prop( $obj, 'baz.foo.0.1' ), $this->message() );
		$this->assertSame( '7d7f581121f9405ba83d342d1c696d56', U\Obj::get_prop( $obj, 'foo1.foo.0.1' ), $this->message() );
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
		], (array) U\Obj::sort_by( 'prop', $obj ), $this->message() );

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
		], (array) U\Obj::sort_by( 'prop', $obj, SORT_NATURAL ), $this->message() );

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
		], (array) U\Obj::sort_by( 'prop', $obj, SORT_REGULAR ), $this->message() );

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
			] ), (array) U\Obj::sort_by( 'value', $obj ), $this->message()
		);

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
			] ), (array) U\Obj::sort_by( 'value', $obj, SORT_NATURAL ), $this->message()
		);

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
			] ), (array) U\Obj::sort_by( 'value', $obj, SORT_REGULAR ), $this->message()
		);
	}

	/**
	 * @covers ::sort_by()
	 */
	public function test_sort_by_exception() : void {
		$this->expectException( Exception::class );
		U\Obj::sort_by(
			'value',
			(object) [
				'1'          => '1',
				'2'          => '2',
				'3'          => '3',
				'11'         => '11',
				'12'         => '12',
				'not-scalar' => [ 'not-scalar' ],
				'13'         => '13',
				'a'          => 'a',
				'b'          => 'b',
				'c'          => 'c',
				'rfc1.txt'    => 'rfc1.txt',
				'rfc2086.txt' => 'rfc2086.txt',
				'rfc822.txt'  => 'rfc822.txt',
			]
		);
	}
}
