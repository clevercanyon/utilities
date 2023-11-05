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
                <Route default component={Route404} />
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
    const Route404 = $preact.lazyRoute(() => import('../../../../preact/components/404.tsx'));

    // ---

    test('basics', async () => {
        // Populates DOM using fixture from SSR.
        const doctypeHTML = (await import('./ex-imports/fixtures/prerender-for-web.html?raw')).default;
        Object.defineProperty(window, 'location', { value: new URL('http://x.tld/?a=_a&b=_b&c=_c') });
        document.open(), document.write(doctypeHTML), document.close();

        // Neither `document.write` or `(outer|inner)HTML` run embedded script tags, for security reasons.
        // That's why we're extracting and running script code using a `new Function()` below, which runs script code.
        const dataScriptCode = doctypeHTML.match(/<script id="preact-iso-data" data-key="preactISOData">([^<>]+)<\/script>/iu)?.[1] || '';
        // eslint-disable-next-line @typescript-eslint/no-implied-eval -- OK when testing.
        if (dataScriptCode) new Function(dataScriptCode)(); // Execute script code.

        const domIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
        const domIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

        expect(domIndexHeadMarkup).toContain('<title data-key="title">index</title>');
        expect(domIndexHeadMarkup).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle">');
        expect(domIndexHeadMarkup).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(domIndexBodyMarkup).toContain('"path":"./"');
        expect(domIndexBodyMarkup).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
        expect(domIndexBodyMarkup).toContain('"restPath":""');
        expect(domIndexBodyMarkup).toContain('"restPathQuery":""');
        expect(domIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(domIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(domIndexBodyMarkup).toContain('"params":{}');

        // Hydrate DOM now and continue.

        $preact.iso.hydrativelyRenderSPA({ App });

        // Allow time for effects.
        await new Promise((resolve) => {
            setTimeout(() => {
                const domHydratedIndexMarkup = document.documentElement.outerHTML;
                const domHydratedIndexHeadMarkup = document.querySelector('head')?.outerHTML || '';
                const domHydratedIndexBodyMarkup = document.querySelector('body')?.outerHTML || '';

                expect(domHydratedIndexMarkup).toContain('<html lang="en-US" dir="ltr">');
                expect(domHydratedIndexHeadMarkup).toContain('<title data-key="title">index</title>');
                expect(domHydratedIndexHeadMarkup).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle">');
                expect(domHydratedIndexHeadMarkup).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
                expect(domHydratedIndexBodyMarkup).toContain('"path":"./"');
                expect(domHydratedIndexBodyMarkup).toContain('"pathQuery":"./?a=_a&b=_b&c=_c"');
                expect(domHydratedIndexBodyMarkup).toContain('"restPath":""');
                expect(domHydratedIndexBodyMarkup).toContain('"restPathQuery":""');
                expect(domHydratedIndexBodyMarkup).toContain('"query":"?a=_a&b=_b&c=_c"');
                expect(domHydratedIndexBodyMarkup).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
                expect(domHydratedIndexBodyMarkup).toContain('"params":{}');

                resolve(true);
            }, 1000);
        });
    });
});
