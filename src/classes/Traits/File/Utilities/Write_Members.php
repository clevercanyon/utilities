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
	 * @param string $file             An existing file path to write to.
	 *
	 *                                 * Unlike {@see file_put_contents()}, the file must exist already.
	 *                                   Please use {@see U\File::make()} to create files. The goal is to make
	 *                                   sure new files are always created explicitly, and that permissions
	 *                                   on those new files are configured properly by {@see U\File::make()}.
	 *
	 * @param string $contents         New contents of the file.
	 *
	 * @param bool   $throw_on_failure Throw exceptions on failure? Default is `true`.
	 *
	 * @return bool True if contents written successfully.
	 *
	 * @throws U\Fatal_Exception On any failure; if `$throw_on_failure` is `true`.
	 */
	public static function write( string $file, string $contents, bool $throw_on_failure = true ) : bool {
		if ( '' !== $file && is_file( $file ) && is_writable( $file ) ) {
			if ( 'php' === U\File::ext( $file, true ) ) {
				$contents = rtrim( $contents, "\n" ) . "\n";
			}
			if ( false !== file_put_contents( $file, $contents ) ) {
				U\Fs::clear_stat_cache( $file );
				return true; // Success.
			}
		}
		if ( $throw_on_failure ) {
			throw new U\Fatal_Exception(
				'Failed to write contents to: `' . $file . '`.' .
				' Have filesystem permissions changed?'
			);
		}
		return false;
	}
}
