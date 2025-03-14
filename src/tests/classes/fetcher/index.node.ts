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

        const fetcher = new Fetcher({ globalObp: 'cmhksxr6' });

        // Performs fetchs using fetcher.

        await fetcher.fetch('http://a.tld/');
        await fetcher.fetch('http://b.tld/');
        await fetcher.fetch('http://c.tld/');
        await fetcher.fetch('http://a.tld/');

        expect($obj.keysAndSymbols(fetcher.global.cache).length).toBe(3);
        expect(globalFetchMock).toHaveBeenCalledTimes(3);

        const expectedCache = {
            body: '',
            init: {
                status: 200,
                statusText: $http.responseStatusText(200),
                headers: Object.entries({ 'content-type': $mime.contentType('.txt') }),
            },
        };
        expect(fetcher.global.cache['dea440f47ad1caee47a54e1d9caebc4ee4829de5']).toStrictEqual(expectedCache);
        expect(fetcher.global.cache['6e589b81c89bc2c5c7d1a20cd59fb92c2be5b08a']).toStrictEqual(expectedCache);
        expect(fetcher.global.cache['d07c269b27b019bd5dd5c22bec9795e437eca3e7']).toStrictEqual(expectedCache);
    });
});
