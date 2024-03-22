/**
 * Test suite.
 */

import { $app, $brand, $env, $url } from '#index.ts';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppRootR2OriginURL__ = $env.get('APP_ROOT_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppRootR2BaseURL__ = $env.get('APP_ROOT_R2_BASE_URL', { type: 'unknown' });
const __origAppR2OriginURL__ = $env.get('APP_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppR2BaseURL__ = $env.get('APP_R2_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$url', async () => {
    beforeAll(async () => {
        $env.set('APP_PKG_NAME', '@clevercanyon/x.tld');
        $env.set('APP_BASE_URL', 'https://x.tld/base/');
        $env.set('APP_ROOT_R2_ORIGIN_URL', 'https://r2.tld');
        $env.set('APP_ROOT_R2_BASE_URL', 'https://r2.tld/base/');
        $env.set('APP_R2_ORIGIN_URL', 'https://r2.tld');
        $env.set('APP_R2_BASE_URL', 'https://r2.tld/base/');
        $env.set('APP_BRAND_PROPS', { type: 'site' });
        $env.set('APP_BRAND', $brand.addApp());
    });
    afterAll(async () => {
        $env.set('APP_PKG_NAME', __origAppPkgName__);
        $env.set('APP_BASE_URL', __origAppBaseURL__);
        $env.set('APP_ROOT_R2_ORIGIN_URL', __origAppRootR2OriginURL__);
        $env.set('APP_ROOT_R2_BASE_URL', __origAppRootR2BaseURL__);
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
            $app.hasRootR2OriginURL.flush(),
            $app.rootR2OriginURL.flush(),
            //
            $app.hasRootR2BaseURL.flush(),
            $app.rootR2BaseURL.flush(),
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
    test('.appBase()', async () => {
        expect($app.baseURL()).toBe('https://x.tld/base/');
    });
    test('.appBasePath()', async () => {
        expect($url.appBasePath()).toBe('/base/');
    });
    test('.fromAppBase()', async () => {
        expect($url.fromAppBase('path')).toBe('https://x.tld/base/path');
        expect($url.fromAppBase('path/')).toBe('https://x.tld/base/path/');

        expect($url.fromAppBase('./path')).toBe('https://x.tld/base/path');
        expect($url.fromAppBase('./path/')).toBe('https://x.tld/base/path/');

        expect($url.fromAppBase('https://x.tld/path')).toBe('https://x.tld/path');
        expect($url.fromAppBase('https://x.tld/path/')).toBe('https://x.tld/path/');

        expect($url.fromAppBase(new URL('https://x.tld/path'))).toBe('https://x.tld/path');
        expect($url.fromAppBase(new URL('https://x.tld/path/'))).toBe('https://x.tld/path/');
    });
    test('.pathFromAppBase()', async () => {
        expect($url.pathFromAppBase('path')).toBe('/base/path');
        expect($url.pathFromAppBase('path/')).toBe('/base/path/');

        expect($url.pathFromAppBase('./path')).toBe('/base/path');
        expect($url.pathFromAppBase('./path/')).toBe('/base/path/');

        expect($url.pathFromAppBase('https://x.tld/path')).toBe('/path');
        expect($url.pathFromAppBase('https://x.tld/path/')).toBe('/path/');

        expect($url.pathFromAppBase(new URL('https://x.tld/path'))).toBe('/path');
        expect($url.pathFromAppBase(new URL('https://x.tld/path/'))).toBe('/path/');
    });
    test('.addAppBasePath()', async () => {
        expect($url.addAppBasePath('path')).toBe('/base/path');
        expect($url.addAppBasePath('path/')).toBe('/base/path/');

        expect($url.addAppBasePath('./path')).toBe('/base/path');
        expect($url.addAppBasePath('./path/')).toBe('/base/path/');

        expect($url.addAppBasePath('https://x.tld/path')).toBe('https://x.tld/base/path');
        expect($url.addAppBasePath('https://x.tld/path/')).toBe('https://x.tld/base/path/');

        expect($url.addAppBasePath(new URL('https://x.tld/path')) instanceof URL).toBe(true);
        expect($url.addAppBasePath(new URL('https://x.tld/path/')) instanceof URL).toBe(true);

        expect($url.addAppBasePath(new URL('https://x.tld/path')).toString()).toBe('https://x.tld/base/path');
        expect($url.addAppBasePath(new URL('https://x.tld/path/')).toString()).toBe('https://x.tld/base/path/');
    });
    test('.removeAppBasePath()', async () => {
        expect($url.removeAppBasePath('/base/path')).toBe('./path');
        expect($url.removeAppBasePath('/base/path/')).toBe('./path/');

        expect($url.removeAppBasePath('./base/path')).toBe('./path');
        expect($url.removeAppBasePath('./base/path/')).toBe('./path/');

        expect($url.removeAppBasePath('https://x.tld/base/path')).toBe('https://x.tld/path');
        expect($url.removeAppBasePath('https://x.tld/base/path/')).toBe('https://x.tld/path/');

        expect($url.removeAppBasePath(new URL('https://x.tld/base/path')) instanceof URL).toBe(true);
        expect($url.removeAppBasePath(new URL('https://x.tld/base/path/')) instanceof URL).toBe(true);

        expect($url.removeAppBasePath(new URL('https://x.tld/base/path')).toString()).toBe('https://x.tld/path');
        expect($url.removeAppBasePath(new URL('https://x.tld/base/path/')).toString()).toBe('https://x.tld/path/');
    });
    test('$app.rootR2OriginURL()', async () => {
        expect($app.rootR2OriginURL()).toBe('https://r2.tld');
    });
    test('.fromAppRootR2Origin()', async () => {
        expect($url.fromAppRootR2Origin('path')).toBe('https://r2.tld/path');
        expect($url.fromAppRootR2Origin('path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppRootR2Origin('./path')).toBe('https://r2.tld/path');
        expect($url.fromAppRootR2Origin('./path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppRootR2Origin('https://r2.tld/path')).toBe('https://r2.tld/path');
        expect($url.fromAppRootR2Origin('https://r2.tld/path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppRootR2Origin(new URL('https://r2.tld/path'))).toBe('https://r2.tld/path');
        expect($url.fromAppRootR2Origin(new URL('https://r2.tld/path/'))).toBe('https://r2.tld/path/');
    });
    test('.pathFromAppRootR2Origin()', async () => {
        expect($url.pathFromAppRootR2Origin('path')).toBe('/path');
        expect($url.pathFromAppRootR2Origin('path/')).toBe('/path/');

        expect($url.pathFromAppRootR2Origin('./path')).toBe('/path');
        expect($url.pathFromAppRootR2Origin('./path/')).toBe('/path/');

        expect($url.pathFromAppRootR2Origin('https://r2.tld/path')).toBe('/path');
        expect($url.pathFromAppRootR2Origin('https://r2.tld/path/')).toBe('/path/');

        expect($url.pathFromAppRootR2Origin(new URL('https://r2.tld/path'))).toBe('/path');
        expect($url.pathFromAppRootR2Origin(new URL('https://r2.tld/path/'))).toBe('/path/');
    });
    test('$app.rootR2BaseURL()', async () => {
        expect($app.rootR2BaseURL()).toBe('https://r2.tld/base/');
    });
    test('.appRootR2BasePath()', async () => {
        expect($url.appRootR2BasePath()).toBe('/base/');
    });
    test('.fromAppRootR2Base()', async () => {
        expect($url.fromAppRootR2Base('path')).toBe('https://r2.tld/base/path');
        expect($url.fromAppRootR2Base('path/')).toBe('https://r2.tld/base/path/');

        expect($url.fromAppRootR2Base('./path')).toBe('https://r2.tld/base/path');
        expect($url.fromAppRootR2Base('./path/')).toBe('https://r2.tld/base/path/');

        expect($url.fromAppRootR2Base('https://r2.tld/path')).toBe('https://r2.tld/path');
        expect($url.fromAppRootR2Base('https://r2.tld/path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppRootR2Base(new URL('https://r2.tld/path'))).toBe('https://r2.tld/path');
        expect($url.fromAppRootR2Base(new URL('https://r2.tld/path/'))).toBe('https://r2.tld/path/');
    });
    test('.pathFromAppRootR2Base()', async () => {
        expect($url.pathFromAppRootR2Base('path')).toBe('/base/path');
        expect($url.pathFromAppRootR2Base('path/')).toBe('/base/path/');

        expect($url.pathFromAppRootR2Base('./path')).toBe('/base/path');
        expect($url.pathFromAppRootR2Base('./path/')).toBe('/base/path/');

        expect($url.pathFromAppRootR2Base('https://r2.tld/path')).toBe('/path');
        expect($url.pathFromAppRootR2Base('https://r2.tld/path/')).toBe('/path/');

        expect($url.pathFromAppRootR2Base(new URL('https://r2.tld/path'))).toBe('/path');
        expect($url.pathFromAppRootR2Base(new URL('https://r2.tld/path/'))).toBe('/path/');
    });
    test('.addAppRootR2BasePath()', async () => {
        expect($url.addAppRootR2BasePath('path')).toBe('/base/path');
        expect($url.addAppRootR2BasePath('path/')).toBe('/base/path/');

        expect($url.addAppRootR2BasePath('./path')).toBe('/base/path');
        expect($url.addAppRootR2BasePath('./path/')).toBe('/base/path/');

        expect($url.addAppRootR2BasePath('https://r2.tld/path')).toBe('https://r2.tld/base/path');
        expect($url.addAppRootR2BasePath('https://r2.tld/path/')).toBe('https://r2.tld/base/path/');

        expect($url.addAppRootR2BasePath(new URL('https://r2.tld/path')) instanceof URL).toBe(true);
        expect($url.addAppRootR2BasePath(new URL('https://r2.tld/path/')) instanceof URL).toBe(true);

        expect($url.addAppRootR2BasePath(new URL('https://r2.tld/path')).toString()).toBe('https://r2.tld/base/path');
        expect($url.addAppRootR2BasePath(new URL('https://r2.tld/path/')).toString()).toBe('https://r2.tld/base/path/');
    });
    test('.removeAppRootR2BasePath()', async () => {
        expect($url.removeAppRootR2BasePath('/base/path')).toBe('./path');
        expect($url.removeAppRootR2BasePath('/base/path/')).toBe('./path/');

        expect($url.removeAppRootR2BasePath('./base/path')).toBe('./path');
        expect($url.removeAppRootR2BasePath('./base/path/')).toBe('./path/');

        expect($url.removeAppRootR2BasePath('https://r2.tld/base/path')).toBe('https://r2.tld/path');
        expect($url.removeAppRootR2BasePath('https://r2.tld/base/path/')).toBe('https://r2.tld/path/');

        expect($url.removeAppRootR2BasePath(new URL('https://r2.tld/base/path')) instanceof URL).toBe(true);
        expect($url.removeAppRootR2BasePath(new URL('https://r2.tld/base/path/')) instanceof URL).toBe(true);

        expect($url.removeAppRootR2BasePath(new URL('https://r2.tld/base/path')).toString()).toBe('https://r2.tld/path');
        expect($url.removeAppRootR2BasePath(new URL('https://r2.tld/base/path/')).toString()).toBe('https://r2.tld/path/');
    });
    test('$app.r2OriginURL()', async () => {
        expect($app.r2OriginURL()).toBe('https://r2.tld');
    });
    test('.fromAppR2Origin()', async () => {
        expect($url.fromAppR2Origin('path')).toBe('https://r2.tld/path');
        expect($url.fromAppR2Origin('path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppR2Origin('./path')).toBe('https://r2.tld/path');
        expect($url.fromAppR2Origin('./path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppR2Origin('https://r2.tld/path')).toBe('https://r2.tld/path');
        expect($url.fromAppR2Origin('https://r2.tld/path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppR2Origin(new URL('https://r2.tld/path'))).toBe('https://r2.tld/path');
        expect($url.fromAppR2Origin(new URL('https://r2.tld/path/'))).toBe('https://r2.tld/path/');
    });
    test('.pathFromAppR2Origin()', async () => {
        expect($url.pathFromAppR2Origin('path')).toBe('/path');
        expect($url.pathFromAppR2Origin('path/')).toBe('/path/');

        expect($url.pathFromAppR2Origin('./path')).toBe('/path');
        expect($url.pathFromAppR2Origin('./path/')).toBe('/path/');

        expect($url.pathFromAppR2Origin('https://r2.tld/path')).toBe('/path');
        expect($url.pathFromAppR2Origin('https://r2.tld/path/')).toBe('/path/');

        expect($url.pathFromAppR2Origin(new URL('https://r2.tld/path'))).toBe('/path');
        expect($url.pathFromAppR2Origin(new URL('https://r2.tld/path/'))).toBe('/path/');
    });
    test('$app.r2BaseURL()', async () => {
        expect($app.r2BaseURL()).toBe('https://r2.tld/base/');
    });
    test('.appR2BasePath()', async () => {
        expect($url.appR2BasePath()).toBe('/base/');
    });
    test('.fromAppR2Base()', async () => {
        expect($url.fromAppR2Base('path')).toBe('https://r2.tld/base/path');
        expect($url.fromAppR2Base('path/')).toBe('https://r2.tld/base/path/');

        expect($url.fromAppR2Base('./path')).toBe('https://r2.tld/base/path');
        expect($url.fromAppR2Base('./path/')).toBe('https://r2.tld/base/path/');

        expect($url.fromAppR2Base('https://r2.tld/path')).toBe('https://r2.tld/path');
        expect($url.fromAppR2Base('https://r2.tld/path/')).toBe('https://r2.tld/path/');

        expect($url.fromAppR2Base(new URL('https://r2.tld/path'))).toBe('https://r2.tld/path');
        expect($url.fromAppR2Base(new URL('https://r2.tld/path/'))).toBe('https://r2.tld/path/');
    });
    test('.pathFromAppR2Base()', async () => {
        expect($url.pathFromAppR2Base('path')).toBe('/base/path');
        expect($url.pathFromAppR2Base('path/')).toBe('/base/path/');

        expect($url.pathFromAppR2Base('./path')).toBe('/base/path');
        expect($url.pathFromAppR2Base('./path/')).toBe('/base/path/');

        expect($url.pathFromAppR2Base('https://r2.tld/path')).toBe('/path');
        expect($url.pathFromAppR2Base('https://r2.tld/path/')).toBe('/path/');

        expect($url.pathFromAppR2Base(new URL('https://r2.tld/path'))).toBe('/path');
        expect($url.pathFromAppR2Base(new URL('https://r2.tld/path/'))).toBe('/path/');
    });
    test('.addAppR2BasePath()', async () => {
        expect($url.addAppR2BasePath('path')).toBe('/base/path');
        expect($url.addAppR2BasePath('path/')).toBe('/base/path/');

        expect($url.addAppR2BasePath('./path')).toBe('/base/path');
        expect($url.addAppR2BasePath('./path/')).toBe('/base/path/');

        expect($url.addAppR2BasePath('https://r2.tld/path')).toBe('https://r2.tld/base/path');
        expect($url.addAppR2BasePath('https://r2.tld/path/')).toBe('https://r2.tld/base/path/');

        expect($url.addAppR2BasePath(new URL('https://r2.tld/path')) instanceof URL).toBe(true);
        expect($url.addAppR2BasePath(new URL('https://r2.tld/path/')) instanceof URL).toBe(true);

        expect($url.addAppR2BasePath(new URL('https://r2.tld/path')).toString()).toBe('https://r2.tld/base/path');
        expect($url.addAppR2BasePath(new URL('https://r2.tld/path/')).toString()).toBe('https://r2.tld/base/path/');
    });
    test('.removeAppR2BasePath()', async () => {
        expect($url.removeAppR2BasePath('/base/path')).toBe('./path');
        expect($url.removeAppR2BasePath('/base/path/')).toBe('./path/');

        expect($url.removeAppR2BasePath('./base/path')).toBe('./path');
        expect($url.removeAppR2BasePath('./base/path/')).toBe('./path/');

        expect($url.removeAppR2BasePath('https://r2.tld/base/path')).toBe('https://r2.tld/path');
        expect($url.removeAppR2BasePath('https://r2.tld/base/path/')).toBe('https://r2.tld/path/');

        expect($url.removeAppR2BasePath(new URL('https://r2.tld/base/path')) instanceof URL).toBe(true);
        expect($url.removeAppR2BasePath(new URL('https://r2.tld/base/path/')) instanceof URL).toBe(true);

        expect($url.removeAppR2BasePath(new URL('https://r2.tld/base/path')).toString()).toBe('https://r2.tld/path');
        expect($url.removeAppR2BasePath(new URL('https://r2.tld/base/path/')).toString()).toBe('https://r2.tld/path/');
    });
    test('.isAbsolute()', async () => {
        expect($url.isAbsolute('::invalid::')).toBe(false);
        expect($url.isAbsolute('/path/xyz.ext')).toBe(false);
        expect($url.isAbsolute(new URL('https://abc.tld/path/xyz.ext'))).toBe(true);
        expect($url.isAbsolute('https://abc.tld/path/xyz.ext')).toBe(true);
        expect($url.isAbsolute('//abc.tld/path/xyz.ext')).toBe(true);
        expect($url.isAbsolute('//')).toBe(true);
        expect($url.isAbsolute('')).toBe(false);
    });
    test('.isProtoRelative()', async () => {
        expect($url.isProtoRelative('::invalid::')).toBe(false);
        expect($url.isProtoRelative('/path/xyz.ext')).toBe(false);
        expect($url.isProtoRelative(new URL('https://abc.tld/path/xyz.ext'))).toBe(false);
        expect($url.isProtoRelative('https://abc.tld/path/xyz.ext')).toBe(false);
        expect($url.isProtoRelative('//abc.tld/path/xyz.ext')).toBe(true);
        expect($url.isProtoRelative('//')).toBe(true);
        expect($url.isProtoRelative('')).toBe(false);
    });
    test('.isRootRelative()', async () => {
        expect($url.isRootRelative('::invalid::')).toBe(false);
        expect($url.isRootRelative('/path/xyz.ext')).toBe(true);
        expect($url.isRootRelative(new URL('https://abc.tld/path/xyz.ext'))).toBe(false);
        expect($url.isRootRelative('https://abc.tld/path/xyz.ext')).toBe(false);
        expect($url.isRootRelative('//abc.tld/path/xyz.ext')).toBe(false);
        expect($url.isRootRelative('/abc.tld/path/xyz.ext')).toBe(true);
        expect($url.isRootRelative('//')).toBe(false);
        expect($url.isRootRelative('/')).toBe(true);
        expect($url.isRootRelative('')).toBe(false);
    });
    test('.isRelative()', async () => {
        expect($url.isRelative('::invalid::')).toBe(true);
        expect($url.isRelative('/path/xyz.ext')).toBe(false);
        expect($url.isRelative(new URL('https://abc.tld/path/xyz.ext'))).toBe(false);
        expect($url.isRelative('https://abc.tld/path/xyz.ext')).toBe(false);
        expect($url.isRelative('//abc.tld/path/xyz.ext')).toBe(false);
        expect($url.isRelative('/abc.tld/path/xyz.ext')).toBe(false);
        expect($url.isRelative('./abc.tld/path/xyz.ext')).toBe(true);
        expect($url.isRelative('abc.tld/path/xyz.ext')).toBe(true);
        expect($url.isRelative('//')).toBe(false);
        expect($url.isRelative('/')).toBe(false);
        expect($url.isRelative('')).toBe(true);
    });
    test('.isPotentiallyTrustworthy()', async () => {
        expect($url.isPotentiallyTrustworthy('about:blank')).toBe(true);
        expect($url.isPotentiallyTrustworthy('about:srcdoc')).toBe(true);

        expect($url.isPotentiallyTrustworthy('https://x.tld/')).toBe(true);
        expect($url.isPotentiallyTrustworthy('wss://x.tld/')).toBe(true);

        expect($url.isPotentiallyTrustworthy('https://localhost/')).toBe(true);
        expect($url.isPotentiallyTrustworthy('http://localhost/')).toBe(true);

        expect($url.isPotentiallyTrustworthy('https://127.0.0.1/')).toBe(true);
        expect($url.isPotentiallyTrustworthy('http://127.0.0.1/')).toBe(true);

        expect($url.isPotentiallyTrustworthy('data:foo')).toBe(true);
        expect($url.isPotentiallyTrustworthy('blob:foo')).toBe(true);
        expect($url.isPotentiallyTrustworthy('file:foo')).toBe(true);
        expect($url.isPotentiallyTrustworthy('filesystem:foo')).toBe(true);

        expect($url.isPotentiallyTrustworthy('')).toBe(false);
        expect($url.isPotentiallyTrustworthy('::invalid::')).toBe(false);
        expect($url.isPotentiallyTrustworthy('http://x.tld/')).toBe(false);
        expect($url.isPotentiallyTrustworthy('http://123.456.789.000/')).toBe(false);
    });
    test('.rootHost()', async () => {
        expect($url.rootHost('abc.tld')).toBe('abc.tld');
        expect($url.rootHost('abc.Xyz.tld')).toBe('xyz.tld');

        expect($url.rootHost('Abc.xyz.tld:3000')).toBe('xyz.tld:3000');
        expect($url.rootHost('abc.Xyz.tld:3000', { withPort: false })).toBe('xyz.tld');

        expect($url.rootHost(new URL('https://abc.xyz.tld:3000/'))).toBe('xyz.tld:3000');
        expect($url.rootHost(new URL('https://abc.xyz.tld:3000/'), { withPort: false })).toBe('xyz.tld');

        expect($url.rootHost('abc.xyz.mac')).toBe('xyz.mac');
        expect($url.rootHost('abc.xyz.loc')).toBe('xyz.loc');
        expect($url.rootHost('abc.xyz.local')).toBe('local');
        expect($url.rootHost('abc.xyz.localhost')).toBe('localhost');

        expect($url.rootHost('Localhost')).toBe('localhost');
        expect($url.rootHost('Localhost:3000')).toBe('localhost:3000');
        expect($url.rootHost('Localhost:3000', { withPort: false })).toBe('localhost');

        expect($url.rootHost(new URL('https://Localhost/'))).toBe('localhost');
        expect($url.rootHost(new URL('https://Localhost:3000/'))).toBe('localhost:3000');
        expect($url.rootHost(new URL('https://Localhost:3000/'), { withPort: false })).toBe('localhost');
    });
    test('.parse()', async () => {
        expect(() => $url.parse('::invalid::')).toThrow();
        expect($url.parse(new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('https://abc.tld/path/xyz.ext').toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('//abc.tld/path/xyz.ext').toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('path/xyz.ext', '//abc.tld/').toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('./path/xyz.ext', '//abc.tld/').toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.parse('../path/xyz.ext', '//abc.tld/').toString()).toBe('https://abc.tld/path/xyz.ext');
    });
    test('.tryParse()', async () => {
        expect($url.tryParse('::invalid::')).toBe(undefined);
        expect($url.tryParse(new URL('https://abc.tld/path/xyz.ext'))?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.tryParse('https://abc.tld/path/xyz.ext')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.tryParse('//abc.tld/path/xyz.ext')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.tryParse('path/xyz.ext', '//abc.tld/')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.tryParse('./path/xyz.ext', '//abc.tld/')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.tryParse('../path/xyz.ext', '//abc.tld/')?.toString()).toBe('https://abc.tld/path/xyz.ext');
    });
    test('.toCanonical()', async () => {
        expect(() => $url.toCanonical('::invalid::')).toThrow();
        expect($url.toCanonical(new URL('https://abc.tld/path/xyz.ext?query#hash'))?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.toCanonical('https://abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.toCanonical('//abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.toCanonical('path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.toCanonical('./path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.toCanonical('../path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('https://abc.tld/path/xyz.ext');
    });
    test('.toPath()', async () => {
        expect(() => $url.toPath('::invalid::')).toThrow();
        expect($url.toPath(new URL('https://abc.tld/path/xyz.ext'))?.toString()).toBe('/path/xyz.ext');
        expect($url.toPath('https://abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('/path/xyz.ext');
        expect($url.toPath('//abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('/path/xyz.ext');
        expect($url.toPath('path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext');
        expect($url.toPath('./path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext');
        expect($url.toPath('../path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext');
    });
    test('.toPathQuery()', async () => {
        expect(() => $url.toPathQuery('::invalid::')).toThrow();
        expect($url.toPathQuery(new URL('https://abc.tld/path/xyz.ext'))?.toString()).toBe('/path/xyz.ext');
        expect($url.toPathQuery('https://abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('/path/xyz.ext?query');
        expect($url.toPathQuery('//abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('/path/xyz.ext?query');
        expect($url.toPathQuery('path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext?query');
        expect($url.toPathQuery('./path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext?query');
        expect($url.toPathQuery('../path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext?query');
    });
    test('.toPathQueryHash()', async () => {
        expect(() => $url.toPathQueryHash('::invalid::')).toThrow();
        expect($url.toPathQueryHash(new URL('https://abc.tld/path/xyz.ext'))?.toString()).toBe('/path/xyz.ext');
        expect($url.toPathQueryHash('https://abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('/path/xyz.ext?query#hash');
        expect($url.toPathQueryHash('//abc.tld/path/xyz.ext?query#hash')?.toString()).toBe('/path/xyz.ext?query#hash');
        expect($url.toPathQueryHash('path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext?query#hash');
        expect($url.toPathQueryHash('./path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext?query#hash');
        expect($url.toPathQueryHash('../path/xyz.ext?query#hash', '//abc.tld/')?.toString()).toBe('/path/xyz.ext?query#hash');
    });
    test('.getQueryVar()', async () => {
        expect($url.getQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc')).toBe('');
        expect($url.getQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toBe('a.b.c');
        expect($url.getQueryVar('abc', 'path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toBe('a.b.c');
        expect($url.getQueryVar('abc', './path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toBe('a.b.c');
        expect($url.getQueryVar('abc', '../path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toBe('a.b.c');
    });
    test('.getQueryVars()', async () => {
        expect($url.getQueryVars(['abc'], 'https://abc.tld/path/xyz.ext?abc')).toStrictEqual({ abc: '' });
        expect($url.getQueryVars(['abc'], 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toStrictEqual({ abc: 'a.b.c' });
        expect($url.getQueryVars(['abc'], 'path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toStrictEqual({ abc: 'a.b.c' });
        expect($url.getQueryVars(['abc'], './path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toStrictEqual({ abc: 'a.b.c' });
        expect($url.getQueryVars(['abc'], '../path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toStrictEqual({ abc: 'a.b.c' });
    });
    test('.addQueryVar()', async () => {
        expect($url.addQueryVar('abc', '', 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVar('abc', 'a.b.c', 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVar('abc', 'a.b.c', 'path/xyz.ext', 'https://abc.tld/')).toBe('/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVar('abc', 'a.b.c', './path/xyz.ext', 'https://abc.tld/')).toBe('/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVar('abc', 'a.b.c', '../path/xyz.ext', 'https://abc.tld/')).toBe('/path/xyz.ext?abc=a.b.c');

        expect($url.addQueryVar('abc', '', new URL('https://abc.tld/path/xyz.ext')) instanceof URL).toBe(true);
        expect($url.addQueryVar('abc', 'a.b.c', new URL('https://abc.tld/path/xyz.ext')) instanceof URL).toBe(true);
        expect($url.addQueryVar('abc', 'a.b.c', new URL('https://abc.tld/path/xyz.ext'), new URL('https://abc.tld/')) instanceof URL).toBe(true);

        expect($url.addQueryVar('abc', '', new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVar('abc', 'a.b.c', new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVar('abc', 'a.b.c', new URL('https://abc.tld/path/xyz.ext'), new URL('https://abc.tld/')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');

        expect($url.addQueryVar('abc', 'a.b.c', 'https://abc.tld/path/xyz.ext?abc=abc&y=0&x=0&z=0', '', { replaceExisting: false })).toBe(
            'https://abc.tld/path/xyz.ext?abc=abc&x=0&y=0&z=0',
        );
        expect($url.addQueryVar('abc', 'a.b.c', './path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'), { replaceExisting: false })).toBe(
            '/path/xyz.ext?abc=abc&x=0&y=0&z=0',
        );
        expect($url.addQueryVar('abc', 'a.b.c', '../path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'), { replaceExisting: true })).toBe(
            '/path/xyz.ext?abc=a.b.c&x=0&y=0&z=0',
        );
    });
    test('.addQueryVars()', async () => {
        expect($url.addQueryVars({ abc: '' }, 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVars({ abc: 'a.b.c' }, 'https://abc.tld/path/xyz.ext')).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVars({ abc: 'a.b.c' }, 'path/xyz.ext', 'https://abc.tld/')).toBe('/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVars({ abc: 'a.b.c' }, './path/xyz.ext', 'https://abc.tld/')).toBe('/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVars({ abc: 'a.b.c' }, '../path/xyz.ext', 'https://abc.tld/')).toBe('/path/xyz.ext?abc=a.b.c');

        expect($url.addQueryVars({ abc: '' }, new URL('https://abc.tld/path/xyz.ext')) instanceof URL).toBe(true);
        expect($url.addQueryVars({ abc: 'a.b.c' }, new URL('https://abc.tld/path/xyz.ext')) instanceof URL).toBe(true);
        expect($url.addQueryVars({ abc: 'a.b.c' }, new URL('https://abc.tld/path/xyz.ext'), new URL('https://abc.tld/')) instanceof URL).toBe(true);

        expect($url.addQueryVars({ abc: '' }, new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=');
        expect($url.addQueryVars({ abc: 'a.b.c' }, new URL('https://abc.tld/path/xyz.ext')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');
        expect($url.addQueryVars({ abc: 'a.b.c' }, new URL('https://abc.tld/path/xyz.ext'), new URL('https://abc.tld/')).toString()).toBe('https://abc.tld/path/xyz.ext?abc=a.b.c');

        expect($url.addQueryVars({ abc: 'a.b.c' }, 'https://abc.tld/path/xyz.ext?abc=abc&y=0&x=0&z=0', '', { replaceExisting: false })).toBe(
            'https://abc.tld/path/xyz.ext?abc=abc&x=0&y=0&z=0',
        );
        expect($url.addQueryVars({ abc: 'a.b.c' }, './path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'), { replaceExisting: false })).toBe(
            '/path/xyz.ext?abc=abc&x=0&y=0&z=0',
        );
        expect($url.addQueryVars({ abc: 'a.b.c' }, '../path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'), { replaceExisting: true })).toBe(
            '/path/xyz.ext?abc=a.b.c&x=0&y=0&z=0',
        );
        expect($url.addQueryVars({ abc: 'a:b:c' }, new URL('https://abc.tld/path/xyz.ext?abc=abc&y=0:0&x=0&z=0').toString())).toBe(
            'https://abc.tld/path/xyz.ext?abc=a%3Ab%3Ac&x=0&y=0%3A0&z=0',
        );
    });
    test('.removeQueryVar()', async () => {
        expect($url.removeQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc=')).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVar('abc', 'path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toBe('/path/xyz.ext');
        expect($url.removeQueryVar('abc', './path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toBe('/path/xyz.ext');
        expect($url.removeQueryVar('abc', '../path/xyz.ext?abc=a.b.c', 'https://abc.tld/')).toBe('/path/xyz.ext');

        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=')) instanceof URL).toBe(true);
        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=a.b.c')) instanceof URL).toBe(true);
        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=a.b.c'), new URL('https://abc.tld/')) instanceof URL).toBe(true);

        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=a.b.c')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVar('abc', new URL('https://abc.tld/path/xyz.ext?abc=a.b.c'), new URL('https://abc.tld/')).toString()).toBe('https://abc.tld/path/xyz.ext');

        expect($url.removeQueryVar('abc', 'https://abc.tld/path/xyz.ext?abc=abc&y=0&x=0&z=0', '')).toBe('https://abc.tld/path/xyz.ext?x=0&y=0&z=0');
        expect($url.removeQueryVar('abc', './path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'))).toBe('/path/xyz.ext?x=0&y=0&z=0');
        expect($url.removeQueryVar('abc', '../path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'))).toBe('/path/xyz.ext?x=0&y=0&z=0');
    });
    test('.removeQueryVars()', async () => {
        expect($url.removeQueryVars(['abc'], 'https://abc.tld/path/xyz.ext?abc=')).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVars(['abc'], 'https://abc.tld/path/xyz.ext?abc=a.b.c')).toBe('https://abc.tld/path/xyz.ext');

        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=')) instanceof URL).toBe(true);
        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=a.b.c')) instanceof URL).toBe(true);
        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=a.b.c'), new URL('https://abc.tld/')) instanceof URL).toBe(true);

        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=a.b.c')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeQueryVars(['abc'], new URL('https://abc.tld/path/xyz.ext?abc=a.b.c'), new URL('https://abc.tld/')).toString()).toBe('https://abc.tld/path/xyz.ext');

        expect($url.removeQueryVars(['abc'], 'https://abc.tld/path/xyz.ext?abc=abc&y=0&x=0&z=0', '')).toBe('https://abc.tld/path/xyz.ext?x=0&y=0&z=0');
        expect($url.removeQueryVars(['abc'], './path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'))).toBe('/path/xyz.ext?x=0&y=0&z=0');
        expect($url.removeQueryVars(['abc'], '../path/xyz.ext?abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'))).toBe('/path/xyz.ext?x=0&y=0&z=0');
    });
    test('.removeCSOQueryVars()', async () => {
        expect($url.removeCSOQueryVars('https://abc.tld/path/xyz.ext?utm_abc=&utm_xyz=')).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeCSOQueryVars('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z')).toBe('https://abc.tld/path/xyz.ext');

        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=&utm_xyz=')) instanceof URL).toBe(true);
        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z')) instanceof URL).toBe(true);
        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z', new URL('https://abc.tld/'))) instanceof URL).toBe(true);

        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=&utm_xyz=')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z')).toString()).toBe('https://abc.tld/path/xyz.ext');
        expect($url.removeCSOQueryVars(new URL('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z', new URL('https://abc.tld/'))).toString()).toBe(
            'https://abc.tld/path/xyz.ext',
        );
        expect($url.removeCSOQueryVars('https://abc.tld/path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z&abc=abc&y=0&x=0&z=0', '')).toBe(
            'https://abc.tld/path/xyz.ext?abc=abc&x=0&y=0&z=0',
        );
        expect($url.removeCSOQueryVars('./path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z&abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'))).toBe('/path/xyz.ext?abc=abc&x=0&y=0&z=0');
        expect($url.removeCSOQueryVars('../path/xyz.ext?utm_abc=a.b.c&utm_xyz=x.y.z&abc=abc&y=0&x=0&z=0', new URL('https://abc.tld/'))).toBe('/path/xyz.ext?abc=abc&x=0&y=0&z=0');
    });
    test('.encode()', async () => {
        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ')) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.queryRFC3986)) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.queryRFC3986AWS4)) //
			.toBe('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore

        expect($url.encode('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ', $url.queryRFC1738)) //
			.toBe('abcdefghijklmnopqrstuvwxyz+%F0%9F%A6%8A+%EA%93%BA+0123456789+%21%22%27%28%29%2A%7E+%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93'); // prettier-ignore
    });
    test('.decode()', async () => {
        expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93')) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

        expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.queryRFC3986)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

        expect($url.decode('abcdefghijklmnopqrstuvwxyz%20%F0%9F%A6%8A%20%EA%93%BA%200123456789%20%21%22%27%28%29%2A~%20%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.queryRFC3986AWS4)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore

        expect($url.decode('abcdefghijklmnopqrstuvwxyz+%F0%9F%A6%8A+%EA%93%BA+0123456789+%21%22%27%28%29%2A%7E+%C3%9F%C3%85%C3%A5%C3%86%C3%A6%C5%93', $url.queryRFC1738)) //
			.toBe('abcdefghijklmnopqrstuvwxyz 🦊 ꓺ 0123456789 !"\'()*~ ßÅåÆæœ'); // prettier-ignore
    });
});
