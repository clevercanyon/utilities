/**
 * Memoization utilities.
 */

import { circularDeepEqual, circularShallowEqual } from 'fast-equals';
import type { Moize } from 'moize';
import untypedMoize from 'moize';

const moize = untypedMoize as unknown as Moize;

/**
 * Exports memoization library w/ support for circular refs.
 *
 * By default, Moize uses `deepEqual()` and `shallowEqual()` from the Fast Equals package. Those utilities are faster,
 * but they don’t support circular references, which is why `matchesArg` is set explicitly. i.e., `circularDeepEqual()`
 * and `circularShallowEqual()` point to our favored circular variants in the Fast Equals package.
 *
 * @see https://o5p.me/qhTbMT
 */
export const $ = moize; // Full set of utilities.

export const svz = moize({ updateExpire: true }); // Same value zero.
export const svzAsync = moize({ isPromise: true, updateExpire: true });

export const shallow = moize({ isShallowEqual: true, matchesArg: circularShallowEqual, updateExpire: true });
export const shallowAsync = moize({ isPromise: true, isShallowEqual: true, matchesArg: circularShallowEqual, updateExpire: true });

export const deep = moize({ isDeepEqual: true, matchesArg: circularDeepEqual, updateExpire: true });
export const deepAsync = moize({ isPromise: true, isDeepEqual: true, matchesArg: circularDeepEqual, updateExpire: true });
