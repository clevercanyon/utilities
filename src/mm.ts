/**
 * Micromatch utilities.
 */

import mm from 'micromatch';

/**
 * Micromatch types.
 *
 * Re-export in case needed by callers.
 */
export type { Options } from 'micromatch';

/**
 * Micromatch utilities.
 *
 * We re-export micromatch utilities from Clever Canyon utilities because we’re using a fork of our own that's not
 * reliant upon Node built-ins. For this reason, using our fork takes some additional effort due to required aliasing in
 * `./package.json`. To avoid that ongoing confusion/hassle, we bundle it with our own utilities and re-export here.
 */

export const match: typeof mm = mm.bind(null);
export default match; // Default micromatch API.

export const all: typeof mm.all = mm.all.bind(null);
export const braces: typeof mm.braces = mm.braces.bind(null);
export const capture: typeof mm.capture = mm.capture.bind(null);
export const contains: typeof mm.contains = mm.contains.bind(null);
export const every: typeof mm.every = mm.every.bind(null);
export const isMatch: typeof mm.isMatch = mm.isMatch.bind(null);
export const makeRe: typeof mm.makeRe = mm.makeRe.bind(null);
export const matcher: typeof mm.matcher = mm.matcher.bind(null);
export const matchKeys: typeof mm.matchKeys = mm.matchKeys.bind(null);
export const not: typeof mm.not = mm.not.bind(null);
export const parse: typeof mm.parse = mm.parse.bind(null);
export const scan: typeof mm.scan = mm.scan.bind(null);
export const some: typeof mm.some = mm.some.bind(null);
