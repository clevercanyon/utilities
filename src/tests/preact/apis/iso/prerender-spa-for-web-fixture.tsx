/**
 * Test suite.
 */

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $brand, $env, $json, $person, $preact, $url } from '../../../../index.ts';
import { Body, HTML, Head, Root, Route, type RootProps } from '../../../../preact/components.tsx';

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
        fs.writeFileSync(path.dirname(url.fileURLToPath(import.meta.url)) + '/ex-imports/fixtures/prerender-spa-for-web.html', docType + '\n' + html);
    });
});
