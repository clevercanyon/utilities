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
 * @since 2021-12-15
 *
 * phpcs:disable WordPress.NamingConventions.ValidFunctionName.MethodNameInvalid
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\A6t\Offsets\I7e;

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
 * @see   U\I7e\Offsets
 */
trait ArrayAccess_Members {
	/**
	 * Sets an offset key.
	 *
	 * @since 2021-12-28
	 *
	 * @param mixed $offset Offset key.
	 * @param mixed $value  Offset value.
	 */
	final public function offsetSet( /* mixed */ $offset, /* mixed */ $value ) : void {
		if ( null === $offset ) {
			$this->offsets[] = $value;
		} else {
			$this->offsets[ $this->offset_key( $offset ) ] = $value;
		}
	}

	/**
	 * Checks if offset exists.
	 *
	 * @since 2021-12-28
	 *
	 * @param mixed $offset Offset key.
	 */
	final public function offsetExists( /* mixed */ $offset ) : bool {
		return isset( $this->offsets[ $this->offset_key( $offset ) ] );
	}

	/**
	 * Unsets an offset key.
	 *
	 * @since 2021-12-28
	 *
	 * @param mixed $offset Offset key.
	 */
	final public function offsetUnset( /* mixed */ $offset ) : void {
		unset( $this->offsets[ $this->offset_key( $offset ) ] );
	}

	/**
	 * Gets an offset value.
	 *
	 * @since        2021-12-28
	 *
	 * @param mixed $offset Offset key.
	 *
	 * @noinspection PhpLanguageLevelInspection
	 */
	#[\ReturnTypeWillChange]
	final public function offsetGet( /* mixed */ $offset ) /* : mixed */ {
		return $this->offsets[ $this->offset_key( $offset ) ] ?? null;
	}
}
