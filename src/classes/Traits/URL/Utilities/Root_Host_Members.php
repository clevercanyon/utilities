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
trait Root_Host_Members {
	/**
	 * Root host.
	 *
	 * @since 2020-11-19
	 *
	 * @param string $url       URL to parse.
	 * @param bool   $with_port Include port number? Default is `true`.
	 *
	 * @return string Root host; (e.g., foo.root.com → root.com).
	 */
	public static function root_host( string $url, bool $with_port = true ) : string {
		if ( ! $url || ! ( $parts = U\URL::parse( $url ) ) ) {
			return ''; // Not possible.
		}
		$host = $parts[ 'host' ];
		$port = $parts[ 'port' ];

		if ( '' === $host ) {
			return ''; // Failure.
		}
		$root_host = implode( '.', array_slice( explode( '.', $host ), -2 ) );

		if ( $with_port && '' !== $root_host && '' !== $port ) {
			return $root_host . ':' . $port;
		} else {
			return $root_host;
		}
	}
}
