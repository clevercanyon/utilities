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
trait Bind_Members {
	/**
	 * Binds values to {@see U\A6t\DB_Query::$sm}.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On invalid data type.
	 * @throws U\Fatal_Exception On any failure whatsoever.
	 */
	protected function bind_prepared_values() : void {
		if ( ! $this->sm ) { // Doing it wrong?
			throw new U\Fatal_Exception( 'Missing `\\PDOStatement` instance.' );
		}
		if ( $this->prepared_values_bound ) { // Doing it wrong?
			throw new U\Fatal_Exception( 'DB query’s prepared values were bound already.' );
		}
		$this->prepared_values_bound = true; // Flag as true.

		foreach ( $this->prepared_values as $_name => $_value ) {
			$_name = ltrim( $_name, ':' );
			$_name = ':' . $this->esc_name( $_name );

			switch ( $_type = U\Data::type( $_value ) ) {
				case 'null':
					if ( ! $this->sm->bindValue( $_name, $_value, $this->db->pdo::PARAM_NULL ) ) {
						throw new U\Fatal_Exception( 'Failed to bind `' . $_name . '` of type: `' . $_type . '`.' );
					}
					break;

				case 'int':
					if ( ! $this->sm->bindValue( $_name, $_value, $this->db->pdo::PARAM_INT ) ) {
						throw new U\Fatal_Exception( 'Failed to bind `' . $_name . '` of type: `' . $_type . '`.' );
					}
					break;

				case 'bool':
					if ( ! $this->sm->bindValue( $_name, $_value, $this->db->pdo::PARAM_BOOL ) ) {
						throw new U\Fatal_Exception( 'Failed to bind `' . $_name . '` of type: `' . $_type . '`.' );
					}
					break;

				case 'float':
					if ( ! $this->sm->bindValue( $_name, (string) $_value, $this->db->pdo::PARAM_STR ) ) {
						throw new U\Fatal_Exception( 'Failed to bind `' . $_name . '` of type: `' . $_type . '`.' );
					}
					break;

				case 'string':
					if ( ! $this->sm->bindValue( $_name, $_value, $this->db->pdo::PARAM_STR ) ) {
						throw new U\Fatal_Exception( 'Failed to bind `' . $_name . '` of type: `' . $_type . '`.' );
					}
					break;

				default: // Unexpected data.
					throw new U\Fatal_Exception(
						'Unexpected data type.' .
						' Unable to bind `' . $_name . '` of type: `' . $_type . '`.'
					);
			}
		}
	}
}
