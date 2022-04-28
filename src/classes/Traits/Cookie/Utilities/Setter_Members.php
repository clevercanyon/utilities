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
namespace Clever_Canyon\Utilities\Traits\Cookie\Utilities;

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
 * @see   U\Cookie
 */
trait Setter_Members {
	/**
	 * Sets a cookie value.
	 *
	 * @since 2022-04-25
	 *
	 * @param string $name    Cookie name.
	 * @param string $value   Cookie value.
	 * @param array  $options Optional. Default is `[]`.
	 *
	 * @returns bool `true` on success.
	 *
	 * @throws U\Fatal_Exception If `$name` is not a valid cookie name.
	 */
	public static function set( string $name, string $value, array $options = [] ) : bool {
		if ( ! U\Cookie::is_valid_name( $name ) ) {
			throw new U\Fatal_Exception( 'Invalid cookie name: `' . $name . '`.' );
		}
		$time = U\Time::utc(); // Current unix timestamp.

		$options[ 'domain' ]  = u\iff_string_ne( $options[ 'domain' ], '.' . U\URL::current_root_host( false ) );
		$options[ 'path' ]    = u\iff_string_ne( $options[ 'path' ], '/' );
		$options[ 'expires' ] = $time + u\iff_int( $options[ 'expires' ], 31536000 );

		$options[ 'samesite' ] = u\iff_string_ne( $options[ 'samesite' ], 'lax' );
		$options[ 'secure' ]   = u\iff_bool( $options[ 'secure' ], U\URL::current_scheme() === 'https' );
		$options[ 'secure' ]   = 'none' === mb_strtolower( $options[ 'samesite' ] ) ? true : $options[ 'secure' ];

		$options[ 'httponly' ] = u\iff_bool( $options[ 'httponly' ], false );

		setcookie( $name, $value, $options );

		if ( $options[ 'expires' ] < $time ) {
			unset( $_COOKIE[ $name ] );
		} else {
			$_COOKIE[ $name ] = $value;
		}
		return true;
	}

	/**
	 * Deletes a cookie.
	 *
	 * @since 2022-04-25
	 *
	 * @param string $name    Cookie name.
	 * @param array  $options Optional. Default is `[]`.
	 *
	 * @returns bool `true` on success.
	 *
	 * @throws U\Fatal_Exception If `$name` is not a valid cookie name.
	 */
	public static function delete( string $name, array $options = [] ) : bool {
		return U\Cookie::set( $name, '', array_merge( $options, [ 'expires' => -1 ] ) );
	}
}
