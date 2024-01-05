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
            return new Response('', {
                status: 200,
                headers: { 'content-type': 'text/plain; charset=utf-8' },
            });
        });
        vi.stubGlobal('fetch', globalFetchMock);

        expect(globalFetchMock).toHaveBeenCalledTimes(0);
        expect(vi.isMockFunction(globalThis.fetch)).toBe(true);

        // Creates fetcher instance.

        const fetcher = new Fetcher();

        // Performs fetchs using fetcher.

        await fetcher.fetch('http://a.tld/');
        await fetcher.fetch('http://b.tld/');
        await fetcher.fetch('http://c.tld/');
        await fetcher.fetch('http://a.tld/');

        expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(3);
        expect(globalFetchMock).toHaveBeenCalledTimes(3);

        const expectedCache = { body: '', init: { status: 200, headers: { 'content-type': 'text/plain; charset=utf-8' } } };
        expect(fetcher.global.cache['8bda1366754d87cfe1ee93cd190c29c8a93c9015']).toStrictEqual(expectedCache);
        expect(fetcher.global.cache['93a570d7f8fb175c7d6a255f48b2730f79f00365']).toStrictEqual(expectedCache);
        expect(fetcher.global.cache['35381d33ad7f3bece934225019c135a51d8be3f3']).toStrictEqual(expectedCache);
    });
});
