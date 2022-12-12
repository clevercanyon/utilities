/**
 * Utility class.
 */

/**
 * Object utilities.
 */
export default class $Obj {
	/**
	 * Checks if object is empty.
	 *
	 * @param obj Object to check.
	 *
	 * @returns `true` if empty.
	 */
	public static empty(obj: object): boolean {
		return 0 === Object.keys(obj).length;
	}

	/**
	 * Polyfill for `Object.hasOwn()`.
	 *
	 * @param obj  Object to check.
	 * @param prop Property to check for.
	 *
	 * @returns `true` if property exists.
	 */
	public static hasOwn(obj: object, prop: string): boolean {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/**
	 * Gets object's own enumerable string-keyed properties.
	 *
	 * @param obj Object with props.
	 *
	 * @returns Object's own enumerable string-keyed properties.
	 */
	public static props(obj: URLSearchParams): { [x: string]: string };
	public static props(obj: object): { [x: string]: unknown } {
		if (obj instanceof URLSearchParams) {
			return Object.fromEntries(obj.entries());
		}
		return Object.fromEntries(Object.entries(obj));
	}
}
