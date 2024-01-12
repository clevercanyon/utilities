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
};
export type ExistsOptions = {
    request?: $type.Request;
};
export type GetOptions = {
    request?: $type.Request;
    default?: string;
};

/**
 * Defines web cookie map.
 */
const webCookieMap: Map<string, string | undefined> = new Map();

/**
 * Parses a cookie header.
 *
 * @param   header Cookie header to parse.
 *
 *   - Optional on web. Default is `document.cookie`.
 *   - Or, you can pass a {@see $type.Request}; e.g., server-side, which may or may not contain a cookie header. If it does,
 *       that cookie header is what will be parsed. If not, then `header` simply defaults to an empty string.
 *
 * @returns        Parsed cookies object, frozen.
 *
 * @note Function is memoized. Parsed cookies object is readonly.
 *
 * @requiredEnv web -- When `header` is not given explicitly.
 */
export const parse = $fnꓺmemo(
    // Ensures no args is the same as passing `header: undefined`.
    { maxSize: 6, transformKey: (args: unknown[]): unknown[] => (args.length ? args : [undefined]) },
    //
    (header?: string | $type.Request): Readonly<{ [x: string]: string }> => {
        let isWebCookieHeader = false;
        const cookies: { [x: string]: string } = {};

        if (undefined === header) {
            if ($env.isWeb()) {
                header = document.cookie;
                isWebCookieHeader = true;
            } else {
                throw Error('cYBccffX'); // Missing `header`.
            }
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
        if (isWebCookieHeader) {
            // Reflect latest runtime cookie changes.
            for (const [key, value] of webCookieMap.entries()) {
                if (undefined === value) {
                    delete cookies[key]; // Deleted cookie.
                } else {
                    cookies[key] = value; // Latest value.
                }
            }
        }
        // Enforces readonly.
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
            cookies = parse(opts.request); // Parser is memoized (important).

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
            cookies = parse(opts.request); // Parser is memoized (important).

        return Object.hasOwn(cookies, name) ? cookies[name] : opts.default;
    },
);

/**
 * Sets a cookie value.
 *
 * @param name    Cookie name.
 * @param value   Cookie value.
 * @param options Options (all optional); {@see Options}.
 *
 * @requiredEnv web
 */
export const set = (name: string, value: string, options: Options = {}): void => {
    if (!nameIsValid(name)) {
        throw Error('zVYzdc6k'); // Invalid name: `' + name + '`.
    }
    const opts = $obj.defaults({}, options, {
        domain: $url.currentHost({ withPort: false }),
        path: '/',
        expires: 31536000,
        samesite: 'lax',
        secure: 'https' === $url.currentScheme(),
    }) as Required<Options>;

    const domain = opts.domain ? '; domain=' + opts.domain : '';
    const path = opts.path ? '; path=' + opts.path : '';
    const expires = opts.expires <= -1 ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '; max-age=' + String(opts.expires);
    const samesite = opts.samesite ? '; samesite=' + opts.samesite : '';
    const secure = 'none' === opts.samesite.toLowerCase() || opts.secure ? '; secure' : '';

    // The `httpOnly` attribute is explicitly `false` when using JavaScript.
    // See: <https://stackoverflow.com/a/14691716>.

    document.cookie = $url.encode(name) + '=' + $url.encode(value) + domain + path + expires + samesite + secure;

    if ('' === value && opts.expires && opts.expires <= -1) {
        webCookieMap.set(name, undefined); // Deleted cookie.
    } else {
        webCookieMap.set(name, value); // Cookie’s latest value.
    }
    parse.flush(), exists.flush(), get.flush(); // Flushes memoization cache.
};

/**
 * Deletes a cookie.
 *
 * @param name    Cookie name.
 * @param options Options (all optional).
 *
 * @requiredEnv web
 */
const _delete = (name: string, options: Options = {}): void => {
    set(name, '', { ...options, expires: -1 });
};
export { _delete as delete }; // Must export reserved word as alias.

/**
 * Checks if a cookie name validates.
 *
 * @param   name Cookie name.
 *
 * @returns      True if cookie name validates.
 */
export const nameIsValid = (name: string): boolean => {
    return /^[a-z0-9_-]+$/iu.test(name) && !/^(?:domain|path|expires|max-age|samesite|secure|httponly)$/iu.test(name);
};
