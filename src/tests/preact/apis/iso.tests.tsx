/**
 * Test suite.
 */

import { $preact } from '../../../index.js';
import { describe, test, expect } from 'vitest';
import { set as $envꓺset } from '../../../env.js';
import * as $preactꓺiso from '../../../preact/apis/iso.js';
import { default as Router, RouterProps, Route, lazy } from '../../../preact/components/router.js';

describe('$preactꓺiso tests', async () => {
	$envꓺset('@top', 'APP_BASE_URL', 'http://x');

	test('$preactꓺiso.prerenderSPA()', async () => {
		const lazy404 = lazy(() => import('../../../preact/components/404.js'));

		const markup = await $preactꓺiso.prerenderSPA({
			request: new Request(new URL('http://x')),
			appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
			App: (props: RouterProps): $preact.VNode<RouterProps> => {
				console.log(props);
				return (
					<Router {...props}>
						<Route default component={lazy404} />
					</Router>
				);
			},
		});
		expect(markup).toContain('<!DOCTYPE html>');
		expect(markup).toContain('</html>');
	});
});
