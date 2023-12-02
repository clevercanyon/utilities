/**
 * JSON utilities.
 */

import '#@init.ts';

import { $is, $obj, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type StringifyOptions = {
    noReplacer?: boolean;
    pretty?: boolean | number;
};

/**
 * Converts any value into JSON.
 *
 * @param   value Value to convert into JSON.
 *
 * @returns       JSON-encoded string; else `undefined`.
 */
export function stringify(value: $type.Function, options?: StringifyOptions): undefined;
export function stringify(value: undefined, options?: StringifyOptions): undefined;
export function stringify(value: unknown, options?: StringifyOptions): string;

export function stringify(value: unknown | undefined, options?: StringifyOptions): undefined | string {
    const opts = $obj.defaults({}, options || {}, { noReplacer: false, pretty: false }) as Required<StringifyOptions>;

    const circular: Set<object> = new Set(); // Tracks circular references.
    const space = opts.pretty ? ($is.number(opts.pretty) ? opts.pretty : 4) : undefined;

    return JSON.stringify(value, opts.noReplacer ? undefined : (key, value) => replacer(key, value, circular), space);
}

/**
 * Converts JSON back into original value.
 *
 * @param   json JSON to parse into original value.
 *
 * @returns      Original value parsed from JSON.
 */
export const parse = (json: string | undefined): unknown => {
    return undefined === json ? undefined : JSON.parse(json, reviver);
};

/**
 * {@see JSON.stringify()} replacer.
 *
 * @param   key   A JSON string key.
 * @param   value Any arbitrary value.
 *
 * @returns       Value to JSON-encode.
 */
const replacer = (key: string, value: unknown, circular: Set<object>): unknown => {
    if ($is.object(value)) {
        if (circular.has(value)) return undefined; // Omit.
        circular.add(value); // Tracks circular references.

        if ($is.set(value)) {
            return { __dataType: 'Set', __data: [...value] };
        }
        if ($is.map(value)) {
            return { __dataType: 'Map', __data: [...value] };
        }
    }
    return value; // No change.
};

/**
 * {@see JSON.stringify()} reviver.
 *
 * @param   key   A JSON string key.
 * @param   value Any arbitrary value.
 *
 * @returns       Value to JSON-decode.
 */
const reviver = (key: string, value: unknown): unknown => {
    if ($is.object(value)) {
        if ('Set' === value.__dataType && $is.array(value.__data)) {
            return new Set(value.__data);
        }
        if ('Map' === value.__dataType && $is.array(value.__data)) {
            return new Map(value.__data as [[unknown, unknown]]);
        }
    }
    return value; // No change.
};
