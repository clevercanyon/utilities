/**
 * Redaction utilities.
 */

import '#@initialize.ts';

import { $error, $http, $is, $obj, $str, $url, $user, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type Options = { char: string };
export type ObjectOptions = Options;
export type URLOptions = Options;
export type IPGeoDataOptions = Options;
export type HeaderOptions = Options;
export type RequestOptions = Options;
export type ResponseOptions = Options;
export type ErrorOptions = Options;

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
// const redactIPGeoData = ipGeoData; // Internal alias.

/**
 * Redacts an HTTP headers instance.
 *
 * @param   headers HTTP headers instance.
 * @param   options All optional; {@see HeaderOptions}.
 *
 * @returns         Redacted HTTP headers instance clone.
 */
export const headers = <Type extends $type.Headers>(headers: Type, options?: HeaderOptions): Type => {
    const entries = [...headers.entries()];

    for (let i = 0; i < entries.length; i++) {
        let name = entries[i][0], // Shorter reference.
            value = entries[i][1]; // Same; shorter.

        if ($http.publicHeaderNames().includes(name)) {
            if ($http.urlHeaderNames().includes(name)) {
                //
                if (['refresh'].includes(name)) {
                    value = value // Redact URL portion only.
                        .replace(/(;\s*url=)(.+)$/iu, (...m: string[]): string => {
                            return m[1] + redactURL(m[2], options);
                        });
                } else value = redactURL(value, options);
            }
        } else value = redact(value, options);

        (entries[i][0] = name), (entries[i][1] = value);
    }
    return new Headers(entries) as Type; // Redacted HTTP headers instance clone.
};
const redactHeaders = headers; // Internal alias.

/**
 * Redacts an HTTP request instance.
 *
 * @param   request HTTP request instance.
 * @param   options All optional; {@see RequestOptions}.
 *
 * @returns         Redacted HTTP request instance properties.
 */
export const requestProperties = <Type extends $type.Request>(request: Type, options?: RequestOptions): ReturnType<typeof $http.requestProperties> => {
    const properties = $http.requestProperties(request);
    return {
        ...properties,
        url: redactURL(properties.url, options),
        referrer: redactURL((properties.referrer || '') as string, options),
        headers: redactHeaders(properties.headers, options),
    } as ReturnType<typeof requestProperties>;
};
// const redactRequestProperties = request; // Internal alias.

/**
 * Redacts an HTTP response instance.
 *
 * @param   response HTTP response instance.
 * @param   options  All optional; {@see ResponseOptions}.
 *
 * @returns          Redacted HTTP response instance properties.
 */
export const responseProperties = <Type extends $type.Response>(response: Type, options?: ResponseOptions): ReturnType<typeof $http.responseProperties> => {
    const properties = $http.responseProperties(response);
    return {
        ...properties,
        url: redactURL(properties.url, options),
        headers: redactHeaders(properties.headers, options),
    } as ReturnType<typeof responseProperties>;
};
// const redactResponseProperties = response; // Internal alias.

/**
 * Redacts an error instance.
 *
 * @param   error   Error instance.
 * @param   options All optional; {@see ErrorOptions}.
 *
 * @returns         Redacted error instance properties.
 */
export const errorProperties = <Type extends Error>(error: Type, unusedꓺoptions?: ErrorOptions): ReturnType<typeof $error.properties> => {
    const properties = $error.properties(error);
    return properties as unknown as ReturnType<typeof errorProperties>;
};
// const redactErrorProperties = error; // Internal alias.
