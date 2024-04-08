/**
 * Preact API.
 */

import { $dom, $env, $is, $obj, $path, $preact, $str, type $type } from '#index.ts';
import { defaultFetcher, defaultLazyCPs, fetcherGlobalToScriptCodeReplacementCode } from '#preact/components/data.tsx';
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
    cfw?: $type.$cfw.RequestContextData;
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

export type LazyComponentLoader<Props extends $preact.AnyProps = $preact.Props> = //
    () => Promise<{ default: $preact.AnyComponent<Props> }>;

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

export type LazyComponentPromises = {
    counter: number;
    promises: {
        promise: { current?: Promise<$preact.VNode | null> };
        resolved: { current?: boolean }; // Promise resolved?
        resolvedVNode: { current?: $preact.VNode | null };
    }[];
};
export type LazyRouteLoader = () => Promise<{ default: $preact.AnyComponent<RoutedProps> }>;
export type LazyRouterProps = Omit<RouterProps, 'children'>; // Except, no `children`.
export type LazyRouterVNode = $preact.VNode<LazyRouterProps>;

// ---
// Prerender utilities.

/**
 * Prerenders SPA component server-side.
 *
 * A request-specific {@see HTTPState} must be passed down through props when prerendering, such that it can be
 * referenced immediately after; i.e., to determine, potentially modify, and ultimately return HTTP state.
 *
 * A request-specific {@see $type.Fetcher} instance must also be passed down through props when prerendering, such that
 * the same fetcher instance survives potentially multiple prerender passes; e.g., on thrown promises. Otherwise, a new
 * fetcher instance would be created each time by `<Data>`, resulting in our fetcher cache resetting each time.
 *
 * The same is true for `lazyCPs`, which are {@see $preact.iso.LazyComponentPromises}. They must also persist state
 * between prerender passes, such that their state is not lost from one prerender pass to the next.
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
        { request, appManifest, App, cfw, props } = opts,
        //
        httpState = props.httpState || {},
        url = props.url || request.url, // Server-side.
        cspNonce = props.cspNonce || request.headers.get('x-csp-nonce') || '',
        fetcher = props.fetcher || defaultFetcher({ cfw }),
        lazyCPs = props.lazyCPs || defaultLazyCPs();

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
        lazyCPs, // Request-specific lazy component promises.
        head: $obj.patchDeep({ styleBundle, scriptBundle }, props.head),
    };
    let html = await $preact.ssr.renderToString(App, { props: appProps });
    if (html) html = html.replace(fetcherGlobalToScriptCodeReplacementCode(), fetcher.globalToScriptCode());

    if (!html && !Object.hasOwn(httpState, 'body')) {
        const StandAlone404 = (await import('#preact/components/404.tsx')).StandAlone;
        html = await $preact.ssr.renderToString(<StandAlone404 class='preact-iso-404' />);
        $obj.patchDeep(httpState, { status: 404 }); // 404 error when empty.
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
     * - `url`: If not already in props, it’s detected via `location`.
     *
     * `<Data>` props.
     *
     * - `cspNonce`: If not already in props, `<Data>` uses global state from script code.
     * - `fetcher`: If not already in props, `<Data>` uses the same default as prerender does.
     * - `lazyCPs`: If not already in props, `<Data>` uses the same default as prerender does.
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
export const lazyLoader = <Loader extends LazyComponentLoader>(loader: Loader, routerProps?: LazyRouterProps): ((props?: LazyComponentProps<Loader>) => LazyRouterVNode | null) => {
    return lazyComponent(async (props?: LazyComponentProps<Loader>): Promise<$preact.VNode<LazyComponentProps<Loader>>> => {
        return $preact.create((await loader()).default, props || ({} as LazyComponentProps<Loader>));
    }, routerProps);
};

/**
 * Produces a routed component that lazy loads an async function component.
 *
 * Note: For now, any hooks/contexts needed by an async function component must be passed down as props.
 *
 * Why? The problem is that because this is async, components throw a promise, childDidSuspend(), and Preact moves on.
 * Within the promise function `currentComponent` has changed in the eyes of Preact, which means hooks/contexts won’t
 * work inside async functions. We are not sure how to fix this. {@see lazyRoute()} doesn’t have this problem because
 * promises are connected to imports. Here, what we have is essentially a promise forking itself outside of the Preact
 * workflow. For now, any hooks/contexts needed by an async function component must be passed down as props.
 *
 * @param   fn          Async function component; {@see $preact.AsyncFnComponent}.
 * @param   routerProps Optional router props; {@see LazyRouterProps}.
 *
 * @returns             A routed component that lazy loads an async function component.
 *
 * @review: Consider ways to improve this. See notes above regarding `currentComponent`.
 */
export const lazyComponent = <Props extends $preact.AnyProps>(fn: $preact.AsyncFnComponent<Props>, routerProps?: LazyRouterProps): ((props?: Props) => LazyRouterVNode | null) => {
    type Context = {
        isSSR: boolean;
        lazyCPi: number;
        lazyCPs: LazyComponentPromises;
        props: Props | undefined;
    };
    const ContextObject = $preact.createContext({} as Context),
        useContext = (): Context => $preact.useContext(ContextObject);

    const Lazy = (unusedꓺ: RoutedProps): $preact.VNode<RoutedProps> | null => {
        const { isSSR, lazyCPi, lazyCPs, props } = useContext(),
            didPromiseThen = $preact.useRef() as $preact.Ref<boolean>,
            [, updateTicks] = $preact.useReducer((c) => (c + 1 >= 10000 ? 1 : c + 1), 0),
            //
            promiseRef = $preact.useRef() as $preact.Ref<Promise<$preact.VNode | null>>,
            resolvedRef = $preact.useRef() as $preact.Ref<boolean>, // Promise resolved?
            resolvedVNodeRef = $preact.useRef() as $preact.Ref<$preact.VNode | null>,
            //
            promise = isSSR ? lazyCPs.promises[lazyCPi].promise : promiseRef,
            resolved = isSSR ? lazyCPs.promises[lazyCPi].resolved : resolvedRef,
            resolvedVNode = isSSR ? lazyCPs.promises[lazyCPi].resolvedVNode : resolvedVNodeRef;

        promise.current ??= fn(props || ({} as Props)) //
            .then((value) => ((resolved.current = true), (resolvedVNode.current = value)));

        if (resolved.current) {
            const vNode = resolvedVNode.current as $preact.VNode<RoutedProps> | null;
            if (!isSSR) didPromiseThen.current = promise.current = resolved.current = resolvedVNode.current = null;
            return vNode; // i.e., vNode or `null` return value from async component function.
        }
        if (!didPromiseThen.current) {
            didPromiseThen.current = true;
            void promise.current.then(updateTicks);
        }
        throw promise.current;
    };
    return (props?: Props): LazyRouterVNode => {
        const isSSR = $env.isSSR(), // Server-side prerender?
            { state: { lazyCPs } } = $preact.useData(); // prettier-ignore

        let lazyCPi = 0; // Promise index.
        if (isSSR) {
            lazyCPi = ++lazyCPs.counter;
            lazyCPs.promises[lazyCPi] ??= {
                promise: { current: undefined },
                resolved: { current: undefined },
                resolvedVNode: { current: undefined },
            };
        }
        return (
            <ContextObject.Provider value={{ isSSR, lazyCPi, lazyCPs, props }}>
                <Router {...routerProps}>
                    <Route default component={Lazy} />
                </Router>
            </ContextObject.Provider>
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
export const lazyRoute = (loader: LazyRouteLoader): ((props: RoutedProps) => $preact.VNode<RoutedProps> | null) => {
    let promise: Promise<Awaited<ReturnType<LazyRouteLoader>>['default']> | undefined, //
        component: Awaited<typeof promise> | undefined;

    return (props: RoutedProps): $preact.VNode<RoutedProps> | null => {
        const [, updateTicks] = $preact.useReducer((c) => (c + 1 >= 10000 ? 1 : c + 1), 0),
            didPromiseThen = $preact.useRef(false);

        promise ??= loader().then((module) => (component = module.default));
        if (component) return $preact.create(component, props);

        if (!didPromiseThen.current) {
            didPromiseThen.current = true;
            void promise.then(updateTicks);
        }
        throw promise;
    };
};
