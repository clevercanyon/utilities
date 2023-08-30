/**
 * Test suite.
 */

import { describe, beforeEach, test, expect } from 'vitest';
import { $app, $is, $obj, $time, $symbol, $brand } from '../../index.js';

describe('$obj', async () => {
	class Custom {
		public values;

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
		testObj = { a: 'a', b: 'b', c: 'c' };
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
	test('.tag()', async () => {
		expect($obj.tag(null)).toBe('Null');
		expect($obj.tag(undefined)).toBe('Undefined');

		expect($obj.tag(new Date())).toBe('Date');
		expect($obj.tag(new Error())).toBe('Error');
		expect($obj.tag($time.parse('now'))).toBe($app.pkgName + '/Time');

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
	test('.tags()', async () => {
		expect($obj.tags(null)).toStrictEqual(['Null']);
		expect($obj.tags(undefined)).toStrictEqual(['Undefined']);

		expect($obj.tags(new Date())).toStrictEqual(['Date', 'Object']);
		expect($obj.tags(new Error())).toStrictEqual(['Error', 'Object']);
		expect($obj.tags($time.parse('now'))).toStrictEqual([$app.pkgName + '/Time', 'Object']);

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
	test('.c9r()', async () => {
		expect($obj.c9r(null)).toBe(undefined);
		expect($obj.c9r(undefined)).toBe(undefined);

		expect($obj.c9r({})).toBe(Object);
		expect($obj.c9r(testObj)).toBe(Object);
		expect($obj.c9r(testCustomObj)).toBe(Custom);
		expect($obj.c9r(testCustomNamedObj)).toBe(CustomNamed);
		expect($obj.c9r(testCustomSubNamedObj)).toBe(CustomSubNamed);
		expect($obj.tag($obj.c9r(testCustomAnonObj))).toBe('Function');

		expect($obj.c9r(testObj)).toBe(Object);
		expect($obj.c9r(testCustomObj)).toBe(Custom);
		expect($obj.c9r(testCustomNamedObj)).toBe(CustomNamed);
		expect($obj.c9r(testCustomSubNamedObj)).toBe(CustomSubNamed);
	});
	test('.proto()', async () => {
		expect($obj.proto(null)).toBe(undefined);
		expect($obj.proto({}, 2)).toBe(undefined);

		expect($is.plainObject($obj.proto({}))).toBe(true);
		expect($obj.proto({})?.constructor).toBe(Object);

		expect($obj.proto(testObj)?.constructor).toBe(Object);
		expect($obj.proto(testCustomObj)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomNamedObj)?.constructor).toBe(CustomNamed);
		expect($obj.proto(testCustomSubNamedObj)?.constructor).toBe(CustomSubNamed);
		expect($obj.tag($obj.proto(testCustomAnonObj))).toBe('Object:?');

		expect($obj.proto(testObj, 1)?.constructor).toBe(Object);
		expect($obj.proto(testCustomObj, 1)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomNamedObj, 2)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomSubNamedObj, 3)?.constructor).toBe(Custom);
		expect($obj.proto(testCustomAnonObj, 10)?.constructor).toBe(undefined);
	});
	test('.protoC9r()', async () => {
		expect($obj.protoC9r(null)).toBe(undefined);
		expect($obj.protoC9r({}, 2)).toBe(undefined);

		expect($obj.protoC9r({})).toBe(Object);
		expect($obj.protoC9r(testObj)).toBe(Object);
		expect($obj.protoC9r(testCustomObj)).toBe(Custom);
		expect($obj.protoC9r(testCustomNamedObj)).toBe(CustomNamed);
		expect($obj.protoC9r(testCustomSubNamedObj)).toBe(CustomSubNamed);
		expect($obj.tag($obj.protoC9r(testCustomAnonObj))).toBe('Function');

		expect($obj.protoC9r(testObj, 1)).toBe(Object);
		expect($obj.protoC9r(testCustomObj, 1)).toBe(Custom);
		expect($obj.protoC9r(testCustomNamedObj, 2)).toBe(Custom);
		expect($obj.protoC9r(testCustomSubNamedObj, 3)).toBe(Custom);
		expect($obj.protoC9r(testCustomAnonObj, 10)).toBe(undefined);
	});
	test('.hasOwn()', async () => {
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
	test('.keysAndSymbols()', async () => {
		const symbolA = Symbol();
		const symbolB = Symbol();

		const customObj = new (class extends Custom {
			public constructor() {
				super({ a: 'a', b: 'b', c: 'c' });
				Object.defineProperty(this, 'a', { value: 'a', enumerable: true });
				Object.defineProperty(this, 'b', { value: 'b', enumerable: true });
				Object.defineProperty(this, 'c', { value: 'c', enumerable: true });
				Object.defineProperty(this, 'd', { value: 'd', enumerable: false });
				Object.defineProperty(this, symbolA, { value: true, enumerable: true, writable: true });
				Object.defineProperty(this, symbolB, { value: true, enumerable: false });
			}
		})();
		expect($obj.keysAndSymbols(testCustomObj)).toStrictEqual(['values']);
		expect($obj.keysAndSymbols(testObj)).toStrictEqual(['a', 'b', 'c']);
		expect($obj.keysAndSymbols(customObj)).toStrictEqual(['values', 'a', 'b', 'c', symbolA]);
	});
	test('.keyAndSymbolEntries()', async () => {
		const symbolA = Symbol();
		const symbolB = Symbol();

		const customObj = new (class extends Custom {
			public constructor() {
				super({ a: 'a', b: 'b', c: 'c' });
				Object.defineProperty(this, 'a', { value: 'a', enumerable: true });
				Object.defineProperty(this, 'b', { value: 'b', enumerable: true });
				Object.defineProperty(this, 'c', { value: 'c', enumerable: true });
				Object.defineProperty(this, 'd', { value: 'd', enumerable: false });
				Object.defineProperty(this, symbolA, { value: true, enumerable: true, writable: true });
				Object.defineProperty(this, symbolB, { value: true, enumerable: false });
			}
		})();
		expect($obj.keyAndSymbolEntries(testCustomObj)).toStrictEqual([['values', { a: 'a', b: 'b', c: 'c' }]]);
		expect($obj.keyAndSymbolEntries(testObj)).toStrictEqual([['a', 'a'], ['b', 'b'], ['c', 'c']]); // prettier-ignore
		expect($obj.keyAndSymbolEntries(customObj)).toStrictEqual([
			['values', { a: 'a', b: 'b', c: 'c' }],
			['a', 'a'],
			['b', 'b'],
			['c', 'c'],
			[symbolA, true],
		]);
	});
	test('.assign()', async () => {
		const symbolA = Symbol();
		const symbolB = Symbol();

		const customObj = new (class extends Custom {
			public constructor() {
				super({ a: 'a', b: 'b', c: 'c' });
				Object.defineProperty(this, 'a', { value: 'a', enumerable: true });
				Object.defineProperty(this, 'b', { value: 'b', enumerable: true });
				Object.defineProperty(this, 'c', { value: 'c', enumerable: true });
				Object.defineProperty(this, 'd', { value: 'd', enumerable: false });
				Object.defineProperty(this, symbolA, { value: true, enumerable: true, writable: true });
				Object.defineProperty(this, symbolB, { value: true, enumerable: false });
			}
		})();

		expect($obj.assign(null, undefined, { a: 'a' })).toStrictEqual({ a: 'a' });
		expect($obj.assign({ a: 'a' }, null, undefined, [])).toStrictEqual({ a: 'a' });
		expect($obj.assign({ a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const customObjAfterAssign = { ...customObj, e: 'e', f: 'f', g: 'g' };
		$obj.assign(customObj, { e: 'e', f: 'f', g: 'g' }); // By reference.

		expect({ ...customObj }).toStrictEqual(customObjAfterAssign);
	});
	test('.assignComplete()', async () => {
		const symbolA = Symbol();
		const symbolB = Symbol();

		const customObj = new (class extends Custom {
			public constructor() {
				super({ a: 'a', b: 'b', c: 'c' });
				Object.defineProperty(this, 'a', { value: 'a', enumerable: true });
				Object.defineProperty(this, 'b', { value: 'b', enumerable: true });
				Object.defineProperty(this, 'c', { value: 'c', enumerable: true });
				Object.defineProperty(this, 'd', { value: 'd', enumerable: false });
				Object.defineProperty(this, symbolA, { value: true, enumerable: true, writable: true });
				Object.defineProperty(this, symbolB, { value: true, enumerable: false });
			}
		})();

		expect($obj.assignComplete(null, undefined, { a: 'a' })).toStrictEqual({ a: 'a' });
		expect($obj.assignComplete({ a: 'a' }, null, undefined, [])).toStrictEqual({ a: 'a' });
		expect($obj.assignComplete({ a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const plainObj = { e: 'e', f: 'f', g: 'g' };
		const plainObjAfterAssign = { ...customObj, e: 'e', f: 'f', g: 'g' };
		$obj.assignComplete(plainObj, customObj); // By reference.

		expect({ ...plainObj }).toStrictEqual(plainObjAfterAssign);
		expect(Object.getOwnPropertyDescriptor(plainObj, 'a')?.writable).toBe(false);
		expect(Object.getOwnPropertyDescriptor(plainObj, symbolA)?.writable).toBe(true);
	});
	test('.defaults()', async () => {
		const abcObj = { a: 'a' }; // Will update defaults by reference.
		expect($obj.defaults(abcObj, { b: 'b' }, { b: 'c' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect(abcObj).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
	});
	test('.clone()', async () => {
		const abcObjs = { a: testObj, b: testObj, c: testObj };
		expect($obj.clone(abcObjs) === abcObjs).toBe(false);
		expect($obj.clone(abcObjs)).toStrictEqual(abcObjs);
		expect($obj.tags($obj.clone(abcObjs))).toStrictEqual($obj.tags(abcObjs));

		const abcdObj = { a: 'a', b: 'b' };
		Object.defineProperty(abcdObj, 'c', { value: 'c', enumerable: false, writable: false });
		Object.defineProperty(abcdObj, 'd', { value: 'd', enumerable: true, writable: false });
		expect($obj.clone(abcdObj) === abcdObj).toBe(false);
		expect($obj.clone(abcdObj)).toStrictEqual(abcdObj);
		expect($obj.tags($obj.clone(abcdObj))).toStrictEqual($obj.tags(abcdObj));

		const url = new URL('https://example.com');
		expect($obj.clone(url) === url).toBe(false);
		expect($obj.clone(url)).toStrictEqual(url);
		expect($obj.tags($obj.clone(url))).toStrictEqual($obj.tags(url));

		const time = $time.parse('now');
		expect($obj.clone(time) === time).toBe(false);
		expect($obj.clone(time)).toStrictEqual(time);
		expect($obj.tags($obj.clone(time))).toStrictEqual($obj.tags(time));

		const brand = $brand.get('&');
		expect($obj.clone(brand) === brand).toBe(false);
		expect($obj.clone(brand).org === brand.org).toBe(true);
		expect($obj.clone(brand)).toStrictEqual(brand);
		expect($obj.tags($obj.clone(brand))).toStrictEqual($obj.tags(brand));

		const arr = [0, [0, [0, 0]]];
		expect($obj.clone(arr) === arr).toBe(false);
		expect($obj.clone(arr)).toStrictEqual(arr);
		expect($obj.tags($obj.clone(arr))).toStrictEqual($obj.tags(arr));

		const set = new Set([0, new Set([0, 0])]);
		expect($obj.clone(set) === set).toBe(false);
		expect($obj.clone(set)).toStrictEqual(set);
		expect($obj.tags($obj.clone(set))).toStrictEqual($obj.tags(set));

		const map = new Map([[0, new Map([[0, 0]])]]);
		expect($obj.clone(map) === map).toBe(false);
		expect($obj.clone(map)).toStrictEqual(map);
		expect($obj.tags($obj.clone(map))).toStrictEqual($obj.tags(map));

		const plainObj = {
			a: [url, [0, [brand, 0]]],
			b: new Set([brand, new Set([url, 0])]),
			c: new Map([[0, new Map([[set, new Int8Array(2)]])]]),
			d: [brand, new Set([brand, new Set([new Int8Array(2), 0])])],
			e: [url, new Map([[set, new Map([[new Int8Array(2), set]])]])],
		};
		expect($obj.clone(plainObj) === plainObj).toBe(false);
		expect($obj.clone(plainObj).a === plainObj.a).toBe(true);
		expect($obj.clone(plainObj).b === plainObj.b).toBe(true);
		expect($obj.clone(plainObj).c === plainObj.c).toBe(true);
		expect($obj.clone(plainObj).d === plainObj.d).toBe(true);
		expect($obj.clone(plainObj).e === plainObj.e).toBe(true);
		expect($obj.clone(plainObj)).toStrictEqual(plainObj);
		expect($obj.tags($obj.clone(plainObj))).toStrictEqual($obj.tags(plainObj));

		const typedArray = new Float32Array(2);
		expect($obj.clone(typedArray) === typedArray).toBe(false);
		expect($obj.clone(typedArray)).toStrictEqual(typedArray);
		expect($obj.tags($obj.clone(typedArray))).toStrictEqual($obj.tags(typedArray));
	});
	test('.cloneDeep()', async () => {
		const abcObjs = { a: testObj, b: testObj, c: testObj };
		expect($obj.cloneDeep(abcObjs) === abcObjs).toBe(false);
		expect($obj.cloneDeep(abcObjs)).toStrictEqual(abcObjs);
		expect($obj.tags($obj.cloneDeep(abcObjs))).toStrictEqual($obj.tags(abcObjs));

		const abcdObj = { a: 'a', b: 'b' };
		Object.defineProperty(abcdObj, 'c', { value: 'c', enumerable: false, writable: false });
		Object.defineProperty(abcdObj, 'd', { value: 'd', enumerable: true, writable: false });
		expect($obj.cloneDeep(abcdObj) === abcdObj).toBe(false);
		expect($obj.cloneDeep(abcdObj)).toStrictEqual(abcdObj);
		expect($obj.tags($obj.cloneDeep(abcdObj))).toStrictEqual($obj.tags(abcdObj));

		const url = new URL('https://example.com');
		expect($obj.cloneDeep(url) === url).toBe(false);
		expect($obj.cloneDeep(url)).toStrictEqual(url);
		expect($obj.tags($obj.cloneDeep(url))).toStrictEqual($obj.tags(url));

		const time = $time.parse('now');
		expect($obj.cloneDeep(time) === time).toBe(false);
		expect($obj.cloneDeep(time)).toStrictEqual(time);
		expect($obj.tags($obj.cloneDeep(time))).toStrictEqual($obj.tags(time));

		const brand = $brand.get('&');
		expect($obj.cloneDeep(brand) === brand).toBe(false);
		expect($obj.cloneDeep(brand).org === brand.org).toBe(false);
		expect($obj.cloneDeep(brand)).toStrictEqual(brand);
		expect($obj.tags($obj.cloneDeep(brand))).toStrictEqual($obj.tags(brand));

		const arr = [0, [0, [0, 0]]];
		expect($obj.cloneDeep(arr)).toStrictEqual(arr);
		expect($obj.tags($obj.cloneDeep(arr))).toStrictEqual($obj.tags(arr));

		const set = new Set([0, new Set([0, 0])]);
		expect($obj.cloneDeep(set) === set).toBe(false);
		expect($obj.cloneDeep(set)).toStrictEqual(set);
		expect($obj.tags($obj.cloneDeep(set))).toStrictEqual($obj.tags(set));

		const map = new Map([[0, new Map([[0, 0]])]]);
		expect($obj.cloneDeep(map) === map).toBe(false);
		expect($obj.cloneDeep(map)).toStrictEqual(map);
		expect($obj.tags($obj.cloneDeep(map))).toStrictEqual($obj.tags(map));

		const plainObj = {
			a: [url, [0, [brand, 0]]],
			b: new Set([brand, new Set([url, 0])]),
			c: new Map([[0, new Map([[set, new Int8Array(2)]])]]),
			d: [brand, new Set([brand, new Set([new Int8Array(2), 0])])],
			e: [url, new Map([[set, new Map([[new Int8Array(2), set]])]])],
		};
		expect($obj.cloneDeep(plainObj) === plainObj).toBe(false);
		expect($obj.cloneDeep(plainObj).a === plainObj.a).toBe(false);
		expect($obj.cloneDeep(plainObj).b === plainObj.b).toBe(false);
		expect($obj.cloneDeep(plainObj).c === plainObj.c).toBe(false);
		expect($obj.cloneDeep(plainObj).d === plainObj.d).toBe(false);
		expect($obj.cloneDeep(plainObj).e === plainObj.e).toBe(false);
		expect($obj.cloneDeep(plainObj)).toStrictEqual(plainObj);
		expect($obj.tags($obj.cloneDeep(plainObj))).toStrictEqual($obj.tags(plainObj));

		const typedArray = new Float32Array(2);
		expect($obj.cloneDeep(typedArray) === typedArray).toBe(false);
		expect($obj.cloneDeep(typedArray)).toStrictEqual(typedArray);
		expect($obj.tags($obj.cloneDeep(typedArray))).toStrictEqual($obj.tags(typedArray));
	});
	test('.mcCustom()', async () => {
		expect($obj.tags($obj.mcCustom())).toStrictEqual([
			$app.pkgName + '/ObjectMC', //
			$app.pkgName + '/Utility',
			$app.pkgName + '/Base',
			'Object',
		]);
	});
	test('.mergeDeep()', async () => {
		expect($obj.mergeDeep(null, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(undefined, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(-0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(-1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(-Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep('0', { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(NaN, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(BigInt(0), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(true, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(false, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep([], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(['a', 'b', 'c'], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(new Set(['a', 'b', 'c']), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep(new Map([[0, 0]]), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, null)).toBe(null);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, undefined)).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 0)).toBe(0);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -0)).toBe(-0);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 1)).toBe(1);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -1)).toBe(-1);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, Infinity)).toBe(Infinity);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -Infinity)).toBe(-Infinity);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, '0')).toBe('0');
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, NaN)).toBe(NaN);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, BigInt(0))).toBe(BigInt(0));
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, true)).toBe(true);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, false)).toBe(false);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, [])).toStrictEqual([]);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, ['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Set(['a', 'b', 'c']))).toStrictEqual(new Set(['a', 'b', 'c']));
		expect($obj.mergeDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Map([[0, 0]]))).toStrictEqual(new Map([[0, 0]]));

		const abcObj1 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj1, { d: 'd' })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });
		expect(abcObj1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj2 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj2, { $set: { a: { a: 'a' } } })).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });
		expect(abcObj2).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj3 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj3, { $unset: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj3).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj4 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj4, { $omit: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj4).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj5 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj5, { $leave: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj5).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj6 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj6, { $pick: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj6).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj7 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj7, { $push: { a: 'a2' } })).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });
		expect(abcObj7).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj8 = { a: ['a1', 'a2'], b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj8, { $pull: { a: ['a2'] } })).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });
		expect(abcObj8).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });

		const abcObj9 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj9, { $concat: { a: ['a2', 'a3'] } })).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });
		expect(abcObj9).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj10 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj10, { $default: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj10).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj11 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj11, { $defaults: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj11).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj12 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.mergeDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj12).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj13 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.mergeDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj13).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const url14 = new URL('https://example.com');
		const set14 = new Set([0, new Set([0, 0])]);
		const brand14 = $brand.get('&');
		const abcObj14 = { a: 'a', b: 'b', c: 'c' };
		const plainObj14 = {
			a: [url14, [0, [brand14, 0]]],
			b: new Set([brand14, new Set([url14, 0])]),
			c: new Map([[0, new Map([[set14, new Int8Array(2)]])]]),
			d: [brand14, new Set([brand14, new Set([new Int8Array(2), 0])])],
			e: [url14, new Map([[set14, new Map([[new Int8Array(2), set14]])]])],
		};
		const result14 = $obj.mergeDeep(abcObj14, plainObj14);
		expect(result14).toStrictEqual(plainObj14);
		expect(result14).not.toBe(plainObj14);
		expect(result14.a).not.toBe(plainObj14.a);
		expect(result14.b).toBe(plainObj14.b);
		expect(result14.c).toBe(plainObj14.c);
		expect(result14.d).not.toBe(plainObj14.d);
		expect(result14.e).not.toBe(plainObj14.e);

		const pkgJSONObj15 = $obj.mergeDeep(
			{},
			{
				'$ꓺdefaults': {
					'author': {
						'name': 'Owner',
						'url': 'https://owner.com',
					},
					'bin': {},
					'browser': '',
					'bugs': 'https://github.com/owner/project/issues',
					'bundleDependencies': [],
					'configꓺownerꓺ&ꓺbuildꓺappType': 'cma',
					'configꓺownerꓺ&ꓺbuildꓺtargetEnv': 'any',
					'configꓺownerꓺ&ꓺdotfilesꓺlock': [],
					'configꓺownerꓺ&ꓺgithubꓺconfigVersion': '',
					'configꓺownerꓺ&ꓺgithubꓺenvsVersion': '',
					'configꓺownerꓺ&ꓺgithubꓺlabels': {},
					'configꓺownerꓺ&ꓺgithubꓺteams': {},
					'configꓺownerꓺ&ꓺnpmjsꓺconfigVersions': '',
					'contributors': [],
					'cpu': [],
					'dependencies': {},
					'description': 'Another great project by Owner.',
					'devDependencies': {},
					'devDependenciesꓺ@owner/dev-deps': '*',
					'engines': {},
					'exports': null,
					'files': [],
					'funding': 'https://github.com/sponsors/owner',
					'homepage': 'https://github.com/owner/project#readme',
					'imports': {},
					'keywords': ['keyword'],
					'license': 'GPL-3.0',
					'main': '',
					'module': '',
					'name': '@owner/project',
					'optionalDependencies': {},
					'os': [],
					'overrides': {},
					'peerDependencies': {},
					'peerDependenciesMeta': {},
					'private': true,
					'publishConfigꓺaccess': 'restricted',
					'repository': 'https://github.com/owner/project',
					'sideEffects': [],
					'type': 'module',
					'types': '',
					'typesVersions': {},
					'unpkg': '',
					'version': '1.0.0',
					'workspaces': [],
				},
				'$ꓺset': {
					'funding': 'https://github.com/sponsors/owner',
					'workspaces': [],

					'cpu': ['x64', 'arm64'],
					'os': ['darwin', 'linux'],
					'engines': {
						'node': '^19.2.0 || ^19.4.0',
						'npm': '^8.19.3 || ^9.2.0',
					},
				},
				'$ꓺunset': ['typings', 'scripts'],

				'$ꓺkeySortOrder': [
					'private',
					'publishConfigꓺaccess',

					'version',
					'license',
					'name',
					'description',
					'repository',
					'homepage',
					'bugs',
					'funding',
					'keywords',

					'author',
					'contributors',

					'type',
					'files',
					'bin',
					'imports',
					'exports',
					'sideEffects',
					'module',
					'main',
					'browser',
					'unpkg',
					'types',
					'typesVersions',

					'dependencies',
					'peerDependencies',
					'peerDependenciesMeta',
					'optionalDependencies',
					'bundleDependencies',
					'devDependencies',

					'overrides',
					'workspaces',

					'cpu',
					'os',
					'enginesꓺnode',
					'enginesꓺnpm',

					'configꓺownerꓺ&ꓺdotfilesꓺlock',

					'configꓺownerꓺ&ꓺbuildꓺappType',
					'configꓺownerꓺ&ꓺbuildꓺtargetEnv',

					'configꓺownerꓺ&ꓺgithubꓺteams',
					'configꓺownerꓺ&ꓺgithubꓺlabels',
					'configꓺownerꓺ&ꓺgithubꓺconfigVersion',
					'configꓺownerꓺ&ꓺgithubꓺenvsVersion',

					'configꓺownerꓺ&ꓺnpmjsꓺconfigVersions',
				],
			},
		);
		expect(JSON.stringify(pkgJSONObj15, null, 4)).toBe(
			JSON.stringify(
				{
					'private': true,
					'publishConfig': {
						'access': 'restricted',
					},
					'version': '1.0.0',
					'license': 'GPL-3.0',
					'name': '@owner/project',
					'description': 'Another great project by Owner.',
					'repository': 'https://github.com/owner/project',
					'homepage': 'https://github.com/owner/project#readme',
					'bugs': 'https://github.com/owner/project/issues',
					'funding': 'https://github.com/sponsors/owner',
					'keywords': ['keyword'],
					'author': {
						'name': 'Owner',
						'url': 'https://owner.com',
					},
					'contributors': [],
					'type': 'module',
					'files': [],
					'bin': {},
					'imports': {},
					'exports': null,
					'sideEffects': [],
					'module': '',
					'main': '',
					'browser': '',
					'unpkg': '',
					'types': '',
					'typesVersions': {},
					'dependencies': {},
					'peerDependencies': {},
					'peerDependenciesMeta': {},
					'optionalDependencies': {},
					'bundleDependencies': [],
					'devDependencies': {
						'@owner/dev-deps': '*',
					},
					'overrides': {},
					'workspaces': [],
					'cpu': ['x64', 'arm64'],
					'os': ['darwin', 'linux'],
					'engines': {
						'node': '^19.2.0 || ^19.4.0',
						'npm': '^8.19.3 || ^9.2.0',
					},
					'config': {
						'owner': {
							'&': {
								'dotfiles': {
									'lock': [],
								},
								'build': {
									'appType': 'cma',
									'targetEnv': 'any',
								},
								'github': {
									'teams': {},
									'labels': {},
									'configVersion': '',
									'envsVersion': '',
								},
								'npmjs': {
									'configVersions': '',
								},
							},
						},
					},
				},
				null,
				4,
			),
		);
	});
	test('.mergeClonesDeep()', async () => {
		expect($obj.mergeClonesDeep(null, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(undefined, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(-0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(-1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(-Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep('0', { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(NaN, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(BigInt(0), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(true, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(false, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep([], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(['a', 'b', 'c'], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(new Set(['a', 'b', 'c']), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep(new Map([[0, 0]]), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, null)).toBe(null);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, undefined)).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 0)).toBe(0);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -0)).toBe(-0);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 1)).toBe(1);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -1)).toBe(-1);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, Infinity)).toBe(Infinity);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -Infinity)).toBe(-Infinity);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, '0')).toBe('0');
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, NaN)).toBe(NaN);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, BigInt(0))).toBe(BigInt(0));
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, true)).toBe(true);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, false)).toBe(false);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, [])).toStrictEqual([]);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, ['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Set(['a', 'b', 'c']))).toStrictEqual(new Set(['a', 'b', 'c']));
		expect($obj.mergeClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Map([[0, 0]]))).toStrictEqual(new Map([[0, 0]]));

		const abcObj1 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj1, { d: 'd' })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });
		expect(abcObj1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj2 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj2, { $set: { a: { a: 'a' } } })).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });
		expect(abcObj2).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj3 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj3, { $unset: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj3).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj4 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj4, { $omit: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj4).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj5 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj5, { $leave: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj5).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj6 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj6, { $pick: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj6).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj7 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj7, { $push: { a: 'a2' } })).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });
		expect(abcObj7).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj8 = { a: ['a1', 'a2'], b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj8, { $pull: { a: ['a2'] } })).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });
		expect(abcObj8).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });

		const abcObj9 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj9, { $concat: { a: ['a2', 'a3'] } })).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });
		expect(abcObj9).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj10 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj10, { $default: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj10).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj11 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj11, { $defaults: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj11).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj12 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.mergeClonesDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj12).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj13 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.mergeClonesDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.mergeClonesDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj13).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const url14 = new URL('https://example.com');
		const set14 = new Set([0, new Set([0, 0])]);
		const brand14 = $brand.get('&');
		const abcObj14 = { a: 'a', b: 'b', c: 'c' };
		const plainObj14 = {
			a: [url14, [0, [brand14, 0]]],
			b: new Set([brand14, new Set([url14, 0])]),
			c: new Map([[0, new Map([[set14, new Int8Array(2)]])]]),
			d: [brand14, new Set([brand14, new Set([new Int8Array(2), 0])])],
			e: [url14, new Map([[set14, new Map([[new Int8Array(2), set14]])]])],
		};
		const result14 = $obj.mergeClonesDeep(abcObj14, plainObj14);
		expect(result14).toStrictEqual(plainObj14);
		expect(result14).not.toBe(plainObj14);
		expect(result14.a).not.toBe(plainObj14.a);
		expect(result14.b).not.toBe(plainObj14.b);
		expect(result14.c).not.toBe(plainObj14.c);
		expect(result14.d).not.toBe(plainObj14.d);
		expect(result14.e).not.toBe(plainObj14.e);

		const url15 = new URL('https://example.com');
		const set15 = new Set([0, new Set([0, 0])]);
		const brand15 = $brand.get('&');
		const abcObj15 = { a: 'a', b: 'b', c: 'c' };
		const plainObj15 = {
			a: [url15, [0, [brand15, 0]]],
			b: new Set([brand15, new Set([url15, 0])]),
			c: new Map([[0, new Map([[set15, new Int8Array(2)]])]]),
			d: [brand15, new Set([brand15, new Set([new Int8Array(2), 0])])],
			e: [url15, new Map([[set15, new Map([[new Int8Array(2), set15]])]])],
			f: { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: { g: 'g', h: 'h', i: 'i' } } },
		};
		expect(
			$obj.mergeClonesDeep(abcObj15, plainObj15, {
				$leave: ['a[0]', 'b', 'd[1]', 'e[2]', 'f.a', 'f.c.e', 'f.c.f.i'],
			}),
		).toStrictEqual({
			a: [url15],
			b: new Set([brand15, new Set([url15, 0])]),
			d: [new Set([brand15, new Set([new Int8Array(2), 0])])],
			e: [],
			f: { a: 'a', c: { e: 'e', f: { i: 'i' } } },
		});
	});
	test('.patchDeep()', async () => {
		expect($obj.patchDeep(null, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(undefined, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(-0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(-1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(-Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep('0', { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(NaN, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(BigInt(0), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(true, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(false, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep([], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(['a', 'b', 'c'], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(new Set(['a', 'b', 'c']), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep(new Map([[0, 0]]), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, null)).toBe(null);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, undefined)).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 0)).toBe(0);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -0)).toBe(-0);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 1)).toBe(1);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -1)).toBe(-1);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, Infinity)).toBe(Infinity);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -Infinity)).toBe(-Infinity);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, '0')).toBe('0');
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, NaN)).toBe(NaN);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, BigInt(0))).toBe(BigInt(0));
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, true)).toBe(true);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, false)).toBe(false);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, [])).toStrictEqual([]);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, ['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Set(['a', 'b', 'c']))).toStrictEqual(new Set(['a', 'b', 'c']));
		expect($obj.patchDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Map([[0, 0]]))).toStrictEqual(new Map([[0, 0]]));

		const abcObj1 = { a: 'a', b: 'b', c: 'c' };
		const defObj1 = { d: 'd', e: 'e', f: 'f' };
		const result1 = $obj.patchDeep(abcObj1, defObj1);
		expect(result1).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' });
		expect(result1).toBe(abcObj1);
		expect(result1).not.toBe(defObj1);
		expect(abcObj1).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' });

		const abcObj2 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj2, { $set: { a: { a: 'a' } } })).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });
		expect(abcObj2).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });

		const abcObj3 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj3, { $unset: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj3).toStrictEqual({ b: 'b', c: 'c' });

		const abcObj4 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj4, { $omit: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj4).toStrictEqual({ b: 'b', c: 'c' });

		const abcObj5 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj5, { $leave: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj5).toStrictEqual({ a: 'a' });

		const abcObj6 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj6, { $pick: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj6).toStrictEqual({ a: 'a' });

		const abcObj7 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj7, { $push: { a: 'a2' } })).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });
		expect(abcObj7).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });

		const abcObj8 = { a: ['a1', 'a2'], b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj8, { $pull: { a: ['a2'] } })).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });
		expect(abcObj8).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj9 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj9, { $concat: { a: ['a2', 'a3'] } })).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });
		expect(abcObj9).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });

		const abcObj10 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj10, { $default: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj10).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });

		const abcObj11 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj11, { $defaults: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj11).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });

		const abcObj12 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.patchDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj12).toStrictEqual({ c: 'c', a: 'a', b: 'b' });

		const abcObj13 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.patchDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj13).toStrictEqual({ c: 'c', a: 'a', b: 'b' });

		const abcObj14 = ['a', 'b', 'c'];
		const defObj14 = ['d', 'e', 'f'];
		const result14 = $obj.patchDeep(abcObj14, defObj14);
		expect(result14).toBe(abcObj14);
		expect(result14).not.toBe(defObj14);
		expect(result14).toStrictEqual(['d', 'e', 'f']);
		expect(abcObj14).toStrictEqual(['d', 'e', 'f']);
		expect(defObj14).toStrictEqual(['d', 'e', 'f']);

		const url15 = new URL('https://example.com');
		const set15 = new Set([0, new Set([0, 0])]);
		const brand15 = $brand.get('&');
		const abcObj15 = { a: 'a', b: 'b', c: 'c' };
		const plainObj15 = {
			a: [url15, [0, [brand15, 0]]],
			b: new Set([brand15, new Set([url15, 0])]),
			c: new Map([[0, new Map([[set15, new Int8Array(2)]])]]),
			d: [brand15, new Set([brand15, new Set([new Int8Array(2), 0])])],
			e: [url15, new Map([[set15, new Map([[new Int8Array(2), set15]])]])],
		};
		const result15 = $obj.patchDeep(abcObj15, plainObj15);
		expect(result15).toStrictEqual(plainObj15);
		expect(result15).toBe(abcObj15);
		expect(result15).not.toBe(plainObj15);
		expect(result15.a).not.toBe(plainObj15.a);
		expect(result15.b).toBe(plainObj15.b);
		expect(result15.c).toBe(plainObj15.c);
		expect(result15.d).not.toBe(plainObj15.d);
		expect(result15.e).not.toBe(plainObj15.e);
	});
	test('.patchClonesDeep()', async () => {
		expect($obj.patchClonesDeep(null, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(undefined, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(-0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(-1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(-Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep('0', { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(NaN, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(BigInt(0), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(true, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(false, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep([], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(['a', 'b', 'c'], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(new Set(['a', 'b', 'c']), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep(new Map([[0, 0]]), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, null)).toBe(null);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, undefined)).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 0)).toBe(0);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -0)).toBe(-0);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 1)).toBe(1);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -1)).toBe(-1);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, Infinity)).toBe(Infinity);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -Infinity)).toBe(-Infinity);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, '0')).toBe('0');
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, NaN)).toBe(NaN);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, BigInt(0))).toBe(BigInt(0));
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, true)).toBe(true);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, false)).toBe(false);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, [])).toStrictEqual([]);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, ['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Set(['a', 'b', 'c']))).toStrictEqual(new Set(['a', 'b', 'c']));
		expect($obj.patchClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Map([[0, 0]]))).toStrictEqual(new Map([[0, 0]]));

		const abcObj1 = { a: 'a', b: 'b', c: 'c' };
		const defObj1 = { d: 'd', e: 'e', f: 'f' };
		const result1 = $obj.patchClonesDeep(abcObj1, defObj1);
		expect(result1).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' });
		expect(result1).toBe(abcObj1);
		expect(result1).not.toBe(defObj1);
		expect(abcObj1).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f' });

		const abcObj2 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj2, { $set: { a: { a: 'a' } } })).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });
		expect(abcObj2).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });

		const abcObj3 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj3, { $unset: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj3).toStrictEqual({ b: 'b', c: 'c' });

		const abcObj4 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj4, { $omit: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj4).toStrictEqual({ b: 'b', c: 'c' });

		const abcObj5 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj5, { $leave: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj5).toStrictEqual({ a: 'a' });

		const abcObj6 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj6, { $pick: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj6).toStrictEqual({ a: 'a' });

		const abcObj7 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj7, { $push: { a: 'a2' } })).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });
		expect(abcObj7).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });

		const abcObj8 = { a: ['a1', 'a2'], b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj8, { $pull: { a: ['a2'] } })).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });
		expect(abcObj8).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj9 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj9, { $concat: { a: ['a2', 'a3'] } })).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });
		expect(abcObj9).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });

		const abcObj10 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj10, { $default: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj10).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });

		const abcObj11 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj11, { $defaults: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj11).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });

		const abcObj12 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.patchClonesDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj12).toStrictEqual({ c: 'c', a: 'a', b: 'b' });

		const abcObj13 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.patchClonesDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.patchClonesDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj13).toStrictEqual({ c: 'c', a: 'a', b: 'b' });

		const abcObj14 = ['a', 'b', 'c'];
		const defObj14 = ['d', 'e', 'f'];
		const result14 = $obj.patchClonesDeep(abcObj14, defObj14);
		expect(result14).toBe(abcObj14);
		expect(result14).not.toBe(defObj14);
		expect(result14).toStrictEqual(['d', 'e', 'f']);
		expect(abcObj14).toStrictEqual(['d', 'e', 'f']);
		expect(defObj14).toStrictEqual(['d', 'e', 'f']);

		const url15 = new URL('https://example.com');
		const set15 = new Set([0, new Set([0, 0])]);
		const brand15 = $brand.get('&');
		const abcObj15 = { a: 'a', b: 'b', c: 'c' };
		const plainObj15 = {
			a: [url15, [0, [brand15, 0]]],
			b: new Set([brand15, new Set([url15, 0])]),
			c: new Map([[0, new Map([[set15, new Int8Array(2)]])]]),
			d: [brand15, new Set([brand15, new Set([new Int8Array(2), 0])])],
			e: [url15, new Map([[set15, new Map([[new Int8Array(2), set15]])]])],
		};
		const result15 = $obj.patchClonesDeep(abcObj15, plainObj15);
		expect(result15).toStrictEqual(plainObj15);
		expect(result15).toBe(abcObj15);
		expect(result15).not.toBe(plainObj15);
		expect(result15.a).not.toBe(plainObj15.a);
		expect(result15.b).not.toBe(plainObj15.b);
		expect(result15.c).not.toBe(plainObj15.c);
		expect(result15.d).not.toBe(plainObj15.d);
		expect(result15.e).not.toBe(plainObj15.e);
	});
	test('.updateDeep()', async () => {
		expect($obj.updateDeep(null, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(undefined, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(-0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(-1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(-Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep('0', { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(NaN, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(BigInt(0), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(true, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(false, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep([], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(['a', 'b', 'c'], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(new Set(['a', 'b', 'c']), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep(new Map([[0, 0]]), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, null)).toBe(null);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, undefined)).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 0)).toBe(0);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -0)).toBe(-0);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 1)).toBe(1);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -1)).toBe(-1);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, Infinity)).toBe(Infinity);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -Infinity)).toBe(-Infinity);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, '0')).toBe('0');
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, NaN)).toBe(NaN);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, BigInt(0))).toBe(BigInt(0));
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, true)).toBe(true);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, false)).toBe(false);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, [])).toStrictEqual([]);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, ['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Set(['a', 'b', 'c']))).toStrictEqual(new Set(['a', 'b', 'c']));
		expect($obj.updateDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Map([[0, 0]]))).toStrictEqual(new Map([[0, 0]]));

		const abcObj1 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj1, { d: 'd' })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });
		expect(abcObj1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj2 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj2, { $set: { a: { a: 'a' } } })).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });
		expect(abcObj2).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj3 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj3, { $unset: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj3).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj4 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj4, { $omit: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj4).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj5 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj5, { $leave: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj5).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj6 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj6, { $pick: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj6).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj7 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj7, { $push: { a: 'a2' } })).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });
		expect(abcObj7).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj8 = { a: ['a1', 'a2'], b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj8, { $pull: { a: ['a2'] } })).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });
		expect(abcObj8).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });

		const abcObj9 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj9, { $concat: { a: ['a2', 'a3'] } })).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });
		expect(abcObj9).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj10 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj10, { $default: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj10).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj11 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj11, { $defaults: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj11).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj12 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.updateDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj12).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj13 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.updateDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj13).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj14 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj14, { a: 'a', b: 'b', c: 'c' })).toBe(abcObj14);
		expect(abcObj14).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj15 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateDeep(abcObj15, {})).toBe(abcObj15);
		expect(abcObj15).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj16 = ['a', 'b', 'c'];
		expect($obj.updateDeep(abcObj16, ['a', 'b', 'c'])).toBe(abcObj16);
		expect(abcObj16).toStrictEqual(['a', 'b', 'c']);

		const abcObj17 = ['a', 'b', 'c'];
		const defObj17 = ['d', 'e', 'f'];
		const result17 = $obj.updateDeep(abcObj17, defObj17);
		expect(result17).not.toBe(abcObj17);
		expect(result17).not.toBe(defObj17);
		expect(result17).toStrictEqual(['d', 'e', 'f']);
		expect(abcObj17).toStrictEqual(['a', 'b', 'c']);
		expect(defObj17).toStrictEqual(['d', 'e', 'f']);

		const abcSet18 = new Set(['a', 'b', 'c']);
		const abcObj18 = { a: 'a', b: 'b', c: 'c' };
		const result18 = $obj.updateDeep(abcSet18, abcObj18);
		expect(result18).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect(result18).not.toBe(abcSet18);
		expect(result18).not.toBe(abcObj18);
		expect(abcSet18).toStrictEqual(new Set(['a', 'b', 'c']));
		expect(abcObj18).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcSet19 = new Set(['a', 'b', 'c']);
		const abcObj19 = new Map(Object.entries({ a: 'a', b: 'b', c: 'c' }));
		const result19 = $obj.updateDeep(abcSet19, abcObj19);
		expect(result19).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
		expect(result19).not.toBe(abcSet19);
		expect(result19).not.toBe(abcObj19);
		expect(abcSet19).toStrictEqual(new Set(['a', 'b', 'c']));
		expect(abcObj19).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));

		const abcMap20 = new Map(Object.entries({ a: 'a', b: 'b', c: 'c' }));
		const abcObj20 = new Map(Object.entries({ a: 'a', b: 'b', c: 'c' }));
		const result20 = $obj.updateDeep(abcMap20, abcObj20);
		expect(result20).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
		expect(result20).toBe(abcMap20);
		expect(result20).not.toBe(abcObj20);
		expect(abcMap20).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
		expect(abcObj20).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
	});
	test('.updateClonesDeep()', async () => {
		expect($obj.updateClonesDeep(null, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(undefined, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(-0, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(-1, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(-Infinity, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep('0', { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(NaN, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(BigInt(0), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(true, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(false, { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep([], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(['a', 'b', 'c'], { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(new Set(['a', 'b', 'c']), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep(new Map([[0, 0]]), { a: 'a' }, { b: 'b' }, { c: 'c' })).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, null)).toBe(null);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, undefined)).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 0)).toBe(0);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -0)).toBe(-0);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, 1)).toBe(1);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -1)).toBe(-1);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, Infinity)).toBe(Infinity);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, -Infinity)).toBe(-Infinity);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, '0')).toBe('0');
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, NaN)).toBe(NaN);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, BigInt(0))).toBe(BigInt(0));
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, true)).toBe(true);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, false)).toBe(false);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, [])).toStrictEqual([]);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, ['a', 'b', 'c'])).toStrictEqual(['a', 'b', 'c']);
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Set(['a', 'b', 'c']))).toStrictEqual(new Set(['a', 'b', 'c']));
		expect($obj.updateClonesDeep({ a: 'a' }, { b: 'b' }, { c: 'c' }, new Map([[0, 0]]))).toStrictEqual(new Map([[0, 0]]));

		const abcObj1 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj1, { d: 'd' })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });
		expect(abcObj1).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj2 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj2, { $set: { a: { a: 'a' } } })).toStrictEqual({ a: { a: 'a' }, b: 'b', c: 'c' });
		expect(abcObj2).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj3 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj3, { $unset: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj3).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj4 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj4, { $omit: ['a'] })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcObj4).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj5 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj5, { $leave: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj5).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj6 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj6, { $pick: ['a'] })).toStrictEqual({ a: 'a' });
		expect(abcObj6).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj7 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj7, { $push: { a: 'a2' } })).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });
		expect(abcObj7).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj8 = { a: ['a1', 'a2'], b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj8, { $pull: { a: ['a2'] } })).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });
		expect(abcObj8).toStrictEqual({ a: ['a1', 'a2'], b: 'b', c: 'c' });

		const abcObj9 = { a: ['a1'], b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj9, { $concat: { a: ['a2', 'a3'] } })).toStrictEqual({ a: ['a1', 'a2', 'a3'], b: 'b', c: 'c' });
		expect(abcObj9).toStrictEqual({ a: ['a1'], b: 'b', c: 'c' });

		const abcObj10 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj10, { $default: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj10).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj11 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj11, { $defaults: { a: 'a!', d: 'd!' } })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd!' });
		expect(abcObj11).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj12 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.updateClonesDeep(abcObj12, { $keySortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj12).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj13 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] })).toStrictEqual({ c: 'c', a: 'a', b: 'b' });
		expect(Object.keys($obj.updateClonesDeep(abcObj13, { $propSortOrder: ['c', 'a', 'b'] }))).toStrictEqual(['c', 'a', 'b']);
		expect(abcObj13).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj14 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj14, { a: 'a', b: 'b', c: 'c' })).toBe(abcObj14);
		expect(abcObj14).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj15 = { a: 'a', b: 'b', c: 'c' };
		expect($obj.updateClonesDeep(abcObj15, {})).toBe(abcObj15);
		expect(abcObj15).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcObj16 = ['a', 'b', 'c'];
		expect($obj.updateClonesDeep(abcObj16, ['a', 'b', 'c'])).toBe(abcObj16);
		expect(abcObj16).toStrictEqual(['a', 'b', 'c']);

		const abcObj17 = ['a', 'b', 'c'];
		const defObj17 = ['d', 'e', 'f'];
		const result17 = $obj.updateClonesDeep(abcObj17, defObj17);
		expect(result17).not.toBe(abcObj17);
		expect(result17).not.toBe(defObj17);
		expect(result17).toStrictEqual(['d', 'e', 'f']);
		expect(abcObj17).toStrictEqual(['a', 'b', 'c']);
		expect(defObj17).toStrictEqual(['d', 'e', 'f']);

		const abcSet18 = new Set(['a', 'b', 'c']);
		const abcObj18 = { a: 'a', b: 'b', c: 'c' };
		const result18 = $obj.updateClonesDeep(abcSet18, abcObj18);
		expect(result18).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
		expect(result18).not.toBe(abcSet18);
		expect(result18).not.toBe(abcObj18);
		expect(abcSet18).toStrictEqual(new Set(['a', 'b', 'c']));
		expect(abcObj18).toStrictEqual({ a: 'a', b: 'b', c: 'c' });

		const abcSet19 = new Set(['a', 'b', 'c']);
		const abcObj19 = new Map(Object.entries({ a: 'a', b: 'b', c: 'c' }));
		const result19 = $obj.updateClonesDeep(abcSet19, abcObj19);
		expect(result19).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
		expect(result19).not.toBe(abcSet19);
		expect(result19).not.toBe(abcObj19);
		expect(abcSet19).toStrictEqual(new Set(['a', 'b', 'c']));
		expect(abcObj19).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));

		const abcMap20 = new Map(Object.entries({ a: 'a', b: 'b', c: 'c' }));
		const abcObj20 = new Map(Object.entries({ a: 'a', b: 'b', c: 'c' }));
		const result20 = $obj.updateClonesDeep(abcMap20, abcObj20);
		expect(result20).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
		expect(result20).toBe(abcMap20);
		expect(result20).not.toBe(abcObj20);
		expect(abcMap20).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
		expect(abcObj20).toStrictEqual(new Map(Object.entries({ a: 'a', b: 'b', c: 'c' })));
	});
	test('.map()', async () => {
		const abcdObj = { a: ' a ', b: ' b', c: 'c ' };
		Object.defineProperty(abcdObj, 'd', { value: ' d ', enumerable: true, writable: false });

		// Note: `byReference` defaults to `false` when mapping.
		// Note: `skipReadonly` defaults to `true` when mapping.

		// `d` is not skipped, because we're operating on a clone (i.e., not `byReference`), so it’s writable in this case.
		expect($obj.map(abcdObj, (v) => (v as string).trim())).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });
		expect(abcdObj).toStrictEqual({ a: ' a ', b: ' b', c: 'c ', d: ' d ' });

		// `d` is skipped, because we're not operating on a clone (i.e., is `byReference`), so it’s not writable in this case.
		expect($obj.map(abcdObj, (v) => (v as string).trim(), { byReference: true })).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: ' d ' });
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: ' d ' });

		// Tests mapping of an array.
		const abcdArray1 = [' a ', ' b', 'c ', 'd'];
		expect($obj.map(abcdArray1, (v) => (v as string).trim())).toStrictEqual(['a', 'b', 'c', 'd']);
		expect(abcdArray1).toStrictEqual([' a ', ' b', 'c ', 'd']);

		// Tests mapping of an array, by reference.
		const abcdArray2 = [' a ', ' b', 'c ', 'd'];
		expect($obj.map(abcdArray2, (v) => (v as string).trim(), { byReference: true })).toStrictEqual(['a', 'b', 'c', 'd']);
		expect(abcdArray2).toStrictEqual(['a', 'b', 'c', 'd']);

		// Tests mapping of a set.
		const abcdSet3 = new Set([' a ', ' b', 'c ', 'd']);
		expect($obj.map(abcdSet3, (v) => (v as string).trim())).toStrictEqual(new Set(['a', 'b', 'c', 'd']));
		expect(abcdSet3).toStrictEqual(new Set([' a ', ' b', 'c ', 'd']));

		// Tests mapping of a set, by reference.
		const abcdSet4 = new Set([' a ', ' b', 'c ', 'd']);
		expect($obj.map(abcdSet4, (v) => (v as string).trim(), { byReference: true })).toStrictEqual(new Set(['a', 'b', 'c', 'd']));
		expect(abcdSet4).toStrictEqual(new Set(['a', 'b', 'c', 'd']));

		// Tests mapping of a map.
		const abcdMap5 = new Map([
			['a', ' a '],
			['b', ' b'],
			['c', 'c '],
			['d', 'd'],
		]);
		expect($obj.map(abcdMap5, (v) => (v as string).trim())).toStrictEqual(
			new Map([
				['a', 'a'],
				['b', 'b'],
				['c', 'c'],
				['d', 'd'],
			]),
		);
		expect(abcdMap5).toStrictEqual(
			new Map([
				['a', ' a '],
				['b', ' b'],
				['c', 'c '],
				['d', 'd'],
			]),
		);

		// Tests mapping of a map, by reference.
		const abcdMap6 = new Map([
			['a', ' a '],
			['b', ' b'],
			['c', 'c '],
			['d', 'd'],
		]);
		expect($obj.map(abcdMap6, (v) => (v as string).trim(), { byReference: true })).toStrictEqual(
			new Map([
				['a', 'a'],
				['b', 'b'],
				['c', 'c'],
				['d', 'd'],
			]),
		);
		expect(abcdMap6).toStrictEqual(
			new Map([
				['a', 'a'],
				['b', 'b'],
				['c', 'c'],
				['d', 'd'],
			]),
		);
	});
	test('.omit()', async () => {
		const abcdObj = { a: 'a', b: 'b', c: 'c' };
		Object.defineProperty(abcdObj, 'd', { value: 'd', enumerable: true, writable: false });

		// Note: `byReference` defaults to `false` when omitting.
		// Note: `skipReadonly` defaults to `false` when omitting.

		// `d` is not skipped, because we're operating on a clone (i.e., not `byReference`), so it’s writable in this case.
		expect($obj.omit(abcdObj, ['a', 'd'])).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });

		// `d` is not skipped, because we're not operating on a clone (i.e., is `byReference` and not `skipReadonly`), so it’s not writable in this case.
		expect(() => $obj.omit(abcdObj, ['a', 'd'], { byReference: true })).toThrowError(); // Throws error as expected, because key is not writable.
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' }); // Nothing unset before error thrown, because deletions occur in reverse key order.

		// `d` is skipped, because we're not operating on a clone (i.e., is `byReference` and is `skipReadonly`), so it’s not writable in this case.
		expect($obj.omit(abcdObj, ['b', 'd'], { byReference: true, skipReadonly: true })).toStrictEqual({ a: 'a', c: 'c', d: 'd' });
		expect(abcdObj).toStrictEqual({ a: 'a', c: 'c', d: 'd' });

		// Tests the deletion of multiple keys across various data types.
		expect($obj.omit(['a', 'b', 'c', 'd'], [1, 2])).toStrictEqual(['a', 'd']);
		expect($obj.omit(new Set(['a', 'b', 'c', 'd']), ['b', 'c'])).toStrictEqual(new Set(['a', 'd']));
		expect($obj.omit({ a: 'a', b: 'b', c: 'c', d: 'd' }, ['b', 'c'])).toStrictEqual({ a: 'a', d: 'd' });
		expect(
			$obj.omit(
				new Map([
					['a', 'a'],
					['b', 'b'],
					['c', 'c'],
					['d', 'd'],
					['e', 'e'],
				]),
				['c', 'b', 'e'],
			),
		).toStrictEqual(
			new Map([
				['a', 'a'],
				['d', 'd'],
			]),
		);
	});
	test('.unset()', async () => {
		const abcdObj = { a: 'a', b: 'b', c: 'c' };
		Object.defineProperty(abcdObj, 'd', { value: 'd', enumerable: true, writable: false });

		// Note: `byReference` defaults to `true` when unsetting.
		// Note: `skipReadonly` defaults to `false` when unsetting.

		// `d` is not skipped, because we're operating on a clone (i.e., not `byReference`), so it’s writable in this case.
		expect($obj.unset(abcdObj, ['a', 'd'], { byReference: false })).toStrictEqual({ b: 'b', c: 'c' });
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });

		// `d` is not skipped, because we're not operating on a clone (i.e., is `byReference` and not `skipReadonly`), so it’s not writable in this case.
		expect(() => $obj.unset(abcdObj, ['a', 'd'])).toThrowError(); // Throws error as expected, because key is not writable.
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' }); // Nothing unset before error thrown, because deletions occur in reverse key order.

		// `d` is skipped, because we're not operating on a clone (i.e., is `byReference` and is `skipReadonly`), so it’s not writable in this case.
		expect($obj.unset(abcdObj, ['b', 'd'], { skipReadonly: true })).toStrictEqual({ a: 'a', c: 'c', d: 'd' });
		expect(abcdObj).toStrictEqual({ a: 'a', c: 'c', d: 'd' });

		// Tests the deletion of multiple keys across various data types.
		expect($obj.unset(['a', 'b', 'c', 'd'], [1, 2])).toStrictEqual(['a', 'd']);
		expect($obj.unset(new Set(['a', 'b', 'c', 'd']), ['b', 'c'])).toStrictEqual(new Set(['a', 'd']));
		expect($obj.unset({ a: 'a', b: 'b', c: 'c', d: 'd' }, ['b', 'c'])).toStrictEqual({ a: 'a', d: 'd' });
		expect(
			$obj.unset(
				new Map([
					['a', 'a'],
					['b', 'b'],
					['c', 'c'],
					['d', 'd'],
					['e', 'e'],
				]),
				['c', 'b', 'e'],
			),
		).toStrictEqual(
			new Map([
				['a', 'a'],
				['d', 'd'],
			]),
		);
	});
	test('.pick()', async () => {
		const abcdObj = { a: 'a', b: 'b', c: 'c' };
		Object.defineProperty(abcdObj, 'd', { value: 'd', enumerable: true, writable: false });

		// Note: `byReference` defaults to `false` when picking.
		// Note: `skipReadonly` defaults to `false` when picking.

		// `d` is not skipped, because we're operating on a clone (i.e., not `byReference`), so it’s writable in this case.
		expect($obj.pick(abcdObj, ['a', 'b'])).toStrictEqual({ a: 'a', b: 'b' });
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });

		// `d` is not skipped, because we're not operating on a clone (i.e., is `byReference` and not `skipReadonly`), so it’s not writable in this case.
		expect(() => $obj.pick(abcdObj, ['a', 'b'], { byReference: true })).toThrowError(); // Throws error as expected, because key is not writable.
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' }); // Nothing unset before error thrown, because deletions occur in reverse key order.

		// `d` is skipped, because we're not operating on a clone (i.e., is `byReference` and is `skipReadonly`), so it’s not writable in this case.
		expect($obj.pick(abcdObj, ['a'], { byReference: true, skipReadonly: true })).toStrictEqual({ a: 'a', d: 'd' });
		expect(abcdObj).toStrictEqual({ a: 'a', d: 'd' });

		// Tests the deletion of multiple keys across various data types.
		expect($obj.pick(['a', 'b', 'c', 'd'], [1, 2])).toStrictEqual(['b', 'c']);
		expect($obj.pick(new Set(['a', 'b', 'c', 'd']), ['b', 'c'])).toStrictEqual(new Set(['b', 'c']));
		expect($obj.pick({ a: 'a', b: 'b', c: 'c', d: 'd' }, ['b', 'c'])).toStrictEqual({ b: 'b', c: 'c' });
		expect(
			$obj.pick(
				new Map([
					['a', 'a'],
					['b', 'b'],
					['c', 'c'],
					['d', 'd'],
					['e', 'e'],
				]),
				['c', 'b', 'e'],
			),
		).toStrictEqual(
			new Map([
				['b', 'b'],
				['c', 'c'],
				['e', 'e'],
			]),
		);
	});
	test('.leave()', async () => {
		const abcdObj = { a: 'a', b: 'b', c: 'c' };
		Object.defineProperty(abcdObj, 'd', { value: 'd', enumerable: true, writable: false });

		// Note: `byReference` defaults to `true` when leaving.
		// Note: `skipReadonly` defaults to `false` when leaving.

		// `d` is not skipped, because we're operating on a clone (i.e., not `byReference`), so it’s writable in this case.
		expect($obj.leave(abcdObj, ['a', 'b'], { byReference: false })).toStrictEqual({ a: 'a', b: 'b' });
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' });

		// `d` is not skipped, because we're not operating on a clone (i.e., is `byReference` and not `skipReadonly`), so it’s not writable in this case.
		expect(() => $obj.leave(abcdObj, ['a', 'b'])).toThrowError(); // Throws error as expected, because key is not writable.
		expect(abcdObj).toStrictEqual({ a: 'a', b: 'b', c: 'c', d: 'd' }); // Nothing unset before error thrown, because deletions occur in reverse key order.

		// `d` is skipped, because we're not operating on a clone (i.e., is `byReference` and is `skipReadonly`), so it’s not writable in this case.
		expect($obj.leave(abcdObj, ['a'], { skipReadonly: true })).toStrictEqual({ a: 'a', d: 'd' });
		expect(abcdObj).toStrictEqual({ a: 'a', d: 'd' });

		// Tests the deletion of multiple keys across various data types.
		expect($obj.leave(['a', 'b', 'c', 'd'], [1, 2])).toStrictEqual(['b', 'c']);
		expect($obj.leave(new Set(['a', 'b', 'c', 'd']), ['b', 'c'])).toStrictEqual(new Set(['b', 'c']));
		expect($obj.leave({ a: 'a', b: 'b', c: 'c', d: 'd' }, ['b', 'c'])).toStrictEqual({ b: 'b', c: 'c' });
		expect(
			$obj.leave(
				new Map([
					['a', 'a'],
					['b', 'b'],
					['c', 'c'],
					['d', 'd'],
					['e', 'e'],
				]),
				['c', 'b', 'e'],
			),
		).toStrictEqual(
			new Map([
				['b', 'b'],
				['c', 'c'],
				['e', 'e'],
			]),
		);
	});
});
