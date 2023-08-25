/**
 * Test suite.
 */

import { $url } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$url tests', async () => {
	test('$url.current()', async () => {
		expect($url.current()).toBe('http://localhost:3000/');
	});
	test('$url.currentReferrer()', async () => {
		expect($url.currentReferrer()).toBe('');
	});
	test('$url.currentScheme()', async () => {
		expect($url.currentScheme()).toBe('http');
	});
	test('$url.currentHost()', async () => {
		expect($url.currentHost()).toBe('localhost:3000');
		expect($url.currentHost({ withPort: false })).toBe('localhost');
	});
	test('$url.currentRootHost()', async () => {
		expect($url.currentRootHost()).toBe('localhost:3000');
		expect($url.currentRootHost({ withPort: false })).toBe('localhost');
	});
	test('$url.currentPort()', async () => {
		expect($url.currentPort()).toBe('3000');
	});
	test('$url.currentPath()', async () => {
		expect($url.currentPath()).toBe('/');
	});
	test('$url.currentSubpath()', async () => {
		expect($url.currentSubpath()).toBe('');
	});
	test('$url.currentQuery()', async () => {
		expect($url.currentQuery()).toBe('');
	});
	test('$url.currentPathQuery()', async () => {
		expect($url.currentPathQuery()).toBe('/');
	});
	test('$url.currentPathQuery()', async () => {
		expect($url.currentPathQuery()).toBe('/');
	});
	test('$url.parse()', async () => {
		expect(($url.parse() as URL).toString()).toBe('http://localhost:3000/');
		expect(($url.parse('https://abc.tld/path/xyz.ext') as URL).toString()).toBe('https://abc.tld/path/xyz.ext');
		expect(($url.parse('//abc.tld/path/xyz.ext') as URL).toString()).toBe('http://abc.tld/path/xyz.ext');
	});
	test('$url.getQueryVar()', async () => {
		expect($url.getQueryVar('abc')).toBe(undefined);
	});
	test('$url.getQueryVars()', async () => {
		expect($url.getQueryVars('abc')).toStrictEqual({});
	});
	test('$url.addQueryVar()', async () => {
		expect($url.addQueryVar('abc', 'a.b.c')).toBe('http://localhost:3000/?abc=a.b.c');
	});
	test('$url.addQueryVars()', async () => {
		expect($url.addQueryVars({ abc: 'a.b.c' })).toBe('http://localhost:3000/?abc=a.b.c');
	});
	test('$url.removeQueryVar()', async () => {
		expect($url.removeQueryVar('abc')).toBe('http://localhost:3000/');
	});
	test('$url.removeQueryVars()', async () => {
		expect($url.removeQueryVars(['abc'])).toBe('http://localhost:3000/');
	});
	test('$url.removeCSOQueryVars()', async () => {
		expect($url.removeCSOQueryVars()).toBe('http://localhost:3000/');
	});
	test('$url.encode()', async () => {
		expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ')) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

		expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.QUERY_RFC3986)) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

		expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.QUERY_RFC3986_AWS4)) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

		expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.QUERY_RFC1738)) //
			.toBe('abcdefghijklmnopqrstuvwxyz+%F0%9F%A6%8A+%EA%93%BA+0123456789+%21%22%27%28%29%2A%7E+%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore
	});
	test('$url.decode()', async () => {
		expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93')) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

		expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.QUERY_RFC3986)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

		expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.QUERY_RFC3986_AWS4)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

		expect($url.decode('abcdefghijklmnopqrstuvwxyz+%F0%9F%A6%8A+%EA%93%BA+0123456789+%21%22%27%28%29%2A%7E+%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.QUERY_RFC1738)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore
	});
});
