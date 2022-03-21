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
namespace Clever_Canyon\Utilities\Traits\A6t\DB_Query\Properties;

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
trait Property_Members {
	/**
	 * PDO type.
	 *
	 * @since 2021-12-15
	 */
	protected string $type;

	/**
	 * Query string.
	 *
	 * @since 2021-12-15
	 */
	public string $string;

	/**
	 * Database.
	 *
	 * @since 2021-12-15
	 */
	protected U\I7e\Database $db;

	/**
	 * Prepared values.
	 *
	 * @since 2021-12-15
	 */
	protected array $prepared_values;

	/**
	 * Prepared values bound?
	 *
	 * @since 2021-12-15
	 */
	protected bool $prepared_values_bound;

	/**
	 * Query executed?
	 *
	 * @since 2021-12-15
	 */
	protected bool $query_executed;

	/**
	 * Query statement.
	 *
	 * @since 2021-12-15
	 *
	 * @var \PDOStatement|null Depending on state.
	 */
	protected ?\PDOStatement $sm;
}
