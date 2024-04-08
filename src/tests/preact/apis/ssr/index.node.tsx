/**
 * Test suite.
 */

import { $preact } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$preact.ssr', async () => {
    test('.renderToString()', async () => {
        expect(await $preact.ssr.renderToString(<html lang='en-US'></html>)).toBe('<html lang="en-US"></html>');
    });
});
