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
trait Build_Members {
	/**
	 * Builds a URL.
	 *
	 * Opposite of {@see U\URL::parse()}).
	 *
	 * @since 2020-11-19
	 *
	 * @param array $parts           URL parts.
	 *
	 * @param array $part_directives Optional part directives.
	 *                               Default is `[]` (includes all parts).
	 *
	 *                               e.g., To include specific parts: `[ 'host', 'port', 'path' ]`.
	 *                               e.g., To exclude specific parts: `[ '-scheme', '-user', '-pass' ]`.
	 *
	 *                               * If any directive starts with `-`, then the entire list is treated as a set of exclusions.
	 *                                 Otherwise, the entire list is treated as a set of inclusions.
	 *
	 * @return string Parts in the shape of a URL.
	 *
	 * @see   U\URL::parse()
	 */
	public static function build( array $parts, array $part_directives = [] ) : string {
		$parts                   += [
			'scheme'   => '',
			'user'     => '',
			'pass'     => '',
			'host'     => '',
			'port'     => '',
			'path'     => '',
			'query'    => '',
			'fragment' => '',
		];
		$parts                   = array_map( 'strval', $parts );
		$part_directives         = $part_directives ? array_values( $part_directives ) : [];
		$part_directives_exclude = $part_directives && 0 === mb_strpos( $part_directives[ 0 ], '-' );

		$can_include = function ( string $part ) use (
			$part_directives,
			$part_directives_exclude
		) : bool {
			if ( ! $part_directives ) {
				return true; // No directives.
			}
			if ( $part_directives_exclude ) {
				return ! in_array( '-' . $part, $part_directives, true );
			}
			return in_array( $part, $part_directives, true );
		};
		$scheme      = '' !== $parts[ 'scheme' ] && $can_include( 'scheme' )
			? $parts[ 'scheme' ] . ( '//' !== $parts[ 'scheme' ] ? '://' : '' ) : '';

		$user = '' !== $parts[ 'user' ] && $can_include( 'user' ) ? $parts[ 'user' ] : '';
		$pass = '' !== $parts[ 'pass' ] && $can_include( 'pass' ) ? ':' . $parts[ 'pass' ] : '';
		$pass .= '' !== $user || '' !== $pass ? '@' : ''; // e.g., `https://user:pass@host/`.

		$host = '' !== $parts[ 'host' ] && $can_include( 'host' ) ? $parts[ 'host' ] : '';
		$port = '' !== $parts[ 'port' ] && $can_include( 'port' ) ? ':' . $parts[ 'port' ] : '';

		$path     = '' !== $parts[ 'path' ] && $can_include( 'path' ) ? $parts[ 'path' ] : '';
		$query    = '' !== $parts[ 'query' ] && $can_include( 'query' ) ? '?' . $parts[ 'query' ] : '';
		$fragment = '' !== $parts[ 'fragment' ] && $can_include( 'fragment' ) ? '#' . $parts[ 'fragment' ] : '';

		return $scheme . $user . $pass . $host . $port . $path . $query . $fragment;
	}
}
