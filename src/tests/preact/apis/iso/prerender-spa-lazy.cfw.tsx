/**
 * Test suite.
 */

import {
	default as $preactꓺcomponentsꓺRouter,
	Route as $preactꓺcomponentsꓺrouterꓺRoute,
	useRoute as $preactꓺcomponentsꓺrouterꓺuseRoute,
	lazyRoute as $preactꓺcomponentsꓺrouterꓺlazyRoute,
} from '../../../../preact/components/router.js';

import type {
	RouterProps as $preactꓺcomponentsꓺrouterꓺRouterProps,
	RouteContextAsProps as $preactꓺcomponentsꓺrouterꓺRouteContextAsProps,
} from '../../../../preact/components/router.js';

import { $env, $json, $preact } from '../../../../index.js';
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import $preactꓺcomponentsꓺHTML from '../../../../preact/components/html.js';
import $preactꓺcomponentsꓺHead from '../../../../preact/components/head.js';
import $preactꓺcomponentsꓺBody from '../../../../preact/components/body.js';
import { prerenderSPA as $preactꓺapisꓺisoꓺprerenderSPA } from '../../../../preact/apis/iso.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('$preactꓺapisꓺiso.prerenderSPA() lazy', async () => {
	beforeAll(async () => {
		$env.set('@top', 'APP_BASE_URL', 'http://x.tld');
	});
	afterAll(async () => {
		$env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
	});
	test('.', async () => {
		const globalFetchMock = vi.fn(async () => {
			return new Response('x', {
				status: 200,
				headers: { 'content-type': 'text/plain; charset=utf-8' },
			});
		});
		vi.stubGlobal('fetch', globalFetchMock); // Used by lazy route.

		const App = (props: $preactꓺcomponentsꓺrouterꓺRouterProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouterProps> => {
			return (
				<$preactꓺcomponentsꓺRouter {...props}>
					<$preactꓺcomponentsꓺrouterꓺRoute path='/' component={Index} />
					<$preactꓺcomponentsꓺrouterꓺRoute path='/lazy/*' component={Lazy} />
					<$preactꓺcomponentsꓺrouterꓺRoute default component={Default404} />
				</$preactꓺcomponentsꓺRouter>
			);
		};
		const Index = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
			return (
				<$preactꓺcomponentsꓺHTML>
					<$preactꓺcomponentsꓺHead title={'index'} />
					<$preactꓺcomponentsꓺBody>
						<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
					</$preactꓺcomponentsꓺBody>
				</$preactꓺcomponentsꓺHTML>
			);
		};
		const Lazy = $preactꓺcomponentsꓺrouterꓺlazyRoute(() => import('./x-imports/routes/lazy.js'));
		const Default404 = $preactꓺcomponentsꓺrouterꓺlazyRoute(() => import('../../../../preact/routes/404.js'));

		const {
			httpState: indexHTTPState,
			docType: indexDocType,
			html: indexHTML,
		} = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(indexHTTPState.status).toBe(200);
		expect(indexDocType).toBe('<!DOCTYPE html>');
		expect(indexHTML).toContain('<title>index</title>');
		expect(indexHTML).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(indexHTML).toContain('<script type="module" src="/script.js"></script>');
		expect(indexHTML).toContain('"path":"/"');
		expect(indexHTML).toContain('"pathQuery":"/?a=_a&b=_b&c=_c"');
		expect(indexHTML).toContain('"restPath":""');
		expect(indexHTML).toContain('"restPathQuery":""');
		expect(indexHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(indexHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(indexHTML).toContain('"params":{}');
		expect(indexHTML).toContain('</html>');

		const {
			httpState: lazyHTTPState,
			docType: lazyDocType,
			html: lazyHTML,
		} = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/lazy?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(lazyHTTPState.status).toBe(200);
		expect(lazyDocType).toBe('<!DOCTYPE html>');
		expect(lazyHTML).toContain('<title>lazy</title>');
		expect(lazyHTML).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(lazyHTML).toContain('<script type="module" src="/script.js"></script>');
		expect(lazyHTML).toContain('"path":"/lazy"');
		expect(lazyHTML).toContain('"pathQuery":"/lazy?a=_a&b=_b&c=_c"');
		expect(lazyHTML).toContain('"restPath":""');
		expect(lazyHTML).toContain('"restPathQuery":""');
		expect(lazyHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(lazyHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(lazyHTML).toContain('"params":{}');
		expect(lazyHTML).toContain('<script type="lazy-component-props">{"a":"_a","b":"_b","c":"_c"}</script>');
		expect(lazyHTML).toContain(
			// ISO fetcher cache should be dumped into script tag for client-side use.
			'.cache = {"d7b70ada5bdf8fd5be68ba2c359958a3768e044e":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"d77a93a8edb0b9a6e7655df474aaed757e4ae449":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"ddd3a839cabaa8bd47010410e0d588596e4e539e":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"c34287a716fbae3b50f5fe7070c998e997368560":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}}}',
		);
		expect(lazyHTML).toContain('</html>');
	});
});
