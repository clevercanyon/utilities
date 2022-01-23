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
	 *
	 * @note         There can easily be multiple instances with multiple connections.
	 *               {@see https://github.com/memcached/memcached/wiki/ConfiguringServer#connection-limit}.
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
		if ( U\Env::is_wordpress() ) {
			$this->connection_id = $connection_id
				?: U\Env::static_var( 'MEMCACHED_CONNECTION_ID' )
					?: U\Fs::normalize( ABSPATH );
		} else {
			$this->connection_id = $connection_id
				?: U\Env::static_var( 'MEMCACHED_CONNECTION_ID' )
					?: U\Env::var( 'DOCUMENT_ROOT' );
		}
		$this->connection_id .= '/' . U\Env::hostname();
		$this->connection_id .= '/' . U\Brand::get( '&', 'slug' );
		$this->connection_id .= '/v1.0.0'; // Connection version.
		$this->connection_id = U\Crypto::x_sha( $this->connection_id );

		$this->namespace = $namespace ?: U\Env::static_var( 'MEMCACHED_NAMESPACE' ) ?: __NAMESPACE__;
		$this->namespace = U\Crypto::x_sha( $this->namespace );

		$this->servers = $servers
			?: U\Env::static_var( 'MEMCACHED_SERVERS' )
				?: [
					[
						'host'   => '127.0.0.1',
						'port'   => 11211,
						'weight' => 0,
					],
				];
		if ( ! $this->connection_id || ! $this->namespace || ! $this->servers ) {
			throw new U\Fatal_Exception( 'Missing `connection_id`, `namespace`, and/or `servers`.' );
		}
		$_servers      = $this->servers;
		$this->servers = []; // Rewrite below.

		foreach ( $_servers as $_server ) {
			if ( ! is_array( $_server ) || empty( $_server[ 'host' ] ) ) {
				continue; // Unexpected server.
			}
			$_host                                  = $_server[ 'host' ];
			$_port                                  = $_server[ 'port' ] ?? 11211;
			$_weight                                = $_server[ 'weight' ] ?? 0;
			$this->servers[ $_host . ':' . $_port ] = [ $_host, $_port, $_weight ];
		}
		$this->servers   = U\Arr::sort_by( 'key', $this->servers );
		$this->memcached = new \Memcached( $this->connection_id );

		$this->maybe_add_server_connections();
	}
}
