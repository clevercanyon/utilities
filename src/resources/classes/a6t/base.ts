/**
 * Base class.
 */

import type * as $type from '../../../type.js';
import { string as $isꓺstring, object as $isꓺobject } from '../../../is.js';
import { symbols as $toꓺsymbols, methods as $toꓺmethods } from '../../../to.js';
import { protoC9r as $objꓺprotoC9r, cloneDeep as $objꓺcloneDeep, keysAndSymbols as $objꓺkeysAndSymbols, keyAndSymbolEntries as $objꓺkeyAndSymbolEntries } from '../../../obj.js';

/**
 * Defines types.
 */
export type C9rProps = {
	appPkgName: string;
	props?: object | Base;
};

/**
 * Abstract base class.
 */
export default abstract class Base {
	/**
	 * App package name.
	 */
	#appPkgName: string;

	/**
	 * Arbitrary object keys.
	 */
	[x: $type.ObjectKey]: unknown;

	/**
	 * Object constructor.
	 *
	 * @param c9rProps Props or {@see Base} instance.
	 */
	public constructor(c9rProps: C9rProps | Base) {
		let appPkgName, props; // Initialize.

		if (c9rProps instanceof Base) {
			appPkgName = c9rProps[$toꓺsymbols.appPkgName];
			props = c9rProps; // A {@see Base} instance.
			//
		} /* ConstructorProps */ else {
			appPkgName = c9rProps.appPkgName;
			props = c9rProps.props; // Potentially a {@see Base} instance.
		}
		if (!appPkgName || !$isꓺstring(appPkgName)) {
			throw new Error('Invalid `appPkgName`. Expecting non-empty string.');
		}
		if (props && !$isꓺobject(props)) {
			throw new Error('Invalid `props`. Expecting object.');
		}
		this.#appPkgName = appPkgName; // Effectively a namespace.

		if (props /* Assigns own enumerable properties. */) {
			for (const [key, value] of $objꓺkeyAndSymbolEntries(props)) {
				this[key] = value; // Definite assignments.
			}
		}
	}

	/**
	 * {@see constructor()} helper.
	 *
	 * @returns Object app package name.
	 */
	public get [$toꓺsymbols.appPkgName](): ReturnType<$type.ToAppPkgNameFn> {
		return this.#appPkgName; // Effectively a namespace.
	}

	/**
	 * {@see $obj.tag()} helper.
	 *
	 * @returns Object tag (aka: class name).
	 */
	public get [$toꓺsymbols.tag](): ReturnType<$type.ToTagFn> {
		return this.#appPkgName + '/' + ($objꓺprotoC9r(this)?.name || 'Object');
	}

	/**
	 * {@see $obj.tag()} helper.
	 *
	 * @returns Object tag (aka: class name).
	 */
	public get [$toꓺsymbols.stringTag](): ReturnType<$type.ToStringTagFn> {
		return this.#appPkgName + '/' + ($objꓺprotoC9r(this)?.name || 'Object');
	}

	/**
	 * {@see $to.plainObject()} helper.
	 *
	 * @returns What to derive a plain object from.
	 */
	public [$toꓺsymbols.plain](): ReturnType<$type.ToPlainSymbolFn> {
		return this; // What to derive a plain object from.
	}

	/**
	 * {@see JSON.stringify()} helper.
	 *
	 * @param   key Optional. Specific object key.
	 *
	 * @returns     What to derive a JSON value from.
	 */
	public [$toꓺmethods.json](): ReturnType<$type.ToJSONFn> {
		return this; // What to derive a JSON value from.
	}

	/**
	 * {@see $objꓺclone()}, {@see $objꓺcloneDeep()} helper.
	 *
	 * @param   data Containing `{deep, opts, circular, inDeep}`.
	 *
	 * @returns      A shallow or deep clone of this object.
	 */
	public [$toꓺsymbols.clone]({ deep, opts, circular }: Parameters<$type.ToCloneSymbolFn>[0]): ReturnType<$type.ToCloneSymbolFn> {
		const protoC9r = $objꓺprotoC9r(this);
		if (!protoC9r) return; // Not possible.

		if (deep /* Produces a deep clone. */) {
			if (circular.has(this)) {
				return circular.get(this);
			}
			const deepClone = new protoC9r(this);
			circular.set(this, deepClone); // Before going deep.

			for (const key of $objꓺkeysAndSymbols(deepClone)) {
				// Readonly keys are skipped to avoid triggering errors.
				// Instead, any readonly keys must be handled by constructor.
				if (Object.getOwnPropertyDescriptor(deepClone, key)?.writable) {
					deepClone[key] = $objꓺcloneDeep(deepClone[key], opts, circular, true);
				}
			}
			return deepClone;
		}
		return new protoC9r(this);
	}
}
