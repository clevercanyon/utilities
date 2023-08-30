/**
 * Test suite.
 */

import { describe, test, expect } from 'vitest';
import { $app, $is, $obj, $brand } from '../../index.js';

describe('$brand', async () => {
	test('.get()', async () => {
		const brand = $brand.get('&');

		expect($obj.tag(brand)).toBe($app.pkgName + '/Brand');
		expect(brand.org).toBe(brand); // Circular.
		expect($is.string(brand.n7m)).toBe(true);
	});
});
