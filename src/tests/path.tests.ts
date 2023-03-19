/**
 * Test suite.
 */

import { $path } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$path tests', async () => {
	test('$path.hasExt()', async () => {
		expect($path.hasExt('path/file.a')).toBe(true);
		expect($path.hasExt('path/file.abc')).toBe(true);
		expect($path.hasExt('path/file.xyz')).toBe(true);
		expect($path.hasExt('path/file')).toBe(false);
	});
	test('$path.hasStaticExt()', async () => {
		expect($path.hasStaticExt('path/file.js')).toBe(true);
		expect($path.hasStaticExt('path/file.png')).toBe(true);
		expect($path.hasStaticExt('path/file.a')).toBe(false);
		expect($path.hasStaticExt('path/file.abc')).toBe(false);
		expect($path.hasStaticExt('path/file')).toBe(false);
	});
	test('$path.newGitIgnore()', async () => {
		const gitIgnore1 = $path.newGitIgnore();
		expect(gitIgnore1.ignores('path/.git')).toBe(true);
		expect(() => gitIgnore1.ignores('/path/.git')).toThrowError(); // Not a relative path.

		const gitIgnore2 = $path.newGitIgnore({ useDefaultGitIgnores: false });
		expect(gitIgnore2.ignores('path/.git')).toBe(false);
		expect(() => gitIgnore2.ignores('/path/.git')).toThrowError(); // Not a relative path.
	});
});
