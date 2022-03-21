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
namespace Clever_Canyon\Utilities\Traits\A6t\Database\Properties;

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
trait Property_Members {
	/**
	 * PDO type.
	 *
	 * @since 2021-12-15
	 */
	protected string $type;

	/**
	 * PDO instance.
	 *
	 * @since 2021-12-15
	 */
	protected \PDO $pdo;

	/**
	 * Configuration.
	 *
	 * @since 2021-12-15
	 */
	protected object $config;

	/**
	 * Persistent connection ID.
	 *
	 * @since 2021-12-15
	 */
	protected string $connection_id;

	/**
	 * Connection ID version.
	 *
	 * @since 2022-01-24
	 */
	protected static string $connection_id_version = '1.0.0';
}
