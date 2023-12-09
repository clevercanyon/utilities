/**
 * Test suite.
 */

import { $app, $brand, $is, $obj } from '#index.ts';
import { describe, expect, test } from 'vitest';

describe('$brand', async () => {
    test('.get()', async () => {
        const brand = $brand.get('&');

        expect($obj.tag(brand)).toBe($app.pkgName + '/Brand');
        expect(brand.org).toBe(brand); // Circular.
        expect($is.string(brand.n7m)).toBe(true);
    });
    test('.addApp()', async () => {
        const brand = $brand.addApp({
            pkgName: '@foo/bar-baz.x.tld',
            baseURL: 'https://bar-baz.x.tld',
        });
        expect(brand.slug).toBe('bar-baz-x-tld');
        expect(brand.hostname).toBe('bar-baz.x.tld');
        expect(brand.org).toBe($brand.get('@clevercanyon/hop.gdn'));
        expect(brand.org.org).toBe($brand.get('&'));
        expect($obj.tag(brand)).toBe($app.pkgName + '/Brand');
    });
});
