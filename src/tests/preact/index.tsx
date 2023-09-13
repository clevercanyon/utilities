/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $preact } from '../../index.ts';

describe('$preact', async () => {
	test('.classes()', async () => {
		expect($preact.classes('abc', [])).toBe('abc');
		expect($preact.classes('abc', ['def'])).toBe('abc def');
		expect($preact.classes('abc', ['def', 'ghi'])).toBe('abc def ghi');
	});
});
