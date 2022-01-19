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
namespace Clever_Canyon\Utilities\Dev\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\Utilities\Dev\{Utilities as D};

// </editor-fold>

/**
 * Directory utilities.
 *
 * @since 2021-12-15
 */
final class Dir {
	/**
	 * Joins directory paths.
	 *
	 * @since 2021-12-19
	 *
	 * @param string ...$paths Path(s) to join.
	 *
	 * @return string New path formed by the joins.
	 *
	 * @see   \Clever_Canyon\Utilities\Dir::join()
	 */
	public static function join( string ...$paths ) : string {
		if ( ! $paths ) {
			return ''; // Nothing to do.
		}
		$base_path  = $paths[ 0 ];
		$join_paths = array_slice( $paths, 1 );

		return D\Fs::normalize( $base_path, [ 'join:paths' => $join_paths ] );
	}

	/**
	 * Joins paths ((e)xplicit (t)railing (s)lash).
	 *
	 * @since 2021-12-19
	 *
	 * @param string ...$paths Path(s) to join + optional (explicit) trailing slash.
	 *                         Note: You must set last path as `/` to get a trailing slash.
	 *                         There must be at least two paths given; `/` last, to get a trailing slash.
	 *
	 * @return string New path formed by the joins.
	 *
	 * @note  A trailing slash will never be added to a single `/` root path.
	 *        A trailing slash will never be added to what is nothing but wrappers; e.g., `foo://bar://baz://`.
	 *
	 * @see   \Clever_Canyon\Utilities\Dir::join_ets()
	 */
	public static function join_ets( string ...$paths ) : string {
		if ( ! $paths ) {
			return ''; // Nothing to do.
		}
		$base_path  = $paths[ 0 ];
		$ets        = isset( $paths[ 1 ] ) && '/' === $paths[ array_key_last( $paths ) ];
		$join_paths = $ets ? array_slice( $paths, 1, -1 ) : array_slice( $paths, 1 );

		return D\Fs::normalize( $base_path, [
			'join:paths'            => $join_paths,
			'append:trailing-slash' => true === $ets,
		] );
	}

	/**
	 * Gets directory name and does optional {@see D\Dir::join()}.
	 *
	 * @since 2021-12-19
	 *
	 * @param string     $path            {@see dirname()}.
	 * @param int|string ...$levels_paths Optional (int) parent levels to go up. Default is `1`. Must be `>= 1`.
	 *                                    Followed by optional (string) paths to join. Default is no join.
	 *
	 * @return string Newly formed by path, based on input parameters.
	 *
	 * @see   \Clever_Canyon\Utilities\Dir::name()
	 */
	public static function name( string $path, /* int|string */ ...$levels_paths ) : string {
		if ( $levels_paths ) {
			$is_key_0_levels = is_int( $levels_paths[ 0 ] ?? null );
			$levels          = $is_key_0_levels ? max( 1, $levels_paths[ 0 ] ) : 1;

			$paths = $is_key_0_levels ? array_slice( $levels_paths, 1 ) : $levels_paths;
			assert( array_map( 'strval', $paths ) === $paths );
		} else {
			$levels = 1; // Must be an integer >= `1`.
			$paths  = [];
		}
		$path = D\Fs::normalize( $path ); // Before passing to {@see dirname()}.

		if ( $paths ) {
			return D\Dir::join( dirname( $path, $levels ), ...$paths );
		} else {
			return D\Fs::normalize( dirname( $path, $levels ) );
		}
	}

	/**
	 * Strips base, gets subpath.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $base_path        Base path to strip away.
	 * @param string $path             Path from which to strip the base.
	 *
	 * @param bool   $throw_on_failure Throw on failure? Default is `true`.
	 *                                 If set to `false`, function returns `false` on failure.
	 *
	 * @throws D\Fatal_Exception On failure to strip the given base path.
	 *                           Change by setting `$throw_on_failure` to `false`.
	 *
	 * @return string|false Subpath; i.e., `$path` with `$base_path` stripped away.
	 *                      If `$throw_on_failure` is `false`, returns `false` on failure.
	 *
	 * @see   \Clever_Canyon\Utilities\Dir::subpath()
	 */
	public static function subpath( string $base_path, string $path, bool $throw_on_failure = true ) /* string|false */ {
		$base_path = D\Fs::normalize( $base_path );
		$path      = D\Fs::normalize( $path );

		$esc_reg_base_path_no_ts = preg_quote( rtrim( $base_path, '/' ), '/' );
		$subpath                 = preg_replace( '/^' . $esc_reg_base_path_no_ts . '(?:\/|$)/u', '', $path, 1, $_replacements );

		if ( 1 !== $_replacements && $throw_on_failure ) {
			throw new D\Fatal_Exception( // Default behavior.
				'Failed to formulate a subpath using base: `' . $base_path . '`' .
				' against `' . $path . '`. Fatal exception; cannot safely continue.'
			);
		}
		return 1 !== $_replacements ? false : trim( $subpath, '/' );
	}
}
