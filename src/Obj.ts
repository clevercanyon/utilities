/**
 * Utility class.
 */

import mergeChange from 'merge-change';

/**
 * Merge-change utilities.
 */
export const mc: typeof mergeChange = mergeChange;

/**
 * Checks if object is empty.
 *
 * @param   obj Object to check.
 *
 * @returns     `true` if empty.
 */
export function empty(obj: object): boolean {
	return 0 === Object.keys(obj).length;
}

/**
 * Polyfill for `Object.hasOwn()`.
 *
 * @param   obj  Object to check.
 * @param   prop Property to check for.
 *
 * @returns      `true` if property exists.
 */
export function hasOwn(obj: object, prop: string): boolean {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}

/**
 * Gets object's own enumerable string-keyed properties.
 *
 * @param   obj Object with props.
 *
 * @returns     Object's own enumerable string-keyed properties.
 */
export function props(obj: URLSearchParams): { [x: string]: string };
export function props(obj: object): { [x: string]: unknown } {
	if (obj instanceof URLSearchParams) {
		return Object.fromEntries(obj.entries());
	}
	return Object.fromEntries(Object.entries(obj));
}
