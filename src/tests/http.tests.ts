/**
 * Test suite.
 */

import { $http } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$http tests', async () => {
	test('$http.requestConfig()', async () => {
		expect($http.requestConfig()).toStrictEqual({});
	});
	test('$http.responseConfig()', async () => {
		expect($http.responseConfig()).toStrictEqual({
			response: null,
			status: 500,
			body: null,
			headers: {},
			appendHeaders: {},
			enableCORs: false,
			enableCDN: true,
		});
		expect(
			$http.responseConfig({
				response: new Response(),
				status: 200,
				body: 'abc',
				headers: { a: 'a', b: 'b', c: 'c' },
				appendHeaders: { d: 'd', e: 'e', f: 'f' },
				enableCORs: true,
				enableCDN: false,
			}),
		).toStrictEqual({
			response: new Response(),
			status: 200,
			body: 'abc',
			headers: { a: 'a', b: 'b', c: 'c' },
			appendHeaders: { d: 'd', e: 'e', f: 'f' },
			enableCORs: true,
			enableCDN: false,
		});
	});
	test('$http.prepareRequest()', async () => {
		const request1 = $http.prepareRequest(new Request('https://example.com/?utx_abc=abc&utm_abc=abc&xyz=xyz&abc=abc'));
		expect(request1).toBeInstanceOf(Request);
		expect(request1.url.toString()).toBe('https://example.com/?abc=abc&xyz=xyz');
	});
	test('$http.prepareResponse() $https.prepareResponseHeaders()', async () => {
		const response1 = $http.prepareResponse(new Request('https://example.com/?abc=abc&xyz=xyz'), {
			headers: { a: 'a', b: 'b', c: 'c', vary: 'abc' },
			appendHeaders: { c: 'c', 'x-ua-compatible': 'abc' },
		});
		expect(response1).toBeInstanceOf(Response);
		expect(response1.headers.get('a')).toBe('a');
		expect(response1.headers.get('b')).toBe('b');
		expect(response1.headers.get('c')).toBe('c, c');
		expect(response1.headers.get('vary')).toBe('abc');
		expect(response1.headers.get('x-ua-compatible')).toBe('IE=edge, abc');
		expect(response1.headers.get('x-frame-options')).toBe('SAMEORIGIN');
	});
	test('$http.responseStatusText()', async () => {
		expect($http.responseStatusText(200)).toBe('OK');
		expect($http.responseStatusText(400)).toBe('Bad Request');
		expect($http.responseStatusText(403)).toBe('Forbidden');
		expect($http.responseStatusText(500)).toBe('Internal Server Error');
		expect($http.responseStatusText(503)).toBe('Service Unavailable');
	});
	test('$http.requestHasSupportedMethod()', async () => {
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'OPTIONS' }))).toBe(true);
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'HEAD' }))).toBe(true);
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'GET' }))).toBe(true);
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'POST' }))).toBe(true);
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'PUT' }))).toBe(true);
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'PATCH' }))).toBe(true);
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'DELETE' }))).toBe(true);
		expect($http.requestHasSupportedMethod(new Request('https://example.com/', { method: 'ABC' }))).toBe(false);
	});
	test('$http.requestHasCacheableMethod()', async () => {
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'OPTIONS' }))).toBe(false);
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'HEAD' }))).toBe(true);
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'GET' }))).toBe(true);
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'POST' }))).toBe(false);
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'PUT' }))).toBe(false);
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'PATCH' }))).toBe(false);
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'DELETE' }))).toBe(false);
		expect($http.requestHasCacheableMethod(new Request('https://example.com/', { method: 'ABC' }))).toBe(false);
	});
	test('$http.requestNeedsContentHeaders()', async () => {
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
	test('$http.requestNeedsContentBody()', async () => {
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
	test('$http.requestIsFromUser()', async () => {
		expect($http.requestIsFromUser(new Request('https://example.com/'))).toBe(false);
		expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { cookie: 'abc' } }))).toBe(false);
		expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { cookie: 'user=abc' } }))).toBe(false);
		expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { cookie: 'user_id=abc' } }))).toBe(true);
		expect($http.requestIsFromUser(new Request('https://example.com/', { headers: { authorization: 'abc' } }))).toBe(true);
	});
	test('$http.requestPathIsInvalid()', async () => {
		expect($http.requestPathIsInvalid(new Request('https://example.com/'))).toBe(false);
		expect($http.requestPathIsInvalid(new Request('https://example.com/\\abc'))).toBe(true);
		expect($http.requestPathIsInvalid(new Request('https://example.com/..abc'))).toBe(true);
		expect($http.requestPathIsInvalid(new Request('https://example.com/a//b/c'))).toBe(true);
	});
	test('$http.requestPathIsForbidden()', async () => {
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

		expect($http.requestPathIsForbidden(new Request('https://example.com/cache'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/cache/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/private'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/private/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/logs'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/logs/a'))).toBe(true);

		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/cache'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/cache/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/private'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/private/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/mu-plugins'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/mu_plugins'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/mu_plugins/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/upgrade'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/upgrade/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/wc-logs'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/wc_logs'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/wc_logs/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/woocommerce-uploads'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/woocommerce_uploads'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/woocommerce_uploads/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/lmfwc-files'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/lmfwc_files'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/wp-content/uploads/lmfwc_files/a'))).toBe(true);

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

		expect($http.requestPathIsForbidden(new Request('https://example.com/x.sh'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.sh/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.bash'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.bash/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.zsh'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.zsh/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.php'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.php/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.php7'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.php7/a'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.phtm'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.phtml'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.shtm'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.shtml'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.asp'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.aspx'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.pl'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.plx'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.cgi'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.ppl'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.perl'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.go'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.rs'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.rlib'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.rb'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.py'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.pyi'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.pyc'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.pyd'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.pyo'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.pyw'))).toBe(true);
		expect($http.requestPathIsForbidden(new Request('https://example.com/x.pyz'))).toBe(true);
	});
	test('$http.requestPathIsDynamic()', async () => {
		expect($http.requestPathIsDynamic(new Request('https://example.com/'))).toBe(true);
		expect($http.requestPathIsDynamic(new Request('https://example.com/abc'))).toBe(true);
		expect($http.requestPathIsDynamic(new Request('https://example.com/def'))).toBe(true);
		expect($http.requestPathIsDynamic(new Request('https://example.com/ghi.js'))).toBe(false);
		expect($http.requestPathIsDynamic(new Request('https://example.com/ghi.png'))).toBe(false);
	});
	test('$http.requestPathIsStatic()', async () => {
		expect($http.requestPathIsStatic(new Request('https://example.com/'))).toBe(false);
		expect($http.requestPathIsStatic(new Request('https://example.com/abc'))).toBe(false);
		expect($http.requestPathIsStatic(new Request('https://example.com/def'))).toBe(false);
		expect($http.requestPathIsStatic(new Request('https://example.com/ghi.js'))).toBe(true);
		expect($http.requestPathIsStatic(new Request('https://example.com/ghi.png'))).toBe(true);
	});
	test('$http.requestPathHasDynamicBase()', async () => {
		// @review Testing this requires `$env.isC10n()` to be true.
		expect($http.requestPathHasDynamicBase(new Request('https://example.com/'))).toBe(false);
	});
	test('$http.requestPathIsPotentiallyDynamic()', async () => {
		// @review Testing this requires `$env.isC10n()` to be true.
		expect($http.requestPathIsPotentiallyDynamic(new Request('https://example.com/'))).toBe(false);
	});
	test('$http.requestPathIsSEORelatedFile()', async () => {
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/'))).toBe(false);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/robots.txt'))).toBe(true);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/favicon.ico'))).toBe(true);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap.xml'))).toBe(true);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap_index.xml'))).toBe(true);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap-index.xml'))).toBe(true);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemap2.xml'))).toBe(true);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/sitemapAbc.xml'))).toBe(true);
		expect($http.requestPathIsSEORelatedFile(new Request('https://example.com/locations.kml'))).toBe(true);
	});
	test('$http.requestPathIsInAdmin()', async () => {
		expect($http.requestPathIsInAdmin(new Request('https://example.com/'))).toBe(false);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/admin'))).toBe(true);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/admin/a'))).toBe(true);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/a/admin/a'))).toBe(true);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/wp-admin'))).toBe(true);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/wp_admin'))).toBe(true);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/wp_admin/a'))).toBe(true);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/a/wp_admin/a'))).toBe(true);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/wp-admin/admin-ajax.php'))).toBe(false);
		expect($http.requestPathIsInAdmin(new Request('https://example.com/wp_admin/admin_ajax.php'))).toBe(false);
	});
	test('$http.requestPathHasStaticExtension()', async () => {
		expect($http.requestPathHasStaticExtension(new Request('https://example.com/'))).toBe(false);
		expect($http.requestPathHasStaticExtension(new Request('https://example.com/robots.php'))).toBe(false);
		expect($http.requestPathHasStaticExtension(new Request('https://example.com/robots.txt'))).toBe(true);
	});
	test('$http.extractHeaders()', async () => {
		expect($http.extractHeaders(new Headers({ A: 'A', B: 'B', c: 'c' }))).toStrictEqual({ a: 'A', b: 'B', c: 'c' });
		expect($http.extractHeaders(new Headers({ A: 'A', B: 'B', c: 'c' }), { lowercase: false })).toStrictEqual({ a: 'A', b: 'B', c: 'c' });

		expect($http.extractHeaders({ A: 'A', B: 'B', c: 'c' })).toStrictEqual({ a: 'A', b: 'B', c: 'c' });
		expect($http.extractHeaders({ A: 'A', B: 'B', c: 'c' }, { lowercase: false })).toStrictEqual({ A: 'A', B: 'B', c: 'c' });
	});
});
