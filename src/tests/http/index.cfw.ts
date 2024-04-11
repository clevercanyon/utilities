/**
 * Test suite.
 */

import { $http } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$http', async () => {
    test('.requestConfig()', async () => {
        expect(await $http.requestConfig()).toMatchObject({
            enforceAppBaseURLOrigin: false,
            enforceNoTrailingSlash: false,
        });
    });
    test('.responseConfig()', async () => {
        expect(await $http.responseConfig()).toMatchObject({
            status: 405,
            enableCORs: false,
            maxAge: null,
            sMaxAge: null,
            staleAge: null,
            varyOn: [],
            headers: {},
            appendHeaders: {},
            body: null,
        });
        expect(
            await $http.responseConfig({
                status: 200,
                enableCORs: true,
                varyOn: ['origin'],
                headers: { a: 'a', b: 'b', c: 'c' },
                appendHeaders: { d: 'd', e: 'e', f: 'f' },
                body: 'abc',
            }),
        ).toMatchObject({
            status: 200,
            enableCORs: true,
            maxAge: null,
            sMaxAge: null,
            staleAge: null,
            varyOn: ['origin'],
            headers: { a: 'a', b: 'b', c: 'c' },
            appendHeaders: { d: 'd', e: 'e', f: 'f' },
            body: 'abc',
        });
    });
    test('.prepareRequest()', async () => {
        const request1 = await $http.prepareRequest(new Request('https://example.com/?utx_abc=abc&utm_abc=abc&xyz=xyz&abc=abc&_ck=_ck'));
        expect(request1).toBeInstanceOf(Request);
        expect(request1.url.toString()).toBe('https://example.com/?utx_abc=abc&utm_abc=abc&xyz=xyz&abc=abc&_ck=_ck');
    });
    test('.prepareResponse()', async () => {
        const response1 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'));
        expect(response1).toBeInstanceOf(Response);
    });
    test('.prepareResponseHeaders()', async () => {
        const response1 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
            status: 200,
            headers: { a: 'a', b: 'b', c: 'c', vary: 'abc' },
            appendHeaders: { c: 'c', 'x-ua-compatible': 'abc' },
        });
        expect(response1).toBeInstanceOf(Response);
        expect(response1.headers.get('a')).toBe('a');
        expect(response1.headers.get('b')).toBe('b');
        expect(response1.headers.get('c')).toBe('c, c');
        expect(response1.headers.get('vary')).toBe('abc');
        expect(response1.headers.get('x-ua-compatible')).toBe('abc');

        const response2 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), { status: 200 });

        expect(response2).toBeInstanceOf(Response);
        expect(response2.headers.get('vary')).toBe(null);
        expect(response2.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=43200, stale-if-error=43200');
        expect(response2.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86400, stale-while-revalidate=43200, stale-if-error=43200');

        const response3 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz', { headers: { origin: 'https://example.com' } }), {
            status: 200,
            enableCORs: true,
            ...{ maxAge: 86400, sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response3).toBeInstanceOf(Response);
        expect(response3.headers.get('vary')).toBe('origin');
        expect(response3.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=86400');
        expect(response3.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86400, stale-while-revalidate=86400, stale-if-error=86400');

        const response4 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz', { headers: { origin: 'https://example.com' } }), {
            status: 200,
            enableCORs: true,
            headers: { 'cache-control': 'public' },
            ...{ maxAge: 86400, sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response4).toBeInstanceOf(Response);
        expect(response4.headers.get('vary')).toBe('origin');
        expect(response4.headers.get('cache-control')).toBe('public');
        expect(response4.headers.get('cdn-cache-control')).toBe(null);

        const response5 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz', { headers: { origin: 'https://example.com' } }), {
            status: 200,
            ...{ sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response5).toBeInstanceOf(Response);
        expect(response5.headers.get('vary')).toBe(null);
        expect(response5.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=43200, stale-if-error=43200');
        expect(response5.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86400, stale-while-revalidate=43200, stale-if-error=43200');

        const response6 = await $http.prepareResponse(new Request('https://example.com/image.png?abc=abc&xyz=xyz'), { status: 200 });

        expect(response6).toBeInstanceOf(Response);
        expect(response6.headers.get('vary')).toBe(null);
        expect(response6.headers.get('cache-control')).toBe('public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=7776000, stale-if-error=7776000');
        expect(response6.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=31536000, stale-while-revalidate=7776000, stale-if-error=7776000');

        const response7 = await $http.prepareResponse(new Request('https://example.com/image.png?abc=abc&xyz=xyz'), { status: 300 });

        expect(response7).toBeInstanceOf(Response);
        expect(response7.headers.get('vary')).toBe(null);
        expect(response7.headers.get('cache-control')).toBe('no-store');
        expect(response7.headers.get('cdn-cache-control')).toBe('no-store');
    });
});
