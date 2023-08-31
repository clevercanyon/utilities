/**
 * Test suite.
 */

import { describe, test, expect } from 'vitest';
import * as $preactꓺapisꓺssr from '../../../../preact/apis/ssr.js';

describe('$preactꓺapisꓺssr', async () => {
	test('.renderToString()', async () => {
		expect($preactꓺapisꓺssr.renderToString(<html lang='en'></html>)).toBe('<html lang="en"></html>');
	});
});
