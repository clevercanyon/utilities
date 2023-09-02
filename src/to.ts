/**
 * Data conversion utilities.
 */

import {
	set as $isꓺset,
	map as $isꓺmap,
	array as $isꓺarray,
	object as $isꓺobject,
	promise as $isꓺpromise,
	function as $isꓺfunction,
	plainObject as $isꓺplainObject,
} from './is.js';

import type { $type } from './index.js';
import { keyAndSymbolEntries as $objꓺkeyAndSymbolEntries } from './obj.js';
import { objToJSON as $symbolꓺobjToJSON, objToPlain as $symbolꓺobjToPlain } from './symbol.js';

/**
 * Converts any value into JSON.
 *
 * @param   value Value to convert into JSON.
 *
 * @returns       JSON (i.e., string value).
 */
export const json = <Type>(value: Type): string => {
	return JSON.stringify(value);
};

/**
 * Converts any value into pretty JSON.
 *
 * @param   value Value to convert into pretty JSON.
 *
 * @returns       Pretty JSON (i.e., string value).
 */
export const prettyJSON = <Type>(value: Type): string => {
	return JSON.stringify(value, null, 4);
};

/**
 * Casts any value as an array.
 *
 * @param   value Value to cast as an array.
 *
 * @returns       Value cast as an array.
 */
export const castArray = <Type>(value: Type): Type extends unknown[] ? Type : Type[] => {
	return ($isꓺarray(value) ? value : [value]) as Type extends unknown[] ? Type : Type[];
};

/**
 * Converts any value into a plain object.
 *
 * @param   value Value to convert into a plain object.
 *
 * @returns       Plain non-nil object in the form of a shallow clone.
 */
export const plainObject = (value: unknown): $type.Object => {
	if (!$isꓺobject(value)) {
		return { ...Object(value) } as $type.Object; // New plain as clone.
	}
	for (const fnKey of [$symbolꓺobjToPlain, $symbolꓺobjToJSON]) {
		if (value[fnKey] && $isꓺfunction(value[fnKey])) {
			const derivation = (value[fnKey] as $type.ObjToPlainSymbolFn | $type.ObjToJSONFn)();

			if ($isꓺobject(derivation)) {
				value = derivation; break; // Stop here.
			} // prettier-ignore
		}
	}
	if ($isꓺset(value)) {
		return { ...[...value] } as $type.Object; // Plain clone.
		//
	} else if ($isꓺmap(value)) {
		return Object.fromEntries(value.entries()) as $type.Object; // Plain clone.
	}
	return { ...(value as $type.Object) } as $type.Object; // Plain clone.
};

/**
 * Converts any value into a plain object, deeply.
 *
 * @param   value    Value to convert into a plain object, deeply.
 * @param   circular Internal use only. Do not pass.
 *
 * @returns          Plain non-nil object in the form of a deep clone.
 *
 * @note Sub-level sets are converted into plain arrays.
 * @note Sub-level non-objects and arrays are preserved within, as clones.
 * @note Sub-level functions and promises are preserved; i.e., transferred by reference.
 */
export const plainObjectDeep = (value: unknown, circular: Map<unknown, unknown> = new Map()): $type.Object => {
	const isObjectValue = $isꓺobject(value);

	if (isObjectValue && circular.has(value)) {
		return circular.get(value) as $type.Object; // Plain clone.
	}
	const plain = plainObject(value); // Plain clone.
	if (isObjectValue) circular.set(value, plain); // Before going deep.

	for (const [key, value] of $objꓺkeyAndSymbolEntries(plain)) {
		plain[key] = plainObjectDeepꓺhelper(value, circular); // Plain clones.
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
 *
 * @note Sub-level sets are converted into plain arrays.
 * @note Sub-level non-objects and arrays are preserved within, as clones.
 * @note Sub-level functions and promises are preserved; i.e., transferred by reference.
 */
const plainObjectDeepꓺhelper = (value: unknown, circular: Map<unknown, unknown>): unknown => {
	if (!$isꓺobject(value) || $isꓺfunction(value) || $isꓺpromise(value)) {
		return value; // Unnecessary (e.g., primitive) or impossible.
	}
	if (circular.has(value)) {
		return circular.get(value) as $type.Object; // Plain clone.
	}
	if ($isꓺset(value) || $isꓺarray(value)) {
		const plain: unknown[] = []; // Plain clone.
		circular.set(value, plain); // Before going deep.

		// Converts sub-level sets into plain arrays.
		value = ($isꓺset(value) ? [...value] : value) as unknown[];

		for (let key = 0; key < (value as unknown[]).length; key++) {
			plain[key] = plainObjectDeepꓺhelper((value as unknown[])[key], circular);
		}
		return plain; // Plain clones.
	} else {
		return plainObjectDeep(value, circular); // Plain clones.
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
	const isObjectValue = $isꓺobject(value);

	if (inDeep && isObjectValue && circular.has(value)) {
		if (undefined !== path) flat[path] = value; // Keyed as-is.
	} else {
		if (isObjectValue) circular.add(value); // Flag as seen.

		if (isObjectValue && $isꓺarray(value) && value.length) {
			for (let key = 0; key < value.length; key++) {
				const keyPath = undefined !== path ? `${path}[${key}]` : `[${key}]`;
				flatObjectꓺhelper(value[key], separator, keyPath, flat, circular);
			}
		} else if (isObjectValue && (!inDeep || $isꓺplainObject(value)) && Object.keys(value).length) {
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
