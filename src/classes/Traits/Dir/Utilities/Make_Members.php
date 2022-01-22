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
namespace Clever_Canyon\Utilities\Traits\Dir\Utilities;

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
 * @see   U\Dir
 */
trait Make_Members {
	/**
	 * Makes a directory.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $dir         Directory path to make.
	 * @param int    $perms       Permissions. Default is `0700`.
	 * @param bool   $recursively Recursively? Default is `true`.
	 *
	 * @return bool True if all directories made successfully.
	 */
	public static function make( string $dir, int $perms = 0700, bool $recursively = true ) : bool {
		$dir = U\Fs::normalize( $dir );

		return '' !== $dir
			&& ! U\Fs::really_exists( $dir )
			&& ( ! is_link( $dir ) || U\Fs::delete( $dir ) )
			&& mkdir( $dir, $perms, $recursively )
			&& chmod( $dir, $perms );
	}

	/**
	 * Makes a temporary directory.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $dir         Directory to make temporary directory in.
	 *                            Default is {@see U\Dir::sys_temp()}.
	 *
	 * @param int    $perms       Permissions. Default is `0700`.
	 * @param bool   $recursively Recursively? Default is `true`.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 * @return string Absolute path to temporary directory.
	 */
	public static function make_temp( string $dir = '', int $perms = 0700, bool $recursively = true ) : string {
		$dir = U\Dir::make_unique_path( $dir );

		if ( ! U\Dir::make( $dir, $perms, $recursively ) ) {
			throw new U\Fatal_Exception( 'Unable to create temp directory: `' . $dir . '`.' );
		}
		return $dir;
	}

	/**
	 * Makes a unique directory path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $dir Directory to make unique path in.
	 *                    Default is {@see U\Dir::sys_temp()}.
	 *
	 * @return string Absolute unique directory path only; i.e., does not exist.
	 */
	public static function make_unique_path( string $dir = '' ) : string {
		$dir = $dir ?: U\Dir::sys_temp();
		$dir = U\Dir::join( $dir, '/' . U\Crypto::uuid_v4() );

		return $dir;
	}
}
