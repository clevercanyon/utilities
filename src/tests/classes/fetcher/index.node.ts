/**
 * Test suite.
 */
/* eslint-disable @typescript-eslint/unbound-method -- safe to ignore. */

import { $class, $obj } from '#index.ts';
import { describe, expect, test, vi } from 'vitest';

describe('Fetcher', async () => {
    const Fetcher = $class.getFetcher();

    test('.fetch()', async () => {
        // Mocks `globalThis.fetch()`.

        const globalFetchMock = vi.fn(async () => {
            return new Response('x', {
                status: 200,
                headers: { 'content-type': 'text/plain; charset=utf-8' },
            });
        });
        const expectedHeaders = { 'content-type': 'text/plain; charset=utf-8' };
        vi.stubGlobal('fetch', globalFetchMock);

        expect(globalFetchMock).toHaveBeenCalledTimes(0);
        expect(vi.isMockFunction(globalThis.fetch)).toBe(true);

        // Creates fetcher & replaces native fetch.

        const fetcher = new Fetcher({ autoReplaceNativeFetch: true });

        // Performs fetches against the mock.

        await globalThis.fetch('http://a.tld/');
        await globalThis.fetch('http://b.tld/');
        await globalThis.fetch('http://c.tld/');
        await globalThis.fetch('http://a.tld/');

        expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(3);
        expect(globalFetchMock).toHaveBeenCalledTimes(3);

        expect(fetcher.global.cache['8bda1366754d87cfe1ee93cd190c29c8a93c9015']).toStrictEqual({ body: 'x', options: { headers: expectedHeaders, status: 200 } });
        expect(fetcher.global.cache['93a570d7f8fb175c7d6a255f48b2730f79f00365']).toStrictEqual({ body: 'x', options: { headers: expectedHeaders, status: 200 } });
        expect(fetcher.global.cache['35381d33ad7f3bece934225019c135a51d8be3f3']).toStrictEqual({ body: 'x', options: { headers: expectedHeaders, status: 200 } });

        // Restores native fetch.

        fetcher.restoreNativeFetch();

        // Performs fetches against the mock.

        await globalThis.fetch('http://x.tld/');
        await globalThis.fetch('http://y.tld/');
        await globalThis.fetch('http://z.tld/');
        await globalThis.fetch('http://x.tld/');

        expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(0); // Reset on restoration above.
        expect(globalFetchMock).toHaveBeenCalledTimes(7);
    });
});
