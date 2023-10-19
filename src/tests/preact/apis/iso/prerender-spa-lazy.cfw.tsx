/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { $brand, $env, $json, $preact, $url } from '../../../../index.ts';
import { Body, HTML, Head, Root, Route, type RootProps, type RoutedProps } from '../../../../preact/components.tsx';

const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.prerenderSPA() ... lazy', async () => {
    beforeAll(async () => {
        $env.set('APP_BASE_URL', 'http://x.tld/');
        $env.set(
            'APP_BRAND',
            $brand.addApp({
                org: '@clevercanyon/hop.gdn',
                type: 'site',
                pkgName: '@clevercanyon/x.tld',
                baseURL: $url.appBase(),
                props: {},
            }),
        );
    });
    afterAll(async () => {
        $env.set('APP_BASE_URL', __origAppBaseURL__);
        $url.appBase.flush();
        $url.appBasePath.flush();

        $env.set('APP_BRAND', __origAppBrand__);
        $brand.remove('@clevercanyon/x.tld');
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
                    <Route default component={Error404} />
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
        const Lazy = $preact.lazyRoute(() => import('./x-imports/routes/lazy.tsx'));
        const Error404 = $preact.lazyRoute(() => import('../../../../preact/components/error-404.tsx'));

        const {
            httpState: indexHTTPState,
            docType: indexDocType,
            html: indexHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(indexHTTPState.status).toBe(200);
        expect(indexDocType).toBe('<!doctype html>');
        expect(indexHTML).toContain('<title>index</title>');
        expect(indexHTML).toContain('<link rel="stylesheet" href="./style.css" media="all"/>');
        expect(indexHTML).toContain('<script type="module" src="./script.js"></script>');
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
            request: new Request(new URL('http://x.tld/lazy?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(lazyHTTPState.status).toBe(200);
        expect(lazyDocType).toBe('<!doctype html>');
        expect(lazyHTML).toContain('<title>lazy</title>');
        expect(lazyHTML).toContain('<link rel="stylesheet" href="./style.css" media="all"/>');
        expect(lazyHTML).toContain('<script type="module" src="./script.js"></script>');
        expect(lazyHTML).toContain('"path":"./lazy"');
        expect(lazyHTML).toContain('"pathQuery":"./lazy?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"restPath":""');
        expect(lazyHTML).toContain('"restPathQuery":""');
        expect(lazyHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(lazyHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(lazyHTML).toContain('"params":{}');
        expect(lazyHTML).toContain('<script type="lazy-component-props">{"a":"_a","b":"_b","c":"_c"}</script>');
        expect(lazyHTML).toContain(
            // ISO fetcher cache should be dumped into script tag for client-side use.
            '.cache = {"d7b70ada5bdf8fd5be68ba2c359958a3768e044e":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"d77a93a8edb0b9a6e7655df474aaed757e4ae449":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"ddd3a839cabaa8bd47010410e0d588596e4e539e":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}},"c34287a716fbae3b50f5fe7070c998e997368560":{"body":"x","options":{"status":200,"headers":{"content-type":"text/plain; charset=utf-8"}}}}',
        );
        expect(lazyHTML).toContain('</html>');
    });
});
