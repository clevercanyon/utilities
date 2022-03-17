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
trait S3_URL_Members {
	/**
	 * Generates a signed URL granting HTTP access to an S3 subpath.
	 *
	 * @since 2022-03-16
	 *
	 * @param string $subpath Amazon S3 file subpath.
	 * @param array  $args    Optional configuration options.
	 *
	 *     string `access_key`    AWS access key. Default is static environment var `C10N_AWS_ACCESS_KEY`.
	 *     string `secret_key`    AWS secret key. Default is static environment var `C10N_AWS_SECRET_KEY`.
	 *
	 *     string `bucket`        S3 bucket name. Default is static environment var `C10N_AWS_S3_BUCKET`.
	 *     string `bucket_region` S3 bucket region. Default is static environment var `C10N_AWS_S3_BUCKET_REGION`.
	 *                            {@see https://o5p.me/VXOWKd} for further details on region codes.
	 *
	 *     string `attachment`    Optional; for content-disposition. Default is `true` if `inline` is `false`.
	 *     string `inline`        Optional; for content-disposition. Default is `true` if `attachment` is `false`.
	 *            * Note that `attachment` and `inline` are mutually exclusive. Only one can be `true`.
	 *
	 *     string `expires`       Optional expiration, in seconds. Default is {@see U\Time::DAY_IN_SECONDS}.
	 *     string `cache_control` Optional cache-control header. Default is a full set of private, no-cache, no-store flags.
	 *
	 * @return string Signed URL granting HTTP access to `$subpath`.
	 */
	public static function s3_url( string $subpath, array $args = [] ) : string {
		$args     += [
			'access_key' => U\Env::static_var( 'C10N_AWS_ACCESS_KEY' ) ?: '',
			'secret_key' => U\Env::static_var( 'C10N_AWS_SECRET_KEY' ) ?: '',

			'bucket'        => U\Env::static_var( 'C10N_AWS_S3_BUCKET' ) ?: '',
			'bucket_region' => U\Env::static_var( 'C10N_AWS_S3_BUCKET_REGION' ) ?: '',

			'attachment' => false,                  // For `content-disposition` header.
			'inline'     => false,                  // For `content-disposition` header.

			'expires'       => U\Time::DAY_IN_SECONDS, // 1 ... 604800 max; {@see https://o5p.me/7JgPTd}.
			'cache_control' => 'private, no-cache, no-store, must-revalidate, max-age=0, s-maxage=0, stale-while-revalidate=0, stale-if-error=0',
		];
		$aws_args = U\Bundle::pluck( $args, [ 'access_key', 'secret_key', 'bucket', 'bucket_region' ] );

		$subpath  = trim( $subpath, '/' );
		$basename = basename( $subpath );

		$date_ymd           = U\Time::utc( 'now', U\Time::FORMAT_YMD );
		$date_iso_8601_aws4 = U\Time::utc( 'now', U\Time::FORMAT_ISO_8601_AWS4 );

		$request_method  = 'GET'; // We're generating a link.
		$signature_scope = $date_ymd . '/' . $args[ 'bucket_region' ] . '/s3/aws4_request';

		$is_subdomain_bucket   = U\URL::is_hostname( $args[ 'bucket' ] . '.s3.amazonaws.com' );
		$host                  = $is_subdomain_bucket ? $args[ 'bucket' ] . '.s3.amazonaws.com' : 's3.amazonaws.com';
		$scheme_host_base_path = $is_subdomain_bucket ? 'https://' . $host : 'https://' . $host . '/' . $args[ 'bucket' ];

		$request_headers = [ 'host' => $host ];
		$request_headers = U\Arr::sort_by( 'key', $request_headers, SORT_STRING );

		$query_vars = U\Arr::sort_by( 'key', [
			'X-Amz-Date'          => $date_iso_8601_aws4,
			'X-Amz-Algorithm'     => 'AWS4-HMAC-SHA256',
			'X-Amz-Expires'       => $args[ 'expires' ],
			'X-Amz-Credential'    => $args[ 'access_key' ] . '/' . $signature_scope,
			'X-Amz-SignedHeaders' => implode( ';', array_keys( $request_headers ) ),

			'response-cache-control'       => $args[ 'cache_control' ],
			'response-content-type'        => U\File::content_type( $basename ),
			'response-content-disposition' => U\File::content_disposition(
				[
					'attachment' => $args[ 'attachment' ],
					'inline'     => $args[ 'inline' ],
					'file_name'  => $basename,
				]
			),
		], SORT_STRING );

		$request_uri = U\URL::encode( '/' . $subpath, U\URL::QUERY_RFC3986_AWS4 );
		$request_uri = str_replace( '%2F', '/', $request_uri ); // Decodes slashes.
		$request_uri = U\URL::add_query_vars( $query_vars, $request_uri, U\URL::QUERY_RFC3986_AWS4 );

		$signature = U\AWS::s3_sign(
			$date_ymd,
			$date_iso_8601_aws4,
			$signature_scope,
			$request_method,
			$request_uri,
			$request_headers,
			$aws_args
		);
		$url       = $scheme_host_base_path . $request_uri;
		$url       = U\URL::add_query_vars( [ 'X-Amz-Signature' => $signature ], $url, U\URL::QUERY_RFC3986_AWS4 );

		return $url; // Digitally signed URL granting S3 access.
	}
}
