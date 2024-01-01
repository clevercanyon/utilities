/**
 * Object utilities.
 */

import { type $type } from '#index.ts';
import type * as MicroMemoize from 'micro-memoize';
import microMemoizeWithBrokenTypes from 'micro-memoize';

/**
 * Exports app package name.
 */
export const $appꓺ$pkgName = $$__APP_PKG_NAME__$$;

/**
 * Exports symbols; {@see $symbols}.
 */
export const $symbolꓺobjTag: unique symbol = Symbol('objTag');
export const $symbolꓺobjStringTag: symbol = Symbol.toStringTag;
export const $symbolꓺobjToEquals: unique symbol = Symbol('objToEquals');

/**
 * Stores plain object c9r as string.
 */
export const $objꓺplainC9rStr = String(Object);

/**
 * No-op function.
 */
export const $fnꓺnoOp = (): void => undefined;

/**
 * Checks if value is an array.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is an array.
 */
export const $isꓺarray = <Type>(value: $type.OfArray<Type> | unknown): value is $type.OfArray<Type> => {
    return value instanceof Array || Array.isArray(value);
};

/**
 * Checks if value is an object.
 *
 * Exact inverse of {@see $is.primitive()}.
 *
 * @param   value Value to consider.
 * @param   opts  Options. Default is `{}`.
 *
 * @returns       True if value is an object.
 *
 * @note This also returns true for arrays.
 * @note This also returns true for functions.
 * @note This also returns true for async functions.
 * @note This also returns true for generator functions.
 * @note This also returns true for async generator functions.
 * @note This also returns true for proxied functions, sync or async.
 * @note This also returns true for memoized functions.
 */
export const $isꓺobject = <Type>(value: $type.OfObject<Type> | unknown): value is $type.OfObject<Type> => {
    return null !== value && ['object', 'function'].includes(typeof value);
};

/**
 * Checks if value is a prototype.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a prototype.
 */
export const $isꓺproto = <Type>(value: $type.OfObject<Type> | unknown): value is $type.OfObject<Type> => {
    return $isꓺobject(value) && value === (value.constructor?.prototype || Object.prototype);
};

/**
 * Checks if a value is any kind of function.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is ny kind of function.
 *
 * @note This also returns true for async functions.
 * @note This also returns true for generator functions.
 * @note This also returns true for async generator functions.
 * @note This also returns true for proxied functions, sync or async.
 * @note This also returns true for memoized and curried sync or async functions.
 */
export const $isꓺfunction = (value: unknown): value is $type.Function => {
    return value instanceof Function;
};

/**
 * Checks if a value is any kind of async function.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is any kind of async function.
 *
 * @note This also returns true for async generator functions.
 * @note This also returns true for proxied async functions.
 * @note This also returns true for memoized and curried async functions.
 */
export const $isꓺasyncFunction = (value: unknown): value is $type.AsyncFunction => {
    return $isꓺfunction(value) && $isꓺobjectOfTag(value, 'AsyncFunction');
};

/**
 * Checks a value’s object tag.
 *
 * @param   value       Value to consider.
 * @param   requiredTag Required object tag.
 *
 * @returns             True if value’s object tag matches.
 *
 * @note Please {@see $objꓺtag()} for details regarding the special case of `[tag]:[cn]`.
 */
export const $isꓺobjectTag = (value: unknown, requiredTag: string): boolean => {
    return $objꓺtag(value) === requiredTag;
};

/**
 * Checks if a value has one or more object tags.
 *
 * @param   value           Value to consider.
 * @param   ...requiredTags Required object tag(s). Each argument is equivalent to an `AND` condition. Each argument
 *   that is an array is equivalent to a bracketed `AND (tag OR tag)` condition, allowing for both logical operators.
 *
 * @returns                 True if value is of all required object tags.
 *
 * @note Please {@see $objꓺtag()} for details regarding the special case of `[tag]:[cn]`.
 */
export const $isꓺobjectOfTag = (value: unknown, ...requiredTags: (string | string[])[]): boolean => {
    const objTags = $objꓺtags(value);

    for (const condition of requiredTags) {
        if ($isꓺarray(condition) /* AND (`tag` OR `tag`). */) {
            let hasAnyOfTheseTags = false;

            for (const tag of new Set(condition)) {
                if (objTags.includes(tag)) {
                    hasAnyOfTheseTags = true;
                    break;
                }
            }
            if (!hasAnyOfTheseTags) {
                return false;
            }
        } /* AND `tag` condition. */ else {
            if (!objTags.includes(condition)) {
                return false;
            }
        }
    }
    return true;
};

/**
 * Gets a value’s constructor.
 *
 * @param   value Value to consider.
 *
 * @returns       Value’s constructor, else undefined.
 */
export const $objꓺc9r = (value: unknown): $type.ObjectC9r | undefined => {
    return ($isꓺobject(value) && (value?.constructor as $type.ObjectC9r)) || undefined;
};

/**
 * Gets a value’s own constructor.
 *
 * @param   value Value to consider.
 *
 * @returns       Value’s own constructor, else undefined.
 */
export const $objꓺownC9r = (value: unknown): $type.ObjectC9r | undefined => {
    return ($isꓺobject(value) && Object.hasOwn(value, 'constructor') && (value.constructor as $type.ObjectC9r)) || undefined;
};

/**
 * Works as an alias of {@see Object.getPrototypeOf()}.
 *
 * This variant also supports going up multiple prototype levels.
 *
 * @param   value    Value to consider.
 * @param   levelsUp Levels up. Default is `1`.
 *
 * @returns          Prototype of value, else undefined.
 */
export const $objꓺproto = (value: unknown, levelsUp: number = 1): $type.Object | undefined => {
    let __proto__: unknown = levelsUp >= 1 ? value : undefined; // Initialize.

    for (let levels = levelsUp, times = 0; levels >= 1; levels--, times++) {
        if (null === __proto__ || undefined === __proto__) break;
        __proto__ = Object.getPrototypeOf(__proto__);
    }
    return (__proto__ as $type.Object) || undefined;
};

/**
 * Gets a value’s `[Symbol.toStringTag]` object tag.
 *
 * `[Symbol.toStringTag]` is the property name for a string that’s used in the creation of a default description of an
 * object (aka: an object’s tag, or class name). It's called automatically by {@see Object.prototype.toString()}.
 *
 * When a value reports its `[Symbol.toStringTag]` object tag as being `Object`, but is actually not a plain object,
 * then it doesn’t have a `[Symbol.toStringTag]` object tag of its own yet. In such a case, this utility appends the
 * value’s constructor name; i.e., `:[cn]`, with the caveat that it’s likely not a unique constructor name.
 *
 * In such a case, the special format `[tag]:[cn]` is used to indicate that the object tag is actually from an inherited
 * `[Symbol.toStringTag]` and that `:[cn]` is a constructor name. Generally speaking, these `[tag]:[cn]` values are of
 * little practical use, since constructor names are likely not unique names across the entire global spectrum, which is
 * particularly true when minification is applied during a build routine. Therefore, it is far better when an object
 * implements a real, and ideally unique `[Symbol.toStringTag]` object tag of its own.
 *
 * Also note that ‘own’ in the context of an object tag is not the same as an object having its own property. An object
 * can have its own tag, but indeed that tag might be inherited from a parent class that it’s an instance of. The only
 * tag that we scrutinize further is the plain `Object` tag. Any non-plain-object value or prototype that has a default
 * `Object` tag coming from the root `Object` prototype (which is shared by every object), obviously does not have its
 * ‘own’ tag anywhere its prototype chain. This is when the `[tag]:[cn]` format is applied.
 *
 * @param   value Value to consider.
 *
 * @returns       Value’s `[Symbol.toStringTag]` object tag.
 *
 * @note Please read the details above regarding the special case of `[tag]:[cn]`.
 * @note Please see: <https://o5p.me/ownLcv> for details regarding `[Symbol.toStringTag]`.
 */
export const $objꓺtag = (value: unknown): string => {
    let tag = $isꓺobject(value) ? String(value[$symbolꓺobjTag] || '') : '';
    if (!tag) tag = Object.prototype.toString.call(value).slice(8, -1);

    if ('Object' === tag /* Is it really a plain object? */) {
        const __proto__ = $isꓺproto(value) ? value : $objꓺproto(value);
        const __proto__ownC9r = __proto__ ? $objꓺownC9r(__proto__) : undefined;

        if (__proto__ && (!(__proto__ownC9r instanceof Object) || String(__proto__ownC9r) !== $objꓺplainC9rStr)) {
            if (__proto__ownC9r?.name) {
                return tag + ':' + __proto__ownC9r.name; // Not a real object tag.
            } else {
                return tag + ':?'; // Unknown; e.g., anonymous. Also not a real object tag.
            }
        }
    }
    return tag; // Object’s tag.
};

/**
 * Gets a value’s own and/or inherited `[Symbol.toStringTag]` object tags.
 *
 * @param   value    Value to consider.
 * @param   deepTags For internal use only. Do not pass.
 *
 * @returns          A value’s own and/or inherited `[Symbol.toStringTag]` object tags.
 *
 * @note Please {@see $objꓺtag()} for details regarding the special case of `[tag]:[cn]`.
 */
export const $objꓺtags = (value: unknown, deepTags?: Set<string>): Readonly<string[]> => {
    let nextProto; // Initialize.

    if (!deepTags) {
        deepTags = new Set();
        deepTags.add($objꓺtag(value)); // Parses object’s tag from the initial instance value.
        nextProto = $objꓺproto(value, 2); // Value was used, so skip a prototype level in this case.
        //
    } /* Treats value as a `__proto__` in the prototype chain. */ else {
        const __proto__ = value;
        deepTags.add($objꓺtag(__proto__));
        nextProto = $objꓺproto(__proto__);
    }
    if (nextProto) {
        return $objꓺtags(nextProto, deepTags);
    }
    return Object.freeze(Array.from(deepTags));
};

/**
 * Gets all of an object’s own enumerable keys and symbols.
 *
 * @param   value Value from which to get keys and symbols.
 *
 * @returns       Own enumerable keys and symbols.
 *
 *   In this order:
 *
 *   - Numeric keys in ascending order.
 *   - String keys in their insertion order.
 *   - Symbol keys in their insertion order.
 *
 * @note Unlike {@see Object.keys()}, this returns symbol keys also.
 * @note Key order matches that of `{ ...spread }` and {@see Object.keys()}.
 * @note Regarding enumerability and ownership, see: <https://o5p.me/cht9Ot>.
 */
export const $objꓺkeysAndSymbols = (value: unknown): $type.ObjectKey[] => {
    const keys: $type.ObjectKey[] = [];
    const objValue = Object(value) as $type.Object;

    for (const keyOrSymbol of Reflect.ownKeys(objValue)) {
        if (Object.getOwnPropertyDescriptor(objValue, keyOrSymbol)?.enumerable) {
            keys.push(keyOrSymbol);
        }
    }
    return keys;
};

/**
 * Checks if two values are strictly equal to each other.
 *
 * @param   a First value to compare.
 * @param   b Second value to compare.
 *
 * @returns   True if values are strictly equal; {@see https://o5p.me/58Z0j0}.
 */
export const $isꓺequal = (a: unknown, b: unknown): boolean => {
    return Object.is(a, b); // Handles `NaN` tests also.
};

/**
 * Checks if values are deeply equal to each other.
 *
 * @param   a First value to compare.
 * @param   b Second value to compare.
 *
 * @returns   True if values are deeply equal to each other.
 */
export const $isꓺdeepEqual = (a: unknown, b: unknown): boolean => {
    return $isꓺdeepEqualꓺhelper(a, b); // Ensures two arguments only.
};

/**
 * Helps check if values are deeply equal to each other.
 *
 * @param   a        First value to compare.
 * @param   b        Second value to compare.
 * @param   circular Internal use only. Do not pass.
 *
 * @returns          True if values are deeply equal to each other.
 */
const $isꓺdeepEqualꓺhelper = (a: unknown, b: unknown, circular: Map<object, Map<object, boolean>> = new Map()): boolean => {
    // Primitives, functions, or anything else.
    if ($isꓺequal(a, b)) return true; // Strict equal check.

    // Note that we are intentionally choosing *not* to use `$isꓺobject()` here.
    // Functions are intentionally excluded here. They must be strictly equal (above).
    if (!a || !b || 'object' !== typeof a || 'object' !== typeof b) return false;
    if (!$isꓺequal(a.constructor, b.constructor)) return false;

    if (circular.has(a)) {
        if (circular.get(a)?.has(b)) {
            return circular.get(a)?.get(b) as boolean;
        }
    } /* Creates a new `a` map. */ else {
        circular.set(a, new Map());
    }
    let rtn = false; // Initialize.

    const objTag = $objꓺtag(a);
    const isPlain = 'Object' === objTag;
    const hasToEquals = !isPlain && Object.hasOwn(a, $symbolꓺobjToEquals);

    switchCase: switch (true) {
        case isPlain || hasToEquals: {
            // ↑ Just like {@see $isꓺplainObject()}.

            let aObj = a as $type.Object;
            let bObj = b as $type.Object;

            if (hasToEquals /* One of our objects; extending base class. */) {
                aObj = (aObj[$symbolꓺobjToEquals] as $type.Function)() as $type.Object;
                bObj = (bObj[$symbolꓺobjToEquals] as $type.Function)() as $type.Object;
            }
            const keysAndSymbols = $objꓺkeysAndSymbols(aObj);
            if (keysAndSymbols.length !== $objꓺkeysAndSymbols(bObj).length) break switchCase;

            for (let i = 0; i < keysAndSymbols.length; i++) {
                if (!Object.hasOwn(bObj, keysAndSymbols[i])) break switchCase;
                if (!$isꓺdeepEqualꓺhelper(aObj[keysAndSymbols[i]], bObj[keysAndSymbols[i]], circular)) break switchCase;
            }
            rtn = true;
            break switchCase;
        }
        case $isꓺarray(a) || 'Arguments' === objTag: {
            // ↑ Just like {@see $isꓺfnArguments()}.

            const aObj = a as unknown[];
            const bObj = b as unknown[];

            if (aObj.length !== bObj.length) break switchCase;

            for (let i = 0; i < aObj.length; i++) {
                if (!$isꓺdeepEqualꓺhelper(aObj[i], bObj[i], circular)) break switchCase;
            }
            rtn = true;
            break switchCase;
        }
        case a instanceof Set: {
            // ↑ Just like {@see $isꓺset()}.

            const aObj = a as Set<unknown>;
            const bObj = b as Set<unknown>;

            if (aObj.size !== bObj.size) break switchCase;

            const aValues = [...aObj];
            const bValues = [...bObj];

            for (let i = 0; i < aValues.length; i++) {
                if (!$isꓺdeepEqualꓺhelper(aValues[i], bValues[i], circular)) break switchCase;
            }
            rtn = true;
            break switchCase;
        }
        case a instanceof Map: {
            // ↑ Just like {@see $isꓺmap()}.

            const aObj = a as Map<unknown, unknown>;
            const bObj = b as Map<unknown, unknown>;

            if (aObj.size !== bObj.size) break switchCase;

            for (const [key, value] of aObj) {
                if (!bObj.has(key)) break switchCase;
                if (!$isꓺdeepEqualꓺhelper(value, bObj.get(key), circular)) break switchCase;
            }
            rtn = true;
            break switchCase;
        }
        case ArrayBuffer.isView(a) && !(a instanceof DataView): {
            // ↑ Just like {@see $isꓺtypedArray()}.

            const aObj = a as $type.TypedArray;
            const bObj = b as $type.TypedArray;

            if (aObj.length !== bObj.length) break switchCase;

            for (let i = 0; i < aObj.length; i++) {
                if (aObj[i] !== bObj[i]) break switchCase;
            }
            rtn = true;
            break switchCase;
        }
        case a instanceof URL: {
            // ↑ Just like {@see $isꓺurl()}.

            const aObj = a as unknown as URL;
            const bObj = b as URL;

            rtn = aObj.toString() === bObj.toString();
            break switchCase;
        }
        case a instanceof Date: {
            // ↑ Just like {@see $isꓺdate()}.

            const aObj = a as unknown as Date;
            const bObj = b as Date;

            rtn = aObj.getTime() === bObj.getTime();
            break switchCase;
        }
        case a instanceof RegExp: {
            // ↑ Just like {@see $isꓺregExp()}.

            const aObj = a as unknown as RegExp;
            const bObj = b as RegExp;

            rtn = aObj.source === bObj.source && aObj.flags === bObj.flags;
            break switchCase;
        }
        case ['Boolean', 'Number', 'String'].includes(objTag): {
            // ↑ Rare case of primitive object wrappers.

            const aObj = a as $type.Object;
            const bObj = b as $type.Object;

            rtn = aObj.valueOf() === bObj.valueOf();
            break switchCase;
        }
    }
    circular.get(a)?.set(b, rtn);
    return rtn; // Now in circular map.
};

/**
 * Defines typed version of micro-memoize function.
 */
const $fnꓺmicroMemoize = microMemoizeWithBrokenTypes as unknown as $fnꓺMicroMemoizeꓺFn; // Fixes broken types.
type $fnꓺMicroMemoizeꓺFn = <Fn extends MicroMemoize.AnyFn>(fn: Fn | MicroMemoize.Memoized<Fn>, options?: MicroMemoize.Options<Fn>) => MicroMemoize.Memoized<Fn>;

/**
 * Defines memoization utility types.
 */
type $fnꓺMemoizable = MicroMemoize.AnyFn; // Sync or async; does not matter.
export type $fnꓺMemoOptions<Fn extends MicroMemoize.AnyFn> = MicroMemoize.Options<Fn> & { deep?: boolean };
export type $fnꓺMemoizedFunction<Fn extends MicroMemoize.AnyFn> = MicroMemoize.Memoized<Fn> & {
    flush: (this: $fnꓺMemoizedFunction<Fn>) => { fresh: $fnꓺMemoizedFunction<Fn> };
    fresh: $fnꓺMemoizedFunction<Fn>; // Magic getter.
};

/**
 * Exports memoize utility function.
 *
 * This has to be clearly marked as not having side-effects because we often use it to produce exports. If those exports
 * are not used, we don’t want memoization of those exports to cause them not to be tree-shaken.
 *
 * @param   ...args {@see $fnꓺMemoizable} {@see $fnꓺmemo()} signatures.
 *
 * @returns         Memoized function; {@see $fnꓺMemoizedFn}.
 *
 * @see $fnꓺmemoꓺflushꓺhelper
 * @see $fnꓺmemoꓺfreshꓺhelper
 * @see https://www.npmjs.com/package/micro-memoize
 */
export function $fnꓺmemo<Fn extends $fnꓺMemoizable>(fn: Fn | $fnꓺMemoizedFunction<Fn>, options?: $fnꓺMemoOptions<Fn>): $fnꓺMemoizedFunction<Fn>;
export function $fnꓺmemo<Fn extends $fnꓺMemoizable>(options: $fnꓺMemoOptions<Fn>, fn: Fn | $fnꓺMemoizedFunction<Fn>): $fnꓺMemoizedFunction<Fn>;
export function $fnꓺmemo<Fn extends $fnꓺMemoizable>(maxSize: number, fn: Fn | $fnꓺMemoizedFunction<Fn>): $fnꓺMemoizedFunction<Fn>;
/*@__NO_SIDE_EFFECTS__*/
export function $fnꓺmemo<Fn extends $fnꓺMemoizable>(...args: unknown[] /* see function signatures above. */): $fnꓺMemoizedFunction<Fn> {
    let fn: Fn | $fnꓺMemoizedFunction<Fn>, options: $fnꓺMemoOptions<Fn> | undefined, memoizedFn: $fnꓺMemoizedFunction<Fn>, deep: boolean;

    if ($isꓺfunction(args[0])) {
        fn = args[0] as Fn | $fnꓺMemoizedFunction<Fn>;
        options = args[1] as $fnꓺMemoOptions<Fn> | undefined;
    } else {
        if ('number' === typeof args[0]) {
            options = { maxSize: args[0] } as $fnꓺMemoOptions<Fn>;
        } else options = args[0] as $fnꓺMemoOptions<Fn> | undefined;
        fn = args[1] as Fn | $fnꓺMemoizedFunction<Fn>;
    }
    deep = options?.deep || false;
    if (options) delete options.deep;

    memoizedFn = $fnꓺmicroMemoize(fn, {
        isPromise: $isꓺasyncFunction(fn),
        isEqual: deep ? $isꓺdeepEqual : $isꓺequal,
        ...options, // Implementation-specific options.
    }) as $fnꓺMemoizedFunction<Fn>;

    Object.defineProperty(memoizedFn, 'flush', { value: $fnꓺmemoꓺflushꓺhelper<Fn> });
    Object.defineProperty(memoizedFn, 'fresh', { get: $fnꓺmemoꓺfreshꓺhelper<Fn> });

    return memoizedFn;
}

/**
 * Flushes a memoized function’s memo cache.
 *
 * @example
 *     `foo.flush().fresh(a, b, c)`.
 *
 * @see $fnꓺmemo()
 */
const $fnꓺmemoꓺflushꓺhelper = function <Fn extends $fnꓺMemoizable>(this: $fnꓺMemoizedFunction<Fn>): { fresh: $fnꓺMemoizedFunction<Fn> } {
    const { cache, options } = this; // Extracts locals.

    cache.keys.length = cache.values.length = 0; // Forces these to empty arrays.
    // Must use `.length` to break through `cache` refererences within memoization lib.
    if (options.onCacheChange) options.onCacheChange(cache, options, this);

    return { fresh: this }; // e.g., `foo.flush().fresh(a, b, c)`.
};

/**
 * Flushes a memoized function’s memo cache.
 *
 * @example
 *     `foo.fresh(a, b, c)`;
 *
 * @see $fnꓺmemo()
 */
const $fnꓺmemoꓺfreshꓺhelper = function <Fn extends $fnꓺMemoizable>(this: $fnꓺMemoizedFunction<Fn>): $fnꓺMemoizedFunction<Fn> {
    this.flush(); // Automatically flushes the cache.
    return this; // e.g., `foo.fresh(a, b, c)`.
};

/**
 * Creates a function that can fire multiple times, but only run once.
 *
 * This has to be clearly marked as not having side-effects because we often use it to produce exports. If those exports
 * are not used, we don’t want memoization of those exports to cause them not to be tree-shaken.
 *
 * @param   fn Sync or async function to memoize; i.e., run once; {@see $fnꓺMemoizable}.
 *
 * @returns    Memoized sync or async function that runs once; {@see $fnꓺMemoizedFn}.
 */
/*@__NO_SIDE_EFFECTS__*/
export const $fnꓺonce = <Fn extends $fnꓺMemoizable>(fn: Fn): $fnꓺMemoizedFunction<Fn> => {
    return $fnꓺmemo({ maxSize: 1, isMatchingKey: (): boolean => true }, fn);
};
