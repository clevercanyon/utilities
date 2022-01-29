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
trait Exists_Members {
	/**
	 * Filesystem path exists?
	 *
	 * {@see file_exists()} returns `false` for symlinks pointing to nonexistent paths, so must check if {@see is_link()}.
	 * That's why this function returns `true` if it exists in any way, even if it's a broken symlink.
	 *
	 * On Windows, {@see file_exists()} already returns `true` for symlinks pointing to nonexistent paths.
	 * Windows behavior doesn't cause a conflict, just good to be aware; {@see U\Fs::really_exists()}.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to check.
	 *
	 * @return bool True if filesystem path exists.
	 *
	 * @see   https://www.php.net/manual/en/function.file-exists.php
	 */
	public static function exists( string $path ) : bool {
		return file_exists( $path ) || is_link( $path );
	}

	/**
	 * Filesystem path really exists?
	 *
	 * {@see file_exists()} already returns `false` for symlinks pointing to nonexistent paths.
	 * However, on Windows, {@see file_exists()} returns `true` for symlinks pointing to nonexistent paths.
	 * This function resolves the conflicting behavior, such it returns consistently on Windows.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path Path to check.
	 *
	 * @return bool True if filesystem path really exists.
	 *
	 * @see   https://www.php.net/manual/en/function.file-exists.php
	 * @see   https://www.php.net/manual/en/function.stat.php
	 */
	public static function really_exists( string $path ) : bool {
		if ( U\Env::is_windows() ) {
			return ! empty( @stat( $path )[ 'ino' ] ?? null ); // phpcs:ignore.
		}
		return file_exists( $path );
	}
}
