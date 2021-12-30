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
namespace Clever_Canyon\Utilities\STC\Version_1_0_0;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\STC\{Version_1_0_0 as U};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\{Offsets, Generic, Error, Exception, Fatal_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Abstracts\{A6t_Base, A6t_Offsets, A6t_Generic, A6t_Error, A6t_Exception};
use Clever_Canyon\Utilities\OOP\Version_1_0_0\Interfaces\{I7e_Base, I7e_Offsets, I7e_Generic, I7e_Error, I7e_Exception};

// </editor-fold>

/**
 * File utilities.
 *
 * @since 2021-12-15
 */
class File extends \Clever_Canyon\Utilities\STC\Version_1_0_0\Abstracts\A6t_Stc_Base {
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
	 * @throws Exception  On any failure.
	 * @return string Absolute path to tempoary file.
	 */
	public static function make_temp( string $ext = '', string $dir = '', array $perms = [ 0700, 0600 ], bool $recursively = true ) : string {
		$ext = trim( $ext, '.' );

		$dir = $dir ?: U\Dir::sys_temp();
		$dir = U\Fs::normalize( $dir );

		$file = U\Dir::join( $dir, '/' . U\Crypto::uuid_v4() );
		$file = '' !== $ext ? $file . '.' . $ext : $file;

		if ( ! U\File::make( $file, $perms, $recursively ) ) {
			throw new Exception( 'Unable to create temp file: `' . $file . '`.' );
		}
		return $file;
	}
}
