/**
 * Test suite.
 */

import { $preact } from '../../index.js';
import { describe, test, expect } from 'vitest';

describe('$preact', async () => {
	test('.classes()', async () => {
		expect($preact.classes('abc', [])).toBe('abc');
		expect($preact.classes('abc', ['def'])).toBe('abc def');
		expect($preact.classes('abc', ['def', 'ghi'])).toBe('abc def ghi');
	});
});
