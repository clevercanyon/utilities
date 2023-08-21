/**
 * Test suite.
 */

import type * as $type from '../type.js';
import { $moize, $obj } from '../index.js';
import { describe, test, expect } from 'vitest';

describe('$moize tests', async () => {
	$moize.$.collectStats();

	test('$moize.svz()', async () => {
		$moize.$.clearStats();
		const fn1 = $moize.svz({ maxSize: 10 })(() => true);
		expect(fn1()).toBe(true);
		expect(fn1()).toBe(true);
		expect(fn1.getStats()).toMatchObject({ calls: 2, hits: 1 });

		$moize.$.clearStats();
		const fn2 = $moize.svz({ maxSize: 10 })((a: string, b: string, c: string) => a + b + c);
		expect(fn2('a', 'b', 'c')).toBe('abc');
		expect(fn2('b', 'a', 'c')).toBe('bac');
		expect(fn2('a', 'b', 'c')).toBe('abc');
		expect(fn2.getStats()).toMatchObject({ calls: 3, hits: 1 });
	});
	test('$moize.svzAsync()', async () => {
		$moize.$.clearStats();
		const fn1 = $moize.svzAsync({ maxSize: 10 })(async () => true);
		expect(await fn1()).toBe(true);
		expect(await fn1()).toBe(true);
		expect(fn1.getStats()).toMatchObject({ calls: 3, hits: 2 });

		$moize.$.clearStats();
		const fn2 = $moize.svzAsync({ maxSize: 10 })(async (a: string, b: string, c: string) => a + b + c);
		expect(await fn2('a', 'b', 'c')).toBe('abc');
		expect(await fn2('b', 'a', 'c')).toBe('bac');
		expect(await fn2('a', 'b', 'c')).toBe('abc');
		expect(fn2.getStats()).toMatchObject({ calls: 5, hits: 3 });
	});
	test('$moize.shallow()', async () => {
		$moize.$.clearStats();
		const fn1 = $moize.shallow({ maxSize: 10 })(() => true);
		expect(fn1()).toBe(true);
		expect(fn1()).toBe(true);
		expect(fn1.getStats()).toMatchObject({ calls: 2, hits: 1 });

		$moize.$.clearStats();
		const fn2 = $moize.shallow({ maxSize: 10 })((a: string[], b: string[], c: string[]) => a.concat(b).concat(c).flat().join(''));
		expect(fn2(['a'], ['b'], ['c'])).toBe('abc');
		expect(fn2(['b'], ['a'], ['c'])).toBe('bac');
		expect(fn2(['a'], ['b'], ['c'])).toBe('abc');
		expect(fn2.getStats()).toMatchObject({ calls: 3, hits: 1 });
	});
	test('$moize.shallowAsync()', async () => {
		$moize.$.clearStats();
		const fn1 = $moize.shallowAsync({ maxSize: 10 })(async () => true);
		expect(await fn1()).toBe(true);
		expect(await fn1()).toBe(true);
		expect(fn1.getStats()).toMatchObject({ calls: 3, hits: 2 });

		$moize.$.clearStats();
		const fn2 = $moize.shallowAsync({ maxSize: 10 })(async (a: string[], b: string[], c: string[]) => a.concat(b).concat(c).flat().join(''));
		expect(await fn2(['a'], ['b'], ['c'])).toBe('abc');
		expect(await fn2(['b'], ['a'], ['c'])).toBe('bac');
		expect(await fn2(['a'], ['b'], ['c'])).toBe('abc');
		expect(fn2.getStats()).toMatchObject({ calls: 5, hits: 3 });
	});
	test('$moize.deep()', async () => {
		$moize.$.clearStats();
		const fn1 = $moize.deep({ maxSize: 10 })(() => true);
		expect(fn1()).toBe(true);
		expect(fn1()).toBe(true);
		expect(fn1.getStats()).toMatchObject({ calls: 2, hits: 1 });

		$moize.$.clearStats();
		const fn2 = $moize.deep({ maxSize: 10 })((a: $type.Object, b: $type.Object, c: $type.Object) => $obj.mergeDeep(a, b, c));
		expect(fn2({ a: 'a' }, { b: 'b' }, { c: { a: { b: { c: 'c' } } } })).toStrictEqual({ a: 'a', b: 'b', c: { a: { b: { c: 'c' } } } });
		expect(fn2({ b: 'b' }, { a: 'a' }, { c: { a: { b: { c: 'c' } } } })).toStrictEqual({ b: 'b', a: 'a', c: { a: { b: { c: 'c' } } } });
		expect(fn2({ a: 'a' }, { b: 'b' }, { c: { a: { b: { c: 'c' } } } })).toStrictEqual({ a: 'a', b: 'b', c: { a: { b: { c: 'c' } } } });
		expect(fn2.getStats()).toMatchObject({ calls: 3, hits: 1 });
	});
	test('$moize.deepAsync()', async () => {
		$moize.$.clearStats();
		const fn1 = $moize.deepAsync({ maxSize: 10 })(async () => true);
		expect(await fn1()).toBe(true);
		expect(await fn1()).toBe(true);
		expect(fn1.getStats()).toMatchObject({ calls: 3, hits: 2 });

		$moize.$.clearStats();
		const fn2 = $moize.deepAsync({ maxSize: 10 })(async (a: $type.Object, b: $type.Object, c: $type.Object) => $obj.mergeDeep(a, b, c));
		expect(await fn2({ a: 'a' }, { b: 'b' }, { c: { a: { b: { c: 'c' } } } })).toStrictEqual({ a: 'a', b: 'b', c: { a: { b: { c: 'c' } } } });
		expect(await fn2({ b: 'b' }, { a: 'a' }, { c: { a: { b: { c: 'c' } } } })).toStrictEqual({ b: 'b', a: 'a', c: { a: { b: { c: 'c' } } } });
		expect(await fn2({ a: 'a' }, { b: 'b' }, { c: { a: { b: { c: 'c' } } } })).toStrictEqual({ a: 'a', b: 'b', c: { a: { b: { c: 'c' } } } });
		expect(fn2.getStats()).toMatchObject({ calls: 5, hits: 3 });
	});
});
