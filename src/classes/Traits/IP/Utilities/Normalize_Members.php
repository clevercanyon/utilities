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
namespace Clever_Canyon\Utilities\Traits\IP\Utilities;

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
 * @see   U\IP
 */
trait Normalize_Members {
	/**
	 * Normalizes IPv4 and IPv6 addresses.
	 *
	 * @since 2022-01-21
	 *
	 * @param string $ip IPv4 or IPv6 address(es).
	 *                   Can be given in comma-delimited format.
	 *
	 * @return string Normalized IPv4 or IPv6 address(es).
	 */
	public static function normalize( string $ip ) : string {
		if ( '' === $ip ) {
			return ''; // Nothing.
		}
		$ips = mb_strtolower( trim( $ip ) );
		$ips = preg_split( '/[\s;,]+/u', $ips, -1, PREG_SPLIT_NO_EMPTY );

		foreach ( $ips as $_key => &$_ip ) {
			$_bin = inet_pton( $_ip );
			$_ip  = false !== $_bin ? inet_ntop( $_bin ) : '';

			if ( '' === $_ip ) {
				unset( $ips[ $_key ] );
			}
		}
		return implode( ', ', $ips );
	}
}
