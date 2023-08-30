/**
 * Test suite.
 */

import type * as $type from '../../type.js';
import { describe, beforeEach, test, expect } from 'vitest';
import { $is, $to, $obj, $symbol, $brand } from '../../index.js';

describe('$to', async () => {
	class Custom {
		public values: $type.Object;

		public constructor(values = {}) {
			this.values = values;
		}
		public [$symbol.objToPlain]() {
			return this.values;
		}
		public toJSON() {
			return this.values;
		}
	}
	class CustomNamed extends Custom {
		public get [$symbol.objStringTag]() {
			return 'CustomNamed';
		}
	}
	class CustomSubNamed extends CustomNamed {
		public get [$symbol.objStringTag]() {
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
	test('.castArray()', async () => {
		expect($to.castArray(NaN)).toStrictEqual([NaN]);
		expect($to.castArray(null)).toStrictEqual([null]);
		expect($to.castArray(undefined)).toStrictEqual([undefined]);
		expect($to.castArray(true)).toStrictEqual([true]);
		expect($to.castArray(false)).toStrictEqual([false]);
		expect($to.castArray(0)).toStrictEqual([0]);
		expect($to.castArray(123)).toStrictEqual([123]);
		expect($to.castArray('abc')).toStrictEqual(['abc']);
		expect($to.castArray(['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
	});
	test('.plainObject()', async () => {
		const result1 = $to.plainObject(testCustomObj);
		expect(result1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect(Object.keys(result1)).toStrictEqual(['a', 'b', 'c']);

		const result2 = $to.plainObject(new Custom({ a: testCustomObj, b: testCustomObj, c: testCustomObj }));
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
		expect($to.plainObject(new Set([0, 1, 2]))).toStrictEqual({ '0': 0, '1': 1, '2': 2 });
		expect($to.plainObject(['a', 'b', 'c'])).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c' });
	});
	test('.plainObjectDeep()', async () => {
		const result1 = $to.plainObjectDeep(testCustomObj);
		expect(result1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect(Object.keys(result1)).toStrictEqual(['a', 'b', 'c']);

		const result2 = $to.plainObjectDeep(new Custom({ a: testCustomObj, b: testCustomObj, c: testCustomObj, d: 'd' }));
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
		expect($to.plainObjectDeep(new Set([0, 1, new Set([0, 1, 2])]))).toStrictEqual({ '0': 0, '1': 1, '2': [0, 1, 2] });
		expect($to.plainObjectDeep(['a', 'b', 'c', ['a', 'b', 'c']])).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c', '3': ['a', 'b', 'c'] });
	});
	test('.flatObject()', async () => {
		const obj = new (class extends Custom {
			[x: $type.ObjectKey]: unknown;

			public constructor() {
				super();
				this.a = Symbol('a');
				this.b = ['b', this, new Date()];
				this.c = {
					a: () => 'a',
					b: new Set([new Date(), this]),
					c: {
						a: async () => 'a',
						b: new Date(),
						c: 'c',
						d: [this],
					},
					d: [this, new Date()],
				};
				this.d = this;
			}
		})();
		const flatObj = $to.flatObject(obj);

		expect(Object.keys(flatObj)).toStrictEqual([
			'values', //
			'a',
			'b[0]',
			'b[1]',
			'b[2]',
			'c.a',
			'c.b',
			'c.c.a',
			'c.c.b',
			'c.c.c',
			'c.c.d[0]',
			'c.d[0]',
			'c.d[1]',
			'd',
		]);
		expect(flatObj['values']).toStrictEqual({});
		expect($is.symbol(flatObj['a'])).toBe(true);
		expect(flatObj['b[0]']).toBe('b');
		expect(flatObj['b[1]']).toBe(obj);
		expect($is.date(flatObj['b[2]'])).toBe(true);
		expect($is.function(flatObj['c.a'])).toBe(true);
		expect($is.set(flatObj['c.b'])).toBe(true);
		expect($is.asyncFunction(flatObj['c.c.a'])).toBe(true);
		expect($is.date(flatObj['c.c.b'])).toBe(true);
		expect(flatObj['c.c.c']).toBe('c');
		expect(flatObj['c.c.d[0]']).toBe(obj);
		expect(flatObj['c.d[0]']).toBe(obj);
		expect($is.date(flatObj['c.d[1]'])).toBe(true);
		expect(flatObj['d']).toBe(obj);

		expect($to.flatObject(NaN)).toStrictEqual({});
		expect($to.flatObject(null)).toStrictEqual({});
		expect($to.flatObject(undefined)).toStrictEqual({});
		expect($to.flatObject(true)).toStrictEqual({});
		expect($to.flatObject(false)).toStrictEqual({});
		expect($to.flatObject(0)).toStrictEqual({});
		expect($to.flatObject(123)).toStrictEqual({});
		expect($to.flatObject(BigInt(123))).toStrictEqual({});

		expect($to.flatObject('abc')).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c' });
		expect($to.flatObject(new Set([0, 1, new Set([0, 1, 2])]))).toStrictEqual({});
		expect($to.flatObject(['a', 'b', 'c', ['a', 'b', 'c']])).toStrictEqual({ '[0]': 'a', '[1]': 'b', '[2]': 'c', '[3][0]': 'a', '[3][1]': 'b', '[3][2]': 'c' });

		const brand = $brand.get('&');
		const flatBrand = $to.flatObject(brand);
		expect(Object.keys(flatBrand)).toStrictEqual([
			'org', // Circular.
			'n7m',
			'name',
			'namespace',
			'slug',
			'var',
			'slugPrefix',
			'varPrefix',
			'rootDomain',
			'aws.s3.bucket',
			'aws.s3.cdnDomain',
			'google.analytics.ga4GtagId',
			'cloudflare.accountId',
			'cloudflare.zoneId',
		]);
	});
	test('.plainFlatObject()', async () => {
		const obj = new (class extends Custom {
			public constructor() {
				super();
				this.values = {
					a: Symbol('a'),
					b: ['b', this, new Date()],
					c: {
						a: () => 'a',
						b: new Set([new Date(), this]),
						c: {
							a: async () => 'a',
							b: new Date(),
							c: 'c',
							d: [this],
						},
						d: [this, new Date()],
					},
					d: this,
				};
			}
		})();
		const plainObj = $to.plainObjectDeep(obj);
		const plainFlatObj = $to.plainFlatObject(obj);

		expect(Object.keys(plainFlatObj)).toStrictEqual([
			'a', //
			'b[0]',
			'b[1]',
			'b[2]',
			'c.a',
			'c.b[0]',
			'c.b[1]',
			'c.c.a',
			'c.c.b',
			'c.c.c',
			'c.c.d[0]',
			'c.d[0]',
			'c.d[1]',
			'd',
		]);
		expect($is.symbol(plainFlatObj['a'])).toBe(true);
		expect(plainFlatObj['b[0]']).toBe('b');
		expect(plainFlatObj['b[1]']).toStrictEqual(plainObj);
		expect(plainFlatObj['b[2]']).toStrictEqual({});
		expect($is.function(plainFlatObj['c.a'])).toBe(true);
		expect(plainFlatObj['c.b[0]']).toStrictEqual({});
		expect(plainFlatObj['c.b[1]']).toStrictEqual(plainObj);
		expect($is.asyncFunction(plainFlatObj['c.c.a'])).toBe(true);
		expect(plainFlatObj['c.c.b']).toStrictEqual({});
		expect(plainFlatObj['c.c.c']).toBe('c');
		expect(plainFlatObj['c.c.d[0]']).toStrictEqual(plainObj);
		expect(plainFlatObj['c.d[0]']).toStrictEqual(plainObj);
		expect(plainFlatObj['c.d[1]']).toStrictEqual({});
		expect(plainFlatObj['d']).toStrictEqual(plainObj);

		expect($to.plainFlatObject(NaN)).toStrictEqual({});
		expect($to.plainFlatObject(null)).toStrictEqual({});
		expect($to.plainFlatObject(undefined)).toStrictEqual({});
		expect($to.plainFlatObject(true)).toStrictEqual({});
		expect($to.plainFlatObject(false)).toStrictEqual({});
		expect($to.plainFlatObject(0)).toStrictEqual({});
		expect($to.plainFlatObject(123)).toStrictEqual({});
		expect($to.plainFlatObject(BigInt(123))).toStrictEqual({});

		expect($to.plainFlatObject('abc')).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c' });
		expect($to.plainFlatObject(new Set([0, 1, new Set([0, 1, 2])]))).toStrictEqual({ '0': 0, '1': 1, '2[0]': 0, '2[1]': 1, '2[2]': 2 });
		expect($to.plainFlatObject(['a', 'b', 'c', ['a', 'b', 'c']])).toStrictEqual({ '0': 'a', '1': 'b', '2': 'c', '3[0]': 'a', '3[1]': 'b', '3[2]': 'c' });
	});
});
