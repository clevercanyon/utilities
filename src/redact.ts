/**
 * Redaction utilities.
 */

import '#@initialize.ts';

import { $http, $obj, $str, $url, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type Options = { char: string };
export type URLOptions = Options;
export type IPGeoDataOptions = Options;
export type HeaderOptions = Options;

/**
 * Redacts data in a string value.
 *
 * @param   str     String to redact.
 * @param   options All optional; {@see Options}.
 *
 * @returns         Redacted string value.
 */
export const string = (str: string, options?: Options): string => {
    const opts = $obj.defaults({}, options || {}, { char: '*' }) as Required<Options>,
        redactionChar = opts.char; // By default, an asterisk.

    const chars = $str.toChars(str), // Characters, not bytes.
        keepChars = chars.length >= 9 ? 6 : chars.length >= 3 ? 2 : 0;

    return keepChars
        ? chars.slice(0, keepChars / 2).join('') + //
              redactionChar.repeat(chars.length - keepChars) +
              chars.slice(chars.length - keepChars / 2).join('')
        : redactionChar.repeat(chars.length);
};
const redact = string; // Internal alias.

/**
 * Redacts data in a URL object or string.
 *
 * @param   parseable Parseable URL or string.
 * @param   options   All optional; {@see URLOptions}.
 *
 * @returns           Redacted URL object or string.
 *
 *   - Returns a {@see URL} if input was a {@see URL}. A string otherwise.
 */
export const url = (parseable: $type.URL | string, options?: URLOptions): $type.URL | string => {
    const url = $url.tryParse(parseable);
    if (!url) return parseable; // Not possible.

    // Using parsed `url` to save time.
    const queryVars = $url.getQueryVars(url);

    for (const [name, value] of Object.entries(queryVars)) {
        if (!/^ut[mx]_/iu.test(name)) {
            queryVars[name] = redact(value, options);
        }
    } // Using `parseable` preserves type.
    return $url.addQueryVars(queryVars, parseable);
};
const redactURL = url; // Internal alias.

/**
 * Redacts a user’s IP geolocation data.
 *
 * @param   data    {@see $user.IPGeoData}.
 * @param   options All optional; {@see IPGeoDataOptions}.
 *
 * @returns         Redacted {@see $user.IPGeoData}.
 */
export const ipGeoData = (_data: { [x: string]: string }, options?: IPGeoDataOptions): { [x: string]: string } => {
    const data = // Shallow clone.
        $obj.clone(_data) as typeof _data;

    for (const [key, value] of Object.entries(data)) {
        if (!['continent', 'country', 'region', 'regionCode', 'colo', 'metroCode', 'timezone'].includes(key)) {
            data[key] = redact(value, options);
        }
    }
    return data;
};

/**
 * Redacts plain object headers.
 *
 * @param   headers Plain object headers.
 * @param   options All optional; {@see HeaderOptions}.
 *
 * @returns         Redacted plain object headers.
 */
export const headers = (_headers: { [x: string]: string }, options?: HeaderOptions): { [x: string]: string } => {
    const headers = // Shallow clone.
        $obj.clone(_headers) as typeof _headers;

    for (const [name, value] of Object.entries(headers)) {
        const lcName = name.toLowerCase();
        if (
            [
                'cookie', //
                'set-cookie',

                'x-waf-key',
                'authorization',

                'x-csrf-token',
                'x-wp-nonce',
                'x-nonce',

                'forwarded',
                'x-forwarded-for',
                ...$http.ipHeaderNames(),
                //
            ].includes(lcName)
        ) {
            headers[name] = redact(value, options);
            //
        } else if (['referer', 'location', 'x-original-url', 'x-rewrite-url'].includes(lcName)) {
            headers[name] = redactURL(value, options) as string;
        }
    }
    return headers;
};
