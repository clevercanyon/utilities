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
trait Abs_Members {
	/**
	 * Resolves and normalizes path (symlinks *not* resolved).
	 *
	 * This expands to absolute path. It is CWD-aware, but not filesystem-aware.
	 * Therefore, the absolute path it returns may or may not *actually* exist.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $path Path to parse.
	 *
	 * @return string Absolute path normalized (symlinks *not* resolved).
	 *
	 * @throws U\Fatal_Exception On failure; {@see U\Fs::normalize()}.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::abs()
	 */
	public static function abs( string $path ) : string {
		return U\Fs::normalize( $path, [ 'resolve:relative-path' => true ] );
	}
}
