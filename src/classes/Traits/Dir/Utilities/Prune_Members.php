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
trait Prune_Members {
	/**
	 * Prunes a directory.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $path       Directory to prune.
	 *
	 * @param array       $prune      Array of regex expressions to prune.
	 * @param array       $exceptions Array of regex expressions to keep (i.e., prune exceptions).
	 *
	 * @param string|null $base_path  Base path, which gets stripped prior to regex matching. Defaults to `$path`.
	 *                                Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param object|null $_r         Internal use only — do not pass.
	 *
	 * @return bool True on success.
	 */
	public static function prune(
		string $path,
		array $prune,
		array $exceptions = [],
		/* string|null */ ?string $base_path = null,
		/* object|null */ ?object $_r = null
	) : bool {
		// Recursion info.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [];

		// Anything to prune?

		if ( ! $prune ) {
			return true; // Nothing to do.
		}
		// `$path` validation.

		$path           = U\Fs::normalize( $path );
		$path_real_type = U\Fs::real_type( $path );

		if ( 'dir' !== $path_real_type ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $path ) ) {
			return false; // Not possible.
		}
		// Base path collection.

		if ( ! $is_recursive ) {
			$base_path ??= $path; // Default value.
			$base_path = U\Fs::normalize( $base_path );
		}
		// Recursive directory pruning.

		if ( ! ( $_path_opendir = opendir( $path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_path         = U\Dir::join( $path, '/' . $_subpath );
			$_base_subpath = U\Dir::subpath( $base_path, $_path );

			if ( $prune && U\Str::preg_match_in( $prune, $_base_subpath ) ) {
				if ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $_base_subpath ) ) {
					if ( ! U\Fs::delete( $_path, true, false ) ) {
						closedir( $_path_opendir );
						return false;
					}
					continue; // Continue iterating subpaths.
					// i.e., Avoiding unnecessary recursion below.
				}
			}
			if ( // Only recurse into directores, not links.
				'dir' === U\Fs::type( $_path ) // Do not follow symlinks.
				&& ! U\Dir::prune( $_path, $prune, $exceptions, $base_path, $_r )
			) {
				closedir( $_path_opendir );
				return false;
			}
		}
		closedir( $_path_opendir );
		return true;
	}
}
