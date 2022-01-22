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
trait Sys_Temp_Members {
	/**
	 * Gets a readable & writable temporary directory.
	 *
	 * @since 2021-12-15
	 *
	 * @throws U\Fatal_Exception On failure to locate temporary directory.
	 * @return string Absolute path to a readable & writable temporary directory.
	 *
	 * @see   U\Env::var() When modifying this function.
	 */
	public static function sys_temp() : string {
		if ( null !== ( $cache = &static::cache( __FUNCTION__ ) ) ) {
			return $cache; // Cached already.
		}
		$haystack = []; // Initialize.

		if ( U\Env::is_wordpress() && defined( 'WP_TEMP_DIR' ) ) {
			$haystack[] = WP_TEMP_DIR; // Given explicitly.
		}
		$haystack[] = sys_get_temp_dir();

		if ( $_needle = U\Env::var( 'TMPDIR', [ 'bypass:U\\Dir::sys_temp' => true ] ) ) {
			$haystack[] = $_needle; // {@see U\Env::var()} for further details.
		}
		if ( U\Env::is_windows() ) {
			$haystack[] = 'c:/Temp';
		} elseif ( U\Env::is_unix_based() ) {
			$haystack[] = '/tmp';
		}
		$haystack[] = ini_get( 'upload_tmp_dir' );

		foreach ( array_unique( $haystack ) as $_dir ) {
			$_dir = U\Fs::realize( $_dir );

			if ( ! $_dir || ! is_dir( $_dir )
				|| ! is_readable( $_dir )
				|| ! is_writable( $_dir ) ) {
				continue; // Not going to work.
			}
			$__dir = U\Dir::join( $_dir, '/clevercanyon/.tmp' );

			if ( is_dir( $__dir ) || U\Dir::make( $__dir ) ) {
				return $cache = $__dir;
			}
		}
		$cache = ''; // Empty string and exception on failure.
		throw new U\Fatal_Exception( 'Unable to locate system temp directory. None of the usual locations are writable.' );
	}
}
