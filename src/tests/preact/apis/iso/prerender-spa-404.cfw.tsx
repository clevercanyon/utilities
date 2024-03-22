/**
 * Test suite.
 */

import { $app, $brand, $crypto, $env, $json, $preact, $url } from '#index.ts';
import { Body, HTML, Head, Root, Route, Router, type RootProps, type RoutedProps } from '#preact/components.tsx';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppRootR2OriginURL__ = $env.get('APP_ROOT_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppRootR2BaseURL__ = $env.get('APP_ROOT_R2_BASE_URL', { type: 'unknown' });
const __origAppR2OriginURL__ = $env.get('APP_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppR2BaseURL__ = $env.get('APP_R2_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.prerenderSPA() [404-cfw]', async () => {
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
    const App = (props: RootProps): $preact.VNode<RootProps> => {
        return (
            <Root {...props}>
                <Route path='./' component={Index} />
                <Route path='./others/*' component={Others} />
            </Root>
        );
    };
    const Index = (): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'index'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    const Others = (): $preact.VNode<RoutedProps> => {
        return (
            <Router {...$preact.useRoute()}>
                <Route path='./other' component={Other} />
                {/* No default route in this nested router. */}
            </Router>
        );
    };
    const Other = (): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'other'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    // ---

    test('404/StandAlone', async () => {
        const {
            httpState: othersOtherFooHTTPState,
            docType: othersOtherFooDocType,
            html: othersOtherFooHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('https://x.tld/others/nonexistent?a=_a&b=_b&c=_c'), {
                headers: { 'x-csp-nonce': $crypto.cspNonce() },
            }),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherFooHTTPState.status).toBe(404);
        expect(othersOtherFooDocType).toBe('<!doctype html>');
        expect(othersOtherFooHTML).toContain('<title>404 Error: Not Found</title>');
        expect(othersOtherFooHTML).toContain('</html>');
    });
});
