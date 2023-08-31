/**
 * Test suite.
 */

import { $env } from '../../../index.js';
import * as $preactꓺapisꓺssr from '../../../preact/apis/ssr.js';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { default as $preactꓺroutesꓺ404 } from '../../../preact/routes/404.js';
import { default as $preactꓺcomponentsꓺRouter, Route as $preactꓺcomponentsꓺrouterꓺRoute } from '../../../preact/components/router.js';

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
			$preactꓺapisꓺssr.renderToString(
				<$preactꓺcomponentsꓺRouter url='http://x.tld'>
					<$preactꓺcomponentsꓺrouterꓺRoute default component={$preactꓺroutesꓺ404} />
				</$preactꓺcomponentsꓺRouter>,
			),
		).toContain('</html>');
	});
});
