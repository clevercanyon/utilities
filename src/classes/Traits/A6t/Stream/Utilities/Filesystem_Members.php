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
namespace Clever_Canyon\Utilities\Traits\A6t\Stream\Utilities;

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
 * @see   U\I7e\Stream
 */
trait Filesystem_Members {
	/**
	 * Renames a filesystem path.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support renaming filesystem paths.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $from_path From path.
	 * @param string $to_path   To path.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.rename.php
	 *
	 * public function rename( string $from_path, string $to_path ) : bool {
	 *    return false; // Not applicable.
	 * }
	 */

	/**
	 * Removes a filesystem path.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support removing filesystem paths.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path Path.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.unlink.php
	 *
	 * public function unlink( string $path ) : bool {
	 *    return false; // Not applicable.
	 * }
	 */
}
