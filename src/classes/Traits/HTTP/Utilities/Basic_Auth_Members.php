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
	 */
	public static function basic_auth( string $realm, array $valid_users, /* string|null */ ?string $error_document = null ) : void {
		$is_valid_user = null; // Initialize.

		$authorization = U\Env::var( 'HTTP_AUTHORIZATION' ) ?: U\Env::var( 'REDIRECT_HTTP_AUTHORIZATION' );
		$username      = U\Env::var( 'PHP_AUTH_USER' );
		$password      = U\Env::var( 'PHP_AUTH_PW' );

		if ( $authorization && ( '' === $username || '' === $password ) ) {
			$authorization = mb_substr( $authorization, 6 ); // Remove `Basic `.
			$authorization = U\Str::base64_decode( $authorization );

			if ( $authorization && false !== mb_strpos( $authorization, ':' ) ) {
				[ $username, $password ] = explode( ':', $authorization, 2 );
			}
		}
		if ( '' !== $username && '' !== $password ) {
			foreach ( $valid_users as $_valid_username => $_valid_password ) {
				if ( hash_equals( $_valid_username, $username ) && hash_equals( $_valid_password, $password ) ) {
					$is_valid_user = true;
					break; // All good in this case.
				}
			} // Loop stops on any valid user; shifting to below.
		}
		if ( $is_valid_user ) {
			return; // All good in this case.
		}
		if ( headers_sent() ) {
			exit(); // All we can do is halt exection.
		}
		header( 'www-authenticate: Basic realm="' . U\Str::esc_dq( $realm ) . '"' );
		http_response_code( 401 ); // Unauthorized (401).

		if ( $error_document && is_file( $error_document ) ) {
			readfile( $error_document );

		} elseif ( null === $error_document && ( $document_root = U\Env::var( 'DOCUMENT_ROOT' ) ) ) {
			if ( is_file( $_401_error_document = U\Dir::join( $document_root, '/401.shtml' ) ) ) {
				readfile( $_401_error_document );

			} elseif ( is_file( $_401_error_document = U\Dir::join( $document_root, '/401.html' ) ) ) {
				readfile( $_401_error_document );
			}
		}
		exit(); // Halt script execution.
	}
}
