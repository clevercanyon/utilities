/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $app, $is } from '../../index.ts';

describe('$app', async () => {
	test('.pkgName', async () => {
		expect($is.string($app.pkgName)).toBe(true);
	});
});
