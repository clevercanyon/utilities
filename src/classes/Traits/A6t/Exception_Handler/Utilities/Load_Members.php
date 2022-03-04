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
 * Lint configuration.
 *
 * @since 2021-12-25
 *
 * phpcs:disable WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler
 */

/**
 * Declarations & namespace.
 *
 * @since 2021-12-25
 */
declare( strict_types = 1 );
namespace Clever_Canyon\Utilities\Traits\A6t\Exception_Handler\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * Interface members.
 *
 * @since 2021-12-15
 *
 * @see   U\I7e\Exception_Handler
 */
trait Load_Members {
	/**
	 * Loads exception handler.
	 *
	 * Sets error handler.
	 * Sets shutdown handler.
	 * Sets exception handler.
	 *
	 * @since 2022-03-03
	 */
	public static function load() : void {
		static $loaded; // Memoize.

		if ( $loaded ) {
			return; // Loaded already.
		}
		$loaded = true; // Flag as loaded now.

		set_error_handler( [ static::class, 'on_error' ] );
		register_shutdown_function( [ static::class, 'on_shutdown' ] );
		set_exception_handler( [ static::class, 'on_exception' ] );
	}
}
