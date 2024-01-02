/**
 * Preact API.
 */

import { prerender } from '#@preact/apis/iso/index.tsx';
import { $app, $class, $dom, $env, $is, $obj, $obp, $path, $preact, $str, type $type } from '#index.ts';
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
        fetcher = new Fetcher({ globalObp: $str.obpPartSafe($app.$pkgName) + '.preactISOFetcher' });
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
    if (!$env.isSSR()) throw Error('kTqymmPe');

    // Extracts options into local variables.
    const { request, appManifest, App, props = {} } = options;

    const url = props.url || request.url;
    const baseURL = props.baseURL || $app.baseURL();

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
    if (!styleBundleSubpath) throw Error('GHj26RSc'); // Missing `appManifest[index.html].css[0]`.
    if (!scriptBundleSubpath) throw Error('hNnwQfBr'); // Missing `appManifest[index.html].file`.

    const styleBundle = './' + styleBundleSubpath;
    const scriptBundle = './' + scriptBundleSubpath;

    const appProps = {
        ...props,
        isHydration: false,

        // `<Location>` props.
        url, // Absolute URL extracted from request.
        baseURL, // Base URL from; e.g., {@see $app.baseURL()}.

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
export const hydrativelyRenderSPA = async (options: HydrativelyRenderSPAOptions): Promise<void> => {
    if (!$env.isWeb()) throw Error('N4WUN2gk');

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
        throw Error('NxgH8pMc'); // Missing <x-preact-app>.
    }

    /**
     * Regarding `<App>` props from server-side prerender. The thing to keep in mind is that if SSR props were used to
     * affect a prerender, then those exact same props should also be given when hydrating on the web. Otherwise, there
     * will be many problems. So long as that’s the case, though, everything will be just fine.
     *
     * `<Location>` props.
     *
     * - `url`: It’s either already in props, or auto-detected in a web browser.
     * - `baseURL`: It’s either already in props, or falls back to current app’s base.
     *
     * `<Data>` props.
     *
     * - `globalObp`: It’s either already in props, or `<Data>` will use the same default value as prerendering.
     * - `fetcher`: It’s either already in props, or `<Data>` will use the same default value as prerendering.
     * - `head`: It’s either already in props or in global script code; e.g., `styleBundle`, `scriptBundle`.
     */
};

// ---
// Lazy utilities.

/**
 * Produces a routed component that lazy loads a dynamically imported component.
 *
 * @param   loader      Dynamic import loader. For details {@see LazyComponentLoader}.
 * @param   routerProps Optional router props; {@see LazyRouterProps}.
 *
 * @returns             A routed component that lazy loads a dynamically imported component.
 */
export const lazyLoader = <Loader extends LazyComponentLoader>(loader: Loader, routerProps?: LazyRouterProps): ((props?: LazyComponentProps<Loader>) => LazyRouterVNode) => {
    return lazyComponent(async (props?: LazyComponentProps<Loader>): Promise<$preact.VNode<LazyComponentProps<Loader>>> => {
        return $preact.create((await loader()).default, props || ({} as LazyComponentProps<Loader>));
    }, routerProps);
};

/**
 * Produces a routed component that lazy loads an async function component.
 *
 * @param   fn          Async function component; {@see $preact.AsyncFnComponent}.
 * @param   routerProps Optional router props; {@see LazyRouterProps}.
 *
 * @returns             A routed component that lazy loads an async function component.
 */
export const lazyComponent = <Props extends $preact.AnyProps>(fn: $preact.AsyncFnComponent<Props>, routerProps?: LazyRouterProps): ((props?: Props) => LazyRouterVNode) => {
    let promise: ReturnType<$preact.AsyncFnComponent<Props>> | undefined, //
        fnDidResolve: true | undefined,
        fnRtn: Awaited<typeof promise> | undefined;

    const component: $preact.FnComponent<Props> = (props: Props): $preact.VNode<Props> | null => {
        const [, updateTicks] = $preact.useReducer((c) => (c + 1 >= 10000 ? 1 : c + 1), 0),
            didPromiseThenUpdateTicks = $preact.useRef() as $preact.Ref<true | undefined>;

        promise ??= fn(props).then((rtn) => ((fnDidResolve = true), (fnRtn = rtn)));
        if (fnDidResolve) {
            promise = didPromiseThenUpdateTicks.current = fnDidResolve = undefined;
            return fnRtn as $preact.VNode<Props> | null;
        }
        if (!didPromiseThenUpdateTicks.current) {
            didPromiseThenUpdateTicks.current = true;
            void promise.then(updateTicks);
        }
        throw promise;
    };
    return (props?: Props): LazyRouterVNode => {
        return (
            <Router {...routerProps}>
                <Route
                    default
                    component={(unusedꓺ: RoutedProps): $preact.VNode<RoutedProps> => {
                        return $preact.create(component, props || ({} as Props)) as unknown as $preact.VNode<RoutedProps>;
                    }}
                />
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
    let promise: Promise<Awaited<ReturnType<LazyRouteLoader>>['default']> | undefined, //
        component: Awaited<typeof promise> | undefined;

    return (props: RoutedProps): $preact.VNode<RoutedProps> => {
        const [, updateTicks] = $preact.useReducer((c) => (c + 1 >= 10000 ? 1 : c + 1), 0),
            didPromiseThenUpdateTicks = $preact.useRef(false);

        promise ??= loader().then((module) => (component = module.default));
        if (component) return $preact.create(component, props);

        if (!didPromiseThenUpdateTicks.current) {
            didPromiseThenUpdateTicks.current = true;
            void promise.then(updateTicks);
        }
        throw promise;
    };
};
