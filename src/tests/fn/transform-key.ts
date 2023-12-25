/**
 * Test suite.
 */

import { $env, $fn } from '#index.ts';
import { describe, expect, test, vi } from 'vitest';

describe('$fn', async () => {
    test('.memo() w/ isMatchingKey() 1', async () => {
        const fnMock = vi.fn((): boolean => true);
        const fn = $fn.memo(
            {
                maxSize: 3,
                transformKey: (args: unknown[]): unknown[] => {
                    return args.concat([$env.get('_TEST')]);
                },
            },
            fnMock,
        );
        $env.set('_TEST', 'foo');
        expect(fn()).toBe(true);

        $env.set('_TEST', 'bar');
        expect(fn()).toBe(true);

        $env.set('_TEST', 'foo');
        expect(fn()).toBe(true);

        expect(fnMock).toHaveBeenCalledTimes(2);

        $env.unset('_TEST'); // Cleanup.
    });
    test('.memo() w/ isMatchingKey() 2', async () => {
        const fnMock = vi.fn((unusedꓺone: number, unusedꓺtwo: string): boolean => true);
        const fn = $fn.memo(
            {
                deep: true,
                maxSize: 3,
                transformKey: (args: unknown[]): unknown[] => {
                    return args.concat([$env.get('_TEST')]);
                },
            },
            fnMock,
        );
        $env.set('_TEST', 'foo');
        expect(fn(1, 'two')).toBe(true);

        $env.set('_TEST', 'bar');
        expect(fn(1, 'two')).toBe(true);

        $env.set('_TEST', 'foo');
        expect(fn(1, 'two')).toBe(true);

        expect(fnMock).toHaveBeenCalledTimes(2);

        $env.unset('_TEST'); // Cleanup.
    });
    test('.memo() w/ isMatchingKey() 3', async () => {
        const fnMock = vi.fn((unusedꓺone: number, unusedꓺtwo: string, unusedꓺthree: object): boolean => true);
        const fn = $fn.memo(
            {
                deep: true,
                maxSize: 3,
                transformKey: (args: unknown[]): unknown[] => {
                    return args.concat([$env.get('_TEST')]);
                },
            },
            fnMock,
        );
        $env.set('_TEST', 'foo');
        expect(fn(1, 'two', { a: 'a', b: 'b', c: 'c' })).toBe(true);

        $env.set('_TEST', 'bar');
        expect(fn(1, 'two', { a: 'a', b: 'b', c: 'c' })).toBe(true);

        $env.set('_TEST', 'foo');
        expect(fn(1, 'two', { a: 'a', b: 'b', c: 'c' })).toBe(true);

        expect(fnMock).toHaveBeenCalledTimes(2);

        $env.unset('_TEST'); // Cleanup.
    });
});
