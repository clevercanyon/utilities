/**
 * Data conversion utilities.
 */

import { $class, $is, $obj, $symbol, type $type } from './index.ts';

/**
 * Casts any value as an array.
 *
 * @param   value Value to cast as an array.
 *
 * @returns       Value cast as an array.
 *
 * @note There is no array casting in JavaScript, but we make it work.
 * @note Beware of this returning `['']`, `[null]`, `[undefined]`, etc.
 */
export const array = <Type>(value: Type): Type extends unknown[] ? Type : Type[] => {
    return ($is.array(value) ? value : [value]) as Type extends unknown[] ? Type : Type[];
};
export { array as castArray }; // Back compat. Deprecated 2023-09-25 in favor of `array()`.

/**
 * Converts any value into a plain object.
 *
 * @param   value Value to convert into a plain object.
 *
 * @returns       Plain non-nil object in the form of a shallow clone.
 */
export const plainObject = (value: unknown): $type.Object => {
    if (!$is.object(value)) {
        return { ...Object(value) } as $type.Object;
    }
    for (const fnKey of [$symbol.objToPlain, $symbol.objToJSON]) {
        if (value[fnKey] && $is.function(value[fnKey])) {
            const derivation = (value[fnKey] as $class.ObjToPlainSymbolFn | $class.ObjToJSONSymbolFn)();

            if ($is.object(derivation)) {
				value = derivation; break;
			} // prettier-ignore
        }
    }
    if ($is.set(value)) {
        return { ...[...value] } as $type.Object;
    } else if ($is.map(value)) {
        return Object.fromEntries(value.entries()) as $type.Object;
    }
    return { ...(value as $type.Object) } as $type.Object;
};

/**
 * Converts any value into a plain object, deeply.
 *
 * @param   value Value to convert into a plain object, deeply.
 *
 * @returns       Plain non-nil object in the form of a deep clone.
 *
 * @note Sub-level sets are converted into plain arrays.
 * @note Sub-level non-objects and arrays are preserved within, as clones.
 * @note Sub-level functions and promises are preserved; i.e., transferred by reference.
 */
export const plainObjectDeep = (value: unknown): $type.Object => {
    return plainObjectDeepꓺhelper(value); // Plain clones.
};

/**
 * Converts any value into a plain object, deeply.
 *
 * @param   value    Value to convert into a plain object, deeply.
 * @param   circular Internal use only. Do not pass.
 *
 * @returns          Plain non-nil object in the form of a deep clone.
 */
const plainObjectDeepꓺhelper = (value: unknown, circular: Map<object, object> = new Map()): $type.Object => {
    const isObjectValue = $is.object(value);

    if (isObjectValue && circular.has(value)) {
        return circular.get(value) as $type.Object;
    }
    const plain = plainObject(value); // Clones as plain object.
    if (isObjectValue) circular.set(value, plain); // Before going deep.

    for (const [key, value] of $obj.keyAndSymbolEntries(plain)) {
        plain[key] = plainObjectDeepꓺplainValueꓺhelper(value, circular);
    }
    return plain; // Plain clones.
};

/**
 * Helps convert any value into a plain value, deeply.
 *
 * @param   value    Value to convert into a plain value, deeply.
 * @param   circular Internal use only. Do not pass.
 *
 * @returns          A plain value; though not necessarily an object.
 */
const plainObjectDeepꓺplainValueꓺhelper = (value: unknown, circular: Map<object, object>): unknown => {
    if (!$is.object(value) || $is.function(value) || $is.promise(value)) {
        return value; // Unnecessary (e.g., primitive) or impossible.
    }
    if (circular.has(value)) return circular.get(value);

    if ($is.set(value) || $is.array(value)) {
        const plain: unknown[] = []; // Plain clone.
        circular.set(value, plain); // Before going deep.

        // Converts sub-level sets into plain arrays.
        value = ($is.set(value) ? [...value] : value) as unknown[];

        for (let key = 0; key < (value as unknown[]).length; key++) {
            plain[key] = plainObjectDeepꓺplainValueꓺhelper((value as unknown[])[key], circular);
        }
        return plain; // Plain clones.
    } else {
        return plainObjectDeepꓺhelper(value, circular);
    }
};

/**
 * Flattens a value, to the extent possible, using object path keys.
 *
 * @param   value     Value to flatten.
 * @param   separator Object path separator. Default is `.`.
 *
 * @returns           Flat object, to the extent possible.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note The top level is always forced into a plain object; i.e., a shallow clone.
 * @note Within that shallow clone, only arrays and nested plain objects are flattened.
 * @note Anything that’s not an array or plain object is keyed exactly where it resides, as-is.
 * @note Any circular references are also keyed exactly where they reside, as-is.
 */
export const flatObject = (value: unknown, separator: string = '.'): $type.Object => {
    return flatObjectꓺhelper(Object(value), separator) as $type.Object;
};

/**
 * Flattens a value, to the extent possible, into a plain object deeply, using object path keys.
 *
 * @param   value     Value to flatten.
 * @param   separator Object path separator. Default is `.`.
 *
 * @returns           Plain flat object, to the extent possible.
 *
 * @note Value is first converted to a plain object deeply.
 * @note Value is then converted to a flat object using {@see flatObject()}.
 */
export const plainFlatObject = (value: unknown, separator: string = '.'): $type.Object => {
    return flatObject(plainObjectDeep(value), separator);
};

/**
 * Helps flatten a value, to the extent possible, using object path keys.
 *
 * @param   value     Value to flatten.
 * @param   separator Object path separator.
 * @param   path      Internal use only. Do not pass.
 * @param   flat      Internal use only. Do not pass.
 * @param   circular  Internal use only. Do not pass.
 *
 * @returns           A flat value; though not necessarily an object.
 *
 * @note Please review {@see flatObject()} for other important notes.
 */
const flatObjectꓺhelper = (value: unknown, separator: string, path: undefined | string = undefined, flat: $type.Object = {}, circular: Set<unknown> = new Set()): unknown => {
    const inDeep = undefined !== path;
    const isObjectValue = $is.object(value);

    if (inDeep && isObjectValue && circular.has(value)) {
        if (undefined !== path) flat[path] = value; // Keyed as-is.
    } else {
        if (isObjectValue) circular.add(value); // Flag as seen.

        if (isObjectValue && $is.array(value) && value.length) {
            for (let key = 0; key < value.length; key++) {
                const keyPath = undefined !== path ? `${path}[${key}]` : `[${key}]`;
                flatObjectꓺhelper(value[key], separator, keyPath, flat, circular);
            }
        } else if (isObjectValue && (!inDeep || $is.plainObject(value)) && Object.keys(value).length) {
            for (const [key, keyValue] of Object.entries(value)) {
                const keyPath = undefined !== path ? `${path}${separator}${key}` : key;
                flatObjectꓺhelper(keyValue, separator, keyPath, flat, circular);
            }
        } else if (inDeep) {
            if (undefined !== path) flat[path] = value; // Keyed as-is.
        }
    }
    return flat; // Flat object, to the extent possible.
};
