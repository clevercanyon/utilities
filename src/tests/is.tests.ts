/**
 * Test suite.
 */

import { $is, $to, $obj } from '../index.js';
import { describe, beforeEach, test, expect } from 'vitest';

describe('$is tests', async () => {
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
	test('$is.primitive()', async () => {
		expect($is.primitive(null)).toBe(true);
		expect($is.primitive(undefined)).toBe(true);
		expect($is.primitive(true)).toBe(true);
		expect($is.primitive(false)).toBe(true);
		expect($is.primitive(0)).toBe(true);
		expect($is.primitive(BigInt(0))).toBe(true);
		expect($is.primitive('')).toBe(true);
		expect($is.primitive(testObj)).toBe(false);
		expect($is.primitive(testCustomObj)).toBe(false);
		expect($is.primitive(testCustomNamedObj)).toBe(false);
		expect($is.primitive(testCustomAnonObj)).toBe(false);
		expect($is.primitive(() => null)).toBe(false);
	});
	test('$is.object()', async () => {
		expect($is.object(null)).toBe(false);
		expect($is.object(undefined)).toBe(false);
		expect($is.object(true)).toBe(false);
		expect($is.object(false)).toBe(false);
		expect($is.object(0)).toBe(false);
		expect($is.object('')).toBe(false);
		expect($is.object(BigInt(0))).toBe(false);
		expect($is.object(testObj)).toBe(true);
		expect($is.object(testCustomObj)).toBe(true);
		expect($is.object(testCustomNamedObj)).toBe(true);
		expect($is.object(testCustomAnonObj)).toBe(true);
		expect($is.object(new String(''))).toBe(true);
		expect($is.object(new Number(0))).toBe(true);
		expect($is.object(() => null)).toBe(true);
	});
	test('$is.objectTag()', async () => {
		expect($is.objectTag(testObj, 'Object')).toBe(true);
		expect($is.objectTag(testCustomObj, 'Object:Custom')).toBe(true);
		expect($is.objectTag(testCustomNamedObj, 'CustomNamed')).toBe(true);
		expect($is.objectTag(testCustomSubNamedObj, 'CustomSubNamed')).toBe(true);
		expect($is.objectTag(testCustomAnonObj, 'Object:?')).toBe(true);
	});
	test('$is.objectOfTag()', async () => {
		expect($is.objectOfTag(testObj, 'Object')).toBe(true);
		expect($is.objectOfTag(testCustomObj, 'Object:Custom', 'Object')).toBe(true);
		expect($is.objectOfTag(testCustomNamedObj, 'CustomNamed', 'Object:Custom', 'Object')).toBe(true);
		expect($is.objectOfTag(testCustomSubNamedObj, 'CustomSubNamed', 'CustomNamed', 'Object:Custom', 'Object')).toBe(true);
		expect($is.objectOfTag(testCustomAnonObj, 'Object:?', 'Object')).toBe(true);
	});
	test('$is.protoPollutionKey()', async () => {
		expect($is.protoPollutionKey('a')).toBe(false);
		expect($is.protoPollutionKey('b')).toBe(false);
		expect($is.protoPollutionKey('c')).toBe(false);
		expect($is.protoPollutionKey('__proto__')).toBe(true);
		expect($is.protoPollutionKey('prototype')).toBe(true);
		expect($is.protoPollutionKey('constructor')).toBe(true);
		expect($is.protoPollutionKey('__pRoTo__')).toBe(true);
		expect($is.protoPollutionKey('pRoToTyPe')).toBe(true);
		expect($is.protoPollutionKey('conStRucTor')).toBe(true);
	});
});
