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

/**
 * File-specific.
 *
 * @since 2021-12-15
 *
 * @note  `Memcached` as `Mc` = shorter alias for options.
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
trait Alive_Members {
	/**
	 * Is Memcached alive?
	 *
	 * @since 2022-01-25
	 *
	 * @param bool|null $refresh Force a refresh? Default is `null`, indicating no.
	 *
	 * @throws U\Fatal_Exception On failure (in debugging mode).
	 *
	 * @return bool True if Memcached is alive.
	 */
	public function is_alive( /* bool|null */ ?bool $refresh = null ) : bool {
		if ( isset( $this->is_memcached_alive ) && ! $refresh ) {
			return $this->is_memcached_alive;
		}
		try { // If any issues, catch & flag as not alive.

			$set_response = $this->set( sha1( __METHOD__ ), 'alive', true );
			return $this->is_memcached_alive = $set_response;

		} catch ( \Throwable $throwable ) {
			$this->is_memcached_alive = false;

			if ( U\Env::in_debugging_mode() ) {
				throw new U\Fatal_Exception( $throwable->getMessage() );
			}
			return $this->is_memcached_alive = false;
		}
	}
}
