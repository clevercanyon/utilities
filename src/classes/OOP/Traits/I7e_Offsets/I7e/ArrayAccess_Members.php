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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\OOP\Traits\I7e_Offsets\I7e;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   I7e_Offsets
 */
trait ArrayAccess_Members {
	/**
	 * Offsets container.
	 *
	 * @since 2021-12-28
	 */
	private array $offsets = [];

	/**
	 * Sets an offset key.
	 *
	 * @since 2021-12-28
	 *
	 * @param mixed $offset Offset key.
	 * @param mixed $value  Offset value.
	 */
	public function offsetSet( /* mixed */ $offset, /* mixed */ $value ) : void {
		if ( null === $offset ) {
			$this->offsets[] = $value;
		} else {
			$this->offsets[ $offset ] = $value;
		}
	}

	/**
	 * Checks if offset exists.
	 *
	 * @since 2021-12-28
	 *
	 * @param mixed $offset Offset key.
	 */
	public function offsetExists( /* mixed */ $offset ) : bool {
		return isset( $this->offsets[ $offset ] );
	}

	/**
	 * Unsets an offset key.
	 *
	 * @since 2021-12-28
	 *
	 * @param mixed $offset Offset key.
	 */
	public function offsetUnset( /* mixed */ $offset ) : void {
		unset( $this->offsets[ $offset ] );
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
	public function offsetGet( /* mixed */ $offset ) /* : mixed */ {
		return $this->offsets[ $offset ] ?? null;
	}
}
