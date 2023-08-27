/**
 * Test suite.
 */

import { describe, test, expect } from 'vitest';
import * as $preactꓺssr from '../../../preact/apis/ssr.js';

describe('$preactꓺssr tests', async () => {
	test('$preactꓺssr.renderToString()', async () => {
		expect($preactꓺssr.renderToString(<html lang='en'></html>)).toContain('</html>');
	});
});
