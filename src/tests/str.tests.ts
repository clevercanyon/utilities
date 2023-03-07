/**
 * Test suite.
 */

import { $is, $str } from '../index.js';
import { describe, beforeEach, test, expect } from 'vitest';

describe('$str tests', async () => {
	let str = '';
	let Str = new String('');

	beforeEach(async () => {
		str = 'abcdefghijklmnopqrstuvwxyzꓺ0123456789';
		Str = new String(str);
	});
	test('$str.byteLength()', async () => {
		// <https://o5p.me/r833HP>
		expect($str.byteLength(str)).toBe(39);
		expect($str.byteLength(Str.valueOf())).toBe(39);
	});
	test('$str.charLength()', async () => {
		// <https://o5p.me/r833HP>
		expect($str.charLength(str)).toBe(37);
		expect($str.charLength(Str.valueOf())).toBe(37);
	});
	test('$str.parseValue()', async () => {
		expect($str.parseValue('null')).toBe(null);
		expect($str.parseValue('null*')).toBe('null');

		expect($str.parseValue('undefined')).toBe(undefined);
		expect($str.parseValue('undefined*')).toBe('undefined');

		expect($str.parseValue('true')).toBe(true);
		expect($str.parseValue('true*')).toBe('true');

		expect($str.parseValue('false')).toBe(false);
		expect($str.parseValue('false*')).toBe('false');

		expect($is.nan($str.parseValue('NaN'))).toBe(true);
		expect($str.parseValue('NaN*')).toBe('NaN');

		expect($str.parseValue('false')).toBe(false);
		expect($str.parseValue('false*')).toBe('false');

		expect($str.parseValue('-Infinity')).toBe(-Infinity);
		expect($str.parseValue('-Infinity*')).toBe('-Infinity');

		expect($str.parseValue('Infinity')).toBe(Infinity);
		expect($str.parseValue('Infinity*')).toBe('Infinity');

		expect($str.parseValue('0')).toBe(0);
		expect($str.parseValue('0*')).toBe('0');

		expect($str.parseValue('123')).toBe(123);
		expect($str.parseValue('123*')).toBe('123');

		expect($str.parseValue('0.0')).toBe(0.0);
		expect($str.parseValue('0.0*')).toBe('0.0');

		expect($str.parseValue('1.23')).toBe(1.23);
		expect($str.parseValue('1.23*')).toBe('1.23');
	});
	test('$str.matches()', async () => {
		expect($str.matches(str, 'x')).toBe(false);
		expect($str.matches(str, 'abc*')).toBe(true);
		expect($str.matches(str, '*abc*')).toBe(true);
		expect($str.matches(str, '*a{,b}c*')).toBe(true);
	});
	test('$str.escSelector()', async () => {
		expect($str.escSelector('abc')).toBe('abc');
		expect($str.escSelector('!#abc')).toBe('\\!\\#abc');
	});
});
