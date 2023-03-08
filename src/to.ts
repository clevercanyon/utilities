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

import type * as $type from './type.js';
import { keyAndSymbolEntries as $objꓺkeyAndSymbolEntries } from './obj.js';

/**
 * Conversion symbols.
 */
export const symbols = {
	appPkgName: Symbol('toAppPkgName'),

	tag: Symbol('toTag'),
	stringTag: Symbol.toStringTag,

	plain: Symbol('toPlain'),
	clone: Symbol('toClone'),
};

/**
 * Conversion methods.
 */
export const methods = {
	json: 'toJSON',
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
		return Object(value) as $type.Object; // New plain as clone.
	}
	for (const fnKey of [symbols.plain, methods.json]) {
		if (value[fnKey] && $isꓺfunction(value[fnKey])) {
			const derivation = (value[fnKey] as $type.ToPlainSymbolFn | $type.ToJSONFn)();

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
	if ($isꓺarray(value)) {
		const plain: unknown[] = []; // Plain clone.
		circular.set(value, plain); // Before going deep.

		for (let key = 0; key < value.length; key++) {
			plain[key] = plainObjectDeepꓺhelper(value[key], circular);
		}
		return plain; // Plain clones.
	} else {
		return plainObjectDeep(value, circular); // Plain clones.
	}
};

/**
 * Flattens a value, to the extent possible, into a plain object, using object path keys.
 *
 * @param   value     Value to flatten.
 * @param   separator Object path separator. Default is `.`.
 *
 * @returns           Plain flat object, to the extent possible.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note The top level is always forced into a plain object; i.e., a shallow clone.
 * @note Within that shallow clone, only arrays and nested plain objects are flattened.
 * @note Anything that’s not an array or plain object is keyed exactly where it resides, as-is.
 * @note Any circular references are also keyed exactly where they reside, as-is.
 */
export const plainFlatObject = (value: unknown, separator: string = '.'): $type.Object => {
	if (!$isꓺobject(value)) {
		value = plainObject(value);
	}
	return plainFlatObjectꓺhelper(value, separator) as $type.Object;
};

/**
 * Helps flatten a value into a plain object with a single dimension using object path keys.
 *
 * @param   value     Value to flatten.
 * @param   separator Object path separator.
 * @param   path      Internal use only. Do not pass.
 * @param   flat      Internal use only. Do not pass.
 * @param   circular  Internal use only. Do not pass.
 *
 * @returns           A flat value; though not necessarily an object.
 *
 * @note Please review {@see plainFlatObject()} for other important notes.
 */
const plainFlatObjectꓺhelper = (value: unknown, separator: string, path: undefined | string = undefined, flat: $type.Object = {}, circular: Set<unknown> = new Set()): unknown => {
	const isObjectValue = $isꓺobject(value);

	if (undefined !== path && isObjectValue && circular.has(value)) {
		flat[path] = value; // Keyed exactly where it resides, as-is.
	} else {
		if (undefined !== path && isObjectValue) {
			circular.add(value); // Flags value as seen.
		}
		if (isObjectValue && $isꓺarray(value)) {
			for (let key = 0; key < value.length; key++) {
				const keyPath = undefined !== path ? `${path}[${key}]` : `[${key}]`;
				plainFlatObjectꓺhelper(value[key], separator, keyPath, flat, circular);
			}
		} else if (isObjectValue && $isꓺplainObject(value)) {
			for (const [key, keyValue] of Object.entries(value)) {
				const keyPath = undefined !== path ? `${path}${separator}${key}` : key;
				plainFlatObjectꓺhelper(keyValue, separator, keyPath, flat, circular);
			}
		} else if (undefined !== path) {
			flat[path] = value; // Keyed exactly where it resides, as-is.
		}
	}
	return flat; // Plain flat object, to the extent possible, as a shallow clone.
};
