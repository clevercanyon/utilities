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
trait Realize_Members {
	/**
	 * Resolves, realizes (symlinks resolved), normalizes path.
	 *
	 * @since 2022-01-15
	 *
	 * @param string $path Path to parse.
	 *
	 * @return string Realized (symlinks resolved) canonical path normalized.
	 *                This returns an empty string on failure to realize.
	 *
	 * @note  This expands/resolves everything, and it is filesystem-aware.
	 *        All symbolic links are resolved; {@see realpath()}.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Fs::realize()
	 */
	public static function realize( string $path ) : string {
		return false !== ( $rp = realpath( $path ) ) ? U\Fs::normalize( $rp ) : '';
	}
}
