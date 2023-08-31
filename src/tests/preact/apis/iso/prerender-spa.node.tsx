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
import { useHTTP as $preactꓺcomponentsꓺdataꓺuseHTTP } from '../../../../preact/components/data.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('$preactꓺiso.prerenderSPA()', async () => {
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
				<$preactꓺcomponentsꓺrouterꓺRoute path='/others/*' component={Others} />
				<$preactꓺcomponentsꓺrouterꓺRoute default component={_404} />
			</$preactꓺcomponentsꓺRouter>
		);
	};
	const Index = (unusedꓺprops: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'index'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const Blog = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={/^\/blog\/post\//u.test(props.path || '') ? 'blog post' : 'blog'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const Others = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺRouter {...props}>
				<$preactꓺcomponentsꓺrouterꓺRoute path='/other-a/:x' component={OtherA} />
				<$preactꓺcomponentsꓺrouterꓺRoute path='/other-b/*' component={OtherB} />
				<$preactꓺcomponentsꓺrouterꓺRoute path='/other-c/:x*' component={OtherC} />
				<$preactꓺcomponentsꓺrouterꓺRoute path='/other-d/:x+' component={OtherD} />
				<$preactꓺcomponentsꓺrouterꓺRoute path='/other-e/:x?' component={OtherE} />
				<$preactꓺcomponentsꓺrouterꓺRoute path='/other-a/*' component={OtherA} />
				<$preactꓺcomponentsꓺrouterꓺRoute default component={Other404} />
			</$preactꓺcomponentsꓺRouter>
		);
	};
	const OtherA = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'other-a'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const OtherB = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'other-b'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const OtherC = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'other-c'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const OtherD = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'other-d'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const OtherE = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'other-e'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const Other404 = (props: $preactꓺcomponentsꓺrouterꓺRouteContextAsProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
		const { updateState: updateHTTPState } = $preactꓺcomponentsꓺdataꓺuseHTTP();
		updateHTTPState({ status: 404 }); // Record 404 error.

		return (
			<$preactꓺcomponentsꓺHTML>
				<$preactꓺcomponentsꓺHead title={'other-404'} />
				<$preactꓺcomponentsꓺBody>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</$preactꓺcomponentsꓺBody>
			</$preactꓺcomponentsꓺHTML>
		);
	};
	const _404 = $preactꓺcomponentsꓺrouterꓺlazyComponent(() => import('../../../../preact/routes/404.js'));

	// ---

	test('basics', async () => {
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

		// ---

		const { httpState: blogHTTPState, doctypeHTML: blogMarkup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/blog?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(blogHTTPState.status).toBe(200);
		expect(blogMarkup).toContain('<!DOCTYPE html>');
		expect(blogMarkup).toContain('<title>blog</title>');
		expect(blogMarkup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(blogMarkup).toContain('<script type="module" src="/script.js"></script>');
		expect(blogMarkup).toContain('"path":"/blog"');
		expect(blogMarkup).toContain('"pathQuery":"/blog?a=_a&b=_b&c=_c"');
		expect(blogMarkup).toContain('"restPath":""');
		expect(blogMarkup).toContain('"restPathQuery":""');
		expect(blogMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(blogMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(blogMarkup).toContain('"params":{}');
		expect(blogMarkup).toContain('</html>');

		// ---

		const { httpState: blogPostHTTPState, doctypeHTML: blogPostMarkup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/blog/post/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(blogPostHTTPState.status).toBe(200);
		expect(blogPostMarkup).toContain('<!DOCTYPE html>');
		expect(blogPostMarkup).toContain('<title>blog post</title>');
		expect(blogPostMarkup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(blogPostMarkup).toContain('<script type="module" src="/script.js"></script>');
		expect(blogPostMarkup).toContain('"path":"/blog/post/123"');
		expect(blogPostMarkup).toContain('"pathQuery":"/blog/post/123?a=_a&b=_b&c=_c"');
		expect(blogPostMarkup).toContain('"restPath":""');
		expect(blogPostMarkup).toContain('"restPathQuery":""');
		expect(blogPostMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(blogPostMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(blogPostMarkup).toContain('"params":{"id":"123"}');
		expect(blogPostMarkup).toContain('</html>');

		// ---

		const { httpState: othersOtherA1HTTPState, doctypeHTML: othersOtherA1Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-a/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherA1HTTPState.status).toBe(200);
		expect(othersOtherA1Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherA1Markup).toContain('<title>other-a</title>');
		expect(othersOtherA1Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherA1Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherA1Markup).toContain('"path":"/other-a/123"');
		expect(othersOtherA1Markup).toContain('"pathQuery":"/other-a/123?a=_a&b=_b&c=_c"');
		expect(othersOtherA1Markup).toContain('"restPath":""');
		expect(othersOtherA1Markup).toContain('"restPathQuery":""');
		expect(othersOtherA1Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherA1Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherA1Markup).toContain('"params":{"x":"123"}');
		expect(othersOtherA1Markup).toContain('</html>');

		const { httpState: othersOtherA2HTTPState, doctypeHTML: othersOtherA2Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-a/123/another?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherA2HTTPState.status).toBe(200);
		expect(othersOtherA2Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherA2Markup).toContain('<title>other-a</title>');
		expect(othersOtherA2Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherA2Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherA2Markup).toContain('"path":"/other-a/123/another"');
		expect(othersOtherA2Markup).toContain('"pathQuery":"/other-a/123/another?a=_a&b=_b&c=_c"');
		expect(othersOtherA2Markup).toContain('"restPath":"/123/another"');
		expect(othersOtherA2Markup).toContain('"restPathQuery":"/123/another?a=_a&b=_b&c=_c"');
		expect(othersOtherA2Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherA2Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherA2Markup).toContain('"params":{}');
		expect(othersOtherA2Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherB1HTTPState, doctypeHTML: othersOtherB1Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-b?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherB1HTTPState.status).toBe(200);
		expect(othersOtherB1Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherB1Markup).toContain('<title>other-b</title>');
		expect(othersOtherB1Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherB1Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherB1Markup).toContain('"path":"/other-b"');
		expect(othersOtherB1Markup).toContain('"pathQuery":"/other-b?a=_a&b=_b&c=_c"');
		expect(othersOtherB1Markup).toContain('"restPath":""');
		expect(othersOtherB1Markup).toContain('"restPathQuery":""');
		expect(othersOtherB1Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherB1Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherB1Markup).toContain('"params":{}');
		expect(othersOtherB1Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherB2HTTPState, doctypeHTML: othersOtherB2Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-b/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherB2HTTPState.status).toBe(200);
		expect(othersOtherB2Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherB2Markup).toContain('<title>other-b</title>');
		expect(othersOtherB2Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherB2Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherB2Markup).toContain('"path":"/other-b/123"');
		expect(othersOtherB2Markup).toContain('"pathQuery":"/other-b/123?a=_a&b=_b&c=_c"');
		expect(othersOtherB2Markup).toContain('"restPath":"/123"');
		expect(othersOtherB2Markup).toContain('"restPathQuery":"/123?a=_a&b=_b&c=_c"');
		expect(othersOtherB2Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherB2Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherB2Markup).toContain('"params":{}');
		expect(othersOtherB2Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherC1HTTPState, doctypeHTML: othersOtherC1Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-c?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherC1HTTPState.status).toBe(200);
		expect(othersOtherC1Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherC1Markup).toContain('<title>other-c</title>');
		expect(othersOtherC1Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherC1Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherC1Markup).toContain('"path":"/other-c"');
		expect(othersOtherC1Markup).toContain('"pathQuery":"/other-c?a=_a&b=_b&c=_c"');
		expect(othersOtherC1Markup).toContain('"restPath":""');
		expect(othersOtherC1Markup).toContain('"restPathQuery":""');
		expect(othersOtherC1Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherC1Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherC1Markup).toContain('"params":{"x":""}');
		expect(othersOtherC1Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherC2HTTPState, doctypeHTML: othersOtherC2Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-c/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherC2HTTPState.status).toBe(200);
		expect(othersOtherC2Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherC2Markup).toContain('<title>other-c</title>');
		expect(othersOtherC2Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherC2Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherC2Markup).toContain('"path":"/other-c/123"');
		expect(othersOtherC2Markup).toContain('"pathQuery":"/other-c/123?a=_a&b=_b&c=_c"');
		expect(othersOtherC2Markup).toContain('"restPath":""');
		expect(othersOtherC2Markup).toContain('"restPathQuery":""');
		expect(othersOtherC2Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherC2Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherC2Markup).toContain('"params":{"x":"123"}');
		expect(othersOtherC2Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherC3HTTPState, doctypeHTML: othersOtherC3Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-c/123/456/789?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherC3HTTPState.status).toBe(200);
		expect(othersOtherC3Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherC3Markup).toContain('<title>other-c</title>');
		expect(othersOtherC3Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherC3Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherC3Markup).toContain('"path":"/other-c/123/456/789"');
		expect(othersOtherC3Markup).toContain('"pathQuery":"/other-c/123/456/789?a=_a&b=_b&c=_c"');
		expect(othersOtherC3Markup).toContain('"restPath":""');
		expect(othersOtherC3Markup).toContain('"restPathQuery":""');
		expect(othersOtherC3Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherC3Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherC3Markup).toContain('"params":{"x":"123/456/789"}');
		expect(othersOtherC3Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherD1HTTPState, doctypeHTML: othersOtherD1Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-d?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherD1HTTPState.status).toBe(404);
		expect(othersOtherD1Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherD1Markup).toContain('<title>other-404</title>');
		expect(othersOtherD1Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherD1Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherD1Markup).toContain('"path":"/other-d"');
		expect(othersOtherD1Markup).toContain('"pathQuery":"/other-d?a=_a&b=_b&c=_c"');
		expect(othersOtherD1Markup).toContain('"restPath":""');
		expect(othersOtherD1Markup).toContain('"restPathQuery":""');
		expect(othersOtherD1Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherD1Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherD1Markup).toContain('"params":{}');
		expect(othersOtherD1Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherD2HTTPState, doctypeHTML: othersOtherD2Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-d/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherD2HTTPState.status).toBe(200);
		expect(othersOtherD2Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherD2Markup).toContain('<title>other-d</title>');
		expect(othersOtherD2Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherD2Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherD2Markup).toContain('"path":"/other-d/123"');
		expect(othersOtherD2Markup).toContain('"pathQuery":"/other-d/123?a=_a&b=_b&c=_c"');
		expect(othersOtherD2Markup).toContain('"restPath":""');
		expect(othersOtherD2Markup).toContain('"restPathQuery":""');
		expect(othersOtherD2Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherD2Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherD2Markup).toContain('"params":{"x":"123"}');
		expect(othersOtherD2Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherD3HTTPState, doctypeHTML: othersOtherD3Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-d/123/456?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherD3HTTPState.status).toBe(200);
		expect(othersOtherD3Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherD3Markup).toContain('<title>other-d</title>');
		expect(othersOtherD3Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherD3Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherD3Markup).toContain('"path":"/other-d/123/456"');
		expect(othersOtherD3Markup).toContain('"pathQuery":"/other-d/123/456?a=_a&b=_b&c=_c"');
		expect(othersOtherD3Markup).toContain('"restPath":""');
		expect(othersOtherD3Markup).toContain('"restPathQuery":""');
		expect(othersOtherD3Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherD3Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherD3Markup).toContain('"params":{"x":"123/456"}');
		expect(othersOtherD3Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherE1HTTPState, doctypeHTML: othersOtherE1Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherE1HTTPState.status).toBe(200);
		expect(othersOtherE1Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherE1Markup).toContain('<title>other-e</title>');
		expect(othersOtherE1Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherE1Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherE1Markup).toContain('"path":"/other-e"');
		expect(othersOtherE1Markup).toContain('"pathQuery":"/other-e?a=_a&b=_b&c=_c"');
		expect(othersOtherE1Markup).toContain('"restPath":""');
		expect(othersOtherE1Markup).toContain('"restPathQuery":""');
		expect(othersOtherE1Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherE1Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherE1Markup).toContain('"params":{}');
		expect(othersOtherE1Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherE2HTTPState, doctypeHTML: othersOtherE2Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherE2HTTPState.status).toBe(200);
		expect(othersOtherE2Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherE2Markup).toContain('<title>other-e</title>');
		expect(othersOtherE2Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherE2Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherE2Markup).toContain('"path":"/other-e/123"');
		expect(othersOtherE2Markup).toContain('"pathQuery":"/other-e/123?a=_a&b=_b&c=_c"');
		expect(othersOtherE2Markup).toContain('"restPath":""');
		expect(othersOtherE2Markup).toContain('"restPathQuery":""');
		expect(othersOtherE2Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherE2Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherE2Markup).toContain('"params":{"x":"123"}');
		expect(othersOtherE2Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherE3HTTPState, doctypeHTML: othersOtherE3Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e/123/456?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherE3HTTPState.status).toBe(404);
		expect(othersOtherE3Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherE3Markup).toContain('<title>other-404</title>');
		expect(othersOtherE3Markup).toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(othersOtherE3Markup).toContain('<script type="module" src="/script.js"></script>');
		expect(othersOtherE3Markup).toContain('"path":"/other-e/123/456"');
		expect(othersOtherE3Markup).toContain('"pathQuery":"/other-e/123/456?a=_a&b=_b&c=_c"');
		expect(othersOtherE3Markup).toContain('"restPath":""');
		expect(othersOtherE3Markup).toContain('"restPathQuery":""');
		expect(othersOtherE3Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherE3Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherE3Markup).toContain('"params":{}');
		expect(othersOtherE3Markup).toContain('</html>');

		// ---

		const { httpState: othersOtherE4HTTPState, doctypeHTML: othersOtherE4Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['foo.css'], file: 'foo.js' } },
			App, // Defined above.
		});
		expect(othersOtherE4HTTPState.status).toBe(200);
		expect(othersOtherE4Markup).toContain('<!DOCTYPE html>');
		expect(othersOtherE4Markup).toContain('<title>other-e</title>');
		expect(othersOtherE4Markup).toContain('<link rel="stylesheet" href="/foo.css" media="all"/>');
		expect(othersOtherE4Markup).toContain('<script type="module" src="/foo.js"></script>');
		expect(othersOtherE4Markup).toContain('"path":"/other-e/123"');
		expect(othersOtherE4Markup).toContain('"pathQuery":"/other-e/123?a=_a&b=_b&c=_c"');
		expect(othersOtherE4Markup).toContain('"restPath":""');
		expect(othersOtherE4Markup).toContain('"restPathQuery":""');
		expect(othersOtherE4Markup).toContain('"query":"?a=_a&b=_b&c=_c"');
		expect(othersOtherE4Markup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
		expect(othersOtherE4Markup).toContain('"params":{"x":"123"}');
		expect(othersOtherE4Markup).toContain('</html>');

		// ---

		const { httpState: _404HTTPState, doctypeHTML: _404Markup } = await $preactꓺapisꓺisoꓺprerenderSPA({
			request: new Request(new URL('http://x.tld/nonexistent?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(_404HTTPState.status).toBe(404);
		expect(_404Markup).toContain('<!DOCTYPE html>');
		expect(_404Markup).toContain('<title>404 Error: Not Found</title>');
		expect(_404Markup).not.toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(_404Markup).not.toContain('<script type="module" src="/script.js"></script>');
		expect(_404Markup).toContain('</html>');

		// ---

		await expect(async () => {
			await $preactꓺapisꓺisoꓺprerenderSPA({
				request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
				appManifest: { 'index.html': { css: [], file: 'script.js' } },
				App, // Defined above.
			});
		}).rejects.toThrowError('Missing `appManifest[index.html].css[0]`.');

		// ---

		await expect(async () => {
			await $preactꓺapisꓺisoꓺprerenderSPA({
				request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
				appManifest: { 'index.html': { css: ['style.css'], file: '' } },
				App, // Defined above.
			});
		}).rejects.toThrowError('Missing `appManifest[index.html].file`.');
	});
});
