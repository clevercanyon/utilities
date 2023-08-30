/**
 * Base class.
 */

import {
	c9r as $objꓺc9r, //
	cloneDeep as $objꓺcloneDeep,
	keysAndSymbols as $objꓺkeysAndSymbols,
	keyAndSymbolEntries as $objꓺkeyAndSymbolEntries,
} from '../../obj.js';

import {
	objTag as $symbolꓺobjTag,
	objToJSON as $symbolꓺobjToJSON,
	objToPlain as $symbolꓺobjToPlain,
	objToClone as $symbolꓺobjToClone,
	objStringTag as $symbolꓺobjStringTag,
} from '../../symbol.js';

import type * as $type from '../../type.js';
import { object as $isꓺobject } from '../../is.js';
import { pkgName as $appꓺpkgName } from '../../app.js';

let Class: Constructor | undefined; // Class definition cache.

/**
 * Defines types.
 */
export type Constructor = {
	readonly appPkgName: string;
	new (props?: object | Interface): Interface;
};
export declare class Interface {
	[x: $type.ObjectKey]: unknown;

	public static readonly appPkgName: string;
	public constructor(props?: object | Interface);

	public get [$symbolꓺobjTag](): ReturnType<$type.ObjTagFn>;
	public get [$symbolꓺobjStringTag](): ReturnType<$type.ObjStringTagFn>;

	public [$symbolꓺobjToPlain](): ReturnType<$type.ObjToPlainSymbolFn>;
	public [$symbolꓺobjToJSON](): ReturnType<$type.ObjToJSONFn>;
	public [$symbolꓺobjToClone]({ deep, opts, circular }: Parameters<$type.ObjToCloneSymbolFn>[0]): ReturnType<$type.ObjToCloneSymbolFn>;
}

/**
 * Base class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
	if (Class) return Class;

	Class = class implements Interface {
		/**
		 * Arbitrary object keys.
		 */
		[x: $type.ObjectKey]: unknown;

		/**
		 * App package name.
		 */
		public static readonly appPkgName = $appꓺpkgName;

		/**
		 * Object constructor.
		 *
		 * @param props Props or {@see Interface} instance.
		 */
		public constructor(props?: object | Interface) {
			if (props && !$isꓺobject(props)) {
				throw new Error('Invalid `props`. Expecting object.');
			}
			if (props /* Assigns own enumerable properties. */) {
				for (const [key, value] of $objꓺkeyAndSymbolEntries(props)) {
					this[key] = value; // Definite assignments.
				}
			}
		}

		/**
		 * {@see $obj.tag()} helper.
		 *
		 * @returns Object tag (aka: class name).
		 */
		public get [$symbolꓺobjTag](): ReturnType<$type.ObjTagFn> {
			const c9r = $objꓺc9r(this) as Constructor;
			return (c9r.appPkgName || '?') + '/' + (c9r.name || '?');
		}

		/**
		 * {@see $obj.tag()} helper.
		 *
		 * @returns Object tag (aka: class name).
		 */
		public get [$symbolꓺobjStringTag](): ReturnType<$type.ObjStringTagFn> {
			const c9r = $objꓺc9r(this) as Constructor;
			return (c9r.appPkgName || '?') + '/' + (c9r.name || '?');
		}

		/**
		 * {@see $to.plainObject()} helper.
		 *
		 * @returns What to derive a plain object from.
		 */
		public [$symbolꓺobjToPlain](): ReturnType<$type.ObjToPlainSymbolFn> {
			return this; // What to derive a plain object from.
		}

		/**
		 * {@see JSON.stringify()} helper.
		 *
		 * @param   key Optional. Specific object key.
		 *
		 * @returns     What to derive a JSON value from.
		 */
		public [$symbolꓺobjToJSON](): ReturnType<$type.ObjToJSONFn> {
			return this; // What to derive a JSON value from.
		}

		/**
		 * {@see $objꓺclone()}, {@see $objꓺcloneDeep()} helper.
		 *
		 * @param   data Containing `{deep, opts, circular, inDeep}`.
		 *
		 * @returns      A shallow or deep clone of this object.
		 */
		public [$symbolꓺobjToClone]({ deep, opts, circular }: Parameters<$type.ObjToCloneSymbolFn>[0]): ReturnType<$type.ObjToCloneSymbolFn> {
			const c9r = $objꓺc9r(this) as Constructor;

			if (deep /* Produces a deep clone. */) {
				if (circular.has(this)) {
					return circular.get(this);
				}
				const deepClone = new c9r(this);
				circular.set(this, deepClone); // Before going deep.

				for (const key of $objꓺkeysAndSymbols(deepClone)) {
					// Enumerable readonly keys (a rarity) are skipped to avoid triggering errors.
					// Instead, any enumerable readonly keys (a rarity) must be handled by constructor.

					if (Object.getOwnPropertyDescriptor(deepClone, key)?.writable) {
						deepClone[key] = $objꓺcloneDeep(deepClone[key], opts, circular, true);
					}
				}
				return deepClone;
			}
			return new c9r(this);
		}
	};
	return Object.defineProperty(Class, 'name', {
		...Object.getOwnPropertyDescriptor(Class, 'name'),
		value: 'Base',
	});
};
