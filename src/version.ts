/**
 * Version utilities.
 */

import '#@initialize.ts';

export { default as $ } from 'semver';

export { default as isValid } from 'semver/functions/valid.js';

export { default as compare } from 'semver/functions/cmp.js';
export { default as increment } from 'semver/functions/inc.js';

export { default as major } from 'semver/functions/major.js';
export { default as minor } from 'semver/functions/minor.js';
export { default as patch } from 'semver/functions/patch.js';
export { default as prerelease } from 'semver/functions/prerelease.js';

export { default as rsort } from 'semver/functions/rsort.js';
export { default as sort } from 'semver/functions/sort.js';
