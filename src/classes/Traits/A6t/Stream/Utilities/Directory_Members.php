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
trait Directory_Members {
	/**
	 * Opens directory.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path    Path.
	 * @param int    $options Options.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-opendir.php
	 */
	public function dir_opendir( string $path, int $options ) : bool {
		return false; // Not applicable.
	}

	/**
	 * Reads directory.
	 *
	 * @since 2022-01-29
	 *
	 * @return string Next filename; else ``.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-readdir.php
	 */
	public function dir_readdir() : string {
		return ''; // Not applicable.
	}

	/**
	 * Rewinds directory.
	 *
	 * @since 2022-01-29
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-rewinddir.php
	 */
	public function dir_rewinddir() : bool {
		return false; // Not applicable.
	}

	/**
	 * Closes directory.
	 *
	 * @since 2022-01-29
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.dir-closedir.php
	 */
	public function dir_closedir() : bool {
		return false; // Not applicable.
	}

	/**
	 * Makes directory.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support creating directories.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path    Path.
	 * @param int    $mode    Mode.
	 * @param int    $options Options.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.mkdir.php
	 *
	 * public function mkdir( string $path, int $mode, int $options ) : bool {
	 *    return false; // Not applicable.
	 * }
	 */

	/**
	 * Removes directory.
	 *
	 * In order for the appropriate error message to be returned, this method
	 * should *not* be defined if the wrapper does not support removing directories.
	 *
	 * @since 2022-01-29
	 *
	 * @param string $path    Path.
	 * @param int    $options Options.
	 *
	 * @return bool True on success.
	 *
	 * @see   https://www.php.net/manual/en/streamwrapper.rmdir.php
	 *
	 * public function rmdir( string $path, int $options ) : bool {
	 *    return false; // Not applicable.
	 * }
	 */
}
