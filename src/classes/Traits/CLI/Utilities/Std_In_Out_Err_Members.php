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
	 * Gets standard input.
	 *
	 * @since 2021-12-15
	 *
	 * @param int $lines Defaults to `0` (no limit).
	 *
	 * @return string X lines of stdin.
	 */
	public static function stdin( int $lines = 0 ) : string {
		$stdin      = '';
		$lines_read = 0;

		stream_set_blocking( STDIN, false );

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
	 * Sends standard output.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $data Output data.
	 */
	public static function stdout( /* mixed */ $data ) : void {
		$string = U\Str::stringify( $data, true );

		stream_set_blocking( STDOUT, true );
		fwrite( STDOUT, $string . "\n" );
	}

	/**
	 * Sends standard error.
	 *
	 * @since 2021-12-15
	 *
	 * @param mixed $data Output data.
	 */
	public static function stderr( /* mixed */ $data ) : void {
		$string = U\Str::stringify( $data, true );

		stream_set_blocking( STDERR, true );
		fwrite( STDERR, $string . "\n" );
	}
}
