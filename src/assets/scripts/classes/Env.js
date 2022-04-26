/**
 * Clever Canyon™ {@see https://clevercanyon.com}
 *
 *  CCCCC  LL      EEEEEEE VV     VV EEEEEEE RRRRRR      CCCCC    AAA   NN   NN YY   YY  OOOOO  NN   NN ™
 * CC      LL      EE      VV     VV EE      RR   RR    CC       AAAAA  NNN  NN YY   YY OO   OO NNN  NN
 * CC      LL      EEEEE    VV   VV  EEEEE   RRRRRR     CC      AA   AA NN N NN  YYYYY  OO   OO NN N NN
 * CC      LL      EE        VV VV   EE      RR  RR     CC      AAAAAAA NN  NNN   YYY   OO   OO NN  NNN
 *  CCCCC  LLLLLLL EEEEEEE    VVV    EEEEEEE RR   RR     CCCCC  AA   AA NN   NN   YYY    OOOO0  NN   NN
 */
// <editor-fold desc="Imports and other headers.">

/**
 * Lint configuration.
 *
 * @since 2022-04-25
 */
/* eslint-disable no-undef */

/**
 * Imports.
 *
 * @since 2022-04-25
 */
import { default as uA6tStcUtilities } from './a6t/StcUtilities.js';

// </editor-fold>

/**
 * Environment utilities.
 *
 * @since 2022-04-25
 */
export default class uEnv extends uA6tStcUtilities {
	/**
	 * Cache.
	 *
	 * @since 2022-04-25
	 *
	 * @type {Object} Cache.
	 */
	static #cache = {};

	/**
	 * Is browser?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if browser.
	 */
	static isBrowser() {
		if ( undefined !== uEnv.#cache.isBrowser ) {
			return uEnv.#cache.isBrowser;
		}
		return uEnv.#cache.isBrowser = // Memoize.
			typeof window === 'object' && typeof window.document === 'object';
	}

	/**
	 * Is node?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if node.
	 */
	static isNode() {
		if ( undefined !== uEnv.#cache.isNode ) {
			return uEnv.#cache.isNode;
		}
		return uEnv.#cache.isNode = // Memoize.
			typeof process === 'object' && typeof process.versions === 'object'
			&& typeof process.versions.node !== 'undefined';
	}

	/**
	 * Is worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if worker.
	 */
	static isWorker() {
		if ( undefined !== uEnv.#cache.isWorker ) {
			return uEnv.#cache.isWorker;
		}
		return uEnv.#cache.isWorker = // Memoize.
			typeof self === 'object' && typeof WorkerGlobalScope === 'function'
			&& self instanceof WorkerGlobalScope;
	}

	/**
	 * Is dedicated worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if dedicated worker.
	 */
	static isDedicatedWorker() {
		if ( undefined !== uEnv.#cache.isDedicatedWorker ) {
			return uEnv.#cache.isDedicatedWorker;
		}
		return uEnv.#cache.isDedicatedWorker = // Memoize.
			typeof self === 'object' && typeof DedicatedWorkerGlobalScope === 'function'
			&& self instanceof DedicatedWorkerGlobalScope;
	}

	/**
	 * Is shared worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if shared worker.
	 */
	static isSharedWorker() {
		if ( undefined !== uEnv.#cache.isSharedWorker ) {
			return uEnv.#cache.isSharedWorker;
		}
		return uEnv.#cache.isSharedWorker = // Memoize.
			typeof self === 'object' && typeof SharedWorkerGlobalScope === 'function'
			&& self instanceof SharedWorkerGlobalScope;
	}

	/**
	 * Is service worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if service worker.
	 */
	static isServiceWorker() {
		if ( undefined !== uEnv.#cache.isServiceWorker ) {
			return uEnv.#cache.isServiceWorker;
		}
		return uEnv.#cache.isServiceWorker = // Memoize.
			typeof self === 'object' && typeof ServiceWorkerGlobalScope === 'function'
			&& self instanceof ServiceWorkerGlobalScope;
	}

	/**
	 * Is Cloudflare worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if Cloudflare worker.
	 */
	static isCloudflareWorker() {
		if ( undefined !== uEnv.#cache.isCloudflareWorker ) {
			return uEnv.#cache.isCloudflareWorker;
		}
		return uEnv.#cache.isCloudflareWorker = // Memoize.
			uEnv.isServiceWorker() && typeof caches === 'object'
			&& typeof caches.default === 'object' && typeof HTMLRewriter === 'function';
	}

	/**
	 * Can use Beacon API?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if can use Beacon API.
	 */
	static canSendBeacon() {
		if ( undefined !== uEnv.#cache.canSendBeacon ) {
			return uEnv.#cache.canSendBeacon;
		}
		return uEnv.#cache.canSendBeacon = // Memoize.
			uEnv.isBrowser() && 'function' === typeof navigator.sendBeacon;
	}
}
