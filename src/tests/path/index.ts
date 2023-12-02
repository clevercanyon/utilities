/**
 * Test suite.
 */

import { $is, $path } from '#index.ts';
import { describe, expect, test } from 'vitest';

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
    test('.removeExt()', async () => {
        expect($path.removeExt('path/file.js')).toBe('path/file');
        expect($path.removeExt('path/file.js?query#hash')).toBe('path/file');
        expect($path.removeExt('path/file.png')).toBe('path/file');
        expect($path.removeExt('path/file.a')).toBe('path/file');
        expect($path.removeExt('path/file.abc')).toBe('path/file');
        expect($path.removeExt('path/file')).toBe('path/file');
    });
    test('.basename()', async () => {
        expect($path.basename('path/file.js')).toBe('file.js');
        expect($path.basename('path/file.js?query#hash')).toBe('file.js');
        expect($path.basename('path/file.png')).toBe('file.png');
        expect($path.basename('path/file.a')).toBe('file.a');
        expect($path.basename('path/file.abc')).toBe('file.abc');
        expect($path.basename('path/file')).toBe('file');
    });
    test('.rawBasename()', async () => {
        expect($path.rawBasename('path/file.js')).toBe('file');
        expect($path.rawBasename('path/file.js?query#hash')).toBe('file');
        expect($path.rawBasename('path/file.png')).toBe('file');
        expect($path.rawBasename('path/file.a')).toBe('file');
        expect($path.rawBasename('path/file.abc')).toBe('file');
        expect($path.rawBasename('path/file')).toBe('file');

        expect($path.rawBasename('path/file.x.js')).toBe('file.x');
        expect($path.rawBasename('path/file.x.js?query#hash')).toBe('file.x');
        expect($path.rawBasename('path/file.x.png')).toBe('file.x');
        expect($path.rawBasename('path/file.x.a')).toBe('file.x');
        expect($path.rawBasename('path/file.x.abc')).toBe('file.x');
        expect($path.rawBasename('path/file.x')).toBe('file');
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
        expect($path.globToRegExpString($path.dotGlobstarHead() + $path.dotGlobstarSingle() + '.{abc,xyz}' + $path.dotGlobstarTail())).toBe(
            '^(?:(|(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|(?:\\.|[^./]|\\x2F)*\\/)([^/]*?|(?:[^/]*?|\\.)*)\\.(abc|xyz)(|(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?|\\/(?:\\.)?(?:\\.|[^./]|\\x2F)*))$',
        );
        expect($path.globToRegExpString($path.dotGlobstarHead() + $path.dotGlobstarSingle() + '.{abc,xyz}' + $path.dotGlobstarTail(), { dot: true })).toBe(
            '^(?:(|(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/|(?:\\.|[^./]|\\x2F)*\\/)([^/]*?|(?:[^/]*?|\\.)*)\\.(abc|xyz)(|(?:\\/(?!\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/|\\/|$)(?!\\.{1,2}(?:\\/|$))(?=.)[^/]*?|\\/(?:\\.)?(?:\\.|[^./]|\\x2F)*))$',
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

        expect($path.gitIgnoreToGlob('.foo*', { useDotGlobstars: true })).toBe('{,**/,*(.|[^.]|\\x2F)/}.foo{*,*(*|.)}{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('!.foo.bar', { useDotGlobstars: true })).toBe('!{,**/,*(.|[^.]|\\x2F)/}.foo.bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('.foo/bar', { useDotGlobstars: true })).toBe('.foo/bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('.foo/bar/', { useDotGlobstars: true })).toBe('.foo/bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('!.foo/bar/', { useDotGlobstars: true })).toBe('!.foo/bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('/.foo/bar', { useDotGlobstars: true })).toBe('/.foo/bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('/.foo/bar/', { useDotGlobstars: true })).toBe('/.foo/bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('!/.foo/bar/', { useDotGlobstars: true })).toBe('!/.foo/bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');
        expect($path.gitIgnoreToGlob('!/.foo/bar//', { useDotGlobstars: true })).toBe('!/.foo/bar{,/**/*,/?(.)*(.|[^.]|\\x2F)}');

        expect($path.gitIgnoreToGlob('!/.f*oo/**/**/bar/**/baz/**//**/**/**/*****/*', { useDotGlobstars: true })).toBe(
            '!/.f{*,*(*|.)}oo/{,**/,*(.|[^.]|\\x2F)/}bar/{,**/,*(.|[^.]|\\x2F)/}baz/{,**/,*(.|[^.]|\\x2F)/}{,/**/*,/?(.)*(.|[^.]|\\x2F)}{*,*(*|.)}{,**/,*(.|[^.]|\\x2F)/}{*,*(*|.)}{,/**/*,/?(.)*(.|[^.]|\\x2F)}',
        );
        expect($path.gitIgnoreToGlob('!/.f*oo/**/**/bar/**/baz/**//**/**/**/*', { useDotGlobstars: true })).toBe(
            '!/.f{*,*(*|.)}oo/{,**/,*(.|[^.]|\\x2F)/}bar/{,**/,*(.|[^.]|\\x2F)/}baz/{,**/,*(.|[^.]|\\x2F)/}/{,**/,*(.|[^.]|\\x2F)/}{*,*(*|.)}{,/**/*,/?(.)*(.|[^.]|\\x2F)}',
        );
        expect($path.gitIgnoreToGlob('**/.f*oo/**/**/bar/**/baz/**/**', { useDotGlobstars: true })).toBe(
            '{,**/,*(.|[^.]|\\x2F)/}.f{*,*(*|.)}oo/{,**/,*(.|[^.]|\\x2F)/}bar/{,**/,*(.|[^.]|\\x2F)/}baz{,/**/*,/?(.)*(.|[^.]|\\x2F)}{,/**/*,/?(.)*(.|[^.]|\\x2F)}',
        );
    });
    test('.canonicalExtVariants()', async () => {
        expect($path.canonicalExtVariants('js')).toStrictEqual(['js', 'mjs', 'cjs']);
        expect($path.canonicalExtVariants('jsx')).toStrictEqual(['jsx', 'mjsx', 'cjsx']);

        expect($path.canonicalExtVariants('ts')).toStrictEqual(['ts', 'mts', 'cts']);
        expect($path.canonicalExtVariants('tsx')).toStrictEqual(['tsx', 'mtsx', 'ctsx']);

        expect($path.canonicalExtVariants('php')).toStrictEqual(['php', 'phtml', 'phtm']);
        expect($path.canonicalExtVariants('bash')).toStrictEqual(['bash']);
    });
    test('.vscodeLangExts()', async () => {
        expect($path.vsCodeLangExts('javascript')).toStrictEqual(['js', 'mjs', 'cjs']);
        expect($path.vsCodeLangExts('javascriptreact')).toStrictEqual(['jsx', 'mjsx', 'cjsx']);

        expect($path.vsCodeLangExts('typescript')).toStrictEqual(['ts', 'mts', 'cts']);
        expect($path.vsCodeLangExts('typescriptreact')).toStrictEqual(['tsx', 'mtsx', 'ctsx']);

        expect($path.vsCodeLangExts('php')).toStrictEqual(['php', 'phtml', 'phtm', 'phps']);
        expect($path.vsCodeLangExts('shellscript')).toStrictEqual(['bash', 'zsh', 'sh']);
    });
    test('.extsByCanonical()', async () => {
        expect($is.plainObject($path.extsByCanonical())).toBe(true);
    });
    test('.extsByVSCodeLang()', async () => {
        expect($is.plainObject($path.extsByVSCodeLang())).toBe(true);
        expect($is.plainObject($path.extsByVSCodeLang({ camelCase: true }))).toBe(true);
        expect($is.plainObject($path.extsByVSCodeLang({ camelCase: true, enableCodeTextual: true }))).toBe(true);
    });
    test('.defaultGitIgnoresByGroup()', async () => {
        expect($is.plainObject($path.defaultGitIgnoresByGroup())).toBe(true);
    });
    test('.defaultNPMIgnoresByGroup()', async () => {
        expect($is.plainObject($path.defaultNPMIgnoresByGroup())).toBe(true);
    });
    test('.defaultGitNPMIgnoresByCategory()', async () => {
        expect($is.plainObject($path.defaultGitNPMIgnoresByCategory())).toBe(true);
    });
    test('.defaultGitIgnores()', async () => {
        expect($is.array($path.defaultGitIgnores())).toBe(true);
        expect($path.defaultGitIgnores().includes('.git')).toBe(true);
        expect($path.defaultGitIgnores().includes('.*')).toBe(false);
    });
    test('.defaultNPMIgnores()', async () => {
        expect($is.array($path.defaultNPMIgnores())).toBe(true);
        expect($path.defaultNPMIgnores().includes('.*')).toBe(true);
    });
});
