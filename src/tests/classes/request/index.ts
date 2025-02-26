/**
 * Test suite.
 */

import { $http, $time } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('Request', async () => {
    test('Request{1}', async () => {
        const request1 = new Request('https://localhost:3000/');
        expect(request1.url).toBe('https://localhost:3000/');
        expect(request1.method).toBe('GET');
        expect(request1.c10n).toBe(undefined);
        expect($http.requestTypeIsCacheable(request1)).toBe(true);
    });
    test('Request{2}', async () => {
        const request1 = new Request(new URL('https://localhost:3000/'));
        expect(request1.url).toBe('https://localhost:3000/');
        expect(request1.method).toBe('GET');
        expect(request1.c10n).toBe(undefined);
        expect($http.requestTypeIsCacheable(request1)).toBe(true);
    });
    test('Request{3}', async () => {
        const request1 = new Request(new Request(new URL('https://localhost:3000/')));
        expect(request1.url).toBe('https://localhost:3000/');
        expect(request1.method).toBe('GET');
        expect(request1.c10n).toBe(undefined);
        expect($http.requestTypeIsCacheable(request1)).toBe(true);
    });
    test('Request{4}', async () => {
        const request1 = new Request('https://localhost:3000/', {
            method: 'POST',
        });
        expect(request1.url).toBe('https://localhost:3000/');
        expect(request1.method).toBe('POST');
        expect(request1.c10n).toStrictEqual(undefined);
        expect($http.requestTypeIsCacheable(request1)).toBe(false);
    });
    test('Request{5}', async () => {
        const request1 = new Request('https://localhost:3000/', {
            method: 'GET',
            c10n: {
                kvOptions: {
                    cacheTtl: $time.hourInSeconds,
                },
            },
        });
        expect(request1.url).toBe('https://localhost:3000/');
        expect(request1.method).toBe('GET');
        expect(request1.c10n).toStrictEqual({
            kvOptions: {
                cacheTtl: $time.hourInSeconds,
            },
        });
        expect($http.requestTypeIsCacheable(request1)).toBe(true);
    });
    test('Request{6}', async () => {
        const request1 = new Request('https://localhost:3000/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            c10n: {
                kvOptions: {
                    cacheTtl: -1,
                },
            },
        });
        expect(request1.url).toBe('https://localhost:3000/');
        expect(request1.method).toBe('POST');
        expect(request1.c10n).toStrictEqual({
            kvOptions: {
                cacheTtl: -1,
            },
        });
        expect($http.requestTypeIsCacheable(request1)).toBe(false);
    });
    test('Request{7}', async () => {
        const request1 = new Request('https://localhost:3000/', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            c10n: {
                kvOptions: {
                    cacheTtl: -1,
                },
            },
        });
        expect(request1.url).toBe('https://localhost:3000/');
        expect(request1.method).toBe('POST');
        expect(request1.c10n).toStrictEqual({
            kvOptions: {
                cacheTtl: -1,
            },
        });
        expect($http.requestTypeIsCacheable(request1)).toBe(false);

        const request2 = new Request('https://localhost:3000/', request1);
        expect(request2.url).toBe('https://localhost:3000/');
        expect(request2.method).toBe('POST');
        expect(request2.c10n).toStrictEqual({
            kvOptions: {
                cacheTtl: -1,
            },
        });
        expect($http.requestTypeIsCacheable(request2)).toBe(false);
    });
});
