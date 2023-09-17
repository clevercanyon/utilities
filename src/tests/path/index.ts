/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $path } from '../../index.ts';

describe('$path', async () => {
	test('.ext()', async () => {
		expect($path.ext('path/file.a')).toBe('a');
		expect($path.ext('path/file.abc')).toBe('abc');
		expect($path.ext('path/file.xyz?query#hash')).toBe('xyz');
		expect($path.ext('path/.foo')).toBe('foo');
		expect($path.ext('path/file')).toBe('');
		expect($path.ext('.file')).toBe('file');
		expect($path.ext('file')).toBe('');
	});
	test('.hasExt()', async () => {
		expect($path.hasExt('path/file.a')).toBe(true);
		expect($path.hasExt('path/file.abc')).toBe(true);
		expect($path.hasExt('path/file.xyz?query#hash')).toBe(true);
		expect($path.hasExt('path/file')).toBe(false);
	});
	test('.hasStaticExt()', async () => {
		expect($path.hasStaticExt('path/file.js')).toBe(true);
		expect($path.hasStaticExt('path/file.js?query#hash')).toBe(true);
		expect($path.hasStaticExt('path/file.png')).toBe(true);
		expect($path.hasStaticExt('path/file.a')).toBe(false);
		expect($path.hasStaticExt('path/file.abc')).toBe(false);
		expect($path.hasStaticExt('path/file')).toBe(false);
	});
	test('.globToRegExpString()', async () => {
		expect($path.globToRegExpString('**/abc/**')).toBe('^(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)abc(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)|$))$');
		expect($path.globToRegExpString('**/abc/**/*')).toBe(
			'^(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)abc(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\/?)$',
		);
		expect($path.globToRegExpString('**/abc/**/*')).toBe(
			'^(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)abc(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\/?)$',
		);
		expect($path.globToRegExpString('**/abc/**/*')).toBe(
			'^(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/)abc(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\/?)$',
		);
		expect($path.globToRegExpString('**/abc/**/*', { dot: true })).toBe(
			'^(?:(?:^|\\/|(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/)abc(?:\\/(?!\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/|\\/|$)(?!\\.{1,2}(?:\\/|$))(?=.)[^/]*?\\/?)$',
		);
	});
	test('.newGitIgnore()', async () => {
		const gitIgnore1 = $path.newGitIgnore();
		expect(gitIgnore1.ignores('path/.git')).toBe(true);
		expect(() => gitIgnore1.ignores('/path/.git')).toThrowError(); // Not a relative path.

		const gitIgnore2 = $path.newGitIgnore({ useDefaultGitIgnores: false });
		expect(gitIgnore2.ignores('path/.git')).toBe(false);
		expect(() => gitIgnore2.ignores('/path/.git')).toThrowError(); // Not a relative path.
	});
	test('.gitIgnoreToGlob()', async () => {
		expect($path.gitIgnoreToGlob('.foo*')).toBe('**/.foo*/**');
		expect($path.gitIgnoreToGlob('!.foo.bar')).toBe('!**/.foo.bar/**');
		expect($path.gitIgnoreToGlob('.foo/bar')).toBe('.foo/bar/**');
		expect($path.gitIgnoreToGlob('.foo/bar/')).toBe('.foo/bar/**');
		expect($path.gitIgnoreToGlob('!.foo/bar/')).toBe('!.foo/bar/**');
		expect($path.gitIgnoreToGlob('/.foo/bar')).toBe('/.foo/bar/**');
		expect($path.gitIgnoreToGlob('/.foo/bar/')).toBe('/.foo/bar/**');
		expect($path.gitIgnoreToGlob('!/.foo/bar/')).toBe('!/.foo/bar/**');
		expect($path.gitIgnoreToGlob('!/.foo/bar//')).toBe('!/.foo/bar/**');
	});
});
