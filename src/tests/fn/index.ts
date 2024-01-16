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
        expect($fn.try(() => { throw Error(); }, 'abc')()).toBe('abc'); // prettier-ignore
        expect($fn.try(() => { throw Error(); })()).toBeInstanceOf(Error); // prettier-ignore
        expect($fn.try(() => { throw Error(); }, undefined, {throwOnError: true})).toThrowError(); // prettier-ignore

        await expect($fn.try(async () => null)()).resolves.toBe(null);
        await expect($fn.try(async () => undefined)()).resolves.toBe(undefined);
        await expect($fn.try(async (v: string) => v)('abc')).resolves.toBe('abc');
        await expect($fn.try(async () => { throw Error(); }, 'abc')()).resolves.toBe('abc'); // prettier-ignore
        await expect($fn.try(async () => { throw Error(); })()).resolves.toBeInstanceOf(Error); // prettier-ignore
        await expect($fn.try(async () => { throw Error(); }, undefined, {throwOnError: true})()).rejects.toThrowError(); // prettier-ignore
    });
    test('.curry()', async () => {
        const testFn = (a: string, b: string, c: string) => ({ a, b, c });
        expect($fn.curry(testFn, 'a', 'b', 'c')()).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
        expect($fn.curry(testFn)('a')('b')('c')).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
        expect($fn.curry(testFn)('a', 'b', 'c')).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
    test(
        '.throttle()',
        async () => {
            const fn1 = vi.fn();
            const testFn1 = $fn.throttle(fn1);
            for (let i = 0; i < 100; i++) void testFn1();
            expect(fn1).toHaveBeenCalledTimes(0); // On trailing edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn1).toHaveBeenCalledTimes(1); // Ensure trailing edge only.

            // ---

            const fn2 = vi.fn();
            const testFn2 = $fn.throttle(fn2, { edge: 'leading' });
            for (let i = 0; i < 100; i++) void testFn2();
            expect(fn2).toHaveBeenCalledTimes(1); // On leading edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn2).toHaveBeenCalledTimes(1); // Ensure leading edge only.

            // ---

            const fn3 = vi.fn();
            const testFn3 = $fn.throttle(fn3, { edge: 'trailing' });
            for (let i = 0; i < 100; i++) void testFn3();
            expect(fn3).toHaveBeenCalledTimes(0); // On trailing edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn3).toHaveBeenCalledTimes(1); // Ensure trailing edge only.

            // ---

            // This simply tests return value.
            const testFn4 = (a: string, b: string, c: string) => ({ a, b, c });
            await expect($fn.throttle(testFn4)('a', 'b', 'c')).resolves.toStrictEqual({ a: 'a', b: 'b', c: 'c' });

            // ---

            const fn5 = vi.fn(),
                fn5Wrapper = async (str: string): Promise<string> => {
                    return new Promise((resolve): void => {
                        setTimeout((): void => {
                            fn5(); // Mock.
                            resolve(str);
                        }, 500);
                    });
                };
            const testFn5 = $fn.throttle(fn5Wrapper);
            for (let i = 0; i < 100; i++) void testFn5('x');
            expect(fn5).toHaveBeenCalledTimes(0); // Not yet.
            expect(await testFn5('y')).toBe('y'); // Trailing args.
            expect(fn5).toHaveBeenCalledTimes(1); // On trailing edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn5).toHaveBeenCalledTimes(1); // Ensure trailing edge only.

            // ---

            const fn6 = vi.fn(),
                fn6Wrapper = async (str: string): Promise<string> => {
                    return new Promise((resolve): void => {
                        setTimeout((): void => {
                            fn6(); // Mock.
                            resolve(str);
                        }, 500);
                    });
                };
            const testFn6 = $fn.throttle(fn6Wrapper, { edge: 'leading' });
            for (let i = 0; i < 100; i++) void testFn6('x');
            expect(fn6).toHaveBeenCalledTimes(0); // Not yet.
            expect(await testFn6('y')).toBe('x'); // Leading args.
            expect(fn6).toHaveBeenCalledTimes(1); // On leading edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn6).toHaveBeenCalledTimes(1); // Ensure leading edge only.
        },
        { timeout: 10000 },
    );
    test(
        '.debounce()',
        async () => {
            const fn1 = vi.fn();
            const testFn1 = $fn.debounce(fn1);
            for (let i = 0; i < 100; i++) void testFn1();
            expect(fn1).toHaveBeenCalledTimes(0); // On trailing edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn1).toHaveBeenCalledTimes(1); // Ensure trailing edge only.

            // ---

            const fn2 = vi.fn();
            const testFn2 = $fn.debounce(fn2, { edge: 'trailing' });
            for (let i = 0; i < 100; i++) void testFn2();
            expect(fn2).toHaveBeenCalledTimes(0); // On trailing edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn2).toHaveBeenCalledTimes(1); // Ensure trailing edge only.

            // ---

            const fn3 = vi.fn();
            const testFn3 = $fn.debounce(fn3, { edge: 'leading' });
            for (let i = 0; i < 100; i++) void testFn3();
            expect(fn3).toHaveBeenCalledTimes(1); // Only on leading edge.
            await new Promise((resolve) => setTimeout(() => resolve(0), 500));
            expect(fn3).toHaveBeenCalledTimes(1); // Ensure leading edge only.

            // ---

            // This simply tests return value.
            const testFn4 = (a: string, b: string, c: string) => ({ a, b, c });
            await expect($fn.debounce(testFn4)('a', 'b', 'c')).resolves.toStrictEqual({ a: 'a', b: 'b', c: 'c' });
        },
        { timeout: 10000 },
    );
    test('.once()', async () => {
        const fn1Mock = vi.fn((arg1?: string, arg2?: string): boolean => (arg1 && arg2 ? true : false));
        const fn1 = $fn.once(fn1Mock);

        expect(fn1('a', 'a')).toBe(true);
        expect(fn1('a', 'b')).toBe(true);
        expect(fn1('a', 'c')).toBe(true);
        expect(fn1('a', 'd')).toBe(true);
        expect(fn1()).toBe(true);
        expect(fn1('a')).toBe(true);
        expect(fn1(undefined, 'b')).toBe(true);
        expect(fn1Mock).toHaveBeenCalledTimes(1);
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
