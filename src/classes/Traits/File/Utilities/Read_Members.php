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
trait Read_Members {
	/**
	 * Reads contents of file.
	 *
	 * @since 2021-12-19
	 *
	 * @param string   $file             File path to read from.
	 * @param bool     $throw_on_failure Throw exceptions on failure? Default is `true`.
	 * @param int|null $bytes            Max bytes. Default is `null` (read entire file).
	 *
	 * @return string File contents; else empty string.
	 *
	 * @throws U\Fatal_Exception On read failure; if `$throw_on_failure` is `true`.
	 */
	public static function read( string $file, bool $throw_on_failure = true, /* int|null */ ?int $bytes = null ) : string {
		if ( '' === $file ) {
			return ''; // Not possible.
		}
		if ( is_file( $file ) && is_readable( $file ) ) {
			if ( null !== $bytes ) {
				if ( false !== ( $contents = file_get_contents( $file, false, null, 0, $bytes ) ) ) {
					return trim( $contents );
				}
			} else {
				if ( false !== ( $contents = file_get_contents( $file ) ) ) {
					return trim( $contents );
				}
			}
		}
		if ( $throw_on_failure ) {
			throw new U\Fatal_Exception(
				'Failed to read contents of: `' . basename( $file ) . '`.' .
				' Have filesystem permissions changed?'
			);
		}
		return '';
	}
}
