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
namespace Clever_Canyon\Utilities\Traits\Fs\Utilities;

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
 * @see   U\Fs
 */
trait Make_Members {
	/**
	 * Makes a symbolic link.
	 *
	 * On Windows and possibly other systems, it's not possible to create a link pointing to a
	 * symbolic and/or nonexitent path. That's the reason for {@see U\Fs::realize()} expansion below.
	 *
	 * @since 2022-01-21
	 *
	 * @param string $target_path Link target path.
	 * @param string $link_path   Link path (symbolic).
	 *
	 * @param array  $perms       Permissions. Default is `[ [ 0700, 0700 ], 0600 ]`.
	 *                            Key `0` is for any directories, key `1` for the link.
	 *                            {@see U\Dir::make()} for directory permission details.
	 *
	 *                            * Permissions for the link are not applicable at this time.
	 *                              However, please continue to pass, as it might be possible in the future.
	 *
	 * @param bool   $recursively Make directories recursively? Default is `true`.
	 *
	 * @return bool True if link created successfully.
	 */
	public static function make_link( string $target_path, string $link_path, array $perms = [ [ 0700, 0700 ], 0600 ], bool $recursively = true ) : bool {
		$link_path_dir    = U\Dir::name( $link_path );
		$real_target_path = U\Fs::realize( $target_path );

		$perms[ 0 ] ??= [ 0700, 0700 ]; // Directory permissions.
		$perms[ 1 ] ??= 0600;           // Link permissions (n/a at this time).

		return '' !== $target_path
			&& '' !== $real_target_path
			&& '' !== $link_path
			&& '' !== $link_path_dir
			&& U\Fs::really_exists( $real_target_path )
			&& ! U\Fs::really_exists( $link_path )
			&& ( ! is_link( $link_path ) || U\Fs::delete( $link_path ) )
			&& ( is_dir( $link_path_dir ) || U\Dir::make( $link_path_dir, $perms[ 0 ], $recursively ) )
			&& symlink( $real_target_path, $link_path );
	}
}
