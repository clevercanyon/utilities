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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\STC\Version_1_0_0\Traits\I7e_Stc_Base\Magic;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   \Clever_Canyon\Utilities\STC\Version_1_0_0\Interfaces\I7e_Stc_Base
 */
trait Unimportable_Members {
	/**
	 * Instantiates object w/ requested state.
	 *
	 * @since 2021-12-27
	 *
	 * @param array $props Properties; i.e., desired state.
	 *
	 * @throws Fatal_Exception If called in any way.
	 * @returns object A newly instantiated instance.
	 *
	 * @see   https://www.php.net/manual/en/function.var-export.php
	 * @see   https://www.php.net/manual/en/language.oop5.magic.php#object.set-state
	 *
	 * @note  PHP's {@see var_export()} produces code that attempts to call {@see __set_state()}.
	 *        For further details {@see https://www.php.net/manual/en/function.var-export.php}.
	 */
	public static function __set_state( array $props ) : object {
		throw new Fatal_Exception(
			'Any attempt to import the state of: `' . get_called_class() . '`' .
			' is potentially dangerous and therefore not allowed at this time.'
		);
	}
}
