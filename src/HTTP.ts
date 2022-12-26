/**
 * Utility class.
 */

import { escRegExp as $strꓺescRegExp } from './str.js';
import { isC10N as $envꓺisC10N, isCFW as $envꓺisCFW } from './env.js';
import { parse as $urlꓺparse, removeCSOQueryVars as $urlꓺremoveCSOQueryVars } from './url.js';

/**
 * Request config.
 */
interface RequestConfig {}

/**
 * Response config.
 */
interface ResponseConfig {
	response?: Response;
	status?: number;
	body?: BodyInit | null;
	headers?: Headers | { [x: string]: string };
	appendHeaders?: Headers | { [x: string]: string };
	enableCORs?: boolean;
	enableCDN?: boolean;
}

/**
 * HTTP request config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP request config.
 */
export function requestConfig(config: RequestConfig = {}): RequestConfig {
	return Object.assign({}, config);
}

/**
 * Prepares an HTTP request.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP response.
 */
export function prepareRequest(request: Request, config: RequestConfig = {}): Request {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars -- `config` ok.
	config = requestConfig(config);

	const cleanURL = $urlꓺremoveCSOQueryVars(request.url);
	const parsedURL = $urlꓺparse(cleanURL);

	if (!parsedURL) {
		throw new Error('Parse failure. Invalid request URL.');
	}
	const requestHasOrigin = request.headers.has('origin');
	const requestIsUserDynamic = requestIsFromUser(request) && requestPathIsDynamic(request, parsedURL);

	if (requestHasOrigin) {
		const _ck = parsedURL.searchParams.get('_ck') || '';
		parsedURL.searchParams.set('_ck', (_ck ? _ck + ';' : '') + 'origin:' + (request.headers.get('origin') || ''));
	}
	if (requestIsUserDynamic) {
		const _ck = parsedURL.searchParams.get('_ck') || '';
		parsedURL.searchParams.set('_ck', (_ck ? _ck + ';' : '') + 'user-dynamic:true');
	}
	parsedURL.searchParams.sort(); // Query sort optimizes cache.

	return new Request(parsedURL.toString(), request);
}

/**
 * HTTP response config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP response config.
 */
export function responseConfig(config: ResponseConfig = {}): ResponseConfig {
	return Object.assign(
		{
			response: null,
			status: 500,
			body: null,
			headers: {},
			appendHeaders: {},
			enableCORs: false,
			enableCDN: !$envꓺisCFW(),
		},
		config,
	);
}

/**
 * Prepares an HTTP response.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP response.
 */
export function prepareResponse(request: Request, config: ResponseConfig = {}): Response {
	config = responseConfig(config);
	config.status = config.status || 500;

	if (config.response) {
		config.status = config.response.status;
		config.body = config.response.body;

		prepareResponseHeaders(request, config);
		return config.response; // Configured response.
	}
	if (config.enableCORs && 'OPTIONS' === request.method) {
		config.status = 204; // No content for CORs preflight requests.
	}
	return new Response(requestNeedsContentBody(request, config.status) ? config.body : null, {
		status: config.status,
		statusText: responseStatusText(config.status),
		headers: prepareResponseHeaders(request, config),
	});
}

/**
 * Prepares HTTP response headers.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP response headers.
 */
export function prepareResponseHeaders(request: Request, config: ResponseConfig = {}): Headers {
	config = responseConfig(config);
	config.status = config.status || 500;

	const parsedURL = $urlꓺparse(request.url);

	config.headers = config.headers instanceof Headers ? config.headers : new Headers(config.headers || {});
	config.appendHeaders = config.appendHeaders instanceof Headers ? config.appendHeaders : new Headers(config.appendHeaders || {});

	let existingHeaders: { [x: string]: string } = {};

	const alwaysOnHeaders: { [x: string]: string } = {};
	const contentHeaders: { [x: string]: string } = {};
	const cacheHeaders: { [x: string]: string } = {};

	let securityHeaders: { [x: string]: string } = {};
	let corsHeaders: { [x: string]: string } = {};

	// Existing response headers.

	if (config.response) {
		// Extracts existing headers.
		existingHeaders = extractHeaders(config.response.headers);
	}
	// Always-on headers.

	alwaysOnHeaders['date'] = new Date().toUTCString();

	if (503 === config.status) {
		alwaysOnHeaders['retry-after'] = '300';
	}
	// Content-related headers.

	if (requestNeedsContentHeaders(request, config.status || 0)) {
		contentHeaders['x-ua-compatible'] = 'IE=edge';
	}
	// Cache control and related headers.

	cacheHeaders['vary'] = 'origin, accept, accept-language, accept-encoding';

	if (!requestHasCacheableMethod(request) || config.status >= 300) {
		cacheHeaders['cdn-cache-control'] = 'no-store';
		cacheHeaders['cache-control'] = 'no-store';
		//
	} else if (requestPathIsSEORelatedFile(request, parsedURL)) {
		cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=86400, stale-while-revalidate=86400, stale-if-error=86400';
		cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400';
		//
	} else if (requestPathIsStatic(request, parsedURL) && (config.response?.headers.has('etag') || config.headers.has('etag'))) {
		cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=31536000, stale-while-revalidate=604800, stale-if-error=604800';
		cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800, stale-if-error=604800';
		//
	} else if (requestPathIsInAdmin(request, parsedURL) || requestIsFromUser(request)) {
		cacheHeaders['cdn-cache-control'] = 'no-store';
		cacheHeaders['cache-control'] = 'no-store';
		//
	} else {
		cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=41400, stale-while-revalidate=1800, stale-if-error=1800';
		cacheHeaders['cache-control'] = 'no-store';
	}
	if (!config.enableCDN || config.headers.has('cache-control')) {
		delete existingHeaders['cdn-cache-control'];
		delete cacheHeaders['cdn-cache-control'];
	}
	// Security-related headers.

	if ($envꓺisC10N()) {
		securityHeaders = {
			'x-frame-options': 'SAMEORIGIN',
			'x-content-type-options': 'nosniff',
			'cross-origin-embedder-policy': 'unsafe-none',
			'cross-origin-opener-policy': 'same-origin',
			'cross-origin-resource-policy': 'same-origin',
			'referrer-policy': 'strict-origin-when-cross-origin',
			'strict-transport-security': 'max-age=15552000; includeSubDomains; preload',
			'content-security-policy':
				"report-uri https://clevercanyon.report-uri.com/r/d/csp/enforce; report-to csp; upgrade-insecure-requests; base-uri 'self'; frame-ancestors 'self';" +
				" default-src * data: blob: mediastream: 'report-sample'; style-src * data: blob: 'unsafe-inline' 'report-sample'; object-src 'none';" +
				" script-src blob: 'self' 'unsafe-inline' 'unsafe-eval' 'report-sample' *.clevercanyon.com *.wobots.com *.stripe.com *.cloudflare.com" +
				' *.cloudflareinsights.com *.google.com *.googletagmanager.com *.google-analytics.com *.googleadservices.com googleads.g.doubleclick.net *.cookie-script.com;',
			'permissions-policy':
				'accelerometer=(self), ambient-light-sensor=(self), autoplay=(self), battery=(self), camera=(self), clipboard-read=(self), clipboard-write=(self), conversion-measurement=(self),' +
				' cross-origin-isolated=(self), display-capture=(self), document-domain=(self), encrypted-media=(self), execution-while-not-rendered=(self), execution-while-out-of-viewport=(self),' +
				' focus-without-user-activation=(self), fullscreen=(self), gamepad=(self), geolocation=(self), gyroscope=(self), hid=(self), idle-detection=(self), interest-cohort=(self),' +
				' keyboard-map=(self), magnetometer=(self), microphone=(self), midi=(self), navigation-override=(self), payment=(self "https://js.stripe.com" "https://pay.google.com"),' +
				' picture-in-picture=(self), publickey-credentials-get=(self), screen-wake-lock=(self), serial=(self), speaker-selection=(self), sync-script=(self), sync-xhr=(self),' +
				' trust-token-redemption=(self), usb=(self), vertical-scroll=(self), web-share=(self), window-placement=(self), xr-spatial-tracking=(self)',

			'nel': '{ "report_to": "default", "max_age": 31536000, "include_subdomains": true }',
			'expect-ct': 'max-age=604800, report-uri="https://clevercanyon.report-uri.com/r/d/ct/reportOnly"',
			'report-to':
				'{ "group": "default", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/a/d/g" } ], "include_subdomains": true },' +
				' { "group": "csp", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/r/d/csp/enforce" } ], "include_subdomains": true }',
		};
	} else {
		securityHeaders = {
			'x-frame-options': 'SAMEORIGIN',
			'x-content-type-options': 'nosniff',
			'cross-origin-embedder-policy': 'unsafe-none',
			'cross-origin-opener-policy': 'same-origin',
			'cross-origin-resource-policy': 'same-origin',
			'referrer-policy': 'strict-origin-when-cross-origin',
			'content-security-policy':
				"base-uri 'self'; frame-ancestors 'self'; default-src * data: blob: mediastream: 'report-sample'; style-src * data: blob: 'unsafe-inline' 'report-sample';" +
				" object-src 'none'; script-src blob: 'self' 'unsafe-inline' 'unsafe-eval' 'report-sample' *clevercanyon.com *.wobots.com *.stripe.com *.cloudflare.com *.cloudflareinsights.com" +
				' *.google.com *.googletagmanager.com *.google-analytics.com *.googleadservices.com googleads.g.doubleclick.net *.cookie-script.com;',
			'permissions-policy':
				'accelerometer=(self), ambient-light-sensor=(self), autoplay=(self), battery=(self), camera=(self), clipboard-read=(self), clipboard-write=(self), conversion-measurement=(self),' +
				' cross-origin-isolated=(self), display-capture=(self), document-domain=(self), encrypted-media=(self), execution-while-not-rendered=(self), execution-while-out-of-viewport=(self),' +
				' focus-without-user-activation=(self), fullscreen=(self), gamepad=(self), geolocation=(self), gyroscope=(self), hid=(self), idle-detection=(self), interest-cohort=(self),' +
				' keyboard-map=(self), magnetometer=(self), microphone=(self), midi=(self), navigation-override=(self), payment=(self "https://js.stripe.com" "https://pay.google.com"),' +
				' picture-in-picture=(self), publickey-credentials-get=(self), screen-wake-lock=(self), serial=(self), speaker-selection=(self), sync-script=(self), sync-xhr=(self),' +
				' trust-token-redemption=(self), usb=(self), vertical-scroll=(self), web-share=(self), window-placement=(self), xr-spatial-tracking=(self)',
		};
	}
	// CORs-related headers.

	if (config.enableCORs) {
		corsHeaders = {
			'access-control-max-age': '7200',
			'access-control-allow-credentials': 'true',
			'access-control-allow-methods': supportedRequestMethods.join(', '),
			'access-control-allow-headers': requestHeaderNames.join(', '),
			'access-control-expose-headers': responseHeaderNames.join(', '),
			'timing-allow-origin': request.headers.has('origin') ? request.headers.get('origin') || '' : '*',
			'access-control-allow-origin': request.headers.has('origin') ? request.headers.get('origin') || '' : '*',
		};
	} else if (requestPathHasStaticExtension(request, parsedURL, /[^/.]\.(?:eot|otf|ttf|woff)[0-9]*$/iu)) {
		corsHeaders = {
			'access-control-allow-origin': request.headers.has('origin') ? request.headers.get('origin') || '' : '*',
		};
	}
	// Return all headers.

	const headers = new Headers({
		...existingHeaders,
		...alwaysOnHeaders,
		...contentHeaders,
		...cacheHeaders,
		...securityHeaders,
		...corsHeaders,
	});
	config.headers.forEach((value, name) => headers.set(name, value));
	config.appendHeaders.forEach((value, name) => headers.append(name, value));

	if (config.response) {
		config.response.headers.forEach((value, name) => config.response?.headers.delete(name));
		headers.forEach((value, name) => config.response?.headers.set(name, value));
	}
	return headers;
}

/**
 * Get HTTP response status text.
 *
 * @param   status HTTP status code.
 *
 * @returns        HTTP response status text.
 */
export function responseStatusText(status: number): string {
	return responseStatusCodes[String(status)] || '';
}

/**
 * Request has a supported method?
 *
 * @param   request HTTP request object.
 *
 * @returns         `true` if request has a supported method.
 */
export function requestHasSupportedMethod(request: Request): boolean {
	return supportedRequestMethods.indexOf(request.method) !== -1;
}

/**
 * Request has a cacheable request method?
 *
 * @param   request HTTP request object.
 *
 * @returns         `true` if request has a cacheable request method.
 */
export function requestHasCacheableMethod(request: Request): boolean {
	return requestHasSupportedMethod(request) && ['HEAD', 'GET'].indexOf(request.method) !== -1;
}

/**
 * Request method needs content headers?
 *
 * @param   request        HTTP request object.
 * @param   responseStatus HTTP response status code.
 *
 * @returns                `true` if request method needs content headers.
 */
export function requestNeedsContentHeaders(request: Request, responseStatus: number): boolean {
	return responseStatus !== 204 && requestHasSupportedMethod(request) && ['OPTIONS'].indexOf(request.method) === -1;
}

/**
 * Request method needs content body?
 *
 * @param   request        HTTP request object.
 * @param   responseStatus HTTP response status code.
 *
 * @returns                `true` if request method needs content body.
 */
export function requestNeedsContentBody(request: Request, responseStatus: number): boolean {
	return responseStatus !== 204 && requestHasSupportedMethod(request) && ['OPTIONS', 'HEAD'].indexOf(request.method) === -1;
}

/**
 * Request is coming from an identified user?
 *
 * @param   request HTTP request object.
 *
 * @returns         `true` if request is coming from an identified user.
 */
export function requestIsFromUser(request: Request): boolean {
	return (
		request.headers.has('authorization') ||
		(request.headers.has('cookie') &&
			/(?:^\s*|;\s*)(?:(?:wp|wordpress)[_-](?:logged[_-]in|sec|rec|activate|postpass|woocommerce)|woocommerce|logged[_-]in|comment[_-]author)[_-][^=;]+=\s*"?[^";]/iu.test(
				request.headers.get('cookie') || '',
			))
	);
}

/**
 * Request path is invalid?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request path is invalid.
 */
export function requestPathIsInvalid(request: Request, parsedURL: URL | null = null): boolean {
	parsedURL = parsedURL || $urlꓺparse(request.url);

	if (!parsedURL || !parsedURL.pathname || '/' === parsedURL.pathname) {
		return false; // Not possible, or early return on `/`.
	}
	return /\\|\/{2,}|\.{2,}/u.test(parsedURL.pathname);
}

/**
 * Request path is forbidden?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request path is forbidden.
 */
export function requestPathIsForbidden(request: Request, parsedURL: URL | null = null): boolean {
	parsedURL = parsedURL || $urlꓺparse(request.url);

	if (!parsedURL || !parsedURL.pathname || '/' === parsedURL.pathname) {
		return false; // Not possible, or early return on `/`.
	}
	if (/(?:^|\/)\./u.test(parsedURL.pathname) && !/^\.well-known(?:$|\/)/iu.test(parsedURL.pathname)) {
		return true; // No dotfile paths.
	}
	if (/(?:~|[^/.]\.(?:bak|backup|copy|log|old|te?mp))(?:$|\/)/iu.test(parsedURL.pathname)) {
		return true; // No backups, copies, logs, or temp paths.
	}
	if (/(?:^|\/)(?:[^/]*[._-])?(?:cache|private|logs?|te?mp)(?:$|\/)/iu.test(parsedURL.pathname)) {
		return true; // No cache, private, log, or temp paths.
	}
	if (/(?:^|\/)wp[_-]content\/(?:cache|private|mu[_-]plugins|upgrade|uploads\/(?:wc[_-]logs|woocommerce[_-]uploads|lmfwc[_-]files))(?:$|\/)/iu.test(parsedURL.pathname)) {
		return true; // No WP content paths that are private.
	}
	if (/(?:^|\/)(?:yarn|vendor|node[_-]modules|jspm[_-]packages|bower[_-]components)(?:$|\/)/iu.test(parsedURL.pathname)) {
		return true; // No package management dependencies paths.
	}
	if (/[^/.]\.(?:sh|bash|zsh|php[0-9]?|[ps]html?|aspx?|plx?|cgi|ppl|perl|go|rs|rlib|rb|py|py[icdowz])(?:$|\/)/iu.test(parsedURL.pathname)) {
		return true; // No server-side script extension paths, including `.[ext]/pathinfo` data.
	}
	return false;
}

/**
 * Request path is dynamic?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request is dynamic.
 */
export function requestPathIsDynamic(request: Request, parsedURL: URL | null = null): boolean {
	return requestPathHasDynamicBase(request, parsedURL) || requestPathIsPotentiallyDynamic(request, parsedURL) || !requestPathHasStaticExtension(request, parsedURL);
}

/**
 * Request path is static?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request is static.
 */
export function requestPathIsStatic(request: Request, parsedURL: URL | null = null): boolean {
	return !requestPathIsDynamic(request, parsedURL);
}

/**
 * Request path has a dynamic base?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request path has a dynamic base.
 */
export function requestPathHasDynamicBase(request: Request, parsedURL: URL | null = null): boolean {
	if (!$envꓺisC10N()) {
		return false; // Not applicable.
	}
	parsedURL = parsedURL || $urlꓺparse(request.url);

	if (!parsedURL || !parsedURL.pathname || '/' === parsedURL.pathname) {
		return false; // Not possible, or early return on `/`.
	}
	return /^\/?(api|wp-json|blog|feed|comments|author|discussion|shop|product|cart|checkout|account)(?:$|\/)/iu.test(parsedURL.pathname);
}

/**
 * Request path is potentially dynamic?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request path is potentially dynamic.
 */
export function requestPathIsPotentiallyDynamic(request: Request, parsedURL: URL | null = null): boolean {
	if (!$envꓺisC10N()) {
		return false; // Not applicable.
	}
	parsedURL = parsedURL || $urlꓺparse(request.url);

	if (!parsedURL || !parsedURL.pathname || '/' === parsedURL.pathname) {
		return false; // Not possible, or early return on `/`.
	}
	return /(?:^|\/)(?:robots\.txt|locations\.kml|[^/]*sitemap[^/]*\.(?:xml|xsl))$/iu.test(parsedURL.pathname);
}

/**
 * Request path is an SEO file?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request path is an SEO file.
 */
export function requestPathIsSEORelatedFile(request: Request, parsedURL: URL | null = null): boolean {
	parsedURL = parsedURL || $urlꓺparse(request.url);

	if (!parsedURL || !parsedURL.pathname || '/' === parsedURL.pathname) {
		return false; // Not possible, or early return on `/`.
	}
	return /(?:^|\/)(?:favicon\.ico|robots\.txt|locations\.kml|[^/]*sitemap[^/]*\.(?:xml|xsl))$/iu.test(parsedURL.pathname);
}

/**
 * Request path is in `/(?:wp-)?admin`?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns           `true` if request path is in `/(?:wp-)?admin`.
 */
export function requestPathIsInAdmin(request: Request, parsedURL: URL | null = null): boolean {
	parsedURL = parsedURL || $urlꓺparse(request.url);

	if (!parsedURL || !parsedURL.pathname || '/' === parsedURL.pathname) {
		return false; // Not possible, or early return on `/`.
	}
	return /(?:^|\/)(?:wp-)?admin(?:$|\/)/iu.test(parsedURL.pathname) && !/(?:^|\/)wp-admin\/admin-ajax\.php$/iu.test(parsedURL.pathname);
}

/**
 * Request path has a static file extension?
 *
 * @param   request   HTTP request object.
 * @param   parsedURL Optional pre-parsed URL. Default is taken from `request`.
 * @param   exts      Specific extension to look for?
 *
 * @returns           `true` if request path has a static file extension.
 */
export function requestPathHasStaticExtension(request: Request, parsedURL: URL | null = null, exts?: Array<string> | RegExp): boolean {
	parsedURL = parsedURL || $urlꓺparse(request.url);

	if (!parsedURL || !parsedURL.pathname || '/' === parsedURL.pathname) {
		return false; // Not possible, or early return on `/`.
	}
	if (exts instanceof RegExp) {
		return /[^/.]\.[^/.]+$/u.test(parsedURL.pathname) && exts.test(parsedURL.pathname);
	}
	if (exts instanceof Array && exts.length) {
		return /[^/.]\.[^/.]+$/u.test(parsedURL.pathname) && new RegExp('[^/.]\\.(?:' + exts.map((v) => $strꓺescRegExp(v)).join('|') + ')$', 'ui').test(parsedURL.pathname);
	}
	return (
		/[^/.]\.[^/.]+$/u.test(parsedURL.pathname) &&
		/[^/.]\.(?:3g2|3gp|3gp2|3gpp|7z|aac|ai|apng|app|asc|asf|asx|atom|avi|bash|bat|bin|blend|bmp|c|cc|cfg|cjs|class|com|conf|css|csv|cts|dfxp|divx|dll|dmg|doc|docm|docx|dotm|dotx|dtd|ejs|eot|eps|ets|exe|fla|flac|flv|gif|gtar|gz|gzip|h|heic|hta|htaccess|htc|htm|html|htpasswd|ico|ics|ini|iso|jar|jpe|jpeg|jpg|js|json|json5|jsonld|jsx|key|kml|kmz|log|m4a|m4b|m4v|md|mdb|mid|midi|mjs|mka|mkv|mo|mov|mp3|mp4|mpe|mpeg|mpg|mpp|mts|numbers|odb|odc|odf|odg|odp|ods|odt|oga|ogg|ogv|onepkg|onetmp|onetoc|onetoc2|otf|oxps|pages|pdf|phar|phps|pict|pls|png|po|pot|potm|potx|ppam|pps|ppsm|ppsx|ppt|pptm|pptx|ps|psd|pspimage|qt|ra|ram|rar|rdf|rss|rss-http|rss2|rtf|rtx|scss|sh|sketch|sldm|sldx|so|sql|sqlite|srt|svg|svgz|swf|tar|tgz|tif|tiff|tmpl|toml|tpl|ts|tsv|tsx|ttf|txt|vtt|wav|wax|webm|webp|wm|wma|wmv|wmx|woff|woff2|wp|wpd|wri|xcf|xhtm|xhtml|xla|xlam|xls|xlsb|xlsm|xlsx|xlt|xltm|xltx|xlw|xml|xps|xsd|xsl|xslt|yaml|yml|zip|zsh)$/iu.test(
			parsedURL.pathname,
		)
	);
}

/**
 * Extracts headers into object properties.
 *
 * @param   headers Headers.
 *
 * @returns         Own enumerable string-keyed properties.
 */
export function extractHeaders(headers: Headers | { [x: string]: string }): { [x: string]: string } {
	return Object.fromEntries(Object.entries(headers));
}

/**
 * Supported HTTP request methods.
 */
export const supportedRequestMethods: Array<string> = ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * HTTP request header names.
 */
export const requestHeaderNames: Array<string> = [
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
 */
export const responseHeaderNames: Array<string> = [
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
 */
export const responseStatusCodes: { [x: string]: string } = {
	'100': 'Continue',
	'101': 'Switching Protocols',
	'102': 'Processing',
	'103': 'Early Hints',

	'200': 'OK',
	'201': 'Created',
	'202': 'Accepted',
	'203': 'Non-Authoritative Information',
	'204': 'No Content',
	'205': 'Reset Content',
	'206': 'Partial Content',
	'207': 'Multi-Status',
	'226': 'IM Used',

	'300': 'Multiple Choices',
	'301': 'Moved Permanently',
	'302': 'Found',
	'303': 'See Other',
	'304': 'Not Modified',
	'305': 'Use Proxy',
	'306': 'Reserved',
	'307': 'Temporary Redirect',
	'308': 'Permanent Redirect',

	'400': 'Bad Request',
	'401': 'Unauthorized',
	'402': 'Payment Required',
	'403': 'Forbidden',
	'404': 'Not Found',
	'405': 'Method Not Allowed',
	'406': 'Not Acceptable',
	'407': 'Proxy Authentication Required',
	'408': 'Request Timeout',
	'409': 'Conflict',
	'410': 'Gone',
	'411': 'Length Required',
	'412': 'Precondition Failed',
	'413': 'Request Entity Too Large',
	'414': 'Request-URI Too Long',
	'415': 'Unsupported Media Type',
	'416': 'Requested Range Not Satisfiable',
	'417': 'Expectation Failed',
	'418': "I'm a teapot",
	'421': 'Misdirected Request',
	'422': 'Unprocessable Entity',
	'423': 'Locked',
	'424': 'Failed Dependency',
	'426': 'Upgrade Required',
	'428': 'Precondition Required',
	'429': 'Too Many Requests',
	'431': 'Request Header Fields Too Large',
	'451': 'Unavailable For Legal Reasons',

	'500': 'Internal Server Error',
	'501': 'Not Implemented',
	'502': 'Bad Gateway',
	'503': 'Service Unavailable',
	'504': 'Gateway Timeout',
	'505': 'HTTP Version Not Supported',
	'506': 'Variant Also Negotiates',
	'507': 'Insufficient Storage',
	'510': 'Not Extended',
	'511': 'Network Authentication Required',
};
