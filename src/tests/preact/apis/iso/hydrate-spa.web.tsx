/**
 * Test suite.
 */

import { $app, $brand, $env, $json, $preact, $profile, $url } from '#index.ts';
import { Body, HTML, Head, Root, Route, type RootProps } from '#preact/components.tsx';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppRootR2OriginURL__ = $env.get('APP_ROOT_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppRootR2BaseURL__ = $env.get('APP_ROOT_R2_BASE_URL', { type: 'unknown' });
const __origAppR2OriginURL__ = $env.get('APP_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppR2BaseURL__ = $env.get('APP_R2_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.hydrateSPA() [web]', async () => {
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
            </Root>
        );
    };
    const Index = (): $preact.VNode => {
        return (
            <HTML>
                <Head title={'index'} author={$profile.get('@jaswrks')} />
                <Body class='h-full'>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    // ---

    test('$preact.iso.hydrateSPA()', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async (): Promise<Response> => {
                return new Response('', {
                    status: 200,
                    headers: { 'content-type': 'text/plain; charset=utf-8' },
                });
            }),
        );
        // Populates DOM using fixture from SSR.
        const doctypeHTML = (await import('#tests/preact/apis/iso/ex-imports/fixtures/rendered-spa-for-web.html?raw')).default;
        Object.defineProperty(window, 'location', { value: new URL('https://x.tld/?a=_a&b=_b&c=_c') });
        document.open(), document.write(doctypeHTML), document.close();

        // Neither `document.write` or `(outer|inner)HTML` run embedded script tags, for security reasons.
        // That's why we're extracting and running script code using a `new Function()` below, which runs script code.
        const dataScriptCode = doctypeHTML.match(/<script id="global-data" nonce="[^"]+" data-key="globalData">([^<>]+)<\/script>/u)?.[1] || '';

        // eslint-disable-next-line @typescript-eslint/no-implied-eval, @typescript-eslint/no-unsafe-call -- OK when testing.
        if (dataScriptCode) new Function(dataScriptCode)(); // Execute script code.

        const domIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
        const domIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

        expect(domIndexHeadMarkup).toContain('<title data-key="title">index</title>');
        expect(domIndexHeadMarkup).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle">');
        expect(domIndexHeadMarkup).toMatch(/<script type="module" nonce="[^"]+" src="\.\/script\.js" data-key="scriptBundle"><\/script>/u);
        expect(domIndexBodyMarkup).toContain('"path":"./"');
        expect(domIndexBodyMarkup).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
        expect(domIndexBodyMarkup).toContain('"restPath":""');
        expect(domIndexBodyMarkup).toContain('"restPathQuery":""');
        expect(domIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(domIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(domIndexBodyMarkup).toContain('"params":{}');

        // Hydrate DOM now and continue.
        await $preact.iso.hydrateSPA({ App });

        // Allow plenty of time for effects, such that any errors can be detected while testing.
        await new Promise((resolve) => {
            setTimeout(() => {
                const domHydratedIndexMarkup = document.documentElement.outerHTML;
                const domHydratedIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
                const domHydratedIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

                expect(domHydratedIndexMarkup).toContain('<html lang="en-US" dir="ltr">');
                expect(domHydratedIndexHeadMarkup).toContain('<title data-key="title">index</title>');
                expect(domHydratedIndexHeadMarkup).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle">');
                expect(domHydratedIndexHeadMarkup).toMatch(/<script type="module" nonce="[^"]+" src="\.\/script\.js" data-key="scriptBundle"><\/script>/u);
                expect(domHydratedIndexBodyMarkup).toContain('"path":"./"');
                expect(domHydratedIndexBodyMarkup).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
                expect(domHydratedIndexBodyMarkup).toContain('"restPath":""');
                expect(domHydratedIndexBodyMarkup).toContain('"restPathQuery":""');
                expect(domHydratedIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
                expect(domHydratedIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
                expect(domHydratedIndexBodyMarkup).toContain('"params":{}');

                resolve(true);
            }, 2500);
        });
    });
});
