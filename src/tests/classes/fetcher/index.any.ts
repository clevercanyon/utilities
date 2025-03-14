/**
 * Test suite.
 */

import { $class, $http, $mime } from '#index.ts';
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
                statusText: $http.responseStatusText(200),
                headers: { 'content-type': $mime.contentType('.txt') },
            });
        });
        vi.stubGlobal('fetch', globalFetchMock);

        expect(globalFetchMock).toHaveBeenCalledTimes(0);
        expect(vi.isMockFunction(globalThis.fetch)).toBe(true);

        // Creates fetcher & mocks its `.fetch()`.

        const fetcher = new Fetcher({ globalObp: 'danjd3nq' });
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
        const fetcher1 = new Fetcher({ globalObp: 't2jmye29' });
        expect(fetcher1.globalToScriptCode()).toContain("{\"cache\":{}};"); // prettier-ignore

        const fetcher2 = new Fetcher({ globalObp: 'pypqcurz' });
        expect(fetcher2.globalToScriptCode()).toBe("globalThis['pypqcurz'] = globalThis['pypqcurz'] || {}; globalThis['pypqcurz'] = {\"cache\":{}};"); // prettier-ignore

        const fetcher3 = new Fetcher({ globalObp: "k7efvbce foo's" });
        expect(fetcher3.globalToScriptCode()).toBe("globalThis['k7efvbce foo\\'s'] = globalThis['k7efvbce foo\\'s'] || {}; globalThis['k7efvbce foo\\'s'] = {\"cache\":{}};"); // prettier-ignore

        const fetcher4 = new Fetcher({ globalObp: 'kkpfdqmw.fetcher' });
        expect(fetcher4.globalToScriptCode()).toBe("globalThis['kkpfdqmw'] = globalThis['kkpfdqmw'] || {}; globalThis['kkpfdqmw']['fetcher'] = globalThis['kkpfdqmw']['fetcher'] || {}; globalThis['kkpfdqmw']['fetcher'] = {\"cache\":{}};"); // prettier-ignore
    });
});
