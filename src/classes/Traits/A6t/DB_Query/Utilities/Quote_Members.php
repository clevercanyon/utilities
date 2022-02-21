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
trait Quote_Members {
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
	public function quote_column( string $column, /* string|null */ ?string $table = null ) : string {
		$quoted = ''; // Initialize.

		if ( $table ) {
			$quoted .= '`' . $this->esc_name( $table ) . '`.';
		} // If there's a table, this adds a `$table`. prefix.

		return $quoted . '`' . $this->esc_name( $column ) . '`';
	}

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
	public function quote_columns( array $columns, /* string|null */ ?string $table = null ) : string {
		$quoted = ''; // Initialize.

		foreach ( $columns as $_column ) {
			$quoted .= ', ' . $this->quote_column( $_column, $table );
		}
		return trim( $quoted, ' ,' );
	}
}
