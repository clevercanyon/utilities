/**
 * Function utilities.
 */

import './resources/init.ts';

import { $is, $obj, type $type } from './index.ts';
import * as $standalone from './resources/standalone/index.ts';
import { type $fnꓺMemoOptions, type $fnꓺMemoizedFunction } from './resources/standalone/index.ts';

/**
 * Defines types.
 */
export type { $fnꓺMemoOptions as MemoOptions, $fnꓺMemoizedFunction as MemoizedFunction };

export type TryFunction<Fn extends $type.Function, CatchReturns> = Fn extends $type.AsyncFunction
    ? (...args: Parameters<Fn>) => Promise<Awaited<ReturnType<Fn>> | CatchReturns>
    : (...args: Parameters<Fn>) => ReturnType<Fn> | CatchReturns;

export type CurriedFunction<Fn extends $type.Function, Provided extends unknown[]> =
    // If there is at least one required parameter remaining, return new curried function; else invocation return value.
    <Remaining extends $type.PartialTuple<$type.RemainingParameters<Provided, Parameters<Fn>>>>(...args: Remaining) => CurriedReturn<Fn, [...Provided, ...Remaining]>;

export type CurriedReturn<Fn extends $type.Function, Provided extends unknown[]> = //
    // If there is at least one required parameter remaining.
    $type.RemainingParameters<Provided, Parameters<Fn>> extends [unknown, ...unknown[]]
        ? // Then return a new curried function.
          CurriedFunction<Fn, Provided>
        : // Else, invocation return value.
          ReturnType<Fn>;

export type TryOptions = { throwOnError?: boolean };
export type ThrottleOptions = ThrottleDebounceCommonOptions & { _debounceMode?: boolean };
export type DebounceOptions = ThrottleDebounceCommonOptions; // Nothing more to add at this time.
type ThrottleDebounceCommonOptions = { leadingEdge?: boolean; waitTime?: number; trailingEdge?: boolean };

export type ThrottledFunction<Fn extends $type.Function> = {
    (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): Promise<ReturnType<Fn>>;
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
 * This has to be clearly marked as not having side-effects, because we often use it to produce exports. If those
 * exports are not used, we don’t want memoization of those exports to cause them not to be tree-shaken.
 *
 * If you’re calling this from outside of `clevercanyon/utilities`, please ignore the following warning.
 *
 * - **WARNING**: Please do _not_ use this particular copy from within the `clevercanyon/utilities` package. Instead, use
 *   the standalone source of this utility in order to avoid problems with circular dependencies.
 *
 * @param   args Variadic args; {@see $standalone.$fnꓺmemo} for details.
 *
 * @returns      Memoized function. {@see MemoizedFunction}.
 */
/*@__NO_SIDE_EFFECTS__*/
export const memo = $standalone.$fnꓺmemo; // From standalone library.

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
function tryFn<Fn extends $type.Function>(fn: Fn): TryFunction<Fn, $type.Error>;
function tryFn<Fn extends $type.Function, CatchReturn>(fn: Fn, catchReturn: CatchReturn, options?: TryOptions): TryFunction<Fn, CatchReturn>;

function tryFn<Fn extends $type.Function, CatchReturn>(fn: Fn, catchReturn?: CatchReturn, options?: TryOptions): TryFunction<Fn, CatchReturn | $type.Error> {
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
 *   - Default is: `{ leadingEdge: true, waitTime: 250, trailingEdge: true }`
 *   - `_debounceMode` is for internal use only. Do not pass. Instead, {@see debounce()}.
 *
 * @returns         Throttled sync or async function.
 */
export const throttle = <Fn extends $type.Function>(fn: Fn, options?: ThrottleOptions): ThrottledFunction<Fn> => {
    const defaultOpts = { leadingEdge: true, waitTime: 250, trailingEdge: true, _debounceMode: false };
    const opts = $obj.defaults({}, options || {}, defaultOpts) as Required<ThrottleOptions>;

    const rtnFn = async function (this: ThisParameterType<Fn>, ...args: Parameters<Fn>): Promise<ReturnType<Fn>> {
        return new Promise<ReturnType<Fn>>((resolve, reject) => {
            rtnFn.$latestArgs = args;
            rtnFn.$promises.push({ resolve, reject });

            if (!rtnFn.$waitTimeout) rtnFn.$onLeadingEdge();
            if (opts._debounceMode || !rtnFn.$waitTimeout) {
                rtnFn.$clearTimeout();
                rtnFn.$waitTimeout = setTimeout(rtnFn.$onTrailingEdge, opts.waitTime);
            }
            // We cannot know here what the return value will be in a reject scenario.
            // In a case where `.cancel()` is explicitly called by the throttle implementation,
            // it will be `.cancel()` that sets the rejection return value in the implementation.
        }).catch((fnRejectRtn) => fnRejectRtn as ReturnType<Fn>);
    };
    rtnFn.$promises = [] as {
        resolve: (fnRtn: ReturnType<Fn>) => void;
        reject: (fnRejectRtn?: unknown) => void;
    }[]; // Call stack.

    rtnFn.$waitTimeout = 0 as $type.Timeout | undefined;
    rtnFn.$latestArgs = [] as unknown as Parameters<Fn>;

    rtnFn.$clearTimeout = function (): void {
        clearTimeout(rtnFn.$waitTimeout), (rtnFn.$waitTimeout = 0);
    };
    rtnFn.$onLeadingEdge = function (): void {
        if (opts.leadingEdge) rtnFn.$resolvePromises();
    };
    rtnFn.$onTrailingEdge = function (): void {
        if (opts.trailingEdge && rtnFn.$resolvePromises() && opts.leadingEdge) {
            rtnFn.$clearTimeout(); // Delays next potential leading edge.
            rtnFn.$waitTimeout = setTimeout(() => rtnFn.$clearTimeout(), opts.waitTime);
        }
    };
    rtnFn.$resolvePromises = function (): number {
        if (!rtnFn.$promises.length) return 0;

        const copyOfPromises = [...rtnFn.$promises];
        rtnFn.$promises = []; // Resets promises.

        const fnRtn = fn.apply(this, rtnFn.$latestArgs) as ReturnType<Fn>;
        copyOfPromises.forEach(({ resolve }) => resolve(fnRtn));

        return copyOfPromises.length;
    };
    rtnFn.$rejectPromises = function (fnRejectRtn?: unknown): void {
        if (!rtnFn.$promises.length) return;

        const copyOfPromises = [...rtnFn.$promises];
        rtnFn.$promises = []; // Resets promises.

        // Rejections caught via `.catch()` above.
        copyOfPromises.forEach(({ reject }) => reject(fnRejectRtn));
    };
    rtnFn.flush = function (): void {
        rtnFn.$resolvePromises(), rtnFn.$clearTimeout();
    };
    rtnFn.cancel = function (fnRejectRtn?: unknown): void {
        rtnFn.$rejectPromises(fnRejectRtn), rtnFn.$clearTimeout();
    };
    return rtnFn as ThrottledFunction<Fn>;
};

/**
 * Debounces a sync or async function.
 *
 * @param   fn      Sync or async function to debounce.
 * @param   options Options (all optional); {@see DebounceOptions}.
 *
 *   - Default is: `{ leadingEdge: true, waitTime: 250, trailingEdge: true }`
 *
 * @returns         Debounced sync or async function.
 */
export const debounce = <Fn extends $type.Function>(fn: Fn, options?: DebounceOptions): ThrottledFunction<Fn> => {
    return throttle(fn, { ...(options || {}), _debounceMode: true });
};
