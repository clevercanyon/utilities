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
namespace Clever_Canyon\Utilities\Traits\A6t\Stream\Utilities;

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
 * @see   U\I7e\Stream
 */
trait Utility_Members {
	/**
	 * Gets wrapper.
	 *
	 * @since 2022-01-29
	 *
	 * @return string Wrapper; e.g., `wrapper://`.
	 */
	public static function wrapper() : string {
		return static::wrapper_name() . '://';
	}

	/**
	 * Gets wrapper name.
	 *
	 * Extenders should override and/or append to this
	 * if they prefer to set a different or more readable
	 * wrapper name. The default name is pretty cryptic.
	 *
	 * @since 2022-01-29
	 *
	 * @return string Wrapper name; e.g., `wrapper`.
	 */
	public static function wrapper_name() : string {
		static $name; // Memoize.
		$name ??= U\Crypto::x_sha( static::class );
		return $name; // e.g., `xec457d0a974c48e`.
	}

	/**
	 * Registers stream wrapper; if not registered already.
	 *
	 * @since 2022-01-29
	 *
	 * @return bool `true` if registered successfully.
	 *              Also returns `true` if registered already.
	 *
	 * @throws U\Fatal_Exception On any failure.
	 */
	public static function maybe_register_wrapper() : bool {
		static $registered; // Memoize.

		if ( $registered ) {
			return true; // Done already.
		}
		$registered   = true; // Doing it now.
		$wrapper_name = static::wrapper_name();

		if ( ! in_array( $wrapper_name, stream_get_wrappers(), true ) ) {
			if ( ! stream_wrapper_register( $wrapper_name, static::class ) ) {
				throw new U\Fatal_Exception( 'Failed to register stream wrapper: `' . static::wrapper() . '`.' );
			}
		}
		return true;
	}
}
