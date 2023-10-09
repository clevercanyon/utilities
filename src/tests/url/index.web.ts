/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $url } from '../../index.ts';

describe('$url', async () => {
    test('.current()', async () => {
        expect($url.current()).toBe('http://localhost:3000/');
    });
    test('.currentReferrer()', async () => {
        expect($url.currentReferrer()).toBe('');
    });
    test('.currentScheme()', async () => {
        expect($url.currentScheme()).toBe('http');
    });
    test('.currentHost()', async () => {
        expect($url.currentHost()).toBe('localhost:3000');
        expect($url.currentHost({ withPort: false })).toBe('localhost');
    });
    test('.currentRootHost()', async () => {
        expect($url.currentRootHost()).toBe('localhost:3000');
        expect($url.currentRootHost({ withPort: false })).toBe('localhost');
    });
    test('.currentPort()', async () => {
        expect($url.currentPort()).toBe('3000');
    });
    test('.currentPath()', async () => {
        expect($url.currentPath()).toBe('/');
    });
    test('.currentSubpath()', async () => {
        expect($url.currentSubpath()).toBe('');
    });
    test('.currentQuery()', async () => {
        expect($url.currentQuery()).toBe('');
    });
    test('.currentPathQuery()', async () => {
        expect($url.currentPathQuery()).toBe('/');
    });
    test('.currentPathQuery()', async () => {
        expect($url.currentPathQuery()).toBe('/');
    });
    test('.currentBase()', async () => {
        expect($url.currentBase()).toBe('http://localhost:3000/');
    });
    test('.currentBasePath()', async () => {
        expect($url.currentBasePath()).toBe('/');
    });
    test('.fromCurrentBase()', async () => {
        expect($url.fromCurrentBase('path')).toBe('http://localhost:3000/path');
        expect($url.fromCurrentBase('path/')).toBe('http://localhost:3000/path/');

        expect($url.fromCurrentBase('./path')).toBe('http://localhost:3000/path');
        expect($url.fromCurrentBase('./path/')).toBe('http://localhost:3000/path/');

        expect($url.fromCurrentBase('http://localhost:3000/path')).toBe('http://localhost:3000/path');
        expect($url.fromCurrentBase('http://localhost:3000/path/')).toBe('http://localhost:3000/path/');

        expect($url.fromCurrentBase(new URL('http://localhost:3000/path'))).toBe('http://localhost:3000/path');
        expect($url.fromCurrentBase(new URL('http://localhost:3000/path/'))).toBe('http://localhost:3000/path/');
    });
    test('.pathFromCurrentBase()', async () => {
        expect($url.pathFromCurrentBase('path')).toBe('/path');
        expect($url.pathFromCurrentBase('path/')).toBe('/path/');

        expect($url.pathFromCurrentBase('./path')).toBe('/path');
        expect($url.pathFromCurrentBase('./path/')).toBe('/path/');

        expect($url.pathFromCurrentBase('http://localhost:3000/path')).toBe('/path');
        expect($url.pathFromCurrentBase('http://localhost:3000/path/')).toBe('/path/');

        expect($url.pathFromCurrentBase(new URL('http://localhost:3000/path'))).toBe('/path');
        expect($url.pathFromCurrentBase(new URL('http://localhost:3000/path/'))).toBe('/path/');
    });
    test('.addCurrentBasePath()', async () => {
        expect($url.addCurrentBasePath('path')).toBe('/path');
        expect($url.addCurrentBasePath('path/')).toBe('/path/');

        expect($url.addCurrentBasePath('./path')).toBe('/path');
        expect($url.addCurrentBasePath('./path/')).toBe('/path/');

        expect($url.addCurrentBasePath('http://localhost:3000/path')).toBe('http://localhost:3000/path');
        expect($url.addCurrentBasePath('http://localhost:3000/path/')).toBe('http://localhost:3000/path/');

        expect($url.addCurrentBasePath(new URL('http://localhost:3000/path')) instanceof URL).toBe(true);
        expect($url.addCurrentBasePath(new URL('http://localhost:3000/path/')) instanceof URL).toBe(true);

        expect($url.addCurrentBasePath(new URL('http://localhost:3000/path')).toString()).toBe('http://localhost:3000/path');
        expect($url.addCurrentBasePath(new URL('http://localhost:3000/path/')).toString()).toBe('http://localhost:3000/path/');
    });
    test('.removeCurrentBasePath()', async () => {
        expect($url.removeCurrentBasePath('path')).toBe('./path');
        expect($url.removeCurrentBasePath('path/')).toBe('./path/');

        expect($url.removeCurrentBasePath('./path')).toBe('./path');
        expect($url.removeCurrentBasePath('./path/')).toBe('./path/');

        expect($url.removeCurrentBasePath('http://localhost:3000/path')).toBe('http://localhost:3000/path');
        expect($url.removeCurrentBasePath('http://localhost:3000/path/')).toBe('http://localhost:3000/path/');

        expect($url.removeCurrentBasePath(new URL('http://localhost:3000/path')) instanceof URL).toBe(true);
        expect($url.removeCurrentBasePath(new URL('http://localhost:3000/path/')) instanceof URL).toBe(true);

        expect($url.removeCurrentBasePath(new URL('http://localhost:3000/path')).toString()).toBe('http://localhost:3000/path');
        expect($url.removeCurrentBasePath(new URL('http://localhost:3000/path/')).toString()).toBe('http://localhost:3000/path/');
    });
    test('.parse()', async () => {
        expect($url.parse() instanceof URL).toBe(true);
        expect(() => $url.parse('::invalid::')).toThrow();

        expect($url.parse().toString()).toBe('http://localhost:3000/');
        expect($url.parse(new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('https://abc.tld/path/xyz.ext').toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('//abc.tld/path/xyz.ext').toString()).toBe('http://abc.tld/path/xyz.ext');
    });
    test('.tryParse()', async () => {
        expect($url.tryParse() instanceof URL).toBe(true);
        expect($url.tryParse('::invalid::')).toBe(undefined);

        expect($url.tryParse()?.toString()).toBe('http://localhost:3000/');
        expect($url.tryParse(new URL('https://abc.tld/path/xyz.ext'))?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.tryParse('https://abc.tld/path/xyz.ext')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.tryParse('//abc.tld/path/xyz.ext')?.toString()).toBe('http://abc.tld/path/xyz.ext');
    });
    test('.getQueryVar()', async () => {
        expect($url.getQueryVar('abc')).toBe(undefined);
    });
    test('.getQueryVars()', async () => {
        expect($url.getQueryVars(['abc'])).toStrictEqual({});
    });
    test('.addQueryVar()', async () => {
        expect($url.addQueryVar('abc', 'a.b.c')).toBe('http://localhost:3000/?abc=a.b.c');
    });
    test('.addQueryVars()', async () => {
        expect($url.addQueryVars({ abc: 'a.b.c' })).toBe('http://localhost:3000/?abc=a.b.c');
    });
    test('.removeQueryVar()', async () => {
        expect($url.removeQueryVar('abc')).toBe('http://localhost:3000/');
    });
    test('.removeQueryVars()', async () => {
        expect($url.removeQueryVars(['abc'])).toBe('http://localhost:3000/');
    });
    test('.removeCSOQueryVars()', async () => {
        expect($url.removeCSOQueryVars()).toBe('http://localhost:3000/');
    });
    test('.encode()', async () => {
        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ')) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.queryRFC3986)) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.queryRFC3986AWS4)) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.queryRFC1738)) //
			.toBe('abcdefghijklmnopqrstuvwxyz+%F0%9F%A6%8A+%EA%93%BA+0123456789+%21%22%27%28%29%2A%7E+%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore
    });
    test('.decode()', async () => {
        expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93')) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

        expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.queryRFC3986)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

        expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.queryRFC3986AWS4)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

        expect($url.decode('abcdefghijklmnopqrstuvwxyz+%F0%9F%A6%8A+%EA%93%BA+0123456789+%21%22%27%28%29%2A%7E+%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.queryRFC1738)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore
    });
});
