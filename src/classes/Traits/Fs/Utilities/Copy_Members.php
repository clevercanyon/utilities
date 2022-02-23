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
trait Copy_Members {
	/**
	 * Copies one path to another path.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $from_path         Path to copy.
	 *                                       Note: If this ends with `/*`, the contents of `$from_path` will be copied to
	 *                                       the contents of `$to_path`, such that a merge into `$to_path` occurs;
	 *                                       i.e., instead of deleting & replacing `$to_path` entirely.
	 *
	 * @param string      $to_path           Destination path.
	 *
	 * @param array|null  $ignore            Array of regex expressions to ignore; i.e., not copy.
	 *                                       Default is {@see U\Fs::typically_ignore_regexp_lookahead()}.
	 *
	 * @param array|null  $exceptions        Array of regex expressions to not ignore (i.e., exceptions to the ignore list).
	 *                                       Default is `null`; i.e., resulting in no exceptions.
	 *
	 * @param string|null $base_path         Base path, which gets stripped prior to regex matching. Defaults to `$from_path`.
	 *                                       Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param bool        $follow_symlinks   Follow symlinks? Default is `true`.
	 *
	 * @param array|int[] $to_path_dir_perms Defaults to `[ 0700, 0700 ]`. {@see U\Dir::make()} for permission details.
	 *                                       If `$to_path`'s parent directories do not exist, they'll be created automatically.
	 *                                       This establishes the permissions for those newly created directories, when/if applicable.
	 *
	 * @param object|null $_r                Internal use only — do not pass.
	 *
	 * @return bool True if copied successfully.
	 *
	 * @throws U\Fatal_Exception If attempting to copy into self, leading to an infinite loop.
	 * @throws U\Fatal_Exception If a circular symlink is detected, leading to an infinite loop.
	 */
	public static function copy(
		string $from_path,
		string $to_path,
		/* array|null */ ?array $ignore = null,
		/* array|null */ ?array $exceptions = null,
		/* string|null */ ?string $base_path = null,
		bool $follow_symlinks = true,
		array $to_path_dir_perms = [ 0700, 0700 ],
		/* object|null */ ?object $_r = null
	) : bool {
		// Check recursion.

		$is_recursive = isset( $_r );
		$_r           ??= (object) [ 'cycle_stack' => [] ];

		// Maybe set default ignores.

		if ( ! $is_recursive && null === $ignore ) {
			$ignore = [ U\Fs::typically_ignore_regexp_lookahead( 'positive' ) ];
		}
		// Maybe set default exceptions.

		if ( ! $is_recursive && null === $exceptions ) {
			$exceptions = []; // No exceptions.
		}
		// Copy directory contents check.

		if ( ! $is_recursive && '/*' === mb_substr( $from_path, -2 ) ) {
			return U\Fs::copy_dir_contents_helper(
				mb_substr( $from_path, 0, -2 ),
				$to_path,
				$ignore,
				$exceptions,
				$base_path,
				$follow_symlinks,
				$to_path_dir_perms,
			);
		}
		// `$from_path` validation.

		$from_path       = U\Fs::normalize( $from_path );
		$from_path_type  = U\Fs::type( $from_path );
		$from_path_perms = U\Fs::perms( $from_path );

		if ( ! $from_path_type ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			return false; // Not possible.
		}
		$real_from_path = U\Fs::realize( $from_path );

		if ( ! $real_from_path ) {
			return false; // Not possible.
		}
		// `$base_path` validation.

		if ( ! $is_recursive ) {
			$base_path ??= $from_path;
			$base_path = U\Fs::normalize( $base_path );
		}
		// `$from_base_subpath` validation.

		$from_base_subpath = U\Dir::subpath( $base_path, $from_path );

		// `$to_path` validation.

		$to_path      = U\Fs::normalize( $to_path );
		$to_path_type = U\Fs::type( $to_path );

		if ( ! $to_path ) {
			return false; // Not possible.
		}
		// This may or may not exist, so fall back on `$to_path`.
		$real_to_path = $to_path_type ? U\Fs::realize( $to_path ) : $to_path;

		if ( ! $real_to_path ) {
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			$_rtps             = U\Dir::subpath( $base_path, $to_path, false );
			$_will_ignore_rtps = false !== $_rtps && $ignore && U\Str::preg_match_in( $ignore, $_rtps );
			$_will_ignore_rtps = $_will_ignore_rtps && ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $_rtps ) );

			// ↑ Goal is to determine if the root `$to_path` is within the `$base_path`; i.e., if {@see U\Dir::subpath()} generation works.
			// Then take the root `$to_path` subpath (i.e., rtps) and check if that subpath will be ignored while traversing `$from_path`.
			// If so, then one of the tests below can be bypassed safely. Calculating this one time, saves a little time.

			$_r->root_to_path      = $to_path;
			$_r->root_real_to_path = $real_to_path;
			$_r->will_ignore_rtps  = $_will_ignore_rtps;
		}
		// `$to_path_dir` validation.

		$to_path_dir      = U\Dir::name( $to_path );
		$to_path_dir_type = U\Fs::type( $to_path_dir );

		if ( $to_path_dir_type && ! is_writable( $to_path_dir ) ) {
			return false; // Not possible.
		}
		// Are we ignoring this `$from_base_subpath`?

		if ( '' !== $from_base_subpath && $ignore && U\Str::preg_match_in( $ignore, $from_base_subpath ) ) {
			if ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $from_base_subpath ) ) {
				return true; // Ignoring.
			}
		}
		// After checking ignores, are we attempting to copy into self?
		// The examples given are caught because we're copying recursively `$from_path` and into `$to_path`.
		// Also, because `$to_path` is deleted prior to copying, which means we can't copy from it!

		// e.g., from: /foo/bar/foo, to: /foo               (invalid: /foo ...includes /foo/bar/foo).
		// e.g., from: /foo/bar/foo, to: /foo/bar/foo/bar   (invalid: /foo/bar/foo ...includes /foo/bar/foo/bar).

		if ( preg_match( '/^' . U\Str::esc_reg( $_r->root_to_path ) . '(?:$|\/)/u', $from_path )
			|| preg_match( '/^' . U\Str::esc_reg( $_r->root_real_to_path ) . '(?:$|\/)/u', $real_from_path )
		) {
			throw new U\Fatal_Exception(
				'Attempting to copy into self. Cannot continue as this results in an infinite loop.' .
				' The root to-path is also deleted recursively prior to copying. So not possible to copy from it!' .
				' From: `' . $real_from_path . '`; while considering root to-path: `' . $_r->root_real_to_path . '`.'
			);
		} elseif ( ! $_r->will_ignore_rtps
			&& ( preg_match( '/^' . U\Str::esc_reg( $from_path ) . '(?:$|\/)/u', $to_path )
				|| preg_match( '/^' . U\Str::esc_reg( $real_from_path ) . '(?:$|\/)/u', $real_to_path ) )
		) {
			throw new U\Fatal_Exception(
				'Attempting to copy into self. Cannot continue as this results in an infinite loop.' .
				' From: `' . $real_from_path . '`, to: `' . $real_to_path . '`.'
			);
		}
		// `$to_path` deletion before copy.

		if ( $to_path_type && ! U\Fs::delete( $to_path, true, false ) ) {
			return false; // Not possible.
		}
		// `$to_path_dir` creation.

		if ( ! $to_path_dir_type && ! U\Dir::make( $to_path_dir, $to_path_dir_perms, true, false ) ) {
			return false; // Not possible.
		}
		// Link copy.

		if ( 'link' === $from_path_type && ! $follow_symlinks ) {
			return U\Fs::make_link( $real_from_path, $to_path, [ $to_path_dir_perms, $from_path_perms ], true, false );
		}
		// File copy.

		if ( 'file' === $from_path_type || ( 'link' === $from_path_type && $follow_symlinks && is_file( $from_path ) ) ) {
			return copy( $from_path, $to_path ) && chmod( $to_path, $from_path_perms );
		}
		// Recursive directory copy.

		if ( 'link' === $from_path_type && in_array( $real_from_path, $_r->cycle_stack, true ) ) {
			throw new U\Fatal_Exception(
				'Copy failure. Circular link: `' . $from_path . '` points to: `' . $real_from_path . '`,' .
				' which is currently being traversed. Following this link would result in an infinite loop.'
			);
		} else {
			$_r->cycle_stack[] = $real_from_path;
		}
		if ( ! mkdir( $to_path, $from_path_perms ) ) {
			return false; // Not possible.
		}
		if ( ! ( $_from_path_opendir = opendir( $from_path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_from_path = U\Dir::join( $from_path, '/' . $_subpath );
			$_to_path   = U\Dir::join( $to_path, '/' . $_subpath );

			if ( ! U\Fs::copy( $_from_path, $_to_path, $ignore, $exceptions, $base_path, $follow_symlinks, $to_path_dir_perms, $_r ) ) {
				closedir( $_from_path_opendir );
				return false;
			}
		}
		closedir( $_from_path_opendir );
		array_pop( $_r->cycle_stack );
		return true;
	}

	/**
	 * Helps copy contents of one directory to contents of another directory.
	 *
	 * Do NOT call this directly. Instead, use {@see U\Fs::copy()} with `/*` on the end of `$from_path`.
	 *
	 * @since 2021-12-15
	 *
	 * @param string      $from_path         Directory to copy.
	 * @param string      $to_path           Destination directory.
	 *
	 * @param array|null  $ignore            Array of regex expressions to ignore; i.e., not copy.
	 *                                       Default is {@see U\Fs::typically_ignore_regexp_lookahead()}.
	 *
	 * @param array|null  $exceptions        Array of regex expressions to keep (i.e., exceptions to the ignore list).
	 *                                       Default is `null`; i.e., resulting in no exceptions.
	 *
	 * @param string|null $base_path         Base path, which gets stripped prior to regex matching. Defaults to `$from_path`.
	 *                                       Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param bool        $follow_symlinks   Follow symlinks? Default is `true`.
	 *
	 * @param array|int[] $to_path_dir_perms Defaults to `[ 0700, 0700 ]`. {@see U\Dir::make()} for permission details.
	 *                                       If `$to_path`'s parent directories do not exist, they'll be created automatically.
	 *                                       This establishes the permissions for those newly created directories, when/if applicable.
	 *
	 * @return bool True if copied successfully.
	 */
	protected static function copy_dir_contents_helper(
		string $from_path,
		string $to_path,
		/* array|null */ ?array $ignore = null,
		/* array|null */ ?array $exceptions = null,
		/* string|null */ ?string $base_path = null,
		bool $follow_symlinks = true,
		array $to_path_dir_perms = [ 0700, 0700 ]
	) : bool {
		// `$from_path` validation.

		if ( ! is_dir( $from_path ) ) {
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			return false; // Not possible.
		}
		$base_path ??= $from_path;
		$base_path = U\Fs::normalize( $base_path );

		// `$to_path` validation.

		if ( ! $to_path ) {
			return false; // Not possible.
		}
		// Copy directory contents.

		if ( ! ( $_from_path_opendir = opendir( $from_path ) ) ) {
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_from_path = U\Dir::join( $from_path, '/' . $_subpath );
			$_to_path   = U\Dir::join( $to_path, '/' . $_subpath );

			if ( ! U\Fs::copy( $_from_path, $_to_path, $ignore, $exceptions, $base_path, $follow_symlinks, $to_path_dir_perms ) ) {
				closedir( $_from_path_opendir );
				return false;
			}
		}
		closedir( $_from_path_opendir );
		return true;
	}
}
