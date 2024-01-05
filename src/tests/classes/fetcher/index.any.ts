/**
 * Test suite.
 */
/* eslint-disable @typescript-eslint/unbound-method -- safe to ignore. */

import { $class } from '#index.ts';
import { describe, expect, test, vi } from 'vitest';

describe('Fetcher', async () => {
    const Fetcher = $class.getFetcher();

    test('new Fetcher()', async () => {
        expect(new Fetcher()).toBeInstanceOf(Fetcher);
    });
    test('globalThis.fetch()', async () => {
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

        // Creates fetcher & mocks its `.fetch()`.

        const fetcher = new Fetcher();
        const fetcherꓺfetchMock = vi.spyOn(fetcher, 'fetch');

        expect(fetcherꓺfetchMock).toHaveBeenCalledTimes(0);
        expect(vi.isMockFunction(fetcher.fetch)).toBe(true);

        // Performs a fetch using fetcher.

        await fetcher.fetch('https://x.tld/');

        expect(globalFetchMock).toHaveBeenCalledTimes(1);
        expect(fetcherꓺfetchMock).toHaveBeenCalledTimes(1);

        // Performs a fetch using fetcher.

        await fetcher.fetch('https://x.tld/');

        expect(globalFetchMock).toHaveBeenCalledTimes(1);
        expect(fetcherꓺfetchMock).toHaveBeenCalledTimes(2);

        // Performs a fetch using fetcher.

        await fetcher.fetch('https://x.tld/x');

        expect(globalFetchMock).toHaveBeenCalledTimes(2);
        expect(fetcherꓺfetchMock).toHaveBeenCalledTimes(3);
    });
    test('.globalToScriptCode()', async () => {
        const fetcher1 = new Fetcher();
        expect(fetcher1.globalToScriptCode()).toContain("{\"cache\":{}};"); // prettier-ignore

        const fetcher2 = new Fetcher({ globalObp: 'foo' });
        expect(fetcher2.globalToScriptCode()).toBe("globalThis['foo'] = globalThis['foo'] || {}; globalThis['foo'] = {\"cache\":{}};"); // prettier-ignore

        const fetcher3 = new Fetcher({ globalObp: "foo's" });
        expect(fetcher3.globalToScriptCode()).toBe("globalThis['foo\\'s'] = globalThis['foo\\'s'] || {}; globalThis['foo\\'s'] = {\"cache\":{}};"); // prettier-ignore

        const fetcher4 = new Fetcher({ globalObp: 'foo.fetcher' });
        expect(fetcher4.globalToScriptCode()).toBe("globalThis['foo'] = globalThis['foo'] || {}; globalThis['foo']['fetcher'] = globalThis['foo']['fetcher'] || {}; globalThis['foo']['fetcher'] = {\"cache\":{}};"); // prettier-ignore
    });
});
