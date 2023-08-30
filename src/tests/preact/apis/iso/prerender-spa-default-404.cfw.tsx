/**
 * Test suite.
 */

import HTML from '../../../../preact/components/html.js';
import Head from '../../../../preact/components/head.js';
import Body from '../../../../preact/components/body.js';

import { $env, $to, $preact } from '../../../../index.js';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';

import { default as Router, Route, useRoute, lazy, prerenderSPA } from '../../../../preact/components/router.js';
import type { RouterProps, RouteContextAsProps } from '../../../../preact/components/router.js';

describe('$preactꓺiso.prerenderSPA() default-404', async () => {
	beforeAll(async () => {
		$env.set('@top', 'APP_BASE_URL', 'http://x.tld');
	});
	afterAll(async () => {
		$env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
	});
	const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

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
				{/* No default route in this nested router. */}
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
	const _404 = lazy(() => import('../../../../preact/components/404.js'));

	// ---

	test('.', async () => {
		const { httpStatus: othersOtherFooHTTPStatus, doctypeHTML: othersOtherFooMarkup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/nonexistent?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		console.log(othersOtherFooMarkup);
		expect(othersOtherFooHTTPStatus).toBe(404);
		expect(othersOtherFooMarkup).toContain('<!DOCTYPE html>');
		expect(othersOtherFooMarkup).toContain('<title>404 Error: Not Found</title>');
		expect(othersOtherFooMarkup).toContain('</html>');
	});
});
