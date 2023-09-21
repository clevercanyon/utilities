/**
 * Base class.
 */

import { pkgName as $appꓺpkgName } from '../../app.ts';
import type { $type } from '../../index.ts';
import { c9r as $objꓺc9r, cloneDeep as $objꓺcloneDeep, keysAndSymbols as $objꓺkeysAndSymbols } from '../../obj.ts';
import {
    objStringTag as $symbolꓺobjStringTag,
    objTag as $symbolꓺobjTag,
    objToClone as $symbolꓺobjToClone,
    objToJSON as $symbolꓺobjToJSON,
    objToPlain as $symbolꓺobjToPlain,
} from '../../symbol.ts';

let Class: Constructor | undefined; // Class definition cache.

/**
 * Defines types.
 */
export type Constructor = {
    readonly appPkgName: string;
    new (): Interface; // Takes in nothing.
};
export declare class Interface {
    [x: $type.ObjectKey]: unknown;
    public static readonly appPkgName: string;

    public constructor(); // Takes in nothing.

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
         */
        public constructor(/* Takes in nothing. */) {
            // Nothing in base constructor at this time.
            // ---
            // Note: Classes extending this base *must* be capable
            // of handling the first constructor argument being passed as
            // an instance of itself; i.e., to facilitate shallow|deep cloning.
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
                // @ts-ignore -- `this` constructor arg ok.
                const deepClone = new c9r(this); // A deep clone.
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
            // @ts-ignore -- `this` constructor arg ok.
            return new c9r(this); // In this case, a shallow clone.
        }
    };
    return Object.defineProperty(Class, 'name', {
        ...Object.getOwnPropertyDescriptor(Class, 'name'),
        value: 'Base',
    });
};
