/**
 * Test suite.
 */

import { $app, $http } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$http', async () => {
    test('.requestConfig()', async () => {
        expect($http.requestConfig()).toStrictEqual({
            enforceAppBaseURLOrigin: false,
            enforceNoTrailingSlash: false,
            enableCFWCacheRewrites: true,
        });
    });
    test('.responseConfig()', async () => {
        expect($http.responseConfig()).toStrictEqual({
            status: 405,
            enableCORs: false,
            enableCDN: true,
            maxAge: null,
            sMaxAge: null,
            staleAge: null,
            headers: {},
            appendHeaders: {},
            body: null,
        });
        expect(
            $http.responseConfig({
                status: 200,
                enableCORs: true,
                enableCDN: false,
                headers: { a: 'a', b: 'b', c: 'c' },
                appendHeaders: { d: 'd', e: 'e', f: 'f' },
                body: 'abc',
            }),
        ).toStrictEqual({
            status: 200,
            enableCORs: true,
            enableCDN: false,
            maxAge: null,
            sMaxAge: null,
            staleAge: null,
            headers: { a: 'a', b: 'b', c: 'c' },
            appendHeaders: { d: 'd', e: 'e', f: 'f' },
            body: 'abc',
        });
    });
    test('.prepareRequest()', async () => {
        const request1 = $http.prepareRequest(new Request('https://example.com/?utx_abc=abc&utm_abc=abc&xyz=xyz&abc=abc&_ck=_ck'));
        expect(request1).toBeInstanceOf(Request);
        expect(request1.url.toString()).toBe('https://example.com/?_ck=v%3D' + $app.buildTime().unix().toString() + '&abc=abc&xyz=xyz');
    });
    test('.prepareResponse()', async () => {
        const response1 = $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'));
        expect(response1).toBeInstanceOf(Response);
        expect(response1.headers.get('x-frame-options')).toBe('SAMEORIGIN');
    });
    test('.prepareResponseHeaders()', async () => {
        const response1 = $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
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
        expect(response1.headers.get('x-frame-options')).toBe('SAMEORIGIN');

        const response2 = $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), { status: 200 });

        expect(response2).toBeInstanceOf(Response);
        expect(response2.headers.get('vary')).toBe('origin');
        expect(response2.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=43200, stale-if-error=43200');
        expect(response2.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86400, stale-while-revalidate=43200, stale-if-error=43200');

        const response3 = $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
            status: 200,
            ...{ maxAge: 86400, sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response3).toBeInstanceOf(Response);
        expect(response3.headers.get('vary')).toBe('origin');
        expect(response3.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86401, stale-while-revalidate=86402, stale-if-error=86402');
        expect(response3.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86401, stale-while-revalidate=86402, stale-if-error=86402');

        const response4 = $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
            status: 200,
            headers: { 'cache-control': 'public' },
            ...{ maxAge: 86400, sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response4).toBeInstanceOf(Response);
        expect(response4.headers.get('vary')).toBe('origin');
        expect(response4.headers.get('cache-control')).toBe('public');
        expect(response4.headers.get('cdn-cache-control')).toBe(null);

        const response5 = $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
            status: 200,
            ...{ sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response5).toBeInstanceOf(Response);
        expect(response5.headers.get('vary')).toBe('origin');
        expect(response5.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=43200, stale-if-error=43200');
        expect(response5.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86400, stale-while-revalidate=43200, stale-if-error=43200');

        const response6 = $http.prepareResponse(new Request('https://example.com/image.png?abc=abc&xyz=xyz'), { status: 200 });

        expect(response6).toBeInstanceOf(Response);
        expect(response6.headers.get('vary')).toBe('origin');
        expect(response6.headers.get('cache-control')).toBe('public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=7776000, stale-if-error=7776000');
        expect(response6.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=31536000, stale-while-revalidate=7776000, stale-if-error=7776000');

        const response7 = $http.prepareResponse(new Request('https://example.com/image.png?abc=abc&xyz=xyz'), { status: 300 });

        expect(response7).toBeInstanceOf(Response);
        expect(response7.headers.get('vary')).toBe('origin');
        expect(response7.headers.get('cache-control')).toBe('no-store');
        expect(response7.headers.get('cdn-cache-control')).toBe('no-store');
    });
});
