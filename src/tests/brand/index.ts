/**
 * Test suite.
 */

import { $app, $is, $obj, $brand } from '../../index.js';
import { describe, test, expect } from 'vitest';

describe('$brand', async () => {
	test('.get()', async () => {
		const brand = $brand.get('&');

		expect($obj.tag(brand)).toBe($app.pkgName + '/Brand');
		expect(brand.org).toBe(brand); // Circular.
		expect($is.string(brand.n7m)).toBe(true);
	});
});
