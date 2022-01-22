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
trait Join_Members {
	/**
	 * Joins paths.
	 *
	 * @since 2021-12-19
	 *
	 * @param string ...$paths Path(s) to join.
	 *
	 * @return string New path formed by the joins.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::join()
	 */
	public static function join( string ...$paths ) : string {
		if ( ! $paths ) {
			return ''; // Nothing to do.
		}
		$base_path  = $paths[ 0 ];
		$join_paths = array_slice( $paths, 1 );

		return U\Fs::normalize( $base_path, [ 'join:paths' => $join_paths ] );
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
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::join_ets()
	 */
	public static function join_ets( string ...$paths ) : string {
		if ( ! $paths ) {
			return ''; // Nothing to do.
		}
		$base_path  = $paths[ 0 ];
		$ets        = isset( $paths[ 1 ] ) && '/' === U\Arr::value_last( $paths );
		$join_paths = $ets ? array_slice( $paths, 1, -1 ) : array_slice( $paths, 1 );

		return U\Fs::normalize( $base_path, [
			'join:paths'            => $join_paths,
			'append:trailing-slash' => true === $ets,
		] );
	}
}
