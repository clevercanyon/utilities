/**
 * Test suite.
 */

import {
	default as $preactꓺcomponentsꓺRouter,
	Route as $preactꓺcomponentsꓺrouterꓺRoute,
	useRoute as $preactꓺcomponentsꓺrouterꓺuseRoute,
	lazyComponent as $preactꓺcomponentsꓺrouterꓺlazyComponent,
} from '../../../../preact/components/router.js';

import type {
	RouterProps as $preactꓺcomponentsꓺrouterꓺRouterProps,
	RouteContextAsProps as $preactꓺcomponentsꓺrouterꓺRouteContextAsProps,
} from '../../../../preact/components/router.js';

import { $env, $to, $preact } from '../../../../index.js';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import $preactꓺcomponentsꓺHTML from '../../../../preact/components/html.js';
import $preactꓺcomponentsꓺHead from '../../../../preact/components/head.js';
import $preactꓺcomponentsꓺBody from '../../../../preact/components/body.js';
import { prerenderSPA as $preactꓺapisꓺisoꓺprerenderSPA } from '../../../../preact/apis/iso.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

/*
@todo:
- Test nested fetch calls.
- Test throwing of promises.
- Test client-side hydration.
*/
describe('$preactꓺiso.prerenderSPA() fetcher', async () => {
	beforeAll(async () => {
		$env.set('@top', 'APP_BASE_URL', 'http://x.tld');
	});
	afterAll(async () => {
		$env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
	});
	test('.', async () => {
		const App = (props: $preactꓺcomponentsꓺrouterꓺRouterProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouterProps> => {
			return (
				<$preactꓺcomponentsꓺRouter {...props}>
					<$preactꓺcomponentsꓺrouterꓺRoute path='/' component={Index} />
					<$preactꓺcomponentsꓺrouterꓺRoute path='/others/*' component={Others} />
					<$preactꓺcomponentsꓺrouterꓺRoute default component={_404} />
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
		const Others = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
			return (
				<$preactꓺcomponentsꓺRouter {...$preactꓺcomponentsꓺrouterꓺuseRoute()}>
					<$preactꓺcomponentsꓺrouterꓺRoute path='/other' component={Other} />
				</$preactꓺcomponentsꓺRouter>
			);
		};
		const Other = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
			return (
				<$preactꓺcomponentsꓺHTML>
					<$preactꓺcomponentsꓺHead title={'other'} />
					<$preactꓺcomponentsꓺBody>
						<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
					</$preactꓺcomponentsꓺBody>
				</$preactꓺcomponentsꓺHTML>
			);
		};
		const _404 = $preactꓺcomponentsꓺrouterꓺlazyComponent(() => import('../../../../preact/routes/404.js'));

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
	});
});
