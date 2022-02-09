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
trait Assemble_Members {
	/**
	 * Assembles a URL.
	 *
	 * Opposite of {@see U\URL::parse()}).
	 *
	 * @since 2020-11-19
	 *
	 * @param array $parts URL parts.
	 *
	 * @return string Parts in the shape of a URL.
	 *
	 * @see   U\URL::parse()
	 */
	public static function assemble( array $parts ) : string {
		$parts = array_map( 'strval', $parts );

		if ( ! empty( $parts[ 'scheme' ] ) ) {
			if ( '//' === $parts[ 'scheme' ] ) {
				$scheme = $parts[ 'scheme' ];
			} else {
				$scheme = $parts[ 'scheme' ] . '://';
			}
		} else {
			$scheme = ''; // No scheme.
		}
		$user = isset( $parts[ 'user' ][ 0 ] ) ? $parts[ 'user' ] : '';
		$pass = isset( $parts[ 'pass' ][ 0 ] ) ? ':' . $parts[ 'pass' ] : '';
		$pass .= isset( $user[ 0 ] ) || isset( $pass[ 0 ] ) ? '@' : '';

		$host = isset( $parts[ 'host' ][ 0 ] ) ? $parts[ 'host' ] : '';
		$port = isset( $parts[ 'port' ][ 0 ] ) ? ':' . $parts[ 'port' ] : '';

		$path     = isset( $parts[ 'path' ][ 0 ] ) ? $parts[ 'path' ] : '';
		$query    = isset( $parts[ 'query' ][ 0 ] ) ? '?' . $parts[ 'query' ] : '';
		$fragment = isset( $parts[ 'fragment' ][ 0 ] ) ? '#' . $parts[ 'fragment' ] : '';

		return $scheme . $user . $pass . $host . $port . $path . $query . $fragment;
	}
}
