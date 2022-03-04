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
trait Utility_Members {
	/**
	 * Encodes a URL component.
	 *
	 * @since 2022-03-04
	 *
	 * @param string $str Component to encode.
	 *
	 * @return string Encoded URL component string.
	 */
	public static function encode( string $str ) : string {
		return rawurlencode( $str );
	}

	/**
	 * Encodes a URL query string variable.
	 *
	 * @since 2022-03-04
	 *
	 * @param string $var Variable to encode.
	 *
	 * @return string Encoded query string variable.
	 */
	public static function encode_query_var( string $var ) : string {
		return str_replace( [ '%2F' ], [ '/' ], rawurlencode( $var ) );
	}

	/**
	 * Adds query string variables.
	 *
	 * @since 2022-03-04
	 *
	 * @param array  $vars Query vars.
	 * @param string $url  URL to add vars to.
	 *
	 * @return string URL with query string variables.
	 */
	public static function add_query_vars( array $vars, string $url ) : string {
		if ( ! $url || ! ( $parts = U\URL::parse( $url ) ) ) {
			return ''; // Not possible.
		}
		$query_vars       = [];
		$parts[ 'query' ] ??= '';

		if ( '' !== $parts[ 'query' ] ) {
			parse_str( $parts[ 'query' ], $query_vars );
		}
		foreach ( $vars as $_name => $_value ) {
			$query_vars[ $_name ] = $_value;
		}
		$parts[ 'query' ] = http_build_query( $query_vars, '', '&', PHP_QUERY_RFC3986 );
		$parts[ 'query' ] = str_replace( [ '%2F' ], [ '/' ], $parts[ 'query' ] );

		return U\URL::assemble( $parts );
	}

	/**
	 * Removes query string variables.
	 *
	 * @since 2022-03-04
	 *
	 * @param array  $vars Query vars.
	 * @param string $url  URL to remove vars from.
	 *
	 * @return string URL without query string variables.
	 */
	public static function remove_query_vars( array $vars, string $url ) : string {
		if ( ! $url || ! ( $parts = U\URL::parse( $url ) ) ) {
			return ''; // Not possible.
		}
		$query_vars       = [];
		$parts[ 'query' ] ??= '';

		if ( '' !== $parts[ 'query' ] ) {
			parse_str( $parts[ 'query' ], $query_vars );
		}
		foreach ( $vars as $_name => $_value ) {
			unset( $query_vars[ $_name ] );
		}
		$parts[ 'query' ] = http_build_query( $query_vars, '', '&', PHP_QUERY_RFC3986 );
		$parts[ 'query' ] = str_replace( [ '%2F' ], [ '/' ], $parts[ 'query' ] );

		return U\URL::assemble( $parts );
	}

	/**
	 * URL w/o scheme, query, or fragment.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $url URL to parse.
	 *
	 * @return string URL w/o scheme, query, or fragment.
	 */
	public static function no_scheme_query_fragment( string $url ) : string {
		if ( ! $url || ! ( $parts = U\URL::parse( $url ) ) ) {
			return ''; // Not possible.
		}
		unset( $parts[ 'scheme' ], $parts[ 'query' ], $parts[ 'fragment' ] );
		return U\URL::assemble( $parts );
	}
}
