/**
 * JSON utilities.
 */

import './resources/init.ts';

import { $is, $obj } from './index.ts';

/**
 * Defines types.
 */
export type StringifyOptions = {
    noReplacer?: boolean;
    pretty?: boolean;
};

/**
 * Converts any value into JSON.
 *
 * @param   value Value to convert into JSON.
 *
 * @returns       JSON (i.e., string value), else `undefined`.
 */
function _stringify(value: unknown, options?: StringifyOptions): string;
function _stringify(value: undefined, options?: StringifyOptions): undefined;
function _stringify(value: unknown | undefined, options?: StringifyOptions): string | undefined {
    const opts = $obj.defaults({}, options || {}, { noReplacer: false, pretty: false }) as Required<StringifyOptions>;
    return JSON.stringify(value, opts.noReplacer ? undefined : replacer, opts.pretty ? 4 : undefined);
}
export { _stringify as stringify }; // Must export as alias.

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
const replacer = (key: string, value: unknown): unknown => {
    if ($is.object(value)) {
        if ($is.set(value)) {
            return { __dataType: 'Set', __data: [...value] };
            //
        } else if ($is.map(value)) {
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
            //
        } else if ('Map' === value.__dataType && $is.array(value.__data)) {
            return new Map(value.__data as [[unknown, unknown]]);
        }
    }
    return value; // No change.
};
