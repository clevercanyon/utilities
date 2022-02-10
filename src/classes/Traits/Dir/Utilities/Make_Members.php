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
	 * @param string      $dir              Directory path to make.
	 *
	 * @param array|int[] $perms            Permissions. Default is `[ 0700, 0700 ]`.
	 *                                      Key `0` is for any parent directories leading up to the last one.
	 *                                      Key `1` is for the last directory, which can have different permissions.
	 *
	 *                                      * Parent directory permissions are handled by {@see mkdir()}, and they are therefore
	 *                                        subject to a {@see umask()}. A PHP umask typically defaults to `0022`; enforcing
	 *                                        no higher than `755` for new directories. `644` for new files.
	 *
	 *                                      * Note: A {@see umask()} can't add permissions. It can only remove them.
	 *                                        It is best to allow {@see umask()} to do it's thing, and instead put focus
	 *                                        on the last directory, which, at times, might need different permissions.
	 *
	 *                                      * Permissions on the last directory are forced to be exact; via {@see chmod()}.
	 *
	 * @param bool        $recursively      Recursively? Default is `true`.
	 * @param bool        $throw_on_failure Throw exception on failure? Default is `true`.
	 *
	 * @return bool True if all directories made successfully.
	 *
	 * @throws U\Fatal_Exception On any failure; if `$throw_on_failure` is `true`.
	 */
	public static function make(
		string $dir,
		array $perms = [ 0700, 0700 ],
		bool $recursively = true,
		bool $throw_on_failure = true
	) : bool {
		$perms[ 0 ] ??= 0700; // Parent directory permissions.
		$perms[ 1 ] ??= 0700; // Directory permissions.
		assert( is_int( $perms[ 0 ] ) && is_int( $perms[ 1 ] ) );

		if ( '' !== $dir
			&& ! U\Fs::really_exists( $dir )
			&& ( ! is_link( $dir ) || U\Fs::delete( $dir ) )
			&& @mkdir( $dir, $perms[ 0 ], $recursively ) // phpcs:ignore.
			&& chmod( $dir, $perms[ 1 ] )
		) {
			U\Fs::clear_stat_cache( $dir );
			return true; // Success.
		}
		if ( $throw_on_failure ) {
			throw new U\Fatal_Exception(
				'Failed to make directory: `' . $dir . '`.' .
				' Have filesystem permissions changed?'
			);
		}
		return false;
	}

	/**
	 * Makes a temporary directory.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $dir         Directory to make temporary directory in.
	 *                                 Default is {@see U\Dir::sys_temp()}.
	 *
	 * @param array|int[] $perms       Permissions. Default is `[ 0700, 0700 ]`.
	 *                                 {@see U\Dir::make()} for directory permission details.
	 *
	 * @param bool        $recursively Recursively? Default is `true`.
	 *
	 * @return string Absolute path to temporary directory.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	public static function make_temp(
		string $dir = '',
		array $perms = [ 0700, 0700 ],
		bool $recursively = true
	) : string {
		$dir = U\Dir::make_unique_path( $dir );

		if ( ! U\Dir::make( $dir, $perms, $recursively, false ) ) {
			throw new U\Fatal_Exception(
				'Failed to make temp directory: `' . $dir . '`.' .
				' Have filesystem permissions changed?'
			);
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
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	public static function make_unique_path( string $dir = '' ) : string {
		$dir = $dir ?: U\Dir::sys_temp();
		return U\Dir::join( $dir, '/' . U\Crypto::uuid_v4() );
	}
}
