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
namespace Clever_Canyon\Utilities\Traits\User\Utilities;

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
 * @see   U\User
 */
trait IP_Members {
	/**
	 * Gets current user's IP address.
	 *
	 * @since 2021-12-15
	 *
	 * @return string IPv4 or IPV6 IP address.
	 */
	public static function ip() : string {
		if ( U\Env::is_cli() ) {
			return ''; // Not possible.
		}
		$env_vars = [
			'HTTP_CF_CONNECTING_IP',
			'HTTP_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'HTTP_VIA',
			'REMOTE_ADDR',
		];
		foreach ( $env_vars as $_var ) {
			$_ips = U\Env::var( $_var, [ 'bypass:U\\User::ip' => true ] );
			if ( $_ips && ( $_ip = U\User::ip_user_public_helper( $_ips ) ) ) {
				return $_ip; // Normalized IPv4 or IPv6 address.
			}
		}
		return ''; // Nothing.
	}

	/**
	 * Seeks a valid user/public IP address.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $ips IP, or a `[\s;,]+`-delimited list of IPs.
	 *
	 * @return string Valid user/public IP address; else an empty string.
	 */
	protected static function ip_user_public_helper( string $ips ) : string {
		$ips = mb_strtolower( trim( $ips ) );
		$ips = preg_split( '/[\s;,]+/u', $ips, -1, PREG_SPLIT_NO_EMPTY );

		foreach ( $ips as $_ip ) {
			if ( U\Str::is_user_public_ip( $_ip ) && ( $_ip = U\Str::normalize_ip( $_ip ) ) ) {
				return $_ip; // Normalized IPv4 or IPv6 address.
			}
		}
		return ''; // Nothing.
	}
}
