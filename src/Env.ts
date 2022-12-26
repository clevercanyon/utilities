/**
 * Utility class.
 */

import { matches as $strꓺmatches } from './str.js';
import { empty as $objꓺempty, hasOwn as $objꓺhasOwn, props as $objꓺprops } from './obj.js';

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
	isC10N?: { [x: string]: boolean };
} = {};

/**
 * Captures vars.
 */
if (isNode()) {
	capture(process.env);
}
capture(import.meta.env);

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
	vars[name] = value;
}

/**
 * Is Clever Canyon? i.e., operated by Clever Canyon.
 *
 * @param   tests Optional prop patterns to test for. Each property is treated as a glob pattern that must be found. To
 *   test if a prop simply exists, use `*`. Or, to test that it exists and is not empty use `?`.
 *
 * @returns       `true` if `IS_C10N` and all tests pass.
 */
export function isC10N(tests: { [x: string]: string } = {}): boolean {
	cache.isC10N ??= {}; // Initialize.
	const key = JSON.stringify(tests);

	if (undefined !== cache.isC10N[key]) {
		return cache.isC10N[key];
	}
	if (!get('IS_C10N')) {
		return (cache.isC10N[key] = false);
	}
	if ($objꓺempty(tests)) {
		return (cache.isC10N[key] = true);
	}
	const isC10NProps = $objꓺprops(new URL('?' + String(get('IS_C10N')), 'https://c10n').searchParams);

	for (const [prop, pattern] of Object.entries(tests)) {
		if (!$objꓺhasOwn(isC10NProps, prop) || !$strꓺmatches(isC10NProps[prop], pattern, { nocase: true })) {
			return (cache.isC10N[key] = false);
		}
	}
	return (cache.isC10N[key] = true);
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
