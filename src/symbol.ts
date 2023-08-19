/**
 * Symbol utilities.
 */

export const objAppPkgName: unique symbol = Symbol('objAppPkgName');
export const objTag: unique symbol = Symbol('objTag');
export const objStringTag: symbol = Symbol.toStringTag;

export const objToJSON = 'toJSON'; // String literal.
export const objToPlain: unique symbol = Symbol('objToPlain');
export const objToClone: unique symbol = Symbol('objToClone');
