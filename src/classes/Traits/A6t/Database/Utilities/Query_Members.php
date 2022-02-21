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
namespace Clever_Canyon\Utilities\Traits\A6t\Database\Utilities;

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
 * @see   U\I7e\Database
 */
trait Query_Members {
	/**
	 * Generates a new {@see U\I7e\DB_Query}.
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
	 * @since 2022-02-21
	 *
	 * @param string|null $string Optional initial database query string.
	 *                            Bypass with `` or `null` and set later if you prefer.
	 *
	 * @return U\I7e\DB_Query DB query; e.g., {@see U\MySQL_Query}.
	 *
	 * @throws U\Fatal_Exception On unsupported DB query type.
	 */
	public function query( /* string|null */ ?string $string = null ) : U\I7e\DB_Query {
		if ( 'mysql' === $this->type ) {
			return new U\MySQL_Query( $string, $this ); // phpcs:ignore -- erroneous.
		}
		throw new U\Fatal_Exception( 'Unsupported DB query type: `' . $this->type . '`.' );
	}
}
