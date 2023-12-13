/**
 * Test suite.
 */

import { $app, $brand, $env, $json, $preact, $url } from '#index.ts';
import { Body, HTML, Head, Root, Route, Router, type RootProps, type RoutedProps } from '#preact/components.tsx';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

const __origAppPkgName__ = $env.get('APP_PKG_NAME', { type: 'unknown' });
const __origAppBaseURL__ = $env.get('APP_BASE_URL', { type: 'unknown' });
const __origAppBrandProps__ = $env.get('APP_BRAND_PROPS', { type: 'unknown' });
const __origAppBrand__ = $env.get('APP_BRAND', { type: 'unknown' });

describe('$preact.iso.prerenderSPA()', async () => {
    beforeAll(async () => {
        $env.set('APP_PKG_NAME', '@clevercanyon/x.tld');
        $env.set('APP_BASE_URL', 'http://x.tld/');
        $env.set('APP_BRAND_PROPS', {});
        $app.adaptBrand.fresh('x.tld');
    });
    afterAll(async () => {
        $env.set('APP_PKG_NAME', __origAppPkgName__);
        $env.set('APP_BASE_URL', __origAppBaseURL__);
        $env.set('APP_BRAND_PROPS', __origAppBrandProps__);
        $env.set('APP_BRAND', __origAppBrand__);
        $brand.remove('@clevercanyon/x.tld');

        $app.pkgName.flush(), //
            $app.pkgSlug.flush(),
            $app.baseURL.flush(),
            $url.appBasePath.flush(),
            $url.fromAppBase.flush(),
            $url.pathFromAppBase.flush(),
            $url.addAppBasePath.flush(),
            $url.removeAppBasePath.flush(),
            $app.adaptBrand.flush(),
            $app.brandProps.flush(),
            $app.brand.flush();
    });
    const App = (props: RootProps): $preact.VNode<RootProps> => {
        return (
            <Root {...props}>
                <Route path='./' component={Index} />
                <Route path='./blog' component={Blog} />
                <Route path='./blog/post/:id' component={Blog} />
                <Route path='./others/*' component={Others} />
                <Route default component={Route404} />
            </Root>
        );
    };
    const Index = (): $preact.VNode => {
        return (
            <HTML>
                <Head title={'index'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    const Blog = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={/^\.\/blog\/post\//u.test(props.path || '') ? 'blog post' : 'blog'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify($preact.useRoute()) }}></script>
                </Body>
            </HTML>
        );
    };
    const Others = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <Router {...props}>
                <Route path='./other-a/:x' component={OtherA} />
                <Route path='./other-b/*' component={OtherB} />
                <Route path='./other-c/:x*' component={OtherC} />
                <Route path='./other-d/:x+' component={OtherD} />
                <Route path='./other-e/:x?' component={OtherE} />
                <Route path='./other-a/*' component={OtherA} />
                <Route default component={OtherDefault404} />
            </Router>
        );
    };
    const OtherA = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'other-a'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify(props) }}></script>
                </Body>
            </HTML>
        );
    };
    const OtherB = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'other-b'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify(props) }}></script>
                </Body>
            </HTML>
        );
    };
    const OtherC = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'other-c'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify(props) }}></script>
                </Body>
            </HTML>
        );
    };
    const OtherD = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'other-d'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify(props) }}></script>
                </Body>
            </HTML>
        );
    };
    const OtherE = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        return (
            <HTML>
                <Head title={'other-e'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify(props) }}></script>
                </Body>
            </HTML>
        );
    };
    const OtherDefault404 = (props: RoutedProps): $preact.VNode<RoutedProps> => {
        const { updateState: updateHTTPState } = $preact.useHTTP();
        updateHTTPState({ status: 404 }); // Record 404 error.

        return (
            <HTML>
                <Head title={'other-404'} />
                <Body>
                    <script type='route-context-props' dangerouslySetInnerHTML={{ __html: $json.stringify(props) }}></script>
                </Body>
            </HTML>
        );
    };
    const Route404 = $preact.lazyRoute(() => import('#preact/components/404.tsx'));

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

        // ---

        const {
            httpState: blogHTTPState,
            docType: blogDocType,
            html: blogHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/blog?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(blogHTTPState.status).toBe(200);
        expect(blogDocType).toBe('<!doctype html>');
        expect(blogHTML).toContain('<title data-key="title">blog</title>');
        expect(blogHTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(blogHTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(blogHTML).toContain('"path":"./blog"');
        expect(blogHTML).toContain('"pathQuery":"./blog?a=_a&b=_b&c=_c"');
        expect(blogHTML).toContain('"restPath":""');
        expect(blogHTML).toContain('"restPathQuery":""');
        expect(blogHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(blogHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(blogHTML).toContain('"params":{}');
        expect(blogHTML).toContain('</html>');

        // ---

        const {
            httpState: blogPostHTTPState,
            docType: blogPostDocType,
            html: blogPostHTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/blog/post/123?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(blogPostHTTPState.status).toBe(200);
        expect(blogPostDocType).toBe('<!doctype html>');
        expect(blogPostHTML).toContain('<title data-key="title">blog post</title>');
        expect(blogPostHTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(blogPostHTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(blogPostHTML).toContain('"path":"./blog/post/123"');
        expect(blogPostHTML).toContain('"pathQuery":"./blog/post/123?a=_a&b=_b&c=_c"');
        expect(blogPostHTML).toContain('"restPath":""');
        expect(blogPostHTML).toContain('"restPathQuery":""');
        expect(blogPostHTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(blogPostHTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(blogPostHTML).toContain('"params":{"id":"123"}');
        expect(blogPostHTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherA1HTTPState,
            docType: othersOtherA1DocType,
            html: othersOtherA1HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-a/123?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherA1HTTPState.status).toBe(200);
        expect(othersOtherA1DocType).toBe('<!doctype html>');
        expect(othersOtherA1HTML).toContain('<title data-key="title">other-a</title>');
        expect(othersOtherA1HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherA1HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherA1HTML).toContain('"path":"./other-a/123"');
        expect(othersOtherA1HTML).toContain('"pathQuery":"./other-a/123?a=_a&b=_b&c=_c"');
        expect(othersOtherA1HTML).toContain('"restPath":""');
        expect(othersOtherA1HTML).toContain('"restPathQuery":""');
        expect(othersOtherA1HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherA1HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherA1HTML).toContain('"params":{"x":"123"}');
        expect(othersOtherA1HTML).toContain('</html>');

        const {
            httpState: othersOtherA2HTTPState,
            docType: othersOtherA2DocType,
            html: othersOtherA2HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-a/123/another?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherA2HTTPState.status).toBe(200);
        expect(othersOtherA2DocType).toBe('<!doctype html>');
        expect(othersOtherA2HTML).toContain('<title data-key="title">other-a</title>');
        expect(othersOtherA2HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherA2HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherA2HTML).toContain('"path":"./other-a/123/another"');
        expect(othersOtherA2HTML).toContain('"pathQuery":"./other-a/123/another?a=_a&b=_b&c=_c"');
        expect(othersOtherA2HTML).toContain('"restPath":"./123/another"');
        expect(othersOtherA2HTML).toContain('"restPathQuery":"./123/another?a=_a&b=_b&c=_c"');
        expect(othersOtherA2HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherA2HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherA2HTML).toContain('"params":{}');
        expect(othersOtherA2HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherB1HTTPState,
            docType: othersOtherB1DocType,
            html: othersOtherB1HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-b?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherB1HTTPState.status).toBe(200);
        expect(othersOtherB1DocType).toBe('<!doctype html>');
        expect(othersOtherB1HTML).toContain('<title data-key="title">other-b</title>');
        expect(othersOtherB1HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherB1HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherB1HTML).toContain('"path":"./other-b"');
        expect(othersOtherB1HTML).toContain('"pathQuery":"./other-b?a=_a&b=_b&c=_c"');
        expect(othersOtherB1HTML).toContain('"restPath":"./"');
        expect(othersOtherB1HTML).toContain('"restPathQuery":"./?a=_a&b=_b&c=_c"');
        expect(othersOtherB1HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherB1HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherB1HTML).toContain('"params":{}');
        expect(othersOtherB1HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherB2HTTPState,
            docType: othersOtherB2DocType,
            html: othersOtherB2HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-b/123?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherB2HTTPState.status).toBe(200);
        expect(othersOtherB2DocType).toBe('<!doctype html>');
        expect(othersOtherB2HTML).toContain('<title data-key="title">other-b</title>');
        expect(othersOtherB2HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherB2HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherB2HTML).toContain('"path":"./other-b/123"');
        expect(othersOtherB2HTML).toContain('"pathQuery":"./other-b/123?a=_a&b=_b&c=_c"');
        expect(othersOtherB2HTML).toContain('"restPath":"./123"');
        expect(othersOtherB2HTML).toContain('"restPathQuery":"./123?a=_a&b=_b&c=_c"');
        expect(othersOtherB2HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherB2HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherB2HTML).toContain('"params":{}');
        expect(othersOtherB2HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherC1HTTPState,
            docType: othersOtherC1DocType,
            html: othersOtherC1HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-c?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherC1HTTPState.status).toBe(200);
        expect(othersOtherC1DocType).toBe('<!doctype html>');
        expect(othersOtherC1HTML).toContain('<title data-key="title">other-c</title>');
        expect(othersOtherC1HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherC1HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherC1HTML).toContain('"path":"./other-c"');
        expect(othersOtherC1HTML).toContain('"pathQuery":"./other-c?a=_a&b=_b&c=_c"');
        expect(othersOtherC1HTML).toContain('"restPath":""');
        expect(othersOtherC1HTML).toContain('"restPathQuery":""');
        expect(othersOtherC1HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherC1HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherC1HTML).toContain('"params":{"x":""}');
        expect(othersOtherC1HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherC2HTTPState,
            docType: othersOtherC2DocType,
            html: othersOtherC2HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-c/123?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherC2HTTPState.status).toBe(200);
        expect(othersOtherC2DocType).toBe('<!doctype html>');
        expect(othersOtherC2HTML).toContain('<title data-key="title">other-c</title>');
        expect(othersOtherC2HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherC2HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherC2HTML).toContain('"path":"./other-c/123"');
        expect(othersOtherC2HTML).toContain('"pathQuery":"./other-c/123?a=_a&b=_b&c=_c"');
        expect(othersOtherC2HTML).toContain('"restPath":""');
        expect(othersOtherC2HTML).toContain('"restPathQuery":""');
        expect(othersOtherC2HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherC2HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherC2HTML).toContain('"params":{"x":"123"}');
        expect(othersOtherC2HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherC3HTTPState,
            docType: othersOtherC3DocType,
            html: othersOtherC3HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-c/123/456/789?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherC3HTTPState.status).toBe(200);
        expect(othersOtherC3DocType).toBe('<!doctype html>');
        expect(othersOtherC3HTML).toContain('<title data-key="title">other-c</title>');
        expect(othersOtherC3HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherC3HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherC3HTML).toContain('"path":"./other-c/123/456/789"');
        expect(othersOtherC3HTML).toContain('"pathQuery":"./other-c/123/456/789?a=_a&b=_b&c=_c"');
        expect(othersOtherC3HTML).toContain('"restPath":""');
        expect(othersOtherC3HTML).toContain('"restPathQuery":""');
        expect(othersOtherC3HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherC3HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherC3HTML).toContain('"params":{"x":"123/456/789"}');
        expect(othersOtherC3HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherD1HTTPState,
            docType: othersOtherD1DocType,
            html: othersOtherD1HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-d?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherD1HTTPState.status).toBe(404);
        expect(othersOtherD1DocType).toBe('<!doctype html>');
        expect(othersOtherD1HTML).toContain('<title data-key="title">other-404</title>');
        expect(othersOtherD1HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherD1HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherD1HTML).toContain('"path":"./other-d"');
        expect(othersOtherD1HTML).toContain('"pathQuery":"./other-d?a=_a&b=_b&c=_c"');
        expect(othersOtherD1HTML).toContain('"restPath":""');
        expect(othersOtherD1HTML).toContain('"restPathQuery":""');
        expect(othersOtherD1HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherD1HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherD1HTML).toContain('"params":{}');
        expect(othersOtherD1HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherD2HTTPState,
            docType: othersOtherD2DocType,
            html: othersOtherD2HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-d/123?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherD2HTTPState.status).toBe(200);
        expect(othersOtherD2DocType).toBe('<!doctype html>');
        expect(othersOtherD2HTML).toContain('<title data-key="title">other-d</title>');
        expect(othersOtherD2HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherD2HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherD2HTML).toContain('"path":"./other-d/123"');
        expect(othersOtherD2HTML).toContain('"pathQuery":"./other-d/123?a=_a&b=_b&c=_c"');
        expect(othersOtherD2HTML).toContain('"restPath":""');
        expect(othersOtherD2HTML).toContain('"restPathQuery":""');
        expect(othersOtherD2HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherD2HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherD2HTML).toContain('"params":{"x":"123"}');
        expect(othersOtherD2HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherD3HTTPState,
            docType: othersOtherD3DocType,
            html: othersOtherD3HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-d/123/456?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherD3HTTPState.status).toBe(200);
        expect(othersOtherD3DocType).toBe('<!doctype html>');
        expect(othersOtherD3HTML).toContain('<title data-key="title">other-d</title>');
        expect(othersOtherD3HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherD3HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherD3HTML).toContain('"path":"./other-d/123/456"');
        expect(othersOtherD3HTML).toContain('"pathQuery":"./other-d/123/456?a=_a&b=_b&c=_c"');
        expect(othersOtherD3HTML).toContain('"restPath":""');
        expect(othersOtherD3HTML).toContain('"restPathQuery":""');
        expect(othersOtherD3HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherD3HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherD3HTML).toContain('"params":{"x":"123/456"}');
        expect(othersOtherD3HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherE1HTTPState,
            docType: othersOtherE1DocType,
            html: othersOtherE1HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-e?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherE1HTTPState.status).toBe(200);
        expect(othersOtherE1DocType).toBe('<!doctype html>');
        expect(othersOtherE1HTML).toContain('<title data-key="title">other-e</title>');
        expect(othersOtherE1HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherE1HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherE1HTML).toContain('"path":"./other-e"');
        expect(othersOtherE1HTML).toContain('"pathQuery":"./other-e?a=_a&b=_b&c=_c"');
        expect(othersOtherE1HTML).toContain('"restPath":""');
        expect(othersOtherE1HTML).toContain('"restPathQuery":""');
        expect(othersOtherE1HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherE1HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherE1HTML).toContain('"params":{}');
        expect(othersOtherE1HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherE2HTTPState,
            docType: othersOtherE2DocType,
            html: othersOtherE2HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-e/123?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherE2HTTPState.status).toBe(200);
        expect(othersOtherE2DocType).toBe('<!doctype html>');
        expect(othersOtherE2HTML).toContain('<title data-key="title">other-e</title>');
        expect(othersOtherE2HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherE2HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherE2HTML).toContain('"path":"./other-e/123"');
        expect(othersOtherE2HTML).toContain('"pathQuery":"./other-e/123?a=_a&b=_b&c=_c"');
        expect(othersOtherE2HTML).toContain('"restPath":""');
        expect(othersOtherE2HTML).toContain('"restPathQuery":""');
        expect(othersOtherE2HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherE2HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherE2HTML).toContain('"params":{"x":"123"}');
        expect(othersOtherE2HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherE3HTTPState,
            docType: othersOtherE3DocType,
            html: othersOtherE3HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-e/123/456?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(othersOtherE3HTTPState.status).toBe(404);
        expect(othersOtherE3DocType).toBe('<!doctype html>');
        expect(othersOtherE3HTML).toContain('<title data-key="title">other-404</title>');
        expect(othersOtherE3HTML).toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherE3HTML).toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(othersOtherE3HTML).toContain('"path":"./other-e/123/456"');
        expect(othersOtherE3HTML).toContain('"pathQuery":"./other-e/123/456?a=_a&b=_b&c=_c"');
        expect(othersOtherE3HTML).toContain('"restPath":""');
        expect(othersOtherE3HTML).toContain('"restPathQuery":""');
        expect(othersOtherE3HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherE3HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherE3HTML).toContain('"params":{}');
        expect(othersOtherE3HTML).toContain('</html>');

        // ---

        const {
            httpState: othersOtherE4HTTPState,
            docType: othersOtherE4DocType,
            html: othersOtherE4HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/others/other-e/123?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['foo.css'], file: 'foo.js' } },
            App, // Defined above.
        });
        expect(othersOtherE4HTTPState.status).toBe(200);
        expect(othersOtherE4DocType).toBe('<!doctype html>');
        expect(othersOtherE4HTML).toContain('<title data-key="title">other-e</title>');
        expect(othersOtherE4HTML).toContain('<link rel="stylesheet" href="./foo.css" media="all" data-key="styleBundle"/>');
        expect(othersOtherE4HTML).toContain('<script type="module" src="./foo.js" data-key="scriptBundle"></script>');
        expect(othersOtherE4HTML).toContain('"path":"./other-e/123"');
        expect(othersOtherE4HTML).toContain('"pathQuery":"./other-e/123?a=_a&b=_b&c=_c"');
        expect(othersOtherE4HTML).toContain('"restPath":""');
        expect(othersOtherE4HTML).toContain('"restPathQuery":""');
        expect(othersOtherE4HTML).toContain('"query":"?a=_a&b=_b&c=_c"');
        expect(othersOtherE4HTML).toContain('"queryVars":{"a":"_a","b":"_b","c":"_c"}');
        expect(othersOtherE4HTML).toContain('"params":{"x":"123"}');
        expect(othersOtherE4HTML).toContain('</html>');

        // ---

        const {
            httpState: _404HTTPState,
            docType: _404DocType,
            html: _404HTML,
        } = await $preact.iso.prerenderSPA({
            request: new Request(new URL('http://x.tld/nonexistent?a=_a&b=_b&c=_c')),
            appManifest: { 'index.html': { css: ['style.css'], file: 'script.js' } },
            App, // Defined above.
        });
        expect(_404HTTPState.status).toBe(404);
        expect(_404DocType).toBe('<!doctype html>');
        expect(_404HTML).toContain('<title data-key="title">404 Error: Not Found</title>');
        expect(_404HTML).not.toContain('<link rel="stylesheet" href="./style.css" media="all" data-key="styleBundle"/>');
        expect(_404HTML).not.toContain('<script type="module" src="./script.js" data-key="scriptBundle"></script>');
        expect(_404HTML).toContain('</html>');

        // ---

        await expect(async () => {
            await $preact.iso.prerenderSPA({
                request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
                appManifest: { 'index.html': { css: [], file: 'script.js' } },
                App, // Defined above.
            });
        }).rejects.toThrowError();

        // ---

        await expect(async () => {
            await $preact.iso.prerenderSPA({
                request: new Request(new URL('http://x.tld/?a=_a&b=_b&c=_c')),
                appManifest: { 'index.html': { css: ['style.css'], file: '' } },
                App, // Defined above.
            });
        }).rejects.toThrowError();
    });
});
