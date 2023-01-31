/**
 * Utility class.
 */

import mm from 'micromatch';

/**
 * Micromatch types.
 */
export type { Options } from 'micromatch';

/**
 * Micromatch utilities.
 */
export const match: typeof mm = mm; // Default micromatch API.

export const matcher: typeof mm.matcher = (...args: Parameters<typeof mm.matcher>): ReturnType<typeof mm.matcher> => mm.matcher(...args);
export const isMatch: typeof mm.isMatch = (...args: Parameters<typeof mm.isMatch>): ReturnType<typeof mm.isMatch> => mm.isMatch(...args);
export const not: typeof mm.not = (...args: Parameters<typeof mm.not>): ReturnType<typeof mm.not> => mm.not(...args);
export const contains: typeof mm.contains = (...args: Parameters<typeof mm.contains>): ReturnType<typeof mm.contains> => mm.contains(...args);
export const matchKeys: typeof mm.matchKeys = (...args: Parameters<typeof mm.matchKeys>): ReturnType<typeof mm.matchKeys> => mm.matchKeys(...args);
export const some: typeof mm.some = (...args: Parameters<typeof mm.some>): ReturnType<typeof mm.some> => mm.some(...args);
export const every: typeof mm.every = (...args: Parameters<typeof mm.every>): ReturnType<typeof mm.every> => mm.every(...args);
export const all: typeof mm.all = (...args: Parameters<typeof mm.all>): ReturnType<typeof mm.all> => mm.all(...args);
export const capture: typeof mm.capture = (...args: Parameters<typeof mm.capture>): ReturnType<typeof mm.capture> => mm.capture(...args);
export const makeRe: typeof mm.makeRe = (...args: Parameters<typeof mm.makeRe>): ReturnType<typeof mm.makeRe> => mm.makeRe(...args);

// We don't use any of these low-level APIs directly, so excluding.
// export const scan: typeof mm.scan = (...args: Parameters<typeof mm.scan>): ReturnType<typeof mm.scan> => mm.scan(...args);
// export const parse: typeof mm.parse = (...args: Parameters<typeof mm.parse>): ReturnType<typeof mm.parse> => mm.parse(...args);
// export const braces: typeof mm.braces = (...args: Parameters<typeof mm.braces>): ReturnType<typeof mm.braces> => mm.braces(...args);
