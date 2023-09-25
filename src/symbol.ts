/**
 * Symbol utilities.
 */

import { $app } from './index.ts';

export const objTag: unique symbol = Symbol.for($app.pkgName + '/objTag');
export const objStringTag: symbol = Symbol.toStringTag; // Baked into JS.

export const objToPlain: unique symbol = Symbol.for($app.pkgName + '/objToPlain');
export const objToEquals: unique symbol = Symbol.for($app.pkgName + '/objToEquals');
export const objToJSON = 'toJSON'; // Not symbol, but string literal in this case.
export const objToClone: unique symbol = Symbol.for($app.pkgName + '/objToClone');
