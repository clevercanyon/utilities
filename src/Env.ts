/**
 * Environment utilities.
 */

import { hasOwn as $objꓺhasOwn } from './obj.js';
import { castArray as $toꓺcastArray } from './to.js';
import { getQueryVars as $urlꓺgetQueryVars } from './url.js';
import { svz as $moizeꓺsvz, deep as $moizeꓺdeep } from './moize.js';
import { parseValue as $strꓺparseValue, matches as $strꓺmatches } from './str.js';
import { get as $obpꓺget, set as $obpꓺset, defaultTo as $obpꓺdefaultTo, unset as $obpꓺunset } from './obp.js';
import { empty as $isꓺempty, string as $isꓺstring, object as $isꓺobject, function as $isꓺfunction } from './is.js';

const appPkgObp = $$__APP_PKG_OBP__$$;

/**
 * Defines types.
 */
export type QVTests = { [x: string]: string | string[] };

/**
 * Environment variables.
 */
const vars: { [x: string]: unknown } = {};

/**
 * Holds top-level object path.
 */
let topLevelObp: string = appPkgObp;
let isTopLevelObpSet: boolean = false;

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
 * @param   obp Top-level object path.
 *
 * @returns     True if top-level object path is set, else false.
 */
export const setTopLevelObp = (obp: string): boolean => {
	if (!obp || isTopLevelObpSet) {
		return false; // Invalid, or set already.
	}
	topLevelObp = obp; // Setting it now.

	return (isTopLevelObpSet = true);
};

/**
 * Checks if an object path is top-level.
 *
 * @param   obp Object path to check.
 *
 * @returns     True if object path is top-level.
 */
export const isTopLevelObp = (obp: string): boolean => {
	return !obp.includes('.') || /^@top\./u.test(obp);
};

/**
 * Globalizes a top-level object path.
 *
 * @param   obp Object path to consider.
 *
 * @returns     A potentially globalized top-level object path.
 */
export const globalTopLevelObp = (obp: string): string => {
	if (!obp.includes('.')) return '@global.' + obp;
	return obp.replace(/^@top\./u, '@global.');
};

/**
 * Resolves a top-level object path.
 *
 * @param   obp Object path to consider.
 *
 * @returns     A potentially resolved top-level object path.
 */
export const resolveTopLevelObp = (obp: string): string => {
	if (!obp.includes('.')) return topLevelObp + '.' + obp;
	return obp.replace(/^@top\./u, topLevelObp + '.');
};

/**
 * Gets an environment variable.
 *
 * @param   leadingObps  Leading object path(s).
 *
 *   - Can be passed as a string or an array of strings.
 *   - The array order given is the order in which queries are run.
 *
 * @param   subObp       Object subpath.
 * @param   defaultValue Default value.
 *
 * @returns              Environment variable value, else {@see defaultValue}.
 *
 *   - Returns the first query to produce a value that’s not undefined; {@see leadingObps}.
 *   - If no value is found by any query, {@see defaultValue} is returned.
 */
export const get = (leadingObps: string | string[], subObp: string, defaultValue?: unknown): unknown => {
	for (const leadingObp of $toꓺcastArray(leadingObps)) {
		const obp = [leadingObp, subObp].filter((v) => '' !== v).join('.');

		let value: unknown; // Initialize.

		if (isTopLevelObp(obp)) {
			value = $obpꓺget(vars, globalTopLevelObp(obp));
		}
		if (undefined === value) {
			value = $obpꓺget(vars, resolveTopLevelObp(obp));
		}
		if (undefined !== value) {
			return value;
		}
	}
	return defaultValue;
};

/**
 * Sets an environment variable.
 *
 * @param leadingObp Leading object path.
 * @param subObp     Object subpath.
 * @param value      Environment variable value.
 */
export const set = (leadingObp: string, subObp: string, value: unknown): void => {
	const obp = [leadingObp, subObp].filter((v) => '' !== v).join('.');
	$obpꓺset(vars, resolveTopLevelObp(obp), $isꓺstring(value) ? $strꓺparseValue(value) : value);
};

/**
 * Unsets an environment variable.
 *
 * @param leadingObp Leading object path.
 * @param subObp     Object subpath.
 */
export const unset = (leadingObp: string, subObp: string): void => {
	const obp = [leadingObp, subObp].filter((v) => '' !== v).join('.');
	$obpꓺunset(vars, resolveTopLevelObp(obp));
};

/**
 * Captures environment variables.
 *
 * - Order of capture matters.
 * - Existing values are not overwritten.
 *
 * @param leadingObp Leading object path.
 * @param env        Environment variables, by object subpath.
 */
export const capture = (leadingObp: string, env: object): void => {
	for (const [subObp, value] of Object.entries(env)) {
		const obp = [leadingObp, subObp].filter((v) => '' !== v).join('.');
		$obpꓺdefaultTo(vars, resolveTopLevelObp(obp), $isꓺstring(value) ? $strꓺparseValue(value) : value);
	}
};

/**
 * Is operated by Clever Canyon?
 *
 * @note {@see test()} For further details.
 */
export const isC10n = $moizeꓺdeep({ maxSize: 12 })(
	// Memoized function.
	(tests: QVTests = {}): boolean => test('@top', 'APP_IS_C10N', tests),
);

/**
 * Is web?
 *
 * @returns `true` if web.
 */
export const isWeb = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): boolean => {
		return 'Window' in globalThis && $isꓺfunction(Window) && globalThis instanceof Window;
	},
);

/**
 * Is node?
 *
 * @returns `true` if node.
 */
export const isNode = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): boolean => {
		return 'process' in globalThis && $isꓺobject(process) && $isꓺobject(process.versions) && 'node' in process.versions;
	},
);

/**
 * Is Cloudflare worker?
 *
 * @returns `true` if CFW.
 */
export const isCFW = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): boolean => {
		return (
			isServiceWorker() &&
			'Navigator' in globalThis && $isꓺfunction(Navigator) &&
			'navigator' in globalThis && $isꓺobject(navigator) &&
			navigator instanceof Navigator && 'Cloudflare-Workers' === navigator.userAgent
		); // prettier-ignore
	},
);

/**
 * Is worker?
 *
 * @returns `true` if worker.
 */
export const isWorker = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): boolean => {
		return 'WorkerGlobalScope' in globalThis && $isꓺfunction(WorkerGlobalScope) && globalThis instanceof WorkerGlobalScope;
	},
);

/**
 * Is dedicated worker?
 *
 * @returns `true` if dedicated worker.
 */
export const isDedicatedWorker = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): boolean => {
		return 'DedicatedWorkerGlobalScope' in globalThis && $isꓺfunction(DedicatedWorkerGlobalScope) && globalThis instanceof DedicatedWorkerGlobalScope;
	},
);

/**
 * Is shared worker?
 *
 * @returns `true` if shared worker.
 */
export const isSharedWorker = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): boolean => {
		return 'SharedWorkerGlobalScope' in globalThis && $isꓺfunction(SharedWorkerGlobalScope) && globalThis instanceof SharedWorkerGlobalScope;
	},
);

/**
 * Is service worker?
 *
 * @returns `true` if service worker.
 */
export const isServiceWorker = $moizeꓺsvz({ maxSize: 1 })(
	// Memoized function.
	(): boolean => {
		return 'ServiceWorkerGlobalScope' in globalThis && $isꓺfunction(ServiceWorkerGlobalScope) && globalThis instanceof ServiceWorkerGlobalScope;
	},
);

/**
 * Tests an environment variable's query vars.
 *
 * @param   leadingObps Leading environment variable object path(s).
 * @param   subObp      Environment variable object subpath.
 * @param   tests       Optional query var tests; e.g., `{ [var]: '*', [var]: '*', [var]: '*' }`.
 *
 *   Regarding environment variables:
 *
 *   - To simply test that an environment variable is not empty (or `'0'`), simply do not pass any `tests`.
 *
 *   Regarding query vars within the environment variable’s value:
 *
 *   Each query `{ [var]: '*' }` test is treated as a caSe-insensitive glob pattern (or an array of patterns) — one of
 *   which must match the targeted query var. All query var tests must pass i.e., this uses AND logic. The use of OR
 *   logic can be achieved by calling this function multiple times in different ways; e.g., `if ( test() || test() )`.
 *
 *   - To test that a query var simply exists, use `{ [var]: '*' }`.
 *   - To test that a query var exists and is not empty, use `{ [var]: '?*' }`.
 *
 * @returns             True if environment variable is not empty (or `'0'`), and all tests pass.
 */
export const test = $moizeꓺdeep({ maxSize: 12 })(
	// Memoized function.
	(leadingObps: string | string[], subObp: string, tests?: QVTests): boolean => {
		const value = get(leadingObps, subObp); // Env var value.

		if ($isꓺempty(value, { orZero: true })) {
			return false; // Env var empty = false.
		}
		if ($isꓺempty(tests)) {
			return true; // Not empty, no tests = true.
		}
		const strValue = String(value); // Force string.
		const qvs = $urlꓺgetQueryVars('http://x?' + strValue);

		for (const [qv, glob] of Object.entries(tests as QVTests)) {
			if (!$objꓺhasOwn(qvs, qv) || !$strꓺmatches(qvs[qv], glob, { nocase: true })) {
				return false; // Missing qv, or qv doesn’t pass a test given.
			}
		}
		return true; // Passed all tests.
	},
);

/**
 * Captures environment variables.
 */
if (isNode()) {
	capture('@global', process.env);
} // Global node process environment variables.

if (isWeb() && 'env' in window && window.env && typeof window.env === 'object') {
	capture('@global', window.env); // Non-standard. Populated by our web apps.
} // Global window environment variables.

// App-specific environment variables compiled by Vite.
capture(appPkgObp, import.meta.env); // Sourced by dotenv files.
