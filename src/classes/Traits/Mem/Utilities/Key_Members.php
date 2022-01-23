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
trait Key_Members {
	/**
	 * Gets a UUIDv4-prefixed key.
	 *
	 * @since 2020-11-19
	 *
	 * @param string $primary_key Primary key.
	 * @param string $sub_key     Sub-key.
	 *
	 * @throws U\Fatal_Exception If unable to acquire namespaced primary key’s UUIDv4.
	 * @throws U\Fatal_Exception If the full UUIDv4-prefixed key exceeds 250 bytes in length.
	 *
	 * @return string Full UUIDv4-prefixed key; i.e., `[UUIDv4]\[sub-key]`.
	 */
	protected function key( string $primary_key, string $sub_key ) : string {
		if ( ! ( $namespaced_primary_key = $this->nsp_key( $primary_key ) ) ) {
			return ''; // Not possible; e.g., empty key.
		}
		$namespaced_primary_key_uuid_v4 = ''; // Initialize.

		do {                 // Avoid race issues.
			$attempts ??= 0; // Initialize attempts.
			$attempts++;     // Counts attempts.

			if ( ( $existing_namespaced_primary_key_uuid_v4 = (string) $this->memcached->get( $namespaced_primary_key ) ) ) {
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

		} while ( $attempts < U\Mem::$max_write_attempts && \Memcached::RES_NOTSTORED === $result_code );

		if ( ! $namespaced_primary_key_uuid_v4 ) {
			throw new U\Fatal_Exception( 'Unable get namespaced primary key UUIDv4.' );
		}
		$namespaced_primary_key_uuid_v4_prefix = $namespaced_primary_key_uuid_v4 . '\\';
		$uuid_v4_prefixed_key                  = $namespaced_primary_key_uuid_v4_prefix . $sub_key;

		if ( isset( $uuid_v4_prefixed_key[ 251 ] ) ) {
			throw new U\Fatal_Exception( sprintf( 'Sub key too long; %1$s bytes max.', 250 - strlen( $namespaced_primary_key_uuid_v4_prefix ) ) );
		}
		return $uuid_v4_prefixed_key;
	}

	/**
	 * Gets namespaced primary key.
	 *
	 * @since 2020-11-19
	 *
	 * @param string $primary_key Primary key to namespace.
	 *
	 * @throws U\Fatal_Exception When the namespaced primary key exceeds 250 bytes in length.
	 *
	 * @return string Namespaced primary key; i.e., `[namespace]\[primary key]`.
	 */
	protected function nsp_key( string $primary_key ) : string {
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
