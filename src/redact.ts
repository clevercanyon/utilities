/**
 * Redaction utilities.
 */

import '#@initialize.ts';

import { $http, $is, $obj, $str, $url, $user, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type Options = { char: string };
export type ObjectOptions = Options;
export type URLOptions = Options;
export type IPGeoDataOptions = Options;
export type HeaderOptions = Options;

/**
 * Redacts data in a string.
 *
 * @param   str     Input string.
 * @param   options All optional; {@see Options}.
 *
 * @returns         Redacted string.
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
export const url = <Type extends $type.URL | string>(parseable: Type, options?: URLOptions): Type extends $type.URL ? $type.URL : string => {
    const url = $url.tryParse(parseable);
    if (!url) return parseable as ReturnType<typeof redactURL<Type>>;

    return $url.addQueryVars(
        $obj.map($url.getQueryVars(url), (value: string, name: string): unknown => {
            return /^ut[mx]_/iu.test(name) ? value : redact(value, options);
        }),
        parseable, // Using `parseable` to preserve type.
    ) as ReturnType<typeof redactURL<Type>>;
};
const redactURL = url; // Internal alias.

/**
 * Redacts all keys in an object deeply.
 *
 * @param   object  Object to redact deeply.
 * @param   options All optional; {@see ObjectOptions}.
 *
 * @returns         Redacted deep object clone.
 */
export const object = <Type extends object>(object: Type, options?: ObjectOptions): ReturnType<typeof $obj.mapDeep<Type>> => {
    return $obj.mapDeep(object, (value: unknown): unknown => {
        return !$is.string(value) ? value : redact(value, options);
    });
};
// const redactObject = object; // Internal alias.

/**
 * Redacts a user’s IP geolocation data.
 *
 * @param   data    {@see $user.IPGeoData}.
 * @param   options All optional; {@see IPGeoDataOptions}.
 *
 * @returns         Redacted {@see $user.IPGeoData}.
 */
export const ipGeoData = <Type extends $user.IPGeoData>(data: Type, options?: IPGeoDataOptions): ReturnType<typeof $obj.map<Type>> => {
    return $obj.map(data, (value: string, key: string): unknown => {
        return ['continent', 'country', 'region', 'regionCode', 'colo', 'metroCode', 'timezone'].includes(key) ? value : redact(value, options);
    });
};

/**
 * Redacts plain object headers.
 *
 * @param   headers Plain object headers.
 * @param   options All optional; {@see HeaderOptions}.
 *
 * @returns         Redacted headers.
 */
export const headers = <Type extends { [x: string]: string }>(headers: Type, options?: HeaderOptions): ReturnType<typeof $obj.map<Type>> => {
    return $obj.map(headers, (value: string, name: string): unknown => {
        const lcName = name.toLowerCase(); // For comparisons below.

        if ($http.publicHeaderNames().includes(lcName)) {
            if ($http.urlHeaderNames().includes(lcName)) {
                if (['refresh'].includes(lcName)) {
                    return value.replace(/(;\s*url=)(.+)$/iu, (...m: string[]): string => m[1] + redactURL(m[2], options));
                }
                return redactURL(value, options);
            }
            return value;
        }
        return redact(value, options);
    });
};
