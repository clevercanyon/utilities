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
namespace Clever_Canyon\Utilities\Traits\HTTP\Utilities;

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
 * @see   U\HTTP
 */
trait Basic_Auth_Members {
	/**
	 * Handles basic authentication.
	 *
	 * @since 2022-03-04
	 *
	 * @param string      $realm          Basic authentication realm.
	 * @param array       $valid_users    Associative array of valid usernames & passwords.
	 * @param string|null $error_document Optional custom error document. Default is `null` (auto-detection).
	 *
	 * @throws U\Fatal_Exception If this is called after headers have already been sent.
	 */
	public static function basic_auth( string $realm, array $valid_users, /* string|null */ ?string $error_document = null ) : void {
		if ( headers_sent() ) {
			throw new U\Fatal_Exception( 'Headers sent already.' );
		}
		U\HTTP::disable_robots();  // Implicitly.
		U\HTTP::disable_caching(); // Implicitly.

		$username      = U\Env::var( 'PHP_AUTH_USER' ); // If empty, we can parse `HTTP_AUTHORIZATION`.
		$password      = U\Env::var( 'PHP_AUTH_PW' );   // If empty, we can parse `HTTP_AUTHORIZATION`.
		$authorization = U\Env::var( 'HTTP_AUTHORIZATION' ) ?: U\Env::var( 'REDIRECT_HTTP_AUTHORIZATION' );

		if ( ( '' === $username || '' === $password ) && $authorization ) {
			$authorization = trim( mb_substr( $authorization, 6 /* removes `Basic ` */ ) );
			$authorization = U\Str::base64_decode( $authorization );

			if ( $authorization && false !== mb_strpos( $authorization, ':' ) ) {
				[ $username, $password ] = explode( ':', $authorization, 2 );
			}
		}
		if ( '' !== $username && '' !== $password ) {
			foreach ( $valid_users as $_valid_username => $_valid_password ) {
				if ( hash_equals( $_valid_username, $username ) && hash_equals( $_valid_password, $password ) ) {
					return; // All good in this case.
				}
			} // Loop stops on any valid user; returning to caller.
		}
		header( 'www-authenticate: Basic realm="' . U\Str::esc_dq( $realm ) . '"' );
		http_response_code( 401 ); // Unauthorized (401).

		if ( $error_document && is_file( $error_document ) ) {
			if ( U\HTTP::prep_for_output() ) {
				readfile( $error_document );
			}
		} elseif ( null === $error_document && ( $document_root = U\Env::var( 'DOCUMENT_ROOT' ) ) ) {
			if ( is_file( $_401_error_document = U\Dir::join( $document_root, '/401.shtml' ) ) ) {
				if ( U\HTTP::prep_for_output() ) {
					readfile( $_401_error_document );
				}
			} elseif ( is_file( $_401_error_document = U\Dir::join( $document_root, '/401.html' ) ) ) {
				if ( U\HTTP::prep_for_output() ) {
					readfile( $_401_error_document );
				}
			}
		}
		exit(); // Halt script execution.
	}
}
