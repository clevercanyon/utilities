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
namespace Clever_Canyon\Utilities\Traits\A6t\Code_Stream_Closure\Utilities;

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
 * @see   U\I7e\Code_Stream_Closure
 */
trait Utility_Members {
	/**
	 * Calls closure.
	 *
	 * @since 2022-02-11
	 *
	 * @param mixed ...$args Optional arguments.
	 *
	 * @return mixed Closure return value; else `null` on failure.
	 */
	public function call( ...$args ) /* : mixed */ {
		if ( ! $closure = $this->get_closure() ) {
			return null; // Failure.
		}
		return $closure( ...$args );
	}

	/**
	 * Gets {@see \Closure}.
	 *
	 * Shorter alias is helpful in some contexts.
	 *
	 * @since 2022-02-11
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public function get() : ?\Closure {
		return $this->get_closure();
	}

	/**
	 * Gets {@see \Closure}.
	 *
	 * @since 2022-02-11
	 *
	 * @throws U\Fatal_Exception In debug mode; on any failure.
	 */
	public function get_closure() : ?\Closure {
		$cache = &$this->ins_cache( __FUNCTION__ );

		if ( null !== $cache ) {
			return false === $cache ? null : $cache;
		}
		try { // Catch parse errors.

			U\Code_Stream::maybe_register_wrapper();
			$closure = include U\Code_Stream::wrapper() . $this->code;

		} catch ( \ParseError $error ) {
			$closure = null; // Failure.

			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( $error->getMessage() );
			}
		}
		if ( $closure instanceof \Closure ) {
			return $cache = $closure;
		} else {
			if ( U\Env::in_debug_mode() ) {
				throw new U\Fatal_Exception( 'Not instance of \\Closure.' );
			}
			$cache = false;
			return null; // Failure.
		}
	}
}
