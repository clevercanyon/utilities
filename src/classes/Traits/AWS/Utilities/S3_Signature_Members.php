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
namespace Clever_Canyon\Utilities\Traits\AWS\Utilities;

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
 * @see   U\AWS
 */
trait S3_Signature_Members {
	/**
	 * Creates an Amazon S3 AWS4-HMAC-SHA256 signature in different formats.
	 *
	 * @since   2022-03-16
	 *
	 * @param string $date_ymd           Date in YMD format; e.g., `20220316`.
	 * @param string $date_iso_8601_aws4 Date in ISO-8601 AWS4 format; e.g., `20220316T000000Z`.
	 * @param string $signature_scope    AWS S3 v4 signature scope; e.g., `20220316/us-east-1/s3/aws4_request`.
	 * @param string $request_method     HTTP request method; e.g., `GET`.
	 * @param string $request_uri        HTTP request URI; e.g., `/path?query`.
	 * @param array  $request_headers    Request headers; e.g., `[ 'host' => $host ]`.
	 *
	 * @param array  $args               Optional configuration options.
	 *
	 *     string `access_key`    AWS access key. Default is static environment var `C10N_AWS_ACCESS_KEY`.
	 *     string `secret_key`    AWS secret key. Default is static environment var `C10N_AWS_SECRET_KEY`.
	 *
	 *     string `bucket`        S3 bucket name. Default is static environment var `C10N_AWS_S3_BUCKET`.
	 *     string `bucket_region` S3 bucket region. Default is static environment var `C10N_AWS_S3_BUCKET_REGION`.
	 *                            {@see https://o5p.me/VXOWKd} for further details on region codes.
	 *
	 *     string `body`          Optional body. Default is `UNSIGNED-PAYLOAD`.
	 *
	 *     string `rtn_type`      Optional return type. Default is `signature`.
	 *                            This can be set to `authorization-header`, which returns
	 *                            an authorization header containing the signature instead of just the signature.
	 *
	 * @return string Amazon S3 AWS4-HMAC-SHA256 signature in the selected `rtn_type`.
	 */
	public static function s3_sign(
		string $date_ymd,
		string $date_iso_8601_aws4,
		string $signature_scope,
		string $request_method,
		string $request_uri,
		array $request_headers,
		array $args = []
	) : string {
		$args     += [
			'access_key' => U\Env::static_var( 'C10N_AWS_ACCESS_KEY' ) ?: '',
			'secret_key' => U\Env::static_var( 'C10N_AWS_SECRET_KEY' ) ?: '',

			'bucket'        => U\Env::static_var( 'C10N_AWS_S3_BUCKET' ) ?: '',
			'bucket_region' => U\Env::static_var( 'C10N_AWS_S3_BUCKET_REGION' ) ?: '',

			'body'     => 'UNSIGNED-PAYLOAD',
			'rtn_type' => 'signature',
		];
		$aws_args = U\Bundle::pluck( $args, [ 'access_key', 'secret_key', 'bucket', 'bucket_region' ] );

		$request_method = mb_strtoupper( $request_method );
		$reqeust_path   = U\URL::parse( $request_uri, PHP_URL_PATH );

		$request_query = U\URL::parse( $request_uri, PHP_URL_QUERY );
		$request_query = U\URL::parse_query_str( $request_query, U\URL::QUERY_RFC3986_AWS4 );
		$request_query = U\URL::build_query_str( U\Arr::sort_by( 'key', $request_query, SORT_STRING ) );

		$_request_headers = U\Arr::sort_by( 'key', $request_headers, SORT_STRING );
		$request_headers  = []; // Reinitialize request headers.

		foreach ( $_request_headers as $_header => $_value ) {
			$_header                     = mb_strtolower( $_header );
			$request_headers[ $_header ] = $_header . ':' . trim( $_value );
		}
		$canonicial_request = // {@see https://o5p.me/7JgPTd}.
			$request_method . "\n" .
			$reqeust_path . "\n" .
			$request_query . "\n" .
			implode( "\n", $request_headers ) . "\n\n" .
			implode( ';', array_keys( $request_headers ) ) . "\n" .
			( 'UNSIGNED-PAYLOAD' === $args[ 'body' ] ? $args[ 'body' ] : hash( 'sha256', $args[ 'body' ] ) );

		$string_to_sign = // {@see https://o5p.me/7JgPTd}.
			'AWS4-HMAC-SHA256' . "\n" .
			$date_iso_8601_aws4 . "\n" .
			$signature_scope . "\n" .
			hash( 'sha256', $canonicial_request );

		$signature            = U\AWS::s3_signature_helper( $date_ymd, $string_to_sign, $aws_args );
		$authorization_header = 'AWS4-HMAC-SHA256 Credential=' . $args[ 'access_key' ] . '/' . $signature_scope . ',' .
			'SignedHeaders=' . implode( ';', array_keys( $request_headers ) ) . ',' .
			'Signature=' . $signature;

		return 'authorization-header' === $args[ 'rtn_type' ] ? $authorization_header : $signature;
	}

	/**
	 * Helps create an Amazon S3 AWS4-HMAC-SHA256 signature.
	 *
	 * @since 2022-03-16
	 *
	 * @param string $date_ymd Date in YMD format; e.g., `20220316`.
	 * @param string $str      String to sign; e.g., {@see U\AWS::s3_sign()}.
	 *
	 * @param array  $args     Optional configuration options.
	 *
	 *     string `access_key`    AWS access key. Default is static environment var `C10N_AWS_ACCESS_KEY`.
	 *     string `secret_key`    AWS secret key. Default is static environment var `C10N_AWS_SECRET_KEY`.
	 *
	 *     string `bucket`        S3 bucket name. Default is static environment var `C10N_AWS_S3_BUCKET`.
	 *     string `bucket_region` S3 bucket region. Default is static environment var `C10N_AWS_S3_BUCKET_REGION`.
	 *                            {@see https://o5p.me/VXOWKd} for further details on region codes.
	 *
	 * @return string An AWS4-HMAC-SHA256 signature for Amazon S3. `64` hexadecimal bytes in length.
	 */
	protected static function s3_signature_helper( string $date_ymd, string $str, array $args = [] ) : string {
		$args                            += [
			'access_key' => U\Env::static_var( 'C10N_AWS_ACCESS_KEY' ) ?: '',
			'secret_key' => U\Env::static_var( 'C10N_AWS_SECRET_KEY' ) ?: '',

			'bucket'        => U\Env::static_var( 'C10N_AWS_S3_BUCKET' ) ?: '',
			'bucket_region' => U\Env::static_var( 'C10N_AWS_S3_BUCKET_REGION' ) ?: '',
		];
		$date_hash_binary                = hash_hmac( 'sha256', $date_ymd, 'AWS4' . $args[ 'secret_key' ], true );
		$date_region_hash_binary         = hash_hmac( 'sha256', $args[ 'bucket_region' ], $date_hash_binary, true );
		$date_region_service_hash_binary = hash_hmac( 'sha256', 's3' /* S3 service */, $date_region_hash_binary, true );
		$signing_key_binary              = hash_hmac( 'sha256', 'aws4_request', $date_region_service_hash_binary, true );

		return hash_hmac( 'sha256', $str, $signing_key_binary );
	}
}
