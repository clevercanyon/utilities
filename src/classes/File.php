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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * File utilities.
 *
 * @since 2021-12-15
 */
final class File extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\File\Members;

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
	 * Get a file's ext type; e.g., Image, Audio, Video, MS Office, etc.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $file    File path.
	 * @param string $default Default ext. type, if unable to determine.
	 *                        Default for this is: `File`.
	 *
	 * @return string File's ext type; e.g., Image, Audio, Video, MS Office, etc.
	 */
	public static function ext_type( string $file, string $default = 'File' ) : string {
		$ext_type = $default;
		$ext      = U\File::ext( $file );

		foreach ( U\File::$mime_types as $_ext_type => $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				if ( in_array( $ext, explode( '|', $_exts ), true ) ) {
					$ext_type = $_ext_type;
					break 2; // Done.
				}
			}
		}
		return $ext_type;
	}

	/**
	 * Gets a file's MIME type.
	 *
	 * @since 2022-01-19
	 *
	 * @param string      $file    File path.
	 * @param string|null $default Default MIME type, if unable to determine.
	 *                             Default for this is: `null`, indicating `application/octet-stream`.
	 *
	 * @return string MIME type; e.g., text/html, image/svg+xml, etc.
	 */
	public static function mime_type( string $file, /* string|null */ ?string $default = null ) : string {
		$default   ??= 'application/octet-stream';
		$mime_type = $default; // Maybe redefine below.
		$ext       = U\File::ext( $file );

		foreach ( U\File::$mime_types as $_mime_types ) {
			foreach ( $_mime_types as $_exts => $_mime_type ) {
				if ( in_array( $ext, explode( '|', $_exts ), true ) ) {
					$mime_type = $_mime_type;
					break 2; // Done.
				}
			}
		}
		return $mime_type;
	}

	/**
	 * Gets a file's MIME type + charset, suitable for `content-type:` header.
	 *
	 * @since 2022-01-19
	 *
	 * @param string      $file    File path.
	 * @param string|null $default {@see U\File::mime_type()} for details.
	 *
	 * @param string|null $charset Optional and specific charset code to use in a `content-type` header. Default is `null`.
	 *                             If `null`, this is applied only to text/, +xml, JS/JSON, and a few other specifics,
	 *                             using current environment charset code, as returned by {@see U\Env::charset()}.
	 *
	 *                             One should generally pass this explicitly based on what is being served to a user,
	 *                             and based on the charset used by the file. The current charset may or may not be accurate.
	 *
	 *                             * To explicitly force no charset to be added, simply set this to an empty string.
	 *
	 * @return string MIME type + charset, suitable for `content-type:` header.
	 */
	public static function content_type(
		string $file,
		/* string|null */ ?string $default = null,
		/* string|null */ ?string $charset = null
	) : string {
		$charset      ??= null; // See below.
		$content_type = U\File::mime_type( $file, $default );

		switch ( $content_type ) {
			case ( isset( $charset ) ):
				if ( '' !== $charset ) {
					$content_type .= '; charset=' . $charset;
				} // Empty string indicates no charset explicitly.
				break; // Given explicitly.

			case 'application/hta':
			case 'application/xml-dtd':
			case 'application/json':
			case 'application/javascript':
			case 'application/x-php-source':
			case ( U\Str::begins_with( $content_type, 'text/' ) ):
			case ( U\Str::ends_with( $content_type, '+xml' ) ):
			case ( U\Str::ends_with( $content_type, '+json' ) ):
				$content_type .= '; charset=' . U\Env::charset();
				break; // Added automatically.
		}
		return $content_type;
	}

	/**
	 * Makes a file.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $file        File path to make.
	 *
	 * @param array  $perms       Permissions. Default is `[ 0700, 0600 ]`.
	 *                            Key `0` is for any directories, key `1` for the file.
	 *
	 * @param bool   $recursively Make directories recursively? Default is `true`.
	 *
	 * @return bool True if all directories and file made successfully.
	 */
	public static function make( string $file, array $perms = [ 0700, 0600 ], bool $recursively = true ) : bool {
		$dir   = U\Dir::name( $file );
		$perms = array_map( 'intval', $perms );

		$perms[ 0 ] ??= 0700; // Directory permissions.
		$perms[ 1 ] ??= 0600; // File permissions.

		return '' !== $dir
			&& '' !== $file
			&& ! U\Fs::really_exists( $file )
			&& ( ! is_link( $file ) || U\Fs::delete( $file ) )
			&& ( is_dir( $dir ) || U\Dir::make( $dir, $perms[ 0 ], $recursively ) )
			&& touch( $file )
			&& chmod( $file, $perms[ 1 ] );
	}

	/**
	 * Makes a temporary file.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext         File extension. Default is ``.
	 *
	 * @param string $dir         Directory to make file in.
	 *                            Defaults to {@see U\Dir::sys_temp()}.
	 *
	 * @param array  $perms       Permissions. Default is `[ 0700, 0600 ]`.
	 *                            Key `0` is for any directories, key `1` for the file.
	 *
	 * @param bool   $recursively Make directories recursively? Default is `true`.
	 *
	 * @throws U\Fatal_Exception  On any failure.
	 * @return string Absolute path to temporary file.
	 */
	public static function make_temp( string $ext = '', string $dir = '', array $perms = [ 0700, 0600 ], bool $recursively = true ) : string {
		$file = U\File::make_unique_path( $ext, $dir );

		if ( ! U\File::make( $file, $perms, $recursively ) ) {
			throw new U\Fatal_Exception( 'Unable to create temp file: `' . $file . '`.' );
		}
		return $file;
	}

	/**
	 * Makes a unique file path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ext File extension. Default is ``.
	 *
	 * @param string $dir Directory to make unique path in.
	 *                    Default is {@see U\Dir::sys_temp()}.
	 *
	 * @return string Absolute unique file path only; i.e., does not exist.
	 */
	public static function make_unique_path( string $ext = '', string $dir = '' ) : string {
		$ext = trim( $ext, '.' );

		$dir = $dir ?: U\Dir::sys_temp();
		$dir = U\Fs::normalize( $dir );

		$file = U\Dir::join( $dir, '/' . U\Crypto::uuid_v4() );
		$file = '' !== $ext ? $file . '.' . $ext : $file;

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
