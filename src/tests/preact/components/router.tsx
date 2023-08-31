/**
 * Test suite.
 */

import { $env } from '../../../index.js';
import * as $preactꓺssr from '../../../preact/apis/ssr.js';
import { default as _404 } from '../../../preact/routes/404.js';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { default as Router, Route } from '../../../preact/components/router.js';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('<Router>', async () => {
	beforeAll(async () => {
		$env.set('@top', 'APP_BASE_URL', 'http://x.tld');
	});
	afterAll(async () => {
		$env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
	});
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
