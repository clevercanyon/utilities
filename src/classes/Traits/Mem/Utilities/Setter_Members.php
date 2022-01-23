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
trait Setter_Members {
	/**
	 * Sets|updates cache key.
	 *
	 * @since 2020-11-19
	 *
	 * @param string $primary_key Primary key.
	 * @param string $sub_key     Sub-key to set|update.
	 *
	 * @param mixed  $value       Value to cache (1MB max).
	 *                            Cannot be a resource. An exception is thrown.
	 *                            `null` is the same as {@see U\Mem::clear()}.
	 *
	 * @param int    $expires_in  Expires (in seconds). Default is `0`.
	 *                            If `$expires_in` is set to `0` (default), then the item never expires;
	 *                            although it may be deleted from the server to make space for other items.
	 *
	 *                            {@see https://www.php.net/manual/en/memcached.expiration.php}.
	 *                            `$expires_in` is converted to `$expires` (i.e., actual timestamp) in the code below.
	 *                            Therefore, the 30-day limit that's noted at PHP.net is not applicable — there's no hard limit here.
	 *
	 * @throws U\Fatal_Exception When `$value` has an incompatible data type; i.e., cannot be a resource.
	 * @throws U\Fatal_Exception When `$value` is scalar and it's string representation is larger than 1MB.
	 *
	 * @return bool True on success.
	 */
	public function set( string $primary_key, string $sub_key, /* mixed */ $value, int $expires_in = 0 ) : bool {
		if ( null === $value ) {
			return $this->clear( $primary_key, $sub_key );
		}
		$expires_in = max( 0, $expires_in );
		$expires    = $expires_in ? time() + $expires_in : 0;

		$is_scalar   = is_scalar( $value );
		$is_resource = ! $is_scalar && is_resource( $value );

		if ( ! ( $key = $this->key( $primary_key, $sub_key ) ) ) {
			return false; // Fail; e.g., race condition.
		}
		if ( $is_scalar && strlen( (string) $value ) > 1024 * 1024 ) {
			throw new U\Fatal_Exception( 'Too much data for a single key. 1MB max.' );
		}
		if ( $is_resource ) { // Alert developer. This is very wrong.
			throw new U\Fatal_Exception( 'Incompatible data type. Cannot be a resource.' );
		}
		do { // Avoid race issues.
			$cas      = $cas ?? 0;
			$attempts = $attempts ?? 0;
			++$attempts; // Counter.

			$ext = $this->memcached->get( $key, null, \Memcached::GET_EXTENDED );
			$cas = \Memcached::GET_ERROR_RETURN_VALUE !== $ext && isset( $ext[ 'cas' ] ) ? $ext[ 'cas' ] : $cas;

			if ( \Memcached::RES_NOTFOUND === $this->memcached->getResultCode() ) {
				if ( $this->memcached->add( $key, $value, $expires ) ) {
					return true; // All good; stop here.
				}
			} elseif ( $this->memcached->cas( $cas, $key, $value, $expires ) ) {
				return true; // All good; stop here.
			}
			$result_code = $this->memcached->getResultCode();

		} while ( $attempts < U\Mem::$max_write_attempts // Give up after X attempts.
		&& ( \Memcached::RES_NOTSTORED === $result_code || \Memcached::RES_DATA_EXISTS === $result_code ) );

		return false; // Fail; e.g., race condition or unexpected error.
	}
}
