/**
 * Test suite.
 */

import { $preact, $to } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$preact', async () => {
    test('.classes()', async () => {
        expect($preact.classes('🚀 abc', [])).toBe('🚀 abc');
        expect($preact.classes('abc', ['def'])).toBe('abc def');
        expect($preact.classes('abc', ['def', 'ghi'])).toBe('abc def ghi');
        expect($preact.classes('abc', ['def', 'ghi'], ['abc', 'def', 'ghi', 'xyz'])).toBe('abc def ghi xyz');

        expect($preact.classes($to.map({ abc: true, def: true, xyz: false }) as Map<string, boolean>)).toBe('abc def');
        expect($preact.classes($to.map({ abc: true, 'd e f': true, g: false, hij: true }) as Map<string, boolean>)).toBe('abc d e f hij');
        expect($preact.classes($to.map({ abc: true, def: true, xyz: false }) as Map<string, boolean>, ['xyz'], undefined, ['', undefined])).toBe('abc def xyz');

        expect(
            $preact.classes(
                $to.map({ a: true }) as Map<string, boolean>,
                $to.map({ b: true }) as Map<string, boolean>,
                $to.map({ c: true }) as Map<string, boolean>,
                $to.map({ 'd e f': true }) as Map<string, boolean>,
                'g h i',
                ['j k  l', 'm'],
                'n',
                'o\rp',
            ),
        ).toBe('a b c d e f g h i j k l m n o p');

        expect(
            $preact.classes(
                $to.map({ a: true }) as Map<string, boolean>,
                $to.map({ b: true }) as Map<string, boolean>,
                $to.map({ c: true }) as Map<string, boolean>,
                $to.map({ 'd e f': true }) as Map<string, boolean>,
                'g h i',
                ['j k  l', 'm'],
                'n',
                'o\rp',
                $to.map({ 'n o': false }) as Map<string, boolean>,
                $to.map({ 'p': false }) as Map<string, boolean>,
            ),
        ).toBe('a b c d e f g h i j k l m'); // `n o p` disabled by class maps.

        expect(
            $preact.classes([
                [
                    [
                        [
                            [
                                $to.map({ a: true }) as Map<string, boolean>,
                                $to.map({ b: true }) as Map<string, boolean>,
                                $to.map({ c: true }) as Map<string, boolean>,
                                $to.map({ 'd e f': true }) as Map<string, boolean>,
                            ],
                            new Set(['g h i', new Set(['j k  l', 'm'])]),
                            new Set([[['n']]]),
                            ['o\rp'],
                        ],
                    ],
                ],
            ]),
        ).toBe('a b c d e f g h i j k l m n o p');

        expect(
            $preact.classes([
                [
                    [
                        [
                            [
                                { class: $to.map({ a: true }) as Map<string, boolean> },
                                { classes: $to.map({ b: true }) as Map<string, boolean> },
                                { className: $to.map({ c: true }) as Map<string, boolean> },
                                { classNames: $to.map({ 'd d d e e e e f f f f': true }) as Map<string, boolean> },
                                { xClassNames: $to.map({ 'x x x': true }) as Map<string, boolean> },
                            ],
                            new Set(['g h i', new Set(['j k  l', 'm'])]),
                            new Set([[['n']]]),
                            ['o\rp'],
                        ],
                    ],
                ],
            ]),
        ).toBe('a b c d e f g h i j k l m n o p');
    });
});
