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
 * @noinspection PhpUndefinedMethodInspection
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\A6t\Base\Magic\Finals;

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
trait Serializable_Members {
	/**
	 * Defines what to serialize.
	 *
	 * @since 2021-12-27
	 *
	 * @return array {@see U\A6t\Base::props()} for further details.
	 *
	 * @see   https://www.php.net/manual/en/class.serializable.php
	 */
	final public function __serialize() : array {
		return $this->props( 'public...private' );
	}

	/**
	 * Handles unserialization.
	 *
	 * This fires instead of constructor when unserializing.
	 * {@see unserialize()} for further details.
	 *
	 * @since 2021-12-27
	 *
	 * @param array $props Incoming properties; i.e., desired state.
	 *
	 * @see   https://www.php.net/manual/en/class.serializable.php
	 */
	final public function __unserialize( array $props ) : void {
		foreach ( $props as $_prop => $_value ) {
			if ( ! is_string( $_prop ) || '' === $_prop || "\0" !== $_prop[ 0 ] ) {
				$this->{$_prop} = $_value;

			} elseif ( $this instanceof U\I7e\Offsets ) {
				if ( "\0" . U\A6t\Offsets::class . "\0" . 'offsets' === $_prop ) {
					$this->offsets( $_value );
				}
			}
		}
	}
}
