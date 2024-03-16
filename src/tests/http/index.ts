/**
 * Test suite.
 */

import { $crypto, $http, $is, $mime, $str } from '#index.ts';
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

        const response3 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
            status: 200,
            ...{ maxAge: 86400, sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response3).toBeInstanceOf(Response);
        expect(response3.headers.get('vary')).toBe(null);
        expect(response3.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86401, stale-while-revalidate=86402, stale-if-error=86402');
        expect(response3.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86401, stale-while-revalidate=86402, stale-if-error=86402');

        const response4 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
            status: 200,
            headers: { 'cache-control': 'public' },
            ...{ maxAge: 86400, sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response4).toBeInstanceOf(Response);
        expect(response4.headers.get('vary')).toBe(null);
        expect(response4.headers.get('cache-control')).toBe('public');
        expect(response4.headers.get('cdn-cache-control')).toBe(null);

        const response5 = await $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz', { headers: { origin: 'https://example.com' } }), {
            status: 200,
            enableCORs: true,
            ...{ sMaxAge: 86401, staleAge: 86402 },
        });
        expect(response5).toBeInstanceOf(Response);
        expect(response5.headers.get('vary')).toBe('origin');
        expect(response5.headers.get('cache-control')).toBe('public, must-revalidate, max-age=86400, s-maxage=86400, stale-while-revalidate=43200, stale-if-error=43200');
        expect(response5.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=86400, stale-while-revalidate=43200, stale-if-error=43200');

        const response6 = await $http.prepareResponse(new Request('https://example.com/image.png?abc=abc&xyz=xyz', { headers: { origin: 'https://example.com' } }), {
            status: 200,
            enableCORs: true,
        });
        expect(response6).toBeInstanceOf(Response);
        expect(response6.headers.get('vary')).toBe('origin');
        expect(response6.headers.get('cache-control')).toBe('public, must-revalidate, max-age=31536000, s-maxage=31536000, stale-while-revalidate=7776000, stale-if-error=7776000');
        expect(response6.headers.get('cdn-cache-control')).toBe('public, must-revalidate, max-age=31536000, stale-while-revalidate=7776000, stale-if-error=7776000');

        const response7 = await $http.prepareResponse(new Request('https://example.com/image.png?abc=abc&xyz=xyz', { headers: { origin: 'https://example.com' } }), {
            status: 300,
        });
        expect(response7).toBeInstanceOf(Response);
        expect(response7.headers.get('vary')).toBe(null);
        expect(response7.headers.get('cache-control')).toBe('no-store');
        expect(response7.headers.get('cdn-cache-control')).toBe('no-store');
    });
    test('.prepareCachedResponse()', async () => {
        const request1 = new Request('https://example.com/', {
                headers: { 'x-csp-nonce': $crypto.cspNonce() },
            }),
            cspReplCode = $crypto.cspNonceReplacementCode(),
            cspNonce = request1.headers.get('x-csp-nonce') || '',
            response1 = await $http.prepareCachedResponse(
                request1,
                await $http.prepareResponse(request1, {
                    headers: { 'content-type': $mime.contentType('.html') },
                    body:
                        `<script nonce="${cspReplCode}"></script>` + //
                        `<script id="global-data" nonce="${cspReplCode}">const data = { cspNonce: '${cspReplCode}' };</script>`,
                }),
            ),
            response1Headers = response1.headers,
            response1Body = await response1.text();

        expect(response1).toBeInstanceOf(Response);

        expect(response1Headers.get('content-security-policy') || '').toContain("'nonce-" + cspNonce + "'");
        expect(response1Headers.get('content-security-policy') || '').not.toContain("'nonce-" + cspReplCode + "'");

        expect(response1Body).toContain('<script nonce="' + cspNonce + '"></script>');
        expect(response1Body).not.toContain('<script nonce="' + cspReplCode + '"></script>');

        expect(response1Body).toContain('<script id="global-data" nonce="' + cspNonce + '">');
        expect(response1Body).not.toContain('<script id="global-data" nonce="' + cspReplCode + '">');

        expect(response1Body).toContain(" cspNonce: '" + cspNonce + "'");
        expect(response1Body).not.toContain(" cspNonce: '" + cspReplCode + "'");
    });
    test('.prepareResponseForCache()', async () => {
        const request1 = new Request('https://example.com/', {
                headers: { 'x-csp-nonce': $crypto.cspNonce() },
            }),
            cspReplCode = $crypto.cspNonceReplacementCode(),
            cspNonce = request1.headers.get('x-csp-nonce') || '',
            response1 = await $http.prepareResponseForCache(
                request1,
                await $http.prepareResponse(request1, {
                    headers: { 'content-type': $mime.contentType('.html') },
                    body:
                        `<script nonce="${cspNonce}"></script>` + //
                        `<script id="global-data" nonce="${cspNonce}">const data = { cspNonce: '${cspNonce}' };</script>`,
                }),
            ),
            response1Headers = response1.headers,
            response1Body = await response1.text();

        expect(response1).toBeInstanceOf(Response);

        expect(response1Headers.get('content-security-policy') || '').toContain("'nonce-" + cspReplCode + "'");
        expect(response1Headers.get('content-security-policy') || '').not.toContain("'nonce-" + cspNonce + "'");

        expect(response1Body).toContain('<script nonce="' + cspReplCode + '"></script>');
        expect(response1Body).not.toContain('<script nonce="' + cspNonce + '"></script>');

        expect(response1Body).toContain('<script id="global-data" nonce="' + cspReplCode + '">');
        expect(response1Body).not.toContain('<script id="global-data" nonce="' + cspNonce + '">');

        expect(response1Body).toContain(" cspNonce: '" + cspReplCode + "'");
        expect(response1Body).not.toContain(" cspNonce: '" + cspNonce + "'");
    });
    test('.requestHash()', async () => {
        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    redirect: 'manual',
                    headers: { 'foo': 'foo', 'bar': 'bar' },
                }),
            ),
        ).toBe('932cedfb51a4f5fdf07be8506fb2bea06d28c58d');

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    headers: { 'bar': 'bar', 'foo': 'foo' },
                    redirect: 'manual',
                }),
            ),
        ).toBe('932cedfb51a4f5fdf07be8506fb2bea06d28c58d');

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    method: 'POST',
                    redirect: 'manual',
                    headers: {
                        'foo': 'foo',
                        'bar': 'bar',
                        'content-type': 'text/plain; charset=utf-8',
                    },
                    body: 'body',
                }),
            ),
        ).toBe('408752f44d6b6106f1b76c6f28d1924b8f569fa5');

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    redirect: 'manual',
                    method: 'POST',
                    headers: {
                        'bar': 'bar',
                        'foo': 'foo',
                        'content-type': 'text/plain; charset=utf-8',
                    },
                    body: 'body',
                }),
            ),
        ).toBe('408752f44d6b6106f1b76c6f28d1924b8f569fa5');
    });
    test('.prepareRefererHeader()', async () => {
        const headers1 = new Headers({ 'referrer-policy': 'no-referrer' });
        $http.prepareRefererHeader(headers1, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers1.get('referer')).toBe(null);

        const headers2 = new Headers({ 'referrer-policy': 'origin' });
        $http.prepareRefererHeader(headers2, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers2.get('referer')).toBe('https://x.tld');

        const headers3 = new Headers({ 'referrer-policy': 'unsafe-url' });
        $http.prepareRefererHeader(headers3, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers3.get('referer')).toBe('https://x.tld/a');

        const headers4 = new Headers({ 'referrer-policy': 'same-origin' });
        $http.prepareRefererHeader(headers4, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers4.get('referer')).toBe('https://x.tld/a');

        const headers5 = new Headers({ 'referrer-policy': 'same-origin' });
        $http.prepareRefererHeader(headers5, 'https://x.tld/a', 'https://y.tld/b');
        expect(headers5.get('referer')).toBe(null);

        const headers6 = new Headers({ 'referrer-policy': 'origin-when-cross-origin' });
        $http.prepareRefererHeader(headers6, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers6.get('referer')).toBe('https://x.tld/a');

        const headers7 = new Headers({ 'referrer-policy': 'origin-when-cross-origin' });
        $http.prepareRefererHeader(headers7, 'https://x.tld/a', 'https://y.tld/b');
        expect(headers7.get('referer')).toBe('https://x.tld');

        const headers8 = new Headers({ 'referrer-policy': 'strict-origin' });
        $http.prepareRefererHeader(headers8, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers8.get('referer')).toBe('https://x.tld');

        const headers9 = new Headers({ 'referrer-policy': 'strict-origin' });
        $http.prepareRefererHeader(headers9, 'https://x.tld/a', 'http://y.tld/b');
        expect(headers9.get('referer')).toBe(null);

        const headers10 = new Headers({ 'referrer-policy': 'no-referrer-when-downgrade' });
        $http.prepareRefererHeader(headers10, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers10.get('referer')).toBe('https://x.tld/a');

        const headers11 = new Headers({ 'referrer-policy': 'no-referrer-when-downgrade' });
        $http.prepareRefererHeader(headers11, 'https://x.tld/a', 'http://x.tld/b');
        expect(headers11.get('referer')).toBe(null);

        const headers12 = new Headers({});
        $http.prepareRefererHeader(headers12, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers12.get('referer')).toBe(null);

        const headers13 = new Headers({ 'referrer-policy': 'strict-origin-when-cross-origin' });
        $http.prepareRefererHeader(headers13, 'https://x.tld/a', 'https://x.tld/b');
        expect(headers13.get('referer')).toBe('https://x.tld/a');

        const headers14 = new Headers({ 'referrer-policy': 'strict-origin-when-cross-origin' });
        $http.prepareRefererHeader(headers14, 'https://x.tld/a', 'https://y.tld/b');
        expect(headers14.get('referer')).toBe('https://x.tld');

        const headers15 = new Headers({ 'referrer-policy': 'strict-origin-when-cross-origin' });
        $http.prepareRefererHeader(headers15, 'https://x.tld/a', 'http://y.tld/b');
        expect(headers15.get('referer')).toBe(null);
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
    test('.responseNeedsContentHeaders()', async () => {
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'OPTIONS' }), 200, '')).toBe(false);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'HEAD' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'HEAD' }), 204, '')).toBe(false);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'GET' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'POST' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'PUT' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'PATCH' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'DELETE' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentHeaders(new Request('https://example.com/', { method: 'ABC' }), 200, '')).toBe(false);
    });
    test('.responseNeedsContentBody()', async () => {
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'OPTIONS' }), 200, '')).toBe(false);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'OPTIONS' }), 204, '')).toBe(false);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'HEAD' }), 200, '')).toBe(false);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'HEAD' }), 204, '')).toBe(false);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'GET' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'GET' }), 204, '')).toBe(false);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'POST' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'PUT' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'PATCH' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'DELETE' }), 200, '')).toBe(true);
        expect($http.responseNeedsContentBody(new Request('https://example.com/', { method: 'ABC' }), 200, '')).toBe(false);
    });
    test('.requestIsVia()', async () => {
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'foo' } }), 'foo')).toBe(true);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; foo' } }), 'foo')).toBe(true);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; foo; bar' } }), 'foo')).toBe(true);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; foo; bar' } }), 'bar')).toBe(true);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; foo; bar;' } }), 'bar')).toBe(true);

        expect($http.requestIsVia(new Request('https://example.com/'), 'foo')).toBe(false);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'bar' } }), 'foo')).toBe(false);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; bar' } }), 'foo')).toBe(false);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; bar; baz' } }), 'foo')).toBe(false);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; bar; baz; x foo' } }), 'foo')).toBe(false);
        expect($http.requestIsVia(new Request('https://example.com/', { headers: { 'x-via': 'x; bar; baz; foo x' } }), 'foo')).toBe(false);
    });
    test('.requestExpectsJSON()', async () => {
        expect($http.requestExpectsJSON(new Request('https://example.com/', { headers: { 'accept': 'application/json' } }))).toBe(true);
        expect($http.requestExpectsJSON(new Request('https://example.com/', { headers: { 'accept': 'application/json; charset=utf-8' } }))).toBe(true);

        expect($http.requestExpectsJSON(new Request('https://example.com/', {}))).toBe(false);
        expect($http.requestExpectsJSON(new Request('https://example.com/api', {}))).toBe(false);
        expect($http.requestExpectsJSON(new Request('https://example.com/api/endpoint/v1', {}))).toBe(false);
        expect($http.requestExpectsJSON(new Request('https://example.com/', { headers: { 'accept': 'text/plain' } }))).toBe(false);
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
    test('.parseHeaders()', async () => {
        const headers = $http.parseHeaders({ A: 'A', B: 'B', c: 'c' });
        expect(headers).toBeInstanceOf(Headers);

        expect(headers.has('a')).toBe(true);
        expect(headers.has('A')).toBe(true);

        expect(headers.has('b')).toBe(true);
        expect(headers.has('B')).toBe(true);

        expect(headers.has('c')).toBe(true);
        expect(headers.has('C')).toBe(true);

        expect(headers.has('d')).toBe(false);
        expect(headers.has('D')).toBe(false);

        expect([...headers.entries()]).toStrictEqual([
            ['a', 'A'],
            ['b', 'B'],
            ['c', 'c'],
        ]);
        expect([
            ...$http
                .parseHeaders(
                    $str.dedent(`
                        POST /features HTTP/1.1
                        Host: example.com
                        Connection: keep-alive
                        Accept: */*
                        Accept: */*
                        Set-Cookie: foo=bar
                        Set-Cookie: foo=bar
                        Accept-Encoding: gzip,deflate
                        Accept-Encoding: gzip,deflate
                        Accept-Language: ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4
                        Content-Type: multipart/form-data; boundary="111362:53119209"
                        Content-Encoding: gzip,deflate
                        Content-Encoding: gzip,deflate
                        Content-Length: 301
                        X-Foo: foo line one
                         foo line two
                        X-Bar: bar line one
                            bar line two
                    `),
                )
                .entries(),
        ]).toStrictEqual([
            ['accept', '*/*, */*'],
            ['accept-encoding', 'gzip,deflate, gzip,deflate'],
            ['accept-language', 'ru-RU,ru;q=0.8,en-US;q=0.6,en;q=0.4'],
            ['connection', 'keep-alive'],
            ['content-encoding', 'gzip,deflate, gzip,deflate'],
            ['content-length', '301'],
            ['content-type', 'multipart/form-data; boundary="111362:53119209"'],
            ['host', 'example.com'],
            ['set-cookie', 'foo=bar'],
            ['set-cookie', 'foo=bar'],
            ['x-bar', 'bar line one bar line two'],
            ['x-foo', 'foo line one foo line two'],
        ]);
    });
    test('.defaultSecurityHeaders()', async () => {
        expect($http.defaultSecurityHeaders()).toSatisfy((v: unknown) => {
            return $is.object(v) && !Object.hasOwn(v, 'timing-allow-origin');
        });
        expect($http.defaultSecurityHeaders({ enableCORs: true })).toSatisfy((v: unknown) => {
            return $is.object(v) && '*' === v['timing-allow-origin'];
        });
    });
    test('.c10nSecurityHeaders()', async () => {
        expect($http.c10nSecurityHeaders()).toSatisfy((v: unknown) => {
            return $is.object(v) && !Object.hasOwn(v, 'timing-allow-origin');
        });
        expect($http.c10nSecurityHeaders({ enableCORs: true })).toSatisfy((v: unknown) => {
            return $is.object(v) && '*' === v['timing-allow-origin'];
        });
    });
});
