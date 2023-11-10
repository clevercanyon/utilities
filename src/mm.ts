/**
 * Micromatch utilities.
 *
 * Adds approximately 35kbs to bundle size.
 */

import './resources/init.ts';

import { default as mm, type Options as MMOptions } from 'micromatch';
import { $obj } from './index.ts';

/**
 * Defines types.
 *
 * @option-deprecated 2023-09-16 `nocase` option deprecated in favor of `ignoreCase`. The `nocase` option will continue to
 *   work, however, as it’s part of the micromatch library that powers this utility. We just prefer to use `ignoreCase`,
 *   in order to be consistent with other utilities we offer that have the option to ignore caSe.
 */
export type Options = Omit<MMOptions, 'nocase'> & { ignoreCase?: boolean };

/**
 * Returns true if any globs match the test string.
 *
 * @param   string  A single test string.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         True if any globs match the test string.
 */
export const any = (string: string, globs: string | string[], options?: Options): ReturnType<typeof mm.isMatch> => {
    return mm.any(string, globs, mmOptions(options));
};
export { any as isMatch }; // `any` === `isMatch` alias.

/**
 * Returns true if any globs match the test string.
 *
 * Almost the same as {@see any()}, but with `{ dot: true }` on by default. Also, this is an exact replica of our other
 * utility {@see $str.test()}, but in this case for globs. Please lean in the direction of using regular expressions
 * instead of depending on globs, when possible, as the underlying Micromatch library adds about 35kbs to a bundle.
 *
 * @param   string  A single test string.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 *   - Default options are: `{ dot: true }`.
 *
 * @returns         True if any globs match the test string.
 */
export const test = (string: string, globs: string | string[], options?: Options): boolean => {
    return any(string, globs, { dot: true, ...options });
};

/**
 * Returns true if any globs match any part of the test string.
 *
 * Similar to {@see any()}, {@see isMatch()}, but the globs can match any part of the test string.
 *
 * @param   string  A single test string.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         True if any globs match any part of the test string.
 */
export const contains = (string: string, globs: string | string[], options?: Options): ReturnType<typeof mm.contains> => {
    return mm.contains(string, globs, mmOptions(options));
};

/**
 * Returns true if all globs match the test string.
 *
 * @param   string  A single test string.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         True if all globs match the test string.
 */
export const all = (string: string, globs: string | string[], options?: Options): ReturnType<typeof mm.all> => {
    return mm.all(string, globs, mmOptions(options));
};

/**
 * Returns true if some test strings match at least one of the globs.
 *
 * @param   strings String or array of strings.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         True if some test strings match at least one of the globs.
 */
export const some = (strings: string | string[], globs: string | string[], options?: Options): ReturnType<typeof mm.some> => {
    return mm.some(strings, globs, mmOptions(options));
};

/**
 * Returns true if every test string matches at least one of the globs.
 *
 * @param   strings String or array of strings.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         True if every test string matches at least one of the globs.
 */
export const every = (strings: string | string[], globs: string | string[], options?: Options): ReturnType<typeof mm.every> => {
    return mm.every(strings, globs, mmOptions(options));
};

/**
 * Returns an array of test strings that match any of the globs.
 *
 * This is the default API exported by Micromatch.
 *
 * @param   strings String or array of strings.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         An array of test strings that match any of the globs.
 */
export const match = (strings: string | string[], globs: string | string[], options?: Options): ReturnType<typeof mm.match> => {
    // @ts-ignore -- Ignore broken minimatch types, because `match()` takes strings or arrays.
    return mm.match(strings, globs, mmOptions(options));
};

/**
 * Returns a shallow clone of the object, only containing keys that match any of the globs.
 *
 * @param   object  A plain object with test string keys.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         A shallow clone of the object, only containing keys that match any of the globs.
 */
export const matchKeys = (object: object, globs: string | string[], options?: Options): ReturnType<typeof mm.matchKeys> => {
    return mm.matchKeys(object, globs, mmOptions(options));
};

/**
 * Returns an array of test strings that do not match any of the globs.
 *
 * @param   strings String or array of strings.
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         An array of test strings that do not match any of the globs.
 */
export const not = (strings: string | string[], globs: string | string[], options?: Options): ReturnType<typeof mm.not> => {
    // @ts-ignore -- Ignore broken minimatch types, because `not()` takes strings or arrays.
    return mm.not(strings, globs, mmOptions(options));
};

/**
 * Returns an array of matches captured by the glob, or `null` if the glob does not match.
 *
 * @param   glob    A single glob pattern.
 * @param   string  A single test string.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         An array of matches captured by the glob, or `null` if the glob does not match.
 *
 *   - 'Captures' are defined as glob expressions matching an unknown.
 *   - Example: `$mm.capture('foo/*.*', 'bar/baz.js');` ... returns: `null`.
 *   - Example: `$mm.capture('foo/*.*', 'foo/bar.js');` ... returns: `['bar', 'js']`.
 */
export const capture = (glob: string, string: string, options?: Options): ReturnType<typeof mm.capture> => {
    return mm.capture(glob, string, mmOptions(options));
};

/**
 * Returns an array of glob abstract syntax trees.
 *
 * @param   globs   String or array of globs.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         An array of glob abstract syntax trees.
 */
export const parse = (globs: string | string[], options?: Options): object[] => {
    // @ts-ignore -- Ignore broken minimatch types. This returns an array of objects.
    return mm.parse(globs, mmOptions(options));
};

/**
 * Returns a glob’s equivalent regular expression.
 *
 * @param   glob    A single glob pattern.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         Glob’s equivalent regular expression.
 */
export const makeRe = (glob: string, options?: Options): ReturnType<typeof mm.makeRe> => {
    return mm.makeRe(glob, mmOptions(options));
};

/**
 * Returns a matcher function using a given glob and options.
 *
 * @param   glob    A single glob pattern.
 * @param   options Options (all optional); {@see Options}.
 *
 * @returns         A matcher function that takes a single test string as its only argument and returns true if the test
 *   string matches the original `glob` and `options` passed in to create the matcher.
 */
export const matcher = (glob: string, options?: Options): ReturnType<typeof mm.matcher> => {
    return mm.matcher(glob, mmOptions(options));
};

/**
 * Remaining exports from micromatch library, which do not require further adjustment. Each of these takes in a
 * different kind of options object. Therefore, there is simply no reason to encapsulate these any further.
 */
export { braces, scan } from 'micromatch'; // Also, these are used rarely.

// ---
// Misc utilities.

/**
 * Produces micromatch options.
 *
 * @param   options {@see Options}.
 *
 * @returns         Micromatch options; {@see MMOptions}.
 */
const mmOptions = (options?: Options): MMOptions => {
    let mmOptions: MMOptions = { ...$obj.omit(options || {}, ['ignoreCase']) };

    if (options && Object.hasOwn(options, 'ignoreCase')) {
        mmOptions.nocase = options.ignoreCase;
    }
    return mmOptions;
};
