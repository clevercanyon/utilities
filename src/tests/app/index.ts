/**
 * Test suite.
 */

import { $is, $app } from '../../index.js';
import { describe, test, expect } from 'vitest';

describe('$app', async () => {
	test('.pkgName', async () => {
		expect($is.string($app.pkgName)).toBe(true);
	});
});
