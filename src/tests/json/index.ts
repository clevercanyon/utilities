/**
 * Test suite.
 */

import { $json } from '../../index.js';
import { describe, test, expect } from 'vitest';

describe('$json', async () => {
	test('.stringify() .parse()', async () => {
		expect($json.stringify(undefined)).toBe(JSON.stringify(undefined));
		expect($json.parse($json.stringify(undefined))).toBe(undefined);
		expect($json.stringify(undefined)).toBe(undefined);
		expect($json.parse(undefined)).toBe(undefined);

		expect($json.stringify(null)).toBe(JSON.stringify(null));
		expect($json.stringify(null)).toBe('null');
		expect($json.parse($json.stringify(null))).toBe(null);

		expect($json.stringify(true)).toBe(JSON.stringify(true));
		expect($json.stringify(true)).toBe('true');
		expect($json.parse($json.stringify(true))).toBe(true);

		expect($json.stringify(false)).toBe(JSON.stringify(false));
		expect($json.stringify(false)).toBe('false');
		expect($json.parse($json.stringify(false))).toBe(false);

		expect($json.stringify(1)).toBe(JSON.stringify(1));
		expect($json.stringify(1)).toBe('1');
		expect($json.parse($json.stringify(1))).toBe(1);

		expect($json.stringify('x')).toBe(JSON.stringify('x'));
		expect($json.stringify('x')).toBe('"x"');
		expect($json.parse($json.stringify('x'))).toBe('x');

		expect($json.stringify({ x: '_x' })).toBe(JSON.stringify({ x: '_x' }));
		expect($json.stringify({ x: '_x' })).toBe('{"x":"_x"}');
		expect($json.parse($json.stringify({ x: '_x' }))).toStrictEqual({ x: '_x' });

		expect($json.stringify([0])).toBe(JSON.stringify([0]));
		expect($json.stringify([0])).toBe('[0]');
		expect($json.parse($json.stringify([0]))).toStrictEqual([0]);

		const obj1 = new Set(['a', 'b', 'c']);
		expect($json.stringify(obj1)).not.toBe(JSON.stringify(obj1));
		expect($json.stringify(obj1)).toBe('{"__dataType":"Set","__data":["a","b","c"]}');
		expect($json.parse($json.stringify(obj1))).toStrictEqual(obj1);

		const obj2 = new Map([
			['a', '_a'],
			['b', '_b'],
			['c', '_c'],
		]);
		expect($json.stringify(obj2)).not.toBe(JSON.stringify(obj2));
		expect($json.stringify(obj2)).toBe('{"__dataType":"Map","__data":[["a","_a"],["b","_b"],["c","_c"]]}');
		expect($json.parse($json.stringify(obj2))).toStrictEqual(obj2);

		const obj3 = {
			a: '_a',
			b: '_b',
			c: '_c',
			d: [
				undefined,
				null,
				true,
				false,
				1,
				'x',
				{ x: '_x' },
				[0],
				new Set(['a', 'b', 'c']),
				new Map([
					['a', '_a'],
					['b', '_b'],
					['c', '_c'],
				]),
			],
		};
		const obj3After = {
			a: '_a',
			b: '_b',
			c: '_c',
			d: [
				null, // Converts to `null`.
				null,
				true,
				false,
				1,
				'x',
				{ x: '_x' },
				[0],
				new Set(['a', 'b', 'c']),
				new Map([
					['a', '_a'],
					['b', '_b'],
					['c', '_c'],
				]),
			],
		};
		expect($json.stringify(obj3)).not.toBe(JSON.stringify(obj3));
		expect($json.stringify(obj3)).toBe('{"a":"_a","b":"_b","c":"_c","d":[null,null,true,false,1,"x",{"x":"_x"},[0],{"__dataType":"Set","__data":["a","b","c"]},{"__dataType":"Map","__data":[["a","_a"],["b","_b"],["c","_c"]]}]}'); // prettier-ignore
		expect($json.parse($json.stringify(obj3))).toStrictEqual(obj3After);
	});
});
