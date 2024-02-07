/**
 * Preact API.
 */

import { prerender } from '#@preact/apis/iso/index.tsx';
import { $dom, $env, $is, $obj, $path, $preact, $str, type $type } from '#index.ts';
import { defaultFetcher } from '#preact/components/data.tsx';
import { type State as HTTPState } from '#preact/components/http.tsx';
import { type Props as RootProps } from '#preact/components/root.tsx';
import { Route, default as Router, type RoutedProps, type Props as RouterProps } from '#preact/components/router.tsx';

/**
 * Defines types.
 */
export type PrerenderSPAOptions = {
    request: $type.Request;
    appManifest: AppManifest;
    App: $preact.AnyComponent<RootProps>;
    props?: RootProps;
};
export type PrerenderSPAPromise = Promise<{
    httpState: HTTPState;
    docType: string;
    html: string;
}>;
export type HydrativelyRenderSPAOptions = {
    App: $preact.AnyComponent<RootProps>;
    props?: RootProps;
};
export type AppManifest = { [x: $type.ObjectKey]: $type.Object };

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
 * Prerenders SPA component on server-side.
 *
 * A request-specific {@see $type.Fetcher} instance must be passed down through props when prerendering so the same
 * fetcher instance survives potentially multiple prerender passes; e.g., on thrown promises. Otherwise, a new fetcher
 * instance would be created on each prerender pass by `<Data>`, resulting in our fetcher cache resetting each time.
 *
 * @param   options Options; {@see PrerenderSPAOptions}.
 *
 * @returns         Prerendered SPA promise; {@see PrerenderSPAPromise}.
 *
 * @requiredEnv ssr -- This utility must only be used server-side.
 */
export const prerenderSPA = async (options: PrerenderSPAOptions): PrerenderSPAPromise => {
    if (!$env.isSSR()) throw Error('kTqymmPe');

    const opts = $obj.defaults({}, options || {}, { props: {} }) as Required<PrerenderSPAOptions>,
        { request, appManifest, App, props } = opts, // Extracts all options.
        //
        httpState = props.httpState || {}, // Passed through props as state by reference.
        url = props.url || request.url, // URL required, as we cannot detect via `location`.
        cspNonce = props.cspNonce || request.headers.get('x-csp-nonce') || '', // Nonce for CSP.
        fetcher = props.fetcher || defaultFetcher(); // Required for prerender; see notes above.

    let styleBundle: undefined | string, //
        scriptBundle: undefined | string; // Initialize.

    for (const htmlExt of $path.canonicalExtVariants('html')) {
        const htmlEntry = appManifest['index.' + htmlExt]; // Possibly `undefined`.

        if ($is.array(htmlEntry?.css) && $is.string(htmlEntry?.css?.[0]) && $is.string(htmlEntry?.file)) {
            styleBundle = './' + $str.lTrim((htmlEntry.css as string[])[0], './');
            scriptBundle = './' + $str.lTrim(htmlEntry.file, './');
            break; // We can stop here.
        }
    } // Let’s make sure we found style/script bundles.
    if (!styleBundle || './' === styleBundle) throw Error('wSTJgH4k');
    if (!scriptBundle || './' === scriptBundle) throw Error('M6spfQqT');

    const appProps = {
            ...props,

            // `<HTTP>` props.
            httpState, // By reference.

            // `<Location>` props.
            url, // Absolute request URL.

            // `<Data>` props.
            cspNonce, // Nonce for CSP.
            fetcher, // Request-specific fetcher.
            head: $obj.patchDeep({ styleBundle, scriptBundle }, props.head),
        },
        prerenderedData = await prerender(App, { props: appProps });

    let html = prerenderedData.html; // Prerendered HTML markup.

    if (!html /* 404 error when render is empty. */) {
        $obj.patchDeep(httpState, { status: 404 }); // Patches HTTP state.
        const StandAlone404 = (await import('#preact/components/404.tsx')).StandAlone;
        html = $preact.ssr.renderToString(<StandAlone404 class='preact-iso-404' />);
    }
    return { httpState: httpState as HTTPState, docType: '<!doctype html>', html };
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

    const appSelectors = 'body > x-preact-app',
        { App, props = {} } = options;

    let appToHydrate, appToRender;

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
     * `<HTTP>` props.
     *
     * - `httpState`: It’s entirely unnecessary client-side.
     *
     * `<Location>` props.
     *
     * - `url`: If not already in props, it’s detected via `window.location`.
     *
     * `<Data>` props.
     *
     * - `cspNonce`: If not already in props, `<Data>` uses global state from script code.
     * - `fetcher`: If not already in props, `<Data>` uses the same default as prerender does.
     * - `head`: If not already in props, `<Data>` uses global state from script code.
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
