/**
 * Types.
 */
// organize-imports-ignore
/* eslint-disable @typescript-eslint/no-explicit-any */

import '#@initialize.ts';

import { $to } from '#index.ts';
import { type Dayjs } from 'dayjs';
import type * as cfw from '@cloudflare/workers-types/experimental';

// ---
// Types.

/**
 * Basic types.
 */
export type Any = any;

export type { $Keyable as Object };
export type { $AnyObject as AnyObject };

export type ObjectKey = PropertyKey;
export type ObjectPath = number | string;
export type { $ObjectC9r as ObjectC9r };

export type { $Keyable as Keyable };
export type { $StrKeyable as StrKeyable };
export type { $Unkeyable as Unkeyable };

export type { $Function as Function };
export type { $AsyncFunction as AsyncFunction };
export type { $AnyVoidFunction as AnyVoidFunction };

export type TypedArray<Type extends $TypedArray = $TypedArray> = Type;
export type Primitive = null | undefined | boolean | number | bigint | string | symbol;
export type ObjectEntries<Type extends object = $Keyable> = [keyof Type, Type[keyof Type]][];

/**
 * Class types.
 */
export type { $Time as Time };
export type * from '#class.ts';

/**
 * Cross env types.
 */
export type { $URL as URL };

export type { $Headers as Headers };
export type { $HeadersInit as HeadersInit };
export type { $RawHeadersInit as RawHeadersInit };

export type { $Request as Request };
export type { $RequestInit as RequestInit };

export type { $Response as Response };
export type { $ResponseInit as ResponseInit };
export type { $BodyInit as BodyInit };

export type { $Timeout as Timeout };
export type { $Interval as Interval };

export type { $fetch as fetch };
export type { $Error as Error };

/**
 * DOM-related types.
 */
export type DOMAtts = { [x: string]: unknown };
export type DOMEventTools = { cancel: () => void };
export type DOMEventTargetSelectors = EventTarget | string;
export type DOMEventDelegated = CustomEvent<{ target: Element; event: Event }>;
export type DOMEventHandler = ((event: Event) => void) | ((event: CustomEvent) => void) | ((event: Event) => Promise<void>) | ((event: CustomEvent) => Promise<void>);

/**
 * Cloudflare worker types.
 */
export type { cfw }; // `cfw` namespace.

/**
 * Cloudflare turnstile types.
 */
type CFTurnstile = typeof turnstile & {
    remove(widgetId: string): void; // Adds missing `remove()` fn.
};
export type { CFTurnstile as Turnstile };

/**
 * Ensurable types.
 */
export type EnsurableType =
    | 'boolean' | 'boolean[]'
    | 'number' | 'number[]'
    | 'bigint' | 'bigint[]'
    | 'string' | 'string[]'
    | 'object' | 'object[]'
    | 'plainObject' | 'plainObject[]'
    | 'plainObjectDeep' | 'plainObjectDeep[]'
    | 'unknown'; // prettier-ignore

export type EnsuredType<Type> =
    Type extends 'boolean' ? boolean
    : Type extends 'boolean[]' ? boolean[]
    //
    : Type extends 'number' ? number
    : Type extends 'number[]' ? number[]
    //
    : Type extends 'bigint' ? bigint
    : Type extends 'bigint[]' ? bigint[]
    //
    : Type extends 'string' ? string
    : Type extends 'string[]' ? string[]
    //
    : Type extends 'object' ? object
    : Type extends 'object[]' ? object[]
    //
    : Type extends 'plainObject' ? $Keyable
    : Type extends 'plainObject[]' ? $Keyable[]
    //
    : Type extends 'plainObjectDeep' ? $Keyable
    : Type extends 'plainObjectDeep[]' ? $Keyable[]
    //
    : unknown; // prettier-ignore

/**
 * Readonly utility types.
 */
export type ReadonlyDeep<Type> = //
    Type extends void | Primitive
        ? Type // Not applicable.
        : //
          Type extends $ꓺAnyFn
          ? //
            {} extends $ꓺReadonlyObjectDeep<Type>
              ? Type // No keys; not applicable.
              : //
                $ꓺHasMultipleCallSignatures<Type> extends true
                ? Type // Not possible when there are multiple signatures.
                : //
                  Type extends $ꓺAnyObjectC9r
                  ? (new (...args: Parameters<Type>) => ReturnType<Type>) & $ꓺReadonlyObjectDeep<Type>
                  : ((...args: Parameters<Type>) => ReturnType<Type>) & $ꓺReadonlyObjectDeep<Type>
          : //
            Type extends Readonly<Set<infer TypeOfSet>>
            ? $ꓺReadonlySetDeep<TypeOfSet>
            : //
              Type extends Readonly<Map<infer KeyTypeOfMap, infer ValueTypeOfMap>>
              ? $ꓺReadonlyMapDeep<KeyTypeOfMap, ValueTypeOfMap>
              : //
                Type extends Readonly<unknown[]>
                ? $ꓺReadonlyArrayDeep<Type>
                : //
                  Type extends object
                  ? $ꓺReadonlyObjectDeep<Type>
                  : //
                    Type; // Not applicable.

type $ꓺReadonlyArrayDeep<Type extends Readonly<unknown[]>> = //
    Type extends Readonly<[]> | Readonly<[...never[]]>
        ? Readonly<[]> // Empty array, or all never keys.
        : //
          Type extends Readonly<[infer First, ...infer Rest]>
          ? Readonly<[ReadonlyDeep<First>, ...$ꓺReadonlyArrayDeep<Rest>]>
          : //
            Type extends Readonly<[...infer Rest, infer Last]>
            ? Readonly<[...$ꓺReadonlyArrayDeep<Rest>, ReadonlyDeep<Last>]>
            : //
              Type extends Readonly<(infer TypeOfArray)[]>
              ? Readonly<ReadonlyDeep<TypeOfArray>[]>
              : //
                Type; // Not applicable.

type $ꓺReadonlySetDeep<Type> = Readonly<Set<ReadonlyDeep<Type>>>;
type $ꓺReadonlyMapDeep<KeyType, ValueType> = Readonly<Map<ReadonlyDeep<KeyType>, ReadonlyDeep<ValueType>>>;
type $ꓺReadonlyObjectDeep<Type extends object> = { readonly [Key in keyof Type]: ReadonlyDeep<Type[Key]> };

/**
 * Writable utility types.
 */
export type Writable<Type> = //
    Type extends void | Primitive
        ? Type // Not applicable.
        : //
          Type extends $ꓺAnyFn
          ? //
            {} extends Writable<Type>
              ? Type // No keys; not applicable.
              : //
                $ꓺHasMultipleCallSignatures<Type> extends true
                ? Type // Not possible when there are multiple signatures.
                : //
                  Type extends $ꓺAnyObjectC9r
                  ? (new (...args: Parameters<Type>) => ReturnType<Type>) & Writable<Type>
                  : ((...args: Parameters<Type>) => ReturnType<Type>) & Writable<Type>
          : //
            Type extends Readonly<Set<infer TypeOfSet>>
            ? Set<TypeOfSet>
            : //
              Type extends Readonly<Map<infer KeyTypeOfMap, infer ValueTypeOfMap>>
              ? Map<KeyTypeOfMap, ValueTypeOfMap>
              : //
                Type extends Readonly<unknown[]>
                ? $ꓺWritableArray<Type>
                : //
                  Type extends object
                  ? { -readonly [Key in keyof Type]: Type[Key] }
                  : //
                    Type; // Not applicable.

export type WritableDeep<Type> = //
    Type extends void | Primitive
        ? Type // Not applicable.
        : //
          Type extends $ꓺAnyFn
          ? //
            {} extends $ꓺWritableObjectDeep<Type>
              ? Type // No keys; not applicable.
              : //
                $ꓺHasMultipleCallSignatures<Type> extends true
                ? Type // Not possible when there are multiple signatures.
                : //
                  Type extends $ꓺAnyObjectC9r
                  ? (new (...args: Parameters<Type>) => ReturnType<Type>) & $ꓺWritableObjectDeep<Type>
                  : ((...args: Parameters<Type>) => ReturnType<Type>) & $ꓺWritableObjectDeep<Type>
          : //
            Type extends Readonly<Set<unknown>>
            ? $ꓺWritableSetDeep<Type>
            : //
              Type extends Readonly<Map<unknown, unknown>>
              ? $ꓺWritableMapDeep<Type>
              : //
                Type extends Readonly<unknown[]>
                ? $ꓺWritableArrayDeep<Type>
                : //
                  Type extends object
                  ? $ꓺWritableObjectDeep<Type>
                  : //
                    Type; // Not applicable.

type $ꓺWritableArray<Type extends Readonly<unknown[]>> = //
    Type extends Readonly<[]> | Readonly<[...never[]]>
        ? [] // Empty array, or all never keys.
        : //
          Type extends Readonly<[infer First, ...infer Rest]>
          ? [First, ...Rest]
          : //
            Type extends Readonly<[...infer Rest, infer Last]>
            ? [...Rest, Last]
            : //
              Type extends Readonly<(infer TypeOfArray)[]>
              ? TypeOfArray[]
              : //
                Type; // Not applicable.

type $ꓺWritableArrayDeep<Type extends Readonly<unknown[]>> = //
    Type extends Readonly<[]> | Readonly<[...never[]]>
        ? [] // Empty array, or all never keys.
        : //
          Type extends Readonly<[infer First, ...infer Rest]>
          ? [WritableDeep<First>, ...$ꓺWritableArrayDeep<Rest>]
          : //
            Type extends Readonly<[...infer Rest, infer Last]>
            ? [...$ꓺWritableArrayDeep<Rest>, WritableDeep<Last>]
            : //
              Type extends Readonly<(infer TypeOfArray)[]>
              ? WritableDeep<TypeOfArray>[]
              : //
                Type; // Not applicable.

type $ꓺWritableObjectDeep<Type extends object> = { -readonly [Key in keyof Type]: WritableDeep<Type[Key]> };
type $ꓺWritableSetDeep<Type extends Readonly<Set<unknown>>> = Type extends Readonly<Set<infer TypeOfSet>> ? Set<WritableDeep<TypeOfSet>> : Type;
type $ꓺWritableMapDeep<Type extends Readonly<Map<unknown, unknown>>> = // These conditions are merely for type inference, they should never be false.
    Type extends Readonly<Map<infer KeyTypeOfMap, infer ValueTypeOfMap>> ? Map<WritableDeep<KeyTypeOfMap>, WritableDeep<ValueTypeOfMap>> : Type;

/**
 * Partial utility types.
 */
export type PartialDeep<Type> = //
    Type extends void | Primitive
        ? Type // Not applicable.
        : //
          Type extends $ꓺAnyFn
          ? //
            {} extends $ꓺPartialObjectDeep<Type>
              ? Type // No keys; not applicable.
              : //
                $ꓺHasMultipleCallSignatures<Type> extends true
                ? Type // Not possible when there are multiple signatures.
                : //
                  Type extends $ꓺAnyObjectC9r
                  ? (new (...args: Parameters<Type>) => ReturnType<Type>) & $ꓺPartialObjectDeep<Type>
                  : ((...args: Parameters<Type>) => ReturnType<Type>) & $ꓺPartialObjectDeep<Type>
          : //
            Type extends Set<infer TypeOfSet>
            ? $ꓺPartialSetDeep<TypeOfSet>
            : //
              Type extends Readonly<Set<infer TypeOfSet>>
              ? $ꓺPartialReadonlySetDeep<TypeOfSet>
              : //
                Type extends Map<infer KeyTypeOfMap, infer ValueTypeOfMap>
                ? $ꓺPartialMapDeep<KeyTypeOfMap, ValueTypeOfMap>
                : //
                  Type extends Readonly<Map<infer KeyTypeOfMap, infer ValueTypeOfMap>>
                  ? $ꓺPartialReadonlyMapDeep<KeyTypeOfMap, ValueTypeOfMap>
                  : //
                    Type extends Readonly<(infer TypeOfArray)[]>
                    ? TypeOfArray[] extends Type // Tests for non-tuple arrays, specifically.
                        ? Readonly<TypeOfArray[]> extends Type // Differentiates readonly.
                            ? Readonly<PartialDeep<TypeOfArray>[]>
                            : PartialDeep<TypeOfArray>[]
                        : $ꓺPartialObjectDeep<Type>
                    : //
                      Type extends object
                      ? $ꓺPartialObjectDeep<Type>
                      : //
                        Type; // Not applicable.

type $ꓺPartialSetDeep<Type> = Set<PartialDeep<Type>>;
type $ꓺPartialReadonlySetDeep<Type> = Readonly<Set<PartialDeep<Type>>>;
type $ꓺPartialMapDeep<KeyType, ValueType> = Map<PartialDeep<KeyType>, PartialDeep<ValueType>>;
type $ꓺPartialReadonlyMapDeep<KeyType, ValueType> = Readonly<Map<PartialDeep<KeyType>, PartialDeep<ValueType>>>;
type $ꓺPartialObjectDeep<Type extends object> = { [Key in keyof Type]?: PartialDeep<Type[Key]> };

/**
 * Required utility types.
 */
export type RequiredDeep<Type> = //
    Type extends void | Primitive
        ? Type // Not applicable.
        : //
          Type extends $ꓺAnyFn
          ? //
            {} extends $ꓺRequiredObjectDeep<Type>
              ? Type // No keys; not applicable.
              : //
                $ꓺHasMultipleCallSignatures<Type> extends true
                ? Type // Not possible when there are multiple signatures.
                : //
                  Type extends $ꓺAnyObjectC9r
                  ? (new (...args: Parameters<Type>) => ReturnType<Type>) & $ꓺRequiredObjectDeep<Type>
                  : ((...args: Parameters<Type>) => ReturnType<Type>) & $ꓺRequiredObjectDeep<Type>
          : //
            Type extends Set<infer TypeOfSet>
            ? $ꓺRequiredSetDeep<TypeOfSet>
            : //
              Type extends Readonly<Set<infer TypeOfSet>>
              ? $ꓺRequiredReadonlySetDeep<TypeOfSet>
              : //
                Type extends Map<infer KeyTypeOfMap, infer ValueTypeOfMap>
                ? $ꓺRequiredMapDeep<KeyTypeOfMap, ValueTypeOfMap>
                : //
                  Type extends Readonly<Map<infer KeyTypeOfMap, infer ValueTypeOfMap>>
                  ? $ꓺRequiredReadonlyMapDeep<KeyTypeOfMap, ValueTypeOfMap>
                  : //
                    Type extends Readonly<(infer TypeOfArray)[]>
                    ? TypeOfArray[] extends Type // Tests for non-tuple arrays, specifically.
                        ? Readonly<TypeOfArray[]> extends Type // Differentiates readonly.
                            ? Readonly<RequiredDeep<TypeOfArray>[]>
                            : RequiredDeep<TypeOfArray>[]
                        : $ꓺRequiredObjectDeep<Type>
                    : //
                      Type extends object
                      ? $ꓺRequiredObjectDeep<Type>
                      : //
                        Type; // Not applicable.

type $ꓺRequiredSetDeep<Type> = Set<RequiredDeep<Type>>;
type $ꓺRequiredReadonlySetDeep<Type> = Readonly<Set<RequiredDeep<Type>>>;
type $ꓺRequiredMapDeep<KeyType, ValueType> = Map<RequiredDeep<KeyType>, RequiredDeep<ValueType>>;
type $ꓺRequiredReadonlyMapDeep<KeyType, ValueType> = Readonly<Map<RequiredDeep<KeyType>, RequiredDeep<ValueType>>>;
type $ꓺRequiredObjectDeep<Type extends object> = Required<{ [Key in keyof Type]: RequiredDeep<Type[Key]> }>;

/**
 * Parameter utility types.
 */
export type PartialParametersOf<Type extends $Function> = PartialParameters<Parameters<Type>>;
export type PartialParameters<Tuple extends unknown[], Extracted extends unknown[] = []> = //
    // If the tuple provided contains at least one required value.
    Tuple extends [infer Next, ...infer Remaining]
        ? // Recurse with remaining + first being partial now.
          PartialParameters<Remaining, [...Extracted, Next?]>
        : // Else, return with an empty tuple.
          [...Extracted, /* empty */ ...Tuple];

export type RemainingParameters<Provided extends unknown[], Expected extends unknown[]> = //
    // If the expected parameters contains at least one required value.
    Expected extends [infer unusedꓺFirstExpected, ...infer RestExpected]
        ? // If provided parameters contains at least one required value, recurse with one item less in each.
          Provided extends [infer unusedꓺFirstProvided, ...infer RestProvided]
            ? RemainingParameters<RestProvided, RestExpected>
            : // Else, remaining parameters unchanged.
              Expected
        : // Else, no more parameters.
          [];

/**
 * Flat array type.
 */
export type FlatArray<Type, Depth extends number> = ReturnType<typeof Array.prototype.flat<Type, Depth>>;

/**
 * Predicate types.
 */
// These must narrow to a specific type, and not reflect a type.
// e.g., We don’t want any of these to ever return a union of types.
export type OfSet<Type> = Type extends Set<infer TypeOfSet> ? Set<TypeOfSet> : Set<unknown>;
export type OfObject<Type> = Type extends $AnyObject<infer TypeOfObject> ? TypeOfObject : $Keyable;
export type OfPromise<Type> = Type extends Promise<infer TypeOfPromise> ? Promise<TypeOfPromise> : Promise<unknown>;
export type OfIterable<Type> = Type extends Iterable<infer TypeOfIterable> ? Iterable<TypeOfIterable> : Iterable<unknown>;
export type OfMap<Type> = Type extends Map<infer KeyTypeOfMap, infer ValueTypeOfMap> ? Map<KeyTypeOfMap, ValueTypeOfMap> : Map<unknown, unknown>;
export type OfAsyncIterable<Type> = Type extends AsyncIterable<infer TypeOfAsyncIterable> ? AsyncIterable<TypeOfAsyncIterable> : AsyncIterable<unknown>;
export type OfArray<Type> = Type extends (infer TypeOfArray)[] ? TypeOfArray[] : Type extends Readonly<(infer TypeOfArray)[]> ? Readonly<TypeOfArray[]> : unknown[];

/**
 * Protected internal types.
 */
type $Time = Dayjs;

type $TypedArray =
    | Int8Array //
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigInt64Array
    | BigUint64Array;

type $URL = URL | cfw.URL;

type $Headers = Headers | cfw.Headers;
type $HeadersInit = HeadersInit | cfw.HeadersInit;
type $RawHeadersInit = HeadersInit | cfw.HeadersInit | string;

type $Request = Request | cfw.Request;
type $RequestInit = (RequestInit | cfw.RequestInit) & { cache?: string };

type $Response = Response | cfw.Response;
type $ResponseInit = ResponseInit | cfw.ResponseInit;
type $BodyInit = BodyInit | cfw.BodyInit;

type $Timeout = ReturnType<typeof setTimeout> | number;
type $Interval = ReturnType<typeof setInterval> | number;

type $fetch = typeof fetch | typeof cfw.fetch;
type $Error<Type extends Error = Error> = Type;

type $Unkeyable = Record<ObjectKey, never>;
type $AnyObject<Type extends object = object> = {} & Type;
type $Keyable<Type extends object = object> = { [x: ObjectKey]: unknown } & Type;
type $StrKeyable<Type extends object = object> = { [x: string]: unknown } & Type;

type $ObjectC9r<Type extends $ꓺAnyObjectC9r = $ꓺAnyObjectC9r> = Type;
type $Function<Type extends $ꓺAnyFn = $ꓺAnyFn> = (...args: Parameters<Type>) => ReturnType<Type>;
type $AsyncFunction<Type extends $ꓺAnyAsyncFn = $ꓺAnyAsyncFn> = (...args: Parameters<Type>) => ReturnType<Type>;
type $AnyVoidFunction<Type extends $ꓺAnyVoidFn = $ꓺAnyVoidFn> = (...args: Parameters<Type>) => ReturnType<Type>;

/**
 * Private internal types.
 */
type $ꓺAnyFn = (...args: any[]) => unknown;
type $ꓺAnyAsyncFn = (...args: any[]) => Promise<unknown>;
type $ꓺAnyVoidFn = ((...args: any[]) => void) | ((...args: any[]) => Promise<void>);
type $ꓺAnyObjectC9r = ObjectConstructor | { new (...args: any[]): unknown };

type $ꓺHasMultipleCallSignatures<Type extends $ꓺAnyFn> = Type extends {
    (...args: infer Args): unknown;
    (...args: any[]): unknown;
}
    ? unknown[] extends Args
        ? false
        : true
    : //
      false;

// ---
// Type utilities.

/**
 * Ensures a specific value type.
 *
 * This can be used by methods that query arbitrary data and need to make a contract with the caller regarding what data
 * type the caller expects to receive. The currently ensurable types are limited, but should satisfy basic needs.
 *
 * WARNING: Please note the inherent danger of using this approach. Arbitrary data is just that, arbitrary. In order for
 * this to work without throwing errors, the caller needs to know something about the expected data, and those
 * assumptions should be very good ones; i.e, 100% accurate, ideally, or problems may occur.
 *
 * Having given fair warning, the safest conversions are into: `boolean`, `string`, `array`, or `object` types, as these
 * won’t throw errors. Anything can be converted into these types. Please review the list of URLs below to learn more.
 *
 * When converting to `string` {@see $to.string()} is used, such that `null`, `undefined` get converted into an empty
 * string instead of into `'null'`, `'undefined'`. It does not, however, handle `true` or `false`. Thus, if booleans are
 * converted into a string the conversion will occur as per usual in JavaScript; e.g., `'true'`, `'false'`.
 *
 * Casting as a `number` is also relatively safe, but will throw if attempting to convert from a `bigint` or `symbol`
 * into a `number`. Additionally, converting to a `number` can result in `NaN` values, depending on the input value.
 *
 * When converting to `object`, please remember that everything is technically an object, and that any existing object
 * value will simply go unchanged, as it is already an object. Thus, if you attempt to convert an array or function, for
 * example, you will get back the array or function. Instead, use pseudo-types `plainObject`, or `plainObjectDeep`. That
 * said, if you do use `object`, beware of primitive wrappers that result from a primitive converting into an object.
 *
 * Only `boolean`, `number`, `bigint`, `string` convert to bigints. Even then, conversion may throw if unable to coerce
 * into a bigint data type internally. Please make sure you’re only converting numeric values into bigints.
 *
 * - Boolean coercion: {@see https://o5p.me/1syPaw}
 * - Number coercion : {@see https://o5p.me/uxpBzD}
 * - BigInt coercion : {@see https://o5p.me/ZEnvvn}
 * - String coercion : {@see https://o5p.me/gWFae2}
 * - Object coercion : {@see https://o5p.me/0m9DCR}
 *
 * @param   value Value to ensure.
 * @param   type  {@see EnsurableType}.
 *
 * @returns       Value; in the ensured type.
 */
export const ensure = <Type extends EnsurableType>(value: unknown, type: Type): EnsuredType<Type> => {
    switch (type) {
        case 'boolean': {
            return Boolean(value) as EnsuredType<Type>;
        }
        case 'boolean[]': {
            return $to.array(value).map(Boolean) as EnsuredType<Type>;
        }

        case 'number': {
            return Number(value) as EnsuredType<Type>;
        }
        case 'number[]': {
            return $to.array(value).map(Number) as EnsuredType<Type>;
        }

        case 'bigint': {
            // @ts-ignore -- BigInt may throw; ok.
            return BigInt(value) as EnsuredType<Type>;
        }
        case 'bigint[]': {
            // @ts-ignore -- BigInt may throw; ok.
            return $to.array(value).map(BigInt) as EnsuredType<Type>;
        }

        case 'string': {
            return $to.string(value) as EnsuredType<Type>;
        }
        case 'string[]': {
            return $to.array(value).map($to.string) as EnsuredType<Type>;
        }

        case 'object': {
            return Object(value) as EnsuredType<Type>;
        }
        case 'object[]': {
            return $to.array(value).map(Object) as EnsuredType<Type>;
        }

        case 'plainObject': {
            return $to.plainObject(value) as EnsuredType<Type>;
        }
        case 'plainObject[]': {
            return $to.array(value).map((v) => $to.plainObject(v)) as EnsuredType<Type>;
        }

        case 'plainObjectDeep': {
            return $to.plainObjectDeep(value) as EnsuredType<Type>;
        }
        case 'plainObjectDeep[]': {
            return $to.array(value).map((v) => $to.plainObjectDeep(v)) as EnsuredType<Type>;
        }

        case 'unknown': {
            return value as EnsuredType<Type>; // Explicitly.
        }
        default: {
            throw Error('Y8PGpTWn'); // Unknown type: `' + type + '`.
        }
    }
};
