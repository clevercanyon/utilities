/**
 * Object utilities.
 */

import '#@initialize.ts';

import * as $standalone from '#@standalone/index.ts';
import { $fnꓺmemo } from '#@standalone/index.ts';
import { $class, $is, $symbol, type $type } from '#index.ts';

let mc: $type.ObjMC;
let mcNoOps: $type.ObjMC;
let mcInitialized: boolean = false;

/**
 * Defines types.
 */
export type MapOptions = { byReference?: boolean; skipReadonly?: boolean; _deep?: boolean };

export type OmitOptions = { byReference?: boolean; skipReadonly?: boolean; undefinedValues?: boolean };
export type UnsetOptions = OmitOptions; // Same as `OmitOptions`.

export type PickOptions = { byReference?: boolean; skipReadonly?: boolean };
export type LeaveOptions = PickOptions; // Same as `PickOptions`.

export type CloneOptions = { with?: CloneWithFn; transfer?: Transferable[] };
export type CloneFnData = { deep: boolean; opts: Required<CloneOptions>; circular: Map<object, object>; inDeep: boolean };
export type CloneWithFn = <Type extends object = object>(value: Type, data: CloneFnData) => Type | undefined;
export type ToCloneSymbolFn = <Type extends object = object>(data: CloneFnData) => Type | undefined;

/**
 * Stores plain object c9r as string.
 */
export const plainC9rStr = $standalone.$objꓺplainC9rStr;

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
export const tag = $fnꓺmemo(64, $standalone.$objꓺtag);

/**
 * Gets a value’s own and/or inherited `[Symbol.toStringTag]` object tags.
 *
 * @param   value    Value to consider.
 * @param   deepTags For internal use only. Do not pass.
 *
 * @returns          A value’s own and/or inherited `[Symbol.toStringTag]` object tags.
 *
 * @note Please {@see tag()} for details regarding the special case of `[tag]:[cn]`.
 */
export const tags = $fnꓺmemo(64, (value: unknown): Readonly<string[]> => $standalone.$objꓺtags(value));

/**
 * Gets a value’s constructor.
 *
 * @param   value Value to consider.
 *
 * @returns       Value’s constructor, else undefined.
 */
export const c9r = $standalone.$objꓺc9r;

/**
 * Gets a value’s own constructor.
 *
 * @param   value Value to consider.
 *
 * @returns       Value’s own constructor, else undefined.
 */
export const ownC9r = $standalone.$objꓺownC9r;

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
export const proto = $standalone.$objꓺproto;

/**
 * Gets a value’s prototype constructor.
 *
 * Uses {@see proto()}, which supports going up multiple prototype levels.
 *
 * @param   value    Value to consider.
 * @param   levelsUp Levels up. Default is `1`.
 *
 * @returns          Value’s prototype constructor, else undefined.
 */
export const protoC9r = (value: unknown, levelsUp: number = 1): $type.ObjectC9r | undefined => {
    return (proto(value, levelsUp)?.constructor as $type.ObjectC9r) || undefined;
};

/**
 * Gets a value’s own prototype constructor.
 *
 * Uses {@see proto()}, which supports going up multiple prototype levels.
 *
 * @param   value    Value to consider.
 * @param   levelsUp Levels up. Default is `1`.
 *
 * @returns          Value’s own prototype constructor, else undefined.
 */
export const protoOwnC9r = (value: unknown, levelsUp: number = 1): $type.ObjectC9r | undefined => {
    const __proto__ = proto(value, levelsUp); // Value’s prototype calculation.
    return (__proto__ && Object.hasOwn(__proto__, 'constructor') && (__proto__.constructor as $type.ObjectC9r)) || undefined;
};

/**
 * Gets all of an object’s enumerable keys.
 *
 * @param   value Value from which to get keys.
 *
 * @returns       All enumerable keys.
 *
 *   In this order:
 *
 *   - Own numeric keys in ascending order.
 *   - Own string keys in their insertion order.
 *
 *   Followed by:
 *
 *   - Inherited numeric keys in ascending order.
 *   - Inherited string keys in their insertion order.
 *
 * @note Unlike {@see Object.keys()}, this returns inherited keys also.
 * @note Key order matches that of `{ ...spread }` and {@see Object.keys()}.
 * @note Regarding enumerability and ownership, see: <https://o5p.me/cht9Ot>.
 */
export const allKeys = (value: unknown): string[] => {
    const objValue = Object(value) as $type.Object,
        keys = Object.keys(objValue);

    const objProto = proto(objValue),
        inheritedKeys = objProto ? allKeys(objProto) : [];

    return [...new Set(keys.concat(inheritedKeys))];
};

/**
 * Gets all of an object’s enumerable key entries.
 *
 * @param   value           Value from which to get key entries.
 * @param   _parentObjValue Internal use only. Do not pass.
 *
 * @returns                 All enumerable key entries.
 *
 *   In this order:
 *
 *   - Own numeric keys in ascending order.
 *   - Own string keys in their insertion order.
 *
 *   Followed by:
 *
 *   - Inherited numeric keys in ascending order.
 *   - Inherited string keys in their insertion order.
 *
 * @note For further details, {@see allKeys()}.
 * @note Unlike {@see Object.entries()}, this returns inherited entries also.
 * @note Regarding enumerability and ownership, see: <https://o5p.me/cht9Ot>.
 */
export const allEntries = (value: unknown, _parentObjValue?: $type.Object): [string, unknown][] => {
    const objValue = Object(value) as $type.Object,
        parentObjValue = _parentObjValue || objValue,
        entries: [string, unknown][] = [],
        keys = Object.keys(objValue);

    for (const key of keys) {
        entries.push([key, parentObjValue[key]]);
    }
    const objProto = proto(objValue),
        inheritedEntries = objProto ? allEntries(objProto, parentObjValue) : [];

    return entries.concat(
        inheritedEntries.filter(([inheritedKey]): boolean => {
            return !keys.includes(inheritedKey);
        }),
    );
};

/**
 * Gets an object’s own enumerable keys and symbols.
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
export const keysAndSymbols = $standalone.$objꓺkeysAndSymbols;

/**
 * Gets an object’s own enumerable key and symbol entries.
 *
 * @param   value Value from which to get key and symbol entries.
 *
 * @returns       Own enumerable key and symbol entries.
 *
 *   In this order:
 *
 *   - Numeric keys in ascending order.
 *   - String keys in their insertion order.
 *   - Symbol keys in their insertion order.
 *
 * @note For further details, {@see keysAndSymbols()}.
 * @note Unlike {@see Object.entries()}, this returns symbol entries also.
 * @note Regarding enumerability and ownership, see: <https://o5p.me/cht9Ot>.
 */
export const keyAndSymbolEntries = (value: unknown): $type.ObjectEntries => {
    const entries: $type.ObjectEntries = [],
        objValue = Object(value) as $type.Object;

    for (const keyOrSymbol of Reflect.ownKeys(objValue)) {
        if (Object.getOwnPropertyDescriptor(objValue, keyOrSymbol)?.enumerable) {
            entries.push([keyOrSymbol, objValue[keyOrSymbol]]);
        }
    }
    return entries;
};

/**
 * Gets all of an object’s enumerable keys and symbols.
 *
 * @param   value Value from which to get keys and symbols.
 *
 * @returns       All enumerable keys and symbols.
 *
 *   In this order:
 *
 *   - Own numeric keys in ascending order.
 *   - Own string keys in their insertion order.
 *   - Own symbol keys in their insertion order.
 *
 *   Followed by:
 *
 *   - Inherited numeric keys in ascending order.
 *   - Inherited string keys in their insertion order.
 *   - Inherited symbol keys in their insertion order.
 *
 * @note Unlike {@see Object.keys()}, this returns symbol keys also.
 * @note Unlike {@see Object.keys()}, this returns inherited keys also.
 * @note Key order matches that of `{ ...spread }` and {@see Object.keys()}.
 * @note Regarding enumerability and ownership, see: <https://o5p.me/cht9Ot>.
 */
export const allKeysAndSymbols = (value: unknown): $type.ObjectKey[] => {
    const keys: $type.ObjectKey[] = [],
        objValue = Object(value) as $type.Object;

    for (const keyOrSymbol of Reflect.ownKeys(objValue)) {
        if (Object.getOwnPropertyDescriptor(objValue, keyOrSymbol)?.enumerable) {
            keys.push(keyOrSymbol);
        }
    }
    const objProto = proto(objValue),
        inheritedKeys = objProto ? allKeysAndSymbols(objProto) : [];

    return [...new Set(keys.concat(inheritedKeys))];
};

/**
 * Gets all of an object’s enumerable key and symbol entries.
 *
 * @param   value           Value from which to get key and symbol entries.
 * @param   _parentObjValue Internal use only. Do not pass.
 *
 * @returns                 All enumerable key and symbol entries.
 *
 *   In this order:
 *
 *   - Own numeric keys in ascending order.
 *   - Own string keys in their insertion order.
 *   - Own symbol keys in their insertion order.
 *
 *   Followed by:
 *
 *   - Inherited numeric keys in ascending order.
 *   - Inherited string keys in their insertion order.
 *   - Inherited symbol keys in their insertion order.
 *
 * @note For further details, {@see allKeysAndSymbols()}.
 * @note Unlike {@see Object.entries()}, this returns symbol entries also.
 * @note Unlike {@see Object.entries()}, this returns inherited entries also.
 * @note Regarding enumerability and ownership, see: <https://o5p.me/cht9Ot>.
 */
export const allKeyAndSymbolEntries = (value: unknown, _parentObjValue?: $type.Object): $type.ObjectEntries => {
    const entries: $type.ObjectEntries = [],
        objValue = Object(value) as $type.Object,
        parentObjValue = _parentObjValue || objValue;

    for (const keyOrSymbol of Reflect.ownKeys(objValue)) {
        if (Object.getOwnPropertyDescriptor(objValue, keyOrSymbol)?.enumerable) {
            entries.push([keyOrSymbol, parentObjValue[keyOrSymbol]]);
        }
    }
    const objProto = proto(objValue),
        objKeysAndSymbols = keysAndSymbols(objValue),
        inheritedEntries = objProto ? allKeyAndSymbolEntries(objProto, parentObjValue) : [];

    return entries.concat(
        inheritedEntries.filter(([inheritedKeyOrSymbol]) => {
            return !objKeysAndSymbols.includes(inheritedKeyOrSymbol);
        }),
    );
};

/**
 * Mimics {@see Object.assign()}.
 *
 * There is one subtle difference, which is that unlike {@see Object.assign()}, this doesn’t choke on a `null` or
 * `undefined` target. Instead, {@see Object()} casting deals with `null` and `undefined` gracefully.
 *
 * In the case of `target` not being an object, it is cast as an object. In such a case, it will not be mutated by
 * reference, and thus, callers will need to use the return value from this function.
 *
 * @param   target    Target object.
 * @param   ...values Values to assign.
 *
 * @returns           Mutated `target` object.
 *
 * @note This method has better typings than {@see Object.assign()}.
 * @note This method can be helpful in some cases as an alternative to {@see clone()}.
 */
export function assign<TypeA, TypeB>(target: TypeA, ...values: [TypeB]): Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function assign<TypeA, TypeB, TypeC>(target: TypeA, ...values: [TypeB, TypeC]): Record<keyof TypeA | keyof TypeB | keyof TypeC, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function assign<TypeA, TypeB, TypeC, TypeD>(target: TypeA, ...values: [TypeB, TypeC, TypeD]): Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function assign<TypeA, TypeB, TypeC, TypeD, TypeE>(target: TypeA, ...values: [TypeB, TypeC, TypeD, TypeE]): Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD | keyof TypeE, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore

export function assign<TypeA, TypeB>(target: TypeA, ...values: [TypeB]): Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object> {
    const objTarget = Object(target) as $type.Object;

    for (const value of values) {
        const objValue = Object(value) as $type.Object;

        for (const key of keysAndSymbols(objValue)) {
            objTarget[key] = objValue[key];
        }
    }
    return objTarget as Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object>;
}

/**
 * Similar to {@see Object.assign()}, but this assigns complete descriptors.
 *
 * The difference between this and {@see Object.assign()} is that when complete descriptors are assigned, properties
 * assigned to `target` will also include a shallow clone of the original attributes; i.e., property descriptors.
 *
 * In the case of `target` not being an object, it is cast as an object. In such a case, it will not be mutated by
 * reference, and thus, callers will need to use the return value from this function.
 *
 * @param   target    Target object.
 * @param   ...values Values to assign.
 *
 * @returns           Mutated `target` object.
 *
 * @note This method has better typings than {@see Object.assign()}.
 * @note This method can be helpful in some cases; e.g., as an alternative to {@see clone()}.
 */
export function assignComplete<TypeA, TypeB>(target: TypeA, ...values: [TypeB]): Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function assignComplete<TypeA, TypeB, TypeC>(target: TypeA, ...values: [TypeB, TypeC]): Record<keyof TypeA | keyof TypeB | keyof TypeC, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function assignComplete<TypeA, TypeB, TypeC, TypeD>(target: TypeA, ...values: [TypeB, TypeC, TypeD]): Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function assignComplete<TypeA, TypeB, TypeC, TypeD, TypeE>(target: TypeA, ...values: [TypeB, TypeC, TypeD, TypeE]): Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD | keyof TypeE, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore

export function assignComplete<TypeA, TypeB>(target: TypeA, ...values: unknown[]): Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object> {
    const objTarget = Object(target) as $type.Object;

    for (const value of values) {
        const objValue = Object(value) as $type.Object;

        for (const key of keysAndSymbols(objValue)) {
            Object.defineProperty(objTarget, key, { ...Object.getOwnPropertyDescriptor(objValue, key) });
        }
    }
    return objTarget as Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object>;
}

/**
 * Mimics {@see Object.assign()}, but assigns default values only.
 *
 * Once a key in `target` resolves to something other than `undefined`, and is the target’s own key, additional values
 * of the same key are ignored. Otherwise, this behaves exactly the same as {@see Object.assign()} in every other way.
 *
 * In the case of `target` not being an object, it is cast as an object. In such a case, it will not be mutated by
 * reference, and thus, callers will need to use the return value from this function.
 *
 * @param   target    Target object.
 * @param   ...values Default values.
 *
 * @returns           Mutated `target` object.
 *
 * @note This method has better typings than {@see Object.assign()}.
 * @note Unlike {@see Object.assign()}, this only sets undefined values from left to right.
 */
export function defaults<TypeA, TypeB>(target: TypeA, ...values: [TypeB]): Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function defaults<TypeA, TypeB, TypeC>(target: TypeA, ...values: [TypeB, TypeC]): Record<keyof TypeA | keyof TypeB | keyof TypeC, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function defaults<TypeA, TypeB, TypeC, TypeD>(target: TypeA, ...values: [TypeB, TypeC, TypeD]): Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore
export function defaults<TypeA, TypeB, TypeC, TypeD, TypeE>(target: TypeA, ...values: [TypeB, TypeC, TypeD, TypeE]): Record<keyof TypeA | keyof TypeB | keyof TypeC | keyof TypeD | keyof TypeE, TypeA extends object ? TypeA : $type.Object>; // prettier-ignore

export function defaults<TypeA, TypeB>(target: TypeA, ...values: [TypeB]): Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object> {
    const objTarget = Object(target) as $type.Object;

    for (const value of values) {
        const objValue = Object(value) as $type.Object;

        for (const key of keysAndSymbols(objValue)) {
            if (undefined !== objTarget[key] && Object.hasOwn(objTarget, key)) {
                continue; // Target already has own key !== `undefined`.
            }
            objTarget[key] = objValue[key];
        }
    }
    return objTarget as Record<keyof TypeA | keyof TypeB, TypeA extends object ? TypeA : $type.Object>;
}

/**
 * Freezes an object; {@see Object.freeze()}.
 *
 * @param   value Value to freeze.
 *
 * @returns       Frozen object; {@see Object.freeze()}.
 */
export const freeze = <Type>(value: Type): Readonly<Type extends object ? Type : $type.Object> => {
    return Object.freeze(Object(value)) as ReturnType<typeof freeze<Type>>;
};

/**
 * Deep freezes an object; {@see Object.freeze()}.
 *
 * @param   value    Value to deep freeze.
 * @param   circular Internal use only. Do not pass.
 *
 * @returns          Deeply frozen object; {@see Object.freeze()}.
 */
export const deepFreeze = <Type>(value: Type, circular: Map<object, object> = new Map()): $type.ReadonlyDeep<Type extends object ? Type : $type.Object> => {
    const objValue = Object(value) as Type extends object ? Type : $type.Object;

    if (circular.has(objValue)) {
        return circular.get(objValue) as ReturnType<typeof deepFreeze<Type>>;
    }
    circular.set(objValue, objValue); // Freezing now.
    // Must freeze keys/symbols *before* freezing `objValue`.

    for (const [, keyOrSymbolValue] of keyAndSymbolEntries(objValue)) {
        if ($is.object(keyOrSymbolValue)) deepFreeze(keyOrSymbolValue, circular);
    }
    return Object.freeze(objValue) as ReturnType<typeof deepFreeze<Type>>;
};

/**
 * Produces a shallow clone of input value.
 *
 * Note that {@see structuredClone()} isn't a feature of the JavaScript language. It's a feature of browsers and it
 * works in other JavaScript runtimes that support {@see structuredClone()}; including Node and Cloudflare workers.
 *
 * The strategy applied here is one which depends on {@see structuredClone()} as a fallback for more obscure object
 * types. However, we want to avoid using it for things we can easily clone without it. Why not use it for everything?
 * Because {@see structuredClone()} only does a deep clone, and as a result it may choke on uncloneable objects as it
 * recurses. By enumerating things like sets, maps, arrays, and plain objects, we improve our chance of success.
 *
 * Cloning is lossless on the most common object types, which includes all primitives being copied by value, date
 * objects, URL objects, regexp objects, sets, maps, arrays, typed arrays, array buffers, Node buffers, data views,
 * errors, and some browser API types (including DOM nodes), which are cloneable in web environments.
 *
 * Otherwise, cloning is lossy because many other object types can only be cloned into plain variants. For example,
 * custom classes, such as those extending a set, map, array, or any other custom class, will be cloned as a regular
 * set, map, array, or plain object. That is, _unless_ a `[$to.symbols.clone]()` method is provided by the class.
 *
 * Any object (e.g., a class) can choose to implement a `[$to.symbols.clone]()` method. If this symbol key exists, and
 * it resolves to a function, then it will be called upon to produce a clone. So long as it returns an object, then its
 * return value will be used as the clone instead of producing a standard plain clone. It is also possible to customize
 * the cloning algorithm using `with` when passing {@see CloneOptions}.
 *
 * Here are a few more important things to consider:
 *
 * - Prototype chains are not preserved when there’s no choice but to use a plain object clone.
 * - Only ‘own’ ‘enumerable’ properties are cloned when there’s no choice but to use a plain object clone.
 * - Complete property descriptors are not preserved when there’s no choice but to use a plain object clone.
 * - Getters and setters are invoked, but not preserved, when there’s no choice but to use a plain object clone.
 * - The keys of map objects, which might be objects themselves, are not cloned in order to preserve keys.
 * - Functions and promises, of any kind, will not be cloned, and instead will be returned by reference.
 * - Symbols, of any kind, will not be cloned whatsoever, and instead will be returned by reference.
 * - DOM nodes are always deep clones using {@see Node.cloneNode()} in order to work effectively.
 * - The `lastIndex` property of RegExp objects is not preserved.
 *
 * @param   value    Value to shallow clone.
 * @param   options  Options; {@see CloneOptions}.
 * @param   circular Internal use only. Do not pass.
 *
 * @returns          Shallow clone of input value.
 *
 * @note See: <https://o5p.me/BTyjw8> regarding {@see structuredClone()}.
 * @note See: <https://web.dev/structured-clone/> regarding {@see structuredClone()}.
 */
export const clone = <Type>(value: Type, options: CloneOptions = {}, circular: Map<object, object> = new Map()): Type | $type.Object => {
    const opts = defaults({}, options, { with: undefined, transfer: [] }) as Required<CloneOptions>;

    if (!$is.object(value) || $is.function(value) || $is.promise(value)) {
        return value as Type | $type.Object; // Unnecessary; e.g., primitive; or impossible.
    }
    if (opts.with && $is.function(opts.with)) {
        const clone = opts.with(value, { deep: false, opts, circular, inDeep: false });

        if ($is.object(clone)) {
            return clone as Type | $type.Object;
        }
    }
    if (value[$symbol.objToClone] && $is.function(value[$symbol.objToClone])) {
        const clone = (value[$symbol.objToClone] as $type.ObjToCloneSymbolFn)({ deep: false, opts, circular, inDeep: false });

        if ($is.object(clone)) {
            return clone as Type | $type.Object;
        }
    }
    switch (true) {
        case $is.plainObject(value): {
            return { ...(value as unknown as $type.Object) } as Type;
        }
        case $is.map(value): {
            return new Map(value as unknown as Map<unknown, unknown>) as Type;
        }
        case $is.set(value): {
            return new Set(value as unknown as Set<unknown>) as Type;
        }
        case $is.array(value): {
            return [...(value as unknown as unknown[])] as Type;
        }
        case $is.url(value): {
            return new URL(value as unknown as URL) as Type;
        }
        case $is.node(value): {
            return (value as unknown as Node).cloneNode(true) as Type;
        }
        case $is.structuredCloneable(value): {
            try {
                return structuredClone(value, { transfer: opts.transfer }) as Type | $type.Object;
            } catch {
                /* ↓ Fall through to default case handler. */
            }
        }
        // eslint-disable-next-line no-fallthrough -- Fall through ok.
        default: {
            return { ...(value as $type.Object) };
        }
    }
};

/**
 * Produces a deep clone of input value and handles circular references gracefully.
 *
 * Note that {@see structuredClone()} isn't a feature of the JavaScript language. It's a feature of browsers and it
 * works in other JavaScript runtimes that support {@see structuredClone()}; including Node and Cloudflare workers.
 *
 * The strategy applied here is one which depends on {@see structuredClone()} as a fallback for more obscure object
 * types. However, we want to avoid using it for things we can easily clone without it. Why not use it for everything?
 * Because {@see structuredClone()} only does a deep clone, and as a result it may choke on uncloneable objects as it
 * recurses. By enumerating things like sets, maps, arrays, and plain objects, we improve our chance of success.
 *
 * Cloning is lossless on the most common object types, which includes all primitives being copied by value, date
 * objects, URL objects, regexp objects, sets, maps, arrays, typed arrays, array buffers, Node buffers, data views,
 * errors, and some browser API types (including DOM nodes), which are cloneable in web environments.
 *
 * Otherwise, cloning is lossy because many other object types can only be cloned into plain variants. For example,
 * custom classes, such as those extending a set, map, array, or any other custom class, will be cloned as a regular
 * set, map, array, or plain object. That is, _unless_ a `[$to.symbols.clone]()` method is provided by the class.
 *
 * Any object (e.g., a class) can choose to implement a `[$to.symbols.clone]()` method. If this symbol key exists, and
 * it resolves to a function, then it will be called upon to produce a clone. So long as it returns an object, then its
 * return value will be used as the clone instead of producing a standard plain clone. It is also possible to customize
 * the cloning algorithm using `with` when passing {@see CloneOptions}.
 *
 * Here are a few more important things to consider:
 *
 * - Prototype chains are not preserved when there’s no choice but to use a plain object clone.
 * - Only ‘own’ ‘enumerable’ properties are cloned when there’s no choice but to use a plain object clone.
 * - Complete property descriptors are not preserved when there’s no choice but to use a plain object clone.
 * - Getters and setters are invoked, but not preserved, when there’s no choice but to use a plain object clone.
 * - The keys of map objects, which might be objects themselves, are not cloned in order to preserve keys.
 * - Functions and promises, of any kind, will not be cloned, and instead will be returned by reference.
 * - Symbols, of any kind, will not be cloned whatsoever, and instead will be returned by reference.
 * - DOM nodes are always deep clones using {@see Node.cloneNode()} in order to work effectively.
 * - The `lastIndex` property of RegExp objects is not preserved.
 *
 * @param   value    Value to deep clone.
 * @param   options  Options; {@see CloneOptions}.
 * @param   circular Internal use only. Do not pass.
 * @param   inDeep   Internal use only. Do not pass.
 *
 * @returns          Deep clone of input value.
 *
 * @note See: <https://o5p.me/BTyjw8> regarding {@see structuredClone()}.
 * @note See: <https://web.dev/structured-clone/> regarding {@see structuredClone()}.
 */
export const cloneDeep = <Type>(value: Type, options: CloneOptions = {}, circular: Map<object, object> = new Map(), inDeep: boolean = false): Type | $type.Object => {
    const opts = !inDeep ? (defaults({}, options, { with: undefined, transfer: [] }) as Required<CloneOptions>) : (options as Required<CloneOptions>);

    if (!$is.object(value) || $is.function(value) || $is.promise(value)) {
        return value as Type | $type.Object; // Unnecessary; e.g., primitive; or impossible.
    }
    if (circular.has(value)) {
        return circular.get(value) as Type | $type.Object;
    }
    if (opts.with && $is.function(opts.with)) {
        const clone = opts.with(value, { deep: true, opts, circular, inDeep });

        if ($is.object(clone)) {
            circular.set(value, clone);
            return clone as Type | $type.Object;
        }
    }
    if (value[$symbol.objToClone] && $is.function(value[$symbol.objToClone])) {
        const clone = (value[$symbol.objToClone] as $type.ObjToCloneSymbolFn)({ deep: true, opts, circular, inDeep });

        if ($is.object(clone)) {
            circular.set(value, clone);
            return clone as Type | $type.Object;
        }
    }
    switch (true) {
        case $is.plainObject(value): {
            const clone: $type.Object = {};
            circular.set(value, clone);

            for (const [key, keyValue] of keyAndSymbolEntries(value)) {
                clone[key] = cloneDeep(keyValue, opts, circular, true);
            }
            return clone as Type;
        }
        case $is.map(value): {
            const clone: Map<unknown, unknown> = new Map();
            circular.set(value, clone);

            for (const [key, keyValue] of value as unknown as Map<unknown, unknown>) {
                clone.set(key, cloneDeep(keyValue, opts, circular, true));
            }
            return clone as Type;
        }
        case $is.set(value): {
            const clone: Set<unknown> = new Set();
            circular.set(value, clone);

            for (const _value of value as unknown as Set<unknown>) {
                clone.add(cloneDeep(_value, opts, circular, true));
            }
            return clone as Type;
        }
        case $is.array(value): {
            const clone: unknown[] = [];
            circular.set(value, clone);

            for (let key = 0; key < (value as unknown[]).length; key++) {
                clone[key] = cloneDeep((value as unknown[])[key], opts, circular, true);
            }
            return clone as Type;
        }
        case $is.url(value): {
            const clone = new URL(value as unknown as URL);
            circular.set(value, clone);
            return clone as Type;
        }
        case $is.node(value): {
            const clone = (value as unknown as Node).cloneNode(true);
            circular.set(value, clone);
            return clone as Type;
        }
        case $is.structuredCloneable(value): {
            try {
                const clone = structuredClone(value, { transfer: opts.transfer });
                circular.set(value, clone); // Added layer of protection.
                return clone as Type | $type.Object;
            } catch {
                /* ↓ Fall through to default case handler. */
            }
        }
        // eslint-disable-next-line no-fallthrough -- Fall through ok.
        default: {
            const clone: $type.Object = {};
            circular.set(value, clone);

            for (const [key, keyValue] of keyAndSymbolEntries(value)) {
                clone[key] = cloneDeep(keyValue, opts, circular, true);
            }
            return clone; // Plain object.
        }
    }
};

/**
 * Initializes {@see mc} instance.
 *
 * @returns True, always.
 */
const mcInitialize = (): true => {
    if (mcInitialized) {
        return true;
    } else mcInitialized = true;

    const ObjMC = $class.getObjMC();

    mc = new ObjMC(); // Class instance.
    mcNoOps = new ObjMC({ allowOps: false });

    return true;
};

/**
 * Creates a custom MC instance.
 *
 * @param   args New instance args.
 *
 * @returns      Instance; {@see MCInterface}.
 *
 * @note `../docs/resources/classes/obj-mc.md` for further details.
 */
export const mcCustom = (...args: Parameters<typeof mc.newInstance>): $type.ObjMC => {
    return mcInitialize() && mc.newInstance(...args);
};

/**
 * ```js
 * $obj.mergeDeep(target, ...merges);
 * ```
 *
 * Lossless merge with **deep cloning of arrays and plain objects**, and without changing the `target` object. Great for
 * creating or extending objects deeply. New instances are created deeply with all `...merges` being deep-cloned prior
 * to merging into a `target` object derivation; i.e., the `target` object is not mutated by reference.
 *
 * This produces a deep clone of arrays and plain objects only. The `$obj.mergeDeep()` and `$obj.patchDeep()` utilities
 * are typically the most popular merge types, as they each produce a lossless merge. There is no data lost because
 * object types that are not arrays or plain objects are simply transferred in by reference.
 *
 * This type of merge makes no guarantees regarding the immutability of any `...merges`, and in fact, if declarative
 * operations are used in any of the `...merges`, it is possible that mutations will occur within them. For example, if
 * anything that’s not an array or plain object is simply transferred into `target` and then declaratively operated on.
 *
 * @param   target    Target object.
 * @param   ...merges Objects to merge.
 *
 * @returns           Deep clone of all merged objects.
 *
 * @note `../docs/resources/classes/obj-mc.md` for further details.
 */
export const mergeDeep = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mc.mergeDeep(...args);
}) as $type.ObjMCHandler;

// Variant that does not allow declarative ops.
export const mergeDeepNoOps = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mcNoOps.mergeDeep(...args);
}) as $type.ObjMCHandler;

/**
 * ```js
 * $obj.mergeClonesDeep(target, ...merges);
 * ```
 *
 * Lossy merge with **deep cloning of all compatible object types**, and without changing the `target` object. New
 * instances are created deeply with all `...merges` being deep-cloned prior to merging into a `target` object
 * derivation; i.e., the `target` object is not mutated by reference.
 *
 * This kind of merge is lossy because deep-cloning is sometimes lossy.
 *
 * Underneath, this uses `$obj.cloneDeep()` on object types that are not arrays or plain objects. Instead of simply
 * being transferred in by reference like `$obj.mergeDeep()` does, they are instead cloned deeply with
 * `$obj.cloneDeep()`, and then transferred in by reference to the deep clone.
 *
 * This type of merge guarantees immutability of all compatible object types in any `...merges`, because there is deep
 * cloning of all compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
 *
 * @param   target    Target object.
 * @param   ...merges Objects to merge.
 *
 * @returns           Deep clone of all merged objects.
 *
 * @note `../docs/resources/classes/obj-mc.md` for further details.
 */
export const mergeClonesDeep = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mc.mergeClonesDeep(...args);
}) as $type.ObjMCHandler;

// Variant that does not allow declarative ops.
export const mergeClonesDeepNoOps = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mcNoOps.mergeClonesDeep(...args);
}) as $type.ObjMCHandler;

/**
 * ```js
 * $obj.patchDeep(target, ...patches);
 * ```
 *
 * Works exactly the same as `$obj.mergeDeep()`, except it mutates the `target` object by reference.
 *
 * Lossless merge with **deep cloning of arrays and plain objects**, mutating the `target` object by reference. Great
 * for creating or extending objects deeply. New instances are created deeply with all `...patches` being deep-cloned
 * prior to merging into a `target` object; i.e., the `target` object is mutated by reference.
 *
 * This produces a deep clone of arrays and plain objects only. The `$obj.mergeDeep()` and `$obj.patchDeep()` utilities
 * are typically the most popular, as they each produce a lossless merge. There is no data lost because object types
 * that are not arrays or plain objects are simply transferred in by reference.
 *
 * This type of merge makes no guarantees regarding the immutability of any `...patches`, and in fact, if declarative
 * operations are used in any of the `...patches`, it is possible that mutations will occur within them. For example, if
 * anything that’s not an array or plain object is simply transferred into `target` and then declaratively operated on.
 *
 * @param   target     Target object.
 * @param   ...patches Objects to merge.
 *
 * @returns            Patched target object, by reference.
 *
 * @note `../docs/resources/classes/obj-mc.md` for further details.
 */
export const patchDeep = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mc.patchDeep(...args);
}) as $type.ObjMCHandler;

// Variant that does not allow declarative ops.
export const patchDeepNoOps = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mcNoOps.patchDeep(...args);
}) as $type.ObjMCHandler;

/**
 * ```js
 * $obj.patchClonesDeep(target, ...patches);
 * ```
 *
 * Works exactly the same as `$obj.mergeClonesDeep()`, except it mutates the `target` object by reference.
 *
 * Lossy merge with **deep cloning of all compatible object types**, mutating the `target` object by reference. New
 * instances are created deeply with all `...patches` being deep-cloned prior to merging into a `target` object; i.e.,
 * the `target` object is mutated by reference. This kind of merge is lossy because deep-cloning is sometimes lossy.
 *
 * Underneath, this uses `$obj.cloneDeep()` on object types that are not arrays or plain objects. Instead of simply
 * being transferred in by reference like `$obj.patchDeep()` does, they are instead cloned deeply with
 * `$obj.cloneDeep()`, and then transferred in by reference to the deep clone.
 *
 * This type of merge guarantees immutability of all compatible object types in any `...patches`, because there is deep
 * cloning of all compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
 *
 * @param   target     Target object.
 * @param   ...patches Objects to merge.
 *
 * @returns            Patched target object, by reference.
 *
 * @note `../docs/resources/classes/obj-mc.md` for further details.
 */
export const patchClonesDeep = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mc.patchClonesDeep(...args);
}) as $type.ObjMCHandler;

// Variant that does not allow declarative ops.
export const patchClonesDeepNoOps = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mcNoOps.patchClonesDeep(...args);
}) as $type.ObjMCHandler;

/**
 * ```js
 * $obj.updateDeep(target, ...updates);
 * ```
 *
 * Lossy **immutable merge** with **deep cloning of all compatible object types required to maintain immutability**, and
 * without changing the `target` object, because `target` and all `...updates` are treated as immutable objects. Great
 * for updating state. New instances are created deeply with all `...updates` being deep-cloned prior to merging into a
 * `target` object derivation, but **only when there are differences** introduced by the `...updates`.
 *
 * The `target` object is not mutated by reference. Rather, if there are differences, a deep clone of the `target` with
 * all `...updates` having been merged in, is returned. Otherwise, the `target` object is returned unchanged, by
 * reference; i.e., when none of the `...updates` introduce changes. Thus, the return value can be tested to easily
 * determine if changes were introduced.
 *
 * Underneath, this uses `$is.deepEqual()` to check for differences, and `$obj.cloneDeep()` is used on object types that
 * are not arrays or plain objects. This kind of merge is lossy because deep-cloning is necessary to ensure
 * immutability, and deep-cloning is sometimes lossy, depending on the object types being deep-cloned.
 *
 * `$is.deepEqual()` uses `Object.keys()` and therefore does not consider symbol keys.
 *
 * This type of merge guarantees immutability of all compatible object types in any `...updates`, because there is deep
 * cloning of all compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
 *
 * This utility is currently identical to `$obj.updateClonesDeep()`. However, in general, if deep-cloning is
 * mission-critical, the `$obj.updateClonesDeep()` variant is recommened, as it may evolve in the future to operate more
 * favorably toward deep-cloning vs. this `$obj.updateDeep()` utility, which uses deep-cloning only when it must in
 * order to maintain immutability.
 *
 * @param   target     Target object.
 * @param   ...updates Objects to merge.
 *
 * @returns            If there are differences, a new version of `target` object with all of the updates.
 *
 *   - However, if no differences, this returns the original `target` object by reference, which allows `target` to be
 *       compared to the return value of this function in order to determine if changes occurred or not.
 *
 * @note `../docs/resources/classes/obj-mc.md` for further details.
 */
export const updateDeep = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mc.updateDeep(...args);
}) as $type.ObjMCHandler;

// Variant that does not allow declarative ops.
export const updateDeepNoOps = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mcNoOps.updateDeep(...args);
}) as $type.ObjMCHandler;

/**
 * ```js
 * $obj.updateClonesDeep(target, ...updates);
 * ```
 *
 * Lossy **immutable merge** with **deep cloning of all compatible object types**, and without changing the `target`
 * object, because `target` and all `...updates` are treated as immutable objects. Great for updating state. New
 * instances are created deeply with all `...updates` being deep-cloned prior to merging into a `target` object
 * derivation, but **only when there are differences** introduced by the `...updates`.
 *
 * The `target` object is not mutated by reference. Rather, if there are differences, a deep clone of the `target` with
 * all `...updates` having been merged in, is returned. Otherwise, the `target` object is returned unchanged, by
 * reference; i.e., when none of the `...updates` introduce changes. Thus, the return value can be tested to easily
 * determine if changes were introduced.
 *
 * Underneath, this uses `$is.deepEqual()` to check for differences, and `$obj.cloneDeep()` is used on object types that
 * are not arrays or plain objects. This kind of merge is lossy because deep-cloning is necessary to ensure
 * immutability, and deep-cloning is sometimes lossy, depending on the object types handled by `$obj.cloneDeep()`.
 *
 * `$is.deepEqual()` uses `Object.keys()` and therefore does not consider symbol keys.
 *
 * This type of merge guarantees immutability of all compatible object types in any `...updates`, because there is deep
 * cloning of all compatible object types. Thus, immutability is guaranteed even when there are declarative operations.
 *
 * This utility is currently identical to `$obj.updateDeep()`. However, in general, if deep-cloning is mission-critical,
 * this variant is recommened, as it may evolve in the future to operate more favorably toward deep-cloning vs.
 * `$obj.updateDeep()`, which uses deep-cloning only when it must in order to maintain immutability.
 *
 * @param   target     Target object.
 * @param   ...updates Objects to merge.
 *
 * @returns            If there are differences, a new version of `target` object with all of the updates.
 *
 *   - However, if no differences, this returns the original `target` object by reference, which allows `target` to be
 *       compared to the return value of this function in order to determine if changes occurred or not.
 *
 * @note `../docs/resources/classes/obj-mc.md` for further details.
 */
export const updateClonesDeep = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mc.updateClonesDeep(...args);
}) as $type.ObjMCHandler;

// Variant that does not allow declarative ops.
export const updateClonesDeepNoOps = ((...args: Parameters<$type.ObjMCHandler>): ReturnType<$type.ObjMCHandler> => {
    return mcInitialize() && mcNoOps.updateClonesDeep(...args);
}) as $type.ObjMCHandler;

/**
 * Maps all values in an object (by default, a shallow clone) to a callback function.
 *
 * Fully supported object types include sets, maps, arrays, and plain objects. Everything else is potentially converted
 * into, and returned as, a plain set, map, array, or object; depending on the object’s cloneability.
 *
 * Callback function signature:
 *
 *     (value: $type.Any, key?: $type.Any) => unknown;
 *
 * If `value` is a {@see Set}, no `key` is passed to callback. If `value` is a {@see Map}, `key` could very well be
 * anything. Thus, use `key` with caution. It’s not always set to a safe object key, depending on `value` type.
 *
 * @param   value      Value (i.e., object) to map.
 * @param   callbackFn Callback function with signature above.
 * @param   options    Options. To map by reference, set `{ byReference: true }`.
 *
 * @returns            Object containing mapped values (a shallow clone, by default).
 *
 * @note To map by reference, set `{ byReference: true }`.
 * @note Like {@see Array.prototype.map()}, by default, this produces a shallow clone.
 *       To map deeply, and thus produce clones deeply, please {@see mapDeep()}.
 */
export const map = <Type>(value: Type, callbackFn: (value: $type.Any, key?: $type.Any) => unknown, options?: MapOptions): Type extends object ? Type : $type.Object => {
    const opts = defaults({}, options || {}, { byReference: false, skipReadonly: true, _deep: false }) as Required<MapOptions>;
    const objValue = Object(opts.byReference ? value : clone(value)) as $type.Object;

    if ($is.set(objValue)) {
        for (const value of Array.from(objValue)) {
            objValue.delete(value);
            const newValue = callbackFn(value);

            if (opts._deep && $is.object(newValue)) {
                objValue.add(map(newValue, callbackFn, opts));
            } else objValue.add(newValue);
        }
    } else if ($is.map(objValue)) {
        for (const [key, value] of objValue) {
            const newValue = callbackFn(value, key);

            if (opts._deep && $is.object(newValue)) {
                objValue.set(key, map(newValue, callbackFn, opts));
            } else objValue.set(key, newValue);
        }
    } else if ($is.array(objValue)) {
        for (let key = 0; key < objValue.length; key++) {
            if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
                objValue[key] = callbackFn(objValue[key], key);

                if (opts._deep && $is.object(objValue[key])) {
                    objValue[key] = map(objValue[key], callbackFn, opts);
                }
            } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
        }
    } else {
        for (const key of keysAndSymbols(objValue)) {
            if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
                objValue[key] = callbackFn(objValue[key], key);

                if (opts._deep && $is.object(objValue[key])) {
                    objValue[key] = map(objValue[key], callbackFn, opts);
                }
            } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
        }
    }
    return objValue as Type extends object ? Type : $type.Object;
};

/**
 * Maps all values in an object to a callback function, deeply.
 *
 * Fully supported object types include sets, maps, arrays, and plain objects. Everything else is potentially converted
 * into, and returned as, a plain set, map, array, or object; depending on the object’s cloneability.
 *
 * When mapping deeply, every single object key will be mapped to a callback function. As such, this follows the same
 * pattern as a {@see JSON.stringify()} middleware replacer, where each and every key is recursively mapped, including
 * any values mapped and modified on-the-fly by the callback function. For this reason, when mapping deeply, it is very
 * important to check a value’s type before modifying, because your callback function may encounter sets, maps, arrays,
 * or other objects before it finally arrives at primitive value types.
 *
 * Please {@see map()} for additional important details.
 *
 * @param   value      Value (i.e., object) to map. Please {@see map()}.
 * @param   callbackFn Callback function. Please {@see map()}.
 * @param   options    Options. Please {@see map()}.
 *
 *   - `{ _deep: true }` is set explicitly by this utility.
 *
 * @returns            Object containing mapped values. Please {@see map()}.
 */
export const mapDeep = <Type>(...args: Parameters<typeof map<Type>>): ReturnType<typeof map<Type>> => {
    return map(args[0], args[1], { ...args[2], _deep: true });
};

/**
 * Omits specific keys from an object (by default, a shallow clone).
 *
 * Fully supported object types include sets, maps, arrays, and plain objects. Everything else is potentially converted
 * into, and returned as, a plain set, map, array, or object; depending on the object’s cloneability.
 *
 * Note: If `value` is a {@see Set}, `keys` are instead treated as values to omit.
 *
 * @param   value   Value (i.e., object) to omit from.
 * @param   keys    Keys, or, in the case of a {@see Set}, values, to omit.
 * @param   options Options. To omit by reference, set `{ byReference: true }`.
 *
 * @returns         Object (a shallow clone, by default) without specific keys.
 */
export function omit<Type extends Set<unknown> | Map<unknown, unknown>>(value: Type, keys: unknown[], options?: OmitOptions): Type;
export function omit<Type extends object, Key extends keyof Type>(value: Type, keys: Key[], options?: OmitOptions): Omit<Type, Key>;
export function omit<Type>(value: Type, keys: unknown[], options?: OmitOptions): Type extends object ? Type : $type.Object;

export function omit<Type>(value: Type, keys: unknown[], options?: OmitOptions): Type extends object ? Type : $type.Object {
    const opts = defaults({}, options || {}, { byReference: false, skipReadonly: false, undefinedValues: false }) as Required<OmitOptions>;
    const objValue = Object(opts.byReference ? value : clone(value)) as $type.Object;

    if ($is.set(objValue)) {
        for (const value of keys) {
            objValue.delete(value);
        }
        if (opts.undefinedValues) {
            objValue.delete(undefined);
        }
    } else if ($is.map(objValue)) {
        for (const key of keys) {
            objValue.delete(key);
        }
        if (opts.undefinedValues) {
            for (const [key, value] of objValue) {
                if (undefined === value) objValue.delete(key);
            }
        }
    } else if ($is.array(objValue)) {
        for (const key of keys.sort().reverse()) {
            if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key as number)?.writable) {
                objValue.splice(key as number, 1);
            } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
        }
        if (opts.undefinedValues) {
            for (let key = objValue.length - 1; key >= 0; key--) {
                if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
                    if (undefined === objValue[key]) objValue.splice(key, 1);
                } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
            }
        }
    } else {
        for (const key of keys.sort().reverse()) {
            if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key as $type.ObjectPath)?.writable) {
                delete objValue[key as $type.ObjectPath];
            } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
        }
        if (opts.undefinedValues) {
            for (const key of keysAndSymbols(objValue)) {
                if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
                    if (undefined === objValue[key]) delete objValue[key];
                } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
            }
        }
    }
    return objValue as Type extends object ? Type : $type.Object;
}

/**
 * Unsets specific object keys (by reference, by default).
 *
 * Fully supported object types include sets, maps, arrays, and plain objects. Everything else is potentially converted
 * into, and returned as, a plain set, map, array, or object; depending on the object’s cloneability.
 *
 * Note: If `value` is a {@see Set}, `keys` are instead treated as values to unset.
 *
 * @param   value   Value (i.e., object) to unset keys in.
 * @param   keys    Keys, or, in the case of a {@see Set}, values, to unset.
 * @param   options Options. Default is `{ byReference: true }`.
 *
 * @returns         Object (by reference, by default) without specific keys.
 */
export function unset<Type extends Set<unknown> | Map<unknown, unknown>>(value: Type, keys: unknown[], options?: UnsetOptions): Type;
export function unset<Type extends object, Key extends keyof Type>(value: Type, keys: Key[], options?: UnsetOptions): Omit<Type, Key>;
export function unset<Type>(value: Type, keys: unknown[], options?: UnsetOptions): Type extends object ? Type : $type.Object;

export function unset<Type>(value: Type, keys: unknown[], options?: UnsetOptions): Type extends object ? Type : $type.Object {
    return omit(value, keys, { byReference: true, ...(options || {}) } as OmitOptions) as Type extends object ? Type : $type.Object;
}

/**
 * Picks specific keys from an object (by default, a shallow clone) — unsetting all others.
 *
 * Fully supported object types include sets, maps, arrays, and plain objects. Everything else is potentially converted
 * into, and returned as, a plain set, map, array, or object; depending on the object’s cloneability.
 *
 * Note: If `value` is a {@see Set}, `keys` are instead treated as values to pick.
 *
 * @param   value   Value (i.e., object) to pick from.
 * @param   keys    Keys, or, in the case of a {@see Set}, values, to pick.
 * @param   options Options. To pick by reference, set `{ byReference: true }`.
 *
 * @returns         Object (a shallow clone, by default) with specific keys only.
 */
export function pick<Type extends Set<unknown> | Map<unknown, unknown>>(value: Type, keys: unknown[], options?: PickOptions): Type;
export function pick<Type extends object, Key extends keyof Type>(value: Type, keys: Key[], options?: PickOptions): Pick<Type, Key>;
export function pick<Type>(value: Type, keys: unknown[], options?: PickOptions): Type extends object ? Type : $type.Object;

export function pick<Type>(value: Type, keys: unknown[], options?: PickOptions): Type extends object ? Type : $type.Object {
    const opts = defaults({}, options || {}, { byReference: false, skipReadonly: false }) as Required<PickOptions>;
    const objValue = Object(opts.byReference ? value : clone(value)) as $type.Object;

    if ($is.set(objValue)) {
        for (const value of objValue) {
            if (!keys.includes(value)) objValue.delete(value);
        }
    } else if ($is.map(objValue)) {
        for (const [key] of objValue) {
            if (!keys.includes(key)) objValue.delete(key);
        }
    } else if ($is.array(objValue)) {
        for (let key = objValue.length - 1; key >= 0; key--) {
            if (!keys.includes(key) && (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable)) {
                objValue.splice(key, 1);
            } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
        }
    } else {
        for (const key of keysAndSymbols(objValue).sort().reverse()) {
            if (!keys.includes(key) && (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable)) {
                delete objValue[key];
            } // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
        }
    }
    return objValue as Type extends object ? Type : $type.Object;
}

/**
 * Leaves specific object keys (by reference, by default) — unsetting all others.
 *
 * Fully supported object types include sets, maps, arrays, and plain objects. Everything else is potentially converted
 * into, and returned as, a plain set, map, array, or object; depending on the object’s cloneability.
 *
 * Note: If `value` is a {@see Set}, `keys` are instead treated as values to leave.
 *
 * @param   value   Value (i.e., object) to leave keys in.
 * @param   keys    Keys, or, in the case of a {@see Set}, values, to leave.
 * @param   options Options. Default is `{ byReference: true }`.
 *
 * @returns         Object (by reference, by default) with specific keys only.
 */
export function leave<Type extends Set<unknown> | Map<unknown, unknown>>(value: Type, keys: unknown[], options?: LeaveOptions): Type;
export function leave<Type extends object, Key extends keyof Type>(value: Type, keys: Key[], options?: LeaveOptions): Pick<Type, Key>;
export function leave<Type>(value: Type, keys: unknown[], options?: LeaveOptions): Type extends object ? Type : $type.Object;

export function leave<Type>(value: Type, keys: unknown[], options?: LeaveOptions): Type extends object ? Type : $type.Object {
    return pick(value, keys, { byReference: true, ...(options || {}) } as PickOptions) as Type extends object ? Type : $type.Object;
}
