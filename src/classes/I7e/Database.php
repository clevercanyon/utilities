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
 * Database interface.
 *
 * @since 2021-12-15
 */
interface Database extends U\I7e\Base {
	/**
	 * Tests inaccessible properties.
	 *
	 * At least these properties should be readable:
	 *
	 * - `type` PHP data object type.
	 * - `pdo` PHP data object access; {@see \PDO}.
	 * - `config` Configuration object access.
	 * - `connection_id` Connection ID.
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
	 * - `type` PHP data object type.
	 * - `pdo` PHP data object access; {@see \PDO}.
	 * - `config` Configuration object access.
	 * - `connection_id` Connection ID.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $prop Property name.
	 *
	 * @return mixed Property value.
	 */
	public function __get( string $prop ); /* : mixed */

	/**
	 * Generates a new {@see U\I7e\DB_Query}.
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
	public function query( /* string|null */ ?string $string = null ) : U\I7e\DB_Query;
}
