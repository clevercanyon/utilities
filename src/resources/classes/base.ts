/**
 * Base class.
 */

import { $app, $class, $obj, $symbol, type $type } from '../../index.ts';

let Defined: Constructor | undefined; // Cache.

/**
 * Defines types.
 */
export type Constructor = {
    readonly appPkgName: string;
    new (): Class; // Takes in nothing.
};
export type Class = ClassInterface;

declare class ClassInterface {
    [x: $type.ObjectKey]: unknown;
    public static readonly appPkgName: string;

    public constructor(); // Takes in nothing.

    public get [$symbol.objTag](): ReturnType<$class.ObjTagSymbolFn>;
    public get [$symbol.objStringTag](): ReturnType<$class.ObjStringTagSymbolFn>;

    public [$symbol.objToPlain](): ReturnType<$class.ObjToPlainSymbolFn>;
    public [$symbol.objToEquals](): ReturnType<$class.ObjToEqualsSymbolFn>;
    public [$symbol.objToJSON](): ReturnType<$class.ObjToJSONSymbolFn>;
    public [$symbol.objToClone](...args: Parameters<$class.ObjToCloneSymbolFn>): ReturnType<$class.ObjToCloneSymbolFn>;
}

/**
 * Base class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
    if (Defined) return Defined;

    Defined = class implements Class {
        /**
         * Arbitrary object keys.
         */
        [x: $type.ObjectKey]: unknown;

        /**
         * App package name.
         */
        public static readonly appPkgName = $app.pkgName;

        /**
         * Object constructor.
         */
        public constructor(/* Takes in nothing. */) {
            // Nothing in base constructor at this time.
            // ---
            // Note: Classes extending this base *must* be capable
            // of handling the first constructor argument being passed as
            // an instance of itself to facilitate shallow and/or deep cloning.
        }

        /**
         * {@see $obj.tag()} helper.
         *
         * @returns Object tag (aka: class name).
         */
        public get [$symbol.objTag](): ReturnType<$class.ObjTagSymbolFn> {
            const c9r = $obj.c9r(this) as Constructor;
            return (c9r.appPkgName || '?') + '/' + (c9r.name || '?');
        }

        /**
         * {@see $obj.tag()} helper.
         *
         * @returns Object tag (aka: class name).
         */
        public get [$symbol.objStringTag](): ReturnType<$class.ObjStringTagSymbolFn> {
            const c9r = $obj.c9r(this) as Constructor;
            return (c9r.appPkgName || '?') + '/' + (c9r.name || '?');
        }

        /**
         * {@see $to.plainObject()} helper.
         *
         * @returns Object to derive a plain object from.
         */
        public [$symbol.objToPlain](): ReturnType<$class.ObjToPlainSymbolFn> {
            return this; // Object to derive a plain object from.
        }

        /**
         * {@see $is.deepEqual()} helper.
         *
         * @returns Object to derive an equals check from.
         */
        public [$symbol.objToEquals](): ReturnType<$class.ObjToEqualsSymbolFn> {
            return this; // Object to derive an equals check from.
        }

        /**
         * {@see $json.stringify()} helper.
         *
         * @param   key Optional. Specific object key.
         *
         * @returns     What value to derive a JSON value from.
         */
        public [$symbol.objToJSON](): ReturnType<$class.ObjToJSONSymbolFn> {
            return this; // What value to derive a JSON value from.
        }

        /**
         * {@see $obj.clone()}, {@see $obj.cloneDeep()} helper.
         *
         * @param   data Containing `{deep, opts, circular, inDeep}`.
         *
         * @returns      A shallow or deep clone of this object.
         */
        public [$symbol.objToClone]({ deep, opts, circular }: Parameters<$class.ObjToCloneSymbolFn>[0]): ReturnType<$class.ObjToCloneSymbolFn> {
            const c9r = $obj.c9r(this) as Constructor;

            if (deep /* Produces a deep clone. */) {
                if (circular.has(this)) {
                    return circular.get(this);
                }
                // @ts-ignore -- `this` constructor arg ok.
                const deepClone = new c9r(this); // A deep clone.
                circular.set(this, deepClone); // Before going deep.

                for (const key of $obj.keysAndSymbols(deepClone)) {
                    // Enumerable readonly keys (a rarity) are skipped to avoid triggering errors.
                    // Instead, any enumerable readonly keys (a rarity) must be handled by constructor.

                    if (Object.getOwnPropertyDescriptor(deepClone, key)?.writable) {
                        deepClone[key] = $obj.cloneDeep(deepClone[key], opts, circular, true);
                    }
                }
                return deepClone;
            }
            // @ts-ignore -- `this` constructor arg ok.
            return new c9r(this); // In this case, a shallow clone.
        }
    };
    return Object.defineProperty(Defined, 'name', {
        ...Object.getOwnPropertyDescriptor(Defined, 'name'),
        value: 'Base',
    });
};
