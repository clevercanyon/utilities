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
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\Base\Magic;

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
 * @see   U\I7e\Base
 */
trait Unserializable_Members {
	/**
	 * Defines what to serialize.
	 *
	 * @since 2021-12-27
	 *
	 * @return array {@see \Clever_Canyon\Utilities\Traits\Base\Utilities\Property_Members::props()} for further details.
	 *
	 * @see   https://www.php.net/manual/en/class.serializable.php
	 */
	public function __serialize() : array {
		return $this->props( 'public...private' );
	}

	/**
	 * Handles unserialization.
	 *
	 * This fires instead of constructor when unserializing.
	 * i.e., {@see unserialize()} fires this function when unserializing.
	 *
	 * @since 2021-12-27
	 *
	 * @param array $props Incoming properties; i.e., desired state.
	 *
	 * @throws U\Fatal_Exception If called in any way.
	 * @see   https://www.php.net/manual/en/class.serializable.php
	 */
	public function __unserialize( array $props ) : void {
		throw new U\Fatal_Exception(
			'Any attempt to unserialize `' . get_class( $this ) . '`' .
			' is potentially dangerous and therefore not allowed at this time.'
		);
	}
}
