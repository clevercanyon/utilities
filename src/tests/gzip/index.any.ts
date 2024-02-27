/**
 * Test suite.
 */

import { $gzip } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$gzip', async () => {
    const bytesMap = {
        gzip: {
            'abcdefghijklmnopqrstuvwxyz0123456789': new Uint8Array([
                31, 139, 8, 0, 0, 0, 0, 0, 0, 19, 75, 76, 74, 78, 73, 77, 75, 207, 200, 204, 202, 206, 201, 205, 203, 47, 40, 44, 42, 46, 41, 45, 43, 175, 168, 172, 50, 48, 52, 50,
                54, 49, 53, 51, 183, 176, 4, 0, 123, 242, 198, 223, 36, 0, 0, 0,
            ]),
        },
        deflate: {
            'abcdefghijklmnopqrstuvwxyz0123456789': new Uint8Array([
                120, 156, 75, 76, 74, 78, 73, 77, 75, 207, 200, 204, 202, 206, 201, 205, 203, 47, 40, 44, 42, 46, 41, 45, 43, 175, 168, 172, 50, 48, 52, 50, 54, 49, 53, 51, 183,
                176, 4, 0, 10, 202, 13, 45,
            ]),
        },
    };
    test('.encode()', async () => {
        for (const [str, bytes] of Object.entries(bytesMap.gzip)) {
            expect(await $gzip.encode(str)).toStrictEqual(bytes);
        }
        for (const [str, bytes] of Object.entries(bytesMap.deflate)) {
            expect(await $gzip.encode(str, { deflate: true })).toStrictEqual(bytes);
        }
    });
    test('.decode()', async () => {
        for (const [str, bytes] of Object.entries(bytesMap.gzip)) {
            expect(await $gzip.decode(bytes)).toBe(str);
        }
        for (const [str, bytes] of Object.entries(bytesMap.deflate)) {
            expect(await $gzip.decode(bytes, { deflate: true })).toBe(str);
        }
    });
});
