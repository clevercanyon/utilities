/**
 * Fetcher utility class.
 */

import type * as $type from '../../type.js';
import { json as $toꓺjson } from '../../to.js';
import { md5 as $cryptoꓺmd5 } from '../../crypto.js';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { getClass as $classꓺgetUtility } from './utility.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { get as $obpꓺget, toCode as $obpꓺtoCode } from '../../obp.js';
import type { Interface as $classꓺUtilityInterface } from './utility.js';

let Class: Constructor; // Class definition cache.

/**
 * Defines types.
 */
export type Props = {
	readonly global: Global;
	readonly globalObp: $type.ObjectPath;
};
export type C9rProps = {
	readonly globalObp?: $type.ObjectPath;
	readonly autoReplaceNativeFetch: boolean;
};
export type Constructor = {
	new (props?: C9rProps): Interface;
};
export type Interface = Props &
	$classꓺUtilityInterface & {
		replaceNativeFetch(): void;
		restoreNativeFetch(): void;
		globalToScriptCode(): string;
		globalToScriptTag(): string;
		fetch(...args: Parameters<Global['pseudoFetch']>): ReturnType<Global['pseudoFetch']>;
	};
export type Global = $type.Object<{
	cache: Map<string, GlobalCacheEntry>;
	nativeFetch: typeof fetch;
	pseudoFetch: typeof fetch;
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

			if (props instanceof Class) {
				this.global = props.global;
				this.globalObp = props.globalObp;
				return; // Stop here; there's nothing more to do.
			}
			this.globalObp = (props as C9rProps).globalObp || $strꓺobpPartSafe($appꓺpkgName) + '.fetcher';
			this.global = $obpꓺget(globalThis, this.globalObp, {}) as Global;

			this.global.cache = this.global.cache || new Map();
			this.global.nativeFetch = globalThis.fetch; // Stores a reference to native fetch.
			this.global.pseudoFetch = ((...args) => this.fetch(...(args as Parameters<Global['pseudoFetch']>))) as Global['pseudoFetch'];

			if (this.autoReplaceNativeFetch) {
				this.replaceNativeFetch();
			}
		}

		/**
		 * Replaces native fetch.
		 */
		public replaceNativeFetch(): void {
			globalThis.fetch = this.global.pseudoFetch;
		}

		/**
		 * Restores native fetch.
		 */
		public restoreNativeFetch(): void {
			globalThis.fetch = this.global.nativeFetch;
		}

		/**
		 * Converts global into embeddable script code.
		 *
		 * @returns Global as embeddable script code; i.e., for SSR.
		 */
		public globalToScriptCode(): string {
			const code = $obpꓺtoCode(this.globalObp);

			let scriptCode = code.init; // Initialize.
			scriptCode += ' ' + code.set + '.cache = ' + $toꓺjson(this.global.cache) + ';';

			return scriptCode;
		}

		/**
		 * Converts global into an embeddable script tag.
		 *
		 * @returns Global as an embeddable script tag; i.e., for SSR.
		 */
		public globalToScriptTag(): string {
			return '<script>' + this.globalToScriptCode() + '</script>';
		}

		/**
		 * Used to wrap native {@see fetch()} in JS.
		 *
		 * @param   args Same as {@see fetch()} native function.
		 *
		 * @returns      Same as {@see fetch()} native function.
		 */
		public async fetch(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
			const hash = $cryptoꓺmd5($toꓺjson(args));

			if (this.global.cache.has(hash)) {
				const globalCacheEntry = this.global.cache.get(hash) as GlobalCacheEntry;
				return new Response(globalCacheEntry.body, globalCacheEntry.options);
			}
			const response = await this.global.nativeFetch(...args);
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
