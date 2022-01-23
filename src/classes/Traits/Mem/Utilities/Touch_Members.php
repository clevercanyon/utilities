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
trait Touch_Members {
	/**
	 * Touch a cache key (i.e., new expiration).
	 *
	 * @since 2020-11-19
	 *
	 * @param string $primary_key Primary key.
	 * @param string $sub_key     Sub-key to touch.
	 * @param int    $expires_in  Expires (in seconds).
	 *
	 * @return bool True on success.
	 */
	public function touch( string $primary_key, string $sub_key, int $expires_in ) : bool {
		$expires_in = max( 0, $expires_in );
		$expires    = $expires_in ? time() + $expires_in : 0;

		if ( ! ( $key = $this->key( $primary_key, $sub_key ) ) ) {
			return false; // Failure.
		}
		return $this->memcached->touch( $key, $expires );
	}
}
