/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $preact } from '../../index.ts';

describe('$preact', async () => {
    test('.classes()', async () => {
        expect($preact.classes('abc', [])).toBe('abc');
        expect($preact.classes('abc', ['def'])).toBe('abc def');
        expect($preact.classes('abc', ['def', 'ghi'])).toBe('abc def ghi');
        expect($preact.classes('abc', ['def', 'ghi'], ['abc', 'def', 'ghi', 'xyz'])).toBe('abc def ghi xyz');

        expect($preact.classes({ abc: true, def: true, xyz: false })).toBe('abc def');
        expect($preact.classes({ abc: true, 'd e f': true, g: 1, h: 0, i: false, jkl: true })).toBe('abc d e f jkl');
        expect($preact.classes({ abc: true, def: true, xyz: false }, ['xyz'], undefined, null, false, true, ['', undefined, null, false, true])).toBe('abc def xyz');
        expect($preact.classes({ a: true }, { b: true }, { c: true }, { 'd e f': true }, 'g h i', ['j k  l', 'm'], 'n', 'o\rp')).toBe('a b c d e f g h i j k l m n o p');
        expect($preact.classes([[[[[{ a: true }, { b: true }, { c: true }, { 'd e f': true }], ['g h i', ['j k  l', 'm']], [[['n']]], ['o\rp']]]]])).toBe(
            'a b c d e f g h i j k l m n o p',
        );
    });
});
