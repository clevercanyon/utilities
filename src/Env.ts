/**
 * Utility class.
 */

import { getQueryVars as $urlꓺgetQueryVars } from './url.js';
import { parseValue as $strꓺparseValue, matches as $strꓺmatches } from './str.js';
import { empty as $objꓺempty, hasOwn as $objꓺhasOwn } from './obj.js';

/**
 * Polyfills missing types.
 */
declare function WorkerGlobalScope(): void;
declare function DedicatedWorkerGlobalScope(): void;
declare function SharedWorkerGlobalScope(): void;
declare function ServiceWorkerGlobalScope(): void;

/**
 * Environment vars.
 */
const vars: {
	[x: string]: unknown;
} = {};

/**
 * Environment cache.
 */
const cache: {
	[x: string]: unknown;
	test?: { [x: string]: { [x: string]: boolean } };
} = {};

/**
 * Captures vars.
 */
if (isNode()) {
	capture(process.env);
}
capture(import.meta.env || {});

/**
 * Captures variables.
 *
 * @param env Environment vars.
 *
 * @note Order of capture matters.
 * @note Existing variables will *not* be overwritten.
 */
export function capture(env: { [x: string]: unknown }): void {
	for (const [name, value] of Object.entries(env)) {
		if (!$objꓺhasOwn(vars, name)) set(name, value);
	}
}

/**
 * Gets a variable.
 *
 * @param   name Variable name.
 *
 * @returns      Variable value.
 */
export function get(name: string): unknown | null {
	if ($objꓺhasOwn(vars, name)) {
		return vars[name];
	}
	return null; // Unavailable.
}

/**
 * Sets a variable.
 *
 * @param name  Variable name.
 * @param value Variable value.
 */
export function set(name: string, value: unknown): void {
	vars[name] = typeof value === 'string' ? $strꓺparseValue(value) : value;
}

/**
 * Tests an environment variable's query vars.
 *
 * @param   ev    Environment variable to run tests on.
 * @param   tests Optional tests. To test that a variable simply exists, omit `tests`. Each test is treated as a
 *   caSe-insensitive glob pattern that must be found in the variable's query vars. All tests must pass; i.e., this uses
 *   AND logic. The use of OR logic can be implemented in calls to this function. To test that a query var simply exists
 *   use `*`. To test that a query var exists and is not empty use `?*`.
 *
 * @returns       `true` if variable exists and all tests pass.
 */
export function test(ev: string, tests: { [x: string]: string } = {}): boolean {
	cache.test ??= {};
	cache.test[ev] ??= {};

	const tk = JSON.stringify(tests);

	if (undefined !== cache.test[ev][tk]) {
		return cache.test[ev][tk];
	}
	if (!get(ev) /* variable */) {
		return (cache.test[ev][tk] = false);
	}
	if ($objꓺempty(tests)) {
		return (cache.test[ev][tk] = true);
	}
	const evQVs = $urlꓺgetQueryVars('//is?' + String(get(ev)));

	for (const [qv, glob] of Object.entries(tests)) {
		if (!$objꓺhasOwn(evQVs, qv) || !$strꓺmatches(evQVs[qv], glob, { nocase: true })) {
			return (cache.test[ev][tk] = false);
		}
	}
	return (cache.test[ev][tk] = true);
}

/**
 * Is operated by Clever Canyon?
 *
 * @see test() For further details.
 */
export function isC10N(tests: { [x: string]: string } = {}): boolean {
	return test('APP_IS_C10N', tests);
}

/**
 * Is web?
 *
 * @returns `true` if web.
 */
export function isWeb(): boolean {
	if (undefined !== cache.isWeb) {
		return cache.isWeb as boolean;
	}
	return (cache.isWeb = typeof Window === 'function' && globalThis instanceof Window);
}

/**
 * Is node?
 *
 * @returns `true` if node.
 */
export function isNode(): boolean {
	if (undefined !== cache.isNode) {
		return cache.isNode as boolean;
	}
	return (cache.isNode = typeof process === 'object' && typeof process.versions === 'object' && 'node' in process.versions);
}

/**
 * Is Cloudflare worker?
 *
 * @returns `true` if CFW.
 */
export function isCFW(): boolean {
	if (undefined !== cache.isCFW) {
		return cache.isCFW as boolean;
	}
	return (cache.isCFW =
		isServiceWorker() && typeof Navigator === 'function' && typeof navigator === 'object' && navigator instanceof Navigator && 'Cloudflare-Workers' === navigator.userAgent);
}

/**
 * Is worker?
 *
 * @returns `true` if worker.
 */
export function isWorker(): boolean {
	if (undefined !== cache.isWorker) {
		return cache.isWorker as boolean;
	}
	return (cache.isWorker = 'WorkerGlobalScope' in globalThis && typeof WorkerGlobalScope === 'function' && globalThis instanceof WorkerGlobalScope);
}

/**
 * Is dedicated worker?
 *
 * @returns `true` if dedicated worker.
 */
export function isDedicatedWorker(): boolean {
	if (undefined !== cache.isDedicatedWorker) {
		return cache.isDedicatedWorker as boolean;
	}
	return (cache.isDedicatedWorker =
		'DedicatedWorkerGlobalScope' in globalThis && typeof DedicatedWorkerGlobalScope === 'function' && globalThis instanceof DedicatedWorkerGlobalScope);
}

/**
 * Is shared worker?
 *
 * @returns `true` if shared worker.
 */
export function isSharedWorker(): boolean {
	if (undefined !== cache.isSharedWorker) {
		return cache.isSharedWorker as boolean;
	}
	return (cache.isSharedWorker = 'SharedWorkerGlobalScope' in globalThis && typeof SharedWorkerGlobalScope === 'function' && globalThis instanceof SharedWorkerGlobalScope);
}

/**
 * Is service worker?
 *
 * @returns `true` if service worker.
 */
export function isServiceWorker(): boolean {
	if (undefined !== cache.isServiceWorker) {
		return cache.isServiceWorker as boolean;
	}
	return (cache.isServiceWorker = 'ServiceWorkerGlobalScope' in globalThis && typeof ServiceWorkerGlobalScope === 'function' && globalThis instanceof ServiceWorkerGlobalScope);
}
