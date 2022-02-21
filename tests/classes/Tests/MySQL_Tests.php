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
 * @coversDefaultClass \Clever_Canyon\Utilities\MySQL
 */
final class MySQL_Tests extends UT\A6t\Tests {
	/**
	 * @covers ::__construct()
	 * @covers ::query()
	 */
	public function test_construct() : void {
		if ( ! U\Env::is_wp_docker() ) {
			$this->markTestSkipped( 'This test only runs in WP Docker.' );
		}
		$mysql = $this->mysql();

		$mysql->query(
			<<<'ooo'
			CREATE TABLE `foo` (
				`id`        bigint(20)    UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
				`parent_id` bigint(20)    UNSIGNED NULL,
				`key`       varchar(128)           NOT NULL,
				`value`     longtext               NOT NULL,
				`microtime` decimal(16,6) UNSIGNED DEFAULT NULL
			);
			ooo
		)->execute();

		$mysql->query(
			<<<'ooo'
			INSERT INTO `foo` ( `parent_id`, `key`, `value`, `microtime` )
				VALUES
					( 0, 'foo', 'foo', :microtime_x0 ),
					( '0', 'bar', 'bar', :microtime_x1 ),
					( NULL, 'baz', 'baz', :microtime_x2 ),
					( 1, 'buz', 'buz', :microtime_x3 )
			ooo
		)->execute( [
			'microtime_x0' => microtime( true ),
			'microtime_x1' => microtime( true ),
			'microtime_x2' => microtime( true ),
			'microtime_x3' => microtime( true ),
		] );

		$query         = $mysql->query();
		$query->string = <<<'ooo'
			SELECT
				`id`,
				`parent_id`,
				`key`,
				`value`,
				`microtime`
			FROM
				`foo`
			LIMIT
				4
			ooo;
		$results       = $query->execute()->fetchAll();

		$this->assertSame( 4, count( $results ), $this->message() );

		$this->assertSame( 'foo', $results[ 0 ]->key, $this->message() );
		$this->assertSame( 'bar', $results[ 1 ]->key, $this->message() );
		$this->assertSame( 'baz', $results[ 2 ]->key, $this->message() );
		$this->assertSame( 'buz', $results[ 3 ]->key, $this->message() );

		$this->assertSame( 'foo', $results[ 0 ]->value, $this->message() );
		$this->assertSame( 'bar', $results[ 1 ]->value, $this->message() );
		$this->assertSame( 'baz', $results[ 2 ]->value, $this->message() );
		$this->assertSame( 'buz', $results[ 3 ]->value, $this->message() );

		$this->assertSame( 0, $results[ 0 ]->parent_id, $this->message() );
		$this->assertSame( 0, $results[ 1 ]->parent_id, $this->message() );
		$this->assertSame( null, $results[ 2 ]->parent_id, $this->message() );
		$this->assertSame( 1, $results[ 3 ]->parent_id, $this->message() );

		// Decimals are always represented as strings, unfortunately.
		$this->assertSame( true, is_string( $results[ 0 ]->microtime ), $this->message() );
	}
}
