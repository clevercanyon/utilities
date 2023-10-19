/**
 * Data conversion utilities.
 */

import './resources/init.ts';

import { $is, $obj, $symbol, type $type } from './index.ts';

/**
 * Converts any value into a map.
 *
 * There’s no native map casting in JavaScript. `new Map(Object.entries(value))` is about the shortest you can get,
 * unfortunately. This utility exists to abbreviate a common pattern. You can simply do `$to.map(value)`.
 *
 * WARNING: Beware of this utility returning maps with numeric keys for things like arrays other primitives that we cast
 * into arrays, before casting into a map. Anything that’s not a map, array, set, or object, is simply cast as an array,
 * then into a map. Two exceptions are `null` and `undefined`, which will convert to an empty map.
 *
 * @param   value Value to cast as a map.
 *
 * @returns       Value cast as a map.
 */
export const map = <Type>(value: Type): Type extends Map<unknown, unknown> ? Type : Map<unknown, unknown> => {
    if ($is.map(value)) {
        return value as ReturnType<typeof map<Type>>;
        //
    } else if ($is.array(value) || $is.set(value)) {
        return new Map(value.entries()) as ReturnType<typeof map<Type>>;
        //
    } else if ($is.object(value)) {
        return new Map(Object.entries(value)) as ReturnType<typeof map<Type>>;
    }
    return new Map(array(value).entries()) as ReturnType<typeof map<Type>>;
};

/**
 * Converts any value into an array.
 *
 * There’s no native array casting in JavaScript, but {@see Array.from()} is available, so please consider using it
 * before choosing this utility. That said, there are plenty of cases when simply casting to an array is desirable. For
 * example, {@see Array.from()} will convert a string into an array of chars, whereas this utility will simply wrap the
 * entire string into an array. {@see Array.from()} also has other quirks; {@see https://o5p.me/Ec5nzY}.
 *
 * WARNING: Beware of this utility returning `['']`, `[0]`, `[false]`, etc. Anything that’s not an array is simply
 * wrapped as an array. Two exceptions are `null` and `undefined`, which will convert to an empty array.
 *
 * Why not spread Sets into arrays? There is no clear way to assert set-to-array conversion using TypeScript return
 * types, and because converting a Set into an array using the spread `...` operator is already simple enough, we’ve
 * decided not to consider Sets to be anything special here, but rather just another object type.
 *
 * @param   value Value to cast as an array.
 *
 * @returns       Value cast as an array.
 */
export const array = <Type>(value: Type): Type extends unknown[] ? Type : Type extends undefined | null ? [] : Type[] => {
    if ($is.array(value)) {
        return value as ReturnType<typeof array<Type>>;
        //
    } else if ($is.nul(value)) {
        return [] as ReturnType<typeof array<Type>>;
    }
    return [value] as ReturnType<typeof array<Type>>;
};

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
            const derivation = (value[fnKey] as $type.ObjToPlainSymbolFn | $type.ObjToJSONSymbolFn)();

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
