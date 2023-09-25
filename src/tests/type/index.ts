/**
 * Test suite.
 */

import { beforeEach, describe, expect, test } from 'vitest';
import { $obj, $symbol, $type } from '../../index.ts';

describe('$type', async () => {
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
    test('.ensure', async () => {
        expect($type.ensure(true, 'boolean')).toBe(true);
        expect($type.ensure(true, 'boolean[]')).toStrictEqual([true]);

        expect($type.ensure('123', 'number')).toBe(123);
        expect($type.ensure('123', 'number[]')).toStrictEqual([123]);

        expect($type.ensure('123', 'bigint')).toBe(BigInt('123'));
        expect($type.ensure('123', 'bigint[]')).toStrictEqual([BigInt('123')]);

        expect($type.ensure('foo', 'string')).toBe('foo');
        expect($type.ensure('foo', 'string[]')).toStrictEqual(['foo']);

        expect($type.ensure('foo', 'object')).toStrictEqual(new String('foo'));
        expect($type.ensure('foo', 'object[]')).toStrictEqual([new String('foo')]);

        expect($type.ensure('foo', 'plainObject')).toStrictEqual({ '0': 'f', '1': 'o', '2': 'o' });
        expect($type.ensure('foo', 'plainObject[]')).toStrictEqual([{ '0': 'f', '1': 'o', '2': 'o' }]);

        expect($type.ensure([123, 'foo', testCustomObj, [testCustomAnonObj]], 'plainObjectDeep')).toStrictEqual({
            '0': 123,
            '1': 'foo',
            '2': { a: 'a', b: 'b', c: 'c' },
            '3': [{ a: 'a', b: 'b', c: 'c' }],
        });
        expect($type.ensure([123, 'foo', testCustomObj, [testCustomAnonObj]], 'plainObjectDeep[]')).toStrictEqual([
            {},
            { '0': 'f', '1': 'o', '2': 'o' },
            { a: 'a', b: 'b', c: 'c' },
            { '0': { a: 'a', b: 'b', c: 'c' } },
        ]);
        expect($type.ensure(testCustomObj, 'unknown')).toBe(testCustomObj);
        expect($type.ensure([testCustomObj], 'unknown')).toStrictEqual([testCustomObj]);
        expect($type.ensure([testCustomNamedObj], 'unknown')).toStrictEqual([testCustomNamedObj]);
        expect($type.ensure([testCustomSubNamedObj], 'unknown')).toStrictEqual([testCustomSubNamedObj]);
        expect($type.ensure([testCustomAnonObj], 'unknown')).toStrictEqual([testCustomAnonObj]);
    });
});
