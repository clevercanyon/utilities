/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $url } from '../../index.ts';

describe('$url', async () => {
    test('.rootHost()', async () => {
        expect($url.rootHost('abc.tld')).toBe('abc.tld');
        expect($url.rootHost('abc.Xyz.tld')).toBe('xyz.tld');

        expect($url.rootHost('Abc.xyz.tld:3000')).toBe('xyz.tld:3000');
        expect($url.rootHost('abc.Xyz.tld:3000', { withPort: false })).toBe('xyz.tld');

        expect($url.rootHost(new URL('https://abc.xyz.tld:3000'))).toBe('xyz.tld:3000');
        expect($url.rootHost(new URL('https://abc.xyz.tld:3000'), { withPort: false })).toBe('xyz.tld');

        expect($url.rootHost('abc.xyz.mac')).toBe('xyz.mac');
        expect($url.rootHost('abc.xyz.loc')).toBe('xyz.loc');
        expect($url.rootHost('abc.xyz.local')).toBe('local');
        expect($url.rootHost('abc.xyz.localhost')).toBe('localhost');

        expect($url.rootHost('Localhost')).toBe('localhost');
        expect($url.rootHost('Localhost:3000')).toBe('localhost:3000');
        expect($url.rootHost('Localhost:3000', { withPort: false })).toBe('localhost');

        expect($url.rootHost(new URL('https://Localhost'))).toBe('localhost');
        expect($url.rootHost(new URL('https://Localhost:3000'))).toBe('localhost:3000');
        expect($url.rootHost(new URL('https://Localhost:3000'), { withPort: false })).toBe('localhost');
    });
    test('.parse()', async () => {
        expect(() => $url.parse('::invalid::')).toThrow();
        expect($url.parse(new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('https://abc.tld/path/xyz.ext').toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('//abc.tld/path/xyz.ext').toString()).toBe('https://abc.tld/path/xyz.ext');
    });
    test('.tryParse()', async () => {
        expect($url.tryParse('::invalid::')).toBe(undefined);
        expect(($url.tryParse(new URL('https://abc.tld/path/xyz.ext')) as URL).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect(($url.tryParse('https://abc.tld/path/xyz.ext') as URL).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect(($url.tryParse('//abc.tld/path/xyz.ext') as URL).toString()).toBe('https://abc.tld/path/xyz.ext');
    });
    test('.getQueryVar()', async () => {
        expect($url.getQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc')).toBe('');
        expect($url.getQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toBe('a.b.c');
    });
    test('.getQueryVars()', async () => {
        expect($url.getQueryVars('abc', 'https://abc.tld/path/xyz.ext?abc')).toStrictEqual({ abc: '' });
        expect($url.getQueryVars('abc', 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toStrictEqual({ abc: 'a.b.c' });
    });
    test('.addQueryVar()', async () => {
        expect($url.addQueryVar('abc', '', 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVar('abc', 'a.b.c', 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');

        expect($url.addQueryVar('abc', '', new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVar('abc', 'a.b.c', new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');
    });
    test('.addQueryVars()', async () => {
        expect($url.addQueryVars({ abc: '' }, 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVars({ abc: 'a.b.c' }, 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');

        expect($url.addQueryVars({ abc: '' }, new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVars({ abc: 'a.b.c' }, new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');
    });
    test('.removeQueryVar()', async () => {
        expect($url.removeQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc=')).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toBe('https://abc.tld/path/xyz.ext');

        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=a.b.c')).toString()).toBe('https://abc.tld/path/xyz.ext');
    });
    test('.removeQueryVars()', async () => {
        expect($url.removeQueryVars(['abc'], 'https://abc.tld/path/xyz.ext?abc=')).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVars(['abc'], 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toBe('https://abc.tld/path/xyz.ext');

        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=a.b.c')).toString()).toBe('https://abc.tld/path/xyz.ext');
    });
    test('.removeCSOQueryVars()', async () => {
        expect($url.removeCSOQueryVars('https://abc.tld/path/xyz.ext?utm_abc=&utm_xyz=')).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeCSOQueryVars('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z')).toBe('https://abc.tld/path/xyz.ext');

        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=&utm_xyz=')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z')).toString()).toBe('https://abc.tld/path/xyz.ext');
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
