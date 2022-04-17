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
trait Header_Members {
	/**
	 * Gets the value of an existing response header.
	 *
	 * @since 2021-12-15
	 *
	 * @param string $header Header name.
	 *
	 * @return string|null String value if header is set already; else `null`.
	 *                     It is possible for this to return an empty string, but still be `true`.
	 *                     Use `! is_null()` to test for a true return value from this function.
	 */
	public static function response_header( string $header ) /* : string|null */ : ?string {
		$header = trim( mb_strtolower( $header ), U\Str::TRIM_CHARS . ':' );

		foreach ( headers_list() as $_header ) {
			$_header_parts = explode( ':', $_header, 2 );
			$_header_name  = trim( mb_strtolower( $_header_parts[ 0 ] ) );
			$_header_value = trim( $_header_parts[ 1 ] ?? '' );

			if ( $_header_name === $header ) {
				return $_header_value;
			}
		}
		return null;
	}

	/**
	 * Gets a list of all known request header names.
	 *
	 * @since 2022-04-13
	 *
	 * @return string[] Header names.
	 *
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
	 * @see   https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
	 */
	public static function request_header_names() : array {
		return [
			'a-im',
			'accept',
			'accept-charset',
			'accept-datetime',
			'accept-encoding',
			'accept-language',
			'accept-push-policy',
			'accept-signature',
			'access-control-request-headers',
			'access-control-request-method',
			'authorization',
			'cache-control',
			'cf-connecting-ip',
			'cf-ipcountry',
			'cf-ray',
			'cf-visitor',
			'client-ip',
			'connection',
			'content-encoding',
			'content-language',
			'content-length',
			'content-md5',
			'content-type',
			'cookie',
			'date',
			'device-memory',
			'dnt',
			'downlink',
			'dpr',
			'early-data',
			'ect',
			'expect',
			'forwarded',
			'from',
			'front-end-https',
			'host',
			'http2-settings',
			'idempotency-key',
			'if-match',
			'if-modified-since',
			'if-none-match',
			'if-range',
			'if-unmodified-since',
			'last-event-id',
			'max-forwards',
			'origin',
			'ping-from',
			'ping-to',
			'pragma',
			'prefer',
			'proxy-authorization',
			'proxy-connection',
			'range',
			'referer',
			'remote-addr',
			'rtt',
			'save-data',
			'sec-ch-ua',
			'sec-ch-ua-arch',
			'sec-ch-ua-bitness',
			'sec-ch-ua-full-version',
			'sec-ch-ua-full-version-list',
			'sec-ch-ua-mobile',
			'sec-ch-ua-model',
			'sec-ch-ua-platform',
			'sec-ch-ua-platform-version',
			'sec-fetch-dest',
			'sec-fetch-mode',
			'sec-fetch-site',
			'sec-fetch-user',
			'sec-websocket-extensions',
			'sec-websocket-key',
			'sec-websocket-protocol',
			'sec-websocket-version',
			'service-worker',
			'service-worker-navigation-preload',
			'signature',
			'signed-headers',
			'te',
			'trailer',
			'transfer-encoding',
			'true-client-ip',
			'upgrade',
			'upgrade-insecure-requests',
			'user-agent',
			'via',
			'viewport-width',
			'want-digest',
			'warning',
			'width',
			'x-att-deviceid',
			'x-cluster-client-ip',
			'x-correlation-id',
			'x-csrf-token',
			'x-forwarded-for',
			'x-forwarded-host',
			'x-forwarded-path',
			'x-forwarded-proto',
			'x-forwarded-ssl',
			'x-http-method-override',
			'x-nonce',
			'x-real-ip',
			'x-request-id',
			'x-requested-by',
			'x-requested-with',
			'x-uidh',
			'x-wap-profile',
			'x-wp-nonce',
		];
	}

	/**
	 * Gets a list of all known response header names.
	 *
	 * @since 2022-04-13
	 *
	 * @return string[] Header names.
	 *
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
	 * @see   https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
	 */
	public static function response_header_names() : array {
		return [
			'accept-ch',
			'accept-patch',
			'accept-post',
			'accept-ranges',
			'access-control-allow-credentials',
			'access-control-allow-headers',
			'access-control-allow-methods',
			'access-control-allow-origin',
			'access-control-expose-headers',
			'access-control-max-age',
			'age',
			'allow',
			'alt-svc',
			'cache-control',
			'cdn-cache-control',
			'cf-cache-status',
			'cf-ray',
			'clear-site-data',
			'cloudflare-cdn-cache-control',
			'connection',
			'content-disposition',
			'content-dpr',
			'content-encoding',
			'content-language',
			'content-length',
			'content-location',
			'content-md5',
			'content-range',
			'content-security-policy',
			'content-security-policy-report-only',
			'content-transfer-encoding',
			'content-type',
			'cross-origin-embedder-policy',
			'cross-origin-opener-policy',
			'cross-origin-resource-policy',
			'date',
			'delta-base',
			'digest',
			'etag',
			'expect-ct',
			'expires',
			'feature-policy',
			'im',
			'keep-alive',
			'large-allocation',
			'last-modified',
			'link',
			'location',
			'lsc-cookie',
			'nel',
			'p3p',
			'permissions-policy',
			'pragma',
			'preference-applied',
			'proxy-authenticate',
			'public-key-pins',
			'public-key-pins',
			'public-key-pins-report-only',
			'push-policy',
			'referrer-policy',
			'refresh',
			'report-to',
			'retry-after',
			'sec-websocket-accept',
			'sec-websocket-accept',
			'server',
			'server-timing',
			'service-worker-allowed',
			'set-cookie',
			'signature',
			'signed-headers',
			'sourcemap',
			'status',
			'strict-transport-security',
			'surrogate-control',
			'timing-allow-origin',
			'tk',
			'trailer',
			'transfer-encoding',
			'upgrade',
			'vary',
			'via',
			'want-digest',
			'warning',
			'www-authenticate',
			'x-cdn-vary',
			'x-content-duration',
			'x-content-security-policy',
			'x-content-type-options',
			'x-correlation-id',
			'x-dns-prefetch-control',
			'x-download-options',
			'x-firefox-spdy',
			'x-frame-options',
			'x-litespeed-cache',
			'x-litespeed-cache-control',
			'x-mod-pagespeed',
			'x-permitted-cross-domain-policies',
			'x-pingback',
			'x-powered-by',
			'x-redirect-by',
			'x-request-id',
			'x-robots-tag',
			'x-server-debug',
			'x-sourcemap',
			'x-turbo-charged-by',
			'x-ua-compatible',
			'x-webkit-csp',
			'x-wp-total',
			'x-wp-totalpages',
			'x-xss-protection',
		];
	}
}
