/**
 * Test suite.
 */

import { $preact } from '../../../index.js';
import { describe, test, expect } from 'vitest';
import { json as $toꓺjson } from '../../../to.js';
import { set as $envꓺset } from '../../../env.js';
import * as $preactꓺiso from '../../../preact/apis/iso.js';

import HTML from '../../../preact/components/html.js';
import Head from '../../../preact/components/head.js';
import Body from '../../../preact/components/body.js';

import { default as Router, RouterProps, Route, lazy } from '../../../preact/components/router.js';
import type { RouteContextAsProps } from '../../../preact/components/router.js';

/*
- Test ISO more extensively.
	- Test nested fetch calls.
	- Test throwing of promises.
	- Test nested routes.
	- Test multiple routes and path matching.
	- Test robustness of error validation; i.e., try to break.
	- Test a case where the manifest is faulty.
	- Test for script output for client-side rendering.
	- Test client-side hydration.
	- Test route props.
	*/
describe('$preactꓺiso tests', async () => {
	$envꓺset('@top', 'APP_BASE_URL', 'http://x.tld');

	const Index = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={'index'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $toꓺjson(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const Blog = (props: RouteContextAsProps): $preact.VNode<RouteContextAsProps> => {
		return (
			<HTML>
				<Head title={/^\/blog\/post\//u.test(props.path || '') ? 'blog post' : 'blog'} />
				<Body>
					<script type='route-context-props' dangerouslySetInnerHTML={{ __html: $toꓺjson(props) }}></script>
				</Body>
			</HTML>
		);
	};
	const _404 = lazy(() => import('../../../preact/components/404.js'));

	const App = (props: RouterProps): $preact.VNode<RouterProps> => {
		return (
			<Router {...props}>
				<Route path='/' component={Index} />
				<Route path='/blog' component={Blog} />
				<Route path='/blog/post/:id' component={Blog} />
				<Route default component={_404} />
			</Router>
		);
	};
	test('$preactꓺiso.prerenderSPA()', async () => {
		const indexMarkup = await $preactꓺiso.prerenderSPA({
			request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(indexMarkup).toContain('<!DOCTYPE html>');
		expect(indexMarkup).toContain('<title>index</title>');
		expect(indexMarkup).toContain('</html>');

		const blogMarkup = await $preactꓺiso.prerenderSPA({
			request: new Request(new URL('http://x.tld/blog?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(blogMarkup).toContain('<!DOCTYPE html>');
		expect(blogMarkup).toContain('<title>blog</title>');
		expect(blogMarkup).toContain('</html>');

		const blogPostMarkup = await $preactꓺiso.prerenderSPA({
			request: new Request(new URL('http://x.tld/blog/post/123?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(blogPostMarkup).toContain('<!DOCTYPE html>');
		expect(blogPostMarkup).toContain('<title>blog post</title>');
		expect(blogPostMarkup).toContain('</html>');

		const _404Markup = await $preactꓺiso.prerenderSPA({
			request: new Request(new URL('http://x.tld/nonexistent?a=_a&b=_b&c=_c')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App, // Defined above.
		});
		expect(_404Markup).toContain('<!DOCTYPE html>');
		expect(_404Markup).toContain('<title>404 Error: Not Found</title>');
		expect(_404Markup).toContain('</html>');
	});
});
