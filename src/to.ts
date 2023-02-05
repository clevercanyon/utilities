/**
 * Data conversion utilities.
 */

import { defaults as $objꓺdefaults } from './obj.js';
import { default as _ꓺtoPlainObject } from 'lodash/toPlainObject.js';

/**
 * Extracts lodash utilities.
 */
export { default as array } from 'lodash/toArray.js';
export { default as castArray } from 'lodash/castArray.js';
export { default as pathArray } from 'lodash/toPath.js';
export { default as finite } from 'lodash/toFinite.js';
export { default as integer } from 'lodash/toInteger.js';
export { default as length } from 'lodash/toLength.js';
export { default as number } from 'lodash/toNumber.js';
export { default as safeInteger } from 'lodash/toSafeInteger.js';
export { default as string } from 'lodash/toString.js';

/**
 * Converts a value into a plain object.
 *
 * @param   value Value to convert to a plain object.
 * @param   opts  Options (all optional). Default is `{ deep: true }`.
 *
 * @returns       Plain non-nil object.
 */
export const plainObject = (value?: unknown, opts: { deep?: boolean } = {}): { [x: string]: unknown } => {
	opts = $objꓺdefaults({}, opts, { deep: true });
	const obj = _ꓺtoPlainObject(value) as { [x: string]: unknown };

	if (opts.deep /* Convert deeply? */) {
		for (const [prop, value] of Object.entries(obj)) {
			if (value && typeof value === 'object') {
				obj[prop] = plainObject(value, opts);
			}
		}
	}
	return obj;
};
