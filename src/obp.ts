/**
 * Object path utilities.
 */

import type * as $type from './type.js';
import { hasOwn as $objꓺhasOwn } from './obj.js';
import { escRegExp as $strꓺescRegExp } from './str.js';

import {
	array as $isꓺarray,
	number as $isꓺnumber,
	string as $isꓺstring,
	object as $isꓺobject,
	numeric as $isꓺnumeric,
	safeObjectPath as $isꓺsafeObjectPath,
	protoPollutionKey as $isꓺprotoPollutionKey,
} from './is.js';

/**
 * Checks if an object has own or inherited, enumerable or not, path.
 *
 * @param   objValue  Object to search in.
 * @param   path      Object path in `objValue`.
 * @param   separator Object path separator. Default is `.`.
 * @param   opts      Must be own key at end of object path? Set: `{endOwn: true}`.
 *
 * @returns           True if object has own or inherited, enumerable or not, path.
 *
 *   - See also: `endOwn` option, which changes the return value of this function.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const has = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], separator: string = '.', opts: { endOwn?: boolean } = {}): boolean => {
	path = splitPath(path, separator);

	if (0 === path.length || !$isꓺobject(objValue) || !(path[0] in objValue)) {
		return false; // Can’t go further, or doesn’t have path.
	}
	if (1 === path.length && (!opts.endOwn || $objꓺhasOwn(objValue, path[0]))) {
		return true; // End of the line.
	}
	return has(objValue[path[0]], path.slice(1), separator, opts);
};

/**
 * Gets an object’s own or inherited, enumerable or not, path value.
 *
 * @param   objValue     Object to search in.
 * @param   path         Object path in `objValue`.
 * @param   defaultValue Default value if `undefined`.
 * @param   separator    Object path separator. Default is `.`.
 *
 * @returns              Object’s own or inherited, enumerable or not, path value; else `defaultValue`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const get = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], defaultValue: unknown = undefined, separator: string = '.'): unknown => {
	if (undefined === objValue) {
		return defaultValue;
	}
	path = splitPath(path, separator);

	if (0 === path.length) {
		return objValue; // End of the line.
	}
	if (!$isꓺobject(objValue)) {
		return defaultValue; // Can’t go further.
	}
	return get(objValue[path[0]], path.slice(1), defaultValue, separator);
};

/**
 * Sets an object’s own or inherited, enumerable or not, path value.
 *
 * @param objValue  Object to search in.
 * @param path      Object path in `objValue`.
 * @param value     Value of the object path.
 * @param separator Object path separator. Default is `.`.
 * @param intOpts   Internal. Do not pass. Instead, use {@see defaultTo()}.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const set = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], value: unknown, separator: string = '.', intOpts: { defaultTo?: boolean } = {}): void => {
	if (!$isꓺobject(objValue)) {
		return; // Nothing more to do.
	}
	path = splitPath(path, separator);

	if (0 === path.length) {
		return; // Nothing more to do.
	}
	const currentPath = path[0]; // Potential prototype.

	if ($isꓺprotoPollutionKey(currentPath)) {
		throw new Error('Denying write access to prototype pollution key: `' + String(currentPath) + '`.');
	}
	if (1 === path.length) {
		if (!intOpts.defaultTo || undefined === objValue[currentPath]) {
			objValue[currentPath] = value; // Sets value, or default value.
		}
	} else {
		if (undefined === objValue[currentPath]) {
			objValue[currentPath] = $isꓺnumber(path[1]) ? [] : {};
		}
		set(objValue[currentPath], path.slice(1), value, separator, intOpts);
	}
};

/**
 * Sets an object’s own or inherited, enumerable or not, path default value.
 *
 * @param objValue  Object to search in.
 * @param path      Object path in `objValue`.
 * @param value     Default value of the object path.
 * @param separator Object path separator. Default is `.`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 */
export const defaultTo = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], value: unknown, separator: string = '.'): void => {
	set(objValue, path, value, separator, { defaultTo: true });
};

/**
 * Unsets an object’s own or inherited, enumerable or not, path value.
 *
 * @param objValue  Object to search in.
 * @param path      Object path in `objValue`.
 * @param separator Object path separator. Default is `.`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note The use of `*` only unsets array keys, or end-own enumerable string keys.
 */
export const unset = (objValue: unknown, path: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): void => {
	if (!$isꓺobject(objValue)) {
		return; // Nothing more to do.
	}
	path = splitPath(path, separator);

	if (0 === path.length) {
		return; // Nothing more to do.
	}
	const currentPath = path[0]; // Potential prototype.

	if ($isꓺprotoPollutionKey(currentPath)) {
		throw new Error('Denying write access to prototype pollution key: `' + String(currentPath) + '`.');
	}
	if ('*' === currentPath) {
		if ($isꓺarray(objValue)) {
			objValue.splice(0, objValue.length);
			//
		} /* Note: `Object.keys()` returns end-own enumerable string keys; i.e., of current `objValue`. */ else {
			for (const key of Object.keys(objValue)) {
				delete objValue[key]; // Note: Preserves symbol keys.
			}
		}
	} else if (1 === path.length) {
		if ($isꓺarray(objValue) && $isꓺnumeric(currentPath, 'safeLength')) {
			objValue.splice(Number(currentPath), 1);
		} else {
			delete objValue[currentPath];
		}
	} else {
		if ('*' === path[1] && !$isꓺobject(objValue[currentPath])) {
			objValue[currentPath] = undefined; // Not an object, so `undefined` is only choice.
		} else {
			unset(objValue[currentPath], path.slice(1), separator);
		}
	}
};

/**
 * Splits an object path into an array of parts.
 *
 * @param   path      Object path; e.g., `a.b.c[0]`.
 * @param   separator Object path separator. Default is `.`.
 *
 * @returns           An array of object path parts, split by `separator`.
 *
 * @note Object paths do not support symbol keys whatsoever.
 * @note An array path should **not** be passed directly. Internal use only.
 *
 * @see $str.obpPartSafe()
 */
export const splitPath = (path: $type.ObjectPath | $type.ObjectPath[], separator: string = '.'): $type.ObjectPath[] => {
	if ($isꓺarray(path)) {
		// An array path should **not** be passed directly. Internal use only.
		return path; // Path is split already. Not validating for performance reasons.
	}
	if ($isꓺnumber(path)) {
		if (!$isꓺsafeObjectPath(path)) {
			throw new Error('Invalid object path. Got: `' + String(path) + '`.');
		}
		return [path]; // Array index.
	}
	if ($isꓺstring(path)) {
		if (/^\[[0-9]+\]$/u.test(path)) {
			path = Number(path.slice(1, -1));

			if (!$isꓺsafeObjectPath(path)) {
				throw new Error('Invalid object path. Got: `' + String(path) + '`.');
			}
			return [path]; // Array index.
		}
		let splitPath = path.split(new RegExp('(' + $strꓺescRegExp(separator) + '|\\[[0-9]+\\])'));
		splitPath = splitPath.filter((pathPart): boolean => (pathPart && separator !== pathPart ? true : false));

		return splitPath.map((_pathPart): number | string => {
			let pathPart: number | string = _pathPart;

			if (/^\[[0-9]+\]$/u.test(_pathPart)) {
				pathPart = Number(_pathPart.slice(1, -1)); // Array index.
			}
			if (!$isꓺsafeObjectPath(pathPart)) {
				throw new Error('Invalid object path. Part: `' + String(pathPart) + '`.');
			}
			return pathPart; // Object path part.
		});
	}
	throw new Error('Invalid object path. Got: `' + String(path) + '`.');
};