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
trait Zip_Members {
	/**
	 * Zip one path into another path (`zip` extension required).
	 *
	 * @since         2021-12-15
	 *
	 * @param string      $from_path         Path to zip.
	 * @param string      $to_path           Destination path.
	 *
	 * @param array|null  $ignore            Array of regex expressions to ignore; i.e., not add to zip.
	 *                                       Default is {@see U\Fs::typically_ignore_regexp_lookahead()}.
	 *
	 * @param array|null  $exceptions        Array of regex expressions to not ignore (i.e., exceptions to the ignore list).
	 *                                       Default is `null`; i.e., resulting in no exceptions.
	 *
	 * @param string|null $base_path         Base path, which gets stripped prior to regex matching. Defaults to `$from_path`.
	 *                                       Note: The resulting base subpaths you're matching will NOT begin with a leading `/`.
	 *
	 * @param bool        $follow_symlinks   Follow symlinks? Default is `true`. This should almost always be `true` for zip files.
	 *                                       If `false`, symlinks are not followed. Instead, empty directories and/or files are created
	 *                                       to hold the place of what would otherwise have been followed and copied into the zip archive.
	 *                                       Thus, it is recommended to always leave this as `true` unless there is a very special case.
	 *
	 * @param array|int[] $to_path_dir_perms Defaults to `[ 0700, 0700 ]`. {@see U\Dir::make()} for permission details.
	 *                                       If `$to_path`'s parent directory does not exist, it will be created automatically.
	 *                                       This establishes the permissions for that newly created directory, when/if applicable.
	 *
	 * @param object|null $_r                Internal use only — do not pass.
	 *
	 * @return bool True if zipped successfully.
	 *
	 * @throws U\Fatal_Exception If `ZipArchive` extension is missing.
	 * @throws U\Fatal_Exception If attempting to zip into self, leading to an infinite loop.
	 * @throws U\Fatal_Exception If a circular symlink is detected, leading to an infinite loop.
	 *
	 * @future-review PHP 8+ brought some changes to the zip extension.
	 *                {@see https://o5p.me/7wQthu}.
	 */
	public static function zip_er(
		string $from_path,
		string $to_path,
		/* array|null */ ?array $ignore = null,
		/* array|null */ ?array $exceptions = null,
		/* string|null */ ?string $base_path = null,
		bool $follow_symlinks = true,
		array $to_path_dir_perms = [ 0700, 0700 ],
		/* object|null */ ?object $_r = null
	) : bool {
		// Recursive check.

		$is_recursive = isset( $_r );

		// Dependency check.

		static $can_use_extension; // Remember.
		$can_use_extension ??= U\Env::can_use_extension( 'zip' );

		if ( ! $is_recursive && ! $can_use_extension ) {
			throw new U\Fatal_Exception( 'Missing PHP `zip` extension.' );
		}
		// Recursive class initialization.

		if ( ! $is_recursive ) {
			$_r = ( new class extends U\A6t\Generic {
				/**
				 * Maybe close zip file.
				 *
				 * @param bool $is_recursive Set `true` in recursive calls.
				 *
				 * @return bool True if recursive, zip not open, or zip closes.
				 */
				public function maybe_close_zip( bool $is_recursive ) : bool {
					return $is_recursive || ! isset( $this->zip )
						|| ! is_object( $this->zip )
						|| $this->zip->close();
				}
			} );
			// Initialize.
			$_r->cycle_stack = [];
		}
		// Maybe set default ignores.

		if ( ! $is_recursive && null === $ignore ) {
			$ignore = [ U\Fs::typically_ignore_regexp_lookahead( 'positive' ) ];
		}
		// Maybe set default exceptions.

		if ( ! $is_recursive && null === $exceptions ) {
			$exceptions = []; // No exceptions.
		}
		// `$from_path` validation.

		$from_path = U\Fs::normalize( $from_path );

		if ( ! $is_recursive ) {
			if ( preg_match( '/-\>([^\/]+)$/u', $from_path, $_m ) ) {
				$_r->root_from_path_basename = basename( $_m[ 1 ] );
				$from_path                   = preg_replace( '/-\>([^\/]+)$/u', '', $from_path );
			} else {
				$_r->root_from_path_basename = basename( $from_path );
			}
		} // Now get type, in case of alias.
		$from_path_type = U\Fs::type( $from_path );

		if ( ! $from_path_type ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! is_readable( $from_path ) ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		$real_from_path = U\Fs::realize( $from_path );

		if ( ! $real_from_path ) {
			$_r->maybe_close_zip( $is_recursive );
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
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		// This may or may not exist, so fall back on `$to_path`.
		$real_to_path = $to_path_type ? U\Fs::realize( $to_path ) : $to_path;

		if ( ! $real_to_path ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! $is_recursive ) {
			if ( 'zip' !== U\File::ext( $to_path, true ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
			$_rtps             = U\Dir::subpath( $base_path, $to_path, false );
			$_will_ignore_rtps = false !== $_rtps && $ignore && U\Str::preg_match_in( $ignore, $_rtps );
			$_will_ignore_rtps = $_will_ignore_rtps && ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $_rtps ) );

			// ↑ Goal is to determine if the root `$to_path` is within the `$base_path`; i.e., if {@see U\Dir::subpath()} generation works.
			// Then take the root `$to_path` subpath (i.e., rtps) and check if that subpath will be ignored while traversing `$from_path`.
			// If so, then one of the tests below can be bypassed safely. Calculating this one time, saves a little time.

			$_r->root_to_path     = $to_path;
			$_r->will_ignore_rtps = $_will_ignore_rtps;
		}
		// `$to_path_dir` validation.

		if ( ! $is_recursive ) {
			$to_path_dir      = U\Dir::name( $to_path );
			$to_path_dir_type = U\Fs::type( $to_path_dir );

			if ( $to_path_dir_type && ! is_writable( $to_path_dir ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
		}
		// `$to_path_in_zip` validation.

		$to_path_in_zip    = '/' . $_r->root_from_path_basename;
		$to_subpath_in_zip = U\Dir::subpath( $_r->root_to_path, $to_path );
		$to_path_in_zip    = U\Dir::join( $to_path_in_zip, '/' . $to_subpath_in_zip );

		// Are we ignoring this `$from_base_subpath`?

		if ( '' !== $from_base_subpath && $ignore && U\Str::preg_match_in( $ignore, $from_base_subpath ) ) {
			if ( ! $exceptions || ! U\Str::preg_match_in( $exceptions, $from_base_subpath ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return true; // Ignoring.
			}
		}
		// After checking ignores, are we attempting to zip into self?
		// The examples given are caught because we're copying recursively `$from_path`.

		// From: /foo/bar/foo, to: /foo/bar/foo/bar[/foo.zip]     (invalid: /foo/bar/foo ...includes /foo/bar/foo/bar).
		// From: /foo, to: /foo/bar[/foo.zip]                     (invalid: /foo ...includes /foo/bar).

		if ( ! $_r->will_ignore_rtps
			&& ( preg_match( '/^' . U\Str::esc_reg( $from_path ) . '(?:$|\/)/u', $to_path )
				|| preg_match( '/^' . U\Str::esc_reg( $real_from_path ) . '(?:$|\/)/u', $real_to_path ) )
		) {
			$_r->maybe_close_zip( $is_recursive );
			throw new U\Fatal_Exception(
				'Attempting to zip into self. Cannot continue as this results in an infinite loop.' .
				' From: `' . $real_from_path . '`, to: `' . $real_to_path . '`.'
			);
		}
		// `$to_path` deletion ahead of zip.

		if ( ! $is_recursive ) {
			if ( $to_path_type && ! U\Fs::delete( $to_path, true, false ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
		}
		// `$to_path_dir` directory creation.

		if ( ! $is_recursive ) {
			if ( ! $to_path_dir_type && ! U\Dir::make( $to_path_dir, $to_path_dir_perms, true, false ) ) {
				$_r->maybe_close_zip( $is_recursive );
				return false; // Not possible.
			}
		}
		// Zip archive.

		if ( ! $is_recursive ) {
			/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
			$_r->zip = new \ZipArchive();                            // `zip` extension.

			/** @noinspection PhpComposerExtensionStubsInspection */ // phpcs:ignore.
			if ( true !== $_r->zip->open( $to_path, \ZipArchive::CREATE | \ZipArchive::OVERWRITE ) ) {
				return false; // Not possible.
			}
		}
		// Link zip.

		if ( 'link' === $from_path_type && ! $follow_symlinks ) {
			return true === $_r->zip->addFromString( $to_path_in_zip, '' )
				&& $_r->maybe_close_zip( $is_recursive );
		}
		// File zip.

		if ( 'file' === $from_path_type || ( 'link' === $from_path_type && $follow_symlinks && is_file( $from_path ) ) ) {
			return true === $_r->zip->addFile( $from_path, $to_path_in_zip )
				&& $_r->maybe_close_zip( $is_recursive );
		}
		// Recursive directory zip.

		if ( 'link' === $from_path_type && in_array( $real_from_path, $_r->cycle_stack, true ) ) {
			throw new U\Fatal_Exception(
				'Zip failure. Circular link: `' . $from_path . '` points to: `' . $real_from_path . '`,' .
				' which is currently being traversed. Following this link would result in an infinite loop.'
			);
		} else {
			$_r->cycle_stack[] = $real_from_path;
		}
		if ( true !== $_r->zip->addEmptyDir( $to_path_in_zip ) ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		if ( ! ( $_from_path_opendir = opendir( $from_path ) ) ) {
			$_r->maybe_close_zip( $is_recursive );
			return false; // Not possible.
		}
		while ( false !== ( $_subpath = readdir( $_from_path_opendir ) ) ) {
			if ( '' === $_subpath || in_array( $_subpath, [ '.', '..' ], true ) ) {
				continue; // Skip dots.
			}
			$_from_path = U\Dir::join( $from_path, '/' . $_subpath );
			$_to_path   = U\Dir::join( $to_path, '/' . $_subpath );

			if ( ! U\Fs::zip_er( $_from_path, $_to_path, $ignore, $exceptions, $base_path, $follow_symlinks, $to_path_dir_perms, $_r ) ) {
				closedir( $_from_path_opendir );
				$_r->maybe_close_zip( $is_recursive );
				return false;
			}
		}
		closedir( $_from_path_opendir );
		array_pop( $_r->cycle_stack );
		return $_r->maybe_close_zip( $is_recursive );
	}
}
