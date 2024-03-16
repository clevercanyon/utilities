/**
 * Test suite.
 */

import { $app, $brand, $crypto, $env, $json, $preact, $url } from '#index.ts';
import { Body, HTML, Head, Root, Route, type RootProps, type RoutedProps } from '#preact/components.tsx';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppR2OriginURL__ = $env.get('APP_R2_ORIGIN_URL', { type: 'unknown' });
const __origAppR2BaseURL__ = $env.get('APP_R2_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.prerenderSPA() [lazy-cfw]', async () => {
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
    test('.', async () => {
        const globalFetchMock = vi.fn(async (): Promise<Response> => {
            return new Promise((resolve): void => {
                setTimeout((): void => {
                    resolve(
                        new Response('', {
                            status: 200,
                            headers: { 'content-type': 'text/plain; charset=utf-8' },
                        }),
                    );
                }, 500);
            });
        });
        vi.stubGlobal('fetch', globalFetchMock); // Used by lazy route.

        const App = (props: RootProps): $preact.VNode<RootProps> => {
            return (
                <Root {...props}>
                    <Route path='/' component={Index} />
                    <Route path='/test/*' component={Test} />
                    <Route path='/lazy/*' component={Lazy} />
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
        const Test = $preact.lazyRoute(() => import('#tests/preact/apis/iso/ex-imports/routes/test.tsx'));
        const Lazy = $preact.lazyRoute(() => import('#tests/preact/apis/iso/ex-imports/routes/lazy.tsx'));

        const {
            httpState: indexHTTPState,
            docType: indexDocType,
            html: indexHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('https://x.tld/?a=_a&b=_b&c=_c'), {
                headers: { 'x-csp-nonce': $crypto.cspNonce() },
            }),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(indexHTTPState.status).toBe(200);
        expect(indexDocType).toBe('<!doctype html>');
        expect(indexHTML).toContain('<title data-key="title">index</title>');
        expect(indexHTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(indexHTML).toMatch(/<script type="module" nonce="[^"]+" src="\.\/script\.js" data-key="scriptBundle"><\/script>/u);
        expect(indexHTML).toContain('"path":"./"');
        expect(indexHTML).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
        expect(indexHTML).toContain('"restPath":""');
        expect(indexHTML).toContain('"restPathQuery":""');
        expect(indexHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(indexHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(indexHTML).toContain('"params":{}');
        expect(indexHTML).toContain('</html>');

        const {
            httpState: testHTTPState,
            docType: testDocType,
            html: testHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('https://x.tld/test?a=_a&b=_b&c=_c'), {
                headers: { 'x-csp-nonce': $crypto.cspNonce() },
            }),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(testHTTPState.status).toBe(200);
        expect(testDocType).toBe('<!doctype html>');
        expect(testHTML).toContain('<title data-key="title">test</title>');
        expect(testHTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(testHTML).toMatch(/<script type="module" nonce="[^"]+" src="\.\/script\.js" data-key="scriptBundle"><\/script>/u);
        expect(testHTML).toContain('"path":"./test"');
        expect(testHTML).toContain('"pathQuery":"./test?a=_a&b=_b&c=_c"');
        expect(testHTML).toContain('"restPath":"./"');
        expect(testHTML).toContain('"restPathQuery":"./?a=_a&b=_b&c=_c"');
        expect(testHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(testHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(testHTML).toContain('"params":{}');
        expect(testHTML).toContain('</html>');

        const {
            httpState: lazyHTTPState,
            docType: lazyDocType,
            html: lazyHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('https://x.tld/lazy?a=_a&b=_b&c=_c'), {
                headers: { 'x-csp-nonce': $crypto.cspNonce() },
            }),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(lazyHTTPState.status).toBe(200);
        expect(lazyDocType).toBe('<!doctype html>');
        expect(lazyHTML).toContain('<title data-key="title">lazy</title>');
        expect(lazyHTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(lazyHTML).toMatch(/<script type="module" nonce="[^"]+" src="\.\/script\.js" data-key="scriptBundle"><\/script>/u);
        expect(lazyHTML).toContain('"path":"./lazy"');
        expect(lazyHTML).toContain('"pathQuery":"./lazy?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"restPath":"./"');
        expect(lazyHTML).toContain('"restPathQuery":"./?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(lazyHTML).toContain('"params":{}');
        expect(lazyHTML).toContain('<script type="lazy-component-props">{"a":"_a","b":"_b","c":"_c"');
        expect(lazyHTML).toContain(
            // ISO fetcher cache should be dumped into script tag for client-side use.
            '{"cache":{"46f384bdb8c2829d8f779865900ce58ae4609c98":{"body":"","init":{"status":200,"statusText":"","headers":{"content-type":"text/plain; charset=utf-8"}}},"3bed4d619aae949b7d4c8dc5cfee3a5ebb105c81":{"body":"","init":{"status":200,"statusText":"","headers":{"content-type":"text/plain; charset=utf-8"}}},"27080e0ca89940cc844d60ccbc74b80b985f084e":{"body":"","init":{"status":200,"statusText":"","headers":{"content-type":"text/plain; charset=utf-8"}}},"2ab39e754cce3d33fae79fe19cd5ebdd9753a146":{"body":"","init":{"status":200,"statusText":"","headers":{"content-type":"text/plain; charset=utf-8"}}}}};',
        );
        expect(lazyHTML).toContain('</html>');
    });
});
