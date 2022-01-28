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
trait Clear_Members {
	/**
	 * Clears cache.
	 *
	 * @since 2020-11-19
	 *
	 * @param string      $primary_key Primary key.
	 *
	 * @param string|null $sub_key     Sub-key to clear. Default is `null` (all sub-keys).
	 *                                 When `null` (default), all sub-keys are cleared from cache.
	 *
	 * @return bool True on success.
	 */
	public function clear( string $primary_key, /* string|null */ ?string $sub_key = null ) : bool {
		if ( null === $sub_key ) {
			$key = $this->namespaced_primary_key( $primary_key );
		} else {
			$key = $this->key( $primary_key, $sub_key );
		}
		if ( ! $key ) {   // Can happen for a number of reasons; e.g., a key is empty?
			return false; // Fail; e.g., down server or unexpected error.
		}
		return $this->memcached->delete( $key )
			|| \Memcached::RES_NOTFOUND === $this->memcached->getResultCode();
	}
}
