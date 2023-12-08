/**
 * HTTP utilities.
 */

import '#@init.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $env, $fn, $is, $obj, $path, $str, $time, $url, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type RequestConfig = {
    enforceNoTrailingSlash?: boolean;
    enableRewrites?: boolean;
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
export type ExtractHeaderOptions = { lowercase?: boolean };

/**
 * HTTP request config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP request config.
 */
export const requestConfig = (config?: RequestConfig): RequestConfig => {
    return $obj.defaults({}, config || {}, {
        enforceNoTrailingSlash: $env.isC10n(),
        enableRewrites: $env.isCFW(),
    }) as Required<RequestConfig>;
};

/**
 * HTTP response config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP response config.
 *
 * @note Default status `405` = method now allowed.
 */
export const responseConfig = (config?: ResponseConfig): Required<ResponseConfig> => {
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
 * @param   request HTTP request object.
 * @param   config  Optional config options.
 *
 * @returns         HTTP request.
 *
 * @throws          Error {@see Response} on failure.
 */
export const prepareRequest = (request: $type.Request, config?: RequestConfig): $type.Request => {
    const cfg = requestConfig(config);
    let url = $url.tryParse(request.url);

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
    if (cfg.enforceNoTrailingSlash && requestPathHasInvalidTrailingSlash(request, url)) {
        url.pathname = $str.rTrim(url.pathname, '/'); // Remove.
        throw prepareResponse(request, { status: 301, headers: { location: url.toString() } });
    }
    if (cfg.enableRewrites && !request.headers.has('x-rewrite-url')) {
        const originalURL = url; // Before rewrites.
        url = $url.removeCSOQueryVars(originalURL);

        let _ck = ''; // Initializes `_ck`, cache key.

        if (request.headers.has('origin')) {
            const origin = request.headers.get('origin') || '';
            _ck = (_ck ? _ck + '&' : '') + 'origin=' + origin;
        }
        if (_ck) url.searchParams.set('_ck', _ck);
        url.searchParams.sort(); // Optimizes cache.

        if ($env.isCFWViaMiniflare() && 'http:' === url.protocol) {
            // This miniflare behavior; i.e., `http:`, began in Wrangler 3.19.0.
            url.protocol = 'https:'; // Converts internal proxy URL into `https:`.
        }
        if (url.toString() !== originalURL.toString()) {
            request = new Request(
                url.toString(),
                new Request(request as Request, {
                    headers: {
                        'x-rewrite-url': url.toString(),
                        'x-original-url': originalURL.toString(),
                    },
                }),
            );
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
export const prepareResponse = (request: $type.Request, config?: ResponseConfig): $type.Response => {
    const cfg = responseConfig(config);
    const url = $url.tryParse(request.url);

    if (!url /* Catches unparseable URLs. */) {
        cfg.status = 400; // Bad request status.
        cfg.body = responseStatusText(cfg.status);
        cfg.body = requestNeedsContentBody(request, cfg.status) ? cfg.body : null;

        return new Response(cfg.body, {
            status: cfg.status,
            statusText: responseStatusText(cfg.status),
            headers: prepareResponseHeaders(request, new URL('https://0.0.0.0/'), cfg),
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
const prepareResponseHeaders = (request: $type.Request, url: $type.URL, cfg: Required<ResponseConfig>): $type.Headers => {
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
                // We don't set content-length for `FormData|ReadableStream` body format types.
                // The only way to determine the length of a readable stream is to actually read the stream.
                // Don't use `FormData` sent as `application/x-www-form-urlencoded`. Use `URLSearchParams` or a string.
            }
        }
    }
    // Populates `cache-control` and cache-related headers.

    // Vary is ignored by Cloudflare, except in one rare case: <https://o5p.me/k4Xx0j>.
    // Vary is *not* ignored by browsers, but since it *is* ignored by Cloudflare, if a browser requests the same location
    // with one of the following headers, and that location is being cached by Cloudflare, they'll always get the same response.

    // Regardless, note that `origin` is always varied at the edge by Cloudflare; i.e., unless explicitly configured to exclude `origin`.
    // Additionally, we use `_ck` to vary based on `origin` when using the cache API with Cloudflare workers — handled by request rewrites above.

    cacheHeaders['vary'] = 'origin'; // Only varying based on `origin` at this time.

    if (!cfg.headers.has('cache-control') /* Simply saves time. */) {
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
        for (const [name, value] of Object.entries(c10nSecurityHeaders())) securityHeaders[name] = value;
    } else {
        for (const [name, value] of Object.entries(defaultSecurityHeaders())) securityHeaders[name] = value;
    }
    // Populates CORs-related headers.

    if (cfg.enableCORs) {
        corsHeaders['access-control-max-age'] = '7200';
        corsHeaders['access-control-allow-credentials'] = 'true';
        corsHeaders['access-control-allow-methods'] = supportedRequestMethods().join(', ');
        corsHeaders['access-control-allow-headers'] = requestHeaderNames().join(', ');
        corsHeaders['access-control-expose-headers'] = responseHeaderNames().join(', ');
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
export const responseStatusText = (status: string | number): string => {
    return responseStatusCodes()[String(status)] || '';
};

/**
 * Request has a supported method?
 *
 * @param   request HTTP request object.
 *
 * @returns         True if request has a supported method.
 */
export const requestHasSupportedMethod = (request: $type.Request): boolean => {
    return supportedRequestMethods().includes(request.method);
};

/**
 * Request has a cacheable request method?
 *
 * @param   request HTTP request object.
 *
 * @returns         True if request has a cacheable request method.
 */
export const requestHasCacheableMethod = $fnꓺmemo(2, (request: $type.Request): boolean => {
    return requestHasSupportedMethod(request) && ['HEAD', 'GET'].includes(request.method);
});

/**
 * Request method needs content headers?
 *
 * @param   request        HTTP request object.
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
 * @param   request        HTTP request object.
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
 * @param   request HTTP request object.
 *
 * @returns         True if request is coming from an identified user.
 *
 * @someday Consider parsing the cookie header to make this less prone to error in regexp.
 *          i.e., We already have `$cookie.parse()` available for use here.
 */
export const requestIsFromUser = $fnꓺmemo(2, (request: $type.Request): boolean => {
    if (request.headers.has('authorization')) {
        return true; // Authorization header.
    }
    if (!request.headers.has('cookie')) {
        return false; // No cookies.
    }
    const cookie = request.headers.get('cookie') || ''; // Contains encoded cookies.
    return /(?:^\s*|;\s*)(?:ut[mx]_)?(?:logged[_-]in|user|customer|author)(?:[_-][^=;]+)?=\s*"?[^";]/iu.test(cookie);
});

/**
 * Request path is invalid?
 *
 * @param   request HTTP request object.
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
 * Request path has an invalid trailing slash?
 *
 * @param   request HTTP request object.
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
 * @param   request HTTP request object.
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
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request is dynamic.
 */
export const requestPathIsDynamic = $fnꓺmemo(2, (request: $type.Request, url?: $type.URL): boolean => {
    return requestPathHasDynamicBase(request, url) || requestPathIsPotentiallyDynamic(request, url) || !requestPathHasStaticExtension(request, url);
});

/**
 * Request path has a dynamic base?
 *
 * @param   request HTTP request object.
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
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is potentially dynamic.
 */
export const requestPathIsPotentiallyDynamic = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return /\/(?:robots\.txt|(?:[^/]+[-_])?sitemap(?:[-_][^/]+)?\.xml|sitemaps\/.*\.xml)$/iu.test(url.pathname);
});

/**
 * Request path is an SEO file?
 *
 * @param   request HTTP request object.
 * @param   url     Optional pre-parsed URL. Default is taken from `request`.
 *
 * @returns         True if request path is an SEO file.
 */
export const requestPathIsSEORelatedFile = $fnꓺmemo(2, (request: $type.Request, _url?: $type.URL): boolean => {
    const url = _url || $url.parse(request.url);
    if ('/' === url.pathname) return false;

    return /\/(?:robots\.txt|(?:[^/]+[-_])?sitemap(?:[-_][^/]+)?\.xml|sitemaps\/.*\.xml|favicon\.ico)$/iu.test(url.pathname);
});

/**
 * Request path is in an admin area?
 *
 * @param   request HTTP request object.
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
 * @param   request HTTP request object.
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
 * @param   request HTTP request object.
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
 * Supported HTTP request methods.
 *
 * @returns An array of supported HTTP request methods (uppercase).
 */
export const supportedRequestMethods = (): string[] => ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * HTTP request header names.
 *
 * @returns An array of request header names (lowercase).
 */
export const requestHeaderNames = (): string[] => [
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
 *
 * @returns An array of response header names (lowercase).
 */
export const responseHeaderNames = (): string[] => [
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
 * @returns Object with header names as props.
 */
export const defaultSecurityHeaders = (): { [x: string]: string } => {
    return {
        'x-frame-options': 'SAMEORIGIN',
        'x-content-type-options': 'nosniff',
        'cross-origin-embedder-policy': 'unsafe-none',
        'cross-origin-opener-policy': 'same-origin',
        'cross-origin-resource-policy': 'same-origin',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'content-security-policy':
            "base-uri 'self';" +
            " frame-ancestors 'self';" +
            //
            " default-src * data: blob: mediastream: 'report-sample';" +
            " style-src * data: blob: 'unsafe-inline' 'report-sample';" +
            " object-src 'none';" + // No objects whatsoever.
            //
            " script-src blob: 'self' 'unsafe-inline' 'unsafe-eval' 'report-sample'" + // Standard allowances.
                // ' :: ::1' + // These are not actually supported at present and trigger console warnings; {@see https://o5p.me/HYDIog}.
                ' 0.0.0.0 127.0.0.1 *.local *.localhost *.mac *.loc *.dkr *.vm' + // Local hostnames.
                ' *.clevercanyon.com *.hop.gdn' + // Our own hostnames.
                ' *.cloudflare.com *.cloudflareinsights.com' + // Cloudflare services.
                ' *.google.com *.googletagmanager.com *.google-analytics.com *.googleadservices.com googleads.g.doubleclick.net' + // Google services.
                ' *.stripe.com' + // Stripe services.
                ';', // prettier-ignore
        'permissions-policy':
            'accelerometer=(self), autoplay=(self), camera=(self), clipboard-read=(self), clipboard-write=(self), cross-origin-isolated=(self), display-capture=(self),' +
            ' encrypted-media=(self), fullscreen=(self), gamepad=(self), geolocation=(self), gyroscope=(self), hid=(self), idle-detection=(self), interest-cohort=(self),' +
            ' keyboard-map=(self), magnetometer=(self), microphone=(self), midi=(self), payment=(self "https://js.stripe.com" "https://pay.google.com"), picture-in-picture=(self),' +
            ' publickey-credentials-get=(self), screen-wake-lock=(self), serial=(self), sync-xhr=(self), usb=(self), window-management=(self), xr-spatial-tracking=(self)',
    };
};

/**
 * C10n security headers.
 *
 * @returns Object with header names as props.
 */
export const c10nSecurityHeaders = (): { [x: string]: string } => {
    return {
        ...defaultSecurityHeaders(),

        'strict-transport-security': 'max-age=15552000; includeSubDomains; preload',
        'content-security-policy':
            'report-uri https://clevercanyon.report-uri.com/r/d/csp/enforce; report-to csp; upgrade-insecure-requests;' +
            ' ' + // Ahead of our default CSP.
            defaultSecurityHeaders()['content-security-policy'],

        'nel': '{ "report_to": "default", "max_age": 31536000, "include_subdomains": true }',
        'report-to':
            '{ "group": "default", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/a/d/g" } ], "include_subdomains": true },' +
            ' { "group": "csp", "max_age": 31536000, "endpoints": [ { "url": "https://clevercanyon.report-uri.com/r/d/csp/enforce" } ], "include_subdomains": true }',
    };
};
