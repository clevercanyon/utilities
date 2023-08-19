/**
 * HTTP utilities.
 */

import {
	array as $isꓺarray, //
	regExp as $isꓺregExp,
} from './is.js';

import {
	isCFW as $envꓺisCFW, //
	isC10n as $envꓺisC10n,
} from './env.js';

import {
	hasExt as $pathꓺhasExt, //
	hasStaticExt as $pathꓺhasStaticExt,
} from './path.js';

import {
	parse as $urlꓺparse, //
	removeCSOQueryVars as $urlꓺremoveCSOQueryVars,
} from './url.js';

import {
	dedent as $strꓺdedent, //
	escRegExp as $strꓺescRegExp,
} from './str.js';

import {
	svz as $moizeꓺsvz, //
	deep as $moizeꓺdeep,
} from './moize.js';

import { defaults as $objꓺdefaults } from './obj.js';

/**
 * Defines types.
 */
export type RequestConfig = {
	// For future review.
};
export type ResponseConfig = {
	response?: Response;
	status?: number;
	body?: BodyInit | null;
	headers?: Headers | { [x: string]: string };
	appendHeaders?: Headers | { [x: string]: string };
	enableCORs?: boolean;
	enableCDN?: boolean;
};
export type ExtractHeaderOptions = { lowercase?: boolean };
export type CFPHeaderOptions = { appType: string; isC10n?: boolean };

/**
 * HTTP request config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP request config.
 */
export const requestConfig = (config?: RequestConfig): RequestConfig => {
	return $objꓺdefaults({}, config || {}, {}) as Required<RequestConfig>;
};

/**
 * HTTP response config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP response config.
 */
export const responseConfig = (config?: ResponseConfig): Required<ResponseConfig> => {
	return $objꓺdefaults({}, config || {}, {
		response: null,
		status: 500,
		body: null,
		headers: {},
		appendHeaders: {},
		enableCORs: false,
		enableCDN: !$envꓺisCFW(),
	}) as Required<ResponseConfig>;
};

/**
 * Prepares an HTTP request.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP request.
 *
 * @throws          Error {@see Response} on failure.
 */
export const prepareRequest = (request: Request, config?: RequestConfig): Request => {
	const unusedꓺcfg = requestConfig(config);

	// Removes client-side-only query string variables.
	const url = $urlꓺparse($urlꓺremoveCSOQueryVars(request.url), undefined, { throwOnError: false });

	if (!url /* Catches unparseable URLs. */) {
		throw prepareResponse(request, { status: 400 });
	}
	if (requestPathIsInvalid(request, url)) {
		throw prepareResponse(request, { status: 400 });
	}
	if (requestPathIsForbidden(request, url)) {
		throw prepareResponse(request, { status: 403 });
	}
	if (!requestHasSupportedMethod(request)) {
		throw prepareResponse(request, { status: 405 });
	}
	const requestHasOrigin = request.headers.has('origin');
	const requestIsUserDynamic = requestIsFromUser(request) && requestPathIsDynamic(request, url);

	if (requestHasOrigin) {
		const _ck = url.searchParams.get('_ck') || '';
		url.searchParams.set('_ck', (_ck ? _ck + ';' : '') + 'origin:' + (request.headers.get('origin') || ''));
	}
	if (requestIsUserDynamic) {
		const _ck = url.searchParams.get('_ck') || '';
		url.searchParams.set('_ck', (_ck ? _ck + ';' : '') + 'user-dynamic:true');
	}
	url.searchParams.sort(); // Query sort optimizes cache.

	return new Request(url.toString(), request);
};

/**
 * Prepares an HTTP response.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP response.
 */
export const prepareResponse = (request: Request, config?: ResponseConfig): Response => {
	const cfg = responseConfig(config);
	cfg.status = cfg.status || 500;

	if (cfg.response) {
		cfg.status = cfg.response.status;
		cfg.body = cfg.response.body;

		prepareResponseHeaders(request, cfg);
		return cfg.response; // Configured response.
	}
	if (cfg.enableCORs && 'OPTIONS' === request.method) {
		cfg.status = 204; // No content for CORs preflight requests.
	}
	return new Response(requestNeedsContentBody(request, cfg.status) ? cfg.body : null, {
		status: cfg.status,
		statusText: responseStatusText(cfg.status),
		headers: prepareResponseHeaders(request, cfg),
	});
};

/**
 * Prepares HTTP response headers.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP response headers.
 */
export const prepareResponseHeaders = (request: Request, config?: ResponseConfig): Headers => {
	const cfg = responseConfig(config);
	cfg.status = cfg.status || 500;

	const url = $urlꓺparse(request.url); // Throws on failure.

	cfg.headers = cfg.headers instanceof Headers ? cfg.headers : new Headers(cfg.headers || {});
	cfg.appendHeaders = cfg.appendHeaders instanceof Headers ? cfg.appendHeaders : new Headers(cfg.appendHeaders || {});

	let existingHeaders: { [x: string]: string } = {};

	const alwaysOnHeaders: { [x: string]: string } = {};
	const cacheHeaders: { [x: string]: string } = {};

	let securityHeaders: { [x: string]: string } = {};
	let corsHeaders: { [x: string]: string } = {};

	// Existing response headers.

	if (cfg.response /* Extracts existing headers. */) {
		existingHeaders = extractHeaders(cfg.response.headers);
	}
	// Always-on headers.

	alwaysOnHeaders['date'] = new Date().toUTCString();

	if (503 === cfg.status) {
		alwaysOnHeaders['retry-after'] = '300';
	}
	// Cache control and related headers.

	cacheHeaders['vary'] = 'origin, accept, accept-language, accept-encoding';

	if (!requestHasCacheableMethod(request) || cfg.status >= 300) {
		cacheHeaders['cdn-cache-control'] = 'no-store';
		cacheHeaders['cache-control'] = 'no-store';
		//
	} else if (requestPathIsSEORelatedFile(request, url)) {
		cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=86400, stale-while-revalidate=86400, stale-if-error=86400';
		cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400';
		//
	} else if (requestPathIsStatic(request, url) && (cfg.response?.headers.has('etag') || cfg.headers.has('etag'))) {
		cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=31536000, stale-while-revalidate=604800, stale-if-error=604800';
		cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800, stale-if-error=604800';
		//
	} else if (requestPathIsInAdmin(request, url) || requestIsFromUser(request)) {
		cacheHeaders['cdn-cache-control'] = 'no-store';
		cacheHeaders['cache-control'] = 'no-store';
		//
	} else {
		cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=41400, stale-while-revalidate=1800, stale-if-error=1800';
		cacheHeaders['cache-control'] = 'no-store';
	}
	if (!cfg.enableCDN || cfg.headers.has('cache-control')) {
		delete existingHeaders['cdn-cache-control'];
		delete cacheHeaders['cdn-cache-control'];
	}
	// Security-related headers.

	if ($envꓺisC10n()) {
		securityHeaders = { ...c10nSecurityHeaders };
	} else {
		securityHeaders = { ...defaultSecurityHeaders };
	}
	// CORs-related headers.

	if (cfg.enableCORs) {
		corsHeaders = {
			'access-control-max-age': '7200',
			'access-control-allow-credentials': 'true',
			'access-control-allow-methods': supportedRequestMethods.join(', '),
			'access-control-allow-headers': requestHeaderNames.join(', '),
			'access-control-expose-headers': responseHeaderNames.join(', '),
			'timing-allow-origin': request.headers.has('origin') ? request.headers.get('origin') || '' : '*',
			'access-control-allow-origin': request.headers.has('origin') ? request.headers.get('origin') || '' : '*',
		};
	} else if (requestPathHasStaticExtension(request, url, /[^/.]\.(?:eot|otf|ttf|woff)[0-9]*$/iu)) {
		corsHeaders = {
			'access-control-allow-origin': request.headers.has('origin') ? request.headers.get('origin') || '' : '*',
		};
	}
	// Return all headers.

	const headers = new Headers({
		...existingHeaders,
		...alwaysOnHeaders,
		...cacheHeaders,
		...securityHeaders,
		...corsHeaders,
	});
	cfg.headers.forEach((value, name) => headers.set(name, value));
	cfg.appendHeaders.forEach((value, name) => headers.append(name, value));

	if (cfg.response) {
		for (const name of Object.keys(extractHeaders(cfg.response.headers))) {
			cfg.response.headers.delete(name); // Clean slate.
		}
		headers.forEach((value, name) => cfg.response?.headers.set(name, value));
	}
	return headers;
};

/**
 * Prepares default headers for a Cloudflare Pages site.
 *
 * @param   appType Application type; e.g., `spa`, `mpa`.
 *
 * @returns         Default headers for a Cloudflare Pages site.
 */
export const prepareCFPDefaultHeaders = $moizeꓺdeep({ maxSize: 2 })(
	// Memoized function.
	(options: CFPHeaderOptions): string => {
		const opts = $objꓺdefaults({}, options, { appType: '', isC10n: false }) as Required<CFPHeaderOptions>;

		if (!['spa', 'mpa'].includes(opts.appType)) {
			return ''; // Not applicable.
		}
		let securityHeaders = ''; // Initializes security headers.

		for (const [name, value] of Object.entries(opts.isC10n ? c10nSecurityHeaders : defaultSecurityHeaders)) {
			securityHeaders += (securityHeaders ? '\n  ' : '') + name + ': ' + value;
		}
		return $strꓺdedent(`
			/*
			  ${securityHeaders}
			  vary: origin, accept, accept-language, accept-encoding

			/assets/*
			  access-control-allow-origin: *
			  cache-control: public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800, stale-if-error=604800

			/sitemaps/*.xml
			  access-control-allow-origin: *
			  cache-control: public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400

			/robots.txt
			  access-control-allow-origin: *
			  cache-control: public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400

			/sitemap.xml
			  access-control-allow-origin: *
			  cache-control: public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400

			https://*.pages.dev/*
			  x-robots-tag: noindex, nofollow
		`);
	},
);

/**
 * Get HTTP response status text.
 *
 * @param   status HTTP status code.
 *
 * @returns        HTTP response status text.
 */
export const responseStatusText = $moizeꓺsvz({ maxSize: 12 })(
	// Memoized function.
	(status: string | number): string => {
		return responseStatusCodes[String(status)] || '';
	},
);

/**
 * Request has a supported method?
 *
 * @param   request HTTP request object.
 *
 * @returns         True if request has a supported method.
 */
export const requestHasSupportedMethod = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request): boolean => {
		return supportedRequestMethods.includes(request.method);
	},
);

/**
 * Request has a cacheable request method?
 *
 * @param   request HTTP request object.
 *
 * @returns         True if request has a cacheable request method.
 */
export const requestHasCacheableMethod = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request): boolean => {
		return requestHasSupportedMethod(request) && ['HEAD', 'GET'].includes(request.method);
	},
);

/**
 * Request method needs content headers?
 *
 * @param   request        HTTP request object.
 * @param   responseStatus HTTP response status code.
 *
 * @returns                True if request method needs content headers.
 */
export const requestNeedsContentHeaders = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, responseStatus: number): boolean => {
		return responseStatus !== 204 && requestHasSupportedMethod(request) && !['OPTIONS'].includes(request.method);
	},
);

/**
 * Request method needs content body?
 *
 * @param   request        HTTP request object.
 * @param   responseStatus HTTP response status code.
 *
 * @returns                True if request method needs content body.
 */
export const requestNeedsContentBody = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, responseStatus: number): boolean => {
		return responseStatus !== 204 && requestHasSupportedMethod(request) && !['OPTIONS', 'HEAD'].includes(request.method);
	},
);

/**
 * Request is coming from an identified user?
 *
 * @param   request HTTP request object.
 *
 * @returns         True if request is coming from an identified user.
 */
export const requestIsFromUser = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request): boolean => {
		return (
			request.headers.has('authorization') ||
			(request.headers.has('cookie') &&
				/(?:^\s*|;\s*)(?:(?:wp|wordpress)[_-](?:logged[_-]in|sec|rec|activate|postpass|woocommerce)|woocommerce|logged[_-]in|user|(?:comment[_-])?author)[_-][^=;]+=\s*"?[^";]/iu.test(
					request.headers.get('cookie') || '',
				))
		);
	},
);

/**
 * Request path is invalid?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is invalid.
 */
export const requestPathIsInvalid = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		url = url || $urlꓺparse(request.url);

		if (!url || !url.pathname || '/' === url.pathname) {
			return false; // Not possible, or early return on `/`.
		}
		return /\\|\/{2,}|\.{2,}/iu.test(url.pathname);
	},
);

/**
 * Request path is forbidden?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is forbidden.
 */
export const requestPathIsForbidden = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		url = url || $urlꓺparse(request.url);

		if (!url || !url.pathname || '/' === url.pathname) {
			return false; // Not possible, or early return on `/`.
		}
		if (/(?:^|\/)\./iu.test(url.pathname) && !/^\/\.well-known(?:$|\/)/iu.test(url.pathname)) {
			return true; // No dotfile paths.
		}
		if (/(?:~|[^/.]\.(?:bak|backup|copy|log|old|te?mp))(?:$|\/)/iu.test(url.pathname)) {
			return true; // No backups, copies, logs, or temp paths.
		}
		if (/(?:^|\/)(?:[^/]*[._-])?(?:cache|private|logs?|te?mp)(?:$|\/)/iu.test(url.pathname)) {
			return true; // No cache, private, log, or temp paths.
		}
		if (/(?:^|\/)wp[_-]content\/(?:cache|private|mu[_-]plugins|upgrade|uploads\/(?:wc[_-]logs|woocommerce[_-]uploads|lmfwc[_-]files))(?:$|\/)/iu.test(url.pathname)) {
			return true; // No WP content paths that are private.
		}
		if (/(?:^|\/)(?:yarn|vendor|node[_-]modules|jspm[_-]packages|bower[_-]components)(?:$|\/)/iu.test(url.pathname)) {
			return true; // No package management dependencies paths.
		}
		if (/[^/.]\.(?:sh|bash|zsh|php[0-9]?|[ps]html?|aspx?|plx?|cgi|ppl|perl|go|rs|rlib|rb|py|py[icdowz])(?:$|\/)/iu.test(url.pathname)) {
			return true; // No server-side script extension paths, including `.[ext]/pathinfo` data.
		}
		return false;
	},
);

/**
 * Request path is dynamic?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request is dynamic.
 */
export const requestPathIsDynamic = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		return (
			requestPathHasDynamicBase(request, url) || //
			requestPathIsPotentiallyDynamic(request, url) ||
			!requestPathHasStaticExtension(request, url)
		);
	},
);

/**
 * Request path is static?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request is static.
 */
export const requestPathIsStatic = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		return !requestPathIsDynamic(request, url);
	},
);

/**
 * Request path has a dynamic base?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path has a dynamic base.
 */
export const requestPathHasDynamicBase = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		if (!$envꓺisC10n()) {
			return false; // Not applicable.
		}
		url = url || $urlꓺparse(request.url);

		if (!url || !url.pathname || '/' === url.pathname) {
			return false; // Not possible, or early return on `/`.
		}
		return /^\/?(api|wp-json|blog|feed|comments|author|discussion|shop|product|cart|checkout|account)(?:$|\/)/iu.test(url.pathname);
	},
);

/**
 * Request path is potentially dynamic?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is potentially dynamic.
 */
export const requestPathIsPotentiallyDynamic = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		if (!$envꓺisC10n()) {
			return false; // Not applicable.
		}
		url = url || $urlꓺparse(request.url);

		if (!url || !url.pathname || '/' === url.pathname) {
			return false; // Not possible, or early return on `/`.
		}
		return /(?:^|\/)(?:robots\.txt|[^/]*sitemap[^/]*\.xml)$/iu.test(url.pathname);
	},
);

/**
 * Request path is an SEO file?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is an SEO file.
 */
export const requestPathIsSEORelatedFile = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		url = url || $urlꓺparse(request.url);

		if (!url || !url.pathname || '/' === url.pathname) {
			return false; // Not possible, or early return on `/`.
		}
		return /(?:^|\/)(?:favicon\.ico|robots\.txt|[^/]*sitemap[^/]*\.xml)$/iu.test(url.pathname);
	},
);

/**
 * Request path is in `/(?:wp-)?admin`?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is in `/(?:wp-)?admin`.
 */
export const requestPathIsInAdmin = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL): boolean => {
		url = url || $urlꓺparse(request.url);

		if (!url || !url.pathname || '/' === url.pathname) {
			return false; // Not possible, or early return on `/`.
		}
		return /(?:^|\/)(?:wp[_-])?admin(?:$|\/)/iu.test(url.pathname) && !/(?:^|\/)wp[_-]admin\/admin[_-]ajax\.php$/iu.test(url.pathname);
	},
);

/**
 * Request path has a static file extension?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 * @param   exts    Optional, if there are specific static file extension(s) to look for.
 *
 * @returns         True if request path has a static file extension.
 */
export const requestPathHasStaticExtension = $moizeꓺsvz({ maxSize: 2 })(
	// Memoized function.
	(request: Request, url?: URL, exts?: string[] | RegExp): boolean => {
		url = url || $urlꓺparse(request.url);

		if (!url || !url.pathname || '/' === url.pathname) {
			return false; // Not possible, or early return on `/`.
		}
		if ($isꓺregExp(exts)) {
			return $pathꓺhasExt(url.pathname) && exts.test(url.pathname);
		}
		if ($isꓺarray(exts) && exts.length) {
			return $pathꓺhasExt(url.pathname) && new RegExp('[^/.]\\.(?:' + exts.map($strꓺescRegExp).join('|') + ')$', 'ui').test(url.pathname);
		}
		return $pathꓺhasExt(url.pathname) && $pathꓺhasStaticExt(url.pathname);
	},
);

/**
 * Extracts headers, returning a plain object.
 *
 * @param   headers Headers.
 * @param   options Default is `{ lowercase: true }`.
 *
 *   - Note that a {@see Headers} object always contains lowercase keys. Therefore, this option is only applicable when a
 *       string-keyed object is passed; i.e., if {@see Headers} are passed, this will always return lowercase keys.
 *
 * @returns         Extracted headers, as a plain object.
 */
export const extractHeaders = (headers: Headers | { [x: string]: string }, options?: ExtractHeaderOptions): { [x: string]: string } => {
	const plainObjHeaders: { [x: string]: string } = {};
	const opts = $objꓺdefaults({}, options || {}, { lowercase: true }) as Required<ExtractHeaderOptions>;

	if (headers instanceof Headers) {
		headers.forEach((value, name) => {
			plainObjHeaders[opts.lowercase ? name.toLowerCase() : name] = value;
		});
	} else {
		for (const [name, value] of Object.entries(headers)) {
			plainObjHeaders[opts.lowercase ? name.toLowerCase() : name] = value;
		}
	}
	return plainObjHeaders;
};

/**
 * Supported HTTP request methods.
 */
export const supportedRequestMethods: string[] = ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * HTTP request header names.
 */
export const requestHeaderNames: string[] = [
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
export const responseHeaderNames: string[] = [
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

/**
 * C10n security headers.
 */
const c10nSecurityHeaders: { [x: string]: string } = {
	'x-frame-options': 'SAMEORIGIN',
	'x-content-type-options': 'nosniff',
	'cross-origin-embedder-policy': 'unsafe-none',
	'cross-origin-opener-policy': 'same-origin',
	'cross-origin-resource-policy': 'same-origin',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'strict-transport-security': 'max-age=15552000; includeSubDomains; preload',
	'content-security-policy':
		'report-uri https://clevercanyon.report-uri.com/r/d/csp/enforce; report-to csp; upgrade-insecure-requests;' +
		" base-uri 'self'; frame-ancestors 'self'; default-src * data: blob: mediastream: 'report-sample'; style-src * data: blob: 'unsafe-inline' 'report-sample';" +
		" object-src 'none'; script-src blob: 'self' 'unsafe-inline' 'unsafe-eval' 'report-sample' *.clevercanyon.com *.hop.gdn *.cloudflare.com *.stripe.com" +
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

/**
 * Default security headers.
 */
const defaultSecurityHeaders: { [x: string]: string } = {
	'x-frame-options': 'SAMEORIGIN',
	'x-content-type-options': 'nosniff',
	'cross-origin-embedder-policy': 'unsafe-none',
	'cross-origin-opener-policy': 'same-origin',
	'cross-origin-resource-policy': 'same-origin',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'content-security-policy':
		"base-uri 'self'; frame-ancestors 'self'; default-src * data: blob: mediastream: 'report-sample'; style-src * data: blob: 'unsafe-inline' 'report-sample';" +
		" object-src 'none'; script-src blob: 'self' 'unsafe-inline' 'unsafe-eval' 'report-sample' *.clevercanyon.com *.hop.gdn *.cloudflare.com *.stripe.com" +
		' *.cloudflareinsights.com *.google.com *.googletagmanager.com *.google-analytics.com *.googleadservices.com googleads.g.doubleclick.net *.cookie-script.com;',
	'permissions-policy':
		'accelerometer=(self), ambient-light-sensor=(self), autoplay=(self), battery=(self), camera=(self), clipboard-read=(self), clipboard-write=(self), conversion-measurement=(self),' +
		' cross-origin-isolated=(self), display-capture=(self), document-domain=(self), encrypted-media=(self), execution-while-not-rendered=(self), execution-while-out-of-viewport=(self),' +
		' focus-without-user-activation=(self), fullscreen=(self), gamepad=(self), geolocation=(self), gyroscope=(self), hid=(self), idle-detection=(self), interest-cohort=(self),' +
		' keyboard-map=(self), magnetometer=(self), microphone=(self), midi=(self), navigation-override=(self), payment=(self "https://js.stripe.com" "https://pay.google.com"),' +
		' picture-in-picture=(self), publickey-credentials-get=(self), screen-wake-lock=(self), serial=(self), speaker-selection=(self), sync-script=(self), sync-xhr=(self),' +
		' trust-token-redemption=(self), usb=(self), vertical-scroll=(self), web-share=(self), window-placement=(self), xr-spatial-tracking=(self)',
};
