/**
 * Common types.
 */

export type ObjectKey = PropertyKey;
export type ObjectPath = number | string;

export type { $Object as Object };
export type { $Function as Function };
export type { $AsyncFunction as AsyncFunction };

export type { Interface as Base } from './resources/classes/base.js';
export type { Interface as Brand } from './resources/classes/brand.js';
export type { DateTime as Time } from 'luxon';
export type { $Error as Error };

export type TypedArray<Type extends $TypedArray = $TypedArray> = Type;
export type ObjectEntries<Type extends object = $Object> = [keyof Type, Type[keyof Type]][];

export type ObjTagFn = () => string;
export type ObjStringTagFn = () => string;

export type ObjToPlainSymbolFn = () => unknown;
export type ObjToJSONFn = (key?: Omit<ObjectKey, symbol>) => unknown;
export type { ToCloneSymbolFn as ObjToCloneSymbolFn } from './obj.js';

export type Primitive = null | undefined | boolean | number | bigint | string | symbol;

// By default, TypeScript doesn’t know that classes are constructors, so we use this generic type when necessary.
export type ClassC9r = { new (...args: unknown[]): $Object }; // See: <https://o5p.me/6O7bC7> <https://o5p.me/mUHPAL>.

/**
 * Utility types.
 */

export type PartialTuple<__Tuple extends unknown[], __Extracted extends unknown[] = []> = //
	// If the tuple provided contains at least one required value.
	__Tuple extends [infer __Next, ...infer __Remaining]
		? // Recurse with remaining + first being partial (i.e., optional) now.
		  PartialTuple<__Remaining, [...__Extracted, __Next?]>
		: // Else, return with an empty tuple.
		  [...__Extracted, /* empty */ ...__Tuple];

export type PartialParameters<Type extends $Function> = PartialTuple<Parameters<Type>>;

export type RemainingParameters<__Provided extends unknown[], __Expected extends unknown[]> = //
	// If the expected parameters contains at least one required value.
	__Expected extends [infer unusedꓺ__FirstExpected, ...infer __RestExpected]
		? // If provided parameters contains at least one required value, recurse with one item less in each.
		  __Provided extends [infer unusedꓺ__FirstProvided, ...infer __RestProvided]
			? RemainingParameters<__RestProvided, __RestExpected>
			: // Else, remaining parameters unchanged.
			  __Expected
		: // Else, no more parameters.
		  [];

/**
 * Private utilities used by this file.
 */

type $Keyable = { [x: ObjectKey]: unknown };
type $Object<Type extends object = $Keyable> = Type & $Keyable;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $AnyFn = (...args: any[]) => unknown; // See: <https://o5p.me/CwHQYM>.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $AsyncFn = (...args: any[]) => Promise<unknown>; // See: <https://o5p.me/CwHQYM>.

type $Function<Type extends $AnyFn = $AnyFn> = (...args: Parameters<Type>) => ReturnType<Type>;
type $AsyncFunction<Type extends $AsyncFn = $AsyncFn> = (...args: Parameters<Type>) => ReturnType<Type>;

type $Error<Type extends Error = Error> = Type;
type $TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array;
