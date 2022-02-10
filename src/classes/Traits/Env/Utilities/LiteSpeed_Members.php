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
trait LiteSpeed_Members {
	/**
	 * Is LiteSpeed?
	 *
	 * @since 2021-12-18
	 *
	 * @return bool True if server is LiteSpeed.
	 */
	public static function is_litespeed() : bool {
		static $is; // Memoize.

		if ( null !== $is ) {
			return $is; // Saves time.
		}
		return $is = false !== mb_stripos( U\Env::server_api(), 'litespeed' )
			|| false !== mb_stripos( U\Env::var( 'SERVER_SOFTWARE' ), 'litespeed' );
	}

	/**
	 * Attempts to get LiteSpeed web server version.
	 *
	 * @since 2021-12-18
	 *
	 * @return string LiteSpeed web server version; else empty string.
	 *
	 * @see   https://o5p.me/Os0Mcf
	 */
	public static function litespeed_version() : string {
		static $version; // Memoize.

		if ( null !== $version ) {
			return $version; // Saves time.
		}
		/**
		 * Environment variable.
		 *
		 * - Confirmed *not* working with LiteSpeed v6.0.8; extension version 7.9; PHP version 7.4.27; on 2022-02-02.
		 *   LiteSpeed doesn't reveal its version to PHP. I even tried to reflect the `litespeed` extension.
		 *   The extension version is revealed by {@see phpinfo()}, but that's not what we're after here.
		 */
		$server_software = U\Env::var( 'SERVER_SOFTWARE' );
		preg_match( '/^LiteSpeed\/([0-9][0-9a-z._\-]*)/ui', $server_software, $_m );
		$version = trim( $_m[ 1 ] ?? '', '._-' ); // Version string.

		if ( ! $version ) {
			/**
			 * Version file access.
			 *
			 * - Confirmed working with LiteSpeed v6.0.8; extension version 7.9; PHP version 7.4.27; on 2022-02-02.
			 *   This is fragile, however; i.e., likely to be in a different location across hosting providers.
			 *   Additionally, access to this file might not be possible in some hosting environments.
			 */
			$version_file         = '/usr/local/lsws/VERSION';
			$version_file_1st_64b = U\File::read_bytes( $version_file, 64, false );
			$version_file_1st_64b = trim( (string) $version_file_1st_64b );

			preg_match( '/^([0-9][0-9a-z._\-]*)/ui', $version_file_1st_64b, $_m );
			$version = trim( $_m[ 1 ] ?? '', '._-' ); // Version string.
		}
		return $version;
	}
}
