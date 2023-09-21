/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $fn } from '../../index.ts';

describe('$fn', async () => {
    test('.noOp()', async () => {
        expect($fn.noOp()).toBe(undefined);
    });
    test('.try()', async () => {
        expect($fn.try(() => null)()).toBe(null);
        expect($fn.try(() => undefined)()).toBe(undefined);
        expect($fn.try((v: string) => v)('abc')).toBe('abc');
        expect($fn.try(() => { throw new Error(); }, 'abc')()).toBe('abc'); // prettier-ignore
        expect($fn.try(() => { throw new Error(); })()).toBeInstanceOf(Error); // prettier-ignore
        expect($fn.try(() => { throw new Error(); }, undefined, {throwOnError: true})).toThrowError(); // prettier-ignore

        await expect($fn.try(async () => null)()).resolves.toBe(null);
        await expect($fn.try(async () => undefined)()).resolves.toBe(undefined);
        await expect($fn.try(async (v: string) => v)('abc')).resolves.toBe('abc');
        await expect($fn.try(async () => { throw new Error(); }, 'abc')()).resolves.toBe('abc'); // prettier-ignore
        await expect($fn.try(async () => { throw new Error(); })()).resolves.toBeInstanceOf(Error); // prettier-ignore
        await expect($fn.try(async () => { throw new Error(); }, undefined, {throwOnError: true})()).rejects.toThrowError(); // prettier-ignore
    });
    test('.curry()', async () => {
        const testFn = (a: string, b: string, c: string) => ({ a, b, c });

        expect($fn.curry(testFn, 'a', 'b', 'c')()).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
        expect($fn.curry(testFn)('a')('b')('c')).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
        expect($fn.curry(testFn)('a', 'b', 'c')).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
    test('.throttle()', async () => {
        const testFn = (a: string, b: string, c: string) => ({ a, b, c });
        await expect($fn.throttle(testFn)('a', 'b', 'c')).resolves.toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
    test('.debounce()', async () => {
        const testFn = (a: string, b: string, c: string) => ({ a, b, c });
        await expect($fn.debounce(testFn)('a', 'b', 'c')).resolves.toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
});
