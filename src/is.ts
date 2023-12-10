/**
 * Conditional utilities.
 */

import '#@initialize.ts';

import * as $standalone from '#@standalone/index.ts';
import { $app, $env, $obj, $preact, type $type } from '#index.ts';

let structuredCloneableObjectTags: string[];
const numericIntegerRegExp = /^(?:0|-?[1-9][0-9]*)$/u;
const numericFloatRegExp = /^(?:0|-?[1-9][0-9]*)?\.[0-9]+$/u;

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
}; // Weird behavior by import organizer here.
// This line prevents import organizer from shifting `null` export to top.
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
 * - `'0'` is not falsy, so not empty. {@see emptyOrZero()} is a variant that considers `'0'` empty.
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
 *
 * @returns       True if value is empty.
 *
 * @note See: <https://o5p.me/Mg1CQA> for falsy details.
 * @note See: <https://o5p.me/iYUYVK> for iterable details.
 */
export const empty = (value: unknown): boolean => {
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
    return 0 === $obj.keysAndSymbols(value).length;
};

/**
 * Checks if a value is _not_ empty.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is _not_ empty.
 *
 * @see {empty()} for further details.
 */
export const notEmpty = (value: unknown): boolean => {
    return !empty(value);
};

/**
 * Checks if a value is empty, or `'0'`.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is empty, or `'0'`.
 *
 * @see {empty()} for further details.
 */
export const emptyOrZero = (value: unknown): boolean => {
    return '0' === value || empty(value);
};

/**
 * Checks if a value is _not_ empty, or `'0'`.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is _not_ empty, or `'0'`.
 *
 * @see {emptyOrZero()} for further details.
 */
export const notEmptyOrZero = (value: unknown): boolean => {
    return !emptyOrZero(value);
};

/**
 * Checks if value is a primitive.
 *
 * Exact inverse of {@see object()}.
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
    return !object(value); // Not an object|function.
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
export const numeric = (value: unknown, type?: 'integer' | 'safeInteger' | 'safeArrayKey' | 'float'): value is number | string => {
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
};

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
export const proto = $standalone.$isꓺproto;

/**
 * Checks if value is an object.
 *
 * Exact inverse of {@see primitive()}.
 *
 * @param   value Value to consider.
 * @param   opts  Options. Default is `{}`.
 *
 * @returns       True if value is an object.
 *
 * @note This also returns true for functions.
 * @note This also returns true for async functions.
 * @note This also returns true for generator functions.
 * @note This also returns true for async generator functions.
 * @note This also returns true for proxied functions, sync or async.
 * @note This also returns true for memoized functions.
 */
export const object = $standalone.$isꓺobject;

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
const _function = $standalone.$isꓺfunction;
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
export const asyncFunction = $standalone.$isꓺasyncFunction;

/**
 * Checks if value is a function arguments object.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a function arguments object.
 */
export const fnArguments = (value: unknown): value is IArguments => {
    return object(value) && objectTag(value, 'Arguments');
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
export const array = $standalone.$isꓺarray;

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
    return ArrayBuffer.isView(value) && !dataView(value);
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
    return $env.isNode() && Buffer.isBuffer(value);
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
    return object(value) && objectOfTag(value, $app.pkgName + '/Brand');
};

/**
 * Checks if value is a person.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a person.
 */
export const person = (value: unknown): value is $type.Person => {
    return object(value) && objectOfTag(value, $app.pkgName + '/Person');
};

/**
 * Checks if value is a time.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a time.
 */
export const time = (value: unknown): value is $type.Time => {
    return object(value) && objectOfTag(value, $app.pkgName + '/Time');
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
 *
 * @requiredEnv web
 */
export const node = (value: unknown): value is Node => {
    return $env.isWeb() && value instanceof Node;
};

/**
 * Checks if value is a preact vNode.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is a preact vNode.
 *
 * @see https://o5p.me/jSIg3C -- JSX runtime.
 * @see https://o5p.me/GqM0aR -- Preact vNode.
 */
export const vNode = (value: unknown): value is $type.Object<{ type: unknown; props: $type.Object }> => {
    return $preact.isVNode(value) && plainObject(value)
        && Object.hasOwn(value, 'type') && plainObject(value.props)
        && Object.hasOwn(value, '__e' /* `__e` = `_dom` */); // prettier-ignore
};

/**
 * Checks if value is a DOM element.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is DOM element.
 *
 * @requiredEnv web
 */
export const element = (value: unknown): value is Element => {
    return $env.isWeb() && value instanceof Element;
};

/**
 * Checks if value is an HTML element.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is an HTML element.
 *
 * @requiredEnv web
 */
export const htmlElement = (value: unknown): value is HTMLElement => {
    return $env.isWeb() && value instanceof HTMLElement;
};

/**
 * Checks if value is a DOM event.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is DOM event.
 *
 * @requiredEnv web
 */
export const event = (value: unknown): value is Event => {
    return $env.isWeb() && value instanceof Event;
};

/**
 * Checks if value is a left-click DOM event.
 *
 * @param   value Value to consider.
 *
 * @returns       True if value is left-click DOM event.
 *
 * @requiredEnv web
 */
export const leftClickMouseEvent = (value: unknown): value is MouseEvent => {
    return (
        $env.isWeb() && //
        value instanceof MouseEvent &&
        'click' === value.type &&
        !value.ctrlKey &&
        !value.metaKey &&
        !value.altKey &&
        !value.shiftKey &&
        0 === (value.button || 0)
    );
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
export const objectTag = $standalone.$isꓺobjectTag;

/**
 * Checks if a value has one or more object tags.
 *
 * @param   value           Value to consider.
 * @param   ...requiredTags Required object tag(s). Each argument is equivalent to an `AND` condition. Each argument
 *   that is an array is equivalent to a bracketed `AND (tag OR tag)` condition, allowing for both logical operators.
 *
 * @returns                 True if value is of all required object tags.
 *
 * @note Please {@see $obj.tag()} for details regarding the special case of `[tag]:[cn]`.
 */
export const objectOfTag = $standalone.$isꓺobjectOfTag;

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
 * Checks if two values are strictly equal to each other.
 *
 * @param   a First value to compare.
 * @param   b Second value to compare.
 *
 * @returns   True if values are strictly equal; {@see https://o5p.me/58Z0j0}.
 */
export const equal = $standalone.$isꓺequal;

/**
 * Checks if values are deeply equal to each other.
 *
 * @param   a First value to compare.
 * @param   b Second value to compare.
 *
 * @returns   True if values are deeply equal to each other.
 */
export const deepEqual = $standalone.$isꓺdeepEqual;

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

            ...($env.isWeb() // See: <https://o5p.me/ZzJtat>.
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
    return (primitive(value) && !symbol(value)) || structuredCloneableObjectTags.includes($obj.tag(value));
};
