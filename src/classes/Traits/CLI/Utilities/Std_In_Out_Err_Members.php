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
namespace Clever_Canyon\Utilities\Traits\CLI\Utilities;

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
 * @see   U\CLI
 */
trait Std_In_Out_Err_Members {
	/**
	 * Gets standard input lines.
	 *
	 * @since 2021-12-15
	 *
	 * @param bool $blocking Blocking mode? Default is `false`.
	 * @param int  $lines    Defaults to `0` (no limit).
	 *
	 * @return string N`$lines` lines of stdin.
	 */
	public static function stdin_lines( bool $blocking = false, int $lines = 0 ) : string {
		$stdin      = '';
		$lines_read = 0;

		stream_set_blocking( STDIN, $blocking );

		while ( false !== ( $_line = fgets( STDIN ) ) ) {
			$stdin .= $_line;
			$lines_read++;

			if ( $lines && $lines_read >= $lines ) {
				break;
			}
		}
		return trim( $stdin );
	}

	/**
	 * Gets standard input bytes.
	 *
	 * Despite the name {@see fgetc()}, this gets bytes, not chars.
	 * Bytes are fine. Would be nice if it were multibyte safe, though.
	 *
	 * @since 2021-12-15
	 *
	 * @param bool $blocking Blocking mode? Default is `false`.
	 * @param int  $bytes    Defaults to `0` (no limit).
	 *
	 * @return string N`$bytes` bytes of stdin.
	 */
	public static function stdin_bytes( bool $blocking = false, int $bytes = 0 ) : string {
		$stdin      = '';
		$bytes_read = 0;

		stream_set_blocking( STDIN, $blocking );

		while ( false !== ( $_byte = fgetc( STDIN ) ) ) {
			$stdin .= $_byte;
			$bytes_read++;

			if ( $bytes && $bytes_read >= $bytes ) {
				break;
			}
		}
		return trim( $stdin );
	}

	/**
	 * Sends standard output.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $data     Output data.
	 * @param bool  $new_line Include `\n`? Default is `true`.
	 */
	public static function stdout( /* mixed */ $data, bool $new_line = true ) : void {
		$string = U\Str::stringify( $data, true );

		stream_set_blocking( STDOUT, true );
		fwrite( STDOUT, $string . ( $new_line ? "\n" : '' ) );
	}

	/**
	 * Sends standard error.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $data     Output data.
	 * @param bool  $new_line Include `\n`? Default is `true`.
	 */
	public static function stderr( /* mixed */ $data, bool $new_line = true ) : void {
		$string = U\Str::stringify( $data, true );

		stream_set_blocking( STDERR, true );
		fwrite( STDERR, $string . ( $new_line ? "\n" : '' ) );
	}
}
