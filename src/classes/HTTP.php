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
namespace Clever_Canyon\Utilities;

/**
 * Utilities.
 *
 * @since 2021-12-15
 */
use Clever_Canyon\{Utilities as U};

// </editor-fold>

/**
 * HTTP utilities.
 *
 * @since 2021-12-15
 */
final class HTTP extends U\A6t\Stc_Utilities {
	/**
	 * Traits.
	 *
	 * @since 2021-12-15
	 */
	use U\Traits\HTTP\Members;

	/**
	 * Supported HTTP request methods.
	 *
	 * @since 2022-04-25
	 *
	 * @see   `src/assets/scripts/classes/HTTPs.js`
	 */
	public const SUPPORTED_REQUEST_METHODS = [
		'OPTIONS',
		'HEAD',
		'GET',
		'POST',
		'PUT',
		'PATCH',
		'DELETE',
	];

	/**
	 * HTTP request header names.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
	 * @see   https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
	 * @see   `src/assets/scripts/classes/HTTPs.js`
	 */
	public const REQUEST_HEADER_NAMES = [
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
		'cdn-loop',
		'cf-connecting-ip',
		'cf-ipcountry',
		'cf-ray',
		'cf-visitor',
		'cf-worker',
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

	/**
	 * HTTP response header names.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
	 * @see   https://en.wikipedia.org/wiki/List_of_HTTP_header_fields
	 * @see   `src/assets/scripts/classes/HTTPs.js`
	 */
	public const RESPONSE_HEADER_NAMES = [
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
		'x-litespeed-purge',
		'x-litespeed-tag',
		'x-litespeed-vary',
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

	/**
	 * HTTP response status codes.
	 *
	 * @since 2021-12-15
	 *
	 * @see   https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
	 * @see   `src/assets/scripts/classes/HTTPs.js`
	 */
	public const RESPONSE_STATUS_CODES = [
		'100' => 'Continue',
		'101' => 'Switching Protocols',
		'102' => 'Processing',
		'103' => 'Early Hints',

		'200' => 'OK',
		'201' => 'Created',
		'202' => 'Accepted',
		'203' => 'Non-Authoritative Information',
		'204' => 'No Content',
		'205' => 'Reset Content',
		'206' => 'Partial Content',
		'207' => 'Multi-Status',
		'226' => 'IM Used',

		'300' => 'Multiple Choices',
		'301' => 'Moved Permanently',
		'302' => 'Found',
		'303' => 'See Other',
		'304' => 'Not Modified',
		'305' => 'Use Proxy',
		'306' => 'Reserved',
		'307' => 'Temporary Redirect',
		'308' => 'Permanent Redirect',

		'400' => 'Bad Request',
		'401' => 'Unauthorized',
		'402' => 'Payment Required',
		'403' => 'Forbidden',
		'404' => 'Not Found',
		'405' => 'Method Not Allowed',
		'406' => 'Not Acceptable',
		'407' => 'Proxy Authentication Required',
		'408' => 'Request Timeout',
		'409' => 'Conflict',
		'410' => 'Gone',
		'411' => 'Length Required',
		'412' => 'Precondition Failed',
		'413' => 'Request Entity Too Large',
		'414' => 'Request-URI Too Long',
		'415' => 'Unsupported Media Type',
		'416' => 'Requested Range Not Satisfiable',
		'417' => 'Expectation Failed',
		'418' => 'I\'m a teapot',
		'421' => 'Misdirected Request',
		'422' => 'Unprocessable Entity',
		'423' => 'Locked',
		'424' => 'Failed Dependency',
		'426' => 'Upgrade Required',
		'428' => 'Precondition Required',
		'429' => 'Too Many Requests',
		'431' => 'Request Header Fields Too Large',
		'451' => 'Unavailable For Legal Reasons',

		'500' => 'Internal Server Error',
		'501' => 'Not Implemented',
		'502' => 'Bad Gateway',
		'503' => 'Service Unavailable',
		'504' => 'Gateway Timeout',
		'505' => 'HTTP Version Not Supported',
		'506' => 'Variant Also Negotiates',
		'507' => 'Insufficient Storage',
		'510' => 'Not Extended',
		'511' => 'Network Authentication Required',
	];
}
