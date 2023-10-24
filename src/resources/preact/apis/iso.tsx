/**
 * Preact API.
 */

import { $app, $class, $dom, $env, $is, $obj, $obp, $path, $preact, $str, $url, type $type } from '../../../index.ts';
import { defaultGlobalObp, type GlobalState } from '../../../preact/components/data.tsx';
import { type Props as RootProps } from '../../../preact/components/root.tsx';
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
export type PrerenderSPAPromise = Promise<{
    httpState: GlobalState['http'];
    docType: string;
    html: string;
}>;
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

    return fetcher;
};

/**
 * Prerenders SPA component on server-side.
 *
 * @param   options Options; {@see PrerenderSPAOptions}.
 *
 * @returns         Prerendered SPA promise; {@see PrerenderSPAPromise}.
 *
 * @requiredEnv ssr -- This utility must only be used server-side.
 */
export const prerenderSPA = async (options: PrerenderSPAOptions): PrerenderSPAPromise => {
    if (!$env.isSSR()) throw $env.errSSROnly;

    // Extracts options into local variables.
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

        const StandAlone404 = (await import('../../../preact/components/404.tsx')).StandAlone;
        html = $preact.ssr.renderToString(<StandAlone404 class='preact-iso-404' />);
    }
    return { httpState, docType: '<!doctype html>', html };
};

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param options Options; {@see HydrativelyRenderSPAOptions}.
 *
 * @requiredEnv web -- This utility must only be used client-side.
 */
export const hydrativelyRenderSPA = (options: HydrativelyRenderSPAOptions): void => {
    if (!$env.isWeb()) throw $env.errWebOnly;

    let appToHydrate, appToRender; // Queried below.
    const { App, props = {} } = options; // As local vars.

    /**
     * Hydrates when applicable, else renders.
     */
    if ((appToHydrate = $dom.query('body > x-preact-app[data-hydrate]'))) {
        $preact.hydrate(<App {...props} />, appToHydrate);
        //
    } else if ((appToRender = $dom.query('body > x-preact-app'))) {
        $preact.render(<App {...props} />, appToRender);
    } else {
        throw new Error('Missing <x-preact-app>.');
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
