/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $brand, $env, $json, $preact, $url } from '../../../../index.ts';
import { Body, HTML, Head, Root, Route, type RootProps, type RoutedProps } from '../../../../preact/components.tsx';

const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.hydrativelyRenderSPA()', async () => {
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
    const App = (props: RootProps): $preact.VNode<RootProps> => {
        return (
            <Root {...props}>
                <Route path='./' component={Index} />
                <Route default component={Error404} />
            </Root>
        );
    };
    const Index = (unusedꓺprops: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'index'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    const Error404 = $preact.lazyRoute(() => import('../../../../preact/components/error-404.tsx'));

    // ---

    test('basics', async () => {
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

        // Populate DOM now and continue.

        Object.defineProperty(window, 'location', { value: new URL('http://x.tld/?a=_a&b=_b&c=_c') });
        document.open(), document.write(indexDocType + indexHTML), document.close();

        // Neither `document.write` or `(outer|inner)HTML` run embedded script tags, for security reasons.
        // So that's why we're explicitly extracting and running script code using a `new Function()` below.
        const dataScriptCode = indexHTML.match(/<script id="preact-iso-data">([^<>]+)<\/script>/iu)?.[1] || '';
        // eslint-disable-next-line @typescript-eslint/no-implied-eval -- OK when testing.
        if (dataScriptCode) new Function(dataScriptCode)(); // Execute script code.

        const domIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
        const domIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

        expect(domIndexHeadMarkup).toContain('<title>index</title>');
        expect(domIndexHeadMarkup).toContain('<link rel="stylesheet" href="./style.css" media="all">');
        expect(domIndexHeadMarkup).toContain('<script type="module" src="./script.js"></script>');
        expect(domIndexBodyMarkup).toContain('"path":"./"');
        expect(domIndexBodyMarkup).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
        expect(domIndexBodyMarkup).toContain('"restPath":""');
        expect(domIndexBodyMarkup).toContain('"restPathQuery":""');
        expect(domIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(domIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(domIndexBodyMarkup).toContain('"params":{}');

        // Hydrate DOM now and continue.

        $preact.iso.hydrativelyRenderSPA({ App });

        const domHydratedIndexMarkup = document.documentElement.outerHTML;
        const domHydratedIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
        const domHydratedIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

        expect(domHydratedIndexMarkup).toContain('<html class="preact" lang="en">');
        expect(domHydratedIndexHeadMarkup).toContain('<title>index</title>');
        expect(domHydratedIndexHeadMarkup).toContain('<link rel="stylesheet" href="./style.css" media="all">');
        expect(domHydratedIndexHeadMarkup).toContain('<script type="module" src="./script.js"></script>');
        expect(domHydratedIndexBodyMarkup).toContain('"path":"./"');
        expect(domHydratedIndexBodyMarkup).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
        expect(domHydratedIndexBodyMarkup).toContain('"restPath":""');
        expect(domHydratedIndexBodyMarkup).toContain('"restPathQuery":""');
        expect(domHydratedIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(domHydratedIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(domHydratedIndexBodyMarkup).toContain('"params":{}');
    });
});
