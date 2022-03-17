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
trait Add_Query_Members {
	/**
	 * Adds query string variables.
	 *
	 * @since 2022-03-04
	 *
	 * @param array      $vars       Query vars.
	 * @param string     $url        URL to add vars to.
	 * @param int|string $strategy   Strategy. Default is {@see PHP_QUERY_RFC3986}.
	 *                               {@see U\URL::encode()} for further details.
	 *
	 * @return string URL with query string variables.
	 */
	public static function add_query_vars( array $vars, string $url, /* int|string */ $strategy = PHP_QUERY_RFC3986 ) : string {
		if ( ! $url || ! ( $parts = U\URL::parse( $url ) ) ) {
			return ''; // Not possible.
		}
		$query_vars = [];

		if ( '' !== $parts[ 'query' ] ) {
			$query_vars = U\URL::parse_query_str( $parts[ 'query' ], $strategy );
		}
		foreach ( $vars as $_name => $_value ) {
			$query_vars[ $_name ] = $_value;
		}
		$parts[ 'query' ] = U\URL::build_query_str( $query_vars, $strategy );

		return U\URL::build( $parts );
	}
}
