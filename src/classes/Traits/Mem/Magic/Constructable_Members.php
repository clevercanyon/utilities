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
	 * @param string $connection_id Persistent connection ID. Default: `SRV_ID`.
	 * @param string $namespace     Namespace. Default: `SRV_APP_ID`.
	 * @param array  $servers       Servers array. Default: `SRV_APP_MEMCACHED_SERVERS`.
	 *
	 * @throws U\Fatal_Exception If missing `memcached` extension.
	 * @throws U\Fatal_Exception If unable to establish `connection_id`, `namespace`, and `servers`.
	 * @throws U\Fatal_Exception If there's a server passed in that's missing required elements.
	 *
	 * @see          https://o5p.me/xXgmzk
	 * @see          https://code.launchpad.net/libmemcached
	 * @see          https://launchpad.net/libmemcached/1.0/1.0.18/+download/libmemcached-1.0.18.tar.gz
	 *
	 * @note         There can easily be multiple instances with multiple connections.
	 *               {@see https://github.com/memcached/memcached/wiki/ConfiguringServer#connection-limit}.
	 *
	 * @note         Don't forget to change {@see U\Mem::$connection_id_version} when there are substantial changes to this class.
	 *               Particularly in {@see U\Mem::__construct()} and {@see U\Mem::maybe_add_server_connections()}.
	 *
	 * @noinspection PhpMultipleClassDeclarationsInspection
	 */
	public function __construct( string $connection_id = '', string $namespace = '', array $servers = [] ) {
		parent::__construct();

		static $can_use_extension; // Remember.
		$can_use_extension ??= U\Env::can_use_extension( 'memcached' );

		if ( ! $can_use_extension ) {
			throw new U\Fatal_Exception( 'Missing PHP `memcached` extension.' );
		}
		// Establish persistent connection ID.

		$is_wordpress = U\Env::is_wordpress();

		$this->connection_id = U\Env::hostname();
		$this->connection_id .= '\\' . U\Brand::get( '&', 'slug' );
		$this->connection_id .= '\\v1.0.0'; // Connection version.
		$this->connection_id .= $connection_id ?: U\Env::static_var( 'MEMCACHED_CONNECTION_ID' ) ?: '';
		$this->connection_id .= $is_wordpress ? '\\' . U\Fs::normalize( ABSPATH ) : '';
		$this->connection_id .= ! $is_wordpress ? '\\' . ( U\Env::var( 'DOCUMENT_ROOT' ) ?: U\Fs::normalize( __FILE__ ) ) : '';
		$this->connection_id = U\Crypto::x_sha( $this->connection_id );

		// Establish namespace for cache keys.

		$this->namespace = $namespace ?: U\Env::static_var( 'MEMCACHED_NAMESPACE' ) ?: __NAMESPACE__;
		$this->namespace = U\Crypto::x_sha( $this->namespace );

		// Establish a pool of Memcached servers.

		$_servers      = $servers
			?: U\Env::static_var( 'MEMCACHED_SERVERS' )
				?: [
					[
						'host'   => '127.0.0.1',
						'port'   => 11211,
						'weight' => 0,
					],
				];
		$this->servers = []; // Rewrite below.

		foreach ( $_servers as $_key => $_server ) {
			if ( ! is_array( $_server ) || ! is_string( $_server[ 'host' ] ?? null ) ) {
				throw new U\Fatal_Exception( 'Invalid Memcached server, in key: `' . $_key . '`.' );
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

		$this->memcached = new \Memcached( $this->connection_id );
		$this->maybe_add_server_connections();
	}
}
