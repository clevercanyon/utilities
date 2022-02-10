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
trait Perms_Members {
	/**
	 * Gets a path's permissions.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $path      Path.
	 *
	 * @param bool   $octal_str Return octal string? Default is `false`.
	 *
	 *                          * The return value of {@see fileperms()} is fairly complex.
	 *                            An octal string representation is helpful when trying
	 *                            to do simpler comparisons; e.g., `'0700'`, `'0755'`, etc.
	 *
	 * @return int|string Permissions; {@see fileperms()}.
	 */
	public static function perms( string $path, bool $octal_str = false ) /* : int|string */ {
		$perms = 0; // Initialize.

		if ( U\Fs::really_exists( $path ) ) {
			$perms = fileperms( $path );
		}
		return $octal_str ? mb_substr( sprintf( '%o', $perms ), -4 ) : $perms;
	}
}
