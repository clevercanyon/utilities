/**
 * Test suite.
 */

import { $cookie } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$cookie', async () => {
    test('.set()', async () => {
        const request1 = new Request('https://x.tld/'),
            response1 = new Response(),
            headers1 = response1.headers;

        $cookie.set('foo', 'bar', { request: request1, responseHeaders: headers1, httpOnly: true });
        expect(headers1.getSetCookie()).toStrictEqual(['foo=bar; domain=x.tld; path=/; max-age=31536000; samesite=lax; secure; httpOnly']);
    });
});
