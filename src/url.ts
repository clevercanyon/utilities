/**
 * URL utilities.
 */

import { $env, $fn, $is, $obj, $str, type $type } from './index.ts';
import { $fnꓺmemoize } from './resources/standalone/index.ts';

/**
 * Defines types.
 */
export type CurrentHostOptions = { withPort?: boolean };
export type CurrentRootHostOptions = { withPort?: boolean };
export type RootHostOptions = { withPort?: boolean };
export type ParseOptions = { throwOnError?: boolean };
export type TryParseOptions = Omit<ParseOptions, 'throwOnError'>;
export type AddQueryVarOptions = { replaceExisting?: boolean };

/**
 * RFC 1738 URL encoding strategy.
 */
export const queryRFC1738 = Symbol('queryRFC1738');

/**
 * RFC 3986 URL encoding strategy.
 */
export const queryRFC3986 = Symbol('queryRFC3986');

/**
 * RFC 3986 encoding encoding strategy w/ AWS v4 compat.
 */
export const queryRFC3986AWS4 = Symbol('queryRFC3986AWS4');

/**
 * Defines standardized local hosts by name.
 *
 * These can be used as hostnames, or as TLDs; e.g., `local`, `x.local`.
 *
 * @see https://en.wikipedia.org/wiki/Special-use_domain_name
 */
export const stdLocalHostnames = (): string[] => ['local', 'localhost'];

/**
 * Defines local host patterns.
 *
 * These match up with the IP/DNS addresses in our SSL certificates for local development.
 * `@clevercanyon/skeleton/dev/.files/bin/ssl-certs/generate.bash` has the complete list for review.
 */
export const localHostPatterns = $fnꓺmemoize((): string[] => [
    ...new Set([
        '\\[::\\]', // IPv6 null address.
        '0.0.0.0', // IPv4 null address.

        '\\[::1\\]', // IPv6 loopback address.
        '127.0.0.1', // IPv4 loopback address.

        // These can be used as hostnames, or as TLDs; e.g., `local`, `x.local`.
        ...stdLocalHostnames().map((name) => '{,*.}' + name),

        // These can only be used as TLDs; e.g., `x.mac`, `x.loc`, etc.
        ...['mac', 'loc', 'dkr', 'vm'].map((name) => '*.' + name),
    ]),
]);

/**
 * Gets current URL.
 *
 * @returns Current URL.
 */
export const current = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.href;
};

/**
 * Gets current app’s base URL.
 *
 * @returns Current app’s base URL.
 */
export const currentAppBase = (): string => {
    return $env.get('APP_BASE_URL', { type: 'string', default: '' });
};

/**
 * Gets current app’s base path.
 *
 * @returns Current app’s base path.
 */
export const currentAppBasePath = (): string => {
    return $env.get('APP_BASE_PATH', { type: 'string', default: '' });
};

/**
 * Gets current referrer.
 *
 * @returns Current referrer.
 */
export const currentReferrer = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return document.referrer;
};

/**
 * Gets current scheme.
 *
 * @returns Current scheme.
 */
export const currentScheme = $fnꓺmemoize((): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.protocol.toLowerCase().slice(0, -1);
});

/**
 * Gets current host.
 *
 * @param   options Options (all optional).
 *
 * @returns         Current host.
 */
export const currentHost = $fnꓺmemoize({ deep: true, maxSize: 2 }, (options: CurrentHostOptions = {}): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    const opts = $obj.defaults({}, options, { withPort: true }) as Required<CurrentHostOptions>;
    return (opts.withPort ? location.host : location.hostname).toLowerCase();
});

/**
 * Gets current root host.
 *
 * @param   options Options (all optional).
 *
 * @returns         Current root host.
 */
export const currentRootHost = $fnꓺmemoize({ deep: true, maxSize: 2 }, (options: CurrentRootHostOptions = {}): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    const opts = $obj.defaults({}, options, { withPort: true }) as Required<CurrentRootHostOptions>;
    return rootHost(currentHost.fresh({ withPort: opts.withPort }), { withPort: opts.withPort });
});

/**
 * Gets current port.
 *
 * @returns Current port.
 */
export const currentPort = $fnꓺmemoize((): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.port;
});

/**
 * Gets current path.
 *
 * @returns Current path.
 */
export const currentPath = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.pathname;
};

/**
 * Gets current subpath.
 *
 * @returns Current subpath.
 */
export const currentSubpath = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.pathname.replace(/^\/|\/$/gu, '');
};

/**
 * Gets current query string w/o leading `?`.
 *
 * @returns Current query string w/o leading `?`.
 */
export const currentQuery = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.search.slice(1);
};

/**
 * Gets current hash w/o leading `#`.
 *
 * @returns Current hash w/o leading `#`.
 */
export const currentHash = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.hash.slice(1);
};

/**
 * Gets current path & query string.
 *
 * @returns Current path & query string.
 */
export const currentPathQuery = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.pathname + location.search;
};

/**
 * Gets current path, query string, and hash.
 *
 * @returns Current path, query string, and hash.
 */
export const currentPathQueryHash = (): string => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;
    return location.pathname + location.search + location.hash;
};

/**
 * Formulates URL from current app’s base.
 *
 * @param   pathQueryHash /path?query#hash to end on.
 *
 * @returns               https://x.tld[/base]/path?query#hash from current app’s base.
 *
 * @note We intentionally do not do any parsing, validating, slicing, or dicing here.
 *       Callers expect this will be nothing more than a prepending of the base URL.
 *
 * @todo Should this throw if there is no base URL?
 */
export const fromAppBase = (pathQueryHash: string): string => {
    return currentAppBase() + pathQueryHash;
};

/**
 * Formulates root-relative URL path from current app’s base path.
 *
 * @param   pathQueryHash /path?query#hash to end on.
 *
 * @returns               [/base]/path?query#hash from current app’s base path.
 *
 * @note We intentionally do not do any parsing, validating, slicing, or dicing here.
 *       Callers expect this will be nothing more than a prepending of the base path.
 */
export const pathFromAppBase = (pathQueryHash: string): string => {
    return currentAppBasePath() + pathQueryHash;
};

/**
 * Tests a string URL to see if it’s absolute.
 *
 * @param   url String URL for this method to parse.
 *
 * @returns     True if the URL is absolute.
 *
 * @note URLs with a relative protocol are also absolute.
 */
export const isAbsolute = $fnꓺmemoize(12, (url: string): boolean => {
    return /^(?:[^:/?#\s]+:)?\/\//u.test(url);
});

/**
 * Tests a string URL to see if it’s root-relative.
 *
 * @param   url String URL for this method to parse.
 *
 * @returns     True if the URL is root-relative.
 */
export const isRootRelative = $fnꓺmemoize(12, (url: string): boolean => {
    return /^\//u.test(url) && !isAbsolute(url);
});

/**
 * Tests a string URL to see if it’s relative.
 *
 * @param   url String URL for this method to parse.
 *
 * @returns     True if the URL is relative.
 */
export const isRelative = $fnꓺmemoize(12, (url: string): boolean => {
    return /^./u.test(url) || (!isAbsolute(url) && !isRootRelative(url) && !isHashOnly(url));
});

/**
 * Tests a string URL to see if it’s a query only.
 *
 * @param   url String URL for this method to parse.
 *
 * @returns     True if the URL is a query only.
 */
export const isQueryOnly = $fnꓺmemoize(12, (url: string): boolean => {
    return /^\?/u.test(url);
});

/**
 * Tests a string URL to see if it’s a hash only.
 *
 * @param   url String URL for this method to parse.
 *
 * @returns     True if the URL is a hash only.
 */
export const isHashOnly = $fnꓺmemoize(12, (url: string): boolean => {
    return /^#/u.test(url);
});

/**
 * Gets root hostname.
 *
 * @param   host     Host for this method to parse.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   withPort Include port? Default is `true`.
 *
 * @returns          Root hostname.
 */
export const rootHost = $fnꓺmemoize({ deep: true, maxSize: 12 }, (host?: $type.URL | string, options: RootHostOptions = {}): string => {
    const opts = $obj.defaults({}, options, { withPort: true }) as Required<RootHostOptions>;

    if (undefined === host) {
        if ($env.isWeb()) {
            host = currentHost({ withPort: opts.withPort });
        } else {
            throw new Error('Missing `host`.');
        }
    }
    // `host` becomes a string value.
    let hostname: string; // Defined below.

    if ($is.url(host)) {
        const url = host; // As URL object here.
        (host = url.host), (hostname = url.hostname);
        //
    } else if ($str.isIPv6Host(host)) {
        // e.g., `[::1]:3000`, always in brackets.
        hostname = host.replace(/(\])(?::[0-9]+)$/u, '$1');
    } else {
        // e.g., `:3000`, following a host; e.g., name|IP.
        hostname = host.replace(/:[0-9]+$/u, '');
    }
    host = host.toLowerCase();
    hostname = hostname.toLowerCase();
    if (!opts.withPort) host = hostname;

    if ($str.isIPHost(host)) {
        return host; // IPs don’t support subdomains.
    }
    const localHostnames = stdLocalHostnames(); // Once and use below.

    if (localHostnames.includes(hostname) || localHostnames.find((localHostname) => hostname.endsWith('.' + localHostname))) {
        // When the TLD itself has no extension; e.g., `local`, `localhost`, `foo.localhost`.
        return host.split('.').slice(-1).join('.');
    }
    return host.split('.').slice(-2).join('.');
});

/**
 * Parses a URL string into a {@see URL}.
 *
 * @param   url     URL for this method to parse.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   base    Base URL. Required for relative URLs.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   options Options (all optional); {@see ParseOptions}.
 *
 * @returns         A {@see URL} instance. On failure this either throws an error or returns `undefined`.
 *
 *   - `throwOnError` defaults to `true`. {@see tryParse()} for the opposite default behavior.
 */
export const parse = <Options extends ParseOptions>(
    url?: $type.URL | string,
    base?: $type.URL | string,
    options?: Options,
): Options extends ParseOptions & { throwOnError: false } ? $type.URL | undefined : $type.URL => {
    const opts = $obj.defaults({}, options || {}, { throwOnError: true }) as Required<ParseOptions>;

    if (undefined === url) {
        if ($env.isWeb()) url = current();
        else {
            throw new Error('Missing `url`.');
        }
    }
    if (undefined === base) {
        base = $env.isWeb() ? current() : '';
    }
    let strURL = url.toString();
    let strBase = base.toString();

    if (strURL && /^\/\//u.test(strURL)) {
        strURL = strURL.replace(/^\/\//u, ($env.isWeb() ? currentScheme() : 'https') + '://');
    }
    if (strBase && /^\/\//u.test(strBase)) {
        strBase = strBase.replace(/^\/\//u, ($env.isWeb() ? currentScheme() : 'https') + '://');
    }
    return $fn.try(() => new URL(strURL, strBase || undefined), undefined, { throwOnError: opts.throwOnError })() as ReturnType<typeof parse<Options>>;
};

/**
 * Tries to parse a URL string into a {@see URL}.
 *
 * @param   url     URL for this method to parse.
 * @param   base    Base URL. Required for relative URLs.
 * @param   options Options (all optional); {@see TryParseOptions}.
 *
 * @returns         A {@see URL} instance, else `undefined` on failure.
 *
 *   - `throwOnError` is forced `false`. {@see parse()} if you need control over this behavior.
 */
export const tryParse = (url?: $type.URL | string, base?: $type.URL | string, options?: TryParseOptions): $type.URL | undefined => {
    return parse(url, base, { ...options, throwOnError: false });
};

/**
 * Gets a query string variable.
 *
 * @param   name Query string variable name.
 * @param   url  URL from which to parse query string variable.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns      Query string variable value, else `undefined` if does not exist.
 */
export const getQueryVar = (name: string, url?: $type.URL | string): string | undefined => {
    const objURL = parse(url);

    if (!objURL.searchParams.has(name)) {
        return undefined; // Does not exist.
    }
    return objURL.searchParams.get(name) || '';
};

/**
 * Gets query string variables.
 *
 * @param   names Optional array of query string variable names to get; excluding others.
 *
 *   - Default is `[]`; i.e., get all query string variables.
 *   - If only one parameter is given and it's not an array, this parameter is treated as the `url` parameter instead of
 *       `names`. Please review the various functions signatures below for further details.
 *
 * @param   url   URL from which to parse query string variables.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns       Query string variables as a plain object.
 */
export function getQueryVars(url?: $type.URL | string): { readonly [x: string]: string };
export function getQueryVars(names: string[] | $type.URL | string, url?: $type.URL | string): { readonly [x: string]: string };

export function getQueryVars(names: string[] | $type.URL | string = [], url?: $type.URL | string): { readonly [x: string]: string } {
    if (1 === arguments.length && !$is.array(arguments[0])) {
        (names = []), (url = arguments[0] as undefined | $type.URL | string);
    }
    if (!$is.array(names)) {
        names = []; // Force array.
    }
    const objURL = parse(url);
    const vars: { [x: string]: string } = {};

    if (![...objURL.searchParams].length) {
        return vars; // No query string variables.
    }
    for (const [name, value] of objURL.searchParams) {
        vars[name] = value; // Populates variables.
    }
    if (names.length) {
        for (const name of Array.from(Object.keys(vars))) {
            if (!names.includes(name)) delete vars[name];
        }
    }
    return vars; // Query string variables.
}

/**
 * Adds a query string variable to a URL.
 *
 * @param   name    Query string variable name.
 * @param   value   Query string variable value.
 * @param   url     URL to add query string variable to.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   options Options (all optional). Default is `{ replaceExisting: true }`.
 *
 * @returns         Updated URL with query string variable added.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 */
export function addQueryVar(name: string, value: string, url: $type.URL, options?: AddQueryVarOptions): $type.URL;
export function addQueryVar(name: string, value: string, url?: string, options?: AddQueryVarOptions): string;
export function addQueryVar(name: string, value: string, url?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string;

export function addQueryVar(name: string, value: string, url?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string {
    return addQueryVars({ [name]: value }, url, options);
}

/**
 * Adds query string variables.
 *
 * @param   vars    Query string variables to add.
 * @param   url     URL to add query string variables to.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 * @param   options Options (all optional). Default is `{ replaceExisting: true }`.
 *
 * @returns         URL with query string variables added.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 */
export function addQueryVars(vars: { [x: string]: string }, url: $type.URL, options?: AddQueryVarOptions): $type.URL;
export function addQueryVars(vars: { [x: string]: string }, url?: string, options?: AddQueryVarOptions): string;
export function addQueryVars(vars: { [x: string]: string }, url?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string;

export function addQueryVars(vars: { [x: string]: string }, url?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string {
    const opts = $obj.defaults({}, options || {}, { replaceExisting: true }) as Required<AddQueryVarOptions>;

    const rtnObjURL = $is.url(url);
    const objURL = parse(url);

    for (const [name, value] of Object.entries(vars)) {
        if (opts.replaceExisting || !objURL.searchParams.has(name)) {
            objURL.searchParams.set(name, value);
        } // By default, replaces existing values.
    }
    objURL.searchParams.sort(); // Consistency.

    return rtnObjURL ? objURL : objURL.toString();
}

/**
 * Removes a query string variable from a URL.
 *
 * @param   name Query string variable name.
 * @param   url  URL to remove query string variable from.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns      Updated URL with query string variable removed.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 */
export function removeQueryVar(name: string, url: $type.URL): $type.URL;
export function removeQueryVar(name: string, url?: string): string;
export function removeQueryVar(name: string, url?: $type.URL | string): $type.URL | string;

export function removeQueryVar(name: string, url?: $type.URL | string): $type.URL | string {
    return removeQueryVars([name], url);
}

/**
 * Removes query string variables.
 *
 * @param   names Optional array of query string variable names to remove.
 *
 *   - Default is `[]`; i.e., remove all query string variables.
 *   - If only one parameter is given and it's not an array, this parameter is treated as the `url` instead of `names`.
 *       Please review the various functions signatures below for further details.
 *
 * @param   url   URL to remove query string variables from.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns       URL with query string variables removed.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 */
export function removeQueryVars(url: $type.URL): $type.URL;
export function removeQueryVars(url?: string): string;
export function removeQueryVars(url?: $type.URL | string): $type.URL | string;

export function removeQueryVars(names: string[], url: $type.URL): $type.URL;
export function removeQueryVars(names: string[], url?: string): string;
export function removeQueryVars(names: string[], url?: $type.URL | string): $type.URL | string;

export function removeQueryVars(names: string[] | $type.URL | string = [], url?: $type.URL | string): $type.URL | string {
    if (1 === arguments.length && !$is.array(arguments[0])) {
        (names = []), (url = arguments[0] as undefined | $type.URL | string);
    }
    if (!$is.array(names)) {
        names = []; // Force array.
    }
    const rtnObjURL = $is.url(url);
    const objURL = parse(url);

    for (const name of Array.from(objURL.searchParams.keys())) {
        if (!names.length || names.includes(name)) {
            objURL.searchParams.delete(name);
        }
    }
    objURL.searchParams.sort(); // Consistency.

    return rtnObjURL ? objURL : objURL.toString();
}

/**
 * Removes (client|cache)-side-only query string variables.
 *
 * @param   url URL to remove query string variables from.
 *
 *   - Optional in browser; i.e., default is {@see current()}.
 *
 *
 * @returns     URL with (client|cache)-side-only query string variables removed.
 *
 *   - Returns a {@see URL} if input `url` was a {@see URL}. A string otherwise.
 */
export function removeCSOQueryVars(url: $type.URL): $type.URL;
export function removeCSOQueryVars(url?: string): string;
export function removeCSOQueryVars(url?: $type.URL | string): $type.URL | string;

export function removeCSOQueryVars(url?: $type.URL | string): $type.URL | string {
    const rtnObjURL = $is.url(url);
    const objURL = parse(url);

    for (const name of Array.from(objURL.searchParams.keys())) {
        if (/^(?:ut[mx]_[a-z_0-9]+|_g[al]|(?:gcl|dcl|msclk|fbcl)(?:id|src)|wbraid|_ck)$/iu.test(name)) {
            objURL.searchParams.delete(name);
        }
    }
    objURL.searchParams.sort(); // Consistency.

    return rtnObjURL ? objURL : objURL.toString();
}

/**
 * Encodes a URL component.
 *
 * @param   str      String to encode.
 * @param   strategy Strategy. Default is {@see queryRFC3986}.
 *
 *   - Use {@see queryRFC3986} for {@see rawurlencode()} PHP compatibility.
 *   - Use {@see queryRFC3986AWS4} for {@see rawurlencode()} PHP w/ AWS v4 compatibility.
 *   - Use {@see queryRFC1738} for {@see urlencode()} PHP compatibility.
 *
 *
 * @returns          Encoded string.
 *
 * @note Inspired by <https://locutus.io/php/url/urlencode/>.
 * @note Inspired by <https://locutus.io/php/url/rawurlencode/>.
 */
export const encode = (str: string, strategy: symbol = queryRFC3986): string => {
    switch (strategy) {
        case queryRFC1738:
            return encodeURIComponent(str)
                .replace(/[!'()*~]/gu, function (c) {
                    return '%' + c.charCodeAt(0).toString(16).toUpperCase();
                })
                .replace(/%20/gu, '+');

        case queryRFC3986:
        case queryRFC3986AWS4:
        default: // Default strategy.
            return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
                return '%' + c.charCodeAt(0).toString(16).toUpperCase();
            });
    }
};

/**
 * Decodes a URL component.
 *
 * @param   str      String to decode.
 * @param   strategy Strategy. Default is {@see queryRFC3986}.
 *
 *   - Use {@see queryRFC3986} for {@see rawurldecode()} PHP compatibility.
 *   - Use {@see queryRFC3986AWS4} for {@see rawurldecode()} PHP w/ AWS v4 compatibility.
 *   - Use {@see queryRFC1738} for {@see urldecode()} PHP compatibility.
 *
 *
 * @returns          Decoded string.
 *
 * @note Inspired by <https://locutus.io/php/url/urldecode/>.
 * @note Inspired by <https://locutus.io/php/url/rawurldecode/>.
 */
export const decode = (str: string, strategy: symbol = queryRFC3986): string => {
    switch (strategy) {
        case queryRFC1738:
            return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25').replace(/\+/gu, '%20'));

        case queryRFC3986:
        case queryRFC3986AWS4:
        default: // Default strategy.
            return decodeURIComponent(str.replace(/%(?![0-9a-f]{2})/giu, () => '%25'));
    }
};
