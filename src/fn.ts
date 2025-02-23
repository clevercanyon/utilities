/**
 * Function utilities.
 */

import '#@initialize.ts';

import * as $standalone from '#@standalone/index.ts';
import { type $fnꓺMemoOptions, type $fnꓺMemoizedFunction } from '#@standalone/index.ts';
import { $is, $obj, type $type } from '#index.ts';

/**
 * Defines types.
 */
export type { $fnꓺMemoOptions as MemoOptions, $fnꓺMemoizedFunction as MemoizedFunction };

export type TryFunction<Fn extends $type.Function, CatchReturns> = Fn extends $type.AsyncFunction
    ? (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>> | CatchReturns>
    : (...args: Parameters<Fn>) => ReturnType<Fn> | CatchReturns;

export type CurriedFunction<Fn extends $type.Function, Provided extends unknown[]> =
    // If there is at least one required parameter remaining, return new curried function; else invocation return value.
    <Remaining extends $type.PartialParameters<$type.RemainingParameters<Provided, Parameters<Fn>>>>(...args: Remaining) => CurriedReturn<Fn, [...Provided, ...Remaining]>;

export type CurriedReturn<Fn extends $type.Function, Provided extends unknown[]> = //
    // If there is at least one required parameter remaining.
    $type.RemainingParameters<Provided, Parameters<Fn>> extends [unknown, ...unknown[]]
        ? // Then return a new curried function.
          CurriedFunction<Fn, Provided>
        : // Else, invocation return value.
          ReturnType<Fn>;

export type TryOptions = { throwOnError?: boolean };

type ThrottleDebounceCommonOptions = { edge?: 'leading' | 'trailing'; waitTime?: number };
export type ThrottleOptions = ThrottleDebounceCommonOptions & { _debounceMode?: boolean };
export type DebounceOptions = ThrottleDebounceCommonOptions; // Nothing more at this time.

export type ThrottledFunction<Fn extends $type.Function> = {
    (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): Promise<ReturnType<Fn>>;
    flush: () => void;
    cancel: (rtnValue?: unknown) => void;
};
export type OnceFunction<Fn extends $type.Function> = $fnꓺMemoizedFunction<Fn>;

/**
 * No-op function.
 *
 * @see {$standalone.$fnꓺnoOp} for details.
 */
export const noOp = $standalone.$fnꓺnoOp; // From standalone library.

/**
 * Memoizes a function’s response.
 *
 * This has to be clearly marked as not having side-effects, because we often use it to produce exports. If those
 * exports are not used, we don’t want memoization of those exports to cause them not to be tree-shaken.
 *
 * If you’re calling this from outside of `clevercanyon/utilities`, please ignore the following warning.
 *
 * - **WARNING**: Please do _not_ use this particular copy when writing code _within_ the `clevercanyon/utilities` package
 *   itself. Instead, use the standalone source of this utility in order to avoid problems with circular dependencies.
 *
 * @param   args Variadic args; {@see $standalone.$fnꓺmemo} for details.
 *
 * @returns      Memoized function; {@see MemoizedFunction}.
 */
/*@__NO_SIDE_EFFECTS__*/
export const memo = $standalone.$fnꓺmemo; // From standalone library.

/**
 * Creates a function that can fire multiple times, but only run once.
 *
 * This has to be clearly marked as not having side-effects, because we often use it to produce exports. If those
 * exports are not used, we don’t want memoization of those exports to cause them not to be tree-shaken.
 *
 * If you’re calling this from outside of `clevercanyon/utilities`, please ignore the following warning.
 *
 * - **WARNING**: Please do _not_ use this particular copy when writing code _within_ the `clevercanyon/utilities` package
 *   itself. Instead, use the standalone source of this utility in order to avoid problems with circular dependencies.
 *
 * @param   fn Sync or async function to memoize; i.e., run once; {@see $standalone.$fnꓺonce} for details.
 *
 * @returns    Memoized sync or async function that runs once; {@see MemoizedFunction}.
 */
/*@__NO_SIDE_EFFECTS__*/
export const once = $standalone.$fnꓺonce;

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
function tryFn<Fn extends $type.Function>(fn: Fn): TryFunction<Fn, Error>;
function tryFn<Fn extends $type.Function, CatchReturn>(fn: Fn, catchReturn: CatchReturn, options?: TryOptions): TryFunction<Fn, CatchReturn>;

function tryFn<Fn extends $type.Function, CatchReturn>(fn: Fn, catchReturn?: CatchReturn, options?: TryOptions): TryFunction<Fn, CatchReturn | Error> {
    const useCatchReturn = arguments.length >= 2; // Use `catchReturn` value as default?
    const opts = $obj.defaults({}, options || {}, { throwOnError: false }) as Required<TryOptions>;

    if ($is.asyncFunction(fn)) {
        return async function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
            try {
                return await fn.apply(this, args);
            } catch (thrown) {
                if (opts.throwOnError) throw thrown;
                if (useCatchReturn) return catchReturn;
                return $is.error(thrown) ? thrown : Error('T5TGFUSp');
            }
        } as TryFunction<Fn, CatchReturn | Error>;
    } else {
        return function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>) {
            try {
                return fn.apply(this, args);
            } catch (thrown) {
                if (opts.throwOnError) throw thrown;
                if (useCatchReturn) return catchReturn;
                return $is.error(thrown) ? thrown : Error('eKnHRRWW');
            }
        } as TryFunction<Fn, CatchReturn | Error>;
    }
}
export { tryFn as try }; // Must export as alias.

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
export const curry = <Fn extends $type.Function, Args extends $type.PartialParametersOf<Fn>>(fn: Fn, ...startingArgs: Args): CurriedFunction<Fn, Args> => {
    return function (this: ThisParameterType<Fn>, ...partialArgs) {
        const args = [...startingArgs, ...partialArgs] as unknown as $type.PartialParametersOf<Fn>;

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
 * - Throttling limits the execution of code to once every `waitTime`.
 * - Debouncing delays the execution of code until a caller stops calling for `waitTime`.
 *
 * @param   fn      Sync or async function to throttle.
 * @param   options Options (all optional); {@see ThrottleOptions}.
 *
 *   - Default is: `{ edge: 'trailing', waitTime: 250 }`.
 *   - `_debounceMode` is for internal use only. Do not pass. Instead, {@see debounce()}.
 *
 * @returns         Throttled sync or async function.
 */
export const throttle = <Fn extends $type.Function>(fn: Fn, options?: ThrottleOptions): ThrottledFunction<Fn> => {
    const defaultOpts = { edge: 'trailing', waitTime: 250, _debounceMode: false },
        opts = $obj.defaults({}, options || {}, defaultOpts) as Required<ThrottleOptions>;

    const rtnFn = async function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): Promise<ReturnType<Fn>> {
        rtnFn.$latestArgs = args;

        if (rtnFn.$promiseLock) {
            if (opts._debounceMode) {
                rtnFn.$lastDebounceTime = Date.now();
            }
            return rtnFn.$promiseLock;
        }
        rtnFn.$promiseLock = new Promise<ReturnType<Fn>>((resolve, reject) => {
            rtnFn.$promiseResolve = resolve;
            rtnFn.$promiseReject = reject;

            if ('leading' === opts.edge && rtnFn.$promiseResolve) {
                const fnRtn = fn.apply(this, rtnFn.$latestArgs) as ReturnType<Fn>;
                rtnFn.$promiseResolve(fnRtn); // Resolves at leading edge.
            }
            const afterWaitTimeout = (): void => {
                if (opts._debounceMode && rtnFn.$lastDebounceTime) {
                    const adjustedWaitTime = Math.max(0, rtnFn.$lastDebounceTime + opts.waitTime - Date.now());
                    rtnFn.$lastDebounceTime = 0; // Zeroes-out last debounce time & awaits potentially a new one.
                    rtnFn.$waitTimeout = setTimeout(afterWaitTimeout, adjustedWaitTime);
                } else {
                    if ('trailing' === opts.edge && rtnFn.$promiseResolve) {
                        const fnRtn = fn.apply(this, rtnFn.$latestArgs) as ReturnType<Fn>;
                        rtnFn.$promiseResolve(fnRtn); // Resolves at trailing edge.
                    }
                    // Promise is now resolved and no longer waiting/blocking, so unlock.
                    rtnFn.$releasePromiseLock(); // Next call will generate a new promise.
                }
            };
            rtnFn.$waitTimeout = setTimeout(afterWaitTimeout, opts.waitTime);

            // We cannot know here what the return value will be in a reject scenario.
            // In a case where `.cancel()` is explicitly called by the throttle implementation,
            // it will be `.cancel()` that sets the rejection return value in the implementation.
        }).catch((fnRtn) => fnRtn as ReturnType<Fn>);

        return rtnFn.$promiseLock;
    };
    // Private utilities.

    rtnFn.$lastDebounceTime = 0 as number;
    rtnFn.$latestArgs = [] as unknown as Parameters<Fn>;
    rtnFn.$waitTimeout = undefined as $type.Timeout | undefined;

    rtnFn.$promiseLock = undefined as Promise<ReturnType<Fn>> | undefined;
    rtnFn.$promiseResolve = undefined as ((value: ReturnType<Fn>) => void) | undefined;
    rtnFn.$promiseReject = undefined as ((value: unknown) => void) | undefined;

    rtnFn.$releasePromiseLock = function (): void {
        delete rtnFn.$promiseLock;
        delete rtnFn.$promiseResolve;
        delete rtnFn.$promiseReject;
    };
    // Public utility methods.

    rtnFn.flush = function (): void {
        if (rtnFn.$promiseLock) {
            clearTimeout(rtnFn.$waitTimeout);

            if ('trailing' === opts.edge && rtnFn.$promiseResolve) {
                const fnRtn = fn.apply(this, rtnFn.$latestArgs) as ReturnType<Fn>;
                rtnFn.$promiseResolve(fnRtn);
            }
            rtnFn.$releasePromiseLock();
        }
    };
    rtnFn.cancel = function (fnRtn?: unknown): void {
        if (rtnFn.$promiseLock) {
            clearTimeout(rtnFn.$waitTimeout);

            if ('trailing' === opts.edge && rtnFn.$promiseReject) {
                rtnFn.$promiseReject(fnRtn);
            }
            rtnFn.$releasePromiseLock();
        }
    };
    return rtnFn;
};

/**
 * Debounces a sync or async function.
 *
 * - Throttling limits the execution of code to once every `waitTime`.
 * - Debouncing delays the execution of code until a caller stops calling for `waitTime`.
 *
 * @param   fn      Sync or async function to debounce.
 * @param   options Options (all optional); {@see DebounceOptions}.
 *
 *   - Default is: `{ edge: 'trailing', waitTime: 250 }`.
 *
 * @returns         Debounced sync or async function.
 */
export const debounce = <Fn extends $type.Function>(fn: Fn, options?: DebounceOptions): ThrottledFunction<Fn> => {
    return throttle(fn, { ...(options || {}), _debounceMode: true });
};
