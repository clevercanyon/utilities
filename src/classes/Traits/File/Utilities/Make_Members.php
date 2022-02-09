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
trait Make_Members {
	/**
	 * Makes a file.
	 *
	 * @since 2021-12-19
	 *
	 * @param string              $file        File path to make.
	 *
	 * @param array|int[]|array[] $perms       Permissions. Default is `[ [ 0700, 0700 ], 0600 ]`.
	 *                                         Key `0` is for any directories, key `1` for the file.
	 *                                         {@see U\Dir::make()} for directory permission details.
	 *
	 * @param bool                $recursively Make directories recursively? Default is `true`.
	 *
	 * @return bool True if all directories and file made successfully.
	 */
	public static function make( string $file, array $perms = [ [ 0700, 0700 ], 0600 ], bool $recursively = true ) : bool {
		$dir = U\Dir::name( $file );

		$perms[ 0 ] ??= [ 0700, 0700 ]; // Directory permissions.
		$perms[ 1 ] ??= 0600;           // File permissions.
		assert( is_array( $perms[ 0 ] ) && is_int( $perms[ 1 ] ) );

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
	 * @param string              $ext         File extension. Default is ``.
	 *
	 * @param string              $dir         Directory to make file in.
	 *                                         Defaults to {@see U\Dir::sys_temp()}.
	 *
	 * @param array|int[]|array[] $perms       Permissions. Default is `[ [ 0700, 0700 ], 0600 ]`.
	 *                                         Key `0` is for any directories, key `1` for the file.
	 *                                         {@see U\Dir::make()} for directory permission details.
	 *
	 * @param bool                $recursively Make directories recursively? Default is `true`.
	 *
	 * @return string Absolute path to temporary file.
	 *
	 * @throws U\Fatal_Exception  On any failure.
	 */
	public static function make_temp( string $ext = '', string $dir = '', array $perms = [ [ 0700, 0700 ], 0600 ], bool $recursively = true ) : string {
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
}
