/**
 * Test suite.
 */

import { $env, $gzip } from '#index.ts';
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
        /**
         * We simplify assertions on CI because encoded byte arrays can differ slightly across various OS builds. This
         * is due to the fact that gzip implementations use slightly different metadata across gzip versions.
         */
        for (const [str, bytes] of Object.entries(bytesMap.gzip)) {
            if ($env.isCI()) {
                expect((await $gzip.encode(str)) instanceof Uint8Array).toBe(true);
            } else {
                expect(await $gzip.encode(str)).toStrictEqual(bytes);
                expect((await $gzip.encode(str)).length).toBe(56);
            }
        }
        /**
         * We do NOT simplify these assertions on CI. While encoded byte arrays can differ slightly across various OS
         * builds, the deflate algorithm doesn’t include metadata, so it should always match up, regardless.
         */
        for (const [str, bytes] of Object.entries(bytesMap.deflate)) {
            expect(await $gzip.encode(str, { deflate: true })).toStrictEqual(bytes);
            expect((await $gzip.encode(str, { deflate: true })).length).toBe(44);
        }
    });
    test('.decode()', async () => {
        /**
         * We do NOT simplify these assertions on CI. While encoded byte arrays can differ slightly across various OS
         * builds, the strings decoded using the above byte arrays should always be the same, regardless.
         */
        for (const [str, bytes] of Object.entries(bytesMap.gzip)) {
            expect(await $gzip.decode(bytes)).toBe(str);
        }
        for (const [str, bytes] of Object.entries(bytesMap.deflate)) {
            expect(await $gzip.decode(bytes, { deflate: true })).toBe(str);
        }
    });
});
