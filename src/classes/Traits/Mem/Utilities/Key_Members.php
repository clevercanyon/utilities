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

// </editor-fold>

/**
 * Utility members.
 *
 * @since 2021-12-15
 *
 * @see   U\Mem
 */
trait Key_Members {
	/**
	 * Gets a UUIDv4-prefixed key.
	 *
	 * Max key length is `250` bytes. It's a hard limit in Memcached; {@see https://o5p.me/eufcIR}.
	 *
	 * @since 2020-11-19
	 *
	 * @param string $primary_key Primary key, which will be namespaced by {@see U\Mem::namespaced_primary_key()}.
	 *                            The default namespace prefix + `\` is 33 bytes, so default max length is 217 bytes.
	 *
	 * @param string $sub_key     Sub-key. The sub-key is auto-prefixed with primary-key's UUIDv4 entry.
	 *                            The default sub-key prefix + `\` is 33 bytes in length, so default max length is 217 bytes.
	 *
	 * @return string Full UUIDv4-prefixed key; i.e., `[UUIDv4]\[sub-key]`.
	 *
	 * @throws U\Exception If unable to acquire namespaced primary key’s UUIDv4.
	 * @throws U\Fatal_Exception If the full UUIDv4-prefixed key exceeds 250 bytes in length.
	 */
	protected function key( string $primary_key, string $sub_key ) : string {
		if ( ! ( $namespaced_primary_key = $this->namespaced_primary_key( $primary_key ) ) ) {
			return ''; // Not possible; e.g., empty key.
		}
		$namespaced_primary_key_uuid_v4 = ''; // Initialize.
		do {
			$attempts ??= 0; // Initialize attempts.
			$attempts++;     // Counts attempts.

			if ( $attempts > 2 ) {
				usleep( U\Time::SECOND_IN_MICROSECONDS / 100 );
			}
			if ( $existing_namespaced_primary_key_uuid_v4 = $this->memcached->get( $namespaced_primary_key ) ) {
				$namespaced_primary_key_uuid_v4 = $existing_namespaced_primary_key_uuid_v4;
				break; // All good; stop here.
			}
			if ( ! isset( $new_namespaced_primary_key_uuid_v4 ) ) {
				$new_namespaced_primary_key_uuid_v4 = U\Crypto::uuid_v4();
			}
			if ( $this->memcached->add( $namespaced_primary_key, $new_namespaced_primary_key_uuid_v4 ) ) {
				$namespaced_primary_key_uuid_v4 = $new_namespaced_primary_key_uuid_v4;
				break; // All good; stop here.
			}
			$result_code = $this->memcached->getResultCode();

			if ( \Memcached::RES_KEY_TOO_BIG === $result_code ) {
				throw new U\Exception( 'Cache key is too large.' );
			} elseif ( \Memcached::RES_E2BIG === $result_code ) {
				throw new U\Exception( 'Data is too large for a single cache key.' );
			}
		} while ( $attempts < U\Mem::$max_write_attempts && \Memcached::RES_NOTSTORED === $result_code );

		if ( ! $namespaced_primary_key_uuid_v4 ) {
			return ''; // Fail; e.g., down server or unexpected error.
		}
		$namespaced_primary_key_uuid_v4_prefix = $namespaced_primary_key_uuid_v4 . '\\';
		$uuid_v4_prefixed_key                  = $namespaced_primary_key_uuid_v4_prefix . $sub_key;

		if ( isset( $uuid_v4_prefixed_key[ 251 ] ) ) {
			throw new U\Fatal_Exception( sprintf( 'Sub key too long; %1$s bytes max.', 250 - strlen( $namespaced_primary_key_uuid_v4_prefix ) ) );
		}
		return $uuid_v4_prefixed_key;
	}

	/**
	 * Gets a namespace-prefixed primary key.
	 *
	 * @since 2020-11-19
	 *
	 * @param string $primary_key Primary key to add namespace prefix to.
	 *                            The default namespace prefix + `\` is 33 bytes, so default max length is 217 bytes.
	 *
	 * @return string Namespaced primary key; i.e., `[namespace]\[primary key]`.
	 *
	 * @throws U\Fatal_Exception When the namespaced primary key exceeds 250 bytes in length.
	 */
	protected function namespaced_primary_key( string $primary_key ) : string {
		if ( ! isset( $primary_key[ 0 ] ) ) {
			return ''; // Not possible.
		}
		$namespace_prefix       = $this->namespace . '\\';
		$namespaced_primary_key = $namespace_prefix . $primary_key;

		if ( isset( $namespaced_primary_key[ 251 ] ) ) {
			throw new U\Fatal_Exception( sprintf( 'Primary key too long; %1$s bytes max.', 250 - strlen( $namespace_prefix ) ) );
		}
		return $namespaced_primary_key;
	}
}
