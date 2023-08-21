/**
 * Fetcher utility class.
 */

import type * as $type from '../../type.js';
import { json as $toꓺjson } from '../../to.js';
import { number as $isꓺnumber } from '../../is.js';
import { md5 as $cryptoꓺmd5 } from '../../crypto.js';
import { objTag as $symbolꓺobjTag } from '../../symbol.js';
import { getClass as $classꓺgetUtility } from './utility.js';
import type { Interface as $classꓺUtilityInterface } from './utility.js';
import { get as $obpꓺget, splitPath as $obpꓺsplitPath } from '../../obp.js';

let Class: Constructor; // Class definition cache.

/**
 * Defines types.
 */
export type Props = {
	readonly container: Container;
	readonly containerObp: $type.ObjectPath;
};
export type C9rProps = {
	readonly containerObp?: $type.ObjectPath;
};
export type Constructor = {
	new (props?: C9rProps): Interface;
};
export type Interface = Props &
	$classꓺUtilityInterface & {
		replaceNativeFetch(): void;
		restoreNativeFetch(): void;
		containerCacheToScriptTag(): string;
		fetch(...args: Parameters<Container['pseudoFetch']>): ReturnType<Container['pseudoFetch']>;
	};
export type Container = $type.Object<{
	cache: Map<string, FetchCacheObject>;
	nativeFetch: typeof fetch;
	pseudoFetch: typeof fetch;
}>;
export type FetchCacheObject = {
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
		 * Container object.
		 */
		public readonly container: Container;

		/**
		 * Container object path.
		 */
		public readonly containerObp: $type.ObjectPath;

		/**
		 * Object constructor.
		 *
		 * @param props Props or {@see Interface} instance.
		 */
		public constructor(props?: C9rProps | Interface) {
			super(props); // Parent constructor.

			if (props instanceof Class) {
				this.container = props.container;
				this.containerObp = props.containerObp;
				return; // Stop here; there's nothing more to do.
			}
			this.containerObp = (props as C9rProps).containerObp || this[$symbolꓺobjTag];

			if (!(this.container = $obpꓺget(globalThis, this.containerObp) as Container)) {
				throw new Error('Missing container.');
			}
			this.container.cache = this.container.cache || new Map();
			this.container.nativeFetch = globalThis.fetch; // Stores a reference to native fetch.
			this.container.pseudoFetch = ((...args) => this.fetch(...(args as Parameters<Container['pseudoFetch']>))) as Container['pseudoFetch'];
		}

		/**
		 * Replaces native fetch.
		 */
		public replaceNativeFetch(): void {
			globalThis.fetch = this.container.pseudoFetch;
		}

		/**
		 * Restores native fetch.
		 */
		public restoreNativeFetch(): void {
			globalThis.fetch = this.container.nativeFetch;
		}

		/**
		 * Converts container cache into an embeddable script tag.
		 *
		 * @returns Container cache as an embeddable script tag.
		 */
		public containerCacheToScriptTag(): string {
			let containerObpVar = 'globalThis';
			const parts = $obpꓺsplitPath(this.containerObp);

			let scriptTag = '<script>'; // Initialize.
			for (let i = 0; i < parts.length; i++) {
				containerObpVar += $isꓺnumber(parts[i]) ? '[' + String(parts[i]) + ']' : "['" + String(parts[i]) + "']";
				scriptTag += '\t\n' + containerObpVar + ' = ' + containerObpVar + ' || {};';
			}
			scriptTag += '\t\n' + containerObpVar + '.cache = ' + $toꓺjson(this.container.cache) + ';';
			scriptTag += '\n' + '</script>';

			return scriptTag;
		}

		/**
		 * Used to wrap native `fetch()` in JS.
		 *
		 * @param   args Same as {@see fetch()} native function.
		 *
		 * @returns      Same as {@see fetch()} native function.
		 */
		public async fetch(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
			const hash = $cryptoꓺmd5($toꓺjson(args));

			if (this.container.cache.has(hash)) {
				const { body, options } = this.container.cache.get(hash) as FetchCacheObject;
				return new Response(body, options);
			}

			const fetchResponse = await this.container.nativeFetch(...args);; // @todo is this the proper fetch method to await?

			const allowedMimeTypes = [
				'text/plain',
				'application/json',
				'application/ld+json',
				'image/svg+xml',
				'application/xml',
				'text/xml',
			];

			if (!allowedMimeTypes.includes(fetchResponse.headers.get('content-type') as string)) {
				return fetchResponse; // Don't cache responses from fetch requests that might be non-stringifyable.
			}

			const responseRecord = {
				body: await fetchResponse.text(), // Response body stored in plain text, JSON.stringify compatible.
				options: {
					status: fetchResponse.status,
					headers: [
						['content-type', fetchResponse.headers.get('content-type')],
					] as [string, string][],
				}
			};

			this.container.cache.set(hash, responseRecord);
			return new Response(responseRecord.body, responseRecord.options);
		}
	};
	return Object.defineProperty(Class, 'name', {
		...Object.getOwnPropertyDescriptor(Class, 'name'),
		value: 'Fetcher',
	});
};
