/**
 * Test suite.
 */

import { $ } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$', async () => {
    test('.string()', async () => {
        const schema = $.pipe($.string(), $.minBytes(3)),
            value = $.parse(schema, '123'),
            safeValue = $.safeParse(schema, '123');

        expect($.is(schema, value)).toBe(true);
        expect($.is(schema, safeValue.output)).toBe(true);
    });
    test('.object()', async () => {
        const schema = $.object({
                string: $.pipe($.string(), $.minBytes(3)),
            }),
            value = $.parse(schema, { string: '123' }),
            safeValue = $.safeParse(schema, { string: '123' });

        expect($.is(schema, value)).toBe(true);
        expect($.is(schema, safeValue.output)).toBe(true);
    });
});
