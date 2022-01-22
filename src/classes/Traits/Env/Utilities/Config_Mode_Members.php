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
trait Config_Mode_Members {
	/**
	 * Configures testing mode.
	 *
	 * @since 2021-12-19
	 *
	 * @param string $type Optional testing tool or framework.
	 *                     e.g., `phpunit`. Default is `unknown`.
	 *
	 * @return bool True if testing mode configured successfully.
	 */
	public static function config_testing_mode( string $type = '' ) : bool {
		return (bool) U\Env::static_var( 'TESTING', $type ?: 'unknown' );
	}

	/**
	 * Configures debugging mode.
	 *
	 * @since 2021-12-19
	 *
	 * @param string|null $type Optional debugging tool or framework.
	 *                          e.g., `xdebug`. Default is `null`, indicating `uknown`.
	 *
	 * @return bool True if debugging mode configured successfully.
	 */
	public static function config_debugging_mode( /* string|null */ ?string $type = null ) : bool {
		$type ??= 'unknown';
		$type = $type ?: 'unknown';

		if ( U\Env::is_wordpress() ) {
			return U\Env::maybe_define( 'WP_DEBUG', true )
				&& U\Env::maybe_define( 'WP_DEBUG_LOG', true )
				&& U\Env::maybe_define( 'WP_DEBUG_DISPLAY', true )
				&& false !== ini_set( 'zend.assertions', '1' )  // phpcs:ignore.
				&& false !== ini_set( 'assert.exception', '1' ) // phpcs:ignore.
				&& U\Env::static_var( 'DEBUGGING', $type );
		} else {
			error_reporting( E_ALL );

			$php_errors_file = '/tmp/php-errors.log';
			$php_errors_dir  = U\Dir::name( $php_errors_file );

			if ( is_dir( $php_errors_dir ) // Ideal location is possible?
				&& (
					( is_file( $php_errors_file ) && is_writable( $php_errors_file ) )
					|| ( ! U\Fs::exists( $php_errors_file ) && is_writable( $php_errors_dir ) )
				) ) {
				$error_log = $php_errors_file; // Use ideal location.
			} else {
				$error_log = U\Dir::join( U\Dir::sys_temp(), '/' . basename( $php_errors_file ) );
			}
			return false !== ini_set( 'error_log', $error_log )  // phpcs:ignore.
				&& false !== ini_set( 'log_errors', '1' )        // phpcs:ignore.
				&& false !== ini_set( 'display_errors', '1' )    // phpcs:ignore.
				&& false !== ini_set( 'zend.assertions', '1' )   // phpcs:ignore.
				&& false !== ini_set( 'assert.exception', '1' )  // phpcs:ignore.
				&& U\Env::static_var( 'DEBUGGING', $type );
		}
	}
}
