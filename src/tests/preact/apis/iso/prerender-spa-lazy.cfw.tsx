/**
 * Test suite.
 */

import { $app, $brand, $env, $json, $preact, $url } from '#index.ts';
import { Body, HTML, Head, Root, Route, type RootProps, type RoutedProps } from '#preact/components.tsx';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.prerenderSPA() ... lazy', async () => {
    beforeAll(async () => {
        $env.set('APP_PKG_NAME', '@clevercanyon/x.tld');
        $env.set('APP_BASE_URL', 'https://x.tld/base/');
        $env.set('APP_BRAND_PROPS', { type: 'site' });
        $env.set('APP_BRAND', $brand.addApp());
    });
    afterAll(async () => {
        $env.set('APP_PKG_NAME', __origAppPkgName__);
        $env.set('APP_BASE_URL', __origAppBaseURL__);
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
        const globalFetchMock = vi.fn(async () => {
            return new Response('x', {
                status: 200,
                headers: { 'content-type': 'text/plain; charset=utf-8' },
            });
        });
        vi.stubGlobal('fetch', globalFetchMock); // Used by lazy route.

        const App = (props: RootProps): $preact.VNode<RootProps> => {
            return (
                <Root {...props}>
                    <Route path='/' component={Index} />
                    <Route path='/lazy/*' component={Lazy} />
                    <Route default component={Route404} />
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
        const Lazy = $preact.lazyRoute(() => import('#tests/preact/apis/iso/ex-imports/routes/lazy.tsx'));
        const Route404 = $preact.lazyRoute(() => import('#preact/components/404.tsx'));

        const {
            httpState: indexHTTPState,
            docType: indexDocType,
            html: indexHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('https://x.tld/?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(indexHTTPState.status).toBe(200);
        expect(indexDocType).toBe('<!doctype html>');
        expect(indexHTML).toContain('<title data-key="title">index</title>');
        expect(indexHTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(indexHTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(indexHTML).toContain('"path":"./"');
        expect(indexHTML).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
        expect(indexHTML).toContain('"restPath":""');
        expect(indexHTML).toContain('"restPathQuery":""');
        expect(indexHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(indexHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(indexHTML).toContain('"params":{}');
        expect(indexHTML).toContain('</html>');

        const {
            httpState: lazyHTTPState,
            docType: lazyDocType,
            html: lazyHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('https://x.tld/lazy?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(lazyHTTPState.status).toBe(200);
        expect(lazyDocType).toBe('<!doctype html>');
        expect(lazyHTML).toContain('<title data-key="title">lazy</title>');
        expect(lazyHTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(lazyHTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(lazyHTML).toContain('"path":"./lazy"');
        expect(lazyHTML).toContain('"pathQuery":"./lazy?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"restPath":"./"');
        expect(lazyHTML).toContain('"restPathQuery":"./?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(lazyHTML).toContain('"params":{}');
        expect(lazyHTML).toContain('<script type="lazy-component-props">{"a":"_a","b":"_b","c":"_c"}</script>');
        expect(lazyHTML).toContain(
            // ISO fetcher cache should be dumped into script tag for client-side use.
            '{"cache":{"d7b70ada5bdf8fd5be68ba2c359958a3768e044e":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"d77a93a8edb0b9a6e7655df474aaed757e4ae449":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"ddd3a839cabaa8bd47010410e0d588596e4e539e":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"c34287a716fbae3b50f5fe7070c998e997368560":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}}}};',
        );
        expect(lazyHTML).toContain('</html>');
    });
});
