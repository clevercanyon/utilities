/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $brand, $env, $json, $preact, $url } from '../../../../index.ts';
import { Body, HTML, Head, Root, Route, Router, type RootProps, type RoutedProps } from '../../../../preact/components.tsx';

const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.prerenderSPA() default-404', async () => {
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
                <Route path='./others/*' component={Others} />
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
    const Route404 = $preact.lazyRoute(() => import('../../../../preact/components/404.tsx'));

    // ---

    test('404/Route404', async () => {
        const {
            httpState: othersOtherFooHTTPState,
            docType: othersOtherFooDocType,
            html: othersOtherFooHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/nonexistent?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherFooHTTPState.status).toBe(404);
        expect(othersOtherFooDocType).toBe('<!doctype html>');
        expect(othersOtherFooHTML).toContain('<title data-key="title">404 Error: Not Found</title>');
        expect(othersOtherFooHTML).toContain('</html>');
    });

    // ---

    test('404/StandAlone', async () => {
        const {
            httpState: othersOtherFooHTTPState,
            docType: othersOtherFooDocType,
            html: othersOtherFooHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/nonexistent?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherFooHTTPState.status).toBe(404);
        expect(othersOtherFooDocType).toBe('<!doctype html>');
        expect(othersOtherFooHTML).toContain('<title>404 Error: Not Found</title>');
        expect(othersOtherFooHTML).toContain('</html>');
    });
});
