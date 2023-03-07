/**
 * Test suite.
 */

import { $to, $obj } from '../index.js';
import { describe, beforeEach, test, expect } from 'vitest';

describe('$to tests', async () => {
	class Custom {
		public values;

		public constructor(values = {}) {
			this.values = values;
		}
		public [$to.symbols.plain]() {
			return this.values;
		}
		public toJSON() {
			return this.values;
		}
	}
	class CustomNamed extends Custom {
		public get [$to.symbols.stringTag]() {
			return 'CustomNamed';
		}
	}
	class CustomSubNamed extends CustomNamed {
		public get [$to.symbols.stringTag]() {
			return 'CustomSubNamed';
		}
	}
	let testObj = {};
	let testCustomObj = new Custom();
	let testCustomNamedObj = new CustomNamed();
	let testCustomSubNamedObj = new CustomSubNamed();
	let testCustomAnonObj = new (class extends Custom {})();

	beforeEach(async () => {
		testObj = {
			a: 'a',
			b: 'b',
			c: 'c',
		};
		testCustomObj = new Custom($obj.cloneDeep(testObj));
		testCustomNamedObj = new CustomNamed($obj.cloneDeep(testObj));
		testCustomSubNamedObj = new CustomSubNamed($obj.cloneDeep(testObj));
		testCustomAnonObj = new (class extends Custom {})($obj.cloneDeep(testObj));
	});
	test('objects', async () => {
		expect(testObj).toEqual({ a: 'a', b: 'b', c: 'c' });
		expect(Object.keys(testObj)).toStrictEqual(['a', 'b', 'c']);

		expect(testCustomObj).toEqual({ values: { a: 'a', b: 'b', c: 'c' } });
		expect(Object.keys(testCustomObj)).toStrictEqual(['values']);

		// Not equal because `toEqual()` compares `toString()` object tags.
		expect(testCustomNamedObj).not.toEqual({ values: { a: 'a', b: 'b', c: 'c' } });

		expect(Object.fromEntries(Object.entries(testCustomNamedObj))).toEqual({ values: { a: 'a', b: 'b', c: 'c' } });
		expect(Object.keys(testCustomNamedObj)).toStrictEqual(['values']);

		expect(Object.fromEntries(Object.entries(testCustomSubNamedObj))).toEqual({ values: { a: 'a', b: 'b', c: 'c' } });
		expect(Object.keys(testCustomSubNamedObj)).toStrictEqual(['values']);

		expect(testCustomAnonObj).toEqual({ values: { a: 'a', b: 'b', c: 'c' } });
		expect(Object.keys(testCustomAnonObj)).toStrictEqual(['values']);
	});
	test('$to.plainObject()', async () => {
		const result1 = $to.plainObject(testCustomObj);
		const result2 = $to.plainObject(new Custom({ a: testCustomObj, b: testCustomObj, c: testCustomObj }));

		expect(result1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect(Object.keys(result1)).toStrictEqual(['a', 'b', 'c']);

		expect(result2).toStrictEqual({ a: testCustomObj, b: testCustomObj, c: testCustomObj });
		expect(Object.keys(result2)).toStrictEqual(['a', 'b', 'c']);

		expect($to.plainObject(NaN)).toStrictEqual({});
		expect($to.plainObject(null)).toStrictEqual({});
		expect($to.plainObject(undefined)).toStrictEqual({});
		expect($to.plainObject(true)).toStrictEqual({});
		expect($to.plainObject(false)).toStrictEqual({});
		expect($to.plainObject(0)).toStrictEqual({});
		expect($to.plainObject(123)).toStrictEqual({});
		expect($to.plainObject('abc')).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c' });
		expect($to.plainObject(['a', 'b', 'c'])).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c' });
	});
	test('$to.plainObjectDeep()', async () => {
		const result1 = $to.plainObjectDeep(testCustomObj);
		const result2 = $to.plainObjectDeep(new Custom({ a: testCustomObj, b: testCustomObj, c: testCustomObj, d: 'd' }));

		expect(result1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect(Object.keys(result1)).toStrictEqual(['a', 'b', 'c']);

		expect(result2).toStrictEqual({ a: { a: 'a', b: 'b', c: 'c' }, b: { a: 'a', b: 'b', c: 'c' }, c: { a: 'a', b: 'b', c: 'c' }, d: 'd' });
		expect(Object.keys(result2)).toStrictEqual(['a', 'b', 'c', 'd']);

		expect($to.plainObjectDeep(NaN)).toStrictEqual({});
		expect($to.plainObjectDeep(null)).toStrictEqual({});
		expect($to.plainObjectDeep(undefined)).toStrictEqual({});
		expect($to.plainObjectDeep(true)).toStrictEqual({});
		expect($to.plainObjectDeep(false)).toStrictEqual({});
		expect($to.plainObjectDeep(0)).toStrictEqual({});
		expect($to.plainObjectDeep(123)).toStrictEqual({});
		expect($to.plainObjectDeep('abc')).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c' });
		expect($to.plainObjectDeep(['a', 'b', 'c'])).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c' });
	});
});
