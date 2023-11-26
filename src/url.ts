/**
 * URL utilities.
 */

import './resources/init.ts';

import { $env, $is, $obj, $str, type $type } from './index.ts';
import { $fnꓺmemo } from './resources/standalone/index.ts';

/**
 * Defines types.
 */
export type CurrentSchemeOptions = { withMark?: boolean };
export type CurrentHostOptions = { withPort?: boolean };
export type CurrentRootHostOptions = { withPort?: boolean };
export type CurrentQueryOptions = { withMark?: boolean };
export type CurrentHashOptions = { withMark?: boolean };
export type RootHostOptions = { withPort?: boolean };
export type ParseOptions = { throwOnError?: boolean };
export type TryParseOptions = Omit<ParseOptions, 'throwOnError'>;
export type AddQueryVarOptions = { replaceExisting?: boolean };
export type QueryVars = { [x: string]: string };

/* ---
 * Local utilities.
 */

/**
 * Defines standardized local hosts by name.
 *
 * These can be used as hostnames, or as TLDs; e.g., `local`, `x.local`.
 *
 * @see https://en.wikipedia.org/wiki/Special-use_domain_name
 */
export const stdLocalHostnames = (): string[] => ['local', 'localhost'];

/**
 * Defines local host regular expression patterns.
 *
 * These match up with the IP/DNS addresses in our SSL certificates for local development.
 * `@clevercanyon/skeleton/dev/.files/bin/ssl-certs/generate.bash` has the complete list for review.
 */
export const localHostPatterns = $fnꓺmemo((): RegExp[] => [
    ...new Set([
        /^\[::\]$/u, // IPv6 null address.
        /^0\.0\.0\.0$/u, // IPv4 null address.

        /^\[::1\]$/u, // IPv6 loopback address.
        /^127\.0\.0\.1$/u, // IPv4 loopback address.

        // These can be used as hostnames, or as TLDs; e.g., `local`, `x.local`.
        ...stdLocalHostnames().map((name) => new RegExp('^(?:.+\\.)?' + $str.escRegExp(name) + '$', 'ui')),

        // These can only be used as TLDs; e.g., `x.mac`, `x.loc`, etc.
        ...['mac', 'loc', 'dkr', 'vm'].map((name) => new RegExp('^(?:.+\\.)' + $str.escRegExp(name) + '$', 'ui')),
    ]),
]);

/* ---
 * Current utilities.
 */

/**
 * Gets current URL.
 *
 * @returns Current; i.e., a full URL.
 *
 * @requiredEnv web
 */
export const current = (): string => {
    return location.href;
};

/**
 * Gets current referrer.
 *
 * @returns Current referrer.
 *
 * @requiredEnv web
 */
export const currentReferrer = (): string => {
    return document.referrer;
};

/**
 * Gets current scheme.
 *
 * @param   options Optional (all optional); {@see CurrentSchemeOptions}.
 *
 * @returns         Current scheme. By default, without the `:` mark.
 *
 * @requiredEnv web
 */
export const currentScheme = $fnꓺmemo({ deep: true, maxSize: 2 }, (options?: CurrentSchemeOptions): string => {
    const opts = $obj.defaults({}, options || {}, { withMark: false }) as Required<CurrentSchemeOptions>;
    return opts.withMark ? location.protocol : location.protocol.slice(0, -1);
});

/**
 * Gets current host with or without port number.
 *
 * @param   options Options (all optional); {@see CurrentHostOptions}.
 *
 * @returns         Current host. By default, with possible port number.
 *
 * @requiredEnv web
 */
export const currentHost = $fnꓺmemo({ deep: true, maxSize: 2 }, (options?: CurrentHostOptions): string => {
    const opts = $obj.defaults({}, options || {}, { withPort: true }) as Required<CurrentHostOptions>;
    return opts.withPort ? location.host : location.hostname;
});

/**
 * Gets current root host with or without port number.
 *
 * @param   options Options (all optional); {@see CurrentRootHostOptions}.
 *
 * @returns         Current root host. By default, with possible port number.
 *
 * @requiredEnv web
 */
export const currentRootHost = $fnꓺmemo({ deep: true, maxSize: 2 }, (options?: CurrentRootHostOptions): string => {
    const opts = $obj.defaults({}, options || {}, { withPort: true }) as Required<CurrentRootHostOptions>;
    return rootHost(currentHost(), { withPort: opts.withPort });
});

/**
 * Gets current port.
 *
 * @returns Current port.
 *
 * @requiredEnv web
 */
export const currentPort = $fnꓺmemo((): string => {
    return location.port;
});

/**
 * Gets current path.
 *
 * @returns Current path.
 *
 * @requiredEnv web
 */
export const currentPath = (): string => {
    return location.pathname;
};

/**
 * Gets current subpath.
 *
 * @returns Current subpath.
 *
 * @requiredEnv web
 */
export const currentSubpath = (): string => {
    return location.pathname.replace(/^\/+|\/+$/gu, '');
};

/**
 * Gets current query.
 *
 * @param   options Options (all optional); {@see CurrentQueryOptions}.
 *
 * @returns         Current query. By default, w/o leading `?` mark.
 *
 * @requiredEnv web
 */
export const currentQuery = (options?: CurrentQueryOptions): string => {
    const opts = $obj.defaults({}, options || {}, { withMark: false }) as Required<CurrentQueryOptions>;
    return opts.withMark ? location.search : location.search.slice(1);
};

/**
 * Gets current hash.
 *
 * @param   options Options (all optional); {@see CurrentHashOptions}.
 *
 * @returns         Current hash. By default, w/o leading `#` mark.
 *
 * @requiredEnv web
 */
export const currentHash = (options?: CurrentHashOptions): string => {
    const opts = $obj.defaults({}, options || {}, { withMark: false }) as Required<CurrentHashOptions>;
    return opts.withMark ? location.hash : location.hash.slice(1);
};

/**
 * Gets current path & query.
 *
 * @returns Current path & query.
 *
 * @requiredEnv web
 */
export const currentPathQuery = (): string => {
    return location.pathname + location.search;
};

/**
 * Gets current path, query, and hash.
 *
 * @returns Current path, query, and hash.
 *
 * @requiredEnv web
 */
export const currentPathQueryHash = (): string => {
    return location.pathname + location.search + location.hash;
};

/* ---
 * Current base utilities.
 */

/**
 * Gets current base URL.
 *
 * @returns Current base URL; i.e., a full URL.
 *
 * @requiredEnv web
 */
export const currentBase = (): string => {
    return document.baseURI;
};

/**
 * Gets current base path.
 *
 * @returns Current base path.
 *
 * @requiredEnv web
 */
export const currentBasePath = (): string => {
    return parse(currentBase()).pathname;
};

/**
 * Gets URL from current base.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           A full URL from current base.
 *
 * @requiredEnv web
 */
export const fromCurrentBase = (parseable: $type.URL | string): string => {
    return parse(parseable, currentBase()).toString();
};

/**
 * Gets root-relative path from current base.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           `[/base]/path?query#hash` from current base.
 *
 * @requiredEnv web
 */
export const pathFromCurrentBase = (parseable: $type.URL | string): string => {
    return toPathQueryHash(fromCurrentBase(parseable));
};

/**
 * Adds current base path.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           Parseable URL or string with current base path.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 *
 * @requiredEnv web
 *
 * @see addBasePath()
 */
export function addCurrentBasePath(parseable: $type.URL): $type.URL;
export function addCurrentBasePath(parseable: string): string;

export function addCurrentBasePath(parseable: $type.URL | string): $type.URL | string {
    return addBasePath(parseable, currentBase());
}

/**
 * Removes current base path.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           Parseable URL or string without current base path.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 *
 * @requiredEnv web
 *
 * @see removeBasePath()
 */
export function removeCurrentBasePath(parseable: $type.URL): $type.URL;
export function removeCurrentBasePath(parseable: string): string;

export function removeCurrentBasePath(parseable: $type.URL | string): $type.URL | string {
    return removeBasePath(parseable, currentBase());
}

/* ---
 * App base utilities.
 */

/**
 * Gets app’s base URL.
 *
 * @returns App’s base URL string.
 *
 * @throws  If `APP_BASE_URL` is missing.
 */
export const appBase = $fnꓺmemo((): string => {
    let appBaseURL: string; // Initialize.

    if (!(appBaseURL = $env.get('APP_BASE_URL', { type: 'string', default: '' }))) {
        throw new Error(); // Missing `APP_BASE_URL`.
    }
    return appBaseURL;
});

/**
 * Gets app’s base path.
 *
 * @returns App’s base path.
 */
export const appBasePath = $fnꓺmemo((): string => {
    return parse(appBase()).pathname;
});

/**
 * Gets URL from app’s base.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           A full URL from app’s base.
 */
export const fromAppBase = $fnꓺmemo(24, (parseable: $type.URL | string): string => {
    return parse(parseable, appBase()).toString();
});

/**
 * Gets root-relative path from app’s base.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           `/base/path?query#hash` from app’s base.
 */
export const pathFromAppBase = $fnꓺmemo(24, (parseable: $type.URL | string): string => {
    return toPathQueryHash(fromAppBase(parseable));
});

/**
 * Adds app’s base path.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           Parseable URL or string with app’s base path.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 *
 * @see addBasePath()
 */
function _addAppBasePath(parseable: $type.URL): $type.URL;
function _addAppBasePath(parseable: string): string;

function _addAppBasePath(parseable: $type.URL | string): $type.URL | string {
    return addBasePath(parseable, appBase());
}
export const addAppBasePath = $fnꓺmemo(24, _addAppBasePath);

/**
 * Removes app’s base path.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           Parseable URL or string without app’s base path.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 *
 * @see removeBasePath()
 */
function _removeAppBasePath(parseable: $type.URL): $type.URL;
function _removeAppBasePath(parseable: string): string;

function _removeAppBasePath(parseable: $type.URL | string): $type.URL | string {
    return removeBasePath(parseable, appBase());
}
export const removeAppBasePath = $fnꓺmemo(24, _removeAppBasePath);

/* ---
 * General base utilities.
 */

/**
 * Adds base path.
 *
 * @param   parseable Parseable URL or string.
 * @param   base      Base URL with a possible base path.
 *
 * @returns           Parseable URL or string with base path.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export function addBasePath(parseable: $type.URL, base: $type.URL | string): $type.URL;
export function addBasePath(parseable: string, base: $type.URL | string): string;
export function addBasePath(parseable: $type.URL | string, base: $type.URL | string): $type.URL | string;

export function addBasePath(parseable: $type.URL | string, base: $type.URL | string): $type.URL | string {
    base = $is.url(base) ? base : parse(base);
    let baseDirPath = base.pathname; // Initialize.

    const url = parse(parseable, base.origin + '/');
    let pathQueryHash = toPathQueryHash(url);

    const rtnURL = $is.url(parseable);
    const rtnPathQueryHash = !rtnURL && !isAbsolute(parseable);

    if (baseDirPath && !baseDirPath.endsWith('/')) {
        // No trailing slash interpreted as file path, not a base directory.
        baseDirPath = baseDirPath.replace(/\/[^/]+$/u, '/'); // One up, like {@see URL}.
        // e.g., `/page.html` will reduce to `/`, leaving everything else in the final path.
        // e.g., `/base/page.html` will reduce to `/base/`, leaving everything else in the final path.
    }
    if (!['', '/'].includes(baseDirPath) /* Saves time. */) {
        pathQueryHash = $str.rTrim(baseDirPath, '/') + pathQueryHash;
    }
    return rtnURL ? parse(pathQueryHash, url.origin + '/') : rtnPathQueryHash ? pathQueryHash : parse(pathQueryHash, url.origin + '/').toString();
}

/**
 * Removes base path.
 *
 * @param   parseable Parseable URL or string.
 * @param   base      Base URL with a possible base path.
 *
 * @returns           Parseable URL or string without base path.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export function removeBasePath(parseable: $type.URL, base: $type.URL | string): $type.URL;
export function removeBasePath(parseable: string, base: $type.URL | string): string;
export function removeBasePath(parseable: $type.URL | string, base: $type.URL | string): $type.URL | string;

export function removeBasePath(parseable: $type.URL | string, base: $type.URL | string): $type.URL | string {
    base = $is.url(base) ? base : parse(base);
    let baseDirPath = base.pathname; // Initialize.

    const url = parse(parseable, base.origin + '/');
    let pathQueryHash = toPathQueryHash(url);

    const rtnURL = $is.url(parseable);
    const rtnPathQueryHash = !rtnURL && !isAbsolute(parseable);

    if (baseDirPath && !baseDirPath.endsWith('/')) {
        // No trailing slash interpreted as file path, not a base directory.
        baseDirPath = baseDirPath.replace(/\/[^/]+$/u, '/'); // One up, like {@see URL}.
        // e.g., `/page.html` will reduce to `/`, leaving everything else in the final path.
        // e.g., `/base/page.html` will reduce to `/base/`, leaving everything else in the final path.
    }
    if (!['', '/'].includes(baseDirPath) /* Saves time. */) {
        pathQueryHash = pathQueryHash.replace(new RegExp('^' + $str.escRegExp($str.rTrim(baseDirPath, '/')) + '(?:$|/|([?#]))', 'u'), '$1');
    }
    pathQueryHash = './' + $str.lTrim(pathQueryHash, '/'); // Ensures a relative path with substance; i.e., no empty string.

    return rtnURL ? parse(pathQueryHash, url.origin + '/') : rtnPathQueryHash ? pathQueryHash : parse(pathQueryHash, url.origin + '/').toString();
}

/* ---
 * Conditional utilities.
 */

/**
 * Tests if a URL or string is absolute.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           True if URL or string is absolute.
 *
 * @note Protocol-relative URLs are also considered absolute.
 * @note Passing a full URL is allowed, but obviously it is absolute.
 */
export const isAbsolute = $fnꓺmemo(12, (parseable: $type.URL | string): boolean => {
    return $is.url(parseable) || /^(?:[^:/?#\s]+:)?\/\//u.test(parseable);
});

/**
 * Tests if a URL or string is protocol-relative.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           True if URL or string is protocol-relative.
 *
 * @note Protocol-relative URLs are also considered absolute.
 * @note Passing a full URL is allowed, but obviously it’s not protocol-relative.
 */
export const isProtoRelative = $fnꓺmemo(12, (parseable: $type.URL | string): boolean => {
    return !$is.url(parseable) && /^\/\//u.test(parseable);
});

/**
 * Tests if a URL or string is root-relative.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           True if URL or string is root-relative.
 *
 * @note Distinction: a root-relative path is not a relative path.
 * @note Passing a full URL is allowed, but obviously it’s not root-relative.
 */
export const isRootRelative = $fnꓺmemo(12, (parseable: $type.URL | string): boolean => {
    return !isAbsolute(parseable) && /^\//u.test(parseable as string);
});

/**
 * Tests if a URL or string is relative.
 *
 * @param   parseable Parseable URL or string.
 *
 * @returns           True if URL or string is relative.
 *
 * @note Distinction: a root-relative path is not a relative path.
 * @note Passing a full URL is allowed, but obviously it’s not relative.
 * @note An empty string is also considered to be relative; same as {@see URL}.
 */
export const isRelative = $fnꓺmemo(12, (parseable: $type.URL | string): boolean => {
    return !isAbsolute(parseable) && !/^\//u.test(parseable as string);
});

/* ---
 * Root host utilities.
 */

/**
 * Gets root hostname.
 *
 * @param   host    Host to parse. Optional in browser; i.e., default is {@see currentHost()}.
 * @param   options Options (all optional); {@see RootHostOptions}.
 *
 * @returns         Root hostname. By default, with possible port number.
 *
 * @requiredEnv web -- When `host` is not given explicitly.
 */
export const rootHost = $fnꓺmemo({ deep: true, maxSize: 12 }, (host?: $type.URL | string, options?: RootHostOptions): string => {
    const opts = $obj.defaults({}, options || {}, { withPort: true }) as Required<RootHostOptions>;

    if (undefined === host) {
        if ($env.isWeb()) host = currentHost();
        else throw new Error(); // Missing `host`.
    }
    // `host` becomes a string value; see below.
    let hostname: string; // Defined below.

    if ($is.url(host)) {
        const url = host; // As URL object.
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
        // In the case of `local`, `localhost`, these serve as hosts and also as TLDs.
        return host.split('.').slice(-1).join('.');
    }
    return host.split('.').slice(-2).join('.');
});

/* ---
 * Parsing utilities.
 */

/**
 * Parses a URL.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute. Bypass with `''` or `undefined`.
 * @param   options   Options (all optional); {@see ParseOptions}.
 *
 * @returns           A {@see URL} instance, else `undefined`.
 *
 *   - On failure this throws an error, or returns `undefined`, depending on `throwOnError` option.
 *   - `throwOnError` defaults to `true`. {@see tryParse()} for the opposite default behavior.
 *
 * @note An empty string is also considered to be relative (i.e., not absolute) by {@see isRelative()}, {@see isAbsolute()}, and {@see URL}.
 * @note An empty string is not accepted by {@see URL} for the `base` value, so please pass a real base, or `undefined`; e.g., by not passing one.
 *
 * @requiredEnv web -- When `parseable` is not given explicitly.
 */
export const parse = <Options extends ParseOptions>(
    parseable?: $type.URL | string,
    base?: $type.URL | string,
    options?: Options, // `ParseOptions`.
): Options extends ParseOptions & { throwOnError: false } ? $type.URL | undefined : $type.URL => {
    //
    const opts = $obj.defaults({}, options || {}, { throwOnError: true }) as Required<ParseOptions>;
    if ($is.url(parseable)) return new URL(parseable); // Simply a clone.

    if (undefined === parseable) {
        if ($env.isWeb()) parseable = current();
        // If not on the web, and a URL was not passed in, then it’s simply not parseable.
        // So we flag that as a dev-related error, and not as a parse error in our try/catch block below.
        else throw new Error(); // Missing `url`.
    }
    let strURL = parseable.toString();
    if (strURL && isProtoRelative(strURL)) {
        const scheme = $env.isWeb() ? currentScheme() : 'https';
        strURL = strURL.replace(/^\/\//u, scheme + '://');
    }
    let strBase = base ? base.toString() : '';
    if (strBase && isProtoRelative(strBase)) {
        const scheme = $env.isWeb() ? currentScheme() : 'https';
        strBase = strBase.replace(/^\/\//u, scheme + '://');
    }
    try {
        return new URL(strURL, strBase || undefined);
    } catch (error) {
        if (opts.throwOnError) throw error;
    }
    return undefined as ReturnType<typeof parse<Options>>;
};

/**
 * Tries to parse a URL.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute. Bypass with `''` or `undefined`.
 * @param   options   Options (all optional); {@see TryParseOptions}.
 *
 * @returns           A {@see URL} instance, else `undefined`.
 *
 * @someday {@see URL.canParse()} Not well supported at this time; {@see https://o5p.me/hRDw1w}.
 *
 * @requiredEnv web -- When `parseable` is not given explicitly.
 */
export const tryParse = (parseable?: $type.URL | string, base?: $type.URL | string, options?: TryParseOptions): $type.URL | undefined => {
    return parse(parseable, base, { ...options, throwOnError: false });
};

/**
 * Extracts hashless from a URL.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Hashless URL; i.e., without `#hash`.
 */
export const toHashless = (parseable?: $type.URL | string, base?: $type.URL | string): string => {
    const url = parse(parseable, base);
    url.hash = ''; // Removes hash.
    return url.toString();
};

/**
 * Extracts canonical from a URL.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Canonical URL; i.e., no trailing slash, and without `?query#hash`.
 *
 *   - Note: This does, intentionally, leave a lone trailing slash at the root path.
 */
export const toCanonical = (parseable?: $type.URL | string, base?: $type.URL | string): string => {
    const url = parse(parseable, base);

    url.pathname = $str.rTrim(url.pathname, '/') || '/';
    url.search = url.hash = ''; // We don’t use in canonical URLs.

    return url.toString();
};

/**
 * Extracts `/path` from a URL.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Extracted `/path`.
 */
export const toPath = (parseable?: $type.URL | string, base?: $type.URL | string): string => {
    return parse(parseable, base).pathname;
};

/**
 * Extracts `/path?query` from a URL.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Extracted `/path?query`.
 */
export const toPathQuery = (parseable?: $type.URL | string, base?: $type.URL | string): string => {
    const url = parse(parseable, base); // Acquires parts to return.
    return url.pathname + url.search;
};

/**
 * Extracts `/path?query#hash` from a URL.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Extracted `/path?query#hash`.
 */
export const toPathQueryHash = (parseable?: $type.URL | string, base?: $type.URL | string): string => {
    const url = parse(parseable, base); // Acquires parts to return.
    return url.pathname + url.search + url.hash;
};

/* ---
 * Query utilities.
 */

/**
 * Gets a query variable.
 *
 * @param   name      Query variable name.
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Query variable value, else `undefined`. This can also return an empty string. It only returns
 *   `undefined` when the query variable is entirely nonexistent; i.e., not in the parseable URL or string.
 */
export const getQueryVar = (name: string, parseable?: $type.URL | string, base?: $type.URL | string): string | undefined => {
    const url = parse(parseable, base);

    if (!url.searchParams.has(name)) {
        return undefined;
    }
    return url.searchParams.get(name) || '';
};

/**
 * Gets query variables.
 *
 * @param   names     Optional array of query variable names to get; i.e., excluding all others.
 *
 *   - Default is `[]`, which gets all query variables.
 *   - //
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Plain object containing query variables.
 */
export function getQueryVars(parseable?: $type.URL | string, base?: $type.URL | string): QueryVars;
export function getQueryVars(names: string[], parseable?: $type.URL | string, base?: $type.URL | string): QueryVars;

export function getQueryVars(...args: unknown[]): QueryVars {
    let names: string[];
    let parseable: undefined | $type.URL | string;
    let base: undefined | $type.URL | string;

    if (!args.length || !$is.array(args[0])) {
        names = []; // Not passed in this case.
        parseable = args[0] as undefined | $type.URL | string;
        base = args[1] as undefined | $type.URL | string;
    } else {
        names = (args[0] || []) as string[];
        parseable = args[1] as undefined | $type.URL | string;
        base = args[2] as undefined | $type.URL | string;
    }
    const url = parse(parseable, base);
    const vars: QueryVars = {}; // Initialize.

    if (![...url.searchParams].length) {
        return vars; // No query variables.
    }
    for (const [name, value] of url.searchParams) {
        vars[name] = value; // Populates variables.
    }
    if (names.length) {
        for (const name of Array.from(Object.keys(vars))) {
            if (!names.includes(name)) delete vars[name];
        }
    }
    return vars;
}

/**
 * Adds a query variable.
 *
 * @param   name      Query variable name.
 * @param   value     Query variable value.
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute. Bypass with `''` or `undefined`.
 * @param   options   Options (all optional); {@see AddQueryVarOptions}.
 *
 * @returns           Updated URL with query variable added.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export function addQueryVar(name: string, value: string, parseable: $type.URL, base?: $type.URL | string, options?: AddQueryVarOptions): $type.URL;
export function addQueryVar(name: string, value: string, parseable?: string, base?: $type.URL | string, options?: AddQueryVarOptions): string;
export function addQueryVar(name: string, value: string, parseable?: $type.URL | string, base?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string;

export function addQueryVar(name: string, value: string, parseable?: $type.URL | string, base?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string {
    return addQueryVars({ [name]: value }, parseable, base, options);
}

/**
 * Adds query variables.
 *
 * @param   vars      Query variables to add.
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute. Bypass with `''` or `undefined`.
 * @param   options   Options (all optional); {@see AddQueryVarOptions}.
 *
 * @returns           Updated URL with query variables added.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export function addQueryVars(vars: QueryVars, parseable: $type.URL, base?: $type.URL | string, options?: AddQueryVarOptions): $type.URL;
export function addQueryVars(vars: QueryVars, parseable?: string, base?: $type.URL | string, options?: AddQueryVarOptions): string;
export function addQueryVars(vars: QueryVars, parseable?: $type.URL | string, base?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string;

export function addQueryVars(vars: QueryVars, parseable?: $type.URL | string, base?: $type.URL | string, options?: AddQueryVarOptions): $type.URL | string {
    const opts = $obj.defaults({}, options || {}, { replaceExisting: true }) as Required<AddQueryVarOptions>;

    const url = parse(parseable, base);
    const rtnURL = $is.url(parseable);
    // Note: `undefined` check important, because `parse()` converts it to `current()` absolute.
    // It’s also important because `isAbsolute()` doesn’t accept an `undefined` value.
    const rtnPathQueryHash = !rtnURL && undefined !== parseable && !isAbsolute(parseable);

    for (const [name, value] of Object.entries(vars)) {
        if (opts.replaceExisting || !url.searchParams.has(name)) {
            url.searchParams.set(name, value);
        } // By default, replaces existing values.
    }
    url.searchParams.sort(); // Consistency.

    return rtnURL ? url : rtnPathQueryHash ? toPathQueryHash(url) : url.toString();
}

/**
 * Removes a query variable.
 *
 * @param   name      Query variable name.
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Updated URL with query variable removed.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export function removeQueryVar(name: string, parseable: $type.URL, base?: $type.URL | string): $type.URL;
export function removeQueryVar(name: string, parseable?: string, base?: $type.URL | string): string;
export function removeQueryVar(name: string, parseable?: $type.URL | string, base?: $type.URL | string): $type.URL | string;

export function removeQueryVar(name: string, parseable?: $type.URL | string, base?: $type.URL | string): $type.URL | string {
    return removeQueryVars([name], parseable, base);
}

/**
 * Removes query variables.
 *
 * @param   names     Optional array of query variable names to remove; i.e., keeping all others.
 *
 *   - Default is `[]`, which removes all query variables.
 *   - //
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Updated URL with query variables removed.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export function removeQueryVars(parseable: $type.URL, base?: $type.URL | string): $type.URL;
export function removeQueryVars(parseable?: string, base?: $type.URL | string): string;
export function removeQueryVars(parseable?: $type.URL | string, base?: $type.URL | string): $type.URL | string;

export function removeQueryVars(names: string[], parseable: $type.URL, base?: $type.URL | string): $type.URL;
export function removeQueryVars(names: string[], parseable?: string, base?: $type.URL | string): string;
export function removeQueryVars(names: string[], parseable?: $type.URL | string, base?: $type.URL | string): $type.URL | string;

export function removeQueryVars(...args: unknown[]): $type.URL | string {
    let names: string[];
    let parseable: undefined | $type.URL | string;
    let base: undefined | $type.URL | string;

    if (!args.length || !$is.array(args[0])) {
        names = []; // Not passed in this case.
        parseable = args[0] as undefined | $type.URL | string;
        base = args[1] as undefined | $type.URL | string;
    } else {
        names = (args[0] || []) as string[];
        parseable = args[1] as undefined | $type.URL | string;
        base = args[2] as undefined | $type.URL | string;
    }
    const url = parse(parseable, base);
    const rtnURL = $is.url(parseable);
    // Note: `undefined` check important, because `parse()` converts it to `current()` absolute.
    // It’s also important because `isAbsolute()` doesn’t accept an `undefined` value.
    const rtnPathQueryHash = !rtnURL && undefined !== parseable && !isAbsolute(parseable);

    for (const name of Array.from(url.searchParams.keys()))
        if (!names.length || names.includes(name)) {
            url.searchParams.delete(name);
        }
    url.searchParams.sort(); // Consistency.

    return rtnURL ? url : rtnPathQueryHash ? toPathQueryHash(url) : url.toString();
}

/**
 * Removes client|cache-side-only query variables.
 *
 * @param   parseable Parseable URL or string. Optional in browser; i.e., default is {@see current()}.
 * @param   base      Base URL. Required when parsing a URL that’s not absolute.
 *
 * @returns           Updated URL with client|cache-side-only query variables removed.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export function removeCSOQueryVars(parseable: $type.URL, base?: $type.URL | string): $type.URL;
export function removeCSOQueryVars(parseable?: string, base?: $type.URL | string): string;
export function removeCSOQueryVars(parseable?: $type.URL | string, base?: $type.URL | string): $type.URL | string;

export function removeCSOQueryVars(parseable?: $type.URL | string, base?: $type.URL | string): $type.URL | string {
    const url = parse(parseable, base);
    const rtnURL = $is.url(parseable);
    // Note: `undefined` check important, because `parse()` converts it to `current()` absolute.
    // It’s also important because `isAbsolute()` doesn’t accept an `undefined` value.
    const rtnPathQueryHash = !rtnURL && undefined !== parseable && !isAbsolute(parseable);

    for (const name of Array.from(url.searchParams.keys()))
        if (/^(?:ut[mx]_[a-z_0-9]+|_g[al]|(?:gcl|dcl|msclk|fbcl)(?:id|src)|wbraid|_ck)$/iu.test(name)) {
            url.searchParams.delete(name);
        }
    url.searchParams.sort(); // Consistency.

    return rtnURL ? url : rtnPathQueryHash ? toPathQueryHash(url) : url.toString();
}

/* ---
 * Encode/decode utilities.
 */

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
 * Encodes a URL component.
 *
 * @param   str      String to encode.
 * @param   strategy Strategy. Default is {@see queryRFC3986}.
 *
 *   - Use {@see queryRFC3986} for {@see rawurlencode()} PHP compatibility.
 *   - Use {@see queryRFC3986AWS4} for {@see rawurlencode()} PHP w/ AWS v4 compatibility.
 *   - Use {@see queryRFC1738} for {@see urlencode()} PHP compatibility.
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
