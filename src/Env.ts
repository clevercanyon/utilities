/**
 * Utility class.
 */

import $Obj from './Obj';
import $Str from './Str';

/**
 * Environment utilities.
 */
export default class $Env {
	/**
	 * Cache.
	 */
	protected static cache: {
		isC10n?: { [x: string]: boolean };
		[x: string]: unknown;
	} = {};

	/**
	 * Is Clever Canyon?
	 *
	 * @param   tests Optional prop patterns to test for in `isC10n`. Each property is treated as a glob pattern that
	 *   must be found in `isC10n`.
	 *
	 * @returns       `true` if `isC10n` and all tests pass.
	 */
	public static isC10n(tests: { [x: string]: string } = {}): boolean {
		$Env.cache.isC10n ??= {};
		const cacheKey = JSON.stringify(tests);

		if (undefined !== $Env.cache.isC10n[cacheKey]) {
			return $Env.cache.isC10n[cacheKey];
		}
		if (!('IS_C10N' in globalThis)) {
			return ($Env.cache.isC10n[cacheKey] = false);
		}
		// @ts-ignore `isC10n` environment var is ok.
		const isC10n = String(globalThis.IS_C10N || '');

		if ($Obj.empty(tests)) {
			return ($Env.cache.isC10n[cacheKey] = true);
		}
		// Parses `isC10n` as a query string, which is used to populate `isC10nProps`.
		// Each property of `tests` is treated as a glob pattern that must be found in `isC10nProps`.
		const isC10nProps = $Obj.props(new URL('?' + String(isC10n), 'http://c10n').searchParams);

		for (const [prop, pattern] of Object.entries(tests)) {
			if (!$Obj.hasOwn(isC10nProps, prop) || !$Str.matches(isC10nProps[prop], pattern, { nocase: true })) {
				return ($Env.cache.isC10n[cacheKey] = false);
			}
		}
		return ($Env.cache.isC10n[cacheKey] = true);
	}

	/**
	 * Is web?
	 *
	 * @returns `true` if web.
	 */
	public static isWeb(): boolean {
		if (undefined !== $Env.cache.isWeb) {
			return $Env.cache.isWeb as boolean;
		}
		return ($Env.cache.isWeb = typeof Window === 'function' && globalThis instanceof Window);
	}

	/**
	 * Is node?
	 *
	 * @returns `true` if node.
	 */
	public static isNode(): boolean {
		if (undefined !== $Env.cache.isNode) {
			return $Env.cache.isNode as boolean;
		}
		return ($Env.cache.isNode = typeof process === 'object' && typeof process.versions === 'object' && 'node' in process.versions);
	}

	/**
	 * Is Cloudflare worker?
	 *
	 * @returns `true` if CFW.
	 */
	public static isCfw(): boolean {
		if (undefined !== $Env.cache.isCfw) {
			return $Env.cache.isCfw as boolean;
		}
		return ($Env.cache.isCfw =
			$Env.isServiceWorker() &&
			typeof Navigator === 'function' &&
			typeof navigator === 'object' &&
			navigator instanceof Navigator &&
			'Cloudflare-Workers' === navigator.userAgent);
	}

	/**
	 * Is worker?
	 *
	 * @returns `true` if worker.
	 */
	public static isWorker(): boolean {
		if (undefined !== $Env.cache.isWorker) {
			return $Env.cache.isWorker as boolean;
		}
		return ($Env.cache.isWorker =
			'WorkerGlobalScope' in globalThis &&
			// @ts-ignore `WorkerGlobalScope` is ok.
			typeof WorkerGlobalScope === 'function' &&
			// @ts-ignore `WorkerGlobalScope` is ok.
			globalThis instanceof WorkerGlobalScope);
	}

	/**
	 * Is dedicated worker?
	 *
	 * @returns `true` if dedicated worker.
	 */
	public static isDedicatedWorker(): boolean {
		if (undefined !== $Env.cache.isDedicatedWorker) {
			return $Env.cache.isDedicatedWorker as boolean;
		}
		return ($Env.cache.isDedicatedWorker =
			'DedicatedWorkerGlobalScope' in globalThis &&
			// @ts-ignore `DedicatedWorkerGlobalScope` is ok.
			typeof DedicatedWorkerGlobalScope === 'function' &&
			// @ts-ignore `DedicatedWorkerGlobalScope` is ok.
			globalThis instanceof DedicatedWorkerGlobalScope);
	}

	/**
	 * Is shared worker?
	 *
	 * @returns `true` if shared worker.
	 */
	public static isSharedWorker(): boolean {
		if (undefined !== $Env.cache.isSharedWorker) {
			return $Env.cache.isSharedWorker as boolean;
		}
		return ($Env.cache.isSharedWorker =
			'SharedWorkerGlobalScope' in globalThis &&
			// @ts-ignore `SharedWorkerGlobalScope` is ok.
			typeof SharedWorkerGlobalScope === 'function' &&
			// @ts-ignore `SharedWorkerGlobalScope` is ok.
			globalThis instanceof SharedWorkerGlobalScope);
	}

	/**
	 * Is service worker?
	 *
	 * @returns `true` if service worker.
	 */
	public static isServiceWorker(): boolean {
		if (undefined !== $Env.cache.isServiceWorker) {
			return $Env.cache.isServiceWorker as boolean;
		}
		return ($Env.cache.isServiceWorker =
			'ServiceWorkerGlobalScope' in globalThis &&
			// @ts-ignore `ServiceWorkerGlobalScope` is ok.
			typeof ServiceWorkerGlobalScope === 'function' &&
			// @ts-ignore `ServiceWorkerGlobalScope` is ok.
			globalThis instanceof ServiceWorkerGlobalScope);
	}
}
