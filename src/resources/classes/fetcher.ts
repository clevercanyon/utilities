/**
 * Fetcher utility class.
 */

import { json as $toꓺjson } from '../../to.js';
import { isWeb as $envꓺisWeb } from '../../env.js';
import { sha1 as $cryptoꓺsha1 } from '../../crypto.js';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { getClass as $classꓺgetUtility } from './utility.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { get as $obpꓺget, toScriptCode as $obpꓺtoScriptCode } from '../../obp.js';

import type * as $type from '../../type.js';
import type { Interface as $classꓺUtilityInterface } from './utility.js';

let Class: Constructor | undefined; // Class definition cache.

/**
 * Defines types.
 */
export type C9rProps = {
	readonly globalObp?: $type.ObjectPath;
	readonly autoReplaceNativeFetch?: boolean;
};
export type Constructor = {
	new (props?: C9rProps): Interface;
};
export declare class Interface extends $classꓺUtilityInterface {
	public readonly global: Global;
	public readonly globalObp: $type.ObjectPath;

	public constructor(props?: C9rProps);

	public replaceNativeFetch(): void;
	public restoreNativeFetch(): void;
	public globalToScriptCode(): string;

	public fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']>;
}
export type Global = $type.Object<{
	cache: Map<string, GlobalCacheEntry>;
	nativeFetch: (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;
	pseudoFetch: (...args: Parameters<typeof fetch | typeof $type.cfw.fetch>) => Promise<Response | $type.cfw.Response>;
}>;
export type GlobalCacheEntry = {
	body: string;
	options: {
		status: number;
		headers: [string, string][];
	};
};

/**
 * Fetcher class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
	if (Class) return Class;

	Class = class extends $classꓺgetUtility() implements Interface {
		/**
		 * Global object.
		 */
		public readonly global: Global;

		/**
		 * Global object path.
		 */
		public readonly globalObp: $type.ObjectPath;

		/**
		 * Object constructor.
		 *
		 * @param props Props or {@see Interface} instance.
		 */
		public constructor(props?: C9rProps | Interface) {
			super(props); // Parent constructor.

			if (props instanceof (Class as Constructor)) {
				this.global = props.global;
				this.globalObp = props.globalObp;
				return; // Stop here; there's nothing more to do.
			}
			this.globalObp = (props || {}).globalObp || $strꓺobpPartSafe($appꓺpkgName) + '.fetcher';
			this.global = $obpꓺget(globalThis, this.globalObp, {}) as Global;

			this.global.cache = this.global.cache || new Map();
			this.global.nativeFetch = globalThis.fetch; // Stores a reference to current native fetch.
			this.global.pseudoFetch = async (...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']> => this.fetch(...args);

			if (this.autoReplaceNativeFetch) {
				this.replaceNativeFetch();
			}
		}

		/**
		 * Replaces native fetch.
		 */
		public replaceNativeFetch(): void {
			// Sets `nativeFetch` again, in case it was swapped since constructor ran; e.g., when unit testing.
			this.global.nativeFetch = globalThis.fetch; // Stores a reference to current native fetch.

			globalThis.fetch = this.global.pseudoFetch as typeof fetch;
		}

		/**
		 * Restores native fetch.
		 */
		public restoreNativeFetch(): void {
			globalThis.fetch = this.global.nativeFetch as typeof fetch;
		}

		/**
		 * Converts global into embeddable script code.
		 *
		 * @returns Global as embeddable script code; i.e., for SSR.
		 */
		public globalToScriptCode(): string {
			const globalObpScriptCode = $obpꓺtoScriptCode(this.globalObp);

			let scriptCode = globalObpScriptCode.init; // Initialize.
			scriptCode += ' ' + globalObpScriptCode.set + '.cache = ' + $toꓺjson(this.global.cache) + ';';

			return scriptCode;
		}

		/**
		 * Used to wrap native {@see fetch()} in JS.
		 *
		 * @param   args Same as {@see fetch()} native function.
		 *
		 * @returns      Same as {@see fetch()} native function.
		 */
		public async fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']> {
			const hash = await $cryptoꓺsha1($toꓺjson(args));

			if (this.global.cache.has(hash)) {
				const globalCacheEntry = this.global.cache.get(hash) as GlobalCacheEntry;
				return new Response(globalCacheEntry.body, globalCacheEntry.options);
			}
			const response = await this.global.nativeFetch(...(args as Parameters<Global['nativeFetch']>));
			if ($envꓺisWeb()) return response; // No cache writes client side.

			const contentType = (response.headers.get('content-type') || '').toLowerCase();
			const allowedTextMIMETypes = ['text/plain', 'application/json', 'application/ld+json', 'image/svg+xml', 'application/xml', 'text/xml'];

			if (!allowedTextMIMETypes.includes(contentType.split(';')[0])) {
				return response; // Don't cache responses that aren't text-based; i.e., not in list above.
			}
			const globalCacheEntry: GlobalCacheEntry = {
				body: await response.text(), // Body as plain text.
				options: { status: response.status, headers: [['content-type', contentType]] },
			};
			this.global.cache.set(hash, globalCacheEntry);
			return new Response(globalCacheEntry.body, globalCacheEntry.options);
		}
	};
	return Object.defineProperty(Class, 'name', {
		...Object.getOwnPropertyDescriptor(Class, 'name'),
		value: 'Fetcher',
	});
};
