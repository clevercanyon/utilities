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
import { prerenderSPA as $preactꓺapisꓺisoꓺprerenderSPA, hydrativelyRenderSPA as $preactꓺapisꓺisoꓺhydrativelyRenderSPA } from '../../../../preact/apis/iso.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('$preactꓺapisꓺiso.hydrativelyRenderSPA()', async () => {
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
				<$preactꓺcomponentsꓺrouterꓺRoute path='/blog' component={Blog} />
				<$preactꓺcomponentsꓺrouterꓺRoute path='/blog/post/:id' component={Blog} />
				<$preactꓺcomponentsꓺrouterꓺRoute default component={Default404} />
			</$preactꓺcomponentsꓺRouter>
		);
	};
	const Index = (unusedꓺprops: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'index'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const Blog = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={/^\/blog\/post\//u.test(props.path || '') ? 'blog post' : 'blog'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const Default404 = $preactꓺcomponentsꓺrouterꓺlazyRoute(() => import('../../../../preact/routes/404.js'));

	// ---

	test('basics', async () => {
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

		// Populate DOM now and continue.

		Object.defineProperty(window, 'location', { value: new URL('http://x.tld/?a=_a&b=_b&c=_c') });
		document.open(), document.write(indexHTML /* Must not contain doctype tag. */), document.close();

		// Neither `document.write` or `(outer|inner)HTML` do not run embedded script tags, for security reasons.
		// So that's why we're explicitly extracting and running script code using a `new Function()` below.
		const dataScriptCode = indexHTML.match(/<script id="data">([^<>]+)<\/script>/iu)?.[1] || '';
		// eslint-disable-next-line @typescript-eslint/no-implied-eval -- OK when testing.
		if (dataScriptCode) new Function(dataScriptCode)(); // Execute script code.

		const domIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
		const domIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

		expect(domIndexHeadMarkup).toContain('<title>index</title>');
		expect(domIndexHeadMarkup).toContain('<link rel="stylesheet" href="/style.css" media="all">');
		expect(domIndexHeadMarkup).toContain('<script type="module" src="/script.js"></script>');
		expect(domIndexBodyMarkup).toContain('"path":"/"');
		expect(domIndexBodyMarkup).toContain('"path":"/"');
		expect(domIndexBodyMarkup).toContain('"pathQuery":"/?a=_a&b=_b&c=_c"');
		expect(domIndexBodyMarkup).toContain('"restPath":""');
		expect(domIndexBodyMarkup).toContain('"restPathQuery":""');
		expect(domIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(domIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(domIndexBodyMarkup).toContain('"params":{}');

		// Hydrate DOM now and continue.

		$preactꓺapisꓺisoꓺhydrativelyRenderSPA({ App });

		const domHydratedIndexMarkup = document.documentElement.outerHTML;
		const domHydratedIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
		const domHydratedIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

		expect(domHydratedIndexMarkup).toContain('<html lang="en" data-preact-iso="true">');
		expect(domHydratedIndexHeadMarkup).toContain('<title>index</title>');
		expect(domHydratedIndexHeadMarkup).toContain('<link rel="stylesheet" href="/style.css" media="all">');
		expect(domHydratedIndexHeadMarkup).toContain('<script type="module" src="/script.js"></script>');
		expect(domHydratedIndexBodyMarkup).toContain('"path":"/"');
		expect(domHydratedIndexBodyMarkup).toContain('"pathQuery":"/?a=_a&b=_b&c=_c"');
		expect(domHydratedIndexBodyMarkup).toContain('"restPath":""');
		expect(domHydratedIndexBodyMarkup).toContain('"restPathQuery":""');
		expect(domHydratedIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(domHydratedIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(domHydratedIndexBodyMarkup).toContain('"params":{}');
	});
});
