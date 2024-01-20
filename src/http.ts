/**
 * HTTP utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $app, $crypto, $env, $fn, $is, $obj, $path, $str, $time, $to, $url, $user, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type RequestConfig = {
    cspNonce?: string;
    enforceAppBaseURLOrigin?: boolean;
    enforceNoTrailingSlash?: boolean;
};
export type ResponseConfig = {
    status?: number;
    enableCORs?: boolean;
    enableCDN?: boolean;
    maxAge?: number | null;
    sMaxAge?: number | null;
    staleAge?: number | null;
    headers?: $type.Headers | { [x: string]: string };
    appendHeaders?: $type.Headers | { [x: string]: string };
    body?: $type.BodyInit | null; // i.e., Body contents.
};
export type SecurityHeaderOptions = {
    cspNonce?: string;
    enableCORs?: boolean;
};
export type ExtractHeaderOptions = {
    lowercase?: boolean;
};

/**
 * Gets our CSP nonce replacement code.
 *
 * @returns String CSP nonce replacement code.
 */
export const cspNonceReplacementCode = (): string => '{%-_{%-_cspNonce_-%}_-%}';

/**
 * HTTP request config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP request config promise.
 */
export const requestConfig = async (config?: RequestConfig): Promise<Required<RequestConfig>> => {
    return $obj.defaults({}, config || {}, {
        cspNonce: config?.cspNonce || $crypto.base64Encode($crypto.uuidV4()),
        enforceAppBaseURLOrigin: $env.isC10n() && $app.hasBaseURL(),
        enforceNoTrailingSlash: $env.isC10n(),
    }) as Required<RequestConfig>;
};

/**
 * HTTP response config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP response config promise.
 */
export const responseConfig = async (config?: ResponseConfig): Promise<Required<ResponseConfig>> => {
    return $obj.defaults({}, config || {}, {
        status: 405,
        enableCORs: false,
        enableCDN: true,
        maxAge: null,
        sMaxAge: null,
        staleAge: null,
        headers: {},
        appendHeaders: {},
        body: null,
    }) as Required<ResponseConfig>;
};

/**
 * Prepares an HTTP request.
 *
 * @param   request HTTP request.
 * @param   config  Optional; {@see RequestConfig}.
 *
 * @returns         HTTP request promise.
 *
 * @throws          HTTP response; e.g., on redirect, on error.
 */
export const prepareRequest = async (request: $type.Request, config?: RequestConfig): Promise<$type.Request> => {
    const cfg = await requestConfig(config);
    let url = $url.tryParse(request.url);

    if (!url /* Catches unparseable URLs. */) {
        throw await prepareResponse(request, { status: 400 });
    }
    if (requestPathIsInvalid(request, url)) {
        throw await prepareResponse(request, { status: 400 });
    }
    if (requestPathIsForbidden(request, url)) {
        throw await prepareResponse(request, { status: 403 });
    }
    if (!requestHasSupportedMethod(request)) {
        throw await prepareResponse(request, { status: 405 });
    }
    if (cfg.enforceAppBaseURLOrigin && requestPathHasInvalidAppBaseURLOrigin(request, url)) {
        const appBaseURL = $app.baseURL({ parsed: true });
        (url.protocol = appBaseURL.protocol), //
            (url.host = appBaseURL.host);

        if (cfg.enforceNoTrailingSlash && requestPathHasInvalidTrailingSlash(request, url)) {
            url.pathname = $str.rTrim(url.pathname, '/'); // Avoids two redirects.
        }
        throw await prepareResponse(request, { status: 301, headers: { location: url.toString() } });
    }
    if (cfg.enforceNoTrailingSlash && requestPathHasInvalidTrailingSlash(request, url)) {
        url.pathname = $str.rTrim(url.pathname, '/');
        throw await prepareResponse(request, { status: 301, headers: { location: url.toString() } });
    }
    request = request.clone(); // Safest to always work with a clone here.

    if (cfg.cspNonce) {
        request.headers.set('x-csp-nonce', cfg.cspNonce); // Internal header.
    } else {
        request.headers.delete('x-csp-nonce'); // Deleting for security reasons.
        // i.e., We don’t allow bad actors to send a request with their own nonce.
    }
    if ('http:' === url.protocol && $env.isCFWViaMiniflare()) {
        // This Miniflare behavior; i.e., `http:`, began in Wrangler 3.19.0.
        // We assume the original request URL was `https:` and Miniflare is acting as a proxy.
        // It’s worth noting that all our local test configurations make `https:` requests only.
        url.protocol = 'https:'; // Rewrites to assumed original request URL w/ `https:`.
        request = new Request(url.toString(), request as Request);
    }
    return request; // Clone.
};

/**
 * Prepares an HTTP response.
 *
 * @param   request HTTP request.
 * @param   config  Optional; {@see ResponseConfig}.
 *
 * @returns         HTTP response promise.
 */
export const prepareResponse = async (request: $type.Request, config?: ResponseConfig): Promise<$type.Response> => {
    const cfg = await responseConfig(config);
    const url = $url.tryParse(request.url);

    if (!url /* Catches unparseable URLs. */) {
        cfg.status = 400; // Bad request status.
        cfg.body = responseStatusText(cfg.status);
        cfg.body = requestNeedsContentBody(request, cfg.status) ? cfg.body : null;

        return new Response(cfg.body, {
            status: cfg.status,
            statusText: responseStatusText(cfg.status),
            headers: await prepareResponseHeaders(request, new URL('https://0.0.0.0/'), cfg),
        });
    }
    // This approach makes implementation simpler since we consolidate the handling of `OPTIONS` into the `enableCORs` flag.
    // The case of `405` (method now allowed; default status) is in conflict with CORs being enabled; i.e., `OPTIONS` method is ok.

    if (cfg.enableCORs && 'OPTIONS' === request.method && (!cfg.status || 405 === cfg.status)) {
        cfg.status = 204; // No content for CORs preflight requests.
    }
    cfg.status = cfg.status || 500; // If no status by now, we have an internal server error.
    cfg.body = requestNeedsContentBody(request, cfg.status) ? cfg.body : null;

    return new Response(cfg.body as BodyInit | null, {
        status: cfg.status,
        statusText: responseStatusText(cfg.status),
        headers: await prepareResponseHeaders(request, url, cfg),
    });
};

/**
 * Prepares HTTP response headers.
 *
 * @param   request HTTP request.
 * @param   cfg     Required; {@see ResponseConfig}.
 *
 * @returns         HTTP response headers promise.
 *
 * @note Private function. Intentionally not exporting.
 */
const prepareResponseHeaders = async (request: $type.Request, url: $type.URL, cfg: Required<ResponseConfig>): Promise<$type.Headers> => {
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

    if (!cfg.headers.has('content-length') /* Simply saves time. */) {
        if (requestNeedsContentHeaders(request, cfg.status) && !$is.nul(cfg.body)) {
            if ($is.string(cfg.body)) {
                contentHeaders['content-length'] = String($str.byteLength(cfg.body));
                //
            } else if ($is.blob(cfg.body)) {
                contentHeaders['content-length'] = String(cfg.body.size);
                //
            } else if ($is.typedArray(cfg.body) || $is.arrayBuffer(cfg.body) || $is.dataView(cfg.body)) {
                contentHeaders['content-length'] = String(cfg.body.byteLength);
                //
            } else if (cfg.body instanceof URLSearchParams) {
                contentHeaders['content-length'] = String($str.byteLength(cfg.body.toString()));
            } else {
                // We don't auto-set content-length for `FormData|ReadableStream` body format types.
                // The only way to determine the length of a readable stream is to actually read the stream.
                // Don't use `FormData` sent as `application/x-www-form-urlencoded`. Use `URLSearchParams` or a string.
            }
        }
    }
    // Populates `cache-control` and cache-related headers.
    // `vary` is ignored by Cloudflare, except in one rare case: <https://o5p.me/k4Xx0j>.
    // That said, *we* use `?_ck` to vary based on `origin` via Cloudflare workers cache API.

    if (cfg.enableCORs && request.headers.has('origin')) {
        cacheHeaders['vary'] = 'origin'; // We only vary on `origin` at this time.
    }
    if (!cfg.headers.has('cache-control') /* This simply saves us a little time. */) {
        const cacheControl = (
            maxAge?: ResponseConfig['maxAge'], // Browser max age (cache TTL).
            sMaxAge?: ResponseConfig['sMaxAge'], // Server max age; e.g., Cloudflare.
            staleAge?: ResponseConfig['staleAge'], // Browser and server stale age.
        ): void => {
            maxAge = Math.max(maxAge || 0, 0);
            maxAge = Math.min(maxAge, $time.yearInSeconds); // 1 year max.

            if (0 === maxAge /* Do not cache. */) {
                cacheHeaders['cache-control'] = 'no-store';
                cacheHeaders['cdn-cache-control'] = 'no-store';
            } else {
                // 2h minimum @ Cloudflare on free plan.
                sMaxAge = Math.max($is.integer(sMaxAge) ? sMaxAge : maxAge, 0);
                sMaxAge = 0 === sMaxAge ? 0 : Math.max(Math.max(sMaxAge, maxAge), $time.hourInSeconds * 2);

                staleAge = Math.max($is.integer(staleAge) ? staleAge : Math.round(maxAge / 2), 0);
                staleAge = Math.min(staleAge, $time.dayInSeconds * 90); // 90 days max.

                cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=' + String(maxAge) + ', s-maxage=' + String(sMaxAge) + ', stale-while-revalidate=' + String(staleAge) + ', stale-if-error=' + String(staleAge); // prettier-ignore
                cacheHeaders['cdn-cache-control'] = 0 === sMaxAge ? 'no-store' : 'public, must-revalidate, max-age=' + String(sMaxAge) + ', stale-while-revalidate=' + String(staleAge) + ', stale-if-error=' + String(staleAge); // prettier-ignore
            }
            if (!cfg.enableCDN) delete cacheHeaders['cdn-cache-control']; // Ditches CDN header.
        };
        if ($is.integer(cfg.maxAge)) {
            cacheControl(cfg.maxAge, cfg.sMaxAge, cfg.staleAge);
            //
        } else if (!requestHasCacheableMethod(request) || cfg.status >= 300) {
            cacheControl(0); // Do not cache.
            //
        } else if (requestPathIsSEORelatedFile(request, url)) {
            cacheControl($time.dayInSeconds);
            //
        } else if (requestPathIsStatic(request, url)) {
            cacheControl($time.yearInSeconds);
            //
        } else if (requestPathIsInAdmin(request, url)) {
            cacheControl(0); // Do not cache.
            //
        } else if (requestIsFromUser(request)) {
            cacheControl(0); // Do not cache.
            //
        } else cacheControl($time.dayInSeconds);
    }
    // Populates security-related headers.

    if ($env.isC10n()) {
        for (const [name, value] of Object.entries(
            c10nSecurityHeaders({
                enableCORs: cfg.enableCORs,
                cspNonce: request.headers.get('x-csp-nonce') || '',
            }),
        )) {
            securityHeaders[name] = value; // Assigns security headers.
        }
    } else {
        for (const [name, value] of Object.entries(
            defaultSecurityHeaders({
                enableCORs: cfg.enableCORs,
                cspNonce: request.headers.get('x-csp-nonce') || '',
            }),
        )) {
            securityHeaders[name] = value; // Assigns security headers.
        }
    }
    // Populates CORs headers.

    if (cfg.enableCORs && request.headers.has('origin')) {
        corsHeaders['access-control-max-age'] = '7200';
        corsHeaders['access-control-allow-credentials'] = 'true';
        corsHeaders['access-control-allow-origin'] = request.headers.get('origin') || '*';
        corsHeaders['access-control-allow-methods'] = supportedRequestMethods().join(', ');
        corsHeaders['access-control-allow-headers'] = corsRequestHeaderNames().join(', ');
        corsHeaders['access-control-expose-headers'] = corsResponseHeaderNames().join(', ');
        //
    } else if (cfg.enableCORs) {
        corsHeaders['access-control-allow-origin'] = '*';
    }
    // Merges and returns all headers.

    const headers = new Headers({ ...alwaysOnHeaders, ...contentHeaders, ...cacheHeaders, ...securityHeaders, ...corsHeaders });

    cfg.headers.forEach((value, name) => headers.set(name, value));
    cfg.appendHeaders.forEach((value, name) => headers.append(name, value));

    return headers;
};

/**
 * Prepares a cached HTTP response.
 *
 * @param   request  HTTP request.
 * @param   response HTTP response.
 *
 * @returns          HTTP response promise.
 */
export const prepareCachedResponse = async (request: $type.Request, response: $type.Response): Promise<$type.Response> => {
    response = response.clone(); // Safest to always work with a clone here.
    const useResponseBody = requestNeedsContentBody(request, response.status);

    if (responseIsHTML(response) && request.headers.has('x-csp-nonce') && response.headers.has('content-security-policy')) {
        const cspNonceReplCode = cspNonceReplacementCode(),
            cspNonce = request.headers.get('x-csp-nonce') || '',
            csp = response.headers.get('content-security-policy') || '';

        response.headers.set('content-security-policy', csp.replaceAll(cspNonceReplCode, cspNonce));

        if (useResponseBody && response.body) {
            response = new Response((await response.text()).replaceAll(cspNonceReplCode, cspNonce), response);
        }
    }
    if (!useResponseBody) {
        response = new Response(null, response);
    }
    return response;
};

/**
 * Prepares an HTTP response for cache.
 *
 * @param   request  HTTP request.
 * @param   response HTTP response.
 *
 * @returns          HTTP response promise.
 */
export const prepareResponseForCache = async (request: $type.Request, response: $type.Response): Promise<$type.Response> => {
    response = response.clone(); // Safest to always work with a clone here.

    if (responseIsHTML(response) && request.headers.has('x-csp-nonce') && response.headers.has('content-security-policy')) {
        const cspNonceReplCode = cspNonceReplacementCode(),
            csp = response.headers.get('content-security-policy') || '';

        response.headers.set('content-security-policy', csp.replace(/'nonce-[^']+'/giu, `'nonce-${cspNonceReplCode}'`));

        if (response.body)
            // {@see https://regex101.com/r/oTjEIq/7} {@see https://regex101.com/r/1MioJI/9}.
            response = new Response(
                (await response.text())
                    .replace(/(<script(?:\s+[^<>]*?)?\s+nonce\s*=\s*)(['"])[^'"<>]*\2/giu, '$1$2' + cspNonceReplCode + '$2')
                    .replace(
                        /(<script(?:\s+[^<>]*?)?\s+id\s*=\s*(['"])global-data\2[^<>]*>(?:[\s\S](?!<\/script>))*)((['"]{0,1})cspNonce\4\s*:\s*)(['"])[^'"<>]*\5/iu,
                        '$1$3$5' + cspNonceReplCode + '$5',
                    ),
                response,
            );
    }
    return response;
};

/**
 * Get HTTP response status text.
 *
 * @param   status HTTP status code.
 *
 * @returns        HTTP response status text.
 */
export const responseStatusText = (status: string | number): string => {
    return responseStatusCodes()[String(status)] || '';
};

/**
 * Request has a supported method?
 *
 * @param   request HTTP request.
 *
 * @returns         True if request has a supported method.
 */
export const requestHasSupportedMethod = (request: $type.Request): boolean => {
    return supportedRequestMethods().includes(request.method);
};

/**
 * Request has a cacheable request method?
 *
 * @param   request HTTP request.
 *
 * @returns         True if request has a cacheable request method.
 */
export const requestHasCacheableMethod = $fnꓺmemo(2, (request: $type.Request): boolean => {
    return requestHasSupportedMethod(request) && ['HEAD', 'GET'].includes(request.method);
});

/**
 * Request method needs content headers?
 *
 * @param   request        HTTP request.
 * @param   responseStatus HTTP response status code.
 *
 * @returns                True if request method needs content headers.
 *
 * @see https://fetch.spec.whatwg.org/#null-body-status
 */
export const requestNeedsContentHeaders = $fnꓺmemo(2, (request: $type.Request, responseStatus: number): boolean => {
    return requestHasSupportedMethod(request) && !['OPTIONS'].includes(request.method) && ![101, 103, 204, 205, 304].includes(responseStatus);
});

/**
 * Request method needs content body?
 *
 * @param   request        HTTP request.
 * @param   responseStatus HTTP response status code.
 *
 * @returns                True if request method needs content body.
 *
 * @see https://fetch.spec.whatwg.org/#null-body-status
 */
export const requestNeedsContentBody = $fnꓺmemo(2, (request: $type.Request, responseStatus: number): boolean => {
    return requestHasSupportedMethod(request) && !['OPTIONS', 'HEAD'].includes(request.method) && ![101, 103, 204, 205, 304].includes(responseStatus);
});

/**
 * Request is coming from an identified user?
 *
 * @param   request HTTP request.
 *
 * @returns         True if request is coming from an identified user.
 */
export const requestIsFromUser = $fnꓺmemo(2, (request: $type.Request): boolean => {
    if (request.headers.has('authorization')) {
        return true; // Authorization header.
    }
    if (!request.headers.has('cookie')) {
        return false; // No cookies.
    }
    const cookie = request.headers.get('cookie') || ''; // Contains encoded cookies.
    return /(?:^\s*|;\s*)(?:ut[mx]_)?(?:author|user|customer)(?:[_-][^=;]+)?=\s*"?[^";]/iu.test(cookie);
});

/**
 * Request is coming from a specific via token?
 *
 * WARNING: We do not vary caches based on `x-via`. Therefore, you should _only_ use this when processing an uncacheable
 * request type; e.g., `POST` request, or another that is uncacheable; {@see requestHasCacheableMethod()}.
 *
 * @param   request HTTP request.
 * @param   via     `x-via` token to consider.
 *
 * @returns         True if request is coming from `x-via` token.
 */
export const requestIsVia = $fnꓺmemo(2, (request: $type.Request, via: string): boolean => {
    if (!request.headers.has('x-via')) {
        return false; // No `x-via` header.
    }
    const header = request.headers.get('x-via') || ''; // Contains via tokens.
    return $is.notEmpty(header) && new RegExp('(?:^|[,;])\\s*(?:' + $str.escRegExp(via) + ')\\s*(?:$|[,;])', 'ui').test(header);
});

/**
 * Request expects a JSON response?
 *
 * WARNING: We do not vary caches based on `accept`. Therefore, you should _only_ use this when processing an
 * uncacheable request type; e.g., `POST` request, or another that is uncacheable; {@see requestHasCacheableMethod()}.
 *
 * WARNING: This isn’t foolproof because it assumes anything of our own served from `/api` will expect JSON in the
 * absense of an `accept` header. Therefore, only use in contexts where false-positives are not detrimental.
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request expects a JSON response.
 */
export const requestExpectsJSON = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    let url = _url || $url.parse(request.url);
    url = $fn.try(() => $url.removeAppBasePath(url), url)();
    const acceptHeader = request.headers.get('accept') || '';
    return (
        (acceptHeader && /\b(?:application\/json)\b/iu.test(acceptHeader)) || //
        (!acceptHeader && $env.isC10n() && '/' !== url.pathname && /^\/(?:api)(?:$|\/)/iu.test(url.pathname))
    );
});

/**
 * Request path is invalid?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is invalid.
 */
export const requestPathIsInvalid = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return /\\|\/{2,}|\.{2,}/iu.test(url.pathname);
});

/**
 * Request has an invalid app base URL origin?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request has an invalid app base URL origin.
 */
export const requestPathHasInvalidAppBaseURLOrigin = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    const appBaseURL = $app.baseURL({ parsed: true });

    if (url.host !== appBaseURL.host) return true;
    return (
        url.protocol !== appBaseURL.protocol && //
        // This Miniflare behavior; i.e., `http:`, began in Wrangler 3.19.0.
        // In Miniflare, we don’t consider a mismatched protocol to be an issue.
        // We assume the original request URL was `https:` and Miniflare is acting as a proxy.
        // It’s worth noting that all our local test configurations make `https:` requests only.
        (!$env.isCFWViaMiniflare() || 'http:' !== url.protocol)
    );
});

/**
 * Request path has an invalid trailing slash?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path has an invalid trailing slash.
 */
export const requestPathHasInvalidTrailingSlash = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return url.pathname.endsWith('/');
});

/**
 * Request path is forbidden?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is forbidden.
 */
export const requestPathIsForbidden = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    if (/\/\./iu.test(url.pathname) && !/^\/\.well-known(?:$|\/)/iu.test(url.pathname)) {
        return true; // No dotfile paths, except `/.well-known` at root of a domain.
    }
    if (/(?:~|[^/.]\.(?:bak|backup|copy|log|old|te?mp))(?:$|\/)/iu.test(url.pathname)) {
        return true; // No backups, copies, logs, or temp paths.
    }
    if (/\/(?:[^/]*[._-])?(?:private|cache|logs?|te?mp)(?:$|\/)/iu.test(url.pathname)) {
        return true; // No private, cache, log, or temp paths.
    }
    if (/\/(?:yarn|vendor|node[_-]modules|jspm[_-]packages|bower[_-]components)(?:$|\/)/iu.test(url.pathname)) {
        return true; // No package management dependencies paths.
    }
    return false;
});

/**
 * Request path is dynamic?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request is dynamic.
 *
 * @note This is determining whether it *might* be; i.e., probably is dynamic, not that is in fact dynamic.
 *       The best practice is to attempt to resolve dynamically first, then fall back on static handlers.
 */
export const requestPathIsDynamic = $fnꓺmemo(2, (request: $type.Request, url?: $type.URL): boolean => {
    return requestPathHasDynamicBase(request, url) || requestPathIsPotentiallyDynamic(request, url) || !requestPathHasStaticExtension(request, url);
});

/**
 * Request path has a dynamic base?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path has a dynamic base.
 */
export const requestPathHasDynamicBase = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    let url = _url || $url.parse(request.url);
    url = $fn.try(() => $url.removeAppBasePath(url), url)();
    if ('/' === url.pathname) return false;

    return /^\/(?:api)(?:$|\/)/iu.test(url.pathname);
});

/**
 * Request path is potentially dynamic?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is potentially dynamic.
 */
export const requestPathIsPotentiallyDynamic = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return requestPathIsSEORelatedFile(request, url) && !/\/favicon\.ico$/iu.test(url.pathname);
});

/**
 * Request path is an SEO file?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is an SEO file.
 */
export const requestPathIsSEORelatedFile = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return /\/(?:\.well[-_]known\/|sitemaps\/.*\.xml|(?:[^/]+[-_])?sitemap(?:[-_][^/]+)?\.xml|manifest\.json|(?:ads|humans|robots)\.txt|favicon\.ico)$/iu.test(url.pathname);
});

/**
 * Request path is in an admin area?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is in an admin area.
 */
export const requestPathIsInAdmin = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return /\/(?:[^/]+[-_])?admin(?:[-_][^/]+)?(?:$|\/)/iu.test(url.pathname);
});

/**
 * Request path is static?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request is static.
 */
export const requestPathIsStatic = $fnꓺmemo(2, (request: $type.Request, url?: $type.URL): boolean => {
    return !requestPathIsDynamic(request, url);
});

/**
 * Request path has a static file extension?
 *
 * @param   request HTTP request.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path has a static file extension.
 */
export const requestPathHasStaticExtension = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return $path.hasStaticExt(url.pathname);
});

/**
 * Response is an HTML document?
 *
 * @param   response HTTP response.
 *
 * @returns          True if response is an HTML document.
 */
export const responseIsHTML = $fnꓺmemo(2, (response: $type.Response): boolean => {
    return 'text/html' === response.headers.get('content-type')?.split(';')[0]?.toLowerCase();
});

/**
 * Extracts headers, returning a plain object.
 *
 * @param   headers Headers instance or string-keyed object.
 * @param   options Options (all optional); {@see ExtractHeaderOptions}.
 *
 *   - Note that a {@see Headers} object always contains lowercase keys. Therefore, this option is only applicable when a
 *       string-keyed object is passed; i.e., if {@see Headers} are passed, this will always return lowercase keys.
 *
 * @returns         Extracted headers, as a plain object.
 */
export const extractHeaders = (headers: $type.Headers | { [x: string]: string }, options?: ExtractHeaderOptions): { [x: string]: string } => {
    const plain: { [x: string]: string } = {}; // Initialize.
    const opts = $obj.defaults({}, options || {}, { lowercase: true }) as Required<ExtractHeaderOptions>;

    if (headers instanceof Headers) {
        headers.forEach((value, name) => {
            plain[opts.lowercase ? name.toLowerCase() : name] = value;
        });
    } else {
        for (const [name, value] of Object.entries(headers as { [x: string]: string })) {
            plain[opts.lowercase ? name.toLowerCase() : name] = value;
        }
    }
    return plain;
};

/**
 * Verifies a Cloudflare turnstile response.
 *
 * @param   request   HTTP request to verify.
 * @param   turnstile Turnstile response token.
 *
 * @returns           True if turnstile can be verified by Cloudflare.
 *
 * @requiredEnv cfw
 */
export const verifyTurnstile = async (request: $type.Request, turnstile: string): Promise<boolean> => {
    if (!$env.isCFW()) throw Error('SqRkpZAB');

    const formData = new FormData();
    formData.append('secret', $env.get('SSR_APP_TURNSTILE_SECRET_KEY', { type: 'string' }) || $env.get('APP_TURNSTILE_SECRET_KEY', { type: 'string' }));
    formData.append('remoteip', await $user.ip(request));
    formData.append('response', turnstile);

    const verificationEndpointURL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    return await fetch(verificationEndpointURL, { method: 'POST', body: formData })
        .then(async (response): Promise<$type.Object> => $to.plainObject(await response.json()))
        .then((response) => Boolean(response.success))
        .catch((): boolean => false);
};

/**
 * Supported HTTP request methods.
 *
 * @returns An array of supported HTTP request methods (uppercase).
 */
export const supportedRequestMethods = (): string[] => ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * URL-containing header names.
 *
 * @returns An array of URL-containing header names (lowercase).
 */
export const urlHeaderNames = (): string[] => [
    'link', //
    'location',
    'ping-from',
    'ping-to',
    'referer',
    'refresh', // Contains `; url=<URL>`.
    'sourcemap',
    'x-original-url',
    'x-pingback',
    'x-rewrite-url',
    'x-sourcemap',
];

/**
 * IP address header names.
 *
 * @returns An array of IP address header names (lowercase).
 *
 *   - IP addresses are returned in order of precedence; {@see $user.ip()}.
 */
export const ipHeaderNames = (): string[] => [
    // Cloudflare IP geolocation is based on these.
    'cf-connecting-ip', // Always contains a single IP.
    'cf-connecting-ipv6', // Always contains a single IP.
    'cf-pseudo-ipv4', // Always contains a single IP.

    // Other proprietary IP header names.
    'fastly-client-ip', // May contain multiple IPs.
    'x-appengine-user-ip', // May contain multiple IPs.

    // Other generic IP header names.
    'x-real-ip', // May contain multiple IPs.
    'x-client-ip', // May contain multiple IPs.
    'x-cluster-client-ip', // May contain multiple IPs.

    // Other unprefixed generic IP header names.
    'true-client-ip', // May contain multiple IPs.
    'client-ip', // May contain multiple IPs.
];

/**
 * Public header names.
 *
 * These do not contain sensitive data and therefore do not need to be redacted in most cases.
 *
 * @returns An array of public header names (lowercase).
 */
export const publicHeaderNames = (): string[] => [
    'accept-ch',
    'accept-charset',
    'accept-datetime',
    'accept-encoding',
    'accept-language',
    'accept-patch',
    'accept-post',
    'accept-push-policy',
    'accept-ranges',
    'accept-signature',
    'accept',
    'access-control-allow-credentials',
    'access-control-allow-headers',
    'access-control-allow-methods',
    'access-control-allow-origin',
    'access-control-expose-headers',
    'access-control-max-age',
    'access-control-request-headers',
    'access-control-request-method',
    'age',
    'allow',
    'alt-svc',
    'cache-control',
    'cdn-cache-control',
    'cdn-loop',
    'cf-cache-status',
    'cf-ray',
    'cf-worker',
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
    'content-security-policy-report-only',
    'content-security-policy',
    'content-transfer-encoding',
    'content-type',
    'cross-origin-embedder-policy',
    'cross-origin-opener-policy',
    'cross-origin-resource-policy',
    'date',
    'delta-base',
    'device-memory',
    'digest',
    'dnt',
    'downlink',
    'dpr',
    'early-data',
    'ect',
    'etag',
    'expect-ct',
    'expect',
    'expires',
    'feature-policy',
    'front-end-https',
    'host',
    'http2-settings',
    'if-match',
    'if-modified-since',
    'if-none-match',
    'if-range',
    'if-unmodified-since',
    'im',
    'keep-alive',
    'large-allocation',
    'last-modified',
    'link',
    'location',
    'max-forwards',
    'nel',
    'origin',
    'p3p',
    'permissions-policy',
    'ping-from',
    'ping-to',
    'pragma',
    'prefer',
    'preference-applied',
    'proxy-connection',
    'public-key-pins-report-only',
    'public-key-pins',
    'push-policy',
    'range',
    'referer',
    'referrer-policy',
    'refresh',
    'report-to',
    'retry-after',
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
    'sec-websocket-protocol',
    'sec-websocket-version',
    'server-timing',
    'server',
    'service-worker-allowed',
    'service-worker-navigation-preload',
    'service-worker',
    'sourcemap',
    'status',
    'strict-transport-security',
    'surrogate-control',
    'te',
    'timing-allow-origin',
    'tk',
    'trailer',
    'transfer-encoding',
    'upgrade-insecure-requests',
    'upgrade',
    'user-agent',
    'vary',
    'via',
    'viewport-width',
    'want-digest',
    'warning',
    'width',
    'x-content-duration',
    'x-content-security-policy',
    'x-content-type-options',
    'x-dns-prefetch-control',
    'x-download-options',
    'x-firefox-spdy',
    'x-forwarded-host',
    'x-forwarded-path',
    'x-forwarded-proto',
    'x-forwarded-scheme',
    'x-forwarded-ssl',
    'x-frame-options',
    'x-host',
    'x-http-method-override',
    'x-http-method',
    'x-litespeed-cache-control',
    'x-litespeed-cache',
    'x-litespeed-purge',
    'x-litespeed-tag',
    'x-litespeed-vary',
    'x-method-override',
    'x-mod-pagespeed',
    'x-original-url',
    'x-permitted-cross-domain-policies',
    'x-pingback',
    'x-powered-by',
    'x-redirect-by',
    'x-requested-by',
    'x-requested-with',
    'x-rewrite-url',
    'x-robots-tag',
    'x-server-debug',
    'x-sourcemap',
    'x-turbo-charged-by',
    'x-ua-compatible',
    'x-via',
    'x-webkit-csp',
    'x-wp-total',
    'x-wp-totalpages',
    'x-xss-protection',
];

/**
 * Protected header names.
 *
 * These contain potentially-sensitive data and should therefore be redacted in most cases.
 *
 * @returns An array of protected header names (lowercase).
 */
export const protectedHeaderNames = (): string[] => [
    'cookie', //
    'set-cookie',
    'lsc-cookie',

    'authorization',
    'www-authenticate',

    'proxy-authenticate',
    'proxy-authorization',

    'sec-websocket-key',
    'sec-websocket-accept',

    'signature',
    'signed-headers',

    'x-request-id',
    'x-correlation-id',

    'idempotency-key',
    'x-csp-nonce',
    'x-csrf-token',
    'x-nonce',
    'x-uidh',
    'x-waf-key',
    'x-wp-nonce',

    'forwarded',
    'x-forwarded-for',
    ...ipHeaderNames(),
];

/**
 * CORS HTTP request header names.
 *
 * The `access-control-allow-headers` response header is used in response to a preflight request which includes
 * `access-control-request-headers` to indicate which HTTP headers can be used during the actual request. These are the
 * headers we allow. {@see https://o5p.me/lIMknV} for further details.
 *
 * @returns An array of request header names (lowercase).
 */
export const corsRequestHeaderNames = (): string[] => [
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
    'cf-connecting-ipv6',
    'cf-ipcountry',
    'cf-pseudo-ipv4',
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
    'fastly-client-ip',
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
    'x-appengine-user-ip',
    'x-att-deviceid',
    'x-client-ip',
    'x-cluster-client-ip',
    'x-correlation-id',
    'x-csp-nonce',
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
    'x-via',
    'x-waf-key',
    'x-wap-profile',
    'x-wp-nonce',
];

/**
 * CORS HTTP response header names.
 *
 * The `access-control-expose-headers` response header allows a server to indicate which response headers should be made
 * available to scripts running in the browser, in response to a cross-origin request. These are the headers we allow.
 * {@see https://o5p.me/7uGcoc} for further details.
 *
 * @returns An array of response header names (lowercase).
 */
export const corsResponseHeaderNames = (): string[] => [
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
    'x-via',
    'x-webkit-csp',
    'x-wp-total',
    'x-wp-totalpages',
    'x-xss-protection',
];

/**
 * HTTP response status codes.
 *
 * @returns Object with status codes as props.
 */
export const responseStatusCodes = (): { [x: string]: string } => {
    return {
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
};

/**
 * Default security headers.
 *
 * @param   options Optional; {@see SecurityHeaderOptions}.
 *
 * @returns         Object with lowercase header names as keys.
 *
 * @see https://report-uri.com/home/generate
 * @see https://csp-evaluator.withgoogle.com/
 */
export const defaultSecurityHeaders = (options?: SecurityHeaderOptions): { [x: string]: string } => {
    const opts = $obj.defaults({}, options || {}, { cspNonce: '', enableCORs: false }) as Required<SecurityHeaderOptions>;
    return {
        'x-content-type-options': 'nosniff',
        'cross-origin-opener-policy': 'same-origin',
        ...(opts.enableCORs ? { 'timing-allow-origin': '*' } : {}),
        'cross-origin-resource-policy': opts.enableCORs ? 'cross-origin' : 'same-origin',
        'cross-origin-embedder-policy': 'credentialless',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'strict-transport-security': 'max-age=15552000; includeSubDomains; preload',

        // Generated using {@see https://report-uri.com/home/generate}.
        // Validated using {@see https://csp-evaluator.withgoogle.com/}.
        'content-security-policy': (
            ` child-src *;` +
            ` connect-src *;` +
            ` font-src *;` +
            ` form-action *;` +
            ` frame-src *;` +
            ` img-src * data:;` +
            ` media-src *;` +
            ` object-src 'none';` +
            (opts.cspNonce // `* 'unsafe-inline'` are fallbacks for browsers lacking `strict-dynamic`.
                ? ` script-src 'nonce-${opts.cspNonce}' 'strict-dynamic' * 'unsafe-inline' 'report-sample';`
                : ` script-src 'self' 'report-sample';`) +
            ` style-src * 'unsafe-inline' 'report-sample';` +
            ` worker-src *;` +
            //
            ` base-uri 'self';` +
            ` default-src 'self';` +
            ` manifest-src 'self';` +
            ` upgrade-insecure-requests;` +
            ` frame-ancestors ${opts.enableCORs ? `*` : `'self'`};` +
            ''
        ) // ↑ Last line empty for easy sorting of others.
            .trim()
            .replace(/;$/gu, ''),

        // Regarding the `unload()` permission, it impacts back/forward cache.
        // {@see https://web.dev/articles/bfcache} for further details from Google.
        'permissions-policy': (
            ` accelerometer=(self),` +
            ` autoplay=(self),` +
            ` camera=(self),` +
            ` clipboard-read=(self),` +
            ` clipboard-write=(self),` +
            ` cross-origin-isolated=(self),` +
            ` display-capture=(self),` +
            ` encrypted-media=(self),` +
            ` fullscreen=(self),` +
            ` gamepad=(self),` +
            ` geolocation=(self),` +
            ` gyroscope=(self),` +
            ` hid=(self),` +
            ` idle-detection=(self),` +
            ` interest-cohort=(self),` +
            ` keyboard-map=(self),` +
            ` magnetometer=(self),` +
            ` microphone=(self),` +
            ` midi=(self),` +
            ` payment=(self),` +
            ` picture-in-picture=(self),` +
            ` publickey-credentials-get=(self),` +
            ` screen-wake-lock=(self),` +
            ` serial=(self),` +
            ` sync-xhr=(self),` +
            ` unload=(),` + // Disable.
            ` usb=(self),` +
            ` window-management=(self),` +
            ` xr-spatial-tracking=(self),` +
            ''
        ) // ↑ Last line empty for easy sorting of others.
            .trim()
            .replace(/,$/gu, ''),
    };
};

/**
 * C10n security headers.
 *
 * See also, CSP for `r2.hop.gdn`:
 *
 *     default-src 'self'; script-src 'self' hop.gdn *.hop.gdn ajax.cloudflare.com challenges.cloudflare.com static.cloudflareinsights.com 'report-sample';
 *     style-src * 'unsafe-inline' 'report-sample'; img-src * data:; font-src *; connect-src *; media-src *; object-src 'none'; child-src *; frame-src *;
 *     worker-src *; frame-ancestors *; form-action *; upgrade-insecure-requests; base-uri 'self'; manifest-src 'self';
 *     report-uri https://clevercanyon.report-uri.com/r/d/csp/enforce; report-to csp
 *
 * @param   options Optional; {@see SecurityHeaderOptions}.
 *
 * @returns         Object with lowercase header names as keys.
 *
 * @see https://report-uri.com/home/generate
 * @see https://csp-evaluator.withgoogle.com/
 */
export const c10nSecurityHeaders = (options?: SecurityHeaderOptions): { [x: string]: string } => {
    const opts = $obj.defaults({}, options || {}, { cspNonce: '', enableCORs: false }) as Required<SecurityHeaderOptions>,
        defaultHeaders = defaultSecurityHeaders(opts),
        hopCSPHostnames = '*.hop.gdn',
        hopPPOrigins = '"https://*.hop.gdn"',
        youtubePPOrigins = '"https://www.youtube-nocookie.com"',
        cloudflareCSPHostnames = 'ajax.cloudflare.com challenges.cloudflare.com static.cloudflareinsights.com';

    return {
        ...defaultHeaders,

        // Generated using {@see https://report-uri.com/home/generate}.
        // Validated using {@see https://csp-evaluator.withgoogle.com/}.
        'content-security-policy': (
            ` child-src *;` +
            ` connect-src *;` +
            ` font-src *;` +
            ` form-action *;` +
            ` frame-src *;` +
            ` img-src * data:;` +
            ` media-src *;` +
            ` object-src 'none';` +
            (opts.cspNonce // `* 'unsafe-inline'` are fallbacks for browsers lacking `strict-dynamic`.
                ? ` script-src 'nonce-${opts.cspNonce}' 'strict-dynamic' * 'unsafe-inline' 'report-sample';`
                : ` script-src 'self' ${hopCSPHostnames} ${cloudflareCSPHostnames} 'report-sample';`) +
            ` style-src * 'unsafe-inline' 'report-sample';` +
            ` worker-src *;` +
            //
            ` base-uri 'self';` +
            ` default-src 'self';` +
            ` manifest-src 'self';` +
            ` upgrade-insecure-requests;` +
            ` frame-ancestors ${opts.enableCORs ? `*` : `'self' ${hopCSPHostnames}`};` +
            ` report-uri https://clevercanyon.report-uri.com/r/d/csp/enforce; report-to csp;` +
            ''
        ) // ↑ Last line empty for easy sorting of others.
            .trim()
            .replace(/;$/gu, ''),

        // Regarding the `unload()` permission, it impacts back/forward cache.
        // {@see https://web.dev/articles/bfcache} for further details from Google.
        'permissions-policy': (
            ` accelerometer=(self ${hopPPOrigins} ${youtubePPOrigins}),` +
            ` autoplay=(self ${hopPPOrigins} ${youtubePPOrigins}),` +
            ` camera=(self ${hopPPOrigins}),` +
            ` clipboard-read=(self ${hopPPOrigins}),` +
            ` clipboard-write=(self ${hopPPOrigins} ${youtubePPOrigins}),` +
            ` cross-origin-isolated=(self ${hopPPOrigins}),` +
            ` display-capture=(self ${hopPPOrigins}),` +
            ` encrypted-media=(self ${hopPPOrigins} ${youtubePPOrigins}),` +
            ` fullscreen=(self ${hopPPOrigins} ${youtubePPOrigins}),` +
            ` gamepad=(self ${hopPPOrigins}),` +
            ` geolocation=(self ${hopPPOrigins}),` +
            ` gyroscope=(self ${hopPPOrigins} ${youtubePPOrigins}),` +
            ` hid=(self ${hopPPOrigins}),` +
            ` idle-detection=(self ${hopPPOrigins}),` +
            ` interest-cohort=(self ${hopPPOrigins}),` +
            ` keyboard-map=(self ${hopPPOrigins}),` +
            ` magnetometer=(self ${hopPPOrigins}),` +
            ` microphone=(self ${hopPPOrigins}),` +
            ` midi=(self ${hopPPOrigins}),` +
            ` payment=(self ${hopPPOrigins}),` +
            ` picture-in-picture=(self ${hopPPOrigins} ${youtubePPOrigins}),` +
            ` publickey-credentials-get=(self ${hopPPOrigins}),` +
            ` screen-wake-lock=(self ${hopPPOrigins}),` +
            ` serial=(self ${hopPPOrigins}),` +
            ` sync-xhr=(self ${hopPPOrigins}),` +
            ` unload=(),` + // Disable.
            ` usb=(self ${hopPPOrigins}),` +
            ` window-management=(self ${hopPPOrigins}),` +
            ` xr-spatial-tracking=(self ${hopPPOrigins}),` +
            ''
        ) // ↑ Last line empty for easy sorting of others.
            .trim()
            .replace(/,$/gu, ''),

        'nel': '{ "report_to": "default", "max_age": 31536000, "include_subdomains": true }',
        'report-to':
            '{ "group": "default", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/a/d/g" } ], "include_subdomains": true },' +
            ' { "group": "csp", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/r/d/csp/enforce" } ], "include_subdomains": true }',
    };
};
