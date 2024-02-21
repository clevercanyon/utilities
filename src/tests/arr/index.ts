/**
 * Test suite.
 */

import { $arr, $str } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$arr', async () => {
    test('.indexOfSequence()', async () => {
        expect($arr.indexOfSequence([0, 1, 2, 3], [0])).toBe(0);
        expect($arr.indexOfSequence([0, 1, 2, 3], [3])).toBe(3);
        expect($arr.indexOfSequence([0, 1, 2, 3], [1, 2])).toBe(1);
        expect($arr.indexOfSequence([0, 1, 2, 3], [1, 3])).toBe(-1);
        expect($arr.indexOfSequence($str.textEncode('\r\n\r\n'), $str.textEncode('\r\n\r\n'))).toBe(0);
        expect($arr.indexOfSequence(new Uint8Array([0, 0, 0, 0, 13, 10, 13, 10]), new Uint8Array([13, 10, 13, 10]))).toBe(4);
    });
});
