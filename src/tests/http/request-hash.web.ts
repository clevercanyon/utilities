/**
 * Test suite.
 */

import { $http } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$http', async () => {
    test('.requestHash()', async () => {
        expect(
            await $http.requestHash(
                new Request('https://x.tld/'), //
            ),
        ).toBe('040647e4b50c92026667047e3e6414f9bc6687a1');

        expect(
            await $http.requestHash(
                new Request('https://y.tld/'), //
            ),
        ).toBe('d1d50afb30d73ba631e6d2840323f6fc09a29c90');

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    redirect: 'manual',
                    headers: { 'foo': 'foo', 'bar': 'bar' },
                }),
            ),
        ).toBe('34187aa82135e8e0f8ba3b44dc49ed77b3fd0fb1');

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    headers: { 'bar': 'bar', 'foo': 'foo' },
                    redirect: 'manual',
                }),
            ),
        ).toBe('34187aa82135e8e0f8ba3b44dc49ed77b3fd0fb1');

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    method: 'POST',
                    redirect: 'manual',
                    headers: {
                        'foo': 'foo',
                        'bar': 'bar',
                        'content-type': 'text/plain; charset=utf-8',
                    },
                    body: 'body',
                }),
            ),
        ).toBe('1d3a8d27cea851282d31c7c4e507ed04b0d94efb');

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    redirect: 'manual',
                    method: 'POST',
                    headers: {
                        'bar': 'bar',
                        'foo': 'foo',
                        'content-type': 'text/plain; charset=utf-8',
                    },
                    body: 'body',
                }),
            ),
        ).toBe('1d3a8d27cea851282d31c7c4e507ed04b0d94efb');
    });
});
