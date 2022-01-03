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
declare( strict_types = 1 ); // ｡･:*:･ﾟ★.
namespace Clever_Canyon\Utilities\STC;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\{STC as U};
use Clever_Canyon\Utilities\OOP\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * File utilities.
 *
 * @since 2021-12-15
 */
class File extends \Clever_Canyon\Utilities\STC\Abstracts\A6t_Stc_Base {
	/**
	 * Gets file extension.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $file File path.
	 *
	 * @return string File extension, else empty string.
	 */
	public static function ext( string $file ) : string {
		return mb_strtolower( mb_substr( mb_strrchr( $file, '.' ) ?: '', 1 ) );
	}

	/**
	 * Makes a file.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $file        File path.
	 *
	 * @param array  $perms       Permissions. Default is `[ 0700, 0600 ]`.
	 *                            Key `0` is for any directories, key `1` for the file.
	 *
	 * @param bool   $recursively Make directories recursively? Default is `true`.
	 *
	 * @return bool True if all directories and file created successfully.
	 */
	public static function make( string $file, array $perms = [ 0700, 0600 ], bool $recursively = true ) : bool {
		$dir   = U\Dir::name( $file );
		$perms = array_map( 'intval', $perms );

		$perms[ 0 ] ??= 0700; // Directory permissions.
		$perms[ 1 ] ??= 0600; // File permissions.

		return ! file_exists( $file ) && U\Fs::delete( $file )
			&& ( is_dir( $dir ) || U\Dir::make( $dir, $perms[ 0 ], $recursively ) )
			&& touch( $file )
			&& chmod( $file, $perms[ 1 ] );
	}

	/**
	 * Makes a temp file.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext         File extension. Defaults to ``.
	 *
	 * @param string $dir         Directory to create file in.
	 *                            Defaults to {@see U\Dir::sys_temp()}.
	 *
	 * @param array  $perms       Permissions. Default is `[ 0700, 0600 ]`.
	 *                            Key `0` is for any directories, key `1` for the file.
	 *
	 * @param bool   $recursively Make directories recursively? Default is `true`.
	 *
	 * @throws Fatal_Exception  On any failure.
	 * @return string Absolute path to tempoary file.
	 */
	public static function make_temp( string $ext = '', string $dir = '', array $perms = [ 0700, 0600 ], bool $recursively = true ) : string {
		$ext = trim( $ext, '.' );

		$dir = $dir ?: U\Dir::sys_temp();
		$dir = U\Fs::normalize( $dir );

		$file = U\Dir::join( $dir, '/' . U\Crypto::uuid_v4() );
		$file = '' !== $ext ? $file . '.' . $ext : $file;

		if ( ! U\File::make( $file, $perms, $recursively ) ) {
			throw new Fatal_Exception( 'Unable to create temp file: `' . $file . '`.' );
		}
		return $file;
	}

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
		if ( ! preg_match( '/^([0-9\.]+)\s*(bytes|byte|b|kbs|kb|k|mb|m|gb|g|tb|t|pb|p)$/ui', $bytes_abbr, $_m ) ) {
			return 0; // Default value.
		}
		$value    = (float) $_m[ 1 ];
		$modifier = mb_strtolower( $_m[ 2 ] );

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
