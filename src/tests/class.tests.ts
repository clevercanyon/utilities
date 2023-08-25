/**
 * Test suite.
 */

import { $app, $class, $obj } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$class tests', async () => {
	test('$class.getBase()', async () => {
		const Base = $class.getBase();
		const base = new Base();

		expect($obj.tag(Base)).toBe('Function');
		expect($obj.tag(base)).toBe($app.pkgName + '/Base');
	});
});
