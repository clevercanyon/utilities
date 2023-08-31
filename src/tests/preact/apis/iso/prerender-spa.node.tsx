/**
 * Test suite.
 */

import HTML from '../../../../preact/components/html.js';
import Head from '../../../../preact/components/head.js';
import Body from '../../../../preact/components/body.js';
import { $env, $to, $preact } from '../../../../index.js';
import { prerenderSPA } from '../../../../preact/apis/iso.js';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { useHTTPStatus } from '../../../../preact/components/data.js';
import type { RouterProps, RouteContextAsProps } from '../../../../preact/components/router.js';
import { default as Router, Route, useRoute, lazyRoute } from '../../../../preact/components/router.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('$preactꓺiso.prerenderSPA()', async () => {
	beforeAll(async () => {
		$env.set('@top', 'APP_BASE_URL', 'http://x.tld');
	});
	afterAll(async () => {
		$env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
	});
	const App = (props: RouterProps): $preact.VNode<RouterProps> => {
		return (
			<Router {...props}>
				<Route path='/' component={Index} />
				<Route path='/blog' component={Blog} />
				<Route path='/blog/post/:id' component={Blog} />
				<Route path='/others/*' component={Others} />
				<Route default component={_404} />
			</Router>
		);
	};
	const Index = (unusedꓺprops: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={'index'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(useRoute()) }}></script>
				</Body>
			</HTML>
		);
	};
	const Blog = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={/^\/blog\/post\//u.test(props.path || '') ? 'blog post' : 'blog'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(useRoute()) }}></script>
				</Body>
			</HTML>
		);
	};
	const Others = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<Router {...props}>
				<Route path='/other-a/:x' component={OtherA} />
				<Route path='/other-b/*' component={OtherB} />
				<Route path='/other-c/:x*' component={OtherC} />
				<Route path='/other-d/:x+' component={OtherD} />
				<Route path='/other-e/:x?' component={OtherE} />
				<Route path='/other-a/*' component={OtherA} />
				<Route default component={Other404} />
			</Router>
		);
	};
	const OtherA = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={'other-a'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const OtherB = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={'other-b'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const OtherC = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={'other-c'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const OtherD = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={'other-d'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const OtherE = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={'other-e'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const Other404 = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		const { updateState: updateHTTPStatus } = useHTTPStatus();
		updateHTTPStatus(404); // Record status being a 404 error.

		return (
			<HTML>
				<Head title={'other-404'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $to.json(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const _404 = lazyRoute(() => import('../../../../preact/routes/404.js'));

	// ---

	test('basics', async () => {
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

		// ---

		const { httpStatus: blogHTTPStatus, doctypeHTML: blogMarkup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/blog?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(blogHTTPStatus).toBe(200);
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

		const { httpStatus: blogPostHTTPStatus, doctypeHTML: blogPostMarkup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/blog/post/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(blogPostHTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherA1HTTPStatus, doctypeHTML: othersOtherA1Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-a/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherA1HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherA2HTTPStatus, doctypeHTML: othersOtherA2Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-a/123/another?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherA2HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherB1HTTPStatus, doctypeHTML: othersOtherB1Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-b?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherB1HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherB2HTTPStatus, doctypeHTML: othersOtherB2Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-b/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherB2HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherC1HTTPStatus, doctypeHTML: othersOtherC1Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-c?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherC1HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherC2HTTPStatus, doctypeHTML: othersOtherC2Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-c/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherC2HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherC3HTTPStatus, doctypeHTML: othersOtherC3Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-c/123/456/789?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherC3HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherD1HTTPStatus, doctypeHTML: othersOtherD1Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-d?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherD1HTTPStatus).toBe(404);
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

		const { httpStatus: othersOtherD2HTTPStatus, doctypeHTML: othersOtherD2Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-d/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherD2HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherD3HTTPStatus, doctypeHTML: othersOtherD3Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-d/123/456?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherD3HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherE1HTTPStatus, doctypeHTML: othersOtherE1Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherE1HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherE2HTTPStatus, doctypeHTML: othersOtherE2Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherE2HTTPStatus).toBe(200);
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

		const { httpStatus: othersOtherE3HTTPStatus, doctypeHTML: othersOtherE3Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e/123/456?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(othersOtherE3HTTPStatus).toBe(404);
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

		const { httpStatus: othersOtherE4HTTPStatus, doctypeHTML: othersOtherE4Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/others/other-e/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['foo.css'], file: 'foo.js' } },
			App, // Defined above.
		});
		expect(othersOtherE4HTTPStatus).toBe(200);
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

		const { httpStatus: _404HTTPStatus, doctypeHTML: _404Markup } = await prerenderSPA({
			request: new Request(new URL('http://x.tld/nonexistent?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(_404HTTPStatus).toBe(404);
		expect(_404Markup).toContain('<!DOCTYPE html>');
		expect(_404Markup).toContain('<title>404 Error: Not Found</title>');
		expect(_404Markup).not.toContain('<link rel="stylesheet" href="/style.css" media="all"/>');
		expect(_404Markup).not.toContain('<script type="module" src="/script.js"></script>');
		expect(_404Markup).toContain('</html>');

		// ---

		await expect(async () => {
			await prerenderSPA({
				request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
				appManifest: { 'index.html': { css: [], file: 'script.js' } },
				App, // Defined above.
			});
		}).rejects.toThrowError('Missing `appManifest[index.html].css[0]`.');

		// ---

		await expect(async () => {
			await prerenderSPA({
				request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
				appManifest: { 'index.html': { css: ['style.css'], file: '' } },
				App, // Defined above.
			});
		}).rejects.toThrowError('Missing `appManifest[index.html].file`.');
	});
});
