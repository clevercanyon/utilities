/**
 * Object utilities.
 */

import {
	nul as $isꓺnul,
	set as $isꓺset,
	map as $isꓺmap,
	url as $isꓺurl,
	node as $isꓺnode,
	proto as $isꓺproto,
	array as $isꓺarray,
	object as $isꓺobject,
	promise as $isꓺpromise,
	function as $isꓺfunction,
	plainObject as $isꓺplainObject,
	safeArrayKey as $isꓺsafeArrayKey,
	safeObjectKey as $isꓺsafeObjectKey,
	structuredCloneable as $isꓺstructuredCloneable,
} from './is.js';

import type * as $type from './type.js';
import { svz as $moizeꓺsvz } from './moize.js';
import { symbols as $toꓺsymbols } from './to.js';

export { default as mc } from './resources/classes/obj/mc.js';

const plainObjectC9rStr = String(Object); // Plain object constructor, as string.

/**
 * Defines types.
 */
export type MapOptions = { byReference?: boolean; skipReadonly?: boolean };

export type OmitOptions = { byReference?: boolean; skipReadonly?: boolean };
export type UnsetOptions = OmitOptions; // Same as `OmitOptions`.

export type PickOptions = { byReference?: boolean; skipReadonly?: boolean };
export type LeaveOptions = PickOptions; // Same as `PickOptions`.

export type CloneOptions = { with?: CloneWithFn; transfer?: Transferable[] };
export type CloneFnData = { deep: boolean; opts: Required<CloneOptions>; circular: Map<object, object>; inDeep: boolean };
export type CloneWithFn = <Type extends object = object>(value: Type, data: CloneFnData) => Type | undefined;
export type ToCloneSymbolFn = <Type extends object = object>(data: CloneFnData) => Type | undefined;

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
export const tag = $moizeꓺsvz({ maxSize: 64 })(
	// Memoized function.
	(value: unknown): string => {
		let tag = $isꓺobject(value) ? String(value[$toꓺsymbols.tag] || '') : '';
		if (!tag) tag = Object.prototype.toString.call(value).slice(8, -1);

		if ('Object' === tag) {
			const __proto__ = $isꓺproto(value) ? value : proto(value);
			const __proto__c9r = __proto__ && hasOwn(__proto__, 'constructor') && $isꓺfunction(__proto__.constructor) ? __proto__.constructor : null;

			if (__proto__ && (!__proto__c9r || !(__proto__c9r instanceof __proto__c9r) || String(__proto__c9r) !== plainObjectC9rStr)) {
				if (__proto__c9r?.name) {
					return tag + ':' + __proto__c9r.name; // Not a real object tag.
				} else {
					return tag + ':?'; // Unknown; e.g., anonymous. Also not a real object tag.
				}
			}
		}
		return tag; // Object’s tag.
	},
);

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
export const tags = (value: unknown, deepTags?: Set<string>): string[] => {
	let nextProto; // Initialize.

	if (!deepTags) {
		deepTags = new Set();
		deepTags.add(tag(value)); // Parses object’s tag from the initial instance value.
		nextProto = proto(value, 2); // Value was used, so skip a prototype level in this case.
		//
	} /* Treats value as a `__proto__` in the prototype chain. */ else {
		const __proto__ = value;
		deepTags.add(tag(__proto__));
		nextProto = proto(__proto__);
	}
	if (nextProto) {
		return tags(nextProto, deepTags);
	}
	return Array.from(deepTags);
};

/**
 * Works as an alias of {@see Object.getPrototypeOf()}.
 *
 * This variant also supports going up multiple prototype levels.
 *
 * @param   value    Value to consider.
 * @param   levelsUp Levels up. Default is `1`.
 *
 * @returns          Prototype of value; else `undefined`.
 */
export const proto = (value: unknown, levelsUp: number = 1): $type.Object | undefined => {
	let __proto__: unknown; // Initialize.

	for (let levels = levelsUp, times = 0; levels >= 1; levels--, times++) {
		__proto__ = 0 === times ? value : __proto__;
		if ($isꓺnul(__proto__)) break;
		__proto__ = Object.getPrototypeOf(__proto__);
	}
	return (__proto__ as $type.Object) || undefined;
};

/**
 * Gets a value’s constructor.
 *
 * Uses {@see proto()}, which supports going up multiple prototype levels.
 *
 * @param   value    Value to consider.
 * @param   levelsUp Levels up. Default is `1`.
 *
 * @returns          Value’s constructor; else `undefined`.
 */
export const protoC9r = (value: unknown, levelsUp: number = 1): $type.ClassC9r | undefined => {
	return (proto(value, levelsUp)?.constructor as $type.ClassC9r) || undefined;
};

/**
 * Checks if an object has own property.
 *
 * Polyfill for {@see Object.hasOwn()} in es2022. This uses {@see Object.prototype.hasOwnProperty()}, which is more
 * efficient than {@see has()}. This should be used when we don’t need to support object path notation.
 *
 * @param   value Object to search in.
 * @param   key   Object key to consider.
 *
 * @returns       True if object has own property.
 *
 * @note This also works on arrays with an [index].
 * @note This also works with object keys that are symbols.
 * @note There is no `hasIn()` utility. Instead, use `key in value`.
 */
export const hasOwn = <Type, Key extends $type.ObjectKey>(value: Type, key: Key): value is Type & Record<Key, unknown> => {
	return $isꓺobject(value) && Object.prototype.hasOwnProperty.call(value, key);
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
export const keysAndSymbols = (value: unknown): $type.ObjectKey[] => {
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
 * Gets all of an object’s own enumerable key and symbol entries.
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
 * @note Unlike {@see Object.entries()}, this returns symbol keys also.
 */
export const keyAndSymbolEntries = (value: unknown): $type.ObjectEntries => {
	const entries: $type.ObjectEntries = [];
	const objValue = Object(value) as $type.Object;

	for (const keyOrSymbol of Reflect.ownKeys(objValue)) {
		if (Object.getOwnPropertyDescriptor(objValue, keyOrSymbol)?.enumerable) {
			entries.push([keyOrSymbol, objValue[keyOrSymbol]]);
		}
	}
	return entries;
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
 * @param   target          Target object.
 * @param   ...assignValues Values to assign.
 *
 * @returns                 Mutated `target` object.
 *
 * @note This method can be helpful in some cases as an alternative to {@see clone()}.
 */
export const assign = (target: unknown, ...assignValues: unknown[]): $type.Object => {
	const objTarget = Object(target) as $type.Object;

	for (const values of assignValues) {
		const objValues = Object(values) as $type.Object;

		for (const key of keysAndSymbols(objValues)) {
			objTarget[key] = objValues[key];
		}
	}
	return objTarget;
};

/**
 * Similar to {@see Object.assign()}, but this assigns complete descriptors.
 *
 * The difference between this and {@see Object.assign()} is that when complete descriptors are assigned, properties
 * assigned to `target` will also include a shallow clone of the original attributes; i.e., property descriptors.
 *
 * In the case of `target` not being an object, it is cast as an object. In such a case, it will not be mutated by
 * reference, and thus, callers will need to use the return value from this function.
 *
 * @param   target          Target object.
 * @param   ...assignValues Values to assign.
 *
 * @returns                 Mutated `target` object.
 *
 * @note This method can be helpful in some cases; e.g., as an alternative to {@see clone()}.
 */
export const assignComplete = (target: unknown, ...assignValues: unknown[]): $type.Object => {
	const objTarget = Object(target) as $type.Object;

	for (const values of assignValues) {
		const objValues = Object(values) as $type.Object;

		for (const key of keysAndSymbols(objValues)) {
			Object.defineProperty(objTarget, key, { ...Object.getOwnPropertyDescriptor(objValues, key) });
		}
	}
	return objTarget;
};

/**
 * Mimics {@see Object.assign()}, but assigns default values only.
 *
 * Once a key in `target` resolves to something other than `undefined`, and is the target’s own key, additional values
 * of the same key are ignored. Otherwise, this behaves exactly the same as {@see Object.assign()} in every other way.
 *
 * In the case of `target` not being an object, it is cast as an object. In such a case, it will not be mutated by
 * reference, and thus, callers will need to use the return value from this function.
 *
 * @param   target           Target object.
 * @param   ...defaultValues Default values.
 *
 * @returns                  Mutated `target` object.
 */
export const assignDefaults = (target: unknown, ...defaultValues: unknown[]): $type.Object => {
	const objTarget = Object(target) as $type.Object;

	for (const defaults of defaultValues) {
		const objDefaults = Object(defaults) as $type.Object;

		for (const key of keysAndSymbols(objDefaults)) {
			if (undefined !== objTarget[key] && hasOwn(objTarget, key)) {
				continue; // Target already has own key !== `undefined`.
			}
			objTarget[key] = objDefaults[key];
		}
	}
	return objTarget;
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
 * set, map, array, or plain object. That is, _unless_ a `[$toꓺsymbols.clone]()` method is provided by the class.
 *
 * Any object (e.g., a class) can choose to implement a `[$toꓺsymbols.clone]()` method. If this symbol key exists, and
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
	const opts = assignDefaults({}, options, { with: undefined, transfer: [] }) as Required<CloneOptions>;

	if (!$isꓺobject(value) || $isꓺfunction(value) || $isꓺpromise(value)) {
		return value as Type | $type.Object; // Unnecessary; e.g., primitive; or impossible.
	}
	if (opts.with && $isꓺfunction(opts.with)) {
		const clone = opts.with(value, { deep: false, opts, circular, inDeep: false });

		if ($isꓺobject(clone)) {
			return clone as Type | $type.Object;
		}
	}
	if (value[$toꓺsymbols.clone] && $isꓺfunction(value[$toꓺsymbols.clone])) {
		const clone = (value[$toꓺsymbols.clone] as ToCloneSymbolFn)({ deep: false, opts, circular, inDeep: false });

		if ($isꓺobject(clone)) {
			return clone as Type | $type.Object;
		}
	}
	switch (true) {
		case $isꓺurl(value): {
			return new URL(value as unknown as URL) as Type;
		}
		case $isꓺnode(value): {
			return (value as unknown as Node).cloneNode(true) as Type;
		}
		case $isꓺset(value): {
			return new Set(value as unknown as Set<unknown>) as Type;
		}
		case $isꓺmap(value): {
			return new Map(value as unknown as Map<unknown, unknown>) as Type;
		}
		case $isꓺarray(value): {
			return [...(value as unknown as unknown[])] as Type;
		}
		case $isꓺplainObject(value): {
			return { ...(value as unknown as $type.Object) } as Type;
		}
		case $isꓺstructuredCloneable(value): {
			try {
				return structuredClone(value, { transfer: opts.transfer }) as Type | $type.Object;
			} catch {
				/* ↓ Fall through to default case handler. */
			}
		}
		// eslint-disable-next-line no-fallthrough -- Fall through ok.
		default: {
			return { ...value } as $type.Object;
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
 * set, map, array, or plain object. That is, _unless_ a `[$toꓺsymbols.clone]()` method is provided by the class.
 *
 * Any object (e.g., a class) can choose to implement a `[$toꓺsymbols.clone]()` method. If this symbol key exists, and
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
	const opts = !inDeep ? (assignDefaults({}, options, { with: undefined, transfer: [] }) as Required<CloneOptions>) : (options as Required<CloneOptions>);

	if (!$isꓺobject(value) || $isꓺfunction(value) || $isꓺpromise(value)) {
		return value as Type | $type.Object; // Unnecessary; e.g., primitive; or impossible.
	}
	if (circular.has(value)) {
		return circular.get(value) as Type | $type.Object;
	}
	if (opts.with && $isꓺfunction(opts.with)) {
		const clone = opts.with(value, { deep: true, opts, circular, inDeep });

		if ($isꓺobject(clone)) {
			circular.set(value, clone);
			return clone as Type | $type.Object;
		}
	}
	if (value[$toꓺsymbols.clone] && $isꓺfunction(value[$toꓺsymbols.clone])) {
		const clone = (value[$toꓺsymbols.clone] as ToCloneSymbolFn)({ deep: true, opts, circular, inDeep });

		if ($isꓺobject(clone)) {
			circular.set(value, clone);
			return clone as Type | $type.Object;
		}
	}
	switch (true) {
		case $isꓺurl(value): {
			const clone = new URL(value as unknown as URL);
			circular.set(value, clone);
			return clone as Type;
		}
		case $isꓺnode(value): {
			const clone = (value as unknown as Node).cloneNode(true);
			circular.set(value, clone);
			return clone as Type;
		}
		case $isꓺset(value): {
			const clone: Set<unknown> = new Set();
			circular.set(value, clone);

			for (const _value of value as unknown as Set<unknown>) {
				clone.add(cloneDeep(_value, opts, circular, true));
			}
			return clone as Type;
		}
		case $isꓺmap(value): {
			const clone: Map<unknown, unknown> = new Map();
			circular.set(value, clone);

			for (const [key, keyValue] of value as unknown as Map<unknown, unknown>) {
				clone.set(key, cloneDeep(keyValue, opts, circular, true));
			}
			return clone as Type;
		}
		case $isꓺarray(value): {
			const clone: unknown[] = [];
			circular.set(value, clone);

			for (let key = 0; key < (value as unknown[]).length; key++) {
				clone[key] = cloneDeep((value as unknown[])[key], opts, circular, true);
			}
			return clone as Type;
		}
		case $isꓺplainObject(value): {
			const clone: $type.Object = {};
			circular.set(value, clone);

			for (const [key, keyValue] of keyAndSymbolEntries(value)) {
				clone[key] = cloneDeep(keyValue, opts, circular, true);
			}
			return clone as Type;
		}
		case $isꓺstructuredCloneable(value): {
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
 * Maps all values in an object (by default, a shallow clone) to a callback function.
 *
 * Fully supported object types include sets, maps, arrays, and plain objects. Everything else is potentially converted
 * into, and returned as, a plain set, map, array, or object; depending on the object’s cloneability.
 *
 * Callback function signature:
 *
 *     (value: unknown, key?: unknown) => unknown;
 *
 * If `value` is a {@see Set}, no `key` is passed to callback. If `value` is a {@see Map}, `key` could very well be
 * anything. Thus, use `key` with caution. It’s not always set to a safe object key; i.e., depending on `value` type.
 *
 * @param   value      Value (i.e., object) to map.
 * @param   callbackFn Callback function with signature above.
 * @param   options    Options. To map by reference, set `{ byReference: true }`.
 *
 * @returns            Object containing mapped values (a shallow clone, by default).
 *
 * @note Like {@see Array.prototype.map()}, this produces a shallow clone by default. To map by reference, set `{ byReference: true }`.
 */
export const map = <Type>(value: Type, callbackFn: (value: unknown, key?: unknown) => unknown, options: MapOptions = {}): Type | $type.Object => {
	const opts = assignDefaults({}, options, { byReference: false, skipReadonly: false }) as Required<MapOptions>;
	const objValue = Object(opts.byReference ? value : clone(value)) as $type.Object;

	if ($isꓺset(objValue)) {
		for (const value of objValue) {
			objValue.delete(value);
			objValue.add(callbackFn(value));
		}
	} else if ($isꓺmap(objValue)) {
		for (const [key, value] of objValue) {
			objValue.set(key, callbackFn(value, key));
		}
	} else if ($isꓺarray(objValue)) {
		for (let key = 0; key < objValue.length; key++) {
			if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
				objValue[key] = callbackFn(objValue[key], key);
			} // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
		}
	} else {
		for (const key of keysAndSymbols(objValue)) {
			if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
				objValue[key] = callbackFn(objValue[key], key);
			} // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
		}
	}
	return objValue;
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
export const omit = <Type>(value: Type, keys: unknown[], options: OmitOptions = {}): Type | $type.Object => {
	const opts = assignDefaults({}, options, { byReference: false, skipReadonly: false }) as Required<OmitOptions>;
	const objValue = Object(opts.byReference ? value : clone(value)) as $type.Object;

	if ($isꓺset(objValue)) {
		for (const value of keys) {
			objValue.delete(value);
		}
	} else if ($isꓺmap(objValue)) {
		for (const key of keys) {
			objValue.delete(key);
		}
	} else if ($isꓺarray(objValue)) {
		for (const key of keys.filter($isꓺsafeArrayKey)) {
			if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
				objValue.splice(key, 1);
			} // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
		}
	} else {
		for (const key of keys.filter($isꓺsafeObjectKey)) {
			if (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable) {
				delete objValue[key];
			} // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
		}
	}
	return objValue;
};

/**
 * Unsets specific object keys (by default, by reference).
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
 * @returns         Object (by default, by reference) without specific keys.
 */
export const unset = <Type>(value: Type, keys: unknown[], options: UnsetOptions = {}): Type | $type.Object => {
	return omit(value, keys, { byReference: true, ...options } as OmitOptions);
};

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
export const pick = <Type>(value: Type, keys: unknown[], options: PickOptions = {}): Type | $type.Object => {
	const opts = assignDefaults({}, options, { byReference: false, skipReadonly: false }) as Required<PickOptions>;
	const objValue = Object(opts.byReference ? value : clone(value)) as $type.Object;

	if ($isꓺset(objValue)) {
		for (const value of objValue) {
			if (!keys.includes(value)) objValue.delete(value);
		}
	} else if ($isꓺmap(objValue)) {
		for (const [key] of objValue) {
			if (!keys.includes(key)) objValue.delete(key);
		}
	} else if ($isꓺarray(objValue)) {
		for (let key = 0; key < objValue.length; key++) {
			if (!keys.includes(key) && (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable)) {
				objValue.splice(key, 1);
			} // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
		}
	} else {
		for (const key of keysAndSymbols(objValue)) {
			if (!keys.includes(key) && (!opts.byReference || !opts.skipReadonly || Object.getOwnPropertyDescriptor(objValue, key)?.writable)) {
				delete objValue[key];
			} // If `byReference` and `skipReadonly` is false, this will throw an error on a readonly key.
		}
	}
	return objValue;
};

/**
 * Leaves specific object keys (by default, by reference) — unsetting all others.
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
 * @returns         Object (by default, by reference) with specific keys only.
 */
export const leave = <Type>(value: Type, keys: unknown[], options: LeaveOptions = {}): Type | $type.Object => {
	return pick(value, keys, { byReference: true, ...options } as PickOptions);
};
