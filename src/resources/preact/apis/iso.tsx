/**
 * Preact API.
 */

import { $app, $class, $env, $is, $obj, $obp, $path, $preact, $str, $url, type $type } from '../../../index.ts';
import { type RootProps } from '../../../preact/components.tsx';
import { defaultGlobalObp, type GlobalState } from '../../../preact/components/data.tsx';
import { default as prerender } from './iso/prerender.tsx';

/**
 * Defines types.
 */
export type Fetcher = $type.Fetcher;

export type PrerenderSPAOptions = {
    request: $type.Request;
    appManifest: AppManifest;
    App: $preact.AnyComponent<RootProps>;
    props?: RootProps;
};
export type PrerenderSPAReturnProps = {
    httpState: GlobalState['http'];
    docType: string;
    html: string;
};
export type HydrativelyRenderSPAOptions = {
    App: $preact.AnyComponent<RootProps>;
    props?: RootProps;
};
export type AppManifest = { [x: $type.ObjectKey]: $type.Object };

/**
 * Fetcher instance.
 */
let fetcher: $type.Fetcher | undefined;

/**
 * Replaces native fetch and returns fetcher.
 *
 * @returns {@see $type.Fetcher} Instance.
 */
export const replaceNativeFetch = (): $type.Fetcher => {
    if (!fetcher) {
        const Fetcher = $class.getFetcher();
        fetcher = new Fetcher({ globalObp: $str.obpPartSafe($app.pkgName) + '.preactISOFetcher' });
    }
    fetcher.replaceNativeFetch();
    return fetcher; // {@see $type.Fetcher}.
};

/**
 * Prerenders SPA component on server-side.
 *
 * @param   options Options; {@see PrerenderSPAOptions}.
 *
 * @returns         Prerendered SPA object properties; {@see PrerenderSPAReturnProps}.
 *
 * @note Server-side use only, with an exception for automated testing.
 * @note Prerendering on web is technically doable, but we discourage use outside testing.
 */
export const prerenderSPA = async (options: PrerenderSPAOptions): Promise<PrerenderSPAReturnProps> => {
    if ($env.isWeb() && !$env.isTest()) {
        throw $env.errServerSideOnly;
    }
    const { request, appManifest, App, props = {} } = options;

    const url = props.url || request.url;
    const baseURL = props.baseURL || $url.appBase();

    const globalObp = props.globalObp || defaultGlobalObp();
    const fetcher = props.fetcher || replaceNativeFetch();

    let appManifestStyleBundleSubpath: string = ''; // Style bundle.
    let appManifestScriptBundleSubpath: string = ''; // Script bundle.

    for (const htmlExt of $path.canonicalExtVariants('html')) {
        const htmlEntry = appManifest['index.' + htmlExt]; // Possibly undefined.
        if ($is.array(htmlEntry?.css) && $is.string(htmlEntry?.css?.[0]) && $is.string(htmlEntry?.file)) {
            appManifestStyleBundleSubpath = $str.lTrim((htmlEntry.css as string[])[0], './');
            appManifestScriptBundleSubpath = $str.lTrim(htmlEntry.file, './');
            break; // We can stop here.
        }
    } // Now let’s confirm we found the bundle files.
    if (!appManifestStyleBundleSubpath) throw new Error('Missing `appManifest[index.html].css[0]`.');
    if (!appManifestScriptBundleSubpath) throw new Error('Missing `appManifest[index.html].file`.');

    const mainStyleBundle = './' + appManifestStyleBundleSubpath;
    const mainScriptBundle = './' + appManifestScriptBundleSubpath;

    const appProps = {
        ...props, // Option props.

        // `<Location>` props.
        url, // Absolute URL extracted from request.
        baseURL, // Base URL from app environment vars.

        // `<Data>` props.
        globalObp, // Global object path.
        fetcher, // Preact ISO fetcher; {@see replaceNativeFetch()}.
        head: $obj.mergeDeep({ mainStyleBundle, mainScriptBundle }, props.head),
    };
    const prerenderedData = await prerender(App, { props: appProps });
    fetcher.restoreNativeFetch(); // Restore to avoid conflicts.

    let html = prerenderedData.html; // Prerendered HTML markup.
    let httpState = $obp.get(globalThis, globalObp + '.http') as GlobalState['http'];

    if (!html /* 404 error when render is empty. */) {
        httpState = { ...httpState, status: 404 };
        $obp.set(globalThis, globalObp + '.http', httpState);

        const Error404StandAlone = (await import('../../../preact/components/error-404.tsx')).StandAlone;
        html = $preact.ssr.renderToString(<Error404StandAlone class='default-prerender' />);
    }
    return { httpState, docType: '<!doctype html>', html };
};

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param options Options; {@see HydrativelyRenderSPAOptions}.
 *
 * @note This is strictly for client-side use only. No exceptions.
 *       Local testing using jsDOM is fine, since that `$env.isWeb()`.
 */
export const hydrativelyRenderSPA = (options: HydrativelyRenderSPAOptions): void => {
    if (!$env.isWeb() /* Web browser required; uses DOM. */) {
        throw $env.errClientSideOnly; // Not possible.
    }
    const { App, props = {} } = options;
    const doc: Document = document; // Shorter alias.
    let docNode: Document = doc; // Virtual in some cases.

    /**
     * Preact explicitly references `.firstChild`; {@see https://o5p.me/8d6YM5}. Therefore, if we don’t remove
     * doctype/comment nodes, `.firstChild` will be absolutely wrong, and Preact will crash. Removing doctype doesn’t
     * actually change `document.compatMode`, so this seems to be ok in Chrome/Safari/Firefox tests. However, removing
     * doctype does cause `document.doctype` to return `null`, unfortunately, so please beware.
     */
    (doc.childNodes || []).forEach((node) => {
        if (Node.DOCUMENT_TYPE_NODE === node.nodeType || Node.COMMENT_NODE === node.nodeType) {
            doc.removeChild(node); // Removes doctype and comment nodes.
        }
    });

    /**
     * On local web with Vite HMR/Prefresh.
     *
     * This creates a virtual document node for HMR/prefresh, because we need to be able to replace the existing
     * `<html>` node via HMR. Without a virtual document node, `insertBefore()` will crash, because there can only be a
     * single child node under `document`. Vite prefresh w/Preact isn’t smart enough by itself, so this fixes.
     *
     * @note Inspired by Preact Root Fragment; {@see https://o5p.me/aMHdC2}.
     */
    if ($env.isLocalWebVitePrefresh()) {
        docNode = (() => {
            const html = (): HTMLHtmlElement | null => doc.querySelector('html');
            const initialHTMLNode = html(); // Initial HTML node reference.

            const virtualDoc: $type.Object = {
                nodeType: 1,
                parentNode: null,

                firstChild: initialHTMLNode,
                childNodes: [initialHTMLNode],

                replaceChild: (c: HTMLHtmlElement) => {
                    doc.replaceChild(c, html() as HTMLHtmlElement);
                    virtualDoc.firstChild = html();
                },
                removeChild: (c: HTMLHtmlElement) => {
                    doc.removeChild(c); // No change.
                    virtualDoc.firstChild = html();
                },
            }; // We want these to follow the same pattern as `replaceChild()`.
            virtualDoc.insertBefore = virtualDoc.appendChild = virtualDoc.replaceChild;

            // Note: `__k` is `_children` in Preact bundle.
            // {@see https://o5p.me/1mZOFk} map in mangle.json.
            (doc as unknown as $type.Object).__k = virtualDoc;

            return virtualDoc;
        })() as unknown as Document;
    }

    /**
     * Hydrates when applicable; else renders.
     *
     * @note Uses `docNode`, which is potentially a virtual node.
     */
    if (doc.querySelector('html.preact') /* Our preact HTML component rendered the HTML tag? */) {
        $preact.hydrate(<App {...props} />, docNode);
    } else {
        $preact.render(<App {...props} />, docNode);
    }

    /**
     * Regarding `<App>` props from server-side prerender.
     *
     * `<Location>` props.
     *
     * - `url`: It’s either already in props, or auto-detected in a web browser, so no need to populate here.
     * - `baseURL`: It’s either already in props, or auto-detected in a web browser, so no need to populate here. e.g.,
     *   using `<base href>` already inserted by `<Head>` server-side.
     *
     * `<Data>` props.
     *
     * - `globalObp`: It’s either already in props, or `<Data>` will use default, so no need to populate here.
     * - `fetcher`: It’s either already in props, or `<Data>` will use default, so no need to populate here.
     * - `head`: What isn’t already in props will already be in global script code; e.g., `mainStyleBundle`,
     *   `mainScriptBundle`, so no need to populate here.
     */
};
