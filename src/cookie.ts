/**
 * Cookie utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $env, $is, $obj, $str, $url, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type Options = {
    domain?: string;
    path?: string;
    expires?: number;
    samesite?: string;
    secure?: boolean;
    httpOnly?: boolean;
};
export type ExistsOptions = {
    request?: $type.Request;
};
export type GetOptions = {
    request?: $type.Request;
    default?: string;
};
export type SetOptions = Options & {
    request?: $type.Request;
    responseHeaders?: $type.Headers;
};
export type DeleteOptions = SetOptions;

/**
 * Defines web cookie map.
 */
const webCookieMap: Map<string, string | undefined> = new Map();

/**
 * Defines regular expressions for a valid cookie name.
 */
const validRegExp = /^[a-z0-9_-]+$/iu, // Valid cookie name.
    invalidRegExp = /^(?:domain|path|expires|max-age|samesite|secure|httponly)$/iu;

/**
 * Checks if a cookie name is valid.
 *
 * @param   name Cookie name to consider.
 *
 * @returns      True if cookie name is valid.
 */
export const nameIsValid = (name: string): boolean => {
    return validRegExp.test(name) && !invalidRegExp.test(name);
};

/**
 * Parses a cookie header.
 *
 * @param   header Cookie header to parse.
 *
 *   - Optional on web. Default is `document.cookie`.
 *   - Or, you can pass a {@see $type.Request}; e.g., server-side, which may or may not contain a cookie header. If it does,
 *       that cookie header is what will be parsed. If not, then `header` simply defaults to an empty string.
 *
 * @returns        Parsed cookies object. Frozen to enforce readonly; i.e., since this function is memoized.
 *
 * @requiredEnv web -- When `header` is not given explicitly.
 */
export const parse = $fnꓺmemo(
    // Ensures no args is the same as passing `header: undefined`.
    { maxSize: 6, transformKey: (args: unknown[]): unknown[] => (args.length ? args : [undefined]) },

    (header?: string | $type.Request): Readonly<{ [x: string]: string }> => {
        const cookies: { [x: string]: string } = {};
        let isWebHeader = false; // Initialize.

        if (undefined === header) {
            if ($env.isWeb()) {
                isWebHeader = true;
                header = document.cookie;
            } else throw Error('cYBccffX');
            //
        } else if ($is.request(header)) {
            header = header.headers.get('cookie') || '';
        }
        for (const cookie of header.split(/\s*;\s*/)) {
            let name, value; // Initialize.
            const eqIndex = cookie.indexOf('=');

            if (-1 !== eqIndex) {
                name = cookie.substring(0, eqIndex);
                value = cookie.substring(eqIndex + 1);
            } else {
                [name, value] = [cookie, ''];
            }
            if ('' === name || !nameIsValid(name)) {
                continue; // Invalid name.
            }
            value = $str.unquote(value, { type: 'double' });
            cookies[$url.decode(name)] = $url.decode(value);
        }
        if (isWebHeader)
            for (const [key, value] of webCookieMap.entries())
                if (undefined === value) {
                    delete cookies[key]; // Deleted cookie.
                } else cookies[key] = value; // Latest value.

        return $obj.freeze(cookies);
    },
);

/**
 * Checks if a cookie exists.
 *
 * @param   name    Cookie name.
 * @param   options All optional; {@see ExistsOptions}.
 *
 * @returns         True if cookie exists.
 *
 * @requiredEnv web -- When `request` is not given explicitly via options.
 */
export const exists = $fnꓺmemo(
    {
        maxSize: 24, // Special handling of matching keys.
        // Special, because we don’t want deep equals on a request object.
        isMatchingKey: (a: unknown[], b: unknown[] | IArguments): boolean => {
            return (
                (a[0] as string) === (b[0] as string) && //
                (a[1] as ExistsOptions | undefined)?.request === (b[1] as ExistsOptions | undefined)?.request
            );
        },
    },
    (name: string, options?: ExistsOptions): boolean => {
        const opts = $obj.defaults({}, options || {}) as ExistsOptions,
            cookies = parse(opts.request); // Memoized for performance.

        return Object.hasOwn(cookies, name);
    },
);

/**
 * Gets a cookie value.
 *
 * @param   name    Cookie name.
 * @param   options All optional; {@see GetOptions}.
 *
 * @returns         Cookie value; else empty string.
 *
 * @requiredEnv web -- When `request` is not given explicitly via options.
 */
export const get = $fnꓺmemo(
    {
        maxSize: 24, // Special handling of matching keys.
        // Special, because we don’t want deep equals on a request object.
        isMatchingKey: (a: unknown[], b: unknown[] | IArguments): boolean => {
            return (
                (a[0] as string) === (b[0] as string) &&
                (a[1] as GetOptions | undefined)?.request === (b[1] as GetOptions | undefined)?.request &&
                (a[1] as GetOptions | undefined)?.default === (b[1] as GetOptions | undefined)?.default
            );
        },
    },
    (name: string, options?: GetOptions): string => {
        const opts = $obj.defaults({}, options || {}, { default: '' }) as GetOptions & { default: string },
            cookies = parse(opts.request); // Memoized for performance.

        return Object.hasOwn(cookies, name) ? cookies[name] : opts.default;
    },
);

/**
 * Sets a cookie value.
 *
 * @param name    Cookie name.
 * @param value   Cookie value.
 * @param options {@see SetOptions}.
 *
 * @requiredEnv web -- When `request`, `responseHeaders` are not given.
 */
export const set = (name: string, value: string, options?: SetOptions): void => {
    if (!nameIsValid(name)) {
        throw Error('zVYzdc6k'); // Invalid cookie name.
    }
    const isWeb = $env.isWeb(),
        request = options?.request,
        responseHeaders = options?.responseHeaders,
        url = request ? $url.parse(request.url) : undefined,
        isURR = url && request && responseHeaders ? true : false;

    if (!isURR && !isWeb) throw Error('gRcfkhUr');

    const opts = $obj.defaults({}, options || {}, {
        path: '/',
        expires: 31536000,
        samesite: 'lax',
        httpOnly: false,
        domain: isURR && url ? url.hostname : $url.currentHost({ withPort: false }),
        secure: isURR && url ? 'https:' === url.protocol : 'https' === $url.currentScheme(),
    }) as Required<Omit<SetOptions, 'request' | 'responseHeaders'>> & //
        Partial<Pick<SetOptions, 'request' | 'responseHeaders'>>;

    const domain = opts.domain ? '; domain=' + opts.domain : '',
        path = opts.path ? '; path=' + opts.path : '',
        expires = opts.expires <= -1 ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '; max-age=' + String(opts.expires),
        samesite = opts.samesite ? '; samesite=' + opts.samesite : '',
        secure = 'none' === opts.samesite.toLowerCase() || opts.secure ? '; secure' : '',
        httpOnly = isURR && opts.httpOnly ? '; httpOnly' : '';

    if (isURR && responseHeaders) {
        responseHeaders // Appends a new `set-cookie` header.
            .append('set-cookie', $url.encode(name) + '=' + $url.encode(value) + domain + path + expires + samesite + secure + httpOnly);
    } else {
        if ('' === value && opts.expires && opts.expires <= -1) {
            webCookieMap.set(name, undefined); // Deleted cookie.
        } else webCookieMap.set(name, value); // Cookie’s latest value.

        document.cookie = $url.encode(name) + '=' + $url.encode(value) + domain + path + expires + samesite + secure;
    }
    parse.flush(), exists.flush(), get.flush(); // Flushes memoization cache.
};

/**
 * Deletes a cookie.
 *
 * @param name    Cookie name.
 * @param options {@see DeleteOptions}.
 *
 * @requiredEnv web -- When `request`, `responseHeaders` are not given.
 */
const _delete = (name: string, options?: DeleteOptions): void => {
    return set(name, '', { ...options, expires: -1 });
};
export { _delete as delete }; // Must export reserved word as alias.
