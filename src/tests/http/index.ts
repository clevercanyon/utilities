/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $http } from '../../index.ts';

describe('$http', async () => {
    test('.requestConfig()', async () => {
        expect($http.requestConfig()).toStrictEqual({
            enforceNoTrailingSlash: false,
            enableRewrites: false,
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
        const request1 = $http.prepareRequest(new Request('https://example.com/?utx_abc=abc&utm_abc=abc&xyz=xyz&abc=abc&_ck=_ck'), { enableRewrites: true });
        expect(request1).toBeInstanceOf(Request);
        expect(request1.url.toString()).toBe('https://example.com/?abc=abc&xyz=xyz');
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
    test('.responseStatusText()', async () => {
        expect($http.responseStatusText(200)).toBe('OK');
        expect($http.responseStatusText(400)).toBe('Bad Request');
        expect($http.responseStatusText(403)).toBe('Forbidden');
        expect($http.responseStatusText(500)).toBe('Internal Server Error');
        expect($http.responseStatusText(503)).toBe('Service Unavailable');
    });
    test('.requestHasSupportedMethod()', async () => {
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'OPTIONS' }))).toBe(true);
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'HEAD' }))).toBe(true);
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'GET' }))).toBe(true);
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'POST' }))).toBe(true);
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'PUT' }))).toBe(true);
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'PATCH' }))).toBe(true);
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'DELETE' }))).toBe(true);
        expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'ABC' }))).toBe(false);
    });
    test('.requestHasCacheableMethod()', async () => {
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'OPTIONS' }))).toBe(false);
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'HEAD' }))).toBe(true);
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'GET' }))).toBe(true);
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'POST' }))).toBe(false);
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'PUT' }))).toBe(false);
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'PATCH' }))).toBe(false);
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'DELETE' }))).toBe(false);
        expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'ABC' }))).toBe(false);
    });
    test('.requestNeedsContentHeaders()', async () => {
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'OPTIONS' }), 200)).toBe(false);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'HEAD' }), 200)).toBe(true);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'HEAD' }), 204)).toBe(false);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'GET' }), 200)).toBe(true);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'POST' }), 200)).toBe(true);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'PUT' }), 200)).toBe(true);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'PATCH' }), 200)).toBe(true);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'DELETE' }), 200)).toBe(true);
        expect($http.requestNeedsContentHeaders(new Request('https://example.com/', { method: 'ABC' }), 200)).toBe(false);
    });
    test('.requestNeedsContentBody()', async () => {
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'OPTIONS' }), 200)).toBe(false);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'OPTIONS' }), 204)).toBe(false);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'HEAD' }), 200)).toBe(false);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'HEAD' }), 204)).toBe(false);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'GET' }), 200)).toBe(true);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'GET' }), 204)).toBe(false);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'POST' }), 200)).toBe(true);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'PUT' }), 200)).toBe(true);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'PATCH' }), 200)).toBe(true);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'DELETE' }), 200)).toBe(true);
        expect($http.requestNeedsContentBody(new Request('https://example.com/', { method: 'ABC' }), 200)).toBe(false);
    });
    test('.requestIsFromUser()', async () => {
        expect($http.requestIsFromUser(new Request('https://example.com/'))).toBe(false);
        expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { cookie: 'abc' } }))).toBe(false);
        expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { cookie: 'user=abc' } }))).toBe(true);
        expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { cookie: 'user_id=abc' } }))).toBe(true);
        expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { authorization: 'abc' } }))).toBe(true);
    });
    test('.requestPathIsInvalid()', async () => {
        expect($http.requestPathIsInvalid(new Request('https://example.com/'))).toBe(false);
        expect($http.requestPathIsInvalid(new Request('https://example.com/\\abc'))).toBe(true);
        expect($http.requestPathIsInvalid(new Request('https://example.com/..abc'))).toBe(true);
        expect($http.requestPathIsInvalid(new Request('https://example.com/a//b/c'))).toBe(true);
    });
    test('.requestPathIsForbidden()', async () => {
        expect($http.requestPathIsForbidden(new Request('https://example.com/'))).toBe(false);

        expect($http.requestPathIsForbidden(new Request('https://example.com/.a'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/.well-known'))).toBe(false);

        expect($http.requestPathIsForbidden(new Request('https://example.com/abc~'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/abc.bak'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/abc.backup'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/abc.copy'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/abc.log/a'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/abc.old/a'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/abc.tmp'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/abc.temp/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/private'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/private/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/cache'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/cache/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/logs'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/logs/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/yarn'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/yarn/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/vendor'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/vendor/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/node-modules'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/node_modules'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/node_modules/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/jspm-packages'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/jspm_packages'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/jspm_packages/a'))).toBe(true);

        expect($http.requestPathIsForbidden(new Request('https://example.com/bower-components'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/bower_components'))).toBe(true);
        expect($http.requestPathIsForbidden(new Request('https://example.com/bower_components/a'))).toBe(true);
    });
    test('.requestPathIsDynamic()', async () => {
        expect($http.requestPathIsDynamic(new Request('https://example.com/'))).toBe(true);
        expect($http.requestPathIsDynamic(new Request('https://example.com/abc'))).toBe(true);
        expect($http.requestPathIsDynamic(new Request('https://example.com/def'))).toBe(true);
        expect($http.requestPathIsDynamic(new Request('https://example.com/foo.bar'))).toBe(true);

        expect($http.requestPathIsDynamic(new Request('https://example.com/abc.png'))).toBe(false);
        expect($http.requestPathIsDynamic(new Request('https://example.com/api/abc.png'))).toBe(true);

        expect($http.requestPathIsDynamic(new Request('https://example.com/ghi.js'))).toBe(false);
        expect($http.requestPathIsDynamic(new Request('https://example.com/ghi.png'))).toBe(false);
    });
    test('.requestPathIsStatic()', async () => {
        expect($http.requestPathIsStatic(new Request('https://example.com/ghi.js'))).toBe(true);
        expect($http.requestPathIsStatic(new Request('https://example.com/ghi.png'))).toBe(true);

        expect($http.requestPathIsStatic(new Request('https://example.com/'))).toBe(false);
        expect($http.requestPathIsStatic(new Request('https://example.com/abc'))).toBe(false);
        expect($http.requestPathIsStatic(new Request('https://example.com/def'))).toBe(false);

        expect($http.requestPathIsStatic(new Request('https://example.com/foo.bar'))).toBe(false);
        expect($http.requestPathIsStatic(new Request('https://example.com/api/abc.png'))).toBe(false);
    });
    test('.requestPathHasDynamicBase()', async () => {
        expect($http.requestPathHasDynamicBase(new Request('https://example.com/api'))).toBe(true);
        expect($http.requestPathHasDynamicBase(new Request('https://example.com/api/'))).toBe(true);
        expect($http.requestPathHasDynamicBase(new Request('https://example.com/api/abc'))).toBe(true);

        expect($http.requestPathHasDynamicBase(new Request('https://example.com/'))).toBe(false);
        expect($http.requestPathHasDynamicBase(new Request('https://example.com/foo.bar'))).toBe(false);
    });
    test('.requestPathIsPotentiallyDynamic()', async () => {
        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/robots.txt'))).toBe(true);
        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/sitemap.xml'))).toBe(true);
        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/main-sitemap.xml'))).toBe(true);
        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/sitemaps/main.xml'))).toBe(true);
        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/sitemap_index.xml'))).toBe(true);

        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com'))).toBe(false);
        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/'))).toBe(false);
        expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/favicon.ico'))).toBe(false);
    });
    test('.requestPathIsSEORelatedFile()', async () => {
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/'))).toBe(false);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/robots.txt'))).toBe(true);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/favicon.ico'))).toBe(true);

        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap.xml'))).toBe(true);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap_index.xml'))).toBe(true);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap-index.xml'))).toBe(true);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/main-sitemap.xml'))).toBe(true);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/main_sitemap.xml'))).toBe(true);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemaps/main.xml'))).toBe(true);

        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemapAbc.xml'))).toBe(false);
        expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap2.xml'))).toBe(false);
    });
    test('.requestPathIsInAdmin()', async () => {
        expect($http.requestPathIsInAdmin(new Request('https://example.com/'))).toBe(false);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/admin'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/admin/a'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/a/admin/a'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/wp-admin'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/wp_admin'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/wp_admin/a'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/a/wp_admin/a'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/wp-admin/admin-ajax.php'))).toBe(true);
        expect($http.requestPathIsInAdmin(new Request('https://example.com/wp_admin/admin_ajax.php'))).toBe(true);
    });
    test('.requestPathHasStaticExtension()', async () => {
        expect($http.requestPathHasStaticExtension(new Request('https://example.com/robots.txt'))).toBe(true);
        expect($http.requestPathHasStaticExtension(new Request('https://example.com/'))).toBe(false);
        expect($http.requestPathHasStaticExtension(new Request('https://example.com/robots.php'))).toBe(false);
    });
    test('.extractHeaders()', async () => {
        expect($http.extractHeaders(new Headers({ A: 'A', B: 'B', c: 'c' }))).toStrictEqual({ a: 'A', b: 'B', c: 'c' });
        expect($http.extractHeaders(new Headers({ A: 'A', B: 'B', c: 'c' }), { lowercase: false })).toStrictEqual({ a: 'A', b: 'B', c: 'c' });

        expect($http.extractHeaders({ A: 'A', B: 'B', c: 'c' })).toStrictEqual({ a: 'A', b: 'B', c: 'c' });
        expect($http.extractHeaders({ A: 'A', B: 'B', c: 'c' }, { lowercase: false })).toStrictEqual({ A: 'A', B: 'B', c: 'c' });
    });
});
