/**
 * Test suite.
 */

import { $fn } from '#index.ts';
import { describe, expect, test, vi } from 'vitest';

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
        const fn1 = vi.fn();
        const testFn1 = $fn.throttle(fn1);
        for (let i = 0; i < 100; i++) void testFn1();
        expect(fn1).toHaveBeenCalledTimes(1); // Leading edge.
        await new Promise((resolve) => setTimeout(() => resolve(0), 1000));
        expect(fn1).toHaveBeenCalledTimes(2); // + trailing edge also.

        const fn2 = vi.fn();
        const testFn2 = $fn.throttle(fn2, { leadingEdge: false });
        for (let i = 0; i < 100; i++) void testFn2();
        expect(fn2).toHaveBeenCalledTimes(0); // Not on leading edge.
        await new Promise((resolve) => setTimeout(() => resolve(0), 1000));
        expect(fn2).toHaveBeenCalledTimes(1); // Only on trailing edge.

        const testFn3 = (a: string, b: string, c: string) => ({ a, b, c });
        await expect($fn.throttle(testFn3)('a', 'b', 'c')).resolves.toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
    test('.debounce()', async () => {
        const fn1 = vi.fn();
        const testFn1 = $fn.debounce(fn1);
        for (let i = 0; i < 100; i++) void testFn1();
        expect(fn1).toHaveBeenCalledTimes(1); // Leading edge.
        await new Promise((resolve) => setTimeout(() => resolve(0), 1000));
        expect(fn1).toHaveBeenCalledTimes(2); // + trailing edge also.

        const fn2 = vi.fn();
        const testFn2 = $fn.debounce(fn2, { leadingEdge: false });
        for (let i = 0; i < 100; i++) void testFn2();
        expect(fn2).toHaveBeenCalledTimes(0); // Not on leading edge.
        await new Promise((resolve) => setTimeout(() => resolve(0), 1000));
        expect(fn2).toHaveBeenCalledTimes(1); // Only on trailing edge.

        const testFn3 = (a: string, b: string, c: string) => ({ a, b, c });
        await expect($fn.debounce(testFn3)('a', 'b', 'c')).resolves.toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
    test('.memo()', async () => {
        const fn1Mock = vi.fn((): boolean => true);
        const fn1 = $fn.memo({ maxSize: 1 }, fn1Mock);

        expect(fn1()).toBe(true);
        expect(fn1()).toBe(true);
        expect(fn1Mock).toHaveBeenCalledTimes(1);

        const fn2Mock = vi.fn((rtn: boolean): boolean => rtn);
        const fn2 = $fn.memo({ maxSize: 2 }, fn2Mock);

        expect(fn2(true)).toBe(true);
        expect(fn2(false)).toBe(false);
        expect(fn2(true)).toBe(true);
        expect(fn2(false)).toBe(false);
        expect(fn2Mock).toHaveBeenCalledTimes(2);

        const fn3Mock = vi.fn((rtn: { value: [boolean] }): boolean => rtn.value[0]);
        const fn3 = $fn.memo({ maxSize: 2, deep: true }, fn3Mock);

        expect(fn3({ value: [true] })).toBe(true);
        expect(fn3({ value: [false] })).toBe(false);
        expect(fn3({ value: [true] })).toBe(true);
        expect(fn3({ value: [false] })).toBe(false);
        expect(fn3Mock).toHaveBeenCalledTimes(2);
    });
});
