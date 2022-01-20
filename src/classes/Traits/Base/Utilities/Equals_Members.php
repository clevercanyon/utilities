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
namespace Clever_Canyon\Utilities\Traits\Base\Utilities;

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
trait Equals_Members {
	/**
	 * Checks equality with another instance.
	 *
	 * @since 2021-12-27
	 *
	 * @param U\I7e\Base $other Instance to compare `$this` to.
	 *
	 * @return bool True if objects are practically equal to each other,
	 *              based on return value of {@see U\Traits\Base\Utilities\Equals_Members::to_eq_string()}.
	 */
	final public function equals( U\I7e\Base $other ) : bool {
		return $this->to_eq_string() === $other->to_eq_string();
	}

	/**
	 * Defines string representation used for equality tests.
	 *
	 * @since 2021-12-27
	 *
	 * @return string String representation used for equality tests.
	 *                {@see \Clever_Canyon\Utilities\Traits\Base\Utilities\Property_Members::props()} for further details.
	 */
	final public function to_eq_string() : string {
		return U\Str::dump( $this, true, false );
	}
}
