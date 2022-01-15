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
 * @coversDefaultClass U\Arr
 */
final class Arr_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::value_first()
	 */
	public function test_value_first() : void {
		$this->assertSame( 3, U\Arr::value_first( [ 3, 2, 1 ] ), $this->message() );
		$this->assertSame(
			3,
			U\Arr::value_first( [
				'three' => 3,
				'two'   => 2,
				'one'   => 1,
			] ), $this->message()
		);
	}

	/**
	 * @covers ::value_last()
	 */
	public function test_value_last() : void {
		$this->assertSame( 1, U\Arr::value_last( [ 3, 2, 1 ] ), $this->message() );
		$this->assertSame(
			1,
			U\Arr::value_last( [
				'three' => 3,
				'two'   => 2,
				'one'   => 1,
			] ), $this->message()
		);
	}

	/**
	 * @covers ::is_assoc()
	 */
	public function test_is_assoc() : void {
		$this->assertSame( false, U\Arr::is_assoc( [ 3, 2, 1 ] ), $this->message() );
		$this->assertSame(
			true,
			U\Arr::is_assoc( [
				'three' => 3,
				'two'   => 2,
				'one'   => 1,
			] ), $this->message()
		);
	}

	/**
	 * @covers ::get_key()
	 */
	public function test_get_key() : void {
		$arr = [
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
		$this->assertSame( '8fdf57c246a045d19f39f4151039499d', U\Arr::get_key( $arr, '0' ), $this->message() );
		$this->assertSame( '1abc7beaf3f84b88a97515d0966b0e2a', U\Arr::get_key( $arr, '1' ), $this->message() );
		$this->assertSame( '1bbf82a4d5284c4f8e311ce02c47171a', U\Arr::get_key( $arr, 'foo' ), $this->message() );
		$this->assertSame( 'ec2c798411284a8580886975ceaaa0f1', U\Arr::get_key( $arr, 'baz.foo.bar' ), $this->message() );
		$this->assertSame( 'e04536a3cc4e4a3ebe249ee86814cd15', U\Arr::get_key( $arr, 'baz.foo.0.1' ), $this->message() );
		$this->assertSame( '7d7f581121f9405ba83d342d1c696d56', U\Arr::get_key( $arr, 'foo1.foo.0.1' ), $this->message() );
	}

	/**
	 * @covers ::sort_by()
	 */
	public function test_sort_by() : void {
		$arr = [
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
		], U\Arr::sort_by( 'key', $arr ), $this->message() );

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
		], U\Arr::sort_by( 'key', $arr, SORT_NATURAL ), $this->message() );

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
		], U\Arr::sort_by( 'key', $arr, SORT_REGULAR ), $this->message() );

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
			] ), U\Arr::sort_by( 'value', $arr ), $this->message()
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
			] ), U\Arr::sort_by( 'value', $arr, SORT_NATURAL ), $this->message()
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
			] ), U\Arr::sort_by( 'value', $arr, SORT_REGULAR ), $this->message()
		);
	}

	/**
	 * @covers ::sort_by()
	 */
	public function test_sort_by_exception() : void {
		$this->expectException( U\I7e\Exception::class );

		$arr = [
			'1'           => '1',
			'2'           => '2',
			'3'           => '3',
			'11'          => '11',
			'12'          => '12',
			'not-scalar'  => [ 'not-scalar' ],
			'13'          => '13',
			'a'           => 'a',
			'b'           => 'b',
			'c'           => 'c',
			'rfc1.txt'    => 'rfc1.txt',
			'rfc2086.txt' => 'rfc2086.txt',
			'rfc822.txt'  => 'rfc822.txt',
		];
		U\Arr::sort_by( 'value', $arr );
	}
}
