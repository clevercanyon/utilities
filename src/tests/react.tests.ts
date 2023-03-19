/**
 * Test suite.
 */

import { $react } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$react tests', async () => {
	test('$react.classes()', async () => {
		expect($react.classes('abc', { classes: [] })).toBe('abc');
		expect($react.classes('abc', { classes: ['def'] })).toBe('abc def');
		expect($react.classes('abc', { classes: ['def', 'ghi'] })).toBe('abc def ghi');
	});
});
