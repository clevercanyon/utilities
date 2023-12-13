/**
 * Test suite.
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { $app, $brand, $env, $json, $person, $preact, $url } from '#index.ts';
import { Body, HTML, Head, Root, Route, type RootProps } from '#preact/components.tsx';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.hydrativelyRenderSPA()', async () => {
    beforeAll(async () => {
        $env.set('APP_PKG_NAME', '@clevercanyon/x.tld');
        $env.set('APP_BASE_URL', 'http://x.tld/');
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
    const App = (props: RootProps): $preact.VNode<RootProps> => {
        return (
            <Root {...props}>
                <Route path='./' component={Index} />
            </Root>
        );
    };
    const Index = (): $preact.VNode => {
        return (
            <HTML>
                <Head title={'index'} author={$person.get('&')} />
                <Body class='h-full'>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    // ---

    test('$preact.iso.prerenderSPA()', async () => {
        const { httpState, docType, html } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(httpState.status).toBe(200);
        expect(!!docType).toBe(true), expect(!!html).toBe(true);

        if (fs && path && url) {
            // We cannot rewrite this each and every time, else it causes `--watch` to enter into an endless loop.
            // fs.writeFileSync(path.dirname(url.fileURLToPath(import.meta.url)) + '/ex-imports/fixtures/prerender-spa-for-web.html', docType + '\n' + html);
        }
    });
});
