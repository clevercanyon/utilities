/**
 * Test suite.
 */

import { $app, $brand, $env, $is, $obj, $url } from '#index.ts';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppR2OriginURL__ = $env.get('APP_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppR2BaseURL__ = $env.get('APP_R2_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$brand', async () => {
    beforeAll(async () => {
        $env.set('APP_PKG_NAME', '@clevercanyon/x.tld');
        $env.set('APP_BASE_URL', 'https://x.tld/base/');
        $env.set('APP_R2_ORIGIN_URL', 'https://r2.tld');
        $env.set('APP_R2_BASE_URL', 'https://r2.tld/base/');
        $env.set('APP_BRAND_PROPS', { type: 'site' });
        $env.set('APP_BRAND', $brand.addApp());
    });
    afterAll(async () => {
        $env.set('APP_PKG_NAME', __origAppPkgName__);
        $env.set('APP_BASE_URL', __origAppBaseURL__);
        $env.set('APP_R2_ORIGIN_URL', __origAppR2OriginURL__);
        $env.set('APP_R2_BASE_URL', __origAppR2BaseURL__);
        $env.set('APP_BRAND_PROPS', __origAppBrandProps__);
        $env.set('APP_BRAND', __origAppBrand__);
        $brand.remove('@clevercanyon/x.tld');

        $app.pkgName.flush(), //
            $app.pkgName.flush(),
            $app.pkgSlug.flush(),
            //
            $app.hasBaseURL.flush(),
            $app.baseURL.flush(),
            //
            $app.hasR2OriginURL.flush(),
            $app.r2OriginURL.flush(),
            //
            $app.hasR2BaseURL.flush(),
            $app.r2BaseURL.flush(),
            //
            $app.hasBrandProps.flush(),
            $app.brandProps.flush(),
            $app.brand.flush(),
            //
            $url.appBasePath.flush(),
            $url.fromAppBase.flush(),
            $url.pathFromAppBase.flush(),
            $url.addAppBasePath.flush(),
            $url.removeAppBasePath.flush();
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
