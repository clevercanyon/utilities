/**
 * Array utilities.
 */

import '#@initialize.ts';

import { type $type } from '#index.ts';

/**
 * Randomly shuffles an array.
 *
 * By subtracting 0.5, the result of Math.random() will be in the range of -0.5 to 0.5. This means roughly half the
 * time, the comparison function will return a negative value (indicating that the first element should come before the
 * second), and the other half of the time, it will return a positive value (indicating the reverse).
 *
 * @param   arr Array to shuffle.
 *
 * @returns     Shallow clone; shuffled randomly.
 */
export const shuffle = <Type extends unknown[]>(arr: Type): Type => {
    return [...arr].sort(() => Math.random() - 0.5) as Type;
};

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
