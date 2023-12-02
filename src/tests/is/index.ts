/**
 * Test suite.
 */

import { $brand, $class, $dom, $env, $is, $obj, $symbol, $time, $url } from '#index.ts';
import { beforeEach, describe, expect, test } from 'vitest';

describe('$is', async () => {
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
    test('.nan()', async () => {
        expect($is.nan(NaN)).toBe(true);
        expect($is.nan(Number('x'))).toBe(true);

        expect($is.nan(Number(0))).toBe(false);
        expect($is.nan(Number(1))).toBe(false);
    });
    test('.nul()', async () => {
        expect($is.nul(null)).toBe(true);
        expect($is.nul(undefined)).toBe(true);

        expect($is.nul(NaN)).toBe(false);
        expect($is.nul(false)).toBe(false);
    });
    test('.nil()', async () => {
        expect($is.nil(null)).toBe(true);
        expect($is.nil(undefined)).toBe(true);
        expect($is.nil(NaN)).toBe(true);

        expect($is.nil(false)).toBe(false);
    });
    test('.null()', async () => {
        expect($is.null(null)).toBe(true);

        expect($is.null(undefined)).toBe(false);
        expect($is.null(NaN)).toBe(false);
        expect($is.null(false)).toBe(false);
    });
    test('.undefined()', async () => {
        expect($is.undefined(undefined)).toBe(true);

        expect($is.undefined(null)).toBe(false);
        expect($is.undefined(NaN)).toBe(false);
        expect($is.undefined(false)).toBe(false);
    });
    test('.empty()', async () => {
        expect($is.empty(null)).toBe(true);
        expect($is.empty(undefined)).toBe(true);
        expect($is.empty(NaN)).toBe(true);
        expect($is.empty(false)).toBe(true);
        expect($is.empty(0)).toBe(true);
        expect($is.empty(new Set())).toBe(true);
        expect($is.empty(new Map())).toBe(true);
        expect($is.empty('')).toBe(true);
        expect($is.empty([])).toBe(true);
        expect($is.empty({})).toBe(true);
        expect($is.empty(() => null)).toBe(true);
        expect($is.empty(async () => null)).toBe(true);

        expect($is.empty('0')).toBe(false);
        expect($is.empty('1')).toBe(false);
        expect($is.empty(true)).toBe(false);
        expect($is.empty({ a: 'a' })).toBe(false);
        expect($is.empty([0])).toBe(false);
        expect($is.empty(new Set([0]))).toBe(false);
        expect($is.empty(new Map([[0, 0]]))).toBe(false);
    });
    test('.notEmpty()', async () => {
        expect($is.notEmpty(1)).toBe(true);
        expect($is.notEmpty(0)).toBe(false);
        expect($is.notEmpty('0')).toBe(true);
    });
    test('.emptyOrZero()', async () => {
        expect($is.emptyOrZero(null)).toBe(true);
        expect($is.emptyOrZero(undefined)).toBe(true);
        expect($is.emptyOrZero(NaN)).toBe(true);
        expect($is.emptyOrZero(false)).toBe(true);
        expect($is.emptyOrZero(0)).toBe(true);
        expect($is.emptyOrZero('0')).toBe(true);
        expect($is.emptyOrZero(new Set())).toBe(true);
        expect($is.emptyOrZero(new Map())).toBe(true);
        expect($is.emptyOrZero('')).toBe(true);
        expect($is.emptyOrZero([])).toBe(true);
        expect($is.emptyOrZero({})).toBe(true);
        expect($is.emptyOrZero(() => null)).toBe(true);
        expect($is.emptyOrZero(async () => null)).toBe(true);

        expect($is.emptyOrZero('1')).toBe(false);
        expect($is.emptyOrZero(true)).toBe(false);
        expect($is.emptyOrZero({ a: 'a' })).toBe(false);
        expect($is.emptyOrZero([0])).toBe(false);
        expect($is.emptyOrZero(new Set([0]))).toBe(false);
        expect($is.emptyOrZero(new Map([[0, 0]]))).toBe(false);
    });
    test('.notEmptyOrZero()', async () => {
        expect($is.notEmptyOrZero(1)).toBe(true);
        expect($is.notEmptyOrZero(0)).toBe(false);
        expect($is.notEmptyOrZero('0')).toBe(false);
    });
    test('.primitive()', async () => {
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
    test('.boolean()', async () => {
        expect($is.boolean(true)).toBe(true);
        expect($is.boolean(false)).toBe(true);

        expect($is.boolean(null)).toBe(false);
        expect($is.boolean(undefined)).toBe(false);
        expect($is.boolean(0)).toBe(false);
        expect($is.boolean(BigInt(0))).toBe(false);
        expect($is.boolean('')).toBe(false);
        expect($is.boolean(testObj)).toBe(false);
    });
    test('.number()', async () => {
        expect($is.number(0)).toBe(true);
        expect($is.number(1)).toBe(true);
        expect($is.number(0.001)).toBe(true);
        expect($is.number(0.001)).toBe(true);
        expect($is.number(1.001)).toBe(true);

        expect($is.number(NaN)).toBe(false);
        expect($is.number(true)).toBe(false);
        expect($is.number(false)).toBe(false);
        expect($is.number(null)).toBe(false);
        expect($is.number(undefined)).toBe(false);
        expect($is.number(BigInt(0))).toBe(false);
        expect($is.number('')).toBe(false);
        expect($is.number(testObj)).toBe(false);
    });
    test('.bigint()', async () => {
        expect($is.bigint(BigInt(0))).toBe(true);
        expect($is.bigint(BigInt(1))).toBe(true);

        expect($is.bigint(NaN)).toBe(false);
        expect($is.bigint(0)).toBe(false);
        expect($is.bigint(1)).toBe(false);
    });
    test('.integer()', async () => {
        expect($is.integer(0)).toBe(true);
        expect($is.integer(1)).toBe(true);
        expect($is.integer(0.0)).toBe(true);
        expect($is.integer(1.0)).toBe(true);

        expect($is.integer(NaN)).toBe(false);
        expect($is.integer(0.1)).toBe(false);
        expect($is.integer('')).toBe(false);
        expect($is.integer('0')).toBe(false);
        expect($is.integer('1')).toBe(false);
    });
    test('.float()', async () => {
        expect($is.float(1.01)).toBe(true);
        expect($is.float(0.1)).toBe(true);
        expect($is.float(0.0001)).toBe(true);

        expect($is.float(0)).toBe(false);
        expect($is.float(1)).toBe(false);
        expect($is.float(0.0)).toBe(false);
        expect($is.float(1.0)).toBe(false);
        expect($is.float(NaN)).toBe(false);
        expect($is.float('')).toBe(false);
        expect($is.float('0')).toBe(false);
        expect($is.float('1')).toBe(false);
    });
    test('.finite()', async () => {
        expect($is.finite(0)).toBe(true);
        expect($is.finite(1)).toBe(true);
        expect($is.finite(-0)).toBe(true);
        expect($is.finite(-1)).toBe(true);
        expect($is.finite(1.01)).toBe(true);
        expect($is.finite(0.1)).toBe(true);
        expect($is.finite(0.0001)).toBe(true);
        expect($is.finite(0)).toBe(true);
        expect($is.finite(1)).toBe(true);
        expect($is.finite(0.0)).toBe(true);
        expect($is.finite(1.0)).toBe(true);

        expect($is.finite(NaN)).toBe(false);
        expect($is.finite(Infinity)).toBe(false);
        expect($is.finite(-Infinity)).toBe(false);
        expect($is.finite('')).toBe(false);
        expect($is.finite('0')).toBe(false);
        expect($is.finite('1')).toBe(false);
        expect($is.finite(BigInt(0))).toBe(false);
    });
    test('.numeric()', async () => {
        expect($is.numeric(0)).toBe(true);
        expect($is.numeric(1)).toBe(true);
        expect($is.numeric(-0)).toBe(true);
        expect($is.numeric(-1)).toBe(true);
        expect($is.numeric(0.1)).toBe(true);
        expect($is.numeric(0.0)).toBe(true);
        expect($is.numeric(1.0)).toBe(true);
        expect($is.numeric(Infinity)).toBe(true);
        expect($is.numeric(-Infinity)).toBe(true);
        expect($is.numeric('0')).toBe(true);
        expect($is.numeric('1')).toBe(true);
        expect($is.numeric('0.0')).toBe(true);
        expect($is.numeric('1.0')).toBe(true);
        expect($is.numeric('0', 'integer')).toBe(true);
        expect($is.numeric('1', 'integer')).toBe(true);
        expect($is.numeric('0', 'safeInteger')).toBe(true);
        expect($is.numeric('1', 'safeInteger')).toBe(true);
        expect($is.numeric('-1', 'safeInteger')).toBe(true);
        expect($is.numeric('0', 'safeArrayKey')).toBe(true);
        expect($is.numeric('1', 'safeArrayKey')).toBe(true);
        expect($is.numeric('.0', 'float')).toBe(true);
        expect($is.numeric('0.0', 'float')).toBe(true);
        expect($is.numeric('1.0', 'float')).toBe(true);

        expect($is.numeric(NaN)).toBe(false);
        expect($is.numeric('')).toBe(false);
        expect($is.numeric('x')).toBe(false);
        expect($is.numeric(BigInt(0))).toBe(false);
        expect($is.numeric('.0', 'integer')).toBe(false);
        expect($is.numeric('0.0', 'integer')).toBe(false);
        expect($is.numeric('1.0', 'integer')).toBe(false);
        expect($is.numeric('-1', 'safeArrayKey')).toBe(false);
        expect($is.numeric('-0', 'safeInteger')).toBe(false);
        expect($is.numeric('0', 'float')).toBe(false);
        expect($is.numeric('1', 'float')).toBe(false);
    });
    test('.string()', async () => {
        expect($is.string('')).toBe(true);
        expect($is.string('0')).toBe(true);
        expect($is.string('x')).toBe(true);

        expect($is.string(0)).toBe(false);
        expect($is.string(null)).toBe(false);
        expect($is.string(undefined)).toBe(false);
        expect($is.string(true)).toBe(false);
    });
    test('.symbol()', async () => {
        expect($is.symbol(Symbol(''))).toBe(true);
        expect($is.symbol(Symbol('0'))).toBe(true);
        expect($is.symbol(Symbol('x'))).toBe(true);

        expect($is.symbol(0)).toBe(false);
        expect($is.symbol(null)).toBe(false);
        expect($is.symbol(undefined)).toBe(false);
        expect($is.symbol(true)).toBe(false);
    });
    test('.proto()', async () => {
        expect($is.proto(Object.getPrototypeOf({}))).toBe(true);
        expect($is.proto(Object.getPrototypeOf(Object))).toBe(true);
        expect($is.proto(Object.getPrototypeOf(testObj))).toBe(true);
        expect($is.proto(Object.getPrototypeOf(0))).toBe(true);

        expect($is.proto(Object)).toBe(false);
        expect($is.proto({})).toBe(false);
        expect($is.proto(null)).toBe(false);
        expect($is.proto(undefined)).toBe(false);
        expect($is.proto(true)).toBe(false);
        expect($is.proto(false)).toBe(false);
        expect($is.proto(0)).toBe(false);
    });
    test('.object()', async () => {
        expect($is.object([])).toBe(true);
        expect($is.object(testObj)).toBe(true);
        expect($is.object(testCustomObj)).toBe(true);
        expect($is.object(testCustomNamedObj)).toBe(true);
        expect($is.object(testCustomAnonObj)).toBe(true);
        expect($is.object(new String(''))).toBe(true);
        expect($is.object(new Number(0))).toBe(true);
        expect($is.object(() => null)).toBe(true);

        expect($is.object(null)).toBe(false);
        expect($is.object(NaN)).toBe(false);
        expect($is.object(undefined)).toBe(false);
        expect($is.object(true)).toBe(false);
        expect($is.object(false)).toBe(false);
        expect($is.object(0)).toBe(false);
        expect($is.object('')).toBe(false);
        expect($is.object(BigInt(0))).toBe(false);
    });
    test('.plainObject()', async () => {
        expect($is.plainObject({})).toBe(true);
        expect($is.plainObject(testObj)).toBe(true);

        expect($is.plainObject([])).toBe(false);
        expect($is.plainObject(testCustomObj)).toBe(false);
        expect($is.plainObject(testCustomNamedObj)).toBe(false);
        expect($is.plainObject(testCustomAnonObj)).toBe(false);
        expect($is.plainObject(new String(''))).toBe(false);
        expect($is.plainObject(new Number(0))).toBe(false);
        expect($is.plainObject(() => null)).toBe(false);
        expect($is.plainObject(null)).toBe(false);
        expect($is.plainObject(NaN)).toBe(false);
        expect($is.plainObject(undefined)).toBe(false);
        expect($is.plainObject(true)).toBe(false);
        expect($is.plainObject(false)).toBe(false);
        expect($is.plainObject(0)).toBe(false);
        expect($is.plainObject('')).toBe(false);
        expect($is.plainObject(BigInt(0))).toBe(false);
    });
    test('.function()', async () => {
        expect($is.function(() => null)).toBe(true);
        expect($is.function(async () => null)).toBe(true);

        expect($is.function({})).toBe(false);
        expect($is.function(testObj)).toBe(false);
        expect($is.function([])).toBe(false);
        expect($is.function(testCustomObj)).toBe(false);
        expect($is.function(testCustomNamedObj)).toBe(false);
        expect($is.function(testCustomAnonObj)).toBe(false);
        expect($is.function(new String(''))).toBe(false);
        expect($is.function(new Number(0))).toBe(false);
        expect($is.function(null)).toBe(false);
        expect($is.function(NaN)).toBe(false);
        expect($is.function(undefined)).toBe(false);
        expect($is.function(true)).toBe(false);
        expect($is.function(false)).toBe(false);
        expect($is.function(0)).toBe(false);
        expect($is.function('')).toBe(false);
        expect($is.function(BigInt(0))).toBe(false);
    });
    test('.asyncFunction()', async () => {
        expect($is.asyncFunction(async () => null)).toBe(true);

        expect($is.asyncFunction(() => null)).toBe(false);
    });
    test('.promise()', async () => {
        expect($is.promise(new Promise((resolve) => resolve(0)))).toBe(true);
        expect($is.promise((async () => null)())).toBe(true);

        expect($is.promise(async () => null)).toBe(false);
        expect($is.promise(() => null)).toBe(false);
    });
    test('.set()', async () => {
        expect($is.set(new Set([0]))).toBe(true);

        expect($is.set(new Map([[0, 0]]))).toBe(false);
        expect($is.set({})).toBe(false);
        expect($is.set([])).toBe(false);
    });
    test('.map()', async () => {
        expect($is.map(new Map([[0, 0]]))).toBe(true);

        expect($is.map(new Set([0]))).toBe(false);
        expect($is.map({})).toBe(false);
        expect($is.map([])).toBe(false);
    });
    test('.arrayBuffer()', async () => {
        expect($is.arrayBuffer(new ArrayBuffer(8))).toBe(true);

        expect($is.arrayBuffer({})).toBe(false);
        expect($is.arrayBuffer([])).toBe(false);
    });
    test('.array()', async () => {
        expect($is.array([])).toBe(true);
        expect($is.array([0])).toBe(true);

        expect($is.array(new ArrayBuffer(8))).toBe(false);
        expect($is.array({})).toBe(false);
    });
    test('.typedArray()', async () => {
        expect($is.typedArray(new Int8Array(2))).toBe(true);
        expect($is.typedArray(new Uint8Array(2))).toBe(true);
        expect($is.typedArray(new Uint8ClampedArray(2))).toBe(true);
        expect($is.typedArray(new Int16Array(2))).toBe(true);
        expect($is.typedArray(new Uint16Array(2))).toBe(true);
        expect($is.typedArray(new Int32Array(2))).toBe(true);
        expect($is.typedArray(new Uint32Array(2))).toBe(true);
        expect($is.typedArray(new Float32Array(2))).toBe(true);
        expect($is.typedArray(new Float64Array(2))).toBe(true);
        expect($is.typedArray(new BigInt64Array(2))).toBe(true);
        expect($is.typedArray(new BigUint64Array(2))).toBe(true);

        expect($is.typedArray(new ArrayBuffer(8))).toBe(false);
        expect($is.typedArray([])).toBe(false);
        expect($is.typedArray({})).toBe(false);
    });
    test('.buffer()', async () => {
        if ($env.isNode()) {
            expect($is.buffer(Buffer.from('x'))).toBe(true);
        }
        expect($is.buffer(new BigUint64Array(2))).toBe(false);
        expect($is.buffer(new ArrayBuffer(8))).toBe(false);
        expect($is.buffer([])).toBe(false);
        expect($is.buffer({})).toBe(false);
    });
    test('.error()', async () => {
        expect($is.error(new Error('x'))).toBe(true);
        expect($is.error(new TypeError('x'))).toBe(true);

        expect($is.error([])).toBe(false);
        expect($is.error({})).toBe(false);
    });
    test('.brand()', async () => {
        expect($is.brand($brand.get('&'))).toBe(true);
        expect($is.brand($brand.get('&')?.org)).toBe(true);

        expect($is.brand(new Date())).toBe(false);
        expect($is.brand($time.parse())).toBe(false);
    });
    test('.time()', async () => {
        expect($is.time($time.parse())).toBe(true);
        expect($is.time($time.parse('now'))).toBe(true);

        expect($is.time(new Date())).toBe(false);
        expect($is.time($brand.get('&'))).toBe(false);
    });
    test('.date()', async () => {
        expect($is.date(new Date())).toBe(true);
        expect($is.date(new Date(Date.parse('2023-01-01T00:00:00.000Z')))).toBe(true);

        expect($is.date($time.parse())).toBe(false);
        expect($is.date($brand.get('&'))).toBe(false);
    });
    test('.url()', async () => {
        expect($is.url(new URL('https://example.com/'))).toBe(true);
        expect($is.url($url.parse('https://example.com/'))).toBe(true);

        expect($is.url($time.parse())).toBe(false);
        expect($is.url($brand.get('&'))).toBe(false);
    });
    test('.regExp()', async () => {
        expect($is.regExp(/./u)).toBe(true);
        expect($is.regExp(new RegExp('.', 'u'))).toBe(true);

        expect($is.regExp($time.parse())).toBe(false);
        expect($is.regExp($url.parse('https://example.com'))).toBe(false);
    });
    test('.node()', async () => {
        if ($env.isWeb()) {
            expect($is.node($dom.create('div'))).toBe(true);
            expect($is.node($dom.create('span'))).toBe(true);
        }
        expect($is.node($time.parse())).toBe(false);
        expect($is.node($url.parse('https://example.com'))).toBe(false);
    });
    test('.element()', async () => {
        if ($env.isWeb()) {
            expect($is.element($dom.create('div'))).toBe(true);
            expect($is.element($dom.create('span'))).toBe(true);
        }
        expect($is.element($time.parse())).toBe(false);
        expect($is.element($url.parse('https://example.com'))).toBe(false);
    });
    test('.objectTag()', async () => {
        expect($is.objectTag(testObj, 'Object')).toBe(true);
        expect($is.objectTag(testCustomObj, 'Object:Custom')).toBe(true);
        expect($is.objectTag(testCustomNamedObj, 'CustomNamed')).toBe(true);
        expect($is.objectTag(testCustomSubNamedObj, 'CustomSubNamed')).toBe(true);
        expect($is.objectTag(testCustomAnonObj, 'Object:?')).toBe(true);
    });
    test('.objectOfTag()', async () => {
        expect($is.objectOfTag(testObj, 'Object')).toBe(true);
        expect($is.objectOfTag(testCustomObj, 'Object:Custom', 'Object')).toBe(true);
        expect($is.objectOfTag(testCustomNamedObj, 'CustomNamed', 'Object:Custom', 'Object')).toBe(true);
        expect($is.objectOfTag(testCustomSubNamedObj, 'CustomSubNamed', 'CustomNamed', 'Object:Custom', 'Object')).toBe(true);
        expect($is.objectOfTag(testCustomAnonObj, 'Object:?', 'Object')).toBe(true);
    });
    test('.iterable()', async () => {
        expect($is.iterable([])).toBe(true);
        expect($is.iterable(new Set())).toBe(true);
        expect($is.iterable(new Map())).toBe(true);

        expect($is.iterable(null)).toBe(false);
        expect($is.iterable({})).toBe(false);
    });
    test('.asyncIterable()', async () => {
        expect(
            $is.asyncIterable({
                async *[Symbol.asyncIterator]() {
                    yield 'foo';
                },
            }),
        ).toBe(true);

        expect($is.asyncIterable(null)).toBe(false);
        expect($is.asyncIterable({})).toBe(false);
    });
    test('.safeInteger()', async () => {
        expect($is.safeInteger(0)).toBe(true);
        expect($is.safeInteger(1)).toBe(true);
        expect($is.safeInteger(1.0)).toBe(true);

        expect($is.safeInteger(NaN)).toBe(false);
        expect($is.safeInteger(-Infinity)).toBe(false);
        expect($is.safeInteger(Infinity)).toBe(false);
    });
    test('.safeArrayKey()', async () => {
        expect($is.safeArrayKey(0)).toBe(true);
        expect($is.safeArrayKey(1)).toBe(true);

        expect($is.safeArrayKey(-1)).toBe(false);
        expect($is.safeArrayKey(NaN)).toBe(false);
        expect($is.safeArrayKey(-Infinity)).toBe(false);
        expect($is.safeArrayKey(Infinity)).toBe(false);
    });
    test('.safeObjectKey()', async () => {
        expect($is.safeObjectKey(0)).toBe(true);
        expect($is.safeObjectKey(1)).toBe(true);
        expect($is.safeObjectKey('0')).toBe(true);
        expect($is.safeObjectKey('1')).toBe(true);
        expect($is.safeObjectKey('x')).toBe(true);
        expect($is.safeObjectKey(Symbol('x'))).toBe(true);

        expect($is.safeObjectKey(-1)).toBe(false);
        expect($is.safeObjectKey(NaN)).toBe(false);
        expect($is.safeObjectKey(-Infinity)).toBe(false);
        expect($is.safeObjectKey(Infinity)).toBe(false);
    });
    test('.safeObjectPath()', async () => {
        expect($is.safeObjectPath(0)).toBe(true);
        expect($is.safeObjectPath(1)).toBe(true);
        expect($is.safeObjectPath('0')).toBe(true);
        expect($is.safeObjectPath('1')).toBe(true);
        expect($is.safeObjectPath('x')).toBe(true);

        expect($is.safeObjectPath(-1)).toBe(false);
        expect($is.safeObjectPath(NaN)).toBe(false);
        expect($is.safeObjectPath(Symbol('x'))).toBe(false);
        expect($is.safeObjectPath(-Infinity)).toBe(false);
        expect($is.safeObjectPath(Infinity)).toBe(false);
    });
    test('.protoPollutionKey()', async () => {
        expect($is.protoPollutionKey('__proto__')).toBe(true);
        expect($is.protoPollutionKey('prototype')).toBe(true);
        expect($is.protoPollutionKey('constructor')).toBe(true);
        expect($is.protoPollutionKey('__pRoTo__')).toBe(true);
        expect($is.protoPollutionKey('pRoToTyPe')).toBe(true);
        expect($is.protoPollutionKey('conStRucTor')).toBe(true);

        expect($is.protoPollutionKey('a')).toBe(false);
        expect($is.protoPollutionKey('b')).toBe(false);
        expect($is.protoPollutionKey('c')).toBe(false);
    });
    test('.structuredCloneable()', async () => {
        expect($is.structuredCloneable(0)).toBe(true);
        expect($is.structuredCloneable('0')).toBe(true);
        expect($is.structuredCloneable(1)).toBe(true);
        expect($is.structuredCloneable({})).toBe(true);
        expect($is.structuredCloneable([])).toBe(true);
        expect($is.structuredCloneable(new Set())).toBe(true);
        expect($is.structuredCloneable(new Map())).toBe(true);
        expect($is.structuredCloneable(new Date())).toBe(true);

        expect($is.structuredCloneable($brand.get('&'))).toBe(false);
        expect($is.structuredCloneable($time.parse())).toBe(false);
        expect($is.structuredCloneable(Symbol('x'))).toBe(false);
        expect($is.structuredCloneable(() => null)).toBe(false);
    });
    test('.equal()', async () => {
        const fn1 = () => 1;
        const fn2 = () => ({ _2: 2 });

        const Fetcher = $class.getFetcher();
        const fetcher1 = new Fetcher();
        const fetcher2 = new Fetcher();

        expect($is.equal(undefined, undefined)).toBe(true);
        expect($is.equal(null, null)).toBe(true);

        expect($is.equal(true, true)).toBe(true);
        expect($is.equal(false, false)).toBe(true);

        expect($is.equal(0, 0)).toBe(true);
        expect($is.equal('0', '0')).toBe(true);

        expect($is.equal(1, 1)).toBe(true);
        expect($is.equal('1', '1')).toBe(true);

        expect($is.equal(BigInt('0'), BigInt('0'))).toBe(true);
        expect($is.equal(BigInt('1'), BigInt('1'))).toBe(true);

        expect($is.equal(fn1, fn1)).toBe(true);
        expect($is.equal(fn2, fn2)).toBe(true);

        expect($is.equal(fetcher1, fetcher1)).toBe(true);
        expect($is.equal(fetcher2, fetcher2)).toBe(true);

        // ---

        expect($is.equal(undefined, null)).toBe(false);
        expect($is.equal(null, undefined)).toBe(false);

        expect($is.equal(true, false)).toBe(false);
        expect($is.equal(false, true)).toBe(false);

        expect($is.equal(0, 1)).toBe(false);
        expect($is.equal('0', '1')).toBe(false);

        expect($is.equal(1, 0)).toBe(false);
        expect($is.equal('1', '0')).toBe(false);

        expect($is.equal(BigInt('0'), BigInt('1'))).toBe(false);
        expect($is.equal(BigInt('1'), BigInt('0'))).toBe(false);

        expect($is.equal(fn1, fn2)).toBe(false);
        expect($is.equal(fn2, fn1)).toBe(false);

        expect($is.equal(fetcher1, fetcher2)).toBe(false);
        expect($is.equal(fetcher2, fetcher1)).toBe(false);
    });
    test('.deepEqual()', async () => {
        const fn1 = () => 1;
        const fn2 = () => ({ _2: 2 });

        const Fetcher = $class.getFetcher();
        const fetcher1 = new Fetcher();
        const fetcher2 = new Fetcher();

        expect($is.deepEqual(undefined, undefined)).toBe(true);
        expect($is.deepEqual(null, null)).toBe(true);

        expect($is.deepEqual(true, true)).toBe(true);
        expect($is.deepEqual(false, false)).toBe(true);

        expect($is.deepEqual(0, 0)).toBe(true);
        expect($is.deepEqual('0', '0')).toBe(true);

        expect($is.deepEqual(1, 1)).toBe(true);
        expect($is.deepEqual('1', '1')).toBe(true);

        expect($is.deepEqual(BigInt('0'), BigInt('0'))).toBe(true);
        expect($is.deepEqual(BigInt('1'), BigInt('1'))).toBe(true);

        expect($is.deepEqual(fn1, fn1)).toBe(true);
        expect($is.deepEqual(fn2, fn2)).toBe(true);

        expect($is.deepEqual(fetcher1, fetcher1)).toBe(true);
        expect($is.deepEqual(fetcher2, fetcher2)).toBe(true);

        expect($is.deepEqual({ fetcher1 }, { fetcher1 })).toBe(true);
        expect($is.deepEqual({ fetcher2 }, { fetcher2 })).toBe(true);

        // ---

        expect($is.deepEqual(undefined, null)).toBe(false);
        expect($is.deepEqual(null, undefined)).toBe(false);

        expect($is.deepEqual(true, false)).toBe(false);
        expect($is.deepEqual(false, true)).toBe(false);

        expect($is.deepEqual(0, 1)).toBe(false);
        expect($is.deepEqual('0', '1')).toBe(false);

        expect($is.deepEqual(1, 0)).toBe(false);
        expect($is.deepEqual('1', '0')).toBe(false);

        expect($is.deepEqual(BigInt('0'), BigInt('1'))).toBe(false);
        expect($is.deepEqual(BigInt('1'), BigInt('0'))).toBe(false);

        expect($is.deepEqual(fn1, fn2)).toBe(false);
        expect($is.deepEqual(fn2, fn1)).toBe(false);

        expect($is.deepEqual(fetcher1, fetcher2)).toBe(false);
        expect($is.deepEqual(fetcher2, fetcher1)).toBe(false);

        expect($is.deepEqual({ fetcher1 }, { fetcher2 })).toBe(false);
        expect($is.deepEqual({ fetcher2 }, { fetcher1 })).toBe(false);

        expect($is.deepEqual({ fetcher1 }, { fetcher1: fetcher2 })).toBe(false);
        expect($is.deepEqual({ fetcher2 }, { fetcher2: fetcher1 })).toBe(false);
    });
});
