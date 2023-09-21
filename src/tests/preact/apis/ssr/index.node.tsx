/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import * as $preactꓺapisꓺssr from '../../../../preact/apis/ssr.tsx';

describe('$preactꓺapisꓺssr', async () => {
    test('.renderToString()', async () => {
        expect($preactꓺapisꓺssr.renderToString(<html lang='en'></html>)).toBe('<html lang="en"></html>');
    });
});
