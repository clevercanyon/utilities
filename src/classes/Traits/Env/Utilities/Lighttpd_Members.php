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
namespace Clever_Canyon\Utilities\Traits\Env\Utilities;

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
 * @see   U\Env
 */
trait Lighttpd_Members {
	/**
	 * Is Lighttpd?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if server is Lighttpd.
	 */
	public static function is_lighttpd() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = false !== mb_stripos( U\Env::server_api(), 'lighttpd' )
			|| false !== mb_stripos( U\Env::var( 'SERVER_SOFTWARE' ), 'lighttpd' );
	}

	/**
	 * Attempts to get Lighttpd web server version.
	 *
	 * @since        2021-12-18
	 *
	 * @return string Lighttpd web server version; else empty string.
	 *
	 * @see          https://o5p.me/vrbTd4
	 */
	public static function lighttpd_version() : string {
		static $version; // Memoize.

		if ( null !== $version ) {
			return $version; // Saves time.
		}
		/**
		 * Environment variable.
		 *
		 * - Not confirmed working yet. @todo Lighttpd testing.
		 */
		$server_software = U\Env::var( 'SERVER_SOFTWARE' );
		preg_match( '/^Lighttpd\/([0-9][0-9a-z._\-]*)/ui', $server_software, $_m );
		$version = trim( $_m[ 1 ] ?? '', '._-' ); // Version string.

		return $version;
	}
}
