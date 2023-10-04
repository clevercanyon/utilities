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
    test('.addApp()', async () => {
        const slug = $brand.addApp({
            org: 'hop',
            type: 'site',
            pkgName: '@foo/bar-baz.buz',
        });
        expect(slug).toBe('bar-baz-buz');

        const brand = $brand.get(slug);
        expect(brand.org).toBe($brand.get('hop'));
        expect(brand.org.org).toBe($brand.get('&'));
        expect($obj.tag(brand)).toBe($app.pkgName + '/Brand');
    });
});
