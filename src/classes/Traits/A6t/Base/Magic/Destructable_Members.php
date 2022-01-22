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
namespace Clever_Canyon\Utilities\Traits\A6t\Base\Magic;

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
trait Destructable_Members {
	/**
	 * Handles shutdown on object destruction.
	 *
	 * @since 2021-12-27
	 *
	 * @note  The destructor method will be called as soon as there are no other references
	 *        to a particular object, or in any order during the shutdown sequence.
	 *
	 * @note  The destructor will be called even if script execution is stopped using {@see exit()}.
	 *        Calling {@see exit()} in a destructor will prevent the remaining shutdown routines from executing.
	 *
	 * @note  Destructors called during the script shutdown have HTTP headers already sent.
	 *        The working directory in the script shutdown phase can be different with some SAPIs (e.g. Apache).
	 *
	 * @note  Attempting to throw an exception from a destructor (called at time of script termination) causes a fatal error.
	 *
	 * @see   https://www.php.net/manual/en/language.oop5.decon.php
	 */
	public function __destruct() /* : void */ {
		// Nothing at this time.
	}
}
