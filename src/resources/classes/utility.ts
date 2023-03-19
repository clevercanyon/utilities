/**
 * Utility class.
 */

import { pkgName as $appꓺpkgName } from '../../app.js';
import { getClass as $classꓺgetBase } from './base.js';
import type { Interface as $classꓺBaseInterface } from './base.js';

let Class: Constructor; // Class definition cache.

/**
 * Defines types.
 */
export type Constructor = {
	new (props?: object | Interface): Interface;
};
export interface Interface extends $classꓺBaseInterface {}

/**
 * Utility class factory.
 *
 * @returns {@see Constructor} Definition.
 */
export const getClass = (): Constructor => {
	if (Class) return Class;

	Class = class extends $classꓺgetBase() implements Interface {
		/**
		 * App package name.
		 */
		static appPkgName = $appꓺpkgName;

		/**
		 * Object constructor.
		 *
		 * @param props Props or {@see Interface} instance.
		 */
		public constructor(props?: object | Interface) {
			super(props);
		}
	};
	return Object.defineProperty(Class, 'name', {
		...Object.getOwnPropertyDescriptor(Class, 'name'),
		value: 'Utility',
	});
};
