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
trait Build_Query_Str_Members {
	/**
	 * Builds a query string from a bundle of props|keys.
	 *
	 * @since  3.2.0
	 * @access private
	 *
	 * @param array|object $bundle   Bundle to build into query string.
	 * @param int|string   $strategy Strategy. Default is {@see PHP_QUERY_RFC3986}.
	 *                               {@see U\URL::encode()} for further details.
	 *
	 * @param array        $_d       Internal use only — do not pass.
	 *
	 * @return string Assembled query string.
	 */
	public static function build_query_str( /* array|object */ $bundle, /* int|string */ $strategy = PHP_QUERY_RFC3986, array $_d = [] ) : string {
		assert( U\Bundle::is( $bundle ) );

		$query_str_parts = []; // Initialize.

		foreach ( $bundle as $_name => $_value ) {
			if ( '' === ( $_name = (string) $_name ) ) {
				continue; // Name is empty.
			}
			if ( null === $_value ) {
				continue; // Exclude nulls.
			}
			$_name = U\URL::encode( $_name, $strategy );
			$_name = isset( $_d[ 'array_name' ] ) ? $_d[ 'array_name' ] . '%5B' . $_name . '%5D' : $_name;

			if ( U\Bundle::is( $_value ) ) {
				$query_str_parts[] = U\URL::build_query_str( $_value, $strategy, [ 'array_name' => $_name ] );
			} else {
				$_value            = false === $_value ? '0' : (string) $_value;
				$query_str_parts[] = $_name . '=' . U\URL::encode( $_value, $strategy );
			}
		}
		return implode( '&', $query_str_parts );
	}
}
