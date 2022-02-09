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
namespace Clever_Canyon\Utilities\Traits\URL\Utilities;

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
 * @see   U\URL
 */
trait Current_Var_Members {
	/**
	 * Current query var.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $name Query var name.
	 *
	 * @return mixed Current query var; else `null` on failure.
	 */
	public static function current_query_var( string $name ) /* : mixed */ {
		return U\URL::current_query_vars()[ $name ] ?? null;
	}

	/**
	 * Current post var.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $name Post var name.
	 *
	 * @return mixed Current post var.
	 */
	public static function current_post_var( string $name ) {
		return U\URL::current_post_vars()[ $name ] ?? null;
	}

	/**
	 * Current request var.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $name Request var name.
	 *
	 * @return mixed Current request var.
	 */
	public static function current_request_var( string $name ) {
		return U\URL::current_request_vars()[ $name ] ?? null;
	}

	/**
	 * Current query vars.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $names Query var names. Default is `[]` (all).
	 *
	 * @return array Current query vars.
	 */
	public static function current_query_vars( array $names = [] ) : array {
		static $query_vars; // Memoize.

		if ( null === $query_vars ) {
			$_g         = &$_GET; // phpcs:ignore.
			$query_vars = U\Bundle::map( [ 'trim', 'stripslashes' ], $_g, 'string' );
		}
		if ( ! $names ) {
			return $query_vars;
		}
		$vars = []; // Initialize.

		foreach ( $query_vars as $_key => $_value ) {
			if ( in_array( $_key, $names, true ) ) {
				$vars[ $_key ] = $_value;
			}
		}
		return $vars;
	}

	/**
	 * Current post vars.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $names Post var names.
	 *
	 * @return array Current post vars.
	 */
	public static function current_post_vars( array $names = [] ) : array {
		static $post_vars; // Memoize.

		if ( null === $post_vars ) {
			$_p        = &$_POST; // phpcs:ignore.
			$post_vars = U\Bundle::map( [ 'trim', 'stripslashes' ], $_p, 'string' );
		}
		if ( ! $names ) {
			return $post_vars;
		}
		$vars = []; // Initialize.

		foreach ( $post_vars as $_key => $_value ) {
			if ( in_array( $_key, $names, true ) ) {
				$vars[ $_key ] = $_value;
			}
		}
		return $vars;
	}

	/**
	 * Current request vars.
	 *
	 * @since 2021-12-15
	 *
	 * @param array $names Request var names.
	 *
	 * @return array Current request vars.
	 */
	public static function current_request_vars( array $names = [] ) : array {
		static $req_vars; // Memoize.

		if ( null === $req_vars ) {
			$_r       = &$_REQUEST; // phpcs:ignore.
			$req_vars = U\Bundle::map( [ 'trim', 'stripslashes' ], $_r, 'string' );
		}
		if ( ! $names ) {
			return $req_vars;
		}
		$vars = []; // Initialize.

		foreach ( $req_vars as $_key => $_value ) {
			if ( in_array( $_key, $names, true ) ) {
				$vars[ $_key ] = $_value;
			}
		}
		return $vars;
	}
}
