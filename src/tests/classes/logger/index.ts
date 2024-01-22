/**
 * Test suite.
 */

import { $app, $brand, $class, $env, $url } from '#index.ts';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppR2OriginURL__ = $env.get('APP_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppR2BaseURL__ = $env.get('APP_R2_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('Logger', async () => {
    const Logger = $class.getLogger(),
        logger = new Logger();

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
    test('.log()', async () => {
        expect(logger.log('Test logger.log().') instanceof Promise).toBe(true);
    });
    test('.debug()', async () => {
        void logger.debug('Test logger.debug().');
    });
    test('.info()', async () => {
        void logger.info('Test logger.info().');
    });
    test('.warn()', async () => {
        void logger.warn('Test logger.warn().');
    });
    test('.error()', async () => {
        void logger.error('Test logger.error().');
    });
    test('.flush()', async () => {
        await expect(logger.flush()).resolves.toBe(logger.endpointToken ? true : false);
    });
    test('.withContext()', async () => {
        let promises = []; // Initialize.

        const withContext = logger.withContext({ withContext: true }),
            withSubcontext = withContext.withContext({ withSubcontext: true });

        promises.push(withContext.log('Test withContext.log().')),
            promises.push(withContext.debug('Test withContext.debug().')),
            promises.push(withContext.info('Test withContext.info().')),
            promises.push(withContext.warn('Test withContext.warn().')),
            promises.push(withContext.error('Test withContext.error().'));
        await expect(withContext.flush()).resolves.toBe(logger.endpointToken ? true : false);

        promises.push(withSubcontext.log('Test withSubcontext.log().')),
            promises.push(withSubcontext.debug('Test withSubcontext.debug().')),
            promises.push(withSubcontext.info('Test withSubcontext.info().')),
            promises.push(withSubcontext.warn('Test withSubcontext.warn().')),
            promises.push(withSubcontext.error('Test withSubcontext.error().'));
        await expect(withSubcontext.flush()).resolves.toBe(logger.endpointToken ? true : false);

        for (const promise of promises) {
            await expect(promise).resolves.toBe(logger.endpointToken ? true : false);
        }
    });
});
