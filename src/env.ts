/**
 * Environment utilities.
 */

import '#@initialize.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $app, $cookie, $fn, $is, $obj, $obp, $str, $to, $type, $url } from '#index.ts';

let topLevelObp: string = '',
    topLevelObpSet: boolean = false,
    varsInitialized: boolean = false;

const vars: { [x: string]: unknown } = {};

export type CaptureOptions = { overrideExisting: boolean };

export type GetOptions = { type?: $type.EnsurableType; require?: boolean; default?: unknown };
export type GetOptionsWithType = GetOptions & { type: $type.EnsurableType };

export type QVTests = { [x: string]: null | undefined | boolean | RegExp | RegExp[] };
export type TestOptions = { alsoTryCookie?: boolean };

/**
 * Checks if an object path is top-level.
 *
 * @param   obp Object path to check.
 *
 * @returns     True if object path is top-level.
 */
const isTopLevelObp = (obp: string): boolean => {
    return !obp.includes('.') || /^@top\./u.test(obp);
};

/**
 * Globalizes a top-level object path.
 *
 * @param   obp Object path to consider.
 *
 * @returns     A potentially globalized top-level object path.
 */
const globalTopLevelObp = (obp: string): string => {
    if (!obp.includes('.')) {
        return '@global.' + obp;
    }
    return obp.replace(/^@top\./u, '@global.');
};

/**
 * Resolves a top-level object path.
 *
 * @param   obp Object path to consider.
 *
 * @returns     A potentially resolved top-level object path.
 */
const resolveTopLevelObp = (obp: string): string => {
    const tlObp = topLevelObp || $str.obpPartSafe($app.$pkgName);

    if (!obp.includes('.')) {
        return tlObp + '.' + obp;
    }
    return obp.replace(/^@top\./u, tlObp + '.');
};

/**
 * Sets top-level object path.
 *
 * Each app’s environment variables are nested into an app-specific object path. The designated top-level object path is
 * the one from which environment variables are read whenever an object path is either given explicitly as top-level
 * (e.g., `@top.ENV_VAR`) or lacks a separator (e.g., `ENV_VAR`), which implies top-level; {@see isTopLevelObp()}.
 *
 * One app, and only one, can be set as the top-level object path for environment variables. Once the top-level object
 * path is set, it cannot be changed at runtime. To clarify further, the first app (i.e., the topmost app in a
 * dependency chain) that sets itself as the top-level object path for environment variables, wins.
 *
 * Utilities, plugins, and other libraries should generally read from top-level environment variables. Conversely, they
 * should generally not be designated as the top-level object path if they might become dependencies for others.
 *
 * An app **must** be the top-level object path whenever it’s the last (i.e., topmost) in a line of dependencies and is
 * being deployed for some purpose that requires the app itself, or any of it’s dependencies, to read from top-level
 * environment variables. For example, a website is a finished piece that will be deployed to a hosting environment as
 * the end product. Thus, it should definintely be set as the top-level object path for environment variables.
 *
 * Utilities, plugins, and other libraries have the choice of reading from the top-level object path, or reading from
 * their own app-specific environment variables. Their choice is made by the formulation of an object path that is
 * passed to one of the utilities in this module. Such as {@see get()}, {@see set()}, {@see unset()}.
 *
 * @param rootObp A root object path to use as the top-level object path.
 *
 *   - Root object path is sanitized using {@see $str.obpPartSafe()}.
 */
export const setTopLevelObp = (rootObp: string): void => {
    if (topLevelObpSet) {
        return; // One app, and only one.
    }
    topLevelObpSet = true;
    topLevelObp = $str.obpPartSafe(rootObp);
};

/**
 * Captures environment variables.
 *
 * Order of capture matters. By default, existing values are not overwritten.
 *
 * @param rootObp A root object path in which to place captured environment variables; e.g., `@top`.
 *
 *   - Root object path is sanitized using {@see $str.obpPartSafe()}.
 *   - //
 * @param env     Environment variables, by object subpath.
 * @param options Options (all optional); {@see CaptureOptions}.
 */
export const capture = (rootObp: string, env: object, options?: CaptureOptions): void => {
    if (!varsInitialized) initializeVars();
    rootObp = $str.obpPartSafe(rootObp);

    const opts = $obj.defaults({}, options || {}, { overrideExisting: false }) as Required<CaptureOptions>,
        captureFn = opts.overrideExisting ? $obp.set : $obp.defaultTo;

    if ('@top' === rootObp && !topLevelObpSet) {
        throw Error('79yZmpRt'); // `@top` used in capture before calling `$env.setTopLevelObp()`.
    }
    for (const [subObp, value] of Object.entries(env)) {
        if (!subObp) continue; // Empty subpath not allowable.
        const obp = [rootObp, subObp].filter((v) => '' !== v).join('.');
        captureFn(vars, resolveTopLevelObp(obp), $is.string(value) ? $str.parseValue(value) : value);
    }
};

/**
 * Initializes environment vars.
 *
 * Variables are initialized on-demand via {@see get()}, {@see set()}, {@see unset()}, {@see capture()}. It is handled
 * on-demand in order to avoid issues with circular references being used in the body of this module.
 */
const initializeVars = (): void => {
    if (varsInitialized) {
        return; // Once only.
    }
    varsInitialized = true; // Initializing now.

    if (isNode() && 'env' in process && $is.object(process.env)) {
        capture('@global', process.env);
    } // Global node process environment variables.

    if (isWeb() && 'env' in window && $is.object(window.env)) {
        capture('@global', window.env); // Non-standard; must be populated by web app.
    } // Global window environment variables.

    // `clevercanyon/utilities` app-specific environment variables compiled by Vite.
    // Note: This is for `clevercanyon/utilities` explicity. Apps must capture their own.
    capture($app.$pkgName, {
        APP_PKG_NAME: $app.$pkgName,
        APP_PKG_VERSION: $$__APP_PKG_VERSION__$$,
        APP_BUILD_TIME_STAMP: $$__APP_BUILD_TIME_STAMP__$$,
        ...import.meta.env,
    });
};

/**
 * Gets an environment variable.
 *
 * @param   leadingObps Optional leading object path(s).
 *
 *   - Can be passed as a string or an array of strings.
 *   - The array order given is the order in which queries are run.
 *   - If not passed, or empty, `obpOrSubObp` is treated as a full object path.
 *   - //
 * @param   subObpOrObp Subpath, or full object path if `leadingObps` are not passed, or empty.
 * @param   options     Options (all optional). {@see GetOptions} for details.
 *
 * @returns             Environment variable value; else default value from options.
 *
 *   - Returns the first query to produce a value that’s not undefined; see `leadingObps`.
 *   - If no value is found, the default value from options is returned, which, by default, is `undefined`.
 */
export function get<Options extends GetOptionsWithType>(leadingObps: string | string[], subObpOrObp: string, options: Options): $type.EnsuredType<Options['type']>;
export function get<Options extends GetOptions>(leadingObps: string | string[], subObpOrObp: string, options?: Options): unknown;

export function get<Options extends GetOptionsWithType>(subObpOrObp: string, options: Options): $type.EnsuredType<Options['type']>;
export function get<Options extends GetOptions>(subObpOrObp: string, options?: Options): unknown;

export function get(...args: unknown[]): unknown {
    if (!varsInitialized) initializeVars();

    // See notes above. Multiple signatures covered here.
    let leadingObps: string | string[], subObpOrObp: string, options: GetOptions | undefined;

    if (1 === args.length || (2 === args.length && $is.object(args[1]))) {
        (leadingObps = ['']), (subObpOrObp = args[0] as string), (options = args[1] as GetOptions | undefined);
    } else (leadingObps = args[0] as string | string[]), (subObpOrObp = args[1] as string), (options = args[2] as GetOptions | undefined);

    let value: unknown; // Initialize value, which is populated below, if possible.
    const opts = $obj.defaults({}, options || {}, { type: undefined, require: false, default: undefined }) as GetOptions,
        queriedObps: string[] = []; // Holds a list of all object paths queried below.

    loop: for (const leadingObp of $to.array(leadingObps)) {
        const obp = [leadingObp, subObpOrObp].filter((v) => '' !== v).join('.'),
            obpVariants = [...new Set([obp, obp.replace(/(^|\.)(APP_)/gu, '$1SSR_$2')])];

        if (isTopLevelObp(obp))
            for (let obp of obpVariants) {
                obp = globalTopLevelObp(obp);
                queriedObps.push(obp);

                value = $obp.get(vars, obp);
                if (undefined !== value) break loop;
            }
        for (let obp of obpVariants) {
            obp = resolveTopLevelObp(obp);
            queriedObps.push(obp);

            value = $obp.get(vars, obp);
            if (undefined !== value) break loop;
        }
    }
    if (undefined === value) value = opts.default;
    if (opts.require && undefined === value)
        throw Error(
            'Missing required env var.\n' + //
                'Queried object paths:\n' +
                queriedObps.join(', '),
        );
    if (opts.type /* Ensurable type. */) {
        return $type.ensure(value, opts.type);
    }
    return value; // Unknown value type.
}

/**
 * Sets an environment variable.
 *
 * @param leadingObp  Optional leading object path.
 * @param subObpOrObp Subpath, or full object path if `leadingObp` is not passed, or empty.
 * @param value       Environment variable value to set in the given object path.
 */
export function set(leadingObp: string, subObpOrObp: string, value: unknown): void;
export function set(subObpOrObp: string, value: unknown): void; // Shorter variant as a convenience.

export function set(...args: unknown[]): void {
    if (!varsInitialized) initializeVars();

    // See notes above. Multiple signatures covered here.
    let leadingObp: string, subObpOrObp: string, value: unknown;

    if (2 === args.length) {
        (leadingObp = ''), (subObpOrObp = args[0] as string), (value = args[1]);
    } else (leadingObp = args[0] as string), (subObpOrObp = args[1] as string), (value = args[2]);

    const obp = [leadingObp, subObpOrObp].filter((v) => '' !== v).join('.');
    $obp.set(vars, resolveTopLevelObp(obp), $is.string(value) ? $str.parseValue(value) : value);
}

/**
 * Unsets an environment variable.
 *
 * @param leadingObp  Optional leading object path.
 * @param subObpOrObp Subpath, or full object path if `leadingObp` is not passed, or empty.
 */
export function unset(leadingObp: string, subObpOrObp: string): void;
export function unset(subObp: string): void; // Shorter variant as a convenience.

export function unset(...args: unknown[]): void {
    if (!varsInitialized) initializeVars();

    // See notes above. Multiple signatures covered here.
    let leadingObp: string, subObpOrObp: string;

    if (1 === args.length) {
        (leadingObp = ''), (subObpOrObp = args[0] as string);
    } else (leadingObp = args[0] as string), (subObpOrObp = args[1] as string);

    const obp = [leadingObp, subObpOrObp].filter((v) => '' !== v).join('.');
    $obp.unset(vars, resolveTopLevelObp(obp));
}

/**
 * Checks if environment is a CI.
 *
 * @returns True or false.
 *
 *   GitHub sets the following environment variables:
 *
 *   - `CI=true` (boolean); {@see https://o5p.me/FGyhju}.
 */
export const isCI = $fnꓺmemo((): boolean => {
    return test('CI'); // Set by GitHub; maybe by others also.
});

/**
 * Checks if environment is a test framework.
 *
 * @returns True or false.
 *
 *   Vitest sets the following environment variables:
 *
 *   - `TEST=true` (boolean).
 *   - `VITEST=true` (boolean).
 */
export const isTest = $fnꓺmemo((): boolean => {
    return test('TEST'); // Set by Vitest; maybe by Jest also.
});

/**
 * Checks if environment is operated by Clever Canyon.
 *
 * @param   tests Optional tests. {@see test()} for details.
 *
 * @returns       True if environment is operated by Clever Canyon.
 *
 *   - If different tests are passed, meaning of return value potentially changes.
 */
export const isC10n = $fnꓺmemo({ maxSize: 6, deep: true }, (tests: QVTests = {}): boolean => {
    return test('APP_IS_C10N', tests);
});

/**
 * Checks if environment is a Vite dev server running an app.
 *
 * @param   tests Optional tests. {@see test()} for details.
 *
 * @returns       True if environment is a Vite dev server running an app.
 *
 *   - If different tests are passed, meaning of return value potentially changes.
 *
 * @note By default, this also returns `true` when running tests; because that’s how Vitest works.
 *       The test files are served by Vite’s dev server; i.e., `serve` is the Vite command internally.
 *       If you’d like to avoid that condition you can simply check `if (!$env.isTest())`.
 */
export const isVite = $fnꓺmemo({ maxSize: 6, deep: true }, (tests: QVTests = { serve: true }): boolean => {
    return test('APP_IS_VITE', tests);
});

/**
 * Checks if environment is in debug mode.
 *
 * While this does support a cookie check, it intentionally does not support a `request` parameter. The passing of a
 * `request` is frequently associated with SSR, and we do not want server-side requests to place an app into debug mode,
 * as doing so may alter server-side caching or state in ways we do not anticipate, and result in corruption or
 * malfunction for normal requests not in debug mode — running in production. If a server-side app needs debug mode,
 * consider deploying to a stage environment with the `APP_DEBUG` environment variable set explicitly.
 *
 * @param   tests Optional tests. {@see test()} for details.
 *
 * @returns       True if environment is in debug mode.
 *
 *   - If different tests are passed, meaning of return value potentially changes.
 */
export const inDebugMode = $fnꓺmemo({ maxSize: 6, deep: true }, (tests: QVTests = {}): boolean => {
    return test('APP_DEBUG', tests, { alsoTryCookie: true });
});

/**
 * Checks if environment is a web browser.
 *
 * @returns True or false.
 */
export const isWeb = $fnꓺmemo((): boolean => {
    return ('Window' in globalThis && $is.function(Window) && globalThis instanceof Window) || isWebViaJSDOM();
});

/**
 * Checks if environment is a web browser via jsdom.
 *
 * @returns True or false.
 */
export const isWebViaJSDOM = $fnꓺmemo((): boolean => {
    return (
        'Window' in globalThis && $is.function(Window) &&
        'Navigator' in globalThis && $is.function(Navigator) &&
        'navigator' in globalThis && navigator instanceof Navigator &&
        navigator.userAgent.includes('jsdom/')
    ); // prettier-ignore
});

/**
 * Checks if environment is a PWA.
 *
 * We don’t memoize this test because a PWA is often just a standalone view, and in Chrome, this can often result in
 * that view simply being brought about by shifting an already-loaded copy of a web page to a standalone view; i.e.,
 * without any reload occurring. In such a case, if we cached this utility, it would return false unless and until a
 * full refresh of the PWA in standalone view ocurrs. Thus, {@see isWeb()} is cached, but {@see isPWA()} cannot be.
 *
 * @returns True or false.
 *
 * @note `window.matchMedia` is not supported by JSDOM.
 */
export const isPWA = (): boolean => {
    return isWeb() && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
};

/**
 * Checks if environment is the server-side for an {@see isWeb()} app.
 *
 * @returns True or false.
 *
 * @note We intentionally do not get specific with the environment checks here,
 *       as this must only be used as an antonym for {@see isWeb()}.
 *       Binary; i.e., either {@see isWeb()} or {@see isSSR()}.
 */
export const isSSR = $fnꓺmemo((): boolean => !isWeb());

/**
 * Checks if environment is node.
 *
 * @returns True or false.
 */
export const isNode = $fnꓺmemo((): boolean => {
    return 'process' in globalThis && $is.object(process) && $is.object(process.versions) && 'node' in process.versions;
});

/**
 * Checks if environment is a Cloudflare worker.
 *
 * @returns True or false.
 */
export const isCFW = $fnꓺmemo((): boolean => {
    return (
        isServiceWorker() && // `ServiceWorkerGlobalScope`.
        'Navigator' in globalThis && $is.function(Navigator) &&
        'navigator' in globalThis && navigator instanceof Navigator &&
        'Cloudflare-Workers' === navigator.userAgent
    ); // prettier-ignore
});

/**
 * Checks if environment is a worker.
 *
 * @returns True or false.
 */
export const isWorker = $fnꓺmemo((): boolean => {
    return 'WorkerGlobalScope' in globalThis && $is.function(WorkerGlobalScope) && globalThis instanceof WorkerGlobalScope;
});

/**
 * Checks if environment is a dedicated worker.
 *
 * @returns True or false.
 */
export const isDedicatedWorker = $fnꓺmemo((): boolean => {
    return 'DedicatedWorkerGlobalScope' in globalThis && $is.function(DedicatedWorkerGlobalScope) && globalThis instanceof DedicatedWorkerGlobalScope;
});

/**
 * Checks if environment is a shared worker.
 *
 * @returns True or false.
 */
export const isSharedWorker = $fnꓺmemo((): boolean => {
    return 'SharedWorkerGlobalScope' in globalThis && $is.function(SharedWorkerGlobalScope) && globalThis instanceof SharedWorkerGlobalScope;
});

/**
 * Checks if environment is a service worker.
 *
 * @returns True or false.
 */
export const isServiceWorker = $fnꓺmemo((): boolean => {
    return 'ServiceWorkerGlobalScope' in globalThis && $is.function(ServiceWorkerGlobalScope) && globalThis instanceof ServiceWorkerGlobalScope;
});

/**
 * Checks if environment is under a local hostname.
 *
 * @param   request Optional HTTP request to check.
 *
 *   - If not passed, only web environments can be tested properly.
 *
 * @returns         True or false.
 */
export const isLocal = $fnꓺmemo(2, (request?: $type.Request): boolean => {
    if (request) {
        const { url } = request; // Request URL.
        return $str.test($url.rootHost(url, { withPort: false }), $url.localHostPatterns());
    }
    return isWeb() && $str.test($url.currentRootHost({ withPort: false }), $url.localHostPatterns());
});

/**
 * Checks if environment is under a local hostname and Vite dev server is running.
 *
 * @param   request Optional HTTP request to check.
 *
 *   - If not passed, only web environments can be tested properly.
 *
 * @returns         True or false.
 */
export const isLocalVite = $fnꓺmemo(2, (request?: $type.Request): boolean => {
    return isLocal(request) && isVite();
});

/**
 * Checks if environment is under a local hostname and Vite dev server is running with HMR/prefresh?
 *
 * @param   request Optional HTTP request to check.
 *
 *   - If not passed, only web environments can be tested properly.
 *
 * @returns         True or false.
 */
export const isLocalVitePrefresh = $fnꓺmemo(2, (request?: $type.Request): boolean => {
    return isLocalVite(request) && '__PREFRESH__' in globalThis;
});

/**
 * Tests an environment variable and optionally its query variables.
 *
 * An environment variable that is defined as a query string can optionally have each of its query string variables
 * tested by this utility; e.g., `APP_DEBUG=consent=1&analytics=1`, `APP_IS_VITE=command=mode`.
 *
 * @param   leadingObps Optional environment variable object path(s).
 * @param   subObpOrObp Subpath, or full object path if `leadingObps` is not passed, or is empty.
 * @param   tests       Optional tests; e.g., `{ [var]: null, [var]: true, [var]: false, [var]: [/regexp/] }`.
 * @param   options     Options (all optional); {@see TestOptions}.
 *
 *   Regarding environment variables:
 *
 *   - To simply test that an environment variable is not empty and not `'0'`, just do not pass any `tests`.
 *
 *   Regarding query variables within the environment variable value. All query variable tests must pass i.e., this uses
 *   AND logic. The use of OR logic can be achieved by passing an array of regular expression patterns — at least one
 *   pattern must match in each of the tests, or by calling this multiple times; e.g., `if (test() || test())`.
 *
 *   - To test that a query variable simply exists, use `{ [var]: null | undefined }`.
 *   - To test that a query variable exists and is not empty, and not `'0'`, use `{ [var]: true }`.
 *   - To test that a query variable either does not exist, _is_ empty, or `'0'`, use `{ [var]: false }`.
 *   - Any other test is a regular expression, or array of regular expressions; e.g., `{ [var]: /regexp/ }`.
 *   - When passing an array of regular expressions; e.g., `{ [var]: [/regexp/, /regexp/] }`, at least one of the patterns
 *       must match in each query variable test, else this returns false.
 *
 * @returns             True if environment variable is not empty, not `'0'`, and all tests pass.
 *
 * @note Not memoizing because env variables and cookies can change at runtime.
 */
export function test(leadingObps: string | string[], subObpOrObp: string, tests?: QVTests, options?: TestOptions): boolean;
export function test(subObpOrObp: string, tests?: QVTests, options?: TestOptions): boolean; // Shorter variant as a convenience.

export function test(...args: unknown[]): boolean {
    // See notes above. Multiple signatures covered here.
    let leadingObps: string | string[], subObpOrObp: string;
    let tests: QVTests | undefined, options: TestOptions | undefined;

    if (1 === args.length || (args.length >= 2 && $is.object(args[1]))) {
        (leadingObps = ['']), (subObpOrObp = args[0] as string);
        (tests = args[1] as QVTests | undefined), (options = args[2] as TestOptions | undefined);
    } else {
        (leadingObps = args[0] as string | string[]), (subObpOrObp = args[1] as string);
        (tests = args[2] as QVTests | undefined), (options = args[3] as TestOptions | undefined);
    }
    const opts = $obj.defaults({}, options || {}, { alsoTryCookie: false }) as Required<TestOptions>;

    let value = get(leadingObps, subObpOrObp); // Environment variable value.
    // We can also try a cookie by the same name, but only under a set of specific conditions.
    if (undefined === value && opts.alsoTryCookie && isWeb() && '' === $to.array(leadingObps).join('')) {
        value = $cookie.get(subObpOrObp); // Cookie value; else empty string.
    }
    if ($is.emptyOrZero(value)) return false; // Empty or `'0'` = false.
    if ($is.empty(tests)) return true; // Not empty, not `'0'`, no tests = true.

    const strValue = String(value); // Force string value.
    // Depending on string value contents, this may or may not throw, so we 'try'.
    const qvs = $fn.try(() => $url.getQueryVars('http://x.tld/?' + strValue), {} as $url.QueryVars)();

    for (const [qv, test] of Object.entries(tests as QVTests)) {
        const exists = Object.hasOwn(qvs, qv);
        const parsedValue = exists ? $str.parseValue(qvs[qv]) : undefined;

        if (null === test || undefined === test) {
            if (!exists) return false;
            //
        } else if (true === test) {
            if ($is.emptyOrZero(parsedValue)) return false;
            //
        } else if (false === test) {
            if (!$is.emptyOrZero(parsedValue)) return false;
            //
        } else if (!$str.test(qvs[qv] || '', test)) return false;
    }
    return true; // Passed all tests.
}
