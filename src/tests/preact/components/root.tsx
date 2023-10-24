/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $brand, $env, $json, $preact, $url } from '../../../index.ts';
import { Body, HTML, Head, Root, Route } from '../../../preact/components.tsx';

const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('<Root>', async () => {
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
    test('basics', async () => {
        const Index = (): $preact.VNode => {
            return (
                <HTML>
                    <Head class='index' data-index={''}>
                        <meta name='foo' content='bar' />
                        <script>let foo = 'bar';</script>
                    </Head>
                    <Body>
                        <pre dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></pre>
                    </Body>
                </HTML>
            );
        };
        const html = $preact.ssr.renderToString(
            <Root url={$url.appBase()} baseURL={$url.appBase()}>
                <Route default component={Index} />
            </Root>,
        );
        console.log(html);
        expect(html).toContain('</html>');
    });
});
