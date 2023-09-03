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
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import $preactꓺcomponentsꓺHTML from '../../../../preact/components/html.js';
import $preactꓺcomponentsꓺHead from '../../../../preact/components/head.js';
import $preactꓺcomponentsꓺBody from '../../../../preact/components/body.js';
import { prerenderSPA as $preactꓺapisꓺisoꓺprerenderSPA } from '../../../../preact/apis/iso.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('$preactꓺiso.prerenderSPA() default-404', async () => {
	beforeAll(async () => {
		$env.set('@top', 'APP_BASE_URL', 'http://x.tld');
	});
	afterAll(async () => {
		$env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
	});
	const App = (props: $preactꓺcomponentsꓺrouterꓺRouterProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouterProps> => {
		return (
			<$preactꓺcomponentsꓺRouter {...props}>
				<$preactꓺcomponentsꓺrouterꓺRoute path='/' component={Index} />
				<$preactꓺcomponentsꓺrouterꓺRoute path='/others/*' component={Others} />
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
	const Others = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺRouter {...$preactꓺcomponentsꓺrouterꓺuseRoute()}>
				<$preactꓺcomponentsꓺrouterꓺRoute path='/other' component={Other} />
				{/* No default route in this nested router. */}
			</$preactꓺcomponentsꓺRouter>
		);
	};
	const Other = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'other'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const Default404 = $preactꓺcomponentsꓺrouterꓺlazyRoute(() => import('../../../../preact/routes/404.js'));

	// ---

	test('.', async () => {
		const { httpState: othersOtherFooHTTPState, doctypeHTML: othersOtherFooMarkup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/nonexistent?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherFooHTTPState.status).toBe(404);
		expect(othersOtherFooMarkup).toContain('<!DOCTYPE html>');
		expect(othersOtherFooMarkup).toContain('<title>404 Error: Not Found</title>');
		expect(othersOtherFooMarkup).toContain('</html>');
	});
});
