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
namespace Clever_Canyon\Utilities\I7e;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Static base class interface.
 *
 * @since 2021-12-15
 */
interface Stc_Base {
	/**
	 * Instantiates object w/ requested state.
	 *
	 * @since 2021-12-27
	 *
	 * @param array $props Properties; i.e., desired state.
	 *
	 * @returns object A newly instantiated instance.
	 *
	 * @see   https://www.php.net/manual/en/function.var-export.php
	 * @see   https://www.php.net/manual/en/language.oop5.magic.php#object.set-state
	 *
	 * @note  PHP's {@see var_export()} produces code that attempts to call this function.
	 *        For further details {@see https://www.php.net/manual/en/function.var-export.php}.
	 */
	public static function __set_state( array $props ) : object;

	/**
	 * Invokes inaccessible methods.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $method Method name.
	 * @param array  $args   Invocation args.
	 *
	 * @return mixed Invocation's return value.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.overloading.php
	 */
	public static function __callStatic( string $method, array $args ); /* : mixed */
}
