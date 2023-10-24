/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $preact } from '../../../../index.ts';

describe('$preact.ssr', async () => {
    test('.renderToString()', async () => {
        expect($preact.ssr.renderToString(<html lang='en-US'></html>)).toBe('<html lang="en-US"></html>');
    });
});
