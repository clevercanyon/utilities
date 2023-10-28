/**
 * Preact API.
 */

import { $app, $class, $dom, $env, $is, $obj, $obp, $path, $preact, $str, $url, type $type } from '../../../index.ts';
import { defaultGlobalObp, type GlobalState } from '../../../preact/components/data.tsx';
import { type Props as RootProps } from '../../../preact/components/root.tsx';
import { Route, default as Router, type RoutedProps, type Props as RouterProps } from '../../../preact/components/router.tsx';
import { prerender } from './iso/index.tsx';

/**
 * Defines types.
 */
export type Fetcher = $type.Fetcher;
export type AppManifest = { [x: $type.ObjectKey]: $type.Object };

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
export type LazyComponentOptions = Omit<RouterProps, 'key' | 'ref' | 'children'>;
export type LazyRouteLoader = () => Promise<{ default: $preact.AnyComponent<RoutedProps> } | $preact.AnyComponent<RoutedProps>>;

// ---
// Prerender utilities.

/**
 * Fetcher instance.
 */
let fetcher: Fetcher | undefined;

/**
 * Replaces native fetch and returns fetcher.
 *
 * @returns {@see Fetcher} Instance.
 */
export const replaceNativeFetch = (): Fetcher => {
    if (!fetcher) {
        const Fetcher = $class.getFetcher();
        fetcher = new Fetcher({ globalObp: $str.obpPartSafe($app.pkgName) + '.preactISOFetcher' });
    }
    return fetcher.replaceNativeFetch();
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

    let styleBundleSubpath: string = ''; // Style bundle.
    let scriptBundleSubpath: string = ''; // Script bundle.

    for (const htmlExt of $path.canonicalExtVariants('html')) {
        const htmlEntry = appManifest['index.' + htmlExt]; // `undefined`, perhaps.
        if ($is.array(htmlEntry?.css) && $is.string(htmlEntry?.css?.[0]) && $is.string(htmlEntry?.file)) {
            styleBundleSubpath = $str.lTrim((htmlEntry.css as string[])[0], './');
            scriptBundleSubpath = $str.lTrim(htmlEntry.file, './');
            break; // We can stop here.
        }
    } // Now let’s confirm we found the bundle files.
    if (!styleBundleSubpath) throw new Error(); // Missing `appManifest[index.html].css[0]`.
    if (!scriptBundleSubpath) throw new Error(); // Missing `appManifest[index.html].file`.

    const styleBundle = './' + styleBundleSubpath;
    const scriptBundle = './' + scriptBundleSubpath;

    const appProps = {
        ...props,
        isHydration: false,

        // `<Location>` props.
        url, // Absolute URL extracted from request.
        baseURL, // Base URL from app environment vars.

        // `<Data>` props.
        globalObp, // Global object path.
        fetcher, // Preact ISO fetcher; {@see replaceNativeFetch()}.
        head: $obj.mergeDeep({ styleBundle, scriptBundle }, props.head),
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

// ---
// Hydration utilities.

/**
 * Hydratively renders SPA component on client-side.
 *
 * @param options Options; {@see HydrativelyRenderSPAOptions}.
 *
 * @requiredEnv web -- This utility must only be used client-side.
 */
export const hydrativelyRenderSPA = (options: HydrativelyRenderSPAOptions): void => {
    if (!$env.isWeb()) throw $env.errWebOnly;

    const appSelectors = 'body > x-preact-app';
    let appToHydrate, appToRender; // Queried below.
    const { App, props = {} } = options; // As local vars.

    /**
     * Hydrates when applicable, else renders.
     */
    if ((appToHydrate = $dom.query(appSelectors + '[data-hydrate]'))) {
        $preact.hydrate(<App {...{ ...props, isHydration: true }} />, appToHydrate);
        //
    } else if ((appToRender = $dom.query(appSelectors))) {
        $preact.render(<App {...{ ...props, isHydration: false }} />, appToRender);
    } else {
        throw new Error(); // Missing <x-preact-app>.
    }

    /**
     * Regarding `<App>` props from server-side prerender. The thing to keep in mind is that if SSR props were used to
     * affect a prerender, then those exact same props should also be given when hydrating on the web. Otherwise, there
     * will be many problems. So long as that’s the case, though, everything will be just fine.
     *
     * `<Location>` props.
     *
     * - `url`: It’s either already in props, or auto-detected in a web browser, so no need to populate here.
     * - `baseURL`: It’s either already in props, or falls back to current app’s base, so no need to populate here.
     *
     * `<Data>` props.
     *
     * - `globalObp`: It’s either already in props, or `<Data>` will use default, so no need to populate here.
     * - `fetcher`: It’s either already in props, or `<Data>` will use default, so no need to populate here.
     * - `head`: It’s either already in props, or in global script code; e.g., `styleBundle`, `scriptBundle`.
     */
};

// ---
// Lazy utilities.

/**
 * Produces a lazy loaded route component.
 *
 * @param   loader For details {@see LazyRouteLoader}.
 *
 * @returns        Higher order route component; {@see $preact.FnComponent}.
 */
export const lazyRoute = (loader: LazyRouteLoader): $preact.FnComponent<RoutedProps> => {
    let promise: ReturnType<LazyRouteLoader> | undefined;
    let component: $preact.AnyComponent<RoutedProps> | undefined;

    return (props: $preact.Props<RoutedProps>): $preact.VNode<RoutedProps> => {
        const didChainPromiseResolution = $preact.useRef(false);
        const [, updateResolvedState] = $preact.useState(false);

        if (!promise) {
            promise = loader().then((exportsOrComponent): Awaited<ReturnType<LazyRouteLoader>> => {
                return (component = (exportsOrComponent as { default: $preact.AnyComponent<RoutedProps> }).default || exportsOrComponent);
            });
        }
        if (undefined !== component) {
            return $preact.create(component, props);
            //
        } else if (!didChainPromiseResolution.current) {
            didChainPromiseResolution.current = true;

            void promise.then((component): $preact.AnyComponent<RoutedProps> => {
                updateResolvedState(true); // Triggers re-render.
                return component as $preact.AnyComponent<RoutedProps>;
            });
        }
        throw promise;
    };
};

/**
 * Produces a lazy loaded component.
 *
 * @param   asyncComponent Async component to be lazy loaded.
 * @param   options        Options (all optional); {@see LazyComponentOptions}.
 *
 * @returns                Higher order lazy component; {@see $preact.FnComponent}.
 */
export const lazyComponent = <Props extends $preact.Props = $preact.Props>(
    asyncComponent: $preact.AsyncFnComponent<Props>,
    options?: LazyComponentOptions,
): $preact.FnComponent<Props> => {
    const opts = options || {};
    const higherOrder = { props: {} as Props };

    const ComponentRoute = lazyRoute(async (): ReturnType<LazyRouteLoader> => {
        const renderedAsyncComponentVNode = await asyncComponent(higherOrder.props);
        return (unusedꓺprops: RoutedProps) => renderedAsyncComponentVNode;
    });
    return (props: Parameters<$preact.AsyncFnComponent<Props>>[0]): Awaited<ReturnType<$preact.AsyncFnComponent<Props>>> => {
        higherOrder.props = props; // Populates async component props.
        return (
            <Router {...{ handleScrolling: false, ...opts }}>
                <Route default component={ComponentRoute} />
            </Router>
        );
    };
};
