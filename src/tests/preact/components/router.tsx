/**
 * Test suite.
 */

import { $env } from '../../../index.js';
import { describe, test, expect } from 'vitest';
import * as $preactꓺssr from '../../../preact/apis/ssr.js';

import { default as _404 } from '../../../preact/components/404.js';
import { default as Router, Route } from '../../../preact/components/router.js';

describe('<Router>', async () => {
	$env.set('@top', 'APP_BASE_URL', 'http://x.tld');

	test('basics', async () => {
		expect(
			$preactꓺssr.renderToString(
				<Router url='http://x.tld'>
					<Route default component={_404} />
				</Router>,
			),
		).toContain('</html>');
	});
});
