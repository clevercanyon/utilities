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
trait Delete_Members {
	/**
	 * Deletes a path recursively (by default).
	 *
	 * This intentionally does not follow symlinks. It deletes them.
	 * A link is just a link. This does not recurse into symlinked directories.
	 *
	 * After reviewing PHP source code, {@see unlink()} and {@see rmdir()}
	 * both fire {@see clearstatcache()} whenever a directory and/or file is deleted.
	 * Therefore, it's not necessary to do that here.
	 *
	 * @since 1.0.0
	 *
	 * @param string      $path           Path to delete.
	 * @param bool        $recursively    Recursively? Default is `true`.
	 *
	 * @param bool        $x_confirmation Added confirmation. Default is `false`.
	 *                                    This is needed when attempting to delete the root of anything.
	 *
	 * @param object|null $_r             Internal use only — do not pass.
	 *
	 * @return bool True if deleted successfully.
	 *
	 * @todo  Add `$throw_on_failure` argument?
	 */
	public static function delete(
		string $path,
		bool $recursively = true,
		bool $x_confirmation = false,
		/* object|null */ ?object $_r = null
	) : bool {
		// Recursive check.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// `$path` validation.

		$path           = U\Fs::normalize( $path );
		$path_type      = U\Fs::type( $path );
		$path_real_type = U\Fs::real_type( $path );

		if ( '' === $path || ! $path_type || ! $path_real_type ) {
			return true; // No longer exists.
		}
		if ( ! $x_confirmation && '' === trim( $path, '/' ) ) {
			// Refuse when we're missing added confirmation.
			return false; // Don't destroy the root of anything.
		}
		if ( ! $is_recursive && ! $x_confirmation
			&& U\Fs::may_have_wrappers( $path, [ 'skip:str_replace' => true ] )
		) {
			$wrappers = U\Fs::wrappers( $path, 'string', [
				'bypass:may_have_wrappers' => true,
				'bypass:normalize'         => true,
			] );
			if ( $wrappers ) { // Take a closer look.
				$wrappers         = mb_strtolower( $wrappers );
				$path_no_wrappers = mb_substr( $path, mb_strlen( $wrappers ) );
				$last_wrapper     = U\Arr::value_last( U\Fs::split_wrappers( $wrappers ) );

				if ( ! $path_no_wrappers || '' === trim( $path_no_wrappers, '/' ) ) {
					// Refuse when we're missing added confirmation.
					return false; // Don't destroy the root of anything.
				}
				if ( false === mb_strpos( trim( $path_no_wrappers, '/' ), '/' )
					&& preg_match( '/^(?:\/{2}|(?:s3|php|http|data|expect|ssh2\.tunnel)\:\/{2})$/ui', $last_wrapper ) ) {
					// Must have `foo/bar` at minimum. Refuse when we're missing added confirmation.
					return false; // Don't destroy the root of anything.
				}
			} // End `$wrappers` check from above.
		}
		// If it's not writable, and it's a link, then it's possibly a broken link.
		// We skip over broken links and instead let the next section handle link deletion.

		if ( ! is_writable( $path ) && 'broken-link' !== $path_real_type ) {
			return false; // Not possible.
		}
		// Link, broken link, file, and non-recursive directory deletion.

		if ( ! $recursively || in_array( $path_type, [ 'link', 'file' ], true ) ) {
			if ( 'link' === $path_type && 'broken-link' === $path_real_type ) {
				return @unlink( $path ) || ( U\Env::is_windows() && @rmdir( $path ) ); // phpcs:ignore.
			}
			if ( 'link' === $path_type && 'dir' === $path_real_type && U\Env::is_windows() ) {
				return rmdir( $path ); // Directory links require {@see rmdir()} on Windows.
			}
			return 'dir' === $path_type ? @rmdir( $path ) : unlink( $path ); // phpcs:ignore.
		}
		// Recursive directory deletion.

		if ( ! ( $_path_opendir = opendir( $path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_path = U\Dir::join( $path, '/' . $_subpath );

			if ( ! U\Fs::delete( $_path, $recursively, $x_confirmation, $_r ) ) {
				closedir( $_path_opendir );
				return false;
			}
		}
		closedir( $_path_opendir );
		return rmdir( $path );
	}
}
