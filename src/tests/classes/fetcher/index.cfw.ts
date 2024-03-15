/**
 * Test suite.
 */
/* eslint-disable @typescript-eslint/unbound-method -- safe to ignore. */

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

        const fetcher = new Fetcher({ globalObp: 'b5qvuj5y' });

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
                headers: { 'content-type': $mime.contentType('.txt') },
            },
        };
        expect(fetcher.global.cache['ccb3b1f7061e279e02f9d3761d0dcf90ced8e4b8']).toStrictEqual(expectedCache);
        expect(fetcher.global.cache['e42f835c52038a7a9f0d37f1e570d0f573185ecd']).toStrictEqual(expectedCache);
        expect(fetcher.global.cache['cca6054445f5e17c31218d204a66bbabba314234']).toStrictEqual(expectedCache);
    });
});
