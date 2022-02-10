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
trait Size_Abbr_Members {
	/**
	 * Abbreviated byte notation.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $file Absolute file path.
	 *
	 * @return string Abbreviated byte notation.
	 */
	public static function size_abbr( string $file ) : string {
		if ( ! $file ) {
			return ''; // Empty.
		} elseif ( ! is_file( $file ) ) {
			return ''; // Not possible.
		} elseif ( ! is_readable( $file ) ) {
			return ''; // Not possible.
		}
		return U\File::bytes_abbr( filesize( $file ) );
	}

	/**
	 * Abbreviated byte notation for use in PHP ini settings.
	 *
	 * @since 2021-12-15
	 *
	 * @param int|float $bytes Bytes.
	 *
	 * @return string Abbreviated byte notation for use in PHP ini settings.
	 *
	 * @see   https://www.php.net/manual/en/faq.using.php#faq.using.shorthandbytes
	 */
	public static function ini_bytes_abbr( float $bytes ) : string {
		$bytes     = (int) min( $bytes, PHP_INT_MAX );
		$bytes     = max( 0, $bytes );
		$precision = 0;

		$units       = [ 'B', 'K', 'M', 'G' ];
		$total_units = count( $units );

		$power = floor( ( $bytes ? log( $bytes ) : 0 ) / log( 1024 ) );
		$power = min( $power, $total_units - 1 );

		$abbr_bytes = round( $bytes / pow( 1024, $power ), $precision );
		$abbr       = $units[ $power ];

		if ( 'B' === $abbr ) {
			return (string) $abbr_bytes;
		}
		return $abbr_bytes . $abbr;
	}

	/**
	 * Abbreviated byte notation.
	 *
	 * @since 2021-12-15
	 *
	 * @param int|float $bytes     Bytes.
	 * @param int       $precision Number of decimals.
	 *
	 * @return string Abbreviated byte notation.
	 */
	public static function bytes_abbr( float $bytes, int $precision = 2 ) : string {
		$bytes     = (int) min( $bytes, PHP_INT_MAX );
		$bytes     = max( 0, $bytes );
		$precision = max( 0, $precision );

		$units       = [ 'bytes', 'kbs', 'MB', 'GB', 'TB', 'PB' ];
		$total_units = count( $units );

		$power = floor( ( $bytes ? log( $bytes ) : 0 ) / log( 1024 ) );
		$power = min( $power, $total_units - 1 );

		$abbr_bytes = round( $bytes / pow( 1024, $power ), $precision );
		$abbr       = $units[ $power ];

		if ( 1.0 === $abbr_bytes ) {
			if ( 'bytes' === $abbr ) {
				$abbr = 'byte';
			} elseif ( 'kbs' === $abbr ) {
				$abbr = 'kb';
			}
		}
		return $abbr_bytes . ' ' . $abbr;
	}

	/**
	 * Bytes represented by an abbreviated byte notation.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $bytes_abbr Abbreviated byte notation.
	 *
	 * @return int Bytes represented by an abbreviated byte notation.
	 */
	public static function abbr_bytes( string $bytes_abbr ) : int {
		if ( ! $bytes_abbr ) {
			return 0; // Default value.
		}
		if ( ! preg_match( '/^([0-9\.]+)\s*(bytes|byte|b|kbs|kb|k|mb|m|gb|g|tb|t|pb|p)?$/ui', $bytes_abbr, $_m ) ) {
			return 0; // Default value.
		}
		$value    = (float) $_m[ 1 ];
		$modifier = mb_strtolower( $_m[ 2 ] ?? '' );

		switch ( $modifier ) {
			case 'p':
			case 'pb':
				$value *= 1024; // Fall through.
			case 't':
			case 'tb':
				$value *= 1024; // Fall through.
			case 'g':
			case 'gb':
				$value *= 1024; // Fall through.
			case 'm':
			case 'mb':
				$value *= 1024; // Fall through.
			case 'k':
			case 'kb':
			case 'kbs':
				$value *= 1024;
		}
		return (int) min( $value, PHP_INT_MAX );
	}
}
