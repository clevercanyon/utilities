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

        expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(0);
        expect(globalFetchMock).toHaveBeenCalledTimes(4);
    });
});
