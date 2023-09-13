/**
 * Fetcher utility class.
 */

import { pkgName as $appꓺpkgName } from '../../app.ts';
import { sha1 as $cryptoꓺsha1 } from '../../crypto.ts';
import { isWeb as $envꓺisWeb } from '../../env.ts';
import type { $type } from '../../index.ts';
import { stringify as $jsonꓺstringify } from '../../json.ts';
import { hasOwn as $objꓺhasOwn } from '../../obj.ts';
import { get as $obpꓺget, toScriptCode as $obpꓺtoScriptCode } from '../../obp.ts';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.ts';
import type { Interface as $classꓺUtilityInterface } from './utility.ts';
import { getClass as $classꓺgetUtility } from './utility.ts';

let Class: Constructor | undefined; // Class definition cache.

/**
 * Defines types.
 */
export type C9rProps = {
	readonly globalObp?: $type.ObjectPath;
	readonly autoReplaceNativeFetch?: boolean;
};
export type Constructor = {
	new (props?: C9rProps | Interface): Interface;
};
export declare class Interface extends $classꓺUtilityInterface {
	public readonly global: Global;
	public readonly globalObp: $type.ObjectPath;
	public readonly autoReplaceNativeFetch: boolean;

	public constructor(props?: C9rProps | Interface);

	public replaceNativeFetch(): void;
	public restoreNativeFetch(): void;
	public globalToScriptCode(): string;

	public fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']>;
}
export type Global = $type.Object<{
	cache: { [x: string]: GlobalCacheEntry };
	nativeFetch: (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;
	pseudoFetch: (...args: Parameters<typeof fetch | typeof $type.cf.fetch>) => Promise<Response | $type.cf.Response>;
}>;
export type GlobalCacheEntry = {
	body: string;
	options: {
		status: number;
		headers: { [x: string]: string };
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
		 * Auto-replace native fetch?
		 */
		public readonly autoReplaceNativeFetch: boolean;

		/**
		 * Object constructor.
		 *
		 * @param props Props or {@see Interface} instance.
		 */
		public constructor(props?: C9rProps | Interface) {
			super(); // Parent constructor.

			props = props || {}; // Force object value.
			const isClone = props instanceof (Class as Constructor);

			this.globalObp = props.globalObp || $strꓺobpPartSafe($appꓺpkgName) + '.fetcher';
			this.global = $obpꓺget(globalThis, this.globalObp, {}) as Global; // Default is `{}`.

			this.global.cache = this.global.cache || {}; // Initializes cache when unavailable.
			this.global.nativeFetch = globalThis.fetch; // Stores a reference to current native fetch.
			this.global.pseudoFetch = async (...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']> => this.fetch(...args);

			this.autoReplaceNativeFetch = isClone ? false : props.autoReplaceNativeFetch || false;

			if (this.autoReplaceNativeFetch) {
				this.replaceNativeFetch();
			}
		}

		/**
		 * Replaces native fetch.
		 *
		 * @note Sets `nativeFetch` again, in case it was swapped since constructor ran; e.g., when unit testing.
		 */
		public replaceNativeFetch(): void {
			this.global.nativeFetch = globalThis.fetch;
			globalThis.fetch = this.global.pseudoFetch as typeof fetch;
		}

		/**
		 * Restores native fetch.
		 *
		 * @note Also resets the global cache.
		 */
		public restoreNativeFetch(): void {
			this.global.cache = {}; // Resets cache.
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
			scriptCode += ' ' + globalObpScriptCode.set + '.cache = ' + $jsonꓺstringify(this.global.cache) + ';';

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
			const hash = await $cryptoꓺsha1($jsonꓺstringify(args));

			if ($objꓺhasOwn(this.global.cache, hash)) {
				const globalCacheEntry = this.global.cache[hash];
				return new Response(globalCacheEntry.body, globalCacheEntry.options);
			}
			if ($envꓺisWeb() /* No cache writes client-side, so no await either. */) {
				return this.global.nativeFetch(...(args as Parameters<Global['nativeFetch']>));
			}
			const response = await this.global.nativeFetch(...(args as Parameters<Global['nativeFetch']>));

			const contentType = (response.headers.get('content-type') || '').toLowerCase();
			const contentMIMEType = contentType.split(';')[0]; // Removes a possible `; charset=utf-8`, for example.
			const allowedMIMETypes = ['text/plain', 'application/json', 'application/ld+json', 'image/svg+xml', 'application/xml', 'text/xml'];

			if (!allowedMIMETypes.includes(contentMIMEType)) {
				return response; // Don't cache MIME types not in list above.
			}
			const globalCacheEntry: GlobalCacheEntry = {
				body: await response.text(), // Body as plain text.
				options: { status: response.status, headers: { 'content-type': contentType } },
			};
			(this.global.cache as Global['cache'])[hash] = globalCacheEntry;
			return new Response(globalCacheEntry.body, globalCacheEntry.options);
		}
	};
	return Object.defineProperty(Class, 'name', {
		...Object.getOwnPropertyDescriptor(Class, 'name'),
		value: 'Fetcher',
	});
};
