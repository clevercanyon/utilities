/**
 * Cookie utilities.
 */

import { $env, $obj, $str, $url, type $type } from './index.ts';
import { $fnꓺmemoize } from './resources/standalone/index.ts';

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

/**
 * Defines DOM cookie map.
 */
const documentCookieMap: Map<string, string | undefined> = new Map();

/**
 * Parses a cookie header.
 *
 * @param   header Cookie header to parse.
 *
 *   - Optional on web. Default is `document.cookie`.
 *
 *
 * @returns        Parsed cookies object.
 *
 * @note Function is memoized. Parsed cookies object is readonly.
 */
export const parse = $fnꓺmemoize(6, (header?: string): { readonly [x: string]: string } => {
    let isDocumentCookieHeader = false;
    const cookies: { [x: string]: string } = {};

    if (undefined === header) {
        if ($env.isWeb()) {
            header = document.cookie;
            isDocumentCookieHeader = true;
        } else {
            throw new Error('Missing `header`.');
        }
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
    if (isDocumentCookieHeader) {
        // Reflect latest runtime cookie changes.
        for (const [key, value] of documentCookieMap.entries()) {
            if (undefined === value) {
                delete cookies[key]; // Deleted cookie.
            } else {
                cookies[key] = value; // Latest value.
            }
        }
    }
    return cookies;
});

/**
 * Checks if a cookie exists.
 *
 * @param   name Cookie name.
 *
 * @returns      True if cookie exists.
 */
export const exists = $fnꓺmemoize(24, (name: string): boolean => {
    if (!$env.isWeb()) throw $env.ERR_CLIENT_SIDE_ONLY;
    return Object.hasOwn(parse(), name);
});

/**
 * Gets a cookie value.
 *
 * @param   name         Cookie name.
 * @param   defaultValue Defaults to undefined.
 *
 * @returns              Cookie value, else {@see defaultValue}.
 */
export const get = $fnꓺmemoize(24, <Default extends $type.Primitive = undefined>(name: string, defaultValue?: Default): string | Default => {
    if (!$env.isWeb()) throw $env.ERR_CLIENT_SIDE_ONLY;
    const cookies = parse(); // Parser is memoized (important).
    return Object.hasOwn(cookies, name) ? cookies[name] : (defaultValue as Default);
});

/**
 * Sets a cookie value.
 *
 * @param name    Cookie name.
 * @param value   Cookie value.
 * @param options Options (all optional).
 */
export const set = (name: string, value: string, options: Options = {}): void => {
    if (!$env.isWeb()) throw $env.ERR_CLIENT_SIDE_ONLY;

    if (!nameIsValid(name)) {
        throw new Error('Invalid name: `' + name + '`.');
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

    // The `httponly` attribute is implied when using JavaScript.
    // See: <https://stackoverflow.com/a/14691716>.

    document.cookie = $url.encode(name) + '=' + $url.encode(value) + domain + path + expires + samesite + secure;

    if ('' === value && opts.expires && opts.expires <= -1) {
        documentCookieMap.set(name, undefined); // Deleted cookie.
    } else {
        documentCookieMap.set(name, value); // Cookie’s latest value.
    }
    parse.flush(), exists.flush(), get.flush(); // Flushes memoization cache.
};

/**
 * Deletes a cookie.
 *
 * @param name    Cookie name.
 * @param options Options (all optional).
 */
const _delete = (name: string, options: Options = {}): void => {
    if (!$env.isWeb()) throw $env.ERR_CLIENT_SIDE_ONLY;
    set(name, '', { ...options, expires: -1 });
};
export { _delete as delete }; // Must be exported as alias.

/**
 * Checks if a cookie name is valid.
 *
 * @param   name Cookie name.
 *
 * @returns      True if cookie name is valid.
 */
export const nameIsValid = (name: string): boolean => {
    return /^[a-z0-9_-]+$/iu.test(name) && !/^(?:domain|path|expires|max-age|samesite|secure|httponly)$/iu.test(name);
};
