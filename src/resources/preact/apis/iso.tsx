/**
 * Preact API.
 */

import { hydrate, prerender } from '@clevercanyon/preact-iso.fork';
import { $app, $class, $env, $is, $obj, $path, $preact, $str, $url, type $type } from '../../../index.ts';
import { type RouterProps } from '../../../preact/components.tsx';
import { type HTTPState } from '../../../preact/components/data.tsx';

/**
 * Defines types.
 */
export type Fetcher = $class.Fetcher;

export type PrerenderSPAOptions = {
    request: $type.Request;
    appManifest: AppManifest;
    App: $preact.FnComponent<RouterProps>;
    props?: Omit<RouterProps, 'url' | 'baseURL' | 'fetcher'>;
};
export type PrerenderSPAReturnProps = {
    httpState: HTTPState;
    docType: string;
    html: string;
};
export type HydrativelyRenderSPAOptions = {
    App: $preact.FnComponent<RouterProps>;
    props?: Omit<RouterProps, 'url' | 'baseURL' | 'fetcher'>;
};
export type AppManifest = { [x: $type.ObjectKey]: $type.Object };

/**
 * Fetcher instance.
 */
let fetcher: $class.Fetcher | undefined;

/**
 * Replaces native fetch and returns fetcher instance.
 *
 * @returns {@see $classꓺFetcherInterface} Instance.
 */
export const replaceNativeFetch = (): $class.Fetcher => {
    if (!fetcher) {
        const Fetcher = $class.getFetcher();
        fetcher = new Fetcher({
            globalObp: $str.obpPartSafe($app.pkgName) + '.preactISOFetcher',
        });
    } // Replace each time, ensuring consistency.
    fetcher.replaceNativeFetch(); // Replaces native fetch.

    return fetcher; // Fetcher class instance.
};
export { replaceNativeFetch as getFetcher }; // Exports friendly alias.

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
    const { url } = request; // Extracts absolute request URL.
    const baseURL = $url.appBase(); // Base URL from app env vars.

    let appManifestStyleBundleSubpath: string = ''; // Style bundle.
    let appManifestScriptBundleSubpath: string = ''; // Script bundle.

    for (const htmlExt of $path.canonicalExtVariants('html')) {
        const htmlEntry = appManifest['index.' + htmlExt]; // Possibly undefined value.
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

    const fetcher = replaceNativeFetch();
    const prerenderedData = await prerender(App, {
        props: {
            ...props, // Props given by options.
            url, // Absolute URL extracted from request.
            baseURL, // Base URL from app environment vars.
            fetcher, // Preact ISO fetcher; {@see replaceNativeFetch()}.
            head: $obj.mergeDeep({ mainStyleBundle, mainScriptBundle }, props.head),
        },
    }); // Restores native fetch on prerender completion.
    fetcher.restoreNativeFetch(); // Restore to avoid conflicts.

    const Error404 = (await import('../../../preact/components/error-404.tsx')).StandAlone;
    const { state: httpState } = !prerenderedData.html ? { state: { status: 404 } } : $preact.useHTTP();
    const html = !prerenderedData.html ? $preact.ssr.renderToString(<Error404 class='default-prerender' />) : prerenderedData.html;

    return { httpState, docType: '<!doctype html>', html };
};

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param options Options; {@see HydrativelyRenderSPAOptions}.
 *
 * @note Client-side use only.
 */
export const hydrativelyRenderSPA = (options: HydrativelyRenderSPAOptions): void => {
    if (!$env.isWeb() /* Web browser required; uses DOM. */) {
        throw $env.errClientSideOnly; // Not possible.
    }
    const doc = document; // Shorter document alias.
    const { App, props = {} } = options; // Extracts locals.

    (doc.childNodes || []).forEach((node) => {
        // Please note that Preact explicitly references `(parentDom = document).firstChild`; {@see https://o5p.me/8d6YM5}.
        // Therefore, if we don’t remove doctype/comment nodes, `firstChild` will be absolutely wrong, and Preact will crash.
        // Removing doctype doesn’t actually change `document.compatMode`, so this seems to be ok in Chrome/Safari/Firefox tests.
        // However, removing doctype does cause `document.doctype` to return `null`, unfortunately, so please beware.
        if (Node.DOCUMENT_TYPE_NODE === node.nodeType || Node.COMMENT_NODE === node.nodeType) doc.removeChild(node);
    });
    if (doc.querySelector('html.preact') /* Our preact HTML component rendered the HTML tag? */) {
        hydrate(<App {...{ ...props, fetcher: replaceNativeFetch() }} />, doc);
    } else {
        $preact.render(<App {...{ ...props }} />, doc);
    }
};
