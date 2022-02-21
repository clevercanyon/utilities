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
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait Constant_Members {
	/**
	 * Gets a constant; if defined.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $name Name.
	 *
	 * @return mixed Mixed; else `null` if not defined.
	 */
	public static function const( string $name ) /* : mixed */ {
		if ( defined( $name ) ) {
			return constant( $name );
		}
		return null;
	}

	/**
	 * Defines a constant, if not defined already.
	 *
	 * @since 2021-12-15
	 *
	 * @param string                     $name  Name.
	 * @param int|float|string|bool|null $value Value.
	 *
	 * @return bool True if already defined and already set to `$value`.
	 *              Otherwise, `true` if a new constant is defined successfully.
	 */
	public static function maybe_define( string $name, /* int|float|string|bool|null */ $value ) : bool {
		if ( defined( $name ) ) {
			return constant( $name ) === $value;
		}
		return define( $name, $value );
	}
}
