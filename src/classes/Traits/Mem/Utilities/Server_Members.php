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
namespace Clever_Canyon\Utilities\Traits\Mem\Utilities;

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
trait Server_Members {
	/**
	 * Servers differ?
	 *
	 * @since 2020-11-19
	 *
	 * @return bool True if servers differ.
	 */
	protected function servers_differ() : bool {
		foreach ( $this->memcached->getServerList() as $_s ) {
			print_r( $_s );
			$active_servers[ $_s[ 'host' ] . ':' . $_s[ 'port' ] ] = [ $_s[ 'host' ], $_s[ 'port' ], $_s[ 'weight' ] ];
		} // Very important to assemble this in the same way as `$this->servers` for comparison.

		$active_servers ??= []; // In case no active servers.
		$active_servers = U\Arr::sort_by( 'key', $active_servers );

		return $active_servers === $this->servers;
	}

	/**
	 * Maybe add server connections.
	 *
	 * @since 2020-11-19
	 */
	protected function maybe_add_server_connections() {
		if ( ! $this->servers_differ() ) {
			return; // Nothing to do.
		}
		$this->memcached->quit();
		$this->memcached->resetServerList();

		$this->memcached->setOption( \Memcached::OPT_PREFIX_KEY, '' );
		$this->memcached->setOption( \Memcached::OPT_NO_BLOCK, true );
		$this->memcached->setOption( \Memcached::OPT_BUFFER_WRITES, true );
		$this->memcached->setOption( \Memcached::OPT_CACHE_LOOKUPS, true );
		$this->memcached->setOption( \Memcached::OPT_LIBKETAMA_COMPATIBLE, true );
		$this->memcached->setOption( \Memcached::OPT_SERVER_FAILURE_LIMIT, 1000 );

		if ( \Memcached::HAVE_IGBINARY ) { // Size and speed gains.
			// $this->memcached->setOption( \Memcached::OPT_BINARY_PROTOCOL, true ); ...
			$this->memcached->setOption( \Memcached::OPT_SERIALIZER, \Memcached::SERIALIZER_IGBINARY );
		}
		$this->memcached->setOption( \Memcached::OPT_RETRY_TIMEOUT, 1 );      // Seconds.
		$this->memcached->setOption( \Memcached::OPT_CONNECT_TIMEOUT, 1000 ); // Milliseconds.
		$this->memcached->setOption( \Memcached::OPT_POLL_TIMEOUT, 1000 );    // Milliseconds.
		$this->memcached->setOption( \Memcached::OPT_SEND_TIMEOUT, 1000000 ); // Microseconds.
		$this->memcached->setOption( \Memcached::OPT_RECV_TIMEOUT, 1000000 ); // Microseconds.

		$this->memcached->addServers( $this->servers );
	}
}
