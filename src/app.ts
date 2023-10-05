/**
 * App utilities.
 */

import './resources/init.ts';

import { $str } from './index.ts';
import * as $standalone from './resources/standalone/index.ts';

/**
 * Clever Canyon utilities package name.
 */
export const pkgName = $standalone.$appꓺpkgName;

/**
 * Gets slug from a `./package.json` package name.
 *
 * E.g., `@org/[slug]` from a scoped package name, or `slug` from an unscoped package name.
 *
 * @param   pkgName A `./package.json` package name.
 *
 * @returns         Slug from package name.
 */
export const pkgSlug = (pkgName: string): string => {
    return $str.kebabCase(pkgName.replace(/^@/u, '').split('/')[1] || pkgName, { asciiOnly: true, letterFirst: 'x' });
};
