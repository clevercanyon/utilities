/**
 * Array utilities.
 */

import '#@initialize.ts';

import { type $type } from '#index.ts';

/**
 * Finds a sequence index in an array.
 *
 * @param   arr      Array to search.
 * @param   sequence Sequence to locate.
 *
 * @returns          Index position of sequence, else `-1`.
 */
export const indexOfSequence = (arr: unknown[] | $type.TypedArray, sequence: unknown[] | $type.TypedArray): number => {
    if (sequence.length > arr.length) return -1;

    // Improves performance by calculating max possible index.
    const maxPossibleIndex = arr.length - sequence.length;

    return arr.findIndex((unusedꓺvalue, index) => {
        if (index > maxPossibleIndex) return false;
        return sequence.every((v, i) => arr[index + i] === v);
    });
};
