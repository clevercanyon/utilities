/**
 * Test suite.
 */

import { $gzip } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$gzip', async () => {
    test('.encode()', async () => {
        expect(await $gzip.encode('abcdefghijklmnopqrstuvwxyz0123456789')).toStrictEqual(
            new Uint8Array([
                31, 139, 8, 0, 0, 0, 0, 0, 0, 19, 75, 76, 74, 78, 73, 77, 75, 207, 200, 204, 202, 206, 201, 205, 203, 47, 40, 44, 42, 46, 41, 45, 43, 175, 168, 172, 50, 48, 52, 50,
                54, 49, 53, 51, 183, 176, 4, 0, 123, 242, 198, 223, 36, 0, 0, 0,
            ]),
        );
    });
    test('.decode()', async () => {
        expect(
            await $gzip.decode(
                new Uint8Array([
                    31, 139, 8, 0, 0, 0, 0, 0, 0, 19, 75, 76, 74, 78, 73, 77, 75, 207, 200, 204, 202, 206, 201, 205, 203, 47, 40, 44, 42, 46, 41, 45, 43, 175, 168, 172, 50, 48, 52,
                    50, 54, 49, 53, 51, 183, 176, 4, 0, 123, 242, 198, 223, 36, 0, 0, 0,
                ]),
            ),
        ).toBe('abcdefghijklmnopqrstuvwxyz0123456789');
    });
});
