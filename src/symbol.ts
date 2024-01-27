/**
 * Symbol utilities.
 */
// organize-imports-ignore

import '#@initialize.ts';

export {
    $symbolꓺobjTag as objTag,
    $symbolꓺobjStringTag as objStringTag,
    $symbolꓺobjToEquals as objToEquals, //
} from '#@standalone/index.ts';

export const objToPlain: unique symbol = Symbol('objToPlain');
export const objToJSON = 'toJSON'; // String literal value.
export const objToClone: unique symbol = Symbol('objToClone');
export const objFreezeClones: unique symbol = Symbol('objFreezeClones');
export const objDeepFreezeClones: unique symbol = Symbol('objDeepFreezeClones');
export const objReadableLength: unique symbol = Symbol('objReadableLength');
