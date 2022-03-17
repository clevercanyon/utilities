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
trait Parse_Query_Str_Members {
	/**
	 * Parses a query string into an array.
	 *
	 * @since  3.2.0
	 * @access private
	 *
	 * @param string     $str      Query string to parse.
	 * @param int|string $strategy Strategy. Default is {@see PHP_QUERY_RFC3986}.
	 *                             {@see U\URL::decode()} for further details.
	 *
	 * @return array Query string variables.
	 */
	public static function parse_query_str( string $str, /* int|string */ $strategy = PHP_QUERY_RFC3986 ) : array {
		if ( 0 === mb_strpos( $str, '?' ) ) {
			$str = mb_substr( $str, 1 );
		}
		$query_vars      = []; // Initialize.
		$query_str_parts = explode( '&', $str );

		foreach ( $query_str_parts as $_part ) {
			if ( false !== mb_strpos( $_part, '=' ) ) {
				[ $_name, $_value ] = explode( '=', $_part, 2 );
			} else {
				$_name  = $_part;
				$_value = '';
			}
			if ( '' === $_name ) {
				continue; // Not possible.
			}
			$_name  = U\URL::decode( $_name, $strategy );
			$_value = U\URL::decode( $_value, $strategy );

			if ( preg_match_all( '/\[([^\]]*)\]/u', $_name, $_m ) ) {
				$_name_keys = [ mb_substr( $_name, 0, mb_strpos( $_name, '[' ) ) ];
				$_name_keys = array_merge( $_name_keys, $_m[ 1 ] );
			} else {
				$_name_keys = [ $_name ];
			}
			$_query_vars_target_is_inner_reference = false;
			$_query_vars_target                    = &$query_vars;

			foreach ( $_name_keys as $_name_key ) {
				if ( ! is_array( $_query_vars_target ) ) {
					$_query_vars_target = [];
				}
				if ( '' === $_name_key ) { // i.e., `[]`.
					$_int_name_keys = array_filter( array_keys( $_query_vars_target ), 'is_int' );
					$_name_key      = $_int_name_keys ? max( $_int_name_keys ) + 1 : 0;
				}
				$_query_vars_target                    = &$_query_vars_target[ $_name_key ];
				$_query_vars_target_is_inner_reference = true; // Now an inner reference.
			}
			if ( $_query_vars_target_is_inner_reference ) {
				$_query_vars_target = $_value;
			}
		}
		return $query_vars;
	}
}
