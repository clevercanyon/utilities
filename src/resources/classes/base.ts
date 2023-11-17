/**
 * Base class.
 */

import { $app, $obj, $symbol, type $type } from '../../index.ts';

/**
 * Class object cache.
 */
let Base: Constructor;

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

    public get [$symbol.objTag](): ReturnType<$type.ObjTagSymbolFn>;
    public get [$symbol.objStringTag](): ReturnType<$type.ObjStringTagSymbolFn>;

    public [$symbol.objToPlain](): ReturnType<$type.ObjToPlainSymbolFn>;
    public [$symbol.objToEquals](): ReturnType<$type.ObjToEqualsSymbolFn>;
    public [$symbol.objToJSON](): ReturnType<$type.ObjToJSONSymbolFn>;
    public [$symbol.objToClone](...args: Parameters<$type.ObjToCloneSymbolFn>): ReturnType<$type.ObjToCloneSymbolFn>;
}

/**
 * Base class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
    if (Base) return Base;

    Base = class implements Class {
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
        public get [$symbol.objTag](): ReturnType<$type.ObjTagSymbolFn> {
            const c9r = $obj.c9r(this) as Constructor;
            return (c9r.appPkgName || '?') + '/' + (c9r.name || '?');
        }

        /**
         * {@see $obj.tag()} helper.
         *
         * @returns Object tag (aka: class name).
         */
        public get [$symbol.objStringTag](): ReturnType<$type.ObjStringTagSymbolFn> {
            const c9r = $obj.c9r(this) as Constructor;
            return (c9r.appPkgName || '?') + '/' + (c9r.name || '?');
        }

        /**
         * {@see $to.plainObject()} helper.
         *
         * @returns Object to derive a plain object from.
         */
        public [$symbol.objToPlain](): ReturnType<$type.ObjToPlainSymbolFn> {
            return this; // Object to derive a plain object from.
        }

        /**
         * {@see $is.deepEqual()} helper.
         *
         * @returns Object to derive an equals check from.
         */
        public [$symbol.objToEquals](): ReturnType<$type.ObjToEqualsSymbolFn> {
            return this; // Object to derive an equals check from.
        }

        /**
         * {@see $json.stringify()} helper.
         *
         * @returns What value to derive a JSON value from.
         */
        public [$symbol.objToJSON](): ReturnType<$type.ObjToJSONSymbolFn> {
            return this; // What value to derive a JSON value from.
        }

        /**
         * {@see $obj.clone()}, {@see $obj.cloneDeep()} helper.
         *
         * @param   data Containing `{deep, opts, circular, inDeep}`.
         *
         * @returns      A shallow or deep clone of this object.
         */
        public [$symbol.objToClone]({ deep, opts, circular }: Parameters<$type.ObjToCloneSymbolFn>[0]): ReturnType<$type.ObjToCloneSymbolFn> {
            const c9r = $obj.c9r(this) as Constructor;

            if (deep /* Produces a deep clone. */) {
                if (circular.has(this)) {
                    return circular.get(this);
                }
                // @ts-ignore -- `this` constructor arg ok.
                const deepClone = new c9r(this); // A deep clone.
                circular.set(this, deepClone); // Before going deep.

                for (const key of $obj.keysAndSymbols(deepClone)) {
                    // Enumerable readonly keys are skipped to avoid triggering errors.
                    // Instead, any enumerable readonly keys must be handled by constructor.

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
    return Object.defineProperty(Base, 'name', {
        ...Object.getOwnPropertyDescriptor(Base, 'name'),
        value: 'Base',
    });
};
