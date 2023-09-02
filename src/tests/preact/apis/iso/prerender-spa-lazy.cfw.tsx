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

import { $env, $to, $preact } from '../../../../index.js';
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import $preactꓺcomponentsꓺHTML from '../../../../preact/components/html.js';
import $preactꓺcomponentsꓺHead from '../../../../preact/components/head.js';
import $preactꓺcomponentsꓺBody from '../../../../preact/components/body.js';
import { prerenderSPA as $preactꓺapisꓺisoꓺprerenderSPA } from '../../../../preact/apis/iso.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('$preactꓺiso.prerenderSPA() lazy', async () => {
	beforeAll(async () => {
		$env.set('@top', 'APP_BASE_URL', 'http://x.tld');
	});
	afterAll(async () => {
		$env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
	});
	test('.', async () => {
		const globalFetchMock = vi.fn(async () => new Response('x'));
		vi.stubGlobal('fetch', globalFetchMock);

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
						<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
					</$preactꓺcomponentsꓺBody>
				</$preactꓺcomponentsꓺHTML>
			);
		};
		const Lazy = $preactꓺcomponentsꓺrouterꓺlazyRoute(() => import('./x-imports/routes/lazy.js'));
		const Default404 = $preactꓺcomponentsꓺrouterꓺlazyRoute(() => import('../../../../preact/routes/404.js'));

		const { httpState: indexHTTPState, doctypeHTML: indexMarkup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(indexHTTPState.status).toBe(200);
		expect(indexMarkup).toContain('<!DOCTYPE html>');
		expect(indexMarkup).toContain('<title>index</title>');
		expect(indexMarkup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(indexMarkup).toContain('<script type="module" src="/script.js"></script>');
		expect(indexMarkup).toContain('"path":"/"');
		expect(indexMarkup).toContain('"pathQuery":"/?a=_a&b=_b&c=_c"');
		expect(indexMarkup).toContain('"restPath":""');
		expect(indexMarkup).toContain('"restPathQuery":""');
		expect(indexMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(indexMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(indexMarkup).toContain('"params":{}');
		expect(indexMarkup).toContain('</html>');

		const { httpState: lazyHTTPState, doctypeHTML: lazyMarkup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/lazy?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(lazyHTTPState.status).toBe(200);
		expect(lazyMarkup).toContain('<!DOCTYPE html>');
		expect(lazyMarkup).toContain('<title>lazy</title>');
		expect(lazyMarkup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(lazyMarkup).toContain('<script type="module" src="/script.js"></script>');
		expect(lazyMarkup).toContain('"path":"/lazy"');
		expect(lazyMarkup).toContain('"pathQuery":"/lazy?a=_a&b=_b&c=_c"');
		expect(lazyMarkup).toContain('"restPath":""');
		expect(lazyMarkup).toContain('"restPathQuery":""');
		expect(lazyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(lazyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(lazyMarkup).toContain('"params":{}');
		expect(lazyMarkup).toContain('<script type="lazy-component-props">{"a":"_a","b":"_b","c":"_c"}</script>');
		expect(lazyMarkup).toContain('</html>');
	});
});
