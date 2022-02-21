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
 * @since        2021-12-25
 *
 * @noinspection PhpComposerExtensionStubsInspection
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\I7e;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * DB query interface.
 *
 * @since 2021-12-15
 */
interface DB_Query extends U\I7e\Base {
	/**
	 * Defines string representation of object.
	 *
	 * @since 2021-12-27
	 *
	 * @return string Current DB query string.
	 *
	 * @see   https://www.php.net/manual/en/class.stringable.php
	 */
	public function __toString() : string;

	/**
	 * Tests inaccessible properties.
	 *
	 * At least these properties should be readable:
	 *
	 * - `type` DB query type.
	 * - `db` {@see U\I7e\Database} instance.
	 * - `string` Query string (must also be writable).
	 * - `sm` PHP data object statement; {@see \PDOStatement}.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @return bool True if property exists.
	 */
	public function __isset( string $prop ) : bool;

	/**
	 * Gets inaccessible properties.
	 *
	 * At least these properties should be readable:
	 *
	 * - `type` DB query type.
	 * - `db` {@see U\I7e\Database} instance.
	 * - `string` Query string (must also be writable).
	 * - `sm` PHP data object statement; {@see \PDOStatement}.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @return mixed Property value.
	 */
	public function __get( string $prop ); /* : mixed */

	/**
	 * Executes the DB query.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $prepared_values Any other prepared values (optional).
	 *                               This would be in addition to those prepared already.
	 *
	 * @throws \PDOException On any PDO failure.
	 * @throws U\Fatal_Exception On any other failure.
	 */
	public function execute( array $prepared_values = [] ) : \PDOStatement;

	/**
	 * Prepares `..., :[values]`.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $values Values w/ any keys.
	 * @param string|null $prefix Optional name to use as a prefix (recommended).
	 *                            Not strictly necessary. Particularly if `$values` have named keys.
	 *
	 * @return string Prepared `..., :[values]`.
	 */
	public function prepare_values( array $values, /* string|null */ ?string $prefix = null ) : string;

	/**
	 * Quotes/prepares `..., `table`.`column` = :[values]`.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $values Values w/ column name keys.
	 * @param string|null $table  Optional table name. Default is no table prefix.
	 * @param string|null $prefix Optional name to use as a prefix (recommended).
	 *                            Not strictly necessary. Particularly since `$values` have named keys.
	 *
	 * @return string Quoted/prepared `..., `table`.`column` = :[values]`.
	 *
	 * @throws U\Fatal_Exception If `$values` is not associative; i.e., missing column name keys.
	 */
	public function prepare_column_values(
		array $values,
		/* string|null */ ?string $table = null,
		/* string|null */ ?string $prefix = null
	) : string;

	/**
	 * Quotes/prepares `( `table`.`column` ) VALUES ..., ( ..., :value )` rows.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $rows   Rows; i.e., arrays of values w/ column name keys.
	 * @param string|null $table  Optional table name. Default is no table prefix.
	 * @param string|null $prefix Optional name to use as a prefix (recommended).
	 *                            Not strictly necessary. Particularly since `$values` have named keys.
	 *
	 * @return string Quoted/prepared `( `table`.`column` ) VALUES ..., ( ..., :value )` rows.
	 */
	public function prepare_column_value_rows(
		array $rows,
		/* string|null */ ?string $table = null,
		/* string|null */ ?string $prefix = null
	) : string;

	/**
	 * Quotes/prepares `..., `table`.`column` group-bys.
	 *
	 * Alias of {@see U\I7e\DB_Query::quote_columns()}.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $group_bys Group-bys w/ column name keys.
	 * @param string|null $table     Optional table name. Default is no table prefix.
	 *
	 * @return string Quoted/prepared `..., `table`.`column` group-bys.
	 */
	public function prepare_group_bys( array $group_bys, /* string|null */ ?string $table = null ) : string;

	/**
	 * Quotes/prepares `..., `table`.`column` ASC|DESC` order-bys.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $order_bys Order-bys w/ column name keys.
	 * @param string|null $table     Optional table name. Default is no table prefix.
	 *
	 * @return string Quoted/prepared `..., `table`.`column` ASC|DESC` order-bys.
	 */
	public function prepare_order_bys( array $order_bys, /* string|null */ ?string $table = null ) : string;

	/**
	 * Quotes/escapes a `table`.`column`.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $column Column name to quote/escape.
	 * @param string|null $table  Optional table name. Default is no table prefix.
	 *
	 * @return string Quoted/escaped `table`.`column`.
	 */
	public function quote_column( string $column, /* string|null */ ?string $table = null ) : string;

	/**
	 * Quotes/escapes ..., `table`.`[columns]`.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $columns Column names to quote/escape.
	 * @param string|null $table   Optional table name. Default is no table prefix.
	 *
	 * @return string Quoted/escaped ..., `table`.`[columns]`.
	 */
	public function quote_columns( array $columns, /* string|null */ ?string $table = null ) : string;

	/**
	 * Escapes a column|variable name.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $name Column|variable name.
	 *
	 * @return string Escaped column|variable name.
	 */
	public function esc_name( string $name ) : string;

	/**
	 * Escapes order direction.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $order Order direction.
	 *
	 * @return string Escaped order direction.
	 */
	public function esc_order( string $order ) : string;
}
