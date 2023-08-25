/**
 * Conditional utilities.
 */

import {
	isWeb as $envꓺisWeb, //
	isNode as $envꓺisNode,
} from './env.js';

import {
	tag as $objꓺtag, //
	tags as $objꓺtags,
	keysAndSymbols as $objꓺkeysAndSymbols,
} from './obj.js';

import { svz as $moizeꓺsvz } from './moize.js';
import { pkgName as $appꓺpkgName } from './app.js';

import type * as $type from './type.js';

let structuredCloneableObjectTags: string[];

const numericIntegerRegExp = /^(?:0|-?[1-9][0-9]*)$/u;
const numericFloatRegExp = /^(?:0|-?[1-9][0-9]*)?\.[0-9]+$/u;

/**
 * Exports utilities from Fast Equals package.
 *
 * Fast Equals is a Moize dependency, which we also use. Therefore, it makes sense to use Fast Equals for equality
 * comparisons. For further details {@see $fn.memoize()}, which is powered by the Moize memoization library.
 */
export {
	sameValueZeroEqual as equal, // Same value zero.
	//
	circularDeepEqual as deepEqual, // Points to circular variant.
	circularShallowEqual as shallowEqual, // Points to circular variant.
	//
	deepEqual as fastDeepEqual, // Faster, but doesn’t handle circular refs.
	shallowEqual as fastShallowEqual, // Faster, but doesn’t handle circular refs.
} from 'fast-equals';

/**
 * Checks if a value is NaN.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is NaN.
 */
export const nan = (value: unknown): value is typeof NaN => {
	return Number.isNaN(value);
};

/**
 * Checks if a value is null or undefined.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is null or undefined.
 */
export const nul = (value: unknown): value is null | undefined => {
	return null === value || undefined === value;
};

/**
 * Checks if a value is null, undefined, or NaN.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is null, undefined, or NaN.
 */
export const nil = (value: unknown): value is null | undefined | typeof NaN => {
	return null === value || undefined === value || nan(value);
};

/**
 * Checks if a value is null.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is null.
 */
const _null = (value: unknown): value is null => {
	return null === value;
};
export { _null as null }; // Must be exported as alias.

/**
 * Checks if a value is undefined.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is undefined.
 */
const _undefined = (value: unknown): value is undefined => {
	return undefined === value;
};
export { _undefined as undefined }; // Must be exported as alias.

/**
 * Checks if a value is empty.
 *
 * Emptiness is checked in this order:
 *
 * - A value of any type is empty when it’s falsy.
 * - Primitive values are empty only when they are falsy.
 * - Sets and maps are empty when they have a `size` of zero.
 * - An array buffer is empty when it has a `byteLength` of zero.
 * - Arrays, typed arrays, and buffers are empty when they have a `length` of zero.
 * - Iterables are empty when they have no iterable values; i.e., effectively a length of zero.
 * - Async iterables are always considered not to be empty, as they require `for await` to confirm.
 * - All other object types are empty when their own enumerable keys/symbols have a length of zero.
 *
 * Other important things to consider:
 *
 * - `'0'` is not falsy, so not empty. Unless, `opts` includes `{ orZero: true }` as an additional check.
 * - Symbols are a primitive value, and therefore only empty when falsy. They are never falsy, so never empty.
 * - Functions can be empty, and often are empty. Functions of all kinds are treated like any other object; i.e.,
 *   functions are empty when their own enumerable keys/symbols have a length of zero.
 *
 * When to use, and not use:
 *
 * - Use when testing emptiness of a value with an unknown type, or when testing emptiness of object types.
 * - Primitive values are empty only when they are falsy. Therefore, there’s no need to use this utility when testing
 *   primitive types. Instead, simply use a falsy `if(!value)` check. It’s faster and easier.
 *
 * @param   value Value to consider.
 * @param   opts  Options (all optional).
 *
 * @returns       True if value is empty.
 *
 * @note See: <https://o5p.me/Mg1CQA> for falsy details.
 * @note See: <https://o5p.me/iYUYVK> for iterable details.
 */
export const empty = (value: unknown, opts: { orZero?: boolean } = {}): boolean => {
	if (opts.orZero && '0' === value) return true;
	if (!value) return true; // Empty when falsy.

	if (!object(value) /* Primitive. */) {
		return !value; // Empty when falsy.
	}
	if (set(value) || map(value)) {
		return 0 === value.size;
	}
	if (arrayBuffer(value)) {
		return 0 === value.byteLength;
	}
	if (array(value) || typedArray(value) || buffer(value)) {
		return 0 === value.length;
	}
	if (iterable(value)) {
		for (const unusedꓺ of value) return false;
		return true; // Empty otherwise.
	}
	if (asyncIterable(value)) {
		return false; // Never considered empty.
	}
	return 0 === $objꓺkeysAndSymbols(value).length;
};

/**
 * Checks if value is a primitive.
 *
 * This is the exact inverse of {@see object()}.
 *
 * The `!object()` check is used to ensure consistency and help with forward compatibility; i.e., any value that is not
 * an object, is a primitive. Thus, if JavaScript adds new primitives in the future, `!object()` will catch those.
 *
 * As of early 2023, `null`, `undefined`, `boolean`, `number`, `bigint`, `string`, and `symbol` are all primitive types.
 * Non-null `object` and `function` types are not primitives, which is what {@see object()} checks for in the inverse.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is primitive.
 *
 * @note Primitives are always passed by value in JavaScript.
 * @note See: <https://o5p.me/QGfHu9> regarding primitive types.
 */
export const primitive = (value: unknown): value is $type.Primitive => {
	return !object(value);
};

/**
 * Checks if value is a boolean.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a boolean.
 */
export const boolean = (value: unknown): value is boolean => {
	return 'boolean' === typeof value;
};

/**
 * Checks if value is a number.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a number.
 *
 * @note Returns true for `-Infinity`, `Infinity`, which are also numbers.
 * @note Returns false for `NaN`, which is technically a number, but not really.
 * @note Returns false for bigint values, as those are not numbers.
 */
export const number = (value: unknown): value is number => {
	return 'number' === typeof value && !nan(value);
};

/**
 * Checks if value is a bigint.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a bigint.
 *
 * @note Returns false for `-Infinity`, `Infinity`, which are not bigints.
 * @note Returns false for `NaN`, which is technically a number, but not a bigint.
 * @note Returns false for number values, as those are not bigints.
 */
export const bigint = (value: unknown): value is bigint => {
	return 'bigint' === typeof value;
};

/**
 * Checks if value is an integer.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is an integer.
 *
 * @note Returns false for `-Infinity`, `Infinity`, which are not integers.
 * @note Returns false for `NaN`, which is technically a number, but not an integer.
 * @note Returns true for numbers ending in `.0`, which are actually integers.
 */
export const integer = (value: unknown): value is number => {
	return Number.isInteger(value);
};

/**
 * Checks if value is a float.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a float.
 *
 * @note Returns false for `-Infinity`, `Infinity`, which are not floats.
 * @note Returns false for `NaN`, which is technically a number, but not a float.
 * @note Returns false for numbers ending in `.0`, which are actually integers.
 */
export const float = (value: unknown): value is number => {
	return finite(value) && value % 1 !== 0;
};

/**
 * Checks if value is finite.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is finite.
 *
 * @note Returns false for `-Infinity`, `Infinity`, which are not finites.
 * @note Returns false for `NaN`, which is technically a number, but not finite.
 */
export const finite = (value: unknown): value is number => {
	return Number.isFinite(value);
};

/**
 * Checks if value is numeric.
 *
 * @param   value Value to consider.
 * @param   type  Optional numeric condition.
 *
 * @returns       True if value is numeric and meets the optional `type` condition.
 *
 * @note Returns true for `-Infinity`, `Infinity`, which are also numbers.
 * @note Returns false for `NaN`, which is technically a number type, but not numeric.
 * @note Returns false for bigint values, as those are not numbers.
 */
export const numeric = $moizeꓺsvz({ maxSize: 12 })(
	// Memoized function.
	(value: unknown, type?: 'integer' | 'safeInteger' | 'safeArrayKey' | 'float'): value is number | string => {
		switch (type) {
			case 'integer':
				return integer(value) || (string(value) && numericIntegerRegExp.test(value) && integer(Number(value)));

			case 'safeInteger':
				return safeInteger(value) || (string(value) && numericIntegerRegExp.test(value) && safeInteger(Number(value)));

			case 'safeArrayKey':
				return safeArrayKey(value) || (string(value) && numericIntegerRegExp.test(value) && safeArrayKey(Number(value)));

			case 'float':
				return float(value) || (string(value) && numericFloatRegExp.test(value) && number(Number(value)));
		}
		return number(value) || (string(value) && (numericIntegerRegExp.test(value) || numericFloatRegExp.test(value)) && number(Number(value)));
	},
);

/**
 * Checks if value is a string.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a string.
 */
export const string = (value: unknown): value is string => {
	return 'string' === typeof value;
};

/**
 * Checks if value is a symbol.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a symbol.
 */
export const symbol = (value: unknown): value is symbol => {
	return 'symbol' === typeof value;
};

/**
 * Checks if value is a prototype.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a prototype.
 */
export const proto = (value: unknown): value is $type.Object => {
	return object(value) && value === (value.constructor?.prototype || Object.prototype);
};

/**
 * Checks if value is an object.
 *
 * This is the exact inverse of {@see primitive()}.
 *
 * @param   value Value to consider.
 * @param   opts  Options. Default is `{}`.
 *
 * @returns       True if value is an object.
 *
 * @note By default, this also returns true for functions.
 * @note By default, this also returns true for async functions.
 * @note By default, this also returns true for generator functions.
 * @note By default, this also returns true for async generator functions.
 * @note By default, this also returns true for proxied functions, sync or async.
 * @note By default, this also returns true for memoized functions.
 */
export const object = (value: unknown, opts: { notFunction?: boolean } = {}): value is $type.Object => {
	if (opts.notFunction) {
		return null !== value && 'object' === typeof value;
	} else {
		return null !== value && ['object', 'function'].includes(typeof value);
	}
};

/**
 * Checks if value is a plain object.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a plain object.
 */
export const plainObject = (value: unknown): value is $type.Object => {
	return object(value) && objectTag(value, 'Object');
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
const _function = (value: unknown): value is $type.Function => {
	return value instanceof Function;
};
export { _function as function }; // Must be exported as alias.

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
export const asyncFunction = (value: unknown): value is $type.AsyncFunction => {
	return _function(value) && objectOfTag(value, 'AsyncFunction');
};

/**
 * Checks if a value is a promise.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a promise.
 */
export const promise = (value: unknown): value is Promise<unknown> => {
	return value instanceof Promise;
};

/**
 * Checks if value is a set.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a set.
 */
export const set = (value: unknown): value is Set<unknown> => {
	return value instanceof Set;
};

/**
 * Checks if value is a map.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a map.
 */
export const map = (value: unknown): value is Map<unknown, unknown> => {
	return value instanceof Map;
};

/**
 * Checks if value is an array buffer.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is an array buffer.
 */
export const arrayBuffer = (value: unknown): value is ArrayBuffer => {
	return value instanceof ArrayBuffer;
};

/**
 * Checks if value is an array.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is an array.
 */
export const array = (value: unknown): value is unknown[] => {
	return value instanceof Array || Array.isArray(value);
};

/**
 * Checks if value is a typed array.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a typed array.
 *
 * @note See: <https://o5p.me/xfQ9CB> for details.
 */
export const typedArray = (value: unknown): value is $type.TypedArray => {
	if (!object(value)) return false; // Saves time.

	for (const type of [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array]) {
		if (value instanceof type) return true;
	}
	return false;
};

/**
 * Checks if value is a data view.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a data view.
 */
export const dataView = (value: unknown): value is DataView => {
	return value instanceof DataView;
};

/**
 * Checks if value is a buffer.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a buffer.
 */
export const buffer = (value: unknown): value is Buffer => {
	return $envꓺisNode() && Buffer.isBuffer(value);
};

/**
 * Checks if value is a blob.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a blob.
 */
export const blob = (value: unknown): value is Blob => {
	return value instanceof Blob;
};

/**
 * Checks if value is an error.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is an error.
 */
export const error = (value: unknown): value is $type.Error => {
	return value instanceof Error;
};

/**
 * Checks if value is a brand.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a brand.
 */
export const brand = (value: unknown): value is $type.Brand => {
	return object(value) && objectOfTag(value, $appꓺpkgName + '/Brand');
};

/**
 * Checks if value is a time.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a time.
 */
export const time = (value: unknown): value is $type.Time => {
	return object(value) && objectOfTag(value, $appꓺpkgName + '/Time');
};

/**
 * Checks if value is a date.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a date.
 */
export const date = (value: unknown): value is Date => {
	return value instanceof Date;
};

/**
 * Checks if value is a URL.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a URL.
 */
export const url = (value: unknown): value is URL => {
	return value instanceof URL;
};

/**
 * Checks if value is a RegExp.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a RegExp.
 */
export const regExp = (value: unknown): value is RegExp => {
	return value instanceof RegExp;
};

/**
 * Checks if value is a DOM node.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is DOM node.
 */
export const node = (value: unknown): value is Node => {
	return $envꓺisWeb() && value instanceof Node;
};

/**
 * Checks if value is a DOM element.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is DOM element.
 */
export const element = (value: unknown): value is Element => {
	return $envꓺisWeb() && value instanceof Element;
};

/**
 * Checks a value’s object tag.
 *
 * @param   value       Value to consider.
 * @param   requiredTag Required object tag.
 *
 * @returns             True if value’s object tag matches.
 *
 * @note Please {@see $obj.tag()} for details regarding the special case of `[tag]:[cn]`.
 */
export const objectTag = (value: unknown, requiredTag: string): boolean => {
	return $objꓺtag(value) === requiredTag;
};

/**
 * Checks if a value has one or more object tags.
 *
 * @param   value           Value to consider.
 * @param   ...requiredTags Required object tag(s). Each argument is equivalent to an `AND` condition. Each argument
 *   that is an array is equivalent to a bracketed `AND (tag OR tag)` condition, allowing for both logical operators.
 * @returns                 True if value is of all required object tags.
 *
 * @note Please {@see $obj.tag()} for details regarding the special case of `[tag]:[cn]`.
 */
export const objectOfTag = (value: unknown, ...requiredTags: (string | string[])[]): boolean => {
	const objTags = $objꓺtags(value);

	for (const condition of requiredTags) {
		if (array(condition) /* AND (`tag` OR `tag`). */) {
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
 * Checks if a value is iterable.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is iterable.
 *
 * @note See: <https://o5p.me/iYUYVK> for iterable details.
 */
export const iterable = (value: unknown): value is Iterable<unknown> => {
	return Symbol.iterator in Object(value);
};

/**
 * Checks if value is an async iterable.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is an async iterable.
 *
 * @note See: <https://o5p.me/iYUYVK> for iterable details.
 */
export const asyncIterable = (value: unknown): value is AsyncIterable<unknown> => {
	return Symbol.asyncIterator in Object(value);
};

/**
 * Checks if value is a safe integer.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a safe integer.
 *
 * @note Returns false for `NaN`, which is technically a number, but not an integer.
 * @note Returns false for `-Infinity`, `Infinity`, which are not integers.
 */
export const safeInteger = (value: unknown): value is number => {
	return Number.isSafeInteger(value);
};

/**
 * Checks if value is a safe array key.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a safe array key.
 *
 * @note Returns false for `NaN`, which is technically a number, but not a key.
 * @note Returns false for `-Infinity`, `Infinity`, which are not keys.
 */
export const safeArrayKey = (value: unknown): value is number => {
	return Number.isSafeInteger(value) && (value as number) >= 0;
};

/**
 * Checks if value is a safe object key.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a safe object key.
 */
export const safeObjectKey = (value: unknown): value is $type.ObjectKey => {
	return string(value) || safeArrayKey(value) || symbol(value);
};

/**
 * Checks if value is a safe object path.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a safe object path.
 */
export const safeObjectPath = (value: unknown): value is $type.ObjectPath => {
	return string(value) || safeArrayKey(value);
};

/**
 * Checks if a property key would pollute an object’s prototype.
 *
 * @param   key Property key to check.
 *
 * @returns     True if property key would pollute an object’s prototype.
 */
export const protoPollutionKey = (key: number | string): boolean => {
	return string(key) && ['__proto__', 'prototype', 'constructor'].includes(key.toLowerCase());
};

/**
 * Checks if a value can be cloned by {@see structuredClone()}.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value can be cloned by {@see structuredClone()}.
 *
 * @note See: <https://o5p.me/LKrX3H> for details.
 */
export const structuredCloneable = (value: unknown): boolean => {
	if (!structuredCloneableObjectTags) {
		structuredCloneableObjectTags = [
			// See: <https://o5p.me/ZzJtat>.
			'Array',
			'ArrayBuffer',
			'Boolean',
			'DataView',
			'Date',
			'Error',
			'EvalError',
			'RangeError',
			'ReferenceError',
			'SyntaxError',
			'TypeError',
			'URIError',
			'AggregateError',
			'Map',
			'Object',
			'RegExp',
			'Set',
			'String',
			'Int8Array',
			'Uint8Array',
			'Uint8ClampedArray',
			'Int16Array',
			'Uint16Array',
			'Int32Array',
			'Uint32Array',
			'Float32Array',
			'Float64Array',
			'BigInt64Array',
			'BigUint64Array',

			// See: <https://o5p.me/ZzJtat>.
			...($envꓺisWeb()
				? [
						'AudioData',
						'Blob',
						'CropTarget',
						'CryptoKey',
						'DOMException',
						'DOMMatrix',
						'DOMMatrixReadOnly',
						'DOMPoint',
						'DOMPointReadOnly',
						'DOMQuad',
						'DOMRect',
						'DOMRectReadOnly',
						'File',
						'FileList',
						'FileSystemDirectoryHandle',
						'FileSystemFileHandle',
						'FileSystemHandle',
						'GPUCompilationInfo',
						'GPUCompilationMessage',
						'ImageBitmap',
						'ImageData',
						'RTCCertificate',
						'VideoFrame',
				  ]
				: []),
		];
	}
	return (primitive(value) && !symbol(value)) || structuredCloneableObjectTags.includes($objꓺtag(value));
};
