/**
 * Symbol utilities.
 */
// organize-imports-ignore

import './resources/init.ts';

export {
    $symbolꓺobjTag as objTag, //
    $symbolꓺobjStringTag as objStringTag,
    $symbolꓺobjToEquals as objToEquals,
} from './resources/standalone/index.ts';

export const objToPlain: unique symbol = Symbol('objToPlain');
export const objToJSON = 'toJSON'; // String literal for `toJSON`.
export const objToClone: unique symbol = Symbol('objToClone');
