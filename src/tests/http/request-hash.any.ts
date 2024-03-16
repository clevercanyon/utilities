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
        ).toBe('1c7c52306c62bf93a0b86476922d76ccad58c183');

        expect(
            await $http.requestHash(
                new Request('https://y.tld/'), //
            ),
        ).toBe('4ceedadd4a1d6e0f69f549b2e9fa59280be69145');

        // ---

        const hash932cedfb = '932cedfb51a4f5fdf07be8506fb2bea06d28c58d';
        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    redirect: 'manual',
                    headers: { 'foo': 'foo', 'bar': 'bar' },
                }),
            ),
        ).toBe(hash932cedfb);

        expect(
            await $http.requestHash(
                new Request('https://x.tld/', {
                    headers: { 'bar': 'bar', 'foo': 'foo' },
                    redirect: 'manual',
                }),
            ),
        ).toBe(hash932cedfb);

        // ---

        const hash86ae5ff4 = '86ae5ff4e0b389212a8b5e1675b1188d0336751d';
        expect(
            await $http.requestHash(
                new Request('https://x.tld/?foo=&bar=.*_+%3D%60%21%40%24%25%5E%7C%3C%3E%3F%2C%3A%3B%27%22%28%29%7B%7D%5B%5D%5C%2F', {
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
        ).toBe(hash86ae5ff4);

        expect(
            await $http.requestHash(
                new Request('https://x.tld/?bar=.*_+%3D%60%21%40%24%25%5E%7C%3C%3E%3F%2C%3A%3B%27%22%28%29%7B%7D%5B%5D%5C%2F&foo', {
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
        ).toBe(hash86ae5ff4);
    });
});
