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
namespace Clever_Canyon\Utilities\Traits\File\Utilities;

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
 * @see   U\File
 */
trait Write_Members {
	/**
	 * Writes contents to file.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $file             File path to write to.
	 * @param string $contents         New contents of the file.
	 * @param bool   $throw_on_failure Throw exceptions on failure? Default is `true`.
	 *
	 * @return bool True if contents written successfully.
	 *
	 * @throws U\Fatal_Exception On write failure; if `$throw_on_failure` is `true`.
	 */
	public static function write( string $file, string $contents, bool $throw_on_failure = true ) : bool {
		if ( '' === $file ) {
			return false; // Not possible.
		}
		if ( is_file( $file ) && is_writable( $file ) ) {
			if ( false !== file_put_contents( $file, $contents ) ) {
				return true;
			}
		}
		if ( $throw_on_failure ) {
			throw new U\Fatal_Exception(
				'Failed to write contents to: `' . basename( $file ) . '`.' .
				' Have filesystem permissions changed?'
			);
		}
		return false;
	}
}
