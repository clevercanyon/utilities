/**
 * Test suite.
 */

import { $cookie } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$cookie', async () => {
    test('.header()', async () => {
        expect(
            $cookie.header(new Request('https://x.tld/'), 'foo', 'bar', {
                httpOnly: true,
            }),
        ).toBe('foo=bar; domain=x.tld; path=/; max-age=31536000; samesite=lax; secure; httpOnly');
    });
});
