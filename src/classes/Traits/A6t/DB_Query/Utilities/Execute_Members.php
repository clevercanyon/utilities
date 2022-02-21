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
trait Execute_Members {
	/**
	 * Executes DB query {@see U\A6t\DB_Query::$string}.
	 *
	 * Recommended methods of use:
	 *
	 * Approach 1:
	 *        $query         = $mysql->query();
	 *        $query->string = '...';
	 *        $results       = $query->execute()->fetchAll();
	 *
	 * Approach 2:
	 *        $query_sm = $mysql->query( '...' )->execute();
	 *        $results  = $query_sm->fetchAll();
	 *
	 * Approach 3:
	 *        $results  = $mysql->query( '...' )->execute()->fetchAll();
	 *
	 * Approach 4 (simple execution):
	 *        $mysql->query( '...' )->execute();
	 *
	 * @since 2021-12-15
	 *
	 * @param array $prepared_values Any other prepared values (optional).
	 *                               This would be in addition to those already
	 *                               stored in {@see U\A6t\DB_Query::$prepared_values}.
	 *
	 * @throws \PDOException On any PDO failure.
	 * @throws U\Fatal_Exception On any other failure.
	 */
	public function execute( array $prepared_values = [] ) : \PDOStatement {
		if ( $this->query_executed ) { // Doing it wrong?
			throw new U\Fatal_Exception( 'DB query executed already.' );
		}
		$this->query_executed = true; // Flag as true.

		if ( ! $sm = $this->db->pdo->prepare( $this->string ) ) {
			throw new U\Fatal_Exception( 'DB query preparation failure.' );
		}
		$this->sm = $sm; // Assign property now.

		if ( $prepared_values ) {
			$this->prepared_values = array_merge( $this->prepared_values, $prepared_values );
		}
		$this->bind_prepared_values();

		if ( ! $this->sm->execute() ) {
			throw new U\Fatal_Exception( 'DB query execution failure.' );
		}
		return $this->sm; // Query statement.
	}
}
