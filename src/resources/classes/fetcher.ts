/**
 * Fetcher utility class.
 */

import type * as $type from '../../type.js';
import { json as $toꓺjson } from '../../to.js';
import { number as $isꓺnumber } from '../../is.js';
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
export type Interface = Props & $classꓺUtilityInterface;

export type Container = $type.Object<{
	cache: Map<string, string>;
	fetch: (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;
}>;

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
			this.container.fetch = ((...args) => this.fetch(...args)) as Container['fetch'];
		}

		/**
		 * Converts container into a script tag.
		 *
		 * @returns Container cache as a script tag.
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
			// @todo Caching reads and write using `this.container.cache`.
			return fetch(...args);
		}
	};
	return Object.defineProperty(Class, 'name', {
		...Object.getOwnPropertyDescriptor(Class, 'name'),
		value: 'Fetcher',
	});
};
