/**
 * Environment utilities.
 */

import './resources/init.ts';

import { $app, $is, $obj, $obp, $str, $to, $type, $url } from './index.ts';
import { $fnꓺmemo } from './resources/standalone/index.ts';

let topLevelObp: string = '';
let topLevelObpSet: boolean = false;

let varsInitialized: boolean = false;
const vars: { [x: string]: unknown } = {};

/**
 * Defines types.
 */
declare global {
    interface Navigator {
        globalPrivacyControl: string;
    }
}
declare const MINIFLARE: boolean;

export type GetOptions = { default?: unknown; type?: $type.EnsurableType };
export type GetOptionsWithoutType = GetOptions & { type?: undefined };
export type GetOptionsWithType = GetOptions & { type: $type.EnsurableType };
export type QVTests = { [x: string]: null | undefined | string | string[] };

/**
 * Exports frequently-used errors.
 */
export const errWebOnly = new Error('Web only.');
export const errSSROnly = new Error('SSR only.');

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
    if (!obp.includes('.')) {
        return (topLevelObp || $str.obpPartSafe($app.pkgName)) + '.' + obp;
    }
    return obp.replace(/^@top\./u, (topLevelObp || $str.obpPartSafe($app.pkgName)) + '.');
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
 *   - Root object path is sanitized using {@see $str.obpPartSafe()} automatically.
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
 * - Order of capture matters.
 * - Existing values are not overwritten.
 *
 * @param rootObp A root object path in which to place captured environment variables; e.g., `@top`.
 * @param env     Environment variables, by object subpath.
 *
 *   - Root object path is sanitized using {@see $str.obpPartSafe()} automatically.
 */
export const capture = (rootObp: string, env: object): void => {
    if (!varsInitialized) initializeVars();
    rootObp = $str.obpPartSafe(rootObp);

    if ('@top' === rootObp && !topLevelObpSet) {
        throw new Error(); // `@top` used in capture before calling `$env.setTopLevelObp()`.
    }
    for (const [subObp, value] of Object.entries(env)) {
        if (!subObp) continue; // Empty subpath not allowable.
        const obp = [rootObp, subObp].filter((v) => '' !== v).join('.');
        $obp.defaultTo(vars, resolveTopLevelObp(obp), $is.string(value) ? $str.parseValue(value) : value);
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

    // Cloudflare worker environment variables are captured by event listeners.
    // {@see https://github.com/clevercanyon/utilities.cfw/blob/main/src/cfw.ts}.
    // {@see https://github.com/clevercanyon/utilities.cfp/blob/main/src/cfp.ts}.

    if (isWeb() && 'env' in window && $is.object(window.env)) {
        capture('@global', window.env); // Non-standard; must be populated by web app.
    } // Global window environment variables.

    // `clevercanyon/utilities` app-specific environment variables compiled by Vite.
    // Note: This is for `clevercanyon/utilities`, explicity. Apps must capture their own.
    capture($app.pkgName, import.meta.env); // Sourced by dotenv files.
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
export function get<Options extends GetOptionsWithoutType>(leadingObps: string | string[], subObpOrObp: string, options?: Options): unknown;
export function get<Options extends GetOptionsWithType>(leadingObps: string | string[], subObpOrObp: string, options: Options): $type.EnsuredType<Options['type']>;

export function get<Options extends GetOptionsWithoutType>(subObpOrObp: string, options?: Options): unknown; // Shorter variants as a convenience.
export function get<Options extends GetOptionsWithType>(subObpOrObp: string, options: Options): $type.EnsuredType<Options['type']>;

export function get(...args: unknown[]): unknown {
    if (!varsInitialized) initializeVars();

    // See notes above. Multiple signatures covered here.
    let leadingObps: string | string[], subObpOrObp: string, options: GetOptions | undefined;

    if (1 === args.length || (2 === args.length && $is.object(args[1]))) {
        (leadingObps = ['']), (subObpOrObp = args[0] as string), (options = args[1] as GetOptions | undefined);
    } else (leadingObps = args[0] as string | string[]), (subObpOrObp = args[1] as string), (options = args[2] as GetOptions | undefined);

    let value: unknown; // Initialize value, which is populated below, if possible.
    const opts = $obj.defaults({}, options || {}, { type: undefined, default: undefined }) as GetOptions;

    for (const leadingObp of $to.array(leadingObps)) {
        const obp = [leadingObp, subObpOrObp].filter((v) => '' !== v).join('.');

        if (isTopLevelObp(obp)) {
            // If top-level, look first at globals.
            value = $obp.get(vars, globalTopLevelObp(obp));
        }
        if (undefined === value) {
            // Otherwise, resolve top-level and query.
            value = $obp.get(vars, resolveTopLevelObp(obp));
        }
        if (undefined !== value) break; // Got value.
    }
    value = undefined !== value ? value : opts.default;

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
 * Checks if environment is a test framework.
 *
 * @returns True or false.
 *
 *   Vitest sets:
 *
 *   - `TEST=true` (boolean).
 *   - `VITEST=true` (boolean).
 *   - `VITEST_MODE=RUN|WATCH|...` (string).
 */
export const isTest = $fnꓺmemo((): boolean => {
    return test('TEST'); // Set by Vitest; maybe by Jest also.
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
 * Checks if environment is a web browser under a local hostname.
 *
 * @returns True or false.
 */
export const isLocalWeb = $fnꓺmemo((): boolean => {
    return isWeb() && $str.matches($url.currentRootHost({ withPort: false }), $url.localHostPatterns());
});

/**
 * Checks if environment is a web browser under a local hostname and Vite dev server is running.
 *
 * @returns True or false.
 */
export const isLocalWebVite = $fnꓺmemo((): boolean => {
    return isLocalWeb() && isVite();
});

/**
 * Checks if environment is a web browser under a local hostname and Vite dev server is running with HMR/prefresh?
 *
 * @returns True or false.
 */
export const isLocalWebVitePrefresh = $fnꓺmemo((): boolean => {
    return isLocalWebVite() && '__PREFRESH__' in globalThis;
});

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
    ) || isCFWViaMiniflare(); // prettier-ignore
});

/**
 * Checks if environment is a Cloudflare worker via miniflare.
 *
 * @returns True or false.
 */
export const isCFWViaMiniflare = $fnꓺmemo((): boolean => {
    return (
        'MINIFLARE' in globalThis && true === MINIFLARE &&
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
 * Checks if user-agent is a major crawler.
 *
 * @returns True if user-agent is a major crawler.
 *
 * @see https://blog.hubspot.com/marketing/top-search-engines
 * @see https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
 * @see https://github.com/monperrus/crawler-user-agents/blob/master/crawler-user-agents.json
 */
export const isMajorCrawler = $fnꓺmemo(() => {
    if (isWeb())
        for (const regExp of [
            /\b(?:google|bing|msn|adidx|duckduck)bot\b/iu, // `*bot` patterns.
            /\b(?:(?:ads|store)bot|apis|mediapartners)-google\b/iu, // `*-google` patterns.
            /\bgoogle(?:-(?:read|site|adwords|extended|inspectiontool|structured)|producer|other)\b/iu, // `google{-*,*}` patterns.
            /\b(?:slurp|teoma|yeti|heritrix|ia_archiver|archive\.org_bot|baiduspider|yandex\.com\/bots)\b/iu, // Other search engines.
        ]) {
            if (regExp.test(navigator.userAgent)) return true;
        }
    return false;
});

/**
 * Checks DNT (Do Not Track) header.
 *
 * @returns True when DNT header exists.
 *
 * @see https://o5p.me/jAUC6x
 */
export const hasDNTHeader = $fnꓺmemo((): boolean => {
    return isWeb() && '1' === navigator.doNotTrack;
});

/**
 * Checks GPC (Global Privacy Control) header.
 *
 * @returns True when GPC header exists.
 *
 * @see https://o5p.me/nXslpm
 */
export const hasGPCHeader = $fnꓺmemo((): boolean => {
    return isWeb() && '1' === navigator.globalPrivacyControl;
});

/**
 * Checks if environment is operated by Clever Canyon.
 *
 * @param   tests Optional tests. {@see test()} for details.
 *
 * @returns       True if environment is operated by Clever Canyon.
 *
 *   - If different tests are passed, meaning of return value potentially changes.
 *
 * @note Not memoizing because env variables can change at runtime.
 */
export const isC10n = (tests: QVTests = {}): boolean => test('APP_IS_C10N', tests);

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
 * ---
 * @note Not memoizing because env variables can change at runtime.
 */
export const isVite = (tests: QVTests = { serve: '*' }): boolean => test('APP_IS_VITE', tests);

/**
 * Tests an environment variable's query vars.
 *
 * @param   leadingObps Optional environment variable object path(s).
 * @param   subObpOrObp Subpath, or full object path if `leadingObps` is not passed, or empty.
 * @param   tests       Optional query var tests; e.g., `{ [var]: '*', [var]: '*', [var]: '*' }`.
 *
 *   Regarding environment variables:
 *
 *   - To simply test that an environment variable is not empty and not `'0'`, just do not pass any `tests`.
 *
 *   Regarding query vars within the environment variable’s value:
 *
 *   Each query `{ [var]: '*' }` test is treated as a caSe-insensitive glob pattern (or an array of patterns) — one of
 *   which must match the targeted query var. All query var tests must pass i.e., this uses AND logic. The use of OR
 *   logic can be achieved by calling this function multiple times in different ways; e.g., `if ( test() || test() )`.
 *
 *   - To test that a query var simply exists, use `{ [var]: '*' }`.
 *   - To test that a query var exists and is not empty, and not `'0'`, use `{ [var]: '?*' }`.
 *
 * @returns             True if environment variable is not empty, not `'0'`, and all tests pass.
 *
 * @note Not memoizing because env variables can change at runtime.
 */
export function test(leadingObps: string | string[], subObpOrObp: string, tests?: QVTests): boolean;
export function test(subObpOrObp: string, tests?: QVTests): boolean; // Shorter variant as a convenience.

export function test(...args: unknown[]): boolean {
    // See notes above. Multiple signatures covered here.
    let leadingObps: string | string[], subObpOrObp: string, tests: QVTests | undefined;

    if (1 === args.length || (2 === args.length && $is.object(args[1]))) {
        (leadingObps = ['']), (subObpOrObp = args[0] as string), (tests = args[1] as QVTests | undefined);
    } else (leadingObps = args[0] as string | string[]), (subObpOrObp = args[1] as string), (tests = args[2] as QVTests | undefined);

    const value = get(leadingObps, subObpOrObp); // Env var value.

    if ($is.emptyOrZero(value)) {
        return false; // Env var empty = false.
    }
    if ($is.empty(tests)) {
        return true; // Not empty, no tests = true.
    }
    const strValue = String(value); // Force string.
    const qvs = $url.getQueryVars('http://x.tld/?' + strValue);

    for (const [qv, glob] of Object.entries(tests as QVTests)) {
        if (!Object.hasOwn(qvs, qv)) {
            return false; // Missing qv.
        }
        if (!glob || '*' === glob || '**' === glob) {
            continue; // The qv exists.
        }
        if ('?*' === glob || '?**' === glob) {
            if ($is.emptyOrZero(qvs[qv])) {
                return false; // Empty or `'0'`.
            } else continue; // Not empty, not `'0'`.
        }
        if (!$str.matches(qvs[qv], glob, { ignoreCase: true })) {
            return false; // The qv doesn’t pass a test given.
        }
    }
    return true; // Passed all tests.
}
