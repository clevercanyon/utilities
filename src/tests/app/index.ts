/**
 * Test suite.
 */

import { $app, $is } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$app', async () => {
    test('.pkgName', async () => {
        expect($is.string($app.$pkgName)).toBe(true);
    });
    test('.pkgSlug()', async () => {
        expect($app.pkgSlug('workers.o5p.me')).toBe('workers-o5p-me');
    });
});
