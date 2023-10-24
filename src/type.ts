/**
 * Types.
 */
// organize-imports-ignore

import './resources/init.ts';

import { $to } from './index.ts';
import { type DateTime as luxonꓺDateTime } from 'luxon';
import type * as cf from '@cloudflare/workers-types/experimental';

/**
 * Common types.
 */
export type ObjectKey = PropertyKey;
export type ObjectPath = number | string;

export type { $Object as Object };
export type { $Function as Function };
export type { $AsyncFunction as AsyncFunction };

export type TypedArray<Type extends $TypedArray = $TypedArray> = Type;
export type Primitive = null | undefined | boolean | number | bigint | string | symbol;
export type ObjectEntries<Type extends object = $Object> = [keyof Type, Type[keyof Type]][];
export type ObjectC9r = { new (...args: unknown[]): $Object } | ObjectConstructor;

export type { $URL as URL };
export type { $Request as Request };
export type { $Response as Response };
export type { $BodyInit as BodyInit };
export type { $Headers as Headers };
export type { $fetch as fetch };
export type { $Error as Error };

export type { luxonꓺDateTime as Time };
export type * from './class.ts';

export type { cf }; // Cloudflare worker type exports.

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
    : Type extends 'plainObject' ? $Object
    : Type extends 'plainObject[]' ? $Object[]
    //
    : Type extends 'plainObjectDeep' ? $Object
    : Type extends 'plainObjectDeep[]' ? $Object[]
    //
    : unknown; // prettier-ignore

/**
 * Utility types.
 */

export type Writable<Type> = { -readonly [Prop in keyof Type]: Type[Prop] };
export type DeepWritable<Type> = { -readonly [Prop in keyof Type]: DeepWritable<Type[Prop]> };

export type PartialTuple<Tuple extends unknown[], Extracted extends unknown[] = []> = //
    // If the tuple provided contains at least one required value.
    Tuple extends [infer Next, ...infer Remaining]
        ? // Recurse with remaining + first being partial (i.e., optional) now.
          PartialTuple<Remaining, [...Extracted, Next?]>
        : // Else, return with an empty tuple.
          [...Extracted, /* empty */ ...Tuple];

export type PartialParameters<Type extends $Function> = PartialTuple<Parameters<Type>>;
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
 * Private types used by this file.
 */

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

type $URL = URL | cf.URL;
type $Request = Request | cf.Request;
type $Response = Response | cf.Response;
type $BodyInit = BodyInit | cf.BodyInit;
type $Headers = Headers | cf.Headers;
type $fetch = typeof fetch | typeof cf.fetch;
type $Error<Type extends Error = Error> = Type;

type $Keyable = { [x: ObjectKey]: unknown };
type $Object<Type extends object = $Keyable> = $Keyable & Type;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $AnyFn = (...args: any[]) => unknown; // See: <https://o5p.me/CwHQYM>.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type $AsyncFn = (...args: any[]) => Promise<unknown>; // See: <https://o5p.me/CwHQYM>.

type $Function<Type extends $AnyFn = $AnyFn> = (...args: Parameters<Type>) => ReturnType<Type>;
type $AsyncFunction<Type extends $AsyncFn = $AsyncFn> = (...args: Parameters<Type>) => ReturnType<Type>;

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
 * When converting to `string`, beware of the potential for a resulting string literal value; e.g., `null`, `undefined`,
 * `true`, `false`. These can pop up in crazy places if you aren’t careful about what data types you coerce.
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
            return String(value) as EnsuredType<Type>;
        }
        case 'string[]': {
            return $to.array(value).map(String) as EnsuredType<Type>;
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
            throw new Error('Unknown type: `' + type + '`.');
        }
    }
};
