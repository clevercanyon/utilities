/**
 * Test suite.
 */

import { $obp } from '../../index.js';
import { describe, test, expect } from 'vitest';

describe('$obp', async () => {
	test('.has()', async () => {
		const abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		const abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };

		expect($obp.has(abcArr, 0)).toBe(true);
		expect($obp.has(abcArr, 1)).toBe(true);
		expect($obp.has(abcArr, 100)).toBe(false);

		expect($obp.has(abcObj, 'a')).toBe(true);
		expect($obp.has(abcObj, 'c.f')).toBe(true);
		expect($obp.has(abcObj, 'c.f[0]')).toBe(true);
		expect($obp.has(abcObj, 'c.f[0].i')).toBe(true);
		expect($obp.has(abcObj, 'c.f[0].i[0]')).toBe(true);

		expect($obp.has(abcObj, 'a', 'ꓺ')).toBe(true);
		expect($obp.has(abcObj, 'cꓺf', 'ꓺ')).toBe(true);
		expect($obp.has(abcObj, 'cꓺf[0]', 'ꓺ')).toBe(true);
		expect($obp.has(abcObj, 'cꓺf[0]ꓺi', 'ꓺ')).toBe(true);
		expect($obp.has(abcObj, 'cꓺf[0]ꓺi[0]', 'ꓺ')).toBe(true);
	});
	test('.get()', async () => {
		const abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		const abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };

		expect($obp.get(abcArr, 0)).toBe('a');
		expect($obp.get(abcArr, 1)).toBe('b');
		expect($obp.get(abcArr, 100)).toBe(undefined);
		expect($obp.get(abcArr, 100, null)).toBe(null);

		expect($obp.get(abcObj, 'a')).toBe('a');
		expect($obp.get(abcObj, 'c.f')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);
		expect($obp.get(abcObj, 'c.f[0]')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });
		expect($obp.get(abcObj, 'c.f[0].i')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'c.f[0].i[0]')).toBe('j');

		expect($obp.get(abcObj, 'c.f[0].i[1]')).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0].i[1]', '')).toBe('');

		expect($obp.get(abcObj, 'a', undefined, 'ꓺ')).toBe('a');
		expect($obp.get(abcObj, 'cꓺf', undefined, 'ꓺ')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);
		expect($obp.get(abcObj, 'cꓺf[0]', undefined, 'ꓺ')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi', undefined, 'ꓺ')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[0]', undefined, 'ꓺ')).toBe('j');

		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[1]', undefined, 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[1]', '', 'ꓺ')).toBe('');
	});
	test('.set()', async () => {
		let abcArr = [];
		let abcObj = {};

		abcArr = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];
		expect($obp.set(abcArr, 0, 'a')).toBe(undefined);
		expect($obp.get(abcArr, 0)).toBe('a');

		abcArr = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];
		expect($obp.set(abcArr, 1, 'b')).toBe(undefined);
		expect($obp.get(abcArr, 1)).toBe('b');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'a', 'a')).toBe(undefined);
		expect($obp.get(abcObj, 'a')).toBe('a');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'c.f', [{ g: 'g', h: 'h', i: ['j'] }])).toBe(undefined);
		expect($obp.get(abcObj, 'c.f')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'c.f[0]', { g: 'g', h: 'h', i: ['j'] })).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0]')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'c.f[0].i', ['j'])).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0].i')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'c.f[0].i[0]')).toBe('j');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'a', 'a', 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'a', undefined, 'ꓺ')).toBe('a');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'cꓺf', [{ g: 'g', h: 'h', i: ['j'] }], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf', undefined, 'ꓺ')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'cꓺf[0]', { g: 'g', h: 'h', i: ['j'] }, 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]', undefined, 'ꓺ')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.set(abcObj, 'cꓺf[0]ꓺi', ['j'], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi', undefined, 'ꓺ')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[0]', undefined, 'ꓺ')).toBe('j');
	});
	test('.defaultTo()', async () => {
		let abcArr = [];
		let abcObj = {};

		abcArr = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];
		expect($obp.defaultTo(abcArr, 0, 'a')).toBe(undefined);
		expect($obp.get(abcArr, 0)).toBe('x');

		abcArr = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];
		expect($obp.defaultTo(abcArr, 1, 'b')).toBe(undefined);
		expect($obp.get(abcArr, 1)).toBe('x');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'a', 'a')).toBe(undefined);
		expect($obp.get(abcObj, 'a')).toBe('x');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'c.f', [{ g: 'g', h: 'h', i: ['j'] }])).toBe(undefined);
		expect($obp.get(abcObj, 'c.f')).toStrictEqual([{ g: 'x', h: 'x', i: ['x'] }]);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'c.f[0]', { g: 'g', h: 'h', i: ['j'] })).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0]')).toStrictEqual({ g: 'x', h: 'x', i: ['x'] });

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'c.f[0].i', ['j'])).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0].i')).toStrictEqual(['x']);
		expect($obp.get(abcObj, 'c.f[0].i[0]')).toBe('x');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'a', 'a', 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'a', undefined, 'ꓺ')).toBe('x');

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'cꓺf', [{ g: 'g', h: 'h', i: ['j'] }], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf', undefined, 'ꓺ')).toStrictEqual([{ g: 'x', h: 'x', i: ['x'] }]);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'cꓺf[0]', { g: 'g', h: 'h', i: ['j'] }, 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]', undefined, 'ꓺ')).toStrictEqual({ g: 'x', h: 'x', i: ['x'] });

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.defaultTo(abcObj, 'cꓺf[0]ꓺi', ['j'], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi', undefined, 'ꓺ')).toStrictEqual(['x']);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[0]', undefined, 'ꓺ')).toBe('x');
	});
	test('.unset()', async () => {
		let abcArr = [];
		let abcObj = {};

		abcArr = ['x'];
		expect($obp.unset(abcArr, 0)).toBe(undefined);
		expect($obp.get(abcArr, 0)).toBe(undefined);

		abcArr = ['x', 'x'];
		expect($obp.unset(abcArr, 1)).toBe(undefined);
		expect($obp.get(abcArr, 1)).toBe(undefined);

		abcArr = ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'];
		expect($obp.unset(abcArr, '*')).toBe(undefined);
		expect($obp.get(abcArr, 0)).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'a')).toBe(undefined);
		expect($obp.get(abcObj, 'a')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, '*')).toBe(undefined);
		expect($obp.get(abcObj, 'a')).toBe(undefined);
		expect($obp.get(abcObj, 'b')).toBe(undefined);
		expect($obp.get(abcObj, 'c')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'c.f')).toBe(undefined);
		expect($obp.get(abcObj, 'c.f')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'c.f[0]')).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0]')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'c.f[0].i')).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0].i')).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0].i[0]')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'a', 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'a', undefined, 'ꓺ')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'cꓺf', 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf', undefined, 'ꓺ')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'cꓺf[0]', 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]', undefined, 'ꓺ')).toBe(undefined);

		abcObj = { a: 'x', b: 'x', c: { d: 'x', e: 'x', f: [{ g: 'x', h: 'x', i: ['x'] }] } };
		expect($obp.unset(abcObj, 'cꓺf[0]ꓺi', 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi', undefined, 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[0]', undefined, 'ꓺ')).toBe(undefined);
	});
	test('.leave()', async () => {
		let abcArr = [];
		let abcObj = {};

		abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		expect($obp.leave(abcArr, [0])).toBe(undefined);
		expect($obp.get(abcArr, 0)).toBe('a');
		expect($obp.get(abcArr, 1)).toBe(undefined);

		abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		expect($obp.leave(abcArr, [1])).toBe(undefined);
		expect($obp.get(abcArr, 0)).toBe('b');
		expect($obp.get(abcArr, 1)).toBe(undefined);

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['a', 'b'])).toBe(undefined);
		expect($obp.get(abcObj, 'a')).toBe('a');
		expect($obp.get(abcObj, 'b')).toBe('b');
		expect($obp.get(abcObj, 'c')).toBe(undefined);

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['c.f'])).toBe(undefined);
		expect($obp.get(abcObj, 'a')).toBe(undefined);
		expect($obp.get(abcObj, 'b')).toBe(undefined);
		expect($obp.get(abcObj, 'c.d')).toBe(undefined);
		expect($obp.get(abcObj, 'c.e')).toBe(undefined);
		expect($obp.get(abcObj, 'c.f')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);
		expect($obp.get(abcObj, 'c')).toStrictEqual({ f: [{ g: 'g', h: 'h', i: ['j'] }] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['c.f[0]'])).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0]')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['c.f[0].i'])).toBe(undefined);
		expect($obp.get(abcObj, 'c.f[0].i')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'c.f[0].i[0]')).toBe('j');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['a'], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'a', undefined, 'ꓺ')).toBe('a');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['cꓺf'], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf', undefined, 'ꓺ')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['cꓺf[0]'], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]', undefined, 'ꓺ')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.leave(abcObj, ['cꓺf[0]ꓺi'], 'ꓺ')).toBe(undefined);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi', undefined, 'ꓺ')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[0]', undefined, 'ꓺ')).toBe('j');
	});
	test('.omit()', async () => {
		let abcArr = [];
		let abcObj = {};

		abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		expect($obp.omit(abcArr, [0])).toStrictEqual(['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
		expect($obp.get(abcArr, 0)).toBe('a');
		expect($obp.get(abcArr, 1)).toBe('b');

		abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		expect($obp.omit(abcArr, [1])).toStrictEqual(['a', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']);
		expect($obp.get(abcArr, 0)).toBe('a');
		expect($obp.get(abcArr, 1)).toBe('b');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['a', 'b'])).toStrictEqual({ c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } });
		expect($obp.get(abcObj, 'a')).toBe('a');
		expect($obp.get(abcObj, 'b')).toBe('b');
		expect($obp.get(abcObj, 'c')).toStrictEqual({ d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['c.f'])).toStrictEqual({ a: 'a', b: 'b', c: { d: 'd', e: 'e' } });
		expect($obp.get(abcObj, 'a')).toBe('a');
		expect($obp.get(abcObj, 'b')).toBe('b');
		expect($obp.get(abcObj, 'c.d')).toBe('d');
		expect($obp.get(abcObj, 'c.e')).toBe('e');
		expect($obp.get(abcObj, 'c.f')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);
		expect($obp.get(abcObj, 'c')).toStrictEqual({ d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['c.f[0]'])).toStrictEqual({ a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [] } });
		expect($obp.get(abcObj, 'c.f[0]')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['c.f[0].i'])).toStrictEqual({ a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h' }] } });
		expect($obp.get(abcObj, 'c.f[0].i')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'c.f[0].i[0]')).toBe('j');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['a'], 'ꓺ')).toStrictEqual({ b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } });
		expect($obp.get(abcObj, 'a', undefined, 'ꓺ')).toBe('a');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['cꓺf'], 'ꓺ')).toStrictEqual({ a: 'a', b: 'b', c: { d: 'd', e: 'e' } });
		expect($obp.get(abcObj, 'cꓺf', undefined, 'ꓺ')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['cꓺf[0]'], 'ꓺ')).toStrictEqual({ a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [] } });
		expect($obp.get(abcObj, 'cꓺf[0]', undefined, 'ꓺ')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.omit(abcObj, ['cꓺf[0]ꓺi'], 'ꓺ')).toStrictEqual({ a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h' }] } });
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi', undefined, 'ꓺ')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[0]', undefined, 'ꓺ')).toBe('j');
	});
	test('.pick()', async () => {
		let abcArr = [];
		let abcObj = {};

		abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		expect($obp.pick(abcArr, [0])).toStrictEqual(['a']);
		expect($obp.get(abcArr, 0)).toBe('a');
		expect($obp.get(abcArr, 1)).toBe('b');

		abcArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
		expect($obp.pick(abcArr, [1])).toStrictEqual(['b']);
		expect($obp.get(abcArr, 0)).toBe('a');
		expect($obp.get(abcArr, 1)).toBe('b');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['a', 'b'])).toStrictEqual({ a: 'a', b: 'b' });
		expect($obp.get(abcObj, 'a')).toBe('a');
		expect($obp.get(abcObj, 'b')).toBe('b');
		expect($obp.get(abcObj, 'c')).toStrictEqual({ d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['c.f'])).toStrictEqual({ c: { f: [{ g: 'g', h: 'h', i: ['j'] }] } });
		expect($obp.get(abcObj, 'a')).toBe('a');
		expect($obp.get(abcObj, 'b')).toBe('b');
		expect($obp.get(abcObj, 'c.d')).toBe('d');
		expect($obp.get(abcObj, 'c.e')).toBe('e');
		expect($obp.get(abcObj, 'c.f')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);
		expect($obp.get(abcObj, 'c')).toStrictEqual({ d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['c.f[0]'])).toStrictEqual({ c: { f: [{ g: 'g', h: 'h', i: ['j'] }] } });
		expect($obp.get(abcObj, 'c.f[0]')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['c.f[0].i'])).toStrictEqual({ c: { f: [{ i: ['j'] }] } });
		expect($obp.get(abcObj, 'c.f[0].i')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'c.f[0].i[0]')).toBe('j');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['a'], 'ꓺ')).toStrictEqual({ a: 'a' });
		expect($obp.get(abcObj, 'a', undefined, 'ꓺ')).toBe('a');

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['cꓺf'], 'ꓺ')).toStrictEqual({ c: { f: [{ g: 'g', h: 'h', i: ['j'] }] } });
		expect($obp.get(abcObj, 'cꓺf', undefined, 'ꓺ')).toStrictEqual([{ g: 'g', h: 'h', i: ['j'] }]);

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['cꓺf[0]'], 'ꓺ')).toStrictEqual({ c: { f: [{ g: 'g', h: 'h', i: ['j'] }] } });
		expect($obp.get(abcObj, 'cꓺf[0]', undefined, 'ꓺ')).toStrictEqual({ g: 'g', h: 'h', i: ['j'] });

		abcObj = { a: 'a', b: 'b', c: { d: 'd', e: 'e', f: [{ g: 'g', h: 'h', i: ['j'] }] } };
		expect($obp.pick(abcObj, ['cꓺf[0]ꓺi'], 'ꓺ')).toStrictEqual({ c: { f: [{ i: ['j'] }] } });
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi', undefined, 'ꓺ')).toStrictEqual(['j']);
		expect($obp.get(abcObj, 'cꓺf[0]ꓺi[0]', undefined, 'ꓺ')).toBe('j');
	});
});
