/**
 * JSON utilities.
 */

import '#@initialize.ts';

import { $fn, $is, $obj, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type StringifyOptions = {
    noMiddleware?: boolean;
    middleware?: Middleware;
    pretty?: boolean | number;
};
export type ParseOptions = {
    noMiddleware?: boolean;
    middleware?: Middleware;
};
export type CloneDeepOptions = {
    noMiddleware?: boolean;
    stringifyMiddleware?: Middleware;
    parseMiddleware?: Middleware;
};
export type Middleware = (key: string, value: unknown) => unknown;

/**
 * Defines tokens.
 *
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Remember, variable names can be minified, so the length of variable names is not an issue.
 */
const tꓺvꓺfalse = false,
    tꓺvꓺundefined = undefined;

/**
 * Gets JSON MIME content type.
 *
 * @returns JSON MIME content type.
 */
export const contentType = (): string => {
    return 'application/json; charset=utf-8';
};

/**
 * Converts any value into JSON.
 *
 * @param   value   Value to convert into JSON.
 * @param   options Options (all optional); {@see StringifyOptions}.
 *
 * @returns         JSON-encoded string; else `undefined`.
 */
export function stringify(value: $type.Function, options?: StringifyOptions): undefined;
export function stringify(value: undefined, options?: StringifyOptions): undefined;
export function stringify(value: unknown, options?: StringifyOptions): string;

export function stringify(value: unknown | undefined, options?: StringifyOptions): undefined | string {
    const opts = $obj.defaults({}, options || {}, { noMiddleware: tꓺvꓺfalse, pretty: tꓺvꓺfalse }) as Required<StringifyOptions>,
        circular: Set<object> = new Set(), // Tracks circular references.
        space = opts.pretty ? ($is.number(opts.pretty) ? opts.pretty : 4) : tꓺvꓺundefined;

    return JSON.stringify(value, opts.noMiddleware ? tꓺvꓺundefined : (key, value) => stringifyMiddleware(key, value, circular, opts.middleware), space);
}

/**
 * Converts JSON back into original value.
 *
 * @param   json    JSON to parse into original value.
 * @param   options Options (all optional); {@see ParseOptions}.
 *
 * @returns         Original value parsed from JSON.
 */
export const parse = (json: string | undefined, options?: ParseOptions): unknown => {
    const opts = $obj.defaults({}, options || {}, { noMiddleware: tꓺvꓺfalse }) as Required<ParseOptions>;
    return tꓺvꓺundefined === json ? tꓺvꓺundefined : JSON.parse(json, opts.noMiddleware ? tꓺvꓺundefined : (key, value) => parseMiddleware(key, value, opts.middleware));
};

/**
 * Tries to convert JSON back into original value.
 *
 * @param   json    JSON to parse into original value; {@see parse()}.
 * @param   options Options (all optional); {@see parse()}.
 *
 * @returns         Original value parsed from JSON, else `undefined`.
 */
export const tryParse = (json: string | undefined, options?: ParseOptions): unknown => {
    return $fn.try((): unknown => parse(json, options), tꓺvꓺundefined)();
};

/**
 * Deep clones an object using JSON stringify/parse.
 *
 * @param   value   Value to clone deeply using JSON stringify/parse.
 * @param   options Options (all optional); {@see CloneDeepOptions}.
 *
 * @returns         Deep clone using JSON stringify/parse.
 */
export const cloneDeep = (value: unknown | undefined, options?: CloneDeepOptions): unknown => {
    const stringifyOptions = {
            noMiddleware: options?.noMiddleware,
            middleware: options?.stringifyMiddleware,
        },
        parseOptions = {
            noMiddleware: options?.noMiddleware,
            middleware: options?.parseMiddleware,
        };
    return parse(stringify(value, stringifyOptions), parseOptions);
};

/**
 * {@see JSON.stringify()} middleware.
 *
 * @param   key        A JSON string key.
 * @param   value      Any arbitrary value.
 * @param   circular   Circular reference map.
 * @param   middleware Optional custom stringify middleware.
 *
 * @returns            Value to JSON-encode.
 */
const stringifyMiddleware = (key: string, value: unknown, circular: Set<object>, middleware?: (key: string, value: unknown) => unknown): unknown => {
    let newValue: unknown = value; // Initialize.

    if ($is.object(newValue)) {
        if (circular.has(newValue)) {
            return tꓺvꓺundefined; // Omits circular refs.
        }
        circular.add(newValue); // Tracks circular refs.

        if (middleware) {
            newValue = middleware(key, newValue);
        }
        if (!middleware || $is.object(newValue)) {
            if ($is.set(newValue)) {
                newValue = { __dataType: 'Set', __data: [...newValue] };
                //
            } else if ($is.map(newValue)) {
                newValue = { __dataType: 'Map', __data: [...newValue] };
            }
        }
    } else if (middleware) {
        newValue = middleware(key, newValue);
    }
    return newValue; // No change.
};

/**
 * {@see JSON.parse()} middleware.
 *
 * @param   key        A JSON string key.
 * @param   value      Any arbitrary value.
 * @param   middleware Optional custom parse middleware.
 *
 * @returns            Value to JSON-decode.
 */
const parseMiddleware = (key: string, value: unknown, middleware?: (key: string, value: unknown) => unknown): unknown => {
    let newValue: unknown = value; // Initialize.

    if (middleware) {
        newValue = middleware(key, newValue);
    }
    if ($is.object(newValue)) {
        if ('Set' === newValue.__dataType && $is.array(newValue.__data)) {
            newValue = new Set(newValue.__data);
            //
        } else if ('Map' === newValue.__dataType && $is.array(newValue.__data)) {
            newValue = new Map(newValue.__data as [[unknown, unknown]]);
        }
    }
    return newValue; // No change.
};
