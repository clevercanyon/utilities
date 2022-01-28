<?php
/**
 * CLEVER CANYON™ {@see https://clevercanyon.com}
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
namespace Clever_Canyon\Utilities\Traits\Mem\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\Mem
 */
trait Constructable_Members {
	/**
	 * Constructor (`memcached` extension required).
	 *
	 * @since        2020-11-19
	 *
	 * @param string $connection_id_salt Persistent connection ID salt. Default is static env variable: `MEMCACHED_CONNECTION_ID_SALT`.
	 *                                   Only needed if you intend to salt the default connection ID. To bypass, simply set as empty string.
	 *                                   For further details see code-level comments in {@see U\Mem::__construct()}.
	 *
	 * @param string $namespace_salt     Key namespace salt. Default is static env variable: `MEMCACHED_NAMESPACE_SALT`.
	 *                                   Only needed if you intend to salt the default namespace. To bypass, simply set as empty string.
	 *                                   For further details see code-level comments in {@see U\Mem::__construct()}.
	 *
	 * @param array  $servers            Servers array. If not passed, the default is static env variable: `MEMCACHED_SERVERS`.
	 *                                   If not passed to constructor and there's no static env variable, the hard-coded default is:
	 *                                   `[ [ 'host' => '127.0.0.1', 'port' => 11211, 'weight' => 0 ] ]`.
	 *
	 *                                   Tip: With at least (2) servers there can be a replica, which gets auto-configured by this class.
	 *                                   When there is a replica and a server goes offline temporarily, the replica will kick-in as a backup.
	 *
	 * @throws U\Fatal_Exception If missing `memcached` extension (not loaded).
	 * @throws U\Fatal_Exception If unable to establish `connection_id`, `namespace`, and/or `servers`.
	 * @throws U\Fatal_Exception If there's a server passed in that's missing required element: `host`.
	 * @throws U\Fatal_Exception On any server configuration failures (in debugging mode).
	 *
	 * @see          https://o5p.me/xXgmzk
	 * @see          https://code.launchpad.net/libmemcached
	 * @see          https://launchpad.net/libmemcached/1.0/1.0.18/+download/libmemcached-1.0.18.tar.gz
	 *
	 * @note         There can easily be multiple instances with multiple connections.
	 *               {@see https://github.com/memcached/memcached/wiki/ConfiguringServer#connection-limit}.
	 *
	 * @note         Change {@see U\Mem::$connection_id_version} when there are substantial changes to this class.
	 *               Particularly in {@see U\Mem::__construct()} and {@see U\Mem::maybe_add_server_connections()}.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct( string $connection_id_salt = '', string $namespace_salt = '', array $servers = [] ) {
		parent::__construct();

		// Check Memcached extension.

		static $can_use_extension; // Remember.
		$can_use_extension ??= U\Env::can_use_extension( 'memcached' );

		if ( ! $can_use_extension ) {
			throw new U\Fatal_Exception( 'Missing PHP `memcached` extension.' );
		}
		// Configure a few variables.

		$org_brand_slug     = U\Brand::get( '&', 'slug' );
		$connection_id_salt = $connection_id_salt ?: U\Env::static_var( 'MEMCACHED_CONNECTION_ID_SALT' ) ?: '';
		$namespace_salt     = $namespace_salt ?: U\Env::static_var( 'MEMCACHED_NAMESPACE_SALT' ) ?: '';
		$servers            = $servers ?: U\Env::static_var( 'MEMCACHED_SERVERS' )
			?: [ [ 'host' => '127.0.0.1', 'port' => 11211, 'weight' => 0 ] ];

		/**
		 * A possibly-persistent connection ID is a hash of (6) considerations:
		 *
		 *   1. Current system's hostname so there are unique connection IDs when running a server cluster.
		 *      Assuming each server in a cluster has a different hostname; which is a recommended best practice.
		 *
		 *   2. CLEVER CANYON's brand slug via {@see U\Brand::get()}, which identifies this library.
		 *
		 *   3. Connection ID version, which is subject to change when there are substantive code modifications.
		 *      Taken from {@see U\Mem::$connection_id_version}. Please update when there are substantive code changes.
		 *
		 *   4. A `$connection_id_salt` passed to constructor; else static env variable `MEMCACHED_CONNECTION_ID_SALT`.
		 *      This allows new instances of this class to be given very different connection IDs if desirable.
		 *
		 *   5. The current server API; i.e., {@see PHP_SAPI}. This is to ensure there can be dynamic adjustments made to
		 *      connection settings depending on the server API vs. inadvertently reusing an existing persistent connection ID.
		 *
		 *   6. Finally, a *context* based on the current protocol|{@see PHP_SAPI} (e.g., HTTP, CLI, etc):
		 *     - For HTTP requests, all applications under `DOCUMENT_ROOT` using this class will share the same connection ID.
		 *     - For CLI (command-line) requests, all applications conducted by the same `USER` will share the same connection ID.
		 *     - If `DOCUMENT_ROOT` and/or `USER` are unavailable, all applications using this `__FILE__` will share the same connection.
		 */
		$this->connection_id = U\Env::hostname();
		$this->connection_id .= '\\' . $org_brand_slug;
		$this->connection_id .= '\\v' . U\Mem::$connection_id_version;
		$this->connection_id .= PHP_SAPI; // {@see https://o5p.me/hLU7Pj}.

		if ( U\Env::is_http() && ( $_doc_root = U\Env::var( 'DOCUMENT_ROOT' ) ) ) {
			$this->connection_id .= '\\' . $_doc_root;
		} elseif ( U\Env::is_cli() && ( $_user = U\Env::var( 'USER' ) ) ) {
			$this->connection_id .= '\\' . mb_strtolower( $_user );
		} else {
			$this->connection_id .= '\\' . U\Fs::normalize( __FILE__ );
		}
		$this->connection_id .= '\\' . $connection_id_salt;
		$this->connection_id = U\Crypto::x_sha( $this->connection_id );

		/**
		 * A namespace is a hash of just (2) considerations:
		 *
		 *   1. CLEVER CANYON's brand slug via {@see U\Brand::get()}, which identifies this library.
		 *
		 *   2. A `$namespace_salt` passed to constructor; else static env variable `MEMCACHED_NAMESPACE_SALT`.
		 *      This allows new instances of this class to be given very different namespaces if desirable.
		 *
		 * @note The namespace defined here is intentionally, by default, very broad in scope.
		 *       The rationale is to make it easy for consumers of this class to narrow scope on their own;
		 *       vs. fighting with a set of defaults when trying to widen the scope, which is often desirable.
		 *       A recommendation is to think less about the namespace and more about primary cache keys.
		 */
		$this->namespace = $org_brand_slug;
		$this->namespace .= '\\' . $namespace_salt;
		$this->namespace = U\Crypto::x_sha( $this->namespace );

		// Establish a pool of Memcached servers.

		$this->servers = []; // Initialize pool of servers.

		foreach ( $servers as $_key => $_server ) {
			if ( ! is_array( $_server ) || ! is_string( $_server[ 'host' ] ?? null ) ) {
				throw new U\Fatal_Exception( 'Invalid Memcached server; in key: `' . $_key . '`.' );
			}
			$_host   = $_server[ 'host' ];
			$_port   = (int) ( $_server[ 'port' ] ?? 11211 );
			$_weight = (int) ( $_server[ 'weight' ] ?? 0 );

			$this->servers[ $_host . ':' . $_port ]             = [];
			$this->servers[ $_host . ':' . $_port ][ 'host' ]   = $_host;
			$this->servers[ $_host . ':' . $_port ][ 'port' ]   = $_port;
			$this->servers[ $_host . ':' . $_port ][ 'weight' ] = $_weight;
		}
		// Sanity checks; validate each of these.

		if ( ! $this->connection_id || ! $this->namespace || ! $this->servers ) {
			throw new U\Fatal_Exception( 'Missing `connection_id`, `namespace`, and/or `servers`.' );
		}
		// Note: Persistent connections require PHP-FPM.
		// Otherwise, the connection lifecycle is per-process.

		try { // If any issues, catch & flag as not alive.

			$this->memcached = new \Memcached( $this->connection_id );
			$this->maybe_add_server_connections();

		} catch ( \Throwable $throwable ) {
			$this->is_memcached_alive = false;

			if ( U\Env::in_debugging_mode() ) {
				throw new U\Fatal_Exception( $throwable->getMessage() );
			}
		}
	}
}
