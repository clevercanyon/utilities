/**
 * Test suite.
 */

import { $class, $http, $mime, $obj } from '#index.ts';
import { describe, expect, test, vi } from 'vitest';

describe('Fetcher', async () => {
    const Fetcher = $class.getFetcher();

    test('.fetch()', async () => {
        // Mocks `globalThis.fetch()`.

        const globalFetchMock = vi.fn(async () => {
            return new Response('', {
                status: 200,
                statusText: $http.responseStatusText(200),
                headers: { 'content-type': $mime.contentType('.txt') },
            });
        });
        vi.stubGlobal('fetch', globalFetchMock);

        expect(globalFetchMock).toHaveBeenCalledTimes(0);
        expect(vi.isMockFunction(globalThis.fetch)).toBe(true);

        // Creates fetcher instance.

        const fetcher = new Fetcher({ globalObp: 'h2jqtet5' });

        // Performs fetchs using fetcher.

        await fetcher.fetch('http://a.tld/');
        await fetcher.fetch('http://b.tld/');
        await fetcher.fetch('http://c.tld/');
        await fetcher.fetch('http://a.tld/');

        expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(0);
        expect(globalFetchMock).toHaveBeenCalledTimes(4);
    });
});
