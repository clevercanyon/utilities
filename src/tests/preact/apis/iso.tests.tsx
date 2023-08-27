/**
 * Test suite.
 */

import { $preact } from '../../../index.js';
import { describe, test, expect } from 'vitest';
import * as $preactꓺiso from '../../../preact/apis/iso.js';
import { default as Router, RouterProps, Route, lazy } from '../../../preact/components/router.js';

describe('$preactꓺiso tests', async () => {
	test('$preactꓺiso.prerenderSPA()', async () => {
		const markup = await $preactꓺiso.prerenderSPA({
			request: new Request('http://x'),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App: (props: RouterProps): $preact.VNode<RouterProps> => {
				return (
					<Router {...props}>
						<Route default component={lazy(() => import('../../../preact/components/404.js'))} />
					</Router>
				);
			},
		});
		console.log(markup);
		expect(markup).toContain('<!DOCTYPE html>');
		expect(markup).toContain('</html>');
	});
});
