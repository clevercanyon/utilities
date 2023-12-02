/**
 * Preact API.
 */

import { prerender } from '#@preact/apis/iso/index.tsx';
import { $app, $class, $dom, $env, $is, $obj, $obp, $path, $preact, $str, $url, type $type } from '#index.ts';
import { defaultGlobalObp, type GlobalState } from '#preact/components/data.tsx';
import { type Props as RootProps } from '#preact/components/root.tsx';
import { Route, default as Router, type RoutedProps, type Props as RouterProps } from '#preact/components/router.tsx';

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
export type LazyComponentLoader<Props extends $preact.AnyProps = $preact.Props> = () => Promise<{ default: $preact.AnyComponent<Props> }>;
export type LazyComponentProps<Type extends LazyComponentLoader> = // Conditional type.
    Awaited<ReturnType<Type>>['default'] extends $preact.ClassComponent
        ? ConstructorParameters<Awaited<ReturnType<Type>>['default']>[0] extends undefined
            ? $preact.Props
            : ConstructorParameters<Awaited<ReturnType<Type>>['default']>[0]
        : Awaited<ReturnType<Type>>['default'] extends $preact.FnComponent
          ? Parameters<Awaited<ReturnType<Type>>['default']>[0] extends undefined
              ? $preact.Props
              : Parameters<Awaited<ReturnType<Type>>['default']>[0]
          : $preact.Props;

export type LazyRouteLoader = () => Promise<{ default: $preact.AnyComponent<RoutedProps> }>;
export type LazyRouterProps = Omit<RouterProps, 'children'>; // Except, no `children`.
export type LazyRouterVNode = $preact.VNode<LazyRouterProps>;

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

        const StandAlone404 = (await import('#preact/components/404.tsx')).StandAlone;
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
 * Lazy loads a routed, dynamically imported component.
 *
 * @param   loader      Dynamic import loader. For details {@see LazyComponentLoader}.
 * @param   props       Potentially required component props; {@see LazyComponentProps}.
 * @param   routerProps Optional router props; {@see LazyRouterProps}.
 *
 * @returns             VNode created by a routed, lazy loaded, dynamically imported component.
 */
export const lazyLoad = <Loader extends LazyComponentLoader>(loader: Loader, props?: LazyComponentProps<Loader>, routerProps?: LazyRouterProps): LazyRouterVNode => {
    return $preact.create(lazyLoader(loader, routerProps), props || ({} as LazyComponentProps<Loader>)) as LazyRouterVNode;
};

/**
 * Produces a routed component that lazy loads a dynamically imported component.
 *
 * @param   loader      Dynamic import loader. For details {@see LazyComponentLoader}.
 * @param   routerProps Optional router props; {@see LazyRouterProps}.
 *
 * @returns             A routed component that lazy loads a dynamically imported component.
 */
export const lazyLoader = <Loader extends LazyComponentLoader>(loader: Loader, routerProps?: LazyRouterProps): ((props?: LazyComponentProps<Loader>) => LazyRouterVNode) => {
    return lazyAsyncLoader(async (props?: LazyComponentProps<Loader>): Promise<$preact.VNode<LazyComponentProps<Loader>>> => {
        return $preact.create((await loader()).default, props || ({} as LazyComponentProps<Loader>));
    }, routerProps);
};

/**
 * Lazy loads a routed async function component.
 *
 * @param   fn          Async function component to be lazy loaded; {@see $preact.AsyncFnComponent}.
 * @param   props       Potentially required component props; {@see $preact.AsyncFnComponent<Props>}.
 * @param   routerProps Optional router props; {@see LazyRouterProps}.
 *
 * @returns             VNode created by a routed, lazy loaded, async function component.
 */
export const lazyLoadAsync = <Props extends $preact.AnyProps>(fn: $preact.AsyncFnComponent<Props>, props?: Props, routerProps?: LazyRouterProps): LazyRouterVNode => {
    return $preact.create(lazyAsyncLoader(fn, routerProps), props || ({} as Props)) as LazyRouterVNode;
};

/**
 * Produces a routed component that lazy loads an async function component.
 *
 * @param   fn          Async function component; {@see $preact.AsyncFnComponent}.
 * @param   routerProps Optional router props; {@see LazyRouterProps}.
 *
 * @returns             A routed component that lazy loads an async function component.
 */
export const lazyAsyncLoader = <Props extends $preact.AnyProps>(fn: $preact.AsyncFnComponent<Props>, routerProps?: LazyRouterProps): ((props?: Props) => LazyRouterVNode) => {
    const lazyAsyncFnComponentProps = { current: {} as Props };
    const LazyPseudoRoute = lazyRoute(async (): ReturnType<LazyRouteLoader> => {
        const renderedAsyncFnComponentVNode = await fn(lazyAsyncFnComponentProps.current);
        return { default: (unusedꓺ: RoutedProps): $preact.VNode<RoutedProps> | null => renderedAsyncFnComponentVNode };
    });
    return (props?: Props): LazyRouterVNode => {
        if (props) lazyAsyncFnComponentProps.current = props;
        return (
            <Router {...routerProps}>
                <Route default component={LazyPseudoRoute} />
            </Router>
        );
    };
};

/**
 * Produces an unrouted component that lazy loads a route component.
 *
 * @param   loader Dynamic import loader. For details {@see LazyRouteLoader}.
 *
 * @returns        An unrouted component that lazy loads a route component. Suitable for use as the `component` prop
 *   passed to a routed {@see Route}; e.g., `<Router><Route component={lazyRoute(...)} /></Router>`.
 *
 * @note This utility is at the heart of all our other lazy loading utilities.
 */
export const lazyRoute = (loader: LazyRouteLoader): $preact.FnComponent<RoutedProps> => {
    let promise: Promise<Awaited<ReturnType<LazyRouteLoader>>['default']> | undefined;
    let component: Awaited<typeof promise> | undefined;

    return (props: RoutedProps): $preact.VNode<RoutedProps> => {
        const didChainPromiseResolution = $preact.useRef(false);
        const [, updateResolvedState] = $preact.useState(false);

        promise ??= loader().then((module) => (component = module.default));
        if (component) return $preact.create(component, props);

        if (!didChainPromiseResolution.current) {
            didChainPromiseResolution.current = true;
            void promise.then((): void => updateResolvedState(true));
        }
        throw promise;
    };
};
