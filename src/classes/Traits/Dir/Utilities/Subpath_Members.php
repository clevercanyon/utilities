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
trait Subpath_Members {
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
	 * @throws U\Fatal_Exception On failure to strip the given base path.
	 *                           Change by setting `$throw_on_failure` to `false`.
	 *
	 * @return string|false Subpath; i.e., `$path` with `$base_path` stripped away.
	 *                      If `$throw_on_failure` is `false`, returns `false` on failure.
	 *
	 * @see   \Clever_Canyon\Utilities\Dev\Utilities\Dir::subpath()
	 */
	public static function subpath( string $base_path, string $path, bool $throw_on_failure = true ) /* string|false */ {
		$base_path = U\Fs::normalize( $base_path );
		$path      = U\Fs::normalize( $path );

		$esc_reg_base_path_no_ts = U\Str::esc_reg( rtrim( $base_path, '/' ) );
		$subpath                 = preg_replace( '/^' . $esc_reg_base_path_no_ts . '(?:\/|$)/u', '', $path, 1, $_replacements );

		if ( 1 !== $_replacements && $throw_on_failure ) {
			throw new U\Fatal_Exception( // Default behavior.
				'Failed to formulate a subpath using base: `' . $base_path . '`' .
				' against `' . $path . '`. Fatal exception; cannot continue safely.'
			);
		}
		return 1 !== $_replacements ? false : trim( $subpath, '/' );
	}
}
