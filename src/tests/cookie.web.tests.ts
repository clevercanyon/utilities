/**
 * Test suite.
 */

import { $env, $cookie } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$cookie tests', async () => {
	test('$env.isWeb()', async () => {
		expect($env.isWeb()).toBe(true);
	});
	test('$cookie.parse()', async () => {
		expect($cookie.parse()).toStrictEqual({});
		expect($cookie.set('a', 'a')).toBe(undefined);
		expect($cookie.set('b', 'b')).toBe(undefined);
		expect($cookie.set('c', 'c')).toBe(undefined);
		expect($cookie.parse()).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
	});
	test('$cookie.set()', async () => {
		expect($cookie.set('a', 'a')).toBe(undefined);
		expect($cookie.set('b', 'b')).toBe(undefined);
		expect($cookie.set('c', 'c')).toBe(undefined);
		expect($cookie.parse()).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
	});
	test('$cookie.get()', async () => {
		expect($cookie.set('a', 'a')).toBe(undefined);
		expect($cookie.set('b', 'b')).toBe(undefined);
		expect($cookie.set('c', 'c')).toBe(undefined);

		expect($cookie.get('a')).toBe('a');
		expect($cookie.get('b')).toBe('b');
		expect($cookie.get('c')).toBe('c');
	});
	test('$cookie.delete()', async () => {
		expect($cookie.set('a', 'a')).toBe(undefined);
		expect($cookie.set('b', 'b')).toBe(undefined);
		expect($cookie.set('c', 'c')).toBe(undefined);

		expect($cookie.delete('a')).toBe(undefined);
		expect($cookie.get('a')).toBe(undefined);
		expect($cookie.get('b')).toBe('b');
		expect($cookie.get('c')).toBe('c');
	});
	test('$cookie.nameIsValid()', async () => {
		expect($cookie.nameIsValid('a')).toBe(true);
		expect($cookie.nameIsValid('b')).toBe(true);
		expect($cookie.nameIsValid('c')).toBe(true);
		expect($cookie.nameIsValid('0')).toBe(true);
		expect($cookie.nameIsValid('1')).toBe(true);
		expect($cookie.nameIsValid('~')).toBe(false);
	});
});
