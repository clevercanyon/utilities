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
namespace Clever_Canyon\Utilities\Traits\Mem\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

/**
 * File-specific.
 *
 * @since 2021-12-15
 */
use Memcached as Mc;

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
	 * Maybe add server connections.
	 *
	 * Don't forget to change {@see U\Mem::$connection_id_version} when there are substantial changes to this class.
	 * Particularly in {@see U\Mem::__construct()} and {@see U\Mem::maybe_add_server_connections()}.
	 *
	 * A pristine connection is one that is either not persistent; i.e., exists per-process;
	 * or a it's a brand new (first time) persistent connection, based on persistent connection ID.
	 *
	 * @since 2020-11-19
	 *
	 * @throws U\Fatal_Exception On failure (in debugging mode).
	 *
	 * @see   https://o5p.me/xXgmzk
	 * @see   https://code.launchpad.net/libmemcached
	 * @see   https://ilia.ws/files/tnphp_memcached.pdf
	 * @see   https://launchpad.net/libmemcached/1.0/1.0.18/+download/libmemcached-1.0.18.tar.gz
	 */
	protected function maybe_add_server_connections() : void {
		try { // If any issues, catch & flag as not alive.

			if ( ! $this->memcached->isPristine() ) {
				return; // Existing connection.
			}
			// First, let's quit and reset the pool of servers.
			// The goal here is to avoid leaking server connections.

			$this->memcached->quit();
			$this->memcached->resetServerList();

			// Configure options for the pool of servers added below.
			// Goal is for things to run smoothly in different environments.

			// Note: `OPT_CORK` is a deprecated option — do not use.
			// Note: `OPT_USER_DATA` is a deprecated option — do not use.
			// Note: `OPT_CACHE_LOOKUPS` is a deprecated option — do not use.
			// Note: `OPT_AUTO_EJECT_HOSTS` is a deprecated option — do not use.
			// Note: `OPT_DEAD_TIMEOUT` is an undocumented option — probably should not use.
			// Note: `OPT_TCP_KEEPIDLE` is only available on Linux — probably should not use.
			// Note: `OPT_PREFIX_KEY` we are not using, but if we were, it has an upper limit of 128 bytes.
			// Note: `OPT_SUPPORT_CAS` not set here; it's enabled on-demand JIT, as it incurs a light performance penalty.

			$this->memcached->setOption( Mc::OPT_PREFIX_KEY, '' );        // No, this class does its own prefixing.
			$this->memcached->setOption( Mc::OPT_BINARY_PROTOCOL, true ); // Yes, let's operate in binary mode for UTF-8.

			$this->memcached->setOption( Mc::OPT_NO_BLOCK, true );      // Yes, let's operate in non-blocking mode.
			$this->memcached->setOption( Mc::OPT_NOREPLY, false );      // No, we *do* want a reply when writing to the cache.
			$this->memcached->setOption( Mc::OPT_BUFFER_WRITES, true ); // Yes, defers data transfer in favor of better performance.

			$this->memcached->setOption( Mc::OPT_USE_UDP, false );      // No, unnecessary (TCP-only); {@see https://o5p.me/bzQvnt}.
			$this->memcached->setOption( Mc::OPT_TCP_NODELAY, true );   // Yes, let's not delay anything when connecting to TCP servers.
			$this->memcached->setOption( Mc::OPT_TCP_KEEPALIVE, true ); // Yes, let's keep TCP connections alive by pinging them.

			// On consistent hashing; {@see https://stackoverflow.com/a/62183503/1219741}.
			// The HASH options below aren't about cache keys this class uses. These options are about sharding.
			$this->memcached->setOption( Mc::OPT_SORT_HOSTS, false );   // No, it defeats consistent hashing distribution.
			$this->memcached->setOption( Mc::OPT_DISTRIBUTION, Mc::DISTRIBUTION_CONSISTENT /* Yes, use consistent hashing distribution. */ );
			$this->memcached->setOption( Mc::OPT_LIBKETAMA_COMPATIBLE, true );   // Yes, let's use consistent hashing distribution.
			$this->memcached->setOption( Mc::OPT_LIBKETAMA_HASH, Mc::HASH_MD5 ); // MD5; matching what libketama-compatible uses.
			$this->memcached->setOption( Mc::OPT_HASH, Mc::HASH_MD5 );           // MD5; matching what libketama-compatible uses.

			$this->memcached->setOption( Mc::OPT_COMPRESSION, true ); // Yes, enable on-the-fly compression.
			$this->memcached->setOption( Mc::OPT_COMPRESSION_TYPE, Mc::COMPRESSION_FASTLZ /* Better performance. */ );

			$can_use_igbinary = Mc::HAVE_IGBINARY && U\Env::can_use_extension( 'igbinary' ); // Better size and performance.
			$this->memcached->setOption( Mc::OPT_SERIALIZER, $can_use_igbinary ? Mc::SERIALIZER_IGBINARY : Mc::SERIALIZER_PHP );

			$this->memcached->setOption( Mc::OPT_CONNECT_TIMEOUT, U\Time::SECOND_IN_MILLISECONDS ); // Milliseconds.
			$this->memcached->setOption( Mc::OPT_POLL_TIMEOUT, U\Time::SECOND_IN_MILLISECONDS );    // Milliseconds.

			$this->memcached->setOption( Mc::OPT_SOCKET_SEND_SIZE, U\File::MB_IN_BYTES ); // Hard upper limit in bytes.
			$this->memcached->setOption( Mc::OPT_SOCKET_RECV_SIZE, U\File::MB_IN_BYTES ); // Hard upper limit in bytes.

			$this->memcached->setOption( Mc::OPT_SEND_TIMEOUT, U\Time::SECOND_IN_MICROSECONDS ); // Microseconds (blocking mode only).
			$this->memcached->setOption( Mc::OPT_RECV_TIMEOUT, U\Time::SECOND_IN_MICROSECONDS ); // Microseconds (blocking mode only).

			// Note: The lifecycle associated with these retry/timeout settings is per-process.
			// Unless connection is persistent (requires PHP-FPM), in which case lifecycle is of the PHP-FPM process.
			// In other words, if a server is removed, it'll stay removed until a new PHP-FPM process starts up.
			// {@see https://github.com/php-memcached-dev/php-memcached/issues/388#issuecomment-379685339}.

			// It's too bad retry timeout is not in microseconds. Leaving as `0` because hanging a full second is ridiculous.
			// Failed servers will re-enter the pool when a new process begins; at which time it'll be tested for failures again.

			$this->memcached->setOption( Mc::OPT_RETRY_TIMEOUT, 0 );            // Seconds before retrying problematic servers x [limit].
			$this->memcached->setOption( Mc::OPT_SERVER_FAILURE_LIMIT, 4 );     // Retry this many times before giving up on a server.
			$this->memcached->setOption( Mc::OPT_REMOVE_FAILED_SERVERS, true ); // Yes, remove problematic servers after retrying.

			// Keep one server replica of all data as a backup; i.e., in case of failed servers.
			$this->memcached->setOption( Mc::OPT_NUMBER_OF_REPLICAS, count( $this->servers ) > 1 ? 1 : 0 );

			// OK, let's add a pool of servers.
			// No connections to the servers will occur here.

			if ( ! $this->servers || ! $this->memcached->addServers( $this->servers ) ) {
				throw new U\Fatal_Exception( 'Failed to configure Memcached servers.' );
			}
		} catch ( \Throwable $throwable ) {
			$this->is_memcached_alive = false;

			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( $throwable->getMessage() );
			}
		}
	}
}
