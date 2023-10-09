/**
 * Function utilities.
 */

import './resources/init.ts';

import { $is, $obj, type $type } from './index.ts';
import * as $standalone from './resources/standalone/index.ts';
import { type $fnꓺMemoizeOptions, type $fnꓺMemoizedFunction } from './resources/standalone/index.ts';

/**
 * Defines types.
 */
export type { $fnꓺMemoizeOptions as MemoizeOptions, $fnꓺMemoizedFunction as MemoizedFunction };

export type TryFunction<__Fn extends $type.Function, __CatchReturns> = __Fn extends $type.AsyncFunction
    ? (...args: Parameters<__Fn>) => Promise<Awaited<ReturnType<__Fn>> | __CatchReturns>
    : (...args: Parameters<__Fn>) => ReturnType<__Fn> | __CatchReturns;

export type CurriedFunction<__Fn extends $type.Function, __Provided extends unknown[]> =
    // If there is at least one required parameter remaining, return new curried function; else invocation return value.
    <__Remaining extends $type.PartialTuple<$type.RemainingParameters<__Provided, Parameters<__Fn>>>>(...args: __Remaining) => CurriedReturn<__Fn, [...__Provided, ...__Remaining]>;

export type CurriedReturn<__Fn extends $type.Function, __Provided extends unknown[]> = //
    // If there is at least one required parameter remaining.
    $type.RemainingParameters<__Provided, Parameters<__Fn>> extends [unknown, ...unknown[]]
        ? // Then return a new curried function.
          CurriedFunction<__Fn, __Provided>
        : // Else, invocation return value.
          ReturnType<__Fn>;

export type TryOptions = { throwOnError?: boolean };
export type ThrottleOptions = ThrottleDebounceCommonOptions & { debounceMode?: boolean };
export type DebounceOptions = ThrottleDebounceCommonOptions; // Nothing more to add at this time.
type ThrottleDebounceCommonOptions = { leadingEdge?: boolean; waitTime?: number; trailingEdge?: boolean };

export type ThrottledFunction<__Fn extends $type.Function> = {
    (this: ThisParameterType<__Fn>, ...args: Parameters<__Fn>): Promise<ReturnType<__Fn>>;
    $onLeadingEdge: () => void;
    $onTrailingEdge: () => void;
    flush: () => void;
    cancel: (reason?: unknown) => void;
};

/**
 * No-op function.
 *
 * @see {$standalone.$fnꓺnoOp} for details.
 */
export const noOp = $standalone.$fnꓺnoOp; // From standalone library.

/**
 * Memoizes a function’s response.
 *
 * If you’re calling this from outside of `clevercanyon/utilities`, please ignore the following warning.
 *
 * - **WARNING**: Please do _not_ use this particular copy from within the `clevercanyon/utilities` package. Instead, use
 *   the standalone source of this utility in order to avoid problems with circular dependencies.
 *
 * @param   ...args {@see $standalone.$fnꓺmemoize} for details.
 *
 * @returns         Memoized function. {@see $standalone.$fnꓺmemoize} for details.
 *
 * @see https://www.npmjs.com/package/micro-memoize
 */
export const memoize = $standalone.$fnꓺmemoize; // From standalone library.

/**
 * Tries to invoke a sync or async function.
 *
 * @param   fn          Sync or async function to invoke.
 * @param   catchReturn Optional default return value on error.
 * @param   options     Default is `{ throwOnError: false }`.
 *
 *   - It only makes sense to set `{ throwOnError: true }` whenever there’s a `catchReturn` value. Otherwise, there is no
 *       point in using this utility to begin with; i.e., if you’re going to throw an error, there’s no need to ‘try’.
 *
 * @returns             Invocation return value, else `catchReturn` value (if passed), else {@see Error}.
 */
function _try<Fn extends $type.Function>(fn: Fn): TryFunction<Fn, $type.Error>;
function _try<Fn extends $type.Function, CatchReturn>(fn: Fn, catchReturn: CatchReturn, options?: TryOptions): TryFunction<Fn, CatchReturn>;

function _try<Fn extends $type.Function, CatchReturn>(fn: Fn, catchReturn?: CatchReturn, options?: TryOptions): TryFunction<Fn, CatchReturn | $type.Error> {
    const useCatchReturn = arguments.length >= 2; // Use `catchReturn` value as default?
    const opts = $obj.defaults({}, options || {}, { throwOnError: false }) as Required<TryOptions>;

    if ($is.asyncFunction(fn)) {
        return async function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
            try {
                return await fn.apply(this, args);
            } catch (thrown) {
                if (opts.throwOnError) throw thrown;
                if (useCatchReturn) return catchReturn;
                return $is.error(thrown) ? thrown : new Error($obj.tag(thrown));
            }
        } as TryFunction<Fn, CatchReturn | $type.Error>;
    } else {
        return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
            try {
                return fn.apply(this, args);
            } catch (thrown) {
                if (opts.throwOnError) throw thrown;
                if (useCatchReturn) return catchReturn;
                return $is.error(thrown) ? thrown : new Error($obj.tag(thrown));
            }
        } as TryFunction<Fn, CatchReturn | $type.Error>;
    }
}
export { _try as try }; // Must export as alias.

/**
 * Curries a sync or async function.
 *
 * @param   fn              Sync or async function to curry.
 * @param   ...startingArgs Optional starting arguments to function.
 *
 * @returns                 Curried sync or async function.
 *
 * @note See: <https://o5p.me/ECOsaJ>, which inspired this utility.
 */
export const curry = <Fn extends $type.Function, Args extends $type.PartialParameters<Fn>>(fn: Fn, ...startingArgs: Args): CurriedFunction<Fn, Args> => {
    return function (this: ThisParameterType<Fn>, ...partialArgs) {
        const args = [...startingArgs, ...partialArgs] as $type.PartialParameters<Fn>;

        if (args.length >= fn.length) {
            return fn.apply(this, args); // Potentially a promise.
        } else {
            return curry(fn, ...args);
        }
    } as CurriedFunction<Fn, Args>;
};

/**
 * Throttles a sync or async function.
 *
 * @param   fn      Sync or async function to throttle.
 * @param   options Options (all optional); {@see ThrottleOptions}.
 *
 *   - Default is: `{ leadingEdge: true, waitTime: 750, trailingEdge: true }`
 *   - The `debounceMode` option is for internal use only. Do not pass. Instead, {@see debounce()}.
 *
 * @returns         Throttled sync or async function.
 */
export const throttle = <Fn extends $type.Function>(fn: Fn, options?: ThrottleOptions): ThrottledFunction<Fn> => {
    const opts = $obj.defaults({}, options || {}, { leadingEdge: true, waitTime: 750, trailingEdge: true, debounceMode: false }) as Required<ThrottleOptions>;

    let promises: {
        resolve: (fnRtn: ReturnType<Fn>) => void;
        reject: (reason?: unknown) => void;
    }[] = []; // Call stack.

    let latestArgs: Parameters<Fn> | undefined = undefined;
    let waitTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

    const rtnFn = function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): Promise<ReturnType<Fn>> {
        return new Promise<ReturnType<Fn>>((resolve, reject) => {
            (latestArgs = args), promises.push({ resolve, reject });

            if (undefined === waitTimeout) rtnFn.$onLeadingEdge();

            if (opts.debounceMode && undefined !== waitTimeout) {
                clearTimeout(waitTimeout); // Resets debounce timer.
            }
            if (opts.debounceMode || undefined === waitTimeout) {
                waitTimeout = setTimeout(rtnFn.$onTrailingEdge, opts.waitTime);
            }
        });
    };
    rtnFn.$onLeadingEdge = function (): void {
        if (opts.leadingEdge && latestArgs && promises.length) {
            const fnRtn = fn.apply(this, latestArgs) as ReturnType<Fn>;
            promises.forEach(({ resolve }) => resolve(fnRtn)), (promises = []);
        }
    };
    rtnFn.$onTrailingEdge = function (): void {
        if (opts.trailingEdge && latestArgs && promises.length && (!opts.leadingEdge || promises.length >= 2)) {
            const fnRtn = fn.apply(this, latestArgs) as ReturnType<Fn>;
            promises.forEach(({ resolve }) => resolve(fnRtn)), (promises = []);

            if (opts.leadingEdge /* Time between trailing edge and next leading edge. */) {
                waitTimeout = setTimeout(() => (waitTimeout = undefined), opts.waitTime);
                //
            } else waitTimeout = undefined; // Clears the way for a new leading edge.
        } else waitTimeout = undefined; // Clears the way for a new leading edge.
    };
    rtnFn.flush = function (): void {
        if (latestArgs && promises.length) {
            const fnRtn = fn.apply(this, latestArgs) as ReturnType<Fn>;
            promises.forEach(({ resolve }) => resolve(fnRtn)), (promises = []);
        }
        if (undefined !== waitTimeout) clearTimeout(waitTimeout), (waitTimeout = undefined);
    };
    rtnFn.cancel = function (reason?: unknown): void {
        promises.forEach(({ reject }) => reject(reason)), (promises = []);
        if (undefined !== waitTimeout) clearTimeout(waitTimeout), (waitTimeout = undefined);
    };
    return rtnFn as ThrottledFunction<Fn>;
};

/**
 * Debounces a sync or async function.
 *
 * @param   fn      Sync or async function to debounce.
 * @param   options Options (all optional); {@see DebounceOptions}.
 *
 *   - Default is: `{ leadingEdge: true, waitTime: 750, trailingEdge: true }`
 *
 * @returns         Debounced sync or async function.
 */
export const debounce = <Fn extends $type.Function>(fn: Fn, options?: DebounceOptions): ThrottledFunction<Fn> => {
    return throttle(fn, { ...(options || {}), debounceMode: true });
};
