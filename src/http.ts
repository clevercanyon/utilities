/**
 * HTTP utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $app, $crypto, $env, $fn, $gzip, $is, $json, $mime, $obj, $path, $str, $symbol, $time, $to, $url, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type RouteConfig = Partial<
    // Partial response configuration.
    Pick<ResponseConfig, 'enableCORs' | 'varyOn' | 'cacheVersion'>
>;
export type RequestConfig = {
    cspNonce?: string;
    enforceAppBaseURLOrigin?: boolean;
    enforceNoTrailingSlash?: boolean;
};
export type ResponseConfig = {
    status?: number;

    enableCORs?: boolean;
    varyOn?: string[];
    cacheVersion?: string | 'none';

    maxAge?: number | null;
    sMaxAge?: number | null;
    staleAge?: number | null;

    headers?: $type.HeadersInit;
    appendHeaders?: $type.HeadersInit;

    body?: $type.BodyInit | null;
    encodeBody?: 'gzip' | null;
};
export type HeartbeatOptions = {
    cfw?: $type.$cfw.RequestContextData;
};
export type SecurityHeaderOptions = {
    cspNonce?: string;
    enableCORs?: boolean;
};

// ---
// Route utilities.

/**
 * HTTP route config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP route config.
 *
 * @note Intentionally not async. We use this in the body of modules to generate exported route configs.
 *       Some platforms; e.g., Cloudflare, do not support top-level await, so let’s not go down that path.
 */
export const routeConfig = (config?: RouteConfig): Required<RouteConfig> => {
    return $obj.defaults({}, config || {}, {
        enableCORs: false,
        varyOn: [],
    }) as Required<RouteConfig>;
};

// ---
// Request utilities.

/**
 * HTTP request config.
 *
 * @param   config Optional config options.
 *
 * @returns        HTTP request config promise.
 */
export const requestConfig = async (config?: RequestConfig): Promise<Required<RequestConfig>> => {
    return $obj.defaults({}, config || {}, {
        cspNonce: config?.cspNonce || $crypto.cspNonce(),
        enforceAppBaseURLOrigin: $env.isC10n() && $app.hasBaseURL(),
        enforceNoTrailingSlash: $env.isC10n(),
    }) as Required<RequestConfig>;
};

/**
 * Prepares an HTTP request.
 *
 * @param   request HTTP request.
 * @param   config  Optional; {@see RequestConfig}.
 *
 * @returns         Mutatable HTTP request copy promise.
 *
 * @throws          HTTP response; e.g., on redirect, on error.
 */
export const prepareRequest = async (request: $type.Request, config?: RequestConfig): Promise<$type.Request> => {
    const cfg = await requestConfig(config);
    let url = $url.tryParse(request.url);

    if (!url /* Catches unparseable URLs. */) {
        throw await prepareResponse(request, { status: 400, body: responseStatusText(400) });
    }
    if (requestPathIsInvalid(request, url)) {
        throw await prepareResponse(request, { status: 400, body: responseStatusText(400) });
    }
    if (requestPathIsForbidden(request, url)) {
        throw await prepareResponse(request, { status: 403, body: responseStatusText(403) });
    }
    if (!requestHasSupportedMethod(request)) {
        throw await prepareResponse(request, { status: 405, body: responseStatusText(405) });
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
    if ('http:' === url.protocol && $env.isCFWViaMiniflare()) {
        // This Miniflare behavior; i.e., `http:`, began in Wrangler 3.19.0.
        // We assume the original request URL was `https:` and Miniflare is acting as a proxy.
        // It’s worth noting that all our local test configurations make `https:` requests only.
        url.protocol = 'https:';
    }
    url.searchParams.delete('utx_audit_log'); // Not to be seen by any other handlers.

    // Rewrites to a mutable request with revised URL.
    request = new Request(url.toString(), request as RequestInit);

    if (cfg.cspNonce) {
        request.headers.set('x-csp-nonce', cfg.cspNonce); // Internal header.
    } else {
        request.headers.delete('x-csp-nonce'); // Deleting for security reasons.
        // i.e., We don’t allow bad actors to send a request with their own nonce.
    }
    return request; // Mutatable copy.
};

/**
 * Produces a hash of a given HTTP request.
 *
 * Properties, headers, and URL query vars are sorted for consistency. We hash a canonicalized URL; i.e., without query
 * vars and/or a #hash. Query vars are hashed separately and any #hash value is ignored entirely. Query vars are hashed
 * as decoded entries, such that we avoid encoding discrepancies across platforms; e.g., {@see https://o5p.me/mwt0RQ}.
 *
 * @param   request HTTP request.
 *
 * @returns         SHA-1 hash of HTTP request.
 *
 * @see requestPropertyDefaults(), which is what makes hashing possible.
 */
export const requestHash = $fnꓺmemo(2, async (request: $type.Request): Promise<string> => {
    const url = new URL(request.url),
        defaults = requestPropertyDefaults(),
        properties = requestProperties(request),
        unsortedProps = $obj.defaults(properties, defaults) as $type.StrKeyable;

    const sortedProps = Object.fromEntries([...Object.entries(unsortedProps)].sort((a, b) => a[0].localeCompare(b[0])));

    sortedProps.url = {
        canonical: $url.toCanonical(url), // i.e., Without ?query and/or #hash.
        queryVars: [...url.searchParams.entries()].sort((a, b) => a[0].localeCompare(b[0])),
    };
    sortedProps.headers = [...request.headers.entries()].sort((a, b) => a[0].localeCompare(b[0]));

    if (sortedProps.body /* Requires request clone. */) {
        sortedProps.body = await request.clone().text();
    }
    return await $crypto.sha1($json.stringify(sortedProps));
});

/**
 * Gets all request properties.
 *
 * @param   request HTTP request.
 *
 * @returns         Plain request object.
 */
export const requestProperties = $fnꓺmemo(2, (request: $type.Request): $type.StrKeyable<$type.Writable<$type.Request>> => {
    const allProps = Object.fromEntries($obj.allEntries(request));
    return $obj.pick(allProps, Object.keys(requestPropertyDefaults())) as ReturnType<typeof requestProperties>;
});

/**
 * Request has a supported method?
 *
 * @param   request HTTP request.
 *
 * @returns         True if request has a supported method.
 */
export const requestHasSupportedMethod = $fnꓺmemo(2, (request: $type.Request): boolean => {
    return supportedRequestMethods().includes(request.method);
});

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
 * WARNING: We do not, by default, vary caches based on `x-via`. Therefore, _only_ use this when processing an
 * uncacheable request type; e.g., `POST` request, or by explicitly declaring that a cache should vary on `x-via`.
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
 * Gets request property defaults.
 *
 * These are currently used as the basis for creating a {@see requestHash()}. They have been confirmed to align with
 * global {@see fetch()} defaults across Node v20.0.9, Cloudflare workers, JSDOM, and Chrome v122.0.6261.129. Our
 * `$http` {@see requestHash()} unit tests were also created to monitor cross-env consistency of these defaults.
 *
 * It is important that these remain cross-env compatible and perfectly aligned because in some cases there are SSR
 * requests that pass through our fetcher class, which caches response data, and must later match client-side keys.
 *
 * @param   request HTTP request.
 *
 * @returns         Request property defaults.
 */
export const requestPropertyDefaults = $fnꓺmemo((): $type.StrKeyable<Readonly<$type.Request>> => {
    return $obj.freeze({
        url: '',
        cache: 'default',
        credentials: 'same-origin',
        destination: '',
        integrity: '',
        keepalive: false,
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        referrer: 'about:client',
        referrerPolicy: '',
        isReloadNavigation: false,
        isHistoryNavigation: false,
        cf: undefined, // Cloudflare data.
        c10n: undefined, // Our own data.
        headers: new Headers(),
        body: null,
        bodyUsed: false,
    }) as unknown as ReturnType<typeof requestPropertyDefaults>;
});

/**
 * Supported HTTP request methods.
 *
 * @returns An array of supported HTTP request methods (uppercase).
 */
export const supportedRequestMethods = (): string[] => ['OPTIONS', 'HEAD', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

// ---
// Response utilities.

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
        varyOn: [],
        cacheVersion: '',

        maxAge: null,
        sMaxAge: null,
        staleAge: null,

        headers: {},
        appendHeaders: {},

        body: null,
        encodeBody: null,
    }) as Required<ResponseConfig>;
};

/**
 * Prepares an HTTP response.
 *
 * @param   request HTTP request.
 * @param   config  Optional; {@see ResponseConfig}.
 *
 * @returns         Mutatable HTTP response promise.
 */
export const prepareResponse = async (request: $type.Request, config?: ResponseConfig): Promise<$type.Response> => {
    const cfg = await responseConfig(config),
        url = $url.tryParse(request.url);

    /**
     * This will also be the case when preparing a request, which triggers a response error whenever the URL is
     * unparseable. In such a case, we return immediately with a 400 error status: Bad Request.
     */
    if (!url /* Catches unparseable URLs. */) {
        const url400 = new URL('https://0.0.0.0/'),
            cfg400 = await responseConfig({ status: 400, body: responseStatusText(400) }),
            needsContentBody = responseNeedsContentBody(request, cfg400.status, cfg400.body);

        return new Response((needsContentBody ? cfg400.body : null) as BodyInit | null, {
            status: cfg400.status,
            statusText: responseStatusText(cfg400.status),
            headers: await prepareResponseHeaders(request, url400, cfg400),
        });
    }

    /**
     * This CORs approach makes implementation simpler, because we consolidate the handling of `OPTIONS` into the
     * `enableCORs` flag, such that an explicit `OPTIONS` case handler does not need to be added by an implementation.
     * The case of `405` (method now allowed; i.e., default status) is in conflict with CORs being enabled. Thus, the
     * `OPTIONS` method is actually ok, because `enableCORs` was defined by the response config.
     */
    if (cfg.enableCORs && 'OPTIONS' === request.method && (!cfg.status || 405 === cfg.status)) {
        cfg.status = 204; // No content for CORs preflight requests.
    }
    if (!cfg.status /* Catches empty/invalid status. */) {
        const cfg500 = await responseConfig({ status: 500, body: responseStatusText(500) }),
            needsContentBody = responseNeedsContentBody(request, cfg500.status, cfg500.body);

        return new Response((needsContentBody ? cfg500.body : null) as BodyInit | null, {
            status: cfg500.status,
            statusText: responseStatusText(cfg500.status),
            headers: await prepareResponseHeaders(request, url, cfg500),
        });
    }

    /**
     * We only encode string body types at this time, and only gzip encoding is supported at this time. In a future
     * version of this library we may decide to support other body types and/or other encoding formats.
     *
     * In general, we do not allow the body of HTML documents to be encoded, because doing so would hinder our ability
     * to easily transform cacheable markup. The best approach for HTML is to utilize Cloudflare for on-the-fly
     * encoding, because we generally don’t want an HTML response to be encoded at this layer.
     */
    if (cfg.encodeBody && !$is.nul(cfg.body)) {
        if (!$is.string(cfg.body)) throw Error('SHfNesyN');
        if ('gzip' !== cfg.encodeBody) throw Error('rU2H3CfG');
        if (contentIsHTML(cfg.headers)) throw Error('DVsRapCc');

        const gzipBody = await $gzip.encode(cfg.body), // Compressed gzip byte array.
            gzipContentLength = gzipBody.length; // Compressed content length in bytes.

        if ($env.isCFW() /* {@see https://o5p.me/uXMnF4} */) {
            const _ = globalThis as $type.Keyable,
                FixedLengthStream = _.FixedLengthStream as typeof $type.cfw.FixedLengthStream,
                { writable: writableStream, readable: readableStream } = new FixedLengthStream(gzipContentLength);

            const writer = writableStream.getWriter();
            void writer.write(gzipBody), void writer.close();

            (readableStream as unknown as $type.Keyable)[$symbol.objReadableLength] = gzipContentLength;
            cfg.body = readableStream; // Readable stream includes a length property.
        } else {
            const readableStream = new Blob([gzipBody]).stream();
            (readableStream as unknown as $type.Keyable)[$symbol.objReadableLength] = gzipContentLength;
            cfg.body = readableStream; // Readable stream includes a length property.
        }
    }
    /**
     * A few points to remember:
     *
     * We want header preparation to consider a potentially encoded (e.g., gzipped) body content length. Therefore, it’s
     * important that we prepare response headers after we have already prepared & potentially encoded body above.
     *
     * The inclusion of a body {@see responseNeedsContentBody()} should not be considered by header preparation. For
     * example, a HEAD request should return all the same headers that a GET request does, which would include, for
     * example, the `content-length` of a body, or the `content-length` of an encoded body.
     */
    const headers = await prepareResponseHeaders(request, url, cfg),
        needsContentBody = responseNeedsContentBody(request, cfg.status, cfg.body);

    return new Response((needsContentBody ? cfg.body : null) as BodyInit | null, {
        status: cfg.status,
        statusText: responseStatusText(cfg.status),
        headers, // Prepared above; {@see prepareResponseHeaders()}.
        // Tells Cloudflare when we encoded manually; {@see https://o5p.me/fHo2ON}.
        ...(cfg.encodeBody && $env.isCFW() && !$is.nul(cfg.body) ? { encodeBody: 'manual' } : {}),
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

    cfg.headers = // Headers.
        cfg.headers instanceof Headers
            ? cfg.headers // Use existing instance.
            : new Headers((cfg.headers || {}) as HeadersInit);

    cfg.appendHeaders = // Appends.
        cfg.appendHeaders instanceof Headers
            ? cfg.appendHeaders // Use existing instance.
            : new Headers((cfg.appendHeaders || {}) as HeadersInit);

    // Populates always-on headers.

    alwaysOnHeaders['date'] = new Date().toUTCString();

    if (503 === cfg.status) {
        alwaysOnHeaders['retry-after'] = '300';
    }
    // Populates content-related headers.

    const needsContentHeaders // Response needs content headers?
        = responseNeedsContentHeaders(request, cfg.status, cfg.body); // prettier-ignore

    if (needsContentHeaders && !cfg.headers.has('content-type')) {
        contentHeaders['content-type'] = $mime.contentType('.txt');
    }
    if (needsContentHeaders && 'gzip' === cfg.encodeBody && !cfg.headers.has('content-encoding')) {
        contentHeaders['content-encoding'] = 'gzip';
    }
    if (needsContentHeaders && !cfg.headers.has('content-length') /* Simply saves time. */) {
        /**
         * Cloudflare will typically remove a `content-length` header when serving, because, by default, it does
         * on-the-fly chunked transfer-encoding. However, even in such a case, the `content-length` header is still
         * useful at runtime. For example, we look at `content-length` before deciding to cache a request.
         */
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
            //
        } else if (cfg.body instanceof ReadableStream && Object.hasOwn(cfg.body, $symbol.objReadableLength)) {
            contentHeaders['content-length'] = String((cfg.body as unknown as $type.Keyable)[$symbol.objReadableLength]);
        }
        /**
         * We don't acquire content-length for other `FormData|ReadableStream` body types.
         *
         * The only way to determine the length of multipart/form-data is to generate each of the parts and separate
         * them by boundaries, which is generally implementation-specific. Doing that much work would defeat the purpose
         * of passing a FormData instance to begin with, so we simply don’t do it. When possible, use
         * `application/x-www-form-urlencoded`; e.g., `URLSearchParams` instead of passing FormData.
         *
         * The only way to determine the length of a readable stream is to actually read the stream, which we don’t do,
         * as reading the stream would disturb the body of the stream, else it would require added memory to clone the
         * stream before reading. However, there are cases when a readable stream explicitly includes a length property;
         * e.g., Cloudflare FixedLengthStream, and some of our own readable streams.
         */
    }
    // Populates `cache-control` and cache-related headers.
    // `vary` is ignored by Cloudflare, except in one rare case: <https://o5p.me/k4Xx0j>.
    // That said, *we* use `?_ck` to vary based on `origin` via Cloudflare workers cache API.

    const varyOn = new Set((cfg.varyOn || []).map((v) => v.toLowerCase()));
    for (const v of varyOn) if (!request.headers.has(v)) varyOn.delete(v);

    if (cfg.enableCORs && request.headers.has('origin')) {
        varyOn.add('origin'); // CORs requires us to vary on origin.
    } else varyOn.delete('origin'); // Must not vary on origin.

    if (varyOn.size /* Add vary header? */) {
        cacheHeaders['vary'] = [...varyOn].join(', ');
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
                // 1h minimum on Cloudflare paid workers plan.
                // 2h minimum on Cloudflare on free workers plan.
                sMaxAge = Math.max($is.integer(sMaxAge) ? sMaxAge : maxAge, 0);
                sMaxAge = 0 === sMaxAge ? 0 : Math.max(Math.max(sMaxAge, maxAge), $time.hourInSeconds * 2);

                staleAge = Math.max($is.integer(staleAge) ? staleAge : Math.round(maxAge / 2), 0);
                staleAge = Math.min(staleAge, $time.dayInSeconds * 90); // 90 days max.

                cacheHeaders['cache-control'] = 'public, must-revalidate, max-age=' + String(maxAge) + ', s-maxage=' + String(sMaxAge) + ', stale-while-revalidate=' + String(staleAge) + ', stale-if-error=' + String(staleAge); // prettier-ignore
                cacheHeaders['cdn-cache-control'] = 0 === sMaxAge ? 'no-store' : 'public, must-revalidate, max-age=' + String(sMaxAge) + ', stale-while-revalidate=' + String(staleAge) + ', stale-if-error=' + String(staleAge); // prettier-ignore
            }
            if (cfg.encodeBody && !$is.nul(cfg.body)) {
                cacheHeaders['cache-control'] += ', no-transform';
                cacheHeaders['cdn-cache-control'] += ', no-transform';
            }
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
    cacheHeaders['x-cache-status'] = 'dynamic'; // Default status.

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
        // `access-control-allow-origin` is also set by our security headers.
        // When we have an origin, CORs headers will simply override security headers.
        corsHeaders['access-control-allow-origin'] = request.headers.get('origin') || '*';
        corsHeaders['access-control-allow-methods'] = supportedRequestMethods().join(', ');
        corsHeaders['access-control-allow-headers'] = corsRequestHeaderNames().join(', ');
        corsHeaders['access-control-expose-headers'] = corsResponseHeaderNames().join(', ');
    }
    // Merges and returns all headers.

    const headers = new Headers({ ...alwaysOnHeaders, ...contentHeaders, ...cacheHeaders, ...securityHeaders, ...corsHeaders });

    cfg.headers.forEach((value, name) => headers.set(name, value));
    cfg.appendHeaders.forEach((value, name) => headers.append(name, value));

    return headers;
};

/**
 * Gets all response properties.
 *
 * @param   response HTTP response.
 *
 * @returns          Plain response object.
 */
export const responseProperties = (response: $type.Response): $type.StrKeyable<$type.Writable<$type.Response>> => {
    const allProps = Object.fromEntries($obj.allEntries(response));

    return $obj.pick(allProps, [
        'ok', //
        'url',
        'type',
        'status',
        'statusText',
        'redirected',
        'body',
        'bodyUsed',
    ]) as ReturnType<typeof responseProperties>;
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
 * Response needs content headers?
 *
 * @param   request        HTTP request.
 * @param   responseStatus HTTP response status code.
 * @param   responseBody   HTTP response body.
 *
 * @returns                True if response needs content headers.
 *
 * @see https://fetch.spec.whatwg.org/#null-body-status
 */
export const responseNeedsContentHeaders = $fnꓺmemo(2, (request: $type.Request, responseStatus: number, responseBody: $type.BodyInit | null): boolean => {
    return requestHasSupportedMethod(request) && !['OPTIONS'].includes(request.method) && ![101, 103, 204, 205, 304].includes(responseStatus) && !$is.nul(responseBody);
});

/**
 * Response needs content body?
 *
 * @param   request        HTTP request.
 * @param   responseStatus HTTP response status code.
 * @param   responseBody   HTTP response body.
 *
 * @returns                True if response needs content body.
 *
 * @see https://fetch.spec.whatwg.org/#null-body-status
 */
export const responseNeedsContentBody = $fnꓺmemo(2, (request: $type.Request, responseStatus: number, responseBody: $type.BodyInit | null): boolean => {
    return requestHasSupportedMethod(request) && !['OPTIONS', 'HEAD'].includes(request.method) && ![101, 103, 204, 205, 304].includes(responseStatus) && !$is.nul(responseBody);
});

// ---
// Response cache utilities.

/**
 * Prepares a cached HTTP response.
 *
 * For performance reasons, this utility reserves the right to read the `.body` of the input response. The assumption is
 * that it’s OK to disturb `.body` when preparing a response that was pulled from a cache. By doing so, we avoid needing
 * to clone the input response before reading `.body`, which conserves memory.
 *
 * In the case of HTML we don’t transform a response that is encoded; e.g., gzipped, as it would be more resource
 * intensive than we’d like. In general, we do not allow the body of HTML documents to be encoded by our `$http`
 * utilities, because doing so would hinder our ability to easily transform markup. The best approach for HTML is to
 * utilize Cloudflare for on-the-fly encoding, because we don’t want an HTML response to be encoded at this layer.
 *
 * @param   request  HTTP request.
 * @param   response HTTP response from a cache.
 *
 * @returns          Mutatable HTTP response copy promise.
 *
 * @note Important to keep in mind that we are potentially dealing with a response to a byte range request here.
 *       In such a case, the response body could potentially be an HTML fragment based on the byte range
 *       requested by the caller and not necessarily a full and complete HTML document.
 *
 * @review An unfortunate edge case where it is possible for a byte range request to chop HTML markup into slices;
 *         e.g., slicing a CSP replacement code, which would cause the repopulation of CSP nonce replacement codes
 *         to break. Please work on ways to avoid the potential for this to occur.
 *
 *         - Currently unsure of how to fix this other than to try and prevent range requests on HTML files?
 *             - No, that’s really going in the wrong direction, because once it works, it works beautifully, so why destroy?
 *
 *         - Is it possible to partially replace nonce replacement codes in such a way that we adhere to range requests when doing so?
 *           - It may not be, but it might be partially possible and as a result would further reduce the potential for this to occur.
 *             Is the added dev time and complexity of overhead and maintenance going to be worth the effort?
 * ---
 * @review Uncached content served by our `$http` utilities will not return or support byte range requests.
 *         Thus, if a user happens to be the first one to request a given URL, that request will not support a
 *         range request. We should work to avoid this scenario such that all requests can support range requests.
 *
 *         - Is `cache.put()` followed by `cache.match()` consistent or eventually consistent?
 *           - Testing shows no, eventually consistent, so not possible.
 *
 *         - We could consider this a value-added feature brought about by Cloudflare’s cache, but not part of critical services.
 *           - In cases when byte range requests are critical to support we should really be thinking about static file hosting, yes?
 *             Or we should be implementing support for range requests within whatever is formulating responses, yes?
 */
export const prepareCachedResponse = async (request: $type.Request, response: $type.Response): Promise<$type.Response> => {
    if (
        contentIsHTML(response.headers) && //
        !contentIsEncoded(response.headers) &&
        request.headers.has('x-csp-nonce') &&
        response.headers.has('content-security-policy')
    ) {
        const cspNonceReplCode = $crypto.cspNonceReplacementCode(),
            cspNonce = request.headers.get('x-csp-nonce') || '',
            csp = response.headers.get('content-security-policy') || '';

        if (responseNeedsContentBody(request, response.status, response.body)) {
            // Content length does not and must not change. Otherwise, we would have to alter our `content-length` header,
            // which would get a little messy because it is possible we are actually dealing with a byte range request/response.
            // The length does not change here because CSP nonce replacement codes exactly match the length of CSP nonce values.

            const htmlMarkup = (await response.text()).replaceAll(cspNonceReplCode, cspNonce);
            response = new Response(htmlMarkup, response);
        } else {
            response = new Response(null, response); // Mutatable copy.
        }
        response.headers.set('content-security-policy', csp.replaceAll(cspNonceReplCode, cspNonce));
        //
    } else if (!responseNeedsContentBody(request, response.status, response.body)) {
        response = new Response(null, response); // Mutatable copy.
    } else {
        response = new Response(response.body as BodyInit, response); // Mutatable copy.
    }
    if ($env.isCFW() && response.headers.has('content-length') && !response.headers.has('accept-ranges')) {
        // The Cloudflare cache API supports byte range requests; {@see https://o5p.me/omV7Jx}.
        // When using a Cloudflare worker and caching, this signals our support for range requests.
        // Cloudflare only supports byte range requests whenever a `content-length` header is available.
        // However, Cloudflare strips away this header regardless, unless and until a `range:` request is made.
        // Therefore, to test support for byte range requests send a HEAD|GET request with a `range:` header.
        response.headers.set('accept-ranges', 'bytes');
    }
    response.headers.set('x-cache-status', 'hit; prepared');

    return response; // Mutatable copy.
};

/**
 * Prepares an HTTP response for a cache.
 *
 * This utility always clones the input response instead of disturbing `.body` of a response being served up. Even if we
 * don’t read `.body` here, we still need a clone, because what is returned by this utility will be read into a cache.
 * Cloning a response requires added memory. Therefore, this should only be used when the overhead is acceptable.
 *
 * In the case of HTML we don’t transform a response that is encoded; e.g., gzipped, as it would be more resource
 * intensive than we’d like. In general, we do not allow the body of HTML documents to be encoded by our `$http`
 * utilities, because doing so would hinder our ability to easily transform markup. The best approach for HTML is to
 * utilize Cloudflare for on-the-fly encoding, because we don’t want an HTML response to be encoded at this layer.
 *
 * @param   request  HTTP request.
 * @param   response HTTP response being served up.
 *
 * @returns          Mutatable HTTP response clone promise.
 */
export const prepareResponseForCache = async (request: $type.Request, response: $type.Response): Promise<$type.Response> => {
    response = response.clone(); // Must clone response, which requires added memory.
    response.headers.delete('x-cache-status'); // Serves no purpose in a cache.

    if (
        contentIsHTML(response.headers) && //
        !contentIsEncoded(response.headers) &&
        request.headers.has('x-csp-nonce') &&
        response.headers.has('content-security-policy')
    ) {
        const cspNonceReplCode = $crypto.cspNonceReplacementCode(),
            csp = response.headers.get('content-security-policy') || '';

        if (response.body) {
            // Content length does not and must not change. Otherwise, we would have to alter our `content-length` header,
            // which would get a little messy because it is possible we are later dealing with a byte range request/response.
            // The length does not change here because CSP nonce replacement codes exactly match the length of CSP nonce values.
            const htmlMarkup = (await response.text())
                // {@see https://regex101.com/r/oTjEIq/7} {@see https://regex101.com/r/1MioJI/9}.
                .replace(/(<script(?:\s+[^<>]*?)?\s+nonce\s*=\s*)(['"])[^'"<>]*\2/giu, '$1$2' + cspNonceReplCode + '$2')
                .replace(
                    /(<script(?:\s+[^<>]*?)?\s+id\s*=\s*(['"])global-data\2[^<>]*>(?:[\s\S](?!<\/script>))*)((['"]{0,1})cspNonce\4\s*:\s*)(['"])[^'"<>]*\5/iu,
                    '$1$3$5' + cspNonceReplCode + '$5',
                );
            response = new Response(htmlMarkup, response);
        }
        response.headers.set('content-security-policy', csp.replace(/'nonce-[^']+'/giu, `'nonce-${cspNonceReplCode}'`));
    }
    return response; // Mutatable clone.
};

// ---
// Heartbeat utilities.

/**
 * Logs a heartbeat for monitoring purposes.
 *
 * @param id      Heartbeat ID; e.g., `JGndBRX5LXN79q5q1GkpsmaQ`.
 * @param options All optional; {@see HeartbeatOptions}.
 */
export const heartbeat = async (id: string, options?: HeartbeatOptions): Promise<void> => {
    const opts = $obj.defaults({}, options || {}) as HeartbeatOptions,
        fetch = (opts.cfw ? opts.cfw.fetch : globalThis.fetch) as typeof globalThis.fetch;

    await fetch('https://uptime.betterstack.com/api/v1/heartbeat/' + $url.encode(id), {
        signal: AbortSignal.timeout($time.secondInMilliseconds),
    }).catch(() => undefined);
};

// ---
// Header utilities.

/**
 * Parses headers into a {@see $type.Headers} instance.
 *
 * @param   parseable Headers; {@see $type.RawHeadersInit}.
 *
 * @returns           Parsed headers into a {@see $type.Headers} instance.
 */
export const parseHeaders = (parseable: $type.RawHeadersInit): $type.Headers => {
    if (parseable instanceof Headers || $is.array(parseable)) {
        return new Headers(parseable as HeadersInit);
    }
    const headers = new Headers(); // Initialize headers instance.

    if ($is.object(parseable)) {
        for (let [name, value] of Object.entries(parseable)) {
            headers.set(name, value);
        }
    } else if ($is.string(parseable)) {
        const lines = parseable.split(/[\r\n]+/u);

        for (let i = 0, name = ''; i < lines.length; i++) {
            const line = lines[i]; // Current line.

            if (name && [' ', '\t'].includes(line[0])) {
                headers.set(name, ((headers.get(name) || '') + ' ' + line.trim()).trim());
                continue; // Multiline header concatenation.
            }
            if (!line.includes(':')) continue; // Invalid line.

            name = line.slice(0, line.indexOf(':')).toLowerCase().trim();
            const value = line.slice(line.indexOf(':') + 1).trim();

            if (!name) continue; // Invalid line.

            if (headers.has(name)) {
                headers.append(name, value);
            } else headers.set(name, value);
        }
    }
    return headers;
};

/**
 * Prepares `referer` based on from » to URLs & referrer policy.
 *
 * This is most useful when following redirect responses.
 *
 * @param headers       Headers instance, which may include a `referrer-policy` header.
 * @param fromParseable Parseable URL or string; e.g., a URL that is issuing a redirection.
 * @param toParseable   Parseable URL or string; e.g., a URL that is set as the redirect location.
 *
 * @note This does not return a value. It modifies an existing headers instance by reference.
 */
export const prepareRefererHeader = (headers: $type.Headers, fromParseable: $type.URL | string, toParseable: $type.URL | string): void => {
    const referrerPolicy = ((headers.get('referrer-policy') || '')
            .split(/\s*,\s*/u).slice(-1)[0] || '')
            .toLowerCase(), // prettier-ignore
        //
        fromURL = $url.tryParse(fromParseable),
        toURL = $url.tryParse(toParseable);

    if (!fromURL || !toURL) {
        headers.delete('referer');
        return; // Not possible.
    }
    let referer = ''; // Initialize.

    switch (referrerPolicy) {
        case '': // Empty.
        case 'no-referrer': {
            break; // No referrer.
        }
        case 'origin': {
            referer = fromURL.origin;
            break;
        }
        case 'unsafe-url': {
            referer = fromURL.toString();
            break;
        }
        case 'same-origin': {
            if (fromURL.origin === toURL.origin) {
                referer = fromURL.toString();
            }
            break;
        }
        case 'origin-when-cross-origin': {
            if (fromURL.origin === toURL.origin) {
                referer = fromURL.toString();
            } else {
                referer = fromURL.origin;
            }
            break;
        }
        case 'strict-origin': {
            if (!$url.isPotentiallyTrustworthy(fromURL)) {
                referer = fromURL.origin;
                //
            } else if ($url.isPotentiallyTrustworthy(toURL)) {
                referer = fromURL.origin;
            }
            break;
        }
        case 'no-referrer-when-downgrade': {
            if (!$url.isPotentiallyTrustworthy(fromURL)) {
                referer = fromURL.toString();
                //
            } else if ($url.isPotentiallyTrustworthy(toURL)) {
                referer = fromURL.toString();
            }
            break;
        }
        case 'strict-origin-when-cross-origin':
        default: {
            if (fromURL.origin === toURL.origin) {
                referer = fromURL.toString();
                //
            } else if (!$url.isPotentiallyTrustworthy(fromURL)) {
                referer = fromURL.origin;
                //
            } else if ($url.isPotentiallyTrustworthy(toURL)) {
                referer = fromURL.origin;
            }
        }
    }
    if (referer) {
        headers.set('referer', referer);
    } else {
        headers.delete('referer');
    }
};

/**
 * Gets clean content type from headers.
 *
 * @param   headers HTTP headers.
 *
 * @returns         Clean content type from headers.
 *
 *   - Clean MIME type. Lowercase, excluding `; charset=*`.
 */
export const cleanContentType = $fnꓺmemo(2, (headers: $type.HeadersInit): string => {
    return $mime.typeClean(parseHeaders(headers).get('content-type') || '');
});

/**
 * Checks if content is a given MIME or extension type.
 *
 * @param   headers  HTTP headers.
 * @param   extTypes MIME type(s) and/or canonical extension(s).
 *
 *   - Examples: `text/html`, `text/plain`, `html`, `txt`, or another extension.
 *
 * @returns          True if content is a given MIME or extension type.
 */
export const contentIsType = $fnꓺmemo(2, (headers: $type.HeadersInit, extTypes: string | string[]): boolean => {
    const cleanType = cleanContentType(headers);
    return $to
        .array(extTypes)
        .map((extType: string): string =>
            extType
                .toLowerCase()
                .split(/\s*;\s*/u)[0]
                .trim(),
        )
        .some((extType: string): boolean => {
            return (
                cleanType === extType || // e.g., `text/html`, `text/plain`.
                cleanType === $mime.cleanType('.' + $str.lTrim(extType, '.'))
            );
        });
});

/**
 * Content is HTML?
 *
 * @param   headers HTTP headers.
 *
 * @returns         True if content is HTML.
 */
export const contentIsHTML = $fnꓺmemo(2, (headers: $type.HeadersInit): boolean => {
    return contentIsType(headers, 'html'); // Leverages existing utility.
});

/**
 * Content is binary?
 *
 * @param   headers HTTP headers.
 *
 * @returns         True if content is binary.
 */
export const contentIsBinary = $fnꓺmemo(2, (headers: $type.HeadersInit): boolean => {
    return $mime.typeIsBinary(cleanContentType(headers));
});

/**
 * Content is encoded?
 *
 * @param   headers HTTP headers.
 *
 * @returns         True if content is encoded.
 */
export const contentIsEncoded = $fnꓺmemo(2, (headers: $type.HeadersInit): boolean => {
    return !['', 'none'].includes((parseHeaders(headers).get('content-encoding') || '').toLowerCase());
});

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
    'content-location',
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
    'x-cache-status',
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
 * Protected cross-domain header names.
 *
 * These contain potentially-sensitive data and should therefore not be included in redirected cross-domain requests.
 *
 * @returns An array of protected cross-domain header names (lowercase).
 */
export const protectedCrossDomainHeaderNames = (): string[] => [
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
    'x-cache-status',
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
        ...(opts.enableCORs ? { 'access-control-allow-origin': '*' } : {}),
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
