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
 * Imports.
 *
 * @since 2022-04-25
 */
import { default as uA6tStcUtilities } from './a6t/StcUtilities';

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
	protected static cache : { [ $ : string ] : unknown } = {};

	/**
	 * Is Clever Canyon?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if C10N.
	 */
	public static isC10n() : boolean {
		if ( undefined !== uEnv.cache.isC10n ) {
			return uEnv.cache.isC10n as boolean;
		} // @ts-ignore `IS_C10N` is ok.
		return uEnv.cache.isC10n = Boolean( 'IS_C10N' in globalThis && IS_C10N );
	}

	/**
	 * Is web?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if web.
	 */
	public static isWeb() : boolean {
		if ( undefined !== uEnv.cache.isWeb ) {
			return uEnv.cache.isWeb as boolean;
		}
		return uEnv.cache.isWeb = // Memoize.
			typeof Window === 'function' && globalThis instanceof Window;
	}

	/**
	 * Is node?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if node.
	 */
	public static isNode() : boolean {
		if ( undefined !== uEnv.cache.isNode ) {
			return uEnv.cache.isNode as boolean;
		}
		return uEnv.cache.isNode = // Memoize.
			typeof process === 'object' // Node-specific version check.
			&& typeof process.versions === 'object' && 'node' in process.versions;
	}

	/**
	 * Is Cloudflare worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if CFW.
	 */
	public static isCfw() : boolean {
		if ( undefined !== uEnv.cache.isCfw ) {
			return uEnv.cache.isCfw as boolean;
		}
		return uEnv.cache.isCfw = uEnv.isServiceWorker() // Memoize.
			&& typeof Navigator === 'function' && typeof navigator === 'object'
			&& navigator instanceof Navigator && 'Cloudflare-Workers' === navigator.userAgent;
	}

	/**
	 * Is worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if worker.
	 */
	public static isWorker() : boolean {
		if ( undefined !== uEnv.cache.isWorker ) {
			return uEnv.cache.isWorker as boolean;
		}
		return uEnv.cache.isWorker = // Memoize.
			'WorkerGlobalScope' in globalThis // @ts-ignore `WorkerGlobalScope` is ok.
			&& typeof WorkerGlobalScope === 'function' && globalThis instanceof WorkerGlobalScope;
	}

	/**
	 * Is dedicated worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if dedicated worker.
	 */
	public static isDedicatedWorker() : boolean {
		if ( undefined !== uEnv.cache.isDedicatedWorker ) {
			return uEnv.cache.isDedicatedWorker as boolean;
		}
		return uEnv.cache.isDedicatedWorker = // Memoize.
			'DedicatedWorkerGlobalScope' in globalThis // @ts-ignore `DedicatedWorkerGlobalScope` is ok.
			&& typeof DedicatedWorkerGlobalScope === 'function' && globalThis instanceof DedicatedWorkerGlobalScope;
	}

	/**
	 * Is shared worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if shared worker.
	 */
	public static isSharedWorker() : boolean {
		if ( undefined !== uEnv.cache.isSharedWorker ) {
			return uEnv.cache.isSharedWorker as boolean;
		}
		return uEnv.cache.isSharedWorker = // Memoize.
			'SharedWorkerGlobalScope' in globalThis // @ts-ignore `SharedWorkerGlobalScope` is ok.
			&& typeof SharedWorkerGlobalScope === 'function' && globalThis instanceof SharedWorkerGlobalScope;
	}

	/**
	 * Is service worker?
	 *
	 * @since 2022-04-25
	 *
	 * @returns {boolean} `true` if service worker.
	 */
	public static isServiceWorker() : boolean {
		if ( undefined !== uEnv.cache.isServiceWorker ) {
			return uEnv.cache.isServiceWorker as boolean;
		}
		return uEnv.cache.isServiceWorker = // Memoize.
			'ServiceWorkerGlobalScope' in globalThis // @ts-ignore `ServiceWorkerGlobalScope` is ok.
			&& typeof ServiceWorkerGlobalScope === 'function' && globalThis instanceof ServiceWorkerGlobalScope;
	}
}
