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
namespace Clever_Canyon\Utilities\Traits\A6t\DB_Query\Magic;

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
trait Constructable_Members {
	/**
	 * Constructor.
	 *
	 * @since        2021-12-15
	 *
	 * @param string|null    $string Optional initial database query string.
	 *                               Bypass with `` or `null` and set later if you prefer.
	 *
	 * @param U\I7e\Database $db     Database class instance; e.g., {@see U\MySQL}.
	 *
	 * @throws U\Fatal_Exception On missing extension|class.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct( /* string|null */ ?string $string, U\I7e\Database $db ) {
		parent::__construct();

		// Check PDO extension.

		static $can_use_extension; // Remember.
		$can_use_extension ??= U\Env::can_use_extension( 'pdo' );

		if ( ! $can_use_extension ) {
			throw new U\Fatal_Exception( 'Missing PHP `pdo` extension.' );
		}
		// Database type validation.

		if ( $this->type && 'mysql' !== $this->type ) {
			throw new U\Fatal_Exception( 'Unsupported DB query type: `' . $this->type . '`.' );
		}
		$this->type = 'mysql'; // Only `mysql` is supported at this time.

		if ( $db->type !== $this->type ) {
			throw new U\Fatal_Exception(
				'Database type vs. DB query type mismatch.' .
				' Need: ' . $this->type . '`. Got: `' . $db->type . '`.'
			);
		}
		$this->db     = $db;
		$this->string = $string ?: '';

		$this->prepared_values       = [];
		$this->prepared_values_bound = false;
		$this->query_executed        = false;

		$this->sm = null; // Will come later.
	}
}
