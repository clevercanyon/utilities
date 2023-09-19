/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $is, $path } from '../../index.ts';

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
	test('.vscodeLangExts()', async () => {
		expect($path.vscodeLangExts('javascript')).toStrictEqual(['cjs', 'js', 'mjs']);
		expect($path.vscodeLangExts('javascriptreact')).toStrictEqual(['cjsx', 'jsx', 'mjsx']);

		expect($path.vscodeLangExts('typescript')).toStrictEqual(['cts', 'mts', 'ts']);
		expect($path.vscodeLangExts('typescriptreact')).toStrictEqual(['ctsx', 'mtsx', 'tsx']);

		expect($path.vscodeLangExts('php')).toStrictEqual(['php', 'phps', 'phtm', 'phtml']);
		expect($path.vscodeLangExts('shellscript')).toStrictEqual(['bash', 'sh', 'zsh']);
	});
	test('.extsByVSCodeLang()', async () => {
		expect($is.plainObject($path.extsByVSCodeLang())).toBe(true);
	});
	test('.defaultGitIgnoresByGroup', async () => {
		expect($is.plainObject($path.defaultGitIgnoresByGroup)).toBe(true);
	});
	test('.defaultGitIgnores', async () => {
		expect($is.array($path.defaultGitIgnores)).toBe(true);
		expect($path.defaultGitIgnores.includes('.git')).toBe(true);
		expect($path.defaultGitIgnores.includes('.*')).toBe(false);
	});
	test('.defaultNPMIgnoresByGroup', async () => {
		expect($is.plainObject($path.defaultNPMIgnoresByGroup)).toBe(true);
	});
	test('.defaultNPMIgnores', async () => {
		expect($is.array($path.defaultNPMIgnores)).toBe(true);
		expect($path.defaultNPMIgnores.includes('.*')).toBe(true);
	});
});
