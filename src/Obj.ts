/**
 * Object utilities.
 */

import { default as mc } from 'merge-change';

/**
 * Extracts lodash utilities.
 */
export { default as assign } from 'lodash/assign.js';
export { default as assignIn } from 'lodash/assignIn.js';
export { default as assignInWith } from 'lodash/assignInWith.js';
export { default as assignWith } from 'lodash/assignWith.js';
export { default as at } from 'lodash/at.js';
export { default as clone } from 'lodash/clone.js';
export { default as cloneDeep } from 'lodash/cloneDeep.js';
export { default as cloneDeepWith } from 'lodash/cloneDeepWith.js';
export { default as cloneWith } from 'lodash/cloneWith.js';
export { default as create } from 'lodash/create.js';
export { default as defaults } from 'lodash/defaults.js';
export { default as defaultsDeep } from 'lodash/defaultsDeep.js';
export { default as entries } from 'lodash/toPairs.js';
export { default as entriesIn } from 'lodash/toPairsIn.js';
export { default as extend } from 'lodash/assignIn.js';
export { default as extendWith } from 'lodash/assignInWith.js';
export { default as findKey } from 'lodash/findKey.js';
export { default as findLastKey } from 'lodash/findLastKey.js';
export { default as forIn } from 'lodash/forIn.js';
export { default as forInRight } from 'lodash/forInRight.js';
export { default as forOwn } from 'lodash/forOwn.js';
export { default as forOwnRight } from 'lodash/forOwnRight.js';
export { default as functions } from 'lodash/functions.js';
export { default as functionsIn } from 'lodash/functionsIn.js';
export { default as get } from 'lodash/get.js';
export { default as has } from 'lodash/has.js';
export { default as hasIn } from 'lodash/hasIn.js';
export { default as invert } from 'lodash/invert.js';
export { default as invertBy } from 'lodash/invertBy.js';
export { default as invoke } from 'lodash/invoke.js';
export { default as keys } from 'lodash/keys.js';
export { default as keysIn } from 'lodash/keysIn.js';
export { default as mapKeys } from 'lodash/mapKeys.js';
export { default as mapValues } from 'lodash/mapValues.js';
export { default as merge } from 'lodash/merge.js';
export { default as mergeWith } from 'lodash/mergeWith.js';
export { default as omit } from 'lodash/omit.js';
export { default as omitBy } from 'lodash/omitBy.js';
export { default as pick } from 'lodash/pick.js';
export { default as pickBy } from 'lodash/pickBy.js';
export { default as result } from 'lodash/result.js';
export { default as set } from 'lodash/set.js';
export { default as setWith } from 'lodash/setWith.js';
export { default as toPairs } from 'lodash/toPairs.js';
export { default as toPairsIn } from 'lodash/toPairsIn.js';
export { default as transform } from 'lodash/transform.js';
export { default as unset } from 'lodash/unset.js';
export { default as update } from 'lodash/update.js';
export { default as updateWith } from 'lodash/updateWith.js';
export { default as values } from 'lodash/values.js';
export { default as valuesIn } from 'lodash/valuesIn.js';

/**
 * Merge-change instance.
 */
export { default as mc } from 'merge-change';

/**
 * Lifts up these merge-change utilities.
 */
export const flatten: typeof mc.u.flatten = mc.u.flatten.bind(mc.u);

/**
 * Gets object's own enumerable string-keyed properties.
 *
 * @param   obj Object with props.
 *
 * @returns     Object's own enumerable string-keyed properties.
 */
export function props(obj: URLSearchParams): { [x: string]: string };
export function props(obj: object): { [x: string]: unknown } {
	if (obj instanceof URLSearchParams) {
		return Object.fromEntries(obj.entries());
	}
	return Object.fromEntries(Object.entries(obj));
}
