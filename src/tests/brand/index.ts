/**
 * Test suite.
 */

import { describe, expect, test } from 'vitest';
import { $app, $brand, $is, $obj } from '../../index.ts';

describe('$brand', async () => {
    test('.get()', async () => {
        const brand = $brand.get('&');

        expect($obj.tag(brand)).toBe($app.pkgName + '/Brand');
        expect(brand.org).toBe(brand); // Circular.
        expect($is.string(brand.n7m)).toBe(true);
    });
});
