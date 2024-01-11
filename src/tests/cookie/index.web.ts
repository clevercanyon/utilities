/**
 * Test suite.
 */

import { $cookie, $env } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$cookie', async () => {
    test('env', async () => {
        expect($env.isWeb()).toBe(true);
    });
    test('.parse()', async () => {
        expect($cookie.parse()).toStrictEqual({});
        expect($cookie.set('a', 'a')).toBe(undefined);
        expect($cookie.set('b', 'b')).toBe(undefined);
        expect($cookie.set('c', 'c')).toBe(undefined);
        expect($cookie.parse()).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
    test('.set()', async () => {
        expect($cookie.set('a', 'a')).toBe(undefined);
        expect($cookie.set('b', 'b')).toBe(undefined);
        expect($cookie.set('c', 'c')).toBe(undefined);
        expect($cookie.parse()).toStrictEqual({ a: 'a', b: 'b', c: 'c' });
    });
    test('.get()', async () => {
        expect($cookie.set('a', 'a')).toBe(undefined);
        expect($cookie.set('b', 'b')).toBe(undefined);
        expect($cookie.set('c', 'c')).toBe(undefined);

        expect($cookie.get('a')).toBe('a');
        expect($cookie.get('b')).toBe('b');
        expect($cookie.get('c')).toBe('c');
    });
    test('.delete()', async () => {
        expect($cookie.set('a', 'a')).toBe(undefined);
        expect($cookie.set('b', 'b')).toBe(undefined);
        expect($cookie.set('c', 'c')).toBe(undefined);

        expect($cookie.delete('a')).toBe(undefined);
        expect($cookie.get('a')).toBe('');
        expect($cookie.get('b')).toBe('b');
        expect($cookie.get('c')).toBe('c');
    });
    test('.nameIsValid()', async () => {
        expect($cookie.nameIsValid('a')).toBe(true);
        expect($cookie.nameIsValid('b')).toBe(true);
        expect($cookie.nameIsValid('c')).toBe(true);
        expect($cookie.nameIsValid('0')).toBe(true);
        expect($cookie.nameIsValid('1')).toBe(true);
        expect($cookie.nameIsValid('~')).toBe(false);
    });
});
