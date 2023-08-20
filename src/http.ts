/**
 * HTTP utilities.
 */

import {
	nul as $isꓺnul, //
	blob as $isꓺblob,
	array as $isꓺarray,
	string as $isꓺstring,
	regExp as $isꓺregExp,
	integer as $isꓺinteger,
	dataView as $isꓺdataView,
	typedArray as $isꓺtypedArray,
	arrayBuffer as $isꓺarrayBuffer,
} from './is.js';

import {
	escRegExp as $strꓺescRegExp, //
	byteLength as $strꓺbyteLength,
} from './str.js';

import {
	hasExt as $pathꓺhasExt, //
	hasStaticExt as $pathꓺhasStaticExt,
} from './path.js';

import {
	parse as $urlꓺparse, //
	removeCSOQueryVars as $urlꓺremoveCSOQueryVars,
} from './url.js';

import { svz as $moizeꓺsvz } from './moize.js';
import { isC10n as $envꓺisC10n } from './env.js';
import { defaults as $objꓺdefaults } from './obj.js';
import type * as cfw from '@cloudflare/workers-types/experimental';

/**
 * Defines types.
 */
export type RequestConfig = {
	enableRewrites?: boolean;
};
export type ResponseConfig = {
	status?: number; // HTTP response code.
	enableCORs?: boolean; // Enables CORs headers.
	enableCDN?: boolean; // Enables CDN cache headers.
	maxAge?: number | null; // Simplified cache directive.
	cdnMaxAge?: number | null; // Simplified CDN cache directive.
	headers?: Headers | cfw.Headers | { [x: string]: string };
	appendHeaders?: Headers | cfw.Headers | { [x: string]: string };
	body?: BodyInit | cfw.BodyInit | null;
};
export type ExtractHeaderOptions = { lowercase?: boolean };

/**
 * HTTP request config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP request config.
 */
export const requestConfig = (config?: RequestConfig): RequestConfig => {
	return $objꓺdefaults({}, config || {}, {
		enableRewrites: false,
	}) as Required<RequestConfig>;
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
		status: 405,
		enableCORs: false,
		enableCDN: true,
		maxAge: null,
		cdnMaxAge: null,
		headers: {},
		appendHeaders: {},
		body: null,
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
export const prepareRequest = (request: Request | cfw.Request, config?: RequestConfig): Request | cfw.Request => {
	const cfg = requestConfig(config); // Prepares config object values.
	let url = $urlꓺparse(request.url, undefined, { throwOnError: false });

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
	if (cfg.enableRewrites && !request.headers.has('x-rewrite-url') /* e.g., Cloudflare middleware. */) {
		const originalURL = url; // For comparison w/ headers added below.

		url = $urlꓺremoveCSOQueryVars(originalURL); // Removes (client|cache)-side-only query vars.
		url = $urlꓺparse(url, undefined, { throwOnError: false }); // Errors caught below.

		if (!url /* Catches unparseable URLs. */) {
			throw prepareResponse(request, { status: 400 });
		}
		url.searchParams.sort(); // Sorting query vars optimizes some cache layers.

		if (url.toString() !== originalURL.toString()) {
			request.headers.set('x-rewrite-url', url.toString());
			request.headers.set('x-original-url', originalURL.toString());
			request = new Request(url.toString(), request as Request);
		}
	}
	return request; // Potentially a rewritten request now.
};

/**
 * Prepares an HTTP response.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP response.
 */
export const prepareResponse = (request: Request | cfw.Request, config?: ResponseConfig): Response | cfw.Response => {
	const cfg = responseConfig(config); // Prepares config object values.
	const url = $urlꓺparse(request.url, undefined, { throwOnError: false });

	if (!url /* Catches unparseable URLs. */) {
		cfg.status = 400; // Bad request status.
		cfg.body = responseStatusText(cfg.status);
		cfg.body = requestNeedsContentBody(request, cfg.status) ? cfg.body : null;

		return new Response(cfg.body, {
			status: cfg.status,
			statusText: responseStatusText(cfg.status),
			headers: prepareResponseHeaders(request, new URL('http://x'), cfg),
		});
	}
	// The case of `405` (default status) is in conflict with CORs being enabled; i.e., `OPTIONS` method is ok.
	// This approach makes implementation simpler since we consolidate the handling of `OPTIONS` into the `enableCORs` flag.

	if (cfg.enableCORs && 'OPTIONS' === request.method && (!cfg.status || 405 === cfg.status)) {
		cfg.status = 204; // No content for CORs preflight requests.
	}
	cfg.status = cfg.status || 500; // If no status by now, we have an internal server error.
	cfg.body = requestNeedsContentBody(request, cfg.status) ? cfg.body : null;

	return new Response(cfg.body as BodyInit | null, {
		status: cfg.status,
		statusText: responseStatusText(cfg.status),
		headers: prepareResponseHeaders(request, url, cfg),
	});
};

/**
 * Prepares HTTP response headers.
 *
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP response headers.
 *
 * @note Private function. Intentionally *not* exporting.
 */
const prepareResponseHeaders = (request: Request | cfw.Request, url: URL | cfw.URL, cfg: Required<ResponseConfig>): Headers | cfw.Headers => {
	// Initializes grouped header objects.

	const alwaysOnHeaders: { [x: string]: string } = {};
	const contentHeaders: { [x: string]: string } = {};
	const cacheHeaders: { [x: string]: string } = {};
	const securityHeaders: { [x: string]: string } = {};
	const corsHeaders: { [x: string]: string } = {};

	// Enforces `Headers` object type on headers given by config.

	cfg.headers = cfg.headers instanceof Headers ? cfg.headers : new Headers(cfg.headers || {});
	cfg.appendHeaders = cfg.appendHeaders instanceof Headers ? cfg.appendHeaders : new Headers(cfg.appendHeaders || {});

	// Populates always-on headers.

	alwaysOnHeaders['date'] = new Date().toUTCString();

	if (503 === cfg.status) {
		alwaysOnHeaders['retry-after'] = '300';
	}
	// Populates content-related headers.

	if (!cfg.headers.has('content-length') /* Save time when we already have `content-length`. */) {
		if (requestNeedsContentHeaders(request, cfg.status) && !$isꓺnul(cfg.body)) {
			if ($isꓺstring(cfg.body)) {
				contentHeaders['content-length'] = String($strꓺbyteLength(cfg.body));
				//
			} else if ($isꓺblob(cfg.body)) {
				contentHeaders['content-length'] = String(cfg.body.size);
				//
			} else if ($isꓺtypedArray(cfg.body) || $isꓺarrayBuffer(cfg.body) || $isꓺdataView(cfg.body)) {
				contentHeaders['content-length'] = String(cfg.body.byteLength);
				//
			} else if (cfg.body instanceof URLSearchParams) {
				contentHeaders['content-length'] = String($strꓺbyteLength(cfg.body.toString()));
			} else {
				// We don't set content-length for `FormData|ReadableStream` body format types.
				// Don't use `FormData` sent as `application/x-www-form-urlencoded`. Use `URLSearchParams` or a string.
			}
		}
	}
	// Populates `cache-control` and cache-related headers.

	// Vary is ignored by Cloudflare, except in one rare case: <https://o5p.me/k4Xx0j>.
	// Vary is *not* ignored by browsers, but since it *is* ignored by Cloudflare, if a browser requests the same location
	// with one of the following headers, and that location is being cached by Cloudflare, they'll always get the same response.
	// Note that `origin` is always varied at the edge by Cloudflare; i.e., unless explicitly configured to exclude `origin`.

	cacheHeaders['vary'] = 'origin, accept, accept-language, accept-encoding';

	if (!cfg.headers.has('cache-control') /* Save time when we already have `cache-control`. */) {
		if (!requestHasCacheableMethod(request) || cfg.status >= 300) {
			cacheHeaders['cache-control'] = 'no-store';
			cacheHeaders['cdn-cache-control'] = 'no-store';
			//
		} else if (requestPathIsSEORelatedFile(request, url)) {
			cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400';
			cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=86400, stale-while-revalidate=86400, stale-if-error=86400';
			//
		} else if (requestPathIsStatic(request, url) && cfg.headers.has('etag')) {
			cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=604800, stale-if-error=604800';
			cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=31536000, stale-while-revalidate=604800, stale-if-error=604800';
			//
		} else if (requestPathIsInAdmin(request, url) || requestIsFromUser(request)) {
			cacheHeaders['cache-control'] = 'no-store';
			cacheHeaders['cdn-cache-control'] = 'no-store';
			//
		} else {
			cacheHeaders['cache-control'] = 'no-store';
			cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=41400, stale-while-revalidate=1800, stale-if-error=1800';
		}
		if ($isꓺinteger(cfg.maxAge) /* Simplified method of passing a `cache-control` header. */) {
			if (cfg.maxAge <= 0) {
				cacheHeaders['cache-control'] = 'no-store';
				cacheHeaders['cdn-cache-control'] = 'no-store';
			} else {
				const staleAge = cfg.maxAge >= 86400 ? 86400 : cfg.maxAge;
				cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=' + String(cfg.maxAge) + ', s-maxage=' + String(cfg.maxAge) + ', stale-while-revalidate=' + String(staleAge) + ', stale-if-error=' + String(staleAge); // prettier-ignore
				cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=' + String(cfg.maxAge) + ', stale-while-revalidate=' + String(staleAge) + ', stale-if-error=' + String(staleAge); // prettier-ignore
			}
		}
		if (cfg.enableCDN && $isꓺinteger(cfg.cdnMaxAge) /* Simplified method of passing a `cdn-cache-control` header. */) {
			if (cfg.cdnMaxAge <= 0) {
				cacheHeaders['cdn-cache-control'] = 'no-store';
			} else {
				const staleAge = cfg.cdnMaxAge >= 86400 ? 86400 : cfg.cdnMaxAge;
				cacheHeaders['cdn-cache-control'] = 'public, must-revalidate, max-age=' + String(cfg.cdnMaxAge) + ', stale-while-revalidate=' + String(staleAge) + ', stale-if-error=' + String(staleAge); // prettier-ignore
			}
		}
		if (!cfg.enableCDN) delete cacheHeaders['cdn-cache-control']; // Ditch this header from above.
	}
	// Populates security-related headers.

	if ($envꓺisC10n()) {
		for (const [name, value] of Object.entries(c10nSecurityHeaders)) securityHeaders[name] = value;
	} else {
		for (const [name, value] of Object.entries(defaultSecurityHeaders)) securityHeaders[name] = value;
	}
	// Populates CORs-related headers.

	if (cfg.enableCORs) {
		corsHeaders['access-control-max-age'] = '7200';
		corsHeaders['access-control-allow-credentials'] = 'true';
		corsHeaders['access-control-allow-methods'] = supportedRequestMethods.join(', ');
		corsHeaders['access-control-allow-headers'] = requestHeaderNames.join(', ');
		corsHeaders['access-control-expose-headers'] = responseHeaderNames.join(', ');
		corsHeaders['timing-allow-origin'] = request.headers.has('origin') ? request.headers.get('origin') || '' : '*';
		corsHeaders['access-control-allow-origin'] = request.headers.has('origin') ? request.headers.get('origin') || '' : '*';
	}
	// Merges and returns all headers.

	const headers = new Headers({ ...alwaysOnHeaders, ...contentHeaders, ...cacheHeaders, ...securityHeaders, ...corsHeaders });

	cfg.headers.forEach((value, name) => headers.set(name, value));
	cfg.appendHeaders.forEach((value, name) => headers.append(name, value));

	return headers;
};

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
	(request: Request | cfw.Request): boolean => {
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
	(request: Request | cfw.Request): boolean => {
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
	(request: Request | cfw.Request, responseStatus: number): boolean => {
		return 204 !== responseStatus && requestHasSupportedMethod(request) && !['OPTIONS'].includes(request.method);
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
	(request: Request | cfw.Request, responseStatus: number): boolean => {
		return 204 !== responseStatus && requestHasSupportedMethod(request) && !['OPTIONS', 'HEAD'].includes(request.method);
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
	(request: Request | cfw.Request): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL): boolean => {
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
	(request: Request | cfw.Request, url?: URL | cfw.URL, exts?: string[] | RegExp): boolean => {
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
export const extractHeaders = (headers: Headers | cfw.Headers | { [x: string]: string }, options?: ExtractHeaderOptions): { [x: string]: string } => {
	const plainObjHeaders: { [x: string]: string } = {};
	const opts = $objꓺdefaults({}, options || {}, { lowercase: true }) as Required<ExtractHeaderOptions>;

	if (headers instanceof Headers) {
		headers.forEach((value, name) => {
			plainObjHeaders[opts.lowercase ? name.toLowerCase() : name] = value;
		});
	} else {
		for (const [name, value] of Object.entries(headers as { [x: string]: string })) {
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
	'accept-charset',
	'accept-datetime',
	'accept-encoding',
	'accept-language',
	'accept-push-policy',
	'accept-signature',
	'accept',
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
	'sec-ch-ua-arch',
	'sec-ch-ua-bitness',
	'sec-ch-ua-full-version-list',
	'sec-ch-ua-full-version',
	'sec-ch-ua-mobile',
	'sec-ch-ua-model',
	'sec-ch-ua-platform-version',
	'sec-ch-ua-platform',
	'sec-ch-ua',
	'sec-fetch-dest',
	'sec-fetch-mode',
	'sec-fetch-site',
	'sec-fetch-user',
	'sec-websocket-extensions',
	'sec-websocket-key',
	'sec-websocket-protocol',
	'sec-websocket-version',
	'service-worker-navigation-preload',
	'service-worker',
	'signature',
	'signed-headers',
	'te',
	'trailer',
	'transfer-encoding',
	'true-client-ip',
	'upgrade-insecure-requests',
	'upgrade',
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
	'x-forwarded-scheme',
	'x-forwarded-ssl',
	'x-host',
	'x-http-method-override',
	'x-http-method',
	'x-method-override',
	'x-nonce',
	'x-original-url',
	'x-real-ip',
	'x-request-id',
	'x-requested-by',
	'x-requested-with',
	'x-rewrite-url',
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
 * Default security headers.
 */
export const defaultSecurityHeaders: { [x: string]: string } = {
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

/**
 * C10n security headers.
 */
export const c10nSecurityHeaders: { [x: string]: string } = {
	...defaultSecurityHeaders,

	'strict-transport-security': 'max-age=15552000; includeSubDomains; preload',
	'content-security-policy':
		'report-uri https://clevercanyon.report-uri.com/r/d/csp/enforce; report-to csp; upgrade-insecure-requests; ' + defaultSecurityHeaders['content-security-policy'],

	'nel': '{ "report_to": "default", "max_age": 31536000, "include_subdomains": true }',
	'expect-ct': 'max-age=604800, report-uri="https://clevercanyon.report-uri.com/r/d/ct/reportOnly"',
	'report-to':
		'{ "group": "default", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/a/d/g" } ], "include_subdomains": true },' +
		' { "group": "csp", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/r/d/csp/enforce" } ], "include_subdomains": true }',
};
