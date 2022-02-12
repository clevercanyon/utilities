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
trait Setter_Members {
	/**
	 * Sets|updates cache key.
	 *
	 * @since 2020-11-19
	 *
	 * @param string $primary_key Primary key, which will be namespaced by {@see U\Mem::namespaced_primary_key()}.
	 *                            The default namespace prefix + `\` is 33 bytes, so default max length is 217 bytes.
	 *
	 * @param string $sub_key     Sub-key to set|update. The sub-key is auto-prefixed with primary-key's UUIDv4 entry.
	 *                            The default sub-key prefix + `\` is 33 bytes in length, so default max length is 217 bytes.
	 *
	 * @param mixed  $value       Value to cache (1MB max).
	 *
	 *                            * Passing `null` explicitly will {@see U\Mem::clear()} a given cache key.
	 *
	 *                            * PHP does not allow a {@see \Closure} to be serialized whatsoever.
	 *                              Do not attempt to cache closures here; either directly or indirectly.
	 *                              The `igbinary` extension is no exception. It throws an exception if you try.
	 *                              You can, however, cache a {@see U\Code_Stream_Closure}.
	 *
	 *                            * PHP serializes a resource as `0`, and therefore works, but it's a bad practice.
	 *                              Do not attempt to cache resource values here; either directly or indirectly.
	 *                              Future versions of PHP will likely disallow altogether.
	 *
	 *                            * The `igbinary` extension will issue a notice on resources and serialize as `null`.
	 *                              Do not attempt to cache resource values here; either directly or indirectly.
	 *                              Future versions of PHP will likely disallow altogether.
	 *
	 *                            * If you must cache a resource, consider {@see U\A6t\Base::cls_cache()}.
	 *
	 * @param int    $expires_in  Expires (in seconds). Default is {@see U\Time::HOUR_IN_SECONDS}.
	 *                            If `$expires_in` is set to `0`, then the item never really expires,
	 *                            although it may be deleted from the server to make space for other items.
	 *
	 *                            {@see https://www.php.net/manual/en/memcached.expiration.php}.
	 *                            `$expires_in` is converted to `$expires` (i.e., actual timestamp) in code.
	 *                            Therefore, the 30-day limit that's noted at PHP.net is not applicable — there's no hard limit here.
	 *
	 * @return bool True on success.
	 *
	 * @throws U\Exception When `$value` is too large according to Memcached response code.
	 * @throws U\Exception When a derived cache key is too large according to Memcached response code.
	 */
	public function set( string $primary_key, string $sub_key, /* mixed */ $value, int $expires_in = U\Time::HOUR_IN_SECONDS ) : bool {
		assert( ! is_resource( $value ) );
		assert( ! $value instanceof \Closure );

		if ( null === $value ) {
			return $this->clear( $primary_key, $sub_key );
		}
		$expires_in = max( 0, $expires_in );
		$expires    = $expires_in ? U\Time::utc() + $expires_in : 0;

		if ( ! ( $key = $this->key( $primary_key, $sub_key ) ) ) {
			return false; // Fail; e.g., down server or unexpected error.
		}
		do {                 // Avoid race issues.
			$attempts ??= 0; // Initialize attempts.
			$attempts++;     // Counts attempts.

			if ( $attempts > 2 ) {
				usleep( U\Time::SECOND_IN_MICROSECONDS / 100 );
			}
			$ext = $this->memcached->get( $key, null, \Memcached::GET_EXTENDED );
			$cas = \Memcached::GET_ERROR_RETURN_VALUE !== $ext && isset( $ext[ 'cas' ] ) ? $ext[ 'cas' ] : 0.0;

			if ( \Memcached::RES_NOTFOUND === $this->memcached->getResultCode() ) {
				if ( $this->memcached->add( $key, $value, $expires ) ) {
					return true; // All good; stop here.
				}
			} elseif ( ! $cas ) {
				return false; // Fail; e.g., down server or unexpected error.

			} elseif ( $this->memcached->cas( $cas, $key, $value, $expires ) ) {
				return true; // All good; stop here.
			}
			$result_code = $this->memcached->getResultCode();

			if ( \Memcached::RES_KEY_TOO_BIG === $result_code ) {
				throw new U\Exception( 'Cache key is too large.' );
			} elseif ( \Memcached::RES_E2BIG === $result_code ) {
				throw new U\Exception( 'Data is too large for a single cache key.' );
			}
		} while ( $attempts < U\Mem::$max_write_attempts // Give up after X attempts.
		&& ( \Memcached::RES_NOTSTORED === $result_code || \Memcached::RES_DATA_EXISTS === $result_code ) );

		return false; // Fail; e.g., down server or unexpected error.
	}
}
