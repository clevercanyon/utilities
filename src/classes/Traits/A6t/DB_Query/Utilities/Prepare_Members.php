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
namespace Clever_Canyon\Utilities\Traits\A6t\DB_Query\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\DB_Query
 */
trait Prepare_Members {
	/**
	 * Prepares `..., :[values]`.
	 *
	 * Good to use for `IN()` queries also.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $values Values w/ any keys.
	 * @param string|null $prefix Optional name to use as a prefix (recommended).
	 *                            Not strictly necessary. Particularly if `$values` have named keys.
	 *
	 * @return string Prepared `..., :[values]`.
	 */
	public function prepare_values( array $values, /* string|null */ ?string $prefix = null ) : string {
		$prepared = ''; // Initialize.

		foreach ( $values as $_key => $_value ) {
			$_key_prefix    = is_string( $_key ) && '' !== $_key ? $_key . '_' : '';
			$_prefixed_name = $this->esc_name( $prefix . $_key_prefix . 'x' . count( $this->prepared_values ) );

			$prepared                                 .= ', :' . $_prefixed_name;
			$this->prepared_values[ $_prefixed_name ] = $_value;
		}
		return trim( $prepared, ' ,' );
	}

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
	) : string {
		$prepared = ''; // Initialize.

		foreach ( $values as $_column => $_value ) {
			if ( ! $_column || ! is_string( $_column ) ) {
				throw new U\Fatal_Exception( 'Expecting column name. Got: `' . $_column . '`.' );
			}
			$_column_prefix = $_column . '_'; // Always include column in prefixed name.
			$_prefixed_name = $this->esc_name( $prefix . $_column_prefix . 'x' . count( $this->prepared_values ) );

			$prepared                                 .= ', ' . $this->quote_column( $_column, $table );
			$prepared                                 .= ' = :' . $_prefixed_name;
			$this->prepared_values[ $_prefixed_name ] = $_value;
		}
		return trim( $prepared, ' ,' );
	}

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
	) : string {
		$prepared = ''; // Initialize.

		foreach ( $rows as $_row ) {
			if ( ! $prepared ) { // Establish columns.
				$prepared .= '( ' . $this->quote_columns( array_keys( $_row ), $table ) . ' )';
				$prepared .= ' VALUES ( ' . $this->prepare_values( $_row, $prefix ) . ' )';
			} else {
				$prepared .= ', ( ' . $this->prepare_values( $_row, $prefix ) . ' )';
			}
		}
		return trim( $prepared, ' ,' );
	}

	/**
	 * Quotes/prepares `..., `table`.`column` group-bys.
	 *
	 * Alias of {@see U\A6t\DB_Query::quote_columns()}.
	 *
	 * @since 2021-12-15
	 *
	 * @param array       $group_bys Group-bys w/ column name keys.
	 * @param string|null $table     Optional table name. Default is no table prefix.
	 *
	 * @return string Quoted/prepared `..., `table`.`column` group-bys.
	 */
	public function prepare_group_bys( array $group_bys, /* string|null */ ?string $table = null ) : string {
		return $this->quote_columns( $group_bys, $table );
	}

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
	public function prepare_order_bys( array $order_bys, /* string|null */ ?string $table = null ) : string {
		$prepared = ''; // Initialize.

		foreach ( $order_bys as $_column => $_order ) {
			$prepared .= ', ' . $this->quote_column( $_column, $table ) . ' ' . $this->esc_order( $_order );
		}
		return trim( $prepared, ', ' );
	}
}
