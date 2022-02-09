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
trait Output_Buffer_Members {
	/**
	 * Ends output buffering.
	 *
	 * @since 2021-12-15
	 *
	 * @param int|null $keep_ob_level Base output buffering level. Default is `0` (i.e., end all output buffers).
	 *                                Set to something higher (e.g., `1`) to end output buffers up to,
	 *                                but excluding, a different level, which you'd like to keep.
	 *
	 * @return bool True if output buffering ended successfully.
	 *
	 * @see   https://www.php.net/manual/en/function.ob-end-clean.php
	 */
	public static function end_output_buffering( /* int|null */ ?int $keep_ob_level = null ) : bool {
		$keep_ob_level ??= U\Env::in_test_mode( 'phpunit' ) ? 1 : 0;
		$keep_ob_level = max( 0, $keep_ob_level ); // Guard against infinite loop.

		while ( ob_get_level() !== $keep_ob_level ) {
			if ( ! ob_end_clean() ) {
				return false; // Special buffers do exist!
			}
		}
		return true;
	}
}
