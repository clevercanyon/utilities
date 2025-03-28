/**
 * Test suite.
 */

import { $app, $brand, $env, $json, $preact, $url } from '#index.ts';
import { Body, HTML, Head, Root, Route } from '#preact/components.tsx';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppRootR2OriginURL__ = $env.get('APP_ROOT_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppRootR2BaseURL__ = $env.get('APP_ROOT_R2_BASE_URL', { type: 'unknown' });
const __origAppR2OriginURL__ = $env.get('APP_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppR2BaseURL__ = $env.get('APP_R2_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('<Root>', async () => {
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
            $app.pkgNameParts.flush(),
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
    test('basics', async () => {
        const Index = (): $preact.VNode => {
            return (
                <HTML>
                    <Head>
                        <meta name='foo' content='bar' data-key='fooMeta' />
                        <script data-key='fooScript'>let foo = 'bar';</script>
                    </Head>
                    <Body>
                        <pre dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></pre>
                    </Body>
                </HTML>
            );
        };
        const html = await $preact.ssr.renderToString(
            <Root url={$app.baseURL()} baseURL={$app.baseURL()}>
                <Route default component={Index} />
            </Root>,
        );
        expect(html).toContain('</html>');
    });
});
