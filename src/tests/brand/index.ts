/**
 * Test suite.
 */

import { $app, $brand, $env, $is, $obj, $url } from '#index.ts';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$brand', async () => {
    beforeAll(async () => {
        $env.set('APP_PKG_NAME', '@clevercanyon/x.tld');
        $env.set('APP_BASE_URL', 'https://x.tld/base/');
        $env.set('APP_BRAND_PROPS', {});
        $app.adaptBrand.fresh('x.tld');
    });
    afterAll(async () => {
        $env.set('APP_PKG_NAME', __origAppPkgName__);
        $env.set('APP_BASE_URL', __origAppBaseURL__);
        $env.set('APP_BRAND_PROPS', __origAppBrandProps__);
        $env.set('APP_BRAND', __origAppBrand__);
        $brand.remove('@clevercanyon/x.tld');

        $app.pkgName.flush(), //
            $app.pkgSlug.flush(),
            $app.baseURL.flush(),
            $url.appBasePath.flush(),
            $url.fromAppBase.flush(),
            $url.pathFromAppBase.flush(),
            $app.adaptBrand.flush(),
            $app.brandProps.flush(),
            $app.brand.flush();
    });
    test('.get()', async () => {
        const brand = $brand.get('&');

        expect($obj.tag(brand)).toBe($app.$pkgName + '/Brand');
        expect(brand.org).toBe(brand); // Circular.
        expect($is.string(brand.n7m)).toBe(true);
    });
    test('.addApp()', async () => {
        const brand = $brand.addApp({
            pkgName: '@foo/bar-baz.x.tld',
            baseURL: 'https://bar-baz.x.tld',
            props: {},
        });
        expect(brand.slug).toBe('bar-baz-x-tld');
        expect(brand.hostname).toBe('bar-baz.x.tld');
        expect(brand.org).toBe($brand.get('@clevercanyon/hop.gdn'));
        expect(brand.org.org).toBe($brand.get('&'));
        expect($obj.tag(brand)).toBe($app.$pkgName + '/Brand');

        $brand.remove(brand.pkgName);
    });
});
