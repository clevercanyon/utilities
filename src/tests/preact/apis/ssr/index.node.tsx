/**
 * Test suite.
 */

import { describe, test, expect } from 'vitest';
import * as $preactꓺssr from '../../../../preact/apis/ssr.js';

describe('$preactꓺssr', async () => {
	test('.renderToString()', async () => {
		expect($preactꓺssr.renderToString(<html lang='en'></html>)).toContain('</html>');
	});
});
