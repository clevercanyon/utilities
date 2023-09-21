/**
 * Test suite.
 */

import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { $env, $json, $preact } from '../../../../index.ts';
import { prerenderSPA as $preactꓺapisꓺisoꓺprerenderSPA } from '../../../../preact/apis/iso.tsx';
import $preactꓺcomponentsꓺBody from '../../../../preact/components/body.tsx';
import $preactꓺcomponentsꓺHead from '../../../../preact/components/head.tsx';
import $preactꓺcomponentsꓺHTML from '../../../../preact/components/html.tsx';
import type {
    RouteContextAsProps as $preactꓺcomponentsꓺrouterꓺRouteContextAsProps,
    RouterProps as $preactꓺcomponentsꓺrouterꓺRouterProps,
} from '../../../../preact/components/router.tsx';
import {
    default as $preactꓺcomponentsꓺRouter,
    Route as $preactꓺcomponentsꓺrouterꓺRoute,
    lazyRoute as $preactꓺcomponentsꓺrouterꓺlazyRoute,
    useRoute as $preactꓺcomponentsꓺrouterꓺuseRoute,
} from '../../../../preact/components/router.tsx';

const __origAppBaseURL__ = String($env.get('@top', 'APP_BASE_URL', ''));

describe('$preactꓺapisꓺiso.prerenderSPA() default-404', async () => {
    beforeAll(async () => {
        $env.set('@top', 'APP_BASE_URL', 'http://x.tld');
    });
    afterAll(async () => {
        $env.set('@top', 'APP_BASE_URL', __origAppBaseURL__);
    });
    const App = (props: $preactꓺcomponentsꓺrouterꓺRouterProps): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouterProps> => {
        return (
            <$preactꓺcomponentsꓺRouter {...props}>
                <$preactꓺcomponentsꓺrouterꓺRoute path='/' component={Index} />
                <$preactꓺcomponentsꓺrouterꓺRoute path='/others/*' component={Others} />
                <$preactꓺcomponentsꓺrouterꓺRoute default component={Default404} />
            </$preactꓺcomponentsꓺRouter>
        );
    };
    const Index = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
        return (
            <$preactꓺcomponentsꓺHTML>
                <$preactꓺcomponentsꓺHead title={'index'} />
                <$preactꓺcomponentsꓺBody>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
                </$preactꓺcomponentsꓺBody>
            </$preactꓺcomponentsꓺHTML>
        );
    };
    const Others = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
        return (
            <$preactꓺcomponentsꓺRouter {...$preactꓺcomponentsꓺrouterꓺuseRoute()}>
                <$preactꓺcomponentsꓺrouterꓺRoute path='/other' component={Other} />
                {/* No default route in this nested router. */}
            </$preactꓺcomponentsꓺRouter>
        );
    };
    const Other = (): $preact.VNode<$preactꓺcomponentsꓺrouterꓺRouteContextAsProps> => {
        return (
            <$preactꓺcomponentsꓺHTML>
                <$preactꓺcomponentsꓺHead title={'other'} />
                <$preactꓺcomponentsꓺBody>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preactꓺcomponentsꓺrouterꓺuseRoute()) }}></script>
                </$preactꓺcomponentsꓺBody>
            </$preactꓺcomponentsꓺHTML>
        );
    };
    const Default404 = $preactꓺcomponentsꓺrouterꓺlazyRoute(() => import('../../../../preact/routes/404.tsx'));

    // ---

    test('.', async () => {
        const {
            httpState: othersOtherFooHTTPState,
            docType: othersOtherFooDocType,
            html: othersOtherFooHTML,
        } = await $preactꓺapisꓺisoꓺprerenderSPA({
            request: new Request(new URL('http://x.tld/others/nonexistent?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherFooHTTPState.status).toBe(404);
        expect(othersOtherFooDocType).toBe('<!DOCTYPE html>');
        expect(othersOtherFooHTML).toContain('<title>404 Error: Not Found</title>');
        expect(othersOtherFooHTML).toContain('</html>');
    });
});
