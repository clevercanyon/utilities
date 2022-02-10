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
trait Conditional_Members {
	/**
	 * Checks IP address validity; e.g., `127.0.0.1`, `45.79.7.19`.
	 * Or IPv6; e.g., `::1`, `::ffff:2d4f:713`, `0:0:0:0:0:ffff:2d4f:0713`.
	 *
	 * @since 2021-12-26
	 *
	 * @param mixed $value Value to check.
	 *
	 * @return bool True if it's a valid IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 */
	public static function is( /* mixed */ $value ) : bool {
		return false !== filter_var( $value, FILTER_VALIDATE_IP );
	}

	/**
	 * Checks IPv4 address validity; e.g., `127.0.0.1`, `45.79.7.19`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid IPv4 address.
	 *
	 * @see   https://o5p.me/yxPYQG
	 */
	public static function is_v4( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_IPV4 ] );
	}

	/**
	 * Checks IPv6 address validity; e.g., `::1`, `::ffff:2d4f:713`, `0:0:0:0:0:ffff:2d4f:0713`.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid IPv6 address.
	 *
	 * @see   https://o5p.me/XsExYc
	 */
	public static function is_v6( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_IPV6 ] );
	}

	/**
	 * Checks public IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid public IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 */
	public static function is_public( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_PRIV_RANGE ] );
	}

	/**
	 * Checks user/public IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid user/public IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 */
	public static function is_public_user( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ] );
	}

	/**
	 * Checks private IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid private IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 */
	public static function is_private( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP )
			&& false === filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_PRIV_RANGE ] );
	}

	/**
	 * Checks reserved IP address validity.
	 *
	 * @since 2021-12-26
	 *
	 * @param string $str String to check.
	 *
	 * @return bool True if it's a valid reserved IP address.
	 *
	 * @see   https://o5p.me/9JSgKk
	 */
	public static function is_reserved( string $str ) : bool {
		return false !== filter_var( $str, FILTER_VALIDATE_IP )
			&& false === filter_var( $str, FILTER_VALIDATE_IP, [ 'flags' => FILTER_FLAG_NO_RES_RANGE ] );
	}
}
