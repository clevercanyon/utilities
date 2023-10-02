/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $env, $json, $preact, $url } from '../../../../index.ts';
import { Body, HTML, Head, Route, Router } from '../../../../preact/components.tsx';
import { type RouteContextAsProps, type RouterProps } from '../../../../preact/components/router.tsx';

const __origAppBaseURL__ = $url.currentAppBase(); // App’s base URL, as string.

describe('$preact.iso.prerenderSPA() default-404', async () => {
    beforeAll(async () => {
        $env.set('APP_BASE_URL', 'http://x.tld');
    });
    afterAll(async () => {
        $env.set('APP_BASE_URL', __origAppBaseURL__);
    });
    const App = (props: RouterProps): $preact.VNode<RouterProps> => {
        return (
            <Router {...props}>
                <Route path='/' component={Index} />
                <Route path='/others/*' component={Others} />
                <Route default component={Error404} />
            </Router>
        );
    };
    const Index = (): $preact.VNode<RouteContextAsProps> => {
        return (
            <HTML>
                <Head title={'index'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    const Others = (): $preact.VNode<RouteContextAsProps> => {
        return (
            <Router {...$preact.useRoute()}>
                <Route path='/other' component={Other} />
                {/* No default route in this nested router. */}
            </Router>
        );
    };
    const Other = (): $preact.VNode<RouteContextAsProps> => {
        return (
            <HTML>
                <Head title={'other'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    const Error404 = $preact.lazyRoute(() => import('../../../../preact/components/error-404.tsx'));

    // ---

    test('.', async () => {
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
