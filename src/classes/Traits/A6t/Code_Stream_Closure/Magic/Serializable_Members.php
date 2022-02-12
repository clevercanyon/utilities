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
 * @since        2021-12-15
 *
 * @noinspection PhpUndefinedMethodInspection
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\A6t\Code_Stream_Closure\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Code_Stream_Closure
 */
trait Serializable_Members {
	/**
	 * Defines what to serialize.
	 *
	 * @since 2021-12-27
	 *
	 * @return array Properties to serialize.
	 *
	 *               * The `$code` prop ends up being double serialized;
	 *                 and with a security signature for future verification.
	 */
	public function __serialize() : array {
		return [ 'code' => U\Str::serialize( $this->code, true ) ];
	}

	/**
	 * Handles unserialization.
	 *
	 * This fires instead of constructor when unserializing.
	 * {@see unserialize()} for further details.
	 *
	 * @since 2021-12-27
	 *
	 * @param array $props Desired state; i.e., array of properties.
	 *
	 *                     * The `code` prop is double serialized. It is unpacked here,
	 *                       and it must contain a valid security signature.
	 *
	 * @throws U\Fatal_Exception In debug mode, on any failure.
	 */
	public function __unserialize( array $props ) : void {
		if ( is_string( $props[ 'code' ] ?? null )
			&& ( $code = U\Str::unserialize( $props[ 'code' ], true ) )
		) {
			$this->code = $code; // Passed signature verification.
		} else {
			$this->code = ''; // Invalid; or failed signature verification.

			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( 'Unserialized `$code` is invalid; or failed signature verification.' );
			}
		}
	}
}
