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
export const objToJSON = 'toJSON'; // String literal for `toJSON`.
export const objToClone: unique symbol = Symbol('objToClone');
