/**
 * Test suite.
 */

import { $is, $to, $obj, $time } from '../index.js';
import { describe, beforeEach, test, expect } from 'vitest';

describe('$obj tests', async () => {
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
	test('$obj.proto()', async () => {
		expect($obj.proto(null)).toBe(null);
		expect($obj.proto({}, 2)).toBe(null);

		expect($is.plainObject($obj.proto({}))).toBe(true);
		expect($obj.proto({})?.constructor).toBe(Object);

		expect($obj.proto(testObj)?.constructor).toBe(Object);
		expect($obj.proto(testCustomObj)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomNamedObj)?.constructor).toBe(CustomNamed);
		expect($obj.proto(testCustomSubNamedObj)?.constructor).toBe(CustomSubNamed);
		expect($obj.tag($obj.proto(testCustomAnonObj))).toBe('Object:Custom');

		expect($obj.proto(testObj, 1)?.constructor).toBe(Object);
		expect($obj.proto(testCustomObj, 1)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomNamedObj, 2)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomSubNamedObj, 3)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomAnonObj, 10)?.constructor).toBe(undefined);
	});
	test('$obj.hasOwn()', async () => {
		expect($obj.hasOwn(testObj, 'a')).toBe(true);
		expect($obj.hasOwn(testObj, 'b')).toBe(true);
		expect($obj.hasOwn(testObj, 'c')).toBe(true);
		expect($obj.hasOwn(testObj, 'd')).toBe(false);

		expect($obj.hasOwn(testCustomObj, 'a')).toBe(false);
		expect($obj.hasOwn(testCustomObj, 'b')).toBe(false);
		expect($obj.hasOwn(testCustomObj, 'c')).toBe(false);
		expect($obj.hasOwn(testCustomObj, 'values')).toBe(true);

		expect($obj.hasOwn(testCustomNamedObj, 'a')).toBe(false);
		expect($obj.hasOwn(testCustomNamedObj, 'b')).toBe(false);
		expect($obj.hasOwn(testCustomNamedObj, 'c')).toBe(false);
		// ↓ `extends` makes inherited properties ‘own’ properties.
		expect($obj.hasOwn(testCustomNamedObj, 'values')).toBe(true);

		expect($obj.hasOwn(testCustomSubNamedObj, 'a')).toBe(false);
		expect($obj.hasOwn(testCustomSubNamedObj, 'b')).toBe(false);
		expect($obj.hasOwn(testCustomSubNamedObj, 'c')).toBe(false);
		// ↓ `extends` makes inherited properties ‘own’ properties.
		expect($obj.hasOwn(testCustomSubNamedObj, 'values')).toBe(true);
	});
	test('$obj.tag()', async () => {
		expect($obj.tag(null)).toBe('Null');
		expect($obj.tag(undefined)).toBe('Undefined');

		expect($obj.tag(new Date())).toBe('Date');
		expect($obj.tag(new Error())).toBe('Error');
		expect($obj.tag($time.from('now'))).toBe('Object:DateTime');

		expect($obj.tag(testObj)).toBe('Object');
		expect($obj.tag(testCustomObj)).toBe('Object:Custom');
		expect($obj.tag(testCustomNamedObj)).toBe('CustomNamed');
		expect($obj.tag(testCustomSubNamedObj)).toBe('CustomSubNamed');
		expect($obj.tag(testCustomAnonObj)).toBe('Object:?');

		// Has no constructor, so it’s a plain `Object`.
		expect($obj.tag(Object.create(null))).toBe('Object');

		// Has a constructor that’s not its own, so not a plain `Object`.
		expect($obj.tag(Object.create({}))).toBe('Object:?');

		expect($obj.tag(() => null)).toBe('Function');
		expect($obj.tag((() => null).bind({}))).toBe('Function');
		expect($obj.tag((() => null).bind(null))).toBe('Function');
		expect($obj.tag(async () => null)).toBe('AsyncFunction');

		expect($obj.tag(function* () { yield 1; })).toBe('GeneratorFunction'); // prettier-ignore
		expect($obj.tag(async function* () { yield 1; })).toBe('AsyncGeneratorFunction'); // prettier-ignore
	});
	test('$obj.tags()', async () => {
		expect($obj.tags(null)).toStrictEqual(['Null']);
		expect($obj.tags(undefined)).toStrictEqual(['Undefined']);

		expect($obj.tags(new Date())).toStrictEqual(['Date', 'Object']);
		expect($obj.tags(new Error())).toStrictEqual(['Error', 'Object']);
		expect($obj.tags($time.from('now'))).toStrictEqual(['Object:DateTime', 'Object']);

		expect($obj.tags(testObj)).toStrictEqual(['Object']);
		expect($obj.tags(testCustomObj)).toStrictEqual(['Object:Custom', 'Object']);
		expect($obj.tags(testCustomNamedObj)).toStrictEqual(['CustomNamed', 'Object:Custom', 'Object']);
		expect($obj.tags(testCustomSubNamedObj)).toStrictEqual(['CustomSubNamed', 'CustomNamed', 'Object:Custom', 'Object']);
		expect($obj.tags(testCustomAnonObj)).toStrictEqual(['Object:?', 'Object:Custom', 'Object']);

		// Has no constructor, so it’s a plain `Object`.
		expect($obj.tags(Object.create(null))).toStrictEqual(['Object']);

		// Has a constructor that’s not its own, so not a plain `Object`.
		expect($obj.tags(Object.create({}))).toStrictEqual(['Object:?', 'Object']);

		expect($obj.tags(() => null)).toStrictEqual(['Function', 'Object']);
		expect($obj.tags((() => null).bind({}))).toStrictEqual(['Function', 'Object']);
		expect($obj.tags((() => null).bind(null))).toStrictEqual(['Function', 'Object']);
		expect($obj.tags(async () => null)).toStrictEqual(['AsyncFunction', 'Function', 'Object']);

		expect($obj.tags(function* () { yield 1; })).toStrictEqual(['GeneratorFunction', 'Function', 'Object']); // prettier-ignore
		expect($obj.tags(async function* () { yield 1; })).toStrictEqual(['AsyncGeneratorFunction', 'Function', 'Object']); // prettier-ignore
	});
	test('$obj.mc.merge()', async () => {
		const result = $obj.mc.merge(testObj, { d: 'd' });
		expect(result).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });
		expect(Object.keys(result)).toStrictEqual(['a', 'b', 'c', 'd']);
	});
});
