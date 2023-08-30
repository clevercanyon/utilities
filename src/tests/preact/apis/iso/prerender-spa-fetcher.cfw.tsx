/**
 * Test suite.
 */

import HTML from '../../../../preact/components/html.js';
import Head from '../../../../preact/components/head.js';
import Body from '../../../../preact/components/body.js';
import { $env, $to, $preact } from '../../../../index.js';
import { prerenderSPA } from '../../../../preact/apis/iso.js';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import type { RouterProps, RouteContextAsProps } from '../../../../preact/components/router.js';
import { default as Router, Route, useRoute, lazyRoute } from '../../../../preact/components/router.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

/*
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
		const App = (props: RouterProps): $preact.VNode<RouterProps> => {
			return (
				<Router {...props}>
					<Route path='/' component={Index} />
					<Route path='/others/*' component={Others} />
					<Route default component={_404} />
				</Router>
			);
		};
		const Index = (): $preact.VNode<RouteContextAsProps> => {
			return (
				<HTML>
					<Head title={'index'} />
					<Body>
						<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(useRoute()) }}></script>
					</Body>
				</HTML>
			);
		};
		const Others = (): $preact.VNode<RouteContextAsProps> => {
			return (
				<Router {...useRoute()}>
					<Route path='/other' component={Other} />
				</Router>
			);
		};
		const Other = (): $preact.VNode<RouteContextAsProps> => {
			return (
				<HTML>
					<Head title={'other'} />
					<Body>
						<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(useRoute()) }}></script>
					</Body>
				</HTML>
			);
		};
		const _404 = lazyRoute(() => import('../../../../preact/components/404.js'));

		const { httpStatus: indexHTTPStatus, doctypeHTML: indexMarkup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(indexHTTPStatus).toBe(200);
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
