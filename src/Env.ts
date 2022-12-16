/**
 * Utility class.
 */

import { empty as objEmpty, hasOwn as objHasOwn, props as objProps } from './obj';
import { matches as strMatches } from './str';

/**
 * Polyfills missing types.
 */
declare function WorkerGlobalScope(): void;
declare function DedicatedWorkerGlobalScope(): void;
declare function SharedWorkerGlobalScope(): void;
declare function ServiceWorkerGlobalScope(): void;

/**
 * Cache.
 */
const cache: {
	isC10n?: { [x: string]: boolean };
	[x: string]: unknown;
} = {};

/**
 * Is Clever Canyon?
 *
 * @param   tests Optional prop patterns to test for in `isC10n`. Each property is treated as a glob pattern that must
 *   be found in `isC10n`. To test if a prop exists use `*`. Or, to test that it exists and is not empty use `?`.
 *
 * @returns       `true` if `IS_C10N` and all tests pass.
 */
export function isC10n(tests: { [x: string]: string } = {}): boolean {
	cache.isC10n ??= {}; // Initialize.
	const cacheKey = JSON.stringify(tests);

	if (undefined !== cache.isC10n[cacheKey]) {
		return cache.isC10n[cacheKey];
	}
	if (!('IS_C10N' in globalThis)) {
		return (cache.isC10n[cacheKey] = false);
	}
	// @ts-ignore `isC10n` environment var is ok.
	const isC10n = String(globalThis.IS_C10N || '');

	if (objEmpty(tests)) {
		return (cache.isC10n[cacheKey] = true);
	}
	// Parses `isC10n` as a query string, which is used to populate `isC10nProps`.
	// Each property of `tests` is treated as a glob pattern that must be found in `isC10nProps`.
	const isC10nProps = objProps(new URL('?' + String(isC10n), 'http://c10n').searchParams);

	for (const [prop, pattern] of Object.entries(tests)) {
		if (!objHasOwn(isC10nProps, prop) || !strMatches(isC10nProps[prop], pattern, { nocase: true })) {
			return (cache.isC10n[cacheKey] = false);
		}
	}
	return (cache.isC10n[cacheKey] = true);
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
export function isCfw(): boolean {
	if (undefined !== cache.isCfw) {
		return cache.isCfw as boolean;
	}
	return (cache.isCfw =
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
