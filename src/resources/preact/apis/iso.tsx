/**
 * Preact API.
 */

import { hydrate, prerender } from '@clevercanyon/preact-iso.fork';
import { $app, $class, $env, $is, $obj, $path, $preact, $str, type $type } from '../../../index.ts';
import { type HTTPState } from '../../../preact/components/data.tsx';
import { type Props as RouterProps } from '../../../preact/components/router.tsx';

/**
 * Defines types.
 */
export type Fetcher = $class.Fetcher;

export type PrerenderSPAOptions = {
    request: $type.Request;
    appManifest: AppManifest;
    App: $preact.FnComponent<RouterProps>;
    props?: Omit<RouterProps, 'url' | 'fetcher'>;
};
export type PrerenderSPAReturnProps = {
    httpState: HTTPState;
    docType: string;
    html: string;
    linkURLs: string[];
};
export type HydrativelyRenderSPAOptions = {
    App: $preact.FnComponent<RouterProps>;
    props?: Omit<RouterProps, 'url' | 'fetcher'>;
};
type AppManifest = { [x: string]: { css: string[]; file: string } };

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
 * @note Prerendering on web is technically doable, but we discourage use outside testing.
 */
export const prerenderSPA = async (options: PrerenderSPAOptions): Promise<PrerenderSPAReturnProps> => {
    if ($env.isWeb() && !$env.isTest()) {
        throw $env.errServerSideOnly;
    }
    const { request, appManifest, App, props = {} } = options;
    const { url } = request; // Extracts absolute URL from request.
    const appBasePath = $env.get('APP_BASE_PATH', { type: 'string', default: '' });

    let appManifestStyleBundleSubpath: string = ''; // Style bundle.
    let appManifestScriptBundleSubpath: string = ''; // Script bundle.

    for (const htmlExt of $path.canonicalExtVariants('html')) {
        if ($is.string(appManifest['index.' + htmlExt]?.css?.[0]) && $is.string(appManifest['index.' + htmlExt]?.file)) {
            appManifestStyleBundleSubpath = $str.trim(appManifest['index.' + htmlExt]?.css?.[0], './');
            appManifestScriptBundleSubpath = $str.trim(appManifest['index.' + htmlExt]?.file, './');
            break; // We can stop here.
        }
    } // Now let’s confirm we found the bundle files.
    if (!appManifestStyleBundleSubpath) throw new Error('Missing `appManifest[index.html].css[0]`.');
    if (!appManifestScriptBundleSubpath) throw new Error('Missing `appManifest[index.html].file`.');

    const mainStyleBundle = appBasePath + '/' + appManifestStyleBundleSubpath;
    const mainScriptBundle = appBasePath + '/' + appManifestScriptBundleSubpath;

    const fetcher = replaceNativeFetch();
    const prerenderedData = await prerender(App, {
        props: {
            ...props, // Props given by options.
            url, // Absolute URL extracted from request.
            fetcher, // Preact ISO fetcher; {@see replaceNativeFetch()}.
            head: $obj.mergeDeep({ mainStyleBundle, mainScriptBundle }, props.head),
        },
    }); // Restores native fetch on prerender completion.
    fetcher.restoreNativeFetch(); // Restore to avoid conflicts.

    const Error404 = (await import('../../../preact/routes/error-404.tsx')).StandAlone;
    const { state: httpState } = !prerenderedData.html ? { state: { status: 404 } } : $preact.useHTTP();
    const html = !prerenderedData.html ? $preact.ssr.renderToString(<Error404 classes={'default-prerender'} />) : prerenderedData.html;
    const linkURLs = [...prerenderedData.links]; // Converts link URLs into array.

    return { httpState, docType: '<!DOCTYPE html>', html, linkURLs };
};

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param options Options; {@see HydrativelyRenderSPAOptions}.
 *
 * @note Client-side use only.
 */
export const hydrativelyRenderSPA = (options: HydrativelyRenderSPAOptions): void => {
    if (!$env.isWeb()) throw $env.errClientSideOnly;

    const { App, props = {} } = options; // Extract as local variables.
    const fetcher = replaceNativeFetch(); // Replaces native fetch.

    if (document.querySelector('html[data-preact-iso]')) {
        hydrate(<App {...{ ...props, fetcher }} />, document);
    } else {
        $preact.render(<App {...{ ...props, fetcher }} />, document);
    }
};
