/**
 * Preact ISO.
 */

import '#@init.ts';

import { $fnꓺmemo } from '#@standalone/index.ts';
import { $dom, $env, $is, $obj, $preact, $str, $url, type $type } from '#index.ts';
import { type State as LocationState } from '#preact/components/location.tsx';
import { createContext, options as preactꓺoptions } from 'preact';

/**
 * Defines types.
 */
export type ErrorBoundaryCoreProps = $preact.BasicTreeProps<{}>;
export type CoreProps = $preact.BasicTreeProps<{
    handleLoading?: boolean;
    handleScrolling?: boolean;
}>;
export type Props = $preact.BasicTreeProps<ErrorBoundaryCoreProps & CoreProps>;

export type RouteProps = $preact.CleanProps<{
    path?: string;
    default?: boolean;
    component: $preact.AnyComponent<RoutedProps>;
}>;
export type RouteContext = $preact.Context<{
    // These are relative `./` to base.
    // These are also relative `./` to parent route.
    path: string;
    pathQuery: string;

    // These are relative `./` to base.
    // These are also relative `./` to parent route.
    restPath: string;
    restPathQuery: string;

    // Query variables.
    query: string;
    queryVars: { [x: string]: string };

    // Path parameter keys/values.
    params: { [x: string]: string };
}>;
export type RoutedProps = $preact.CleanProps<RouteProps & RouteContext>;
export type RouteLoadEventData = { locationState: LocationState; routeContext: RouteContext };

/**
 * Defines route context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const RouteContextObject = createContext({} as RouteContext);

/**
 * Defines route context hook.
 *
 * @returns Context {@see RouteContext}.
 */
export const useRoute = (): RouteContext => $preact.useContext(RouteContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Router(props: Props = {}): $preact.VNode<Props> {
    const { children, ...restProps } = props;
    return (
        <ErrorBoundaryCore>
            <RouterCore {...$obj.pick(restProps, namedPropKeys())}>{children}</RouterCore>
        </ErrorBoundaryCore>
    );
}

/**
 * Renders component.
 *
 * This requires an explanation. Our core router rewrites the original `<Route>` props. i.e., {@see RouteProps} are
 * initially read, then this component is cloned, and props are modified prior to rendering. Therefore, a route will
 * never see {@see RouteProps} alone, it will only receive the expanded set of {@see RoutedProps}.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export function Route(props: RouteProps): $preact.VNode<RouteProps> {
    const { component: Route } = props;
    return <Route {...(props as RoutedProps)} />;
}

// ---
// Misc exports.

/**
 * Defines named prop keys for easy reuse.
 *
 * @returns Array of named {@see Router} prop keys; i.e., excludes `children`.
 */
export const namedPropKeys = (): string[] => ['handleLoading', 'handleScrolling'];

// ---
// Misc utilities.

/**
 * Renders error boundary core.
 *
 * @param   props Error boundary core component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__c` = `._childDidSuspend()`; {@see https://o5p.me/B8yq0g} in `mangle.json`.
 */
function ErrorBoundaryCore(this: $preact.Component<ErrorBoundaryCoreProps>, props: ErrorBoundaryCoreProps): $preact.VNode<ErrorBoundaryCoreProps> {
    (this as unknown as $type.Object).__c = $preact.useCallback((thrownPromise: Promise<unknown>): void => {
        void thrownPromise.then(() => this.forceUpdate());
    }, []);
    return <>{props.children}</>;
}

/**
 * Renders router core.
 *
 * @param   _props Router core component props.
 *
 * @returns        VNode / JSX element tree.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__c` = `._childDidSuspend()`; {@see https://o5p.me/B8yq0g} in `mangle.json`.
 */
function RouterCore(this: $preact.Component<CoreProps>, _props: CoreProps): $preact.VNode<CoreProps> {
    // Self-reference, as plain object value.
    const thisObj = this as unknown as $type.Object;

    // Initializes parent context reference; i.e., for nested routers.

    const parentContext = $preact.useRef({} as RouteContext);
    parentContext.current = $preact.useRoute(); // Possibly empty.

    // Initializes current props reference.

    const props = $preact.useRef({} as CoreProps);
    props.current = _props; // Current router core props.

    // Initializes current child array reference.

    const childArray = $preact.useRef([] as $preact.VNode<RouteProps>[]);
    const { children: _children } = props.current; // Extracts children from props.
    childArray.current = $preact.useMemo(() => $preact.toChildArray(_children) as $preact.VNode<RouteProps>[], [_children]);

    // Gathers location state and current router tick state.

    const { state: _locationState } = $preact.useLocation(),
        [ticks, updateTicks] = $preact.useReducer((c) => (c + 1 >= 10000 ? 1 : c + 1), 0);

    // Initializes current location state reference.

    const locationState = $preact.useRef({} as LocationState);
    locationState.current = _locationState;

    // Initializes previous route reference.
    // Snapshots and resets to `null` on every attempt to re-render.
    // If rendering succeeds synchronously, we shouldn't render previous children.

    const previousRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>,
        previousRouteSnapshot = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;

    previousRouteSnapshot.current = previousRoute.current;
    previousRoute.current = null; // Resets on every attempt to re-render.

    // Initializes current route references.
    // Resets `currentRouteIsLoading` on every attempt to re-render.
    // If rendering succeeds synchronously, we will never enter a loading state.

    const currentRouteCounter = $preact.useRef(0),
        currentRouteIsLoading = $preact.useRef(false),
        currentRouteInLoadingSequence = $preact.useRef(false),
        currentRouteHasEverLoadedBefore = $preact.useRef(false),
        currentRouteContext = $preact.useRef() as $preact.Ref<RouteContext>,
        currentRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>,
        currentRoutePendingHydrationDOM = $preact.useRef() as $preact.Ref<HTMLElement>;

    currentRouteIsLoading.current = false; // Resets on every attempt to re-render.
    // `currentRouteInLoadingSequence` is reset to `false` only by effects.

    // Configures the router’s `_childDidSuspend()` handler.
    // Minified `__c` = `_childDidSuspend()`. See: <https://o5p.me/3gXT4t>.

    thisObj.__c = $preact.useCallback((thrownPromise: Promise<unknown>): void => {
        // Marks current render as having suspended and currently loading.
        currentRouteIsLoading.current = currentRouteInLoadingSequence.current = true;

        // Tracks, globally, number of routers that are currently loading.
        loadingStackSize++; // Increments global loading stack size.

        // Keeps previous route around while current route loads.
        previousRoute.current = previousRouteSnapshot.current;

        // Snapshots counter for comparison once promise resolves.
        const currentRouteCounterSnapshot = currentRouteCounter.current;

        // Handles effects of loading sequence starting.
        if ($env.isWeb() /* Only possible on the web. */) {
            // Extracts props & location state.
            const { handleScrolling, handleLoading } = props.current,
                { isInitialHydration } = locationState.current;

            // Cancels any relevant existing in-progress handlers.
            if (false !== handleLoading) loadEndHandler?.cancel(), loadTransHandler?.cancel(), clearTimeout(loadTransTimeout);
            if (false !== handleScrolling) scrollWheelHandler?.cancel(), scrollHandler?.cancel();

            // Sets transitioned state & appends `<x-preact-app-loading>`.
            if (false !== handleLoading && !isInitialHydration && 1 === loadingStackSize) {
                loadStartHandler?.cancel(); // Cancels any in-progress.
                loadStartHandler = $dom.afterNextFrame((): void => {
                    const xPreactApp = $dom.xPreactApp() as HTMLElement; // Cached by DOM utilities.
                    delete xPreactApp.dataset.transitioned, $dom.body().appendChild(xPreactAppLoading());
                });
            }
        }
        // Handles resolution of suspended state; i.e., once promise resolves.
        void thrownPromise.then((): void => {
            // Reduces global loading stack size by `1`.
            loadingStackSize = Math.max(0, loadingStackSize - 1);

            // If this is the most recently suspended route...
            if (currentRouteCounterSnapshot === currentRouteCounter.current) {
                // Successful route transition. Unsuspend after a tick and stop rendering previous route.
                (previousRoute.current = null), void resolvedPromise.then(updateTicks); // Triggers re-render.
            }
        });
    }, []);

    // Memoizes component for current route.

    currentRoute.current = $preact.useMemo(() => {
        // Initializes default and matching child vNodes.
        let defaultChildVNode: $preact.VNode<RouteProps> | undefined;
        let matchingChildVNode: $preact.VNode<RouteProps> | undefined;

        // Prevents diffing when we swap current to previous.
        if (thisObj.__v && (thisObj.__v as $type.Object | undefined)?.__k) {
            ((thisObj.__v as $type.Object).__k as unknown[]).reverse();
        }
        // Increments monotonic route counter.
        const c = currentRouteCounter.current; // Current counter.
        currentRouteCounter.current = c + 1 >= 10000 ? 1 : c + 1; // Max `10000`.

        // Current route is being defined, so 'current' is actually previous here.
        previousRouteSnapshot.current = currentRoute.current; // Snapshots current as previous.

        // Configures current route context properties.
        // Current route context must reflect the `rest*` props.
        // i,e., In current context of potentially a parent route.
        currentRouteContext.current = {
            // These are `./` relative to base.
            // These are also relative `./` to parent route.
            path: parentContext.current.restPath || locationState.current.path,
            pathQuery: parentContext.current.restPathQuery || locationState.current.pathQuery,

            // These are `./` relative to base.
            // These are also relative `./` to parent route.
            restPath: '', // Potentially populated by `pathMatchesRoutePattern()`.
            restPathQuery: '', // Potentially populated by `pathMatchesRoutePattern()`.

            // Query variables.
            query: locationState.current.query, // Always the same query vars across all nested routes.
            queryVars: locationState.current.queryVars, // Always the same query vars across all nested routes.

            // Path parameter keys/values.
            params: {}, // Potentially populated by `pathMatchesRoutePattern()`.
        } as RouteContext;

        // Looks for a matching `<Route>` child component in the current router.
        childArray.current.some((childVNode): boolean => {
            let routeContext = currentRouteContext.current as RouteContext;
            let matchingRouteContext: RouteContext | undefined;

            if ((matchingRouteContext = pathMatchesRoutePattern(routeContext.path, childVNode.props.path || '', routeContext))) {
                return Boolean((matchingChildVNode = $preact.clone(childVNode, (currentRouteContext.current = matchingRouteContext))));
            }
            if (!defaultChildVNode && childVNode.props.default) {
                defaultChildVNode = $preact.clone(childVNode, currentRouteContext.current);
            }
            return false;
        });
        // It is possible for this to render with `matchingChildVNode` & `defaultChildVNode` both empty.
        // In such a case, there are simply no children to render in the current route. Therefore, it becomes
        // important for a top-level prerenderer to look for routes that are entirely empty; treating as a 404 error.
        return <RouteContextObject.Provider value={currentRouteContext.current}>{matchingChildVNode || defaultChildVNode}</RouteContextObject.Provider>;
        //
    }, [parentContext.current, childArray.current.length, locationState.current]);

    // Configures the router’s effects.
    // These are only applicable on the web.

    if ($env.isWeb()) {
        // Runs layout effects.
        $preact.useLayoutEffect(() => {
            // Current route's DOM cast as an `HTMLElement | null`.
            const currentDOM = ((thisObj.__v as $type.Object | undefined)?.__e || null) as HTMLElement | null;

            // Current route is loading?
            if (currentRouteIsLoading.current) {
                if (!currentRouteHasEverLoadedBefore.current && !currentRoutePendingHydrationDOM.current)
                    // If we've never loaded before, mark current DOM as hydration DOM.
                    currentRoutePendingHydrationDOM.current = currentDOM;
                return; // Stop while in a loading state.
            }
            // Checks if hydration DOM needs to be removed now.
            if (!currentRouteHasEverLoadedBefore.current && currentRoutePendingHydrationDOM.current) {
                if (currentRoutePendingHydrationDOM.current !== currentDOM)
                    // Removes hydration DOM if we didn't use.
                    currentRoutePendingHydrationDOM.current.remove();
                currentRoutePendingHydrationDOM.current = null; // Nullify.
            }
            // Yes, we have loaded a route now.
            currentRouteHasEverLoadedBefore.current = true;
            //
        }, [locationState.current, ticks]);

        // Runs all other effects.
        $preact.useEffect((): void => {
            // Ignores renders still in-progress.
            if (currentRouteIsLoading.current) return;

            // Extracts from props & location state.
            const { handleLoading, handleScrolling } = props.current;
            const { isInitialHydration, wasPushed } = locationState.current;

            // Ends current route loading sequence.
            if (currentRouteInLoadingSequence.current) {
                // Ends current route loading sequence.
                currentRouteInLoadingSequence.current = false;

                // Cancels any relevant existing in-progress handlers.
                if (false !== handleLoading) loadEndHandler?.cancel(), loadTransHandler?.cancel(), clearTimeout(loadTransTimeout);
                if (false !== handleScrolling) scrollWheelHandler?.cancel(), scrollHandler?.cancel();

                // Handles removal of `<x-preact-app-loading>`.
                if (false !== handleLoading && !isInitialHydration && 0 === loadingStackSize) {
                    loadStartHandler?.cancel(); // Cancels any in-progress appends.
                    loadEndHandler = $dom.afterNextFrame((): void => xPreactAppLoading().remove());
                }
            }
            // Scroll handling occurs even for routes that never entered a loading state.
            // However, this does observe the loading stack and only fires at end of the stack.
            if (false !== handleScrolling && !isInitialHydration && wasPushed && 0 === loadingStackSize) {
                scrollWheelHandler?.cancel(), scrollHandler?.cancel(); // Cancels any in-progress.
                scrollWheelHandler = $dom.onWheelEnd((): void => {
                    scrollHandler = $dom.afterNextFrame((): void => {
                        // De-focus active element to avoid browser shifting scroll position while restoring focus.
                        // e.g., In the case of a form element being in focus whenever a location change occurs.
                        (document.activeElement as HTMLElement | null)?.blur();

                        const currentHash = $url.currentHash(); // e.g., `id` without `#` prefix.
                        // We’re using an attribute selector because hash IDs that begin with a `~` are technically invalid in
                        // the eyes of `document.querySelector()`. We get around it by instead using an attribute selector.
                        const currentHashElement = currentHash ? $dom.query('[id="' + $str.escSelector(currentHash) + '"]') : null;

                        if (currentHashElement) {
                            currentHashElement.scrollIntoView({ behavior: 'auto' });
                        } else scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    });
                });
            }
            // Transition handling occurs even for routes that never entered a loading state.
            // However, this does observe the loading stack and only fires at end of the stack.
            if (false !== handleLoading && !isInitialHydration && wasPushed && 0 === loadingStackSize) {
                loadTransHandler?.cancel(), clearTimeout(loadTransTimeout);
                loadTransHandler = $dom.afterNextFrame(() => {
                    const xPreactApp = $dom.xPreactApp() as HTMLElement; // Cached by DOM utilities.
                    xPreactApp.dataset.transitioned = 'true'; // Fires transition animation; see `<Body>`.

                    clearTimeout(loadTransTimeout),
                        (loadTransTimeout = setTimeout(() => {
                            loadTransHandler?.cancel(); // Cancels any in-progress.
                            loadTransHandler = $dom.afterNextFrame((): void => void delete xPreactApp.dataset.transitioned);
                        }, 150));
                });
            }
        }, [locationState.current, ticks]);
    }
    // Renders `currentRoute` and `previousRoute` components.
    // Note: `currentRoute` must render first to trigger a thrown promise.

    return <>{[$preact.create(RenderRefRoute, { r: currentRoute }), $preact.create(RenderRefRoute, { r: previousRoute })]}</>;
}

/**
 * Renders a ref’s current route.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
function RenderRefRoute({
    r, // Route reference.
}: $preact.CleanProps<{
    r: $preact.Ref<$preact.VNode<RoutedProps>>;
}>): $preact.Ref<$preact.VNode<RoutedProps>>['current'] {
    return r.current;
}

/**
 * Checks if a path matches a route pattern.
 *
 * @param   path         Relative location path; e.g., `./path/foo/bar` | `/path/foo/bar` | `path/foo/bar`.
 * @param   routePattern Relative route pattern; e.g., `./path/foo/*` | `/path/foo/*` | `path/foo/*`.
 * @param   routeContext Route context; {@see RouteContext}.
 *
 * @returns              A New `routeContext` clone when path matches route. When path does not match route pattern,
 *   `undefined` is returned. It’s perfectly OK to use `!` when testing if the return value is falsy.
 *
 * @note `path`, `routePattern` should be relative to the base URL, and also relative to any parent route.
 */
const pathMatchesRoutePattern = (path: string, routePattern: string, routeContext: RouteContext): RouteContext | undefined => {
    if (!path || !routePattern || !routeContext) {
        return; // Not possible.
    }
    // These are `./` relative to base.
    // These are also relative `./` to parent route.
    const pathParts = $str.lTrim(path, './').split('/').filter(Boolean);
    const routePatternParts = $str.lTrim(routePattern, './').split('/').filter(Boolean);

    // Produces a deep clone that we may return.
    const newRouteContext = $obj.cloneDeep(routeContext) as $type.Writable<RouteContext>;

    // Iterates all parts of the longest between path and route pattern.
    // In the case of no parts whatsoever, across both of them, that’s also a match.
    // e.g., If the current path is `./` matched by a pattern of `./`, both are empty.

    for (let i = 0; i < Math.max(pathParts.length, routePatternParts.length); i++) {
        const pathPart = pathParts[i] || ''; // Default is empty string.
        const routePatternPart = routePatternParts[i] || ''; // Default is empty string.

        const [
            unusedꓺ$0, // Using `$1...$3` only.
            routePatternPartValueIsParam, // `$1`.
            routePatternPartValue, // `$2`.
            routePatternPartFlag, // `$3`.
        ] = routePatternPart.match(/^(:?)(.*?)([+*?]?)$/u) || [];

        if (routePatternPartValueIsParam) {
            if (!routePatternPartValue) {
                return; // Pattern is missing param name.
            }
            if (!pathPart && !['?', '*'].includes(routePatternPartFlag)) {
                return; // Missing a required path part parameter.
            }
            if (['+', '*'].includes(routePatternPartFlag) /* Greedy. */) {
                // Path parameter keys/values. Greedy, in this particular case.
                newRouteContext.params[routePatternPartValue] = pathParts.slice(i).map(decodeURIComponent).join('/');
                break; // We can stop here on greedy params; i.e., we’ve got everything in this param.
            } else if (pathPart) {
                // Path parameter keys/values. A single part in this case.
                newRouteContext.params[routePatternPartValue] = decodeURIComponent(pathPart);
            }
        } else {
            if (!routePatternPartValue && '*' === routePatternPartFlag) {
                // These are `./` relative to base.
                // These are also relative `./` to parent route.
                newRouteContext.restPath = './' + pathParts.slice(i).join('/');
                newRouteContext.restPathQuery = newRouteContext.restPath + newRouteContext.query;
                break; // We can stop here; i.e., the rest can be parsed by nested routes.
            }
            if (pathPart === routePatternPartValue) continue;

            return; // Part is not an exact match, and not a wildcard `*` match either.
        }
    }
    return newRouteContext;
};

/**
 * A resolved promise.
 */
const resolvedPromise = Promise.resolve();

/**
 * Loading and scroll handlers.
 */
let loadingStackSize = 0, // Number of routers currenty loading.
    loadStartHandler: ReturnType<typeof $dom.afterNextFrame> | undefined,
    loadEndHandler: ReturnType<typeof $dom.afterNextFrame> | undefined,
    scrollWheelHandler: ReturnType<typeof $dom.onWheelEnd> | undefined,
    scrollHandler: ReturnType<typeof $dom.afterNextFrame> | undefined,
    loadTransHandler: ReturnType<typeof $dom.afterNextFrame> | undefined,
    loadTransTimeout: $type.Timeout | undefined;

/**
 * Generates `<x-preact-app-loading>` element.
 *
 * @returns `<x-preact-app-loading>` element; {@see Element}.
 *
 * @requiredEnv web
 *
 * Why are there so many crazy variables used here? The intention is to optimize for minification. i.e., By using as
 * many variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome.
 * Remember, variable names can be minified, so the length of variable names is not an issue.
 */
const xPreactAppLoading = $fnꓺmemo((): Element => {
    const tꓺla = 'la',
        tꓺsvg = 'svg',
        tꓺspan = 'span',
        tꓺrect = 'rect',
        tꓺrole = 'role',
        tꓺclass = 'class',
        tꓺstyle = 'style',
        tꓺla1 = tꓺla + '1',
        tꓺla2 = tꓺla + '2',
        tꓺla3 = tꓺla + '3',
        tꓺla4 = tꓺla + '4',
        tꓺx1px = 'x:1px;',
        tꓺy1px = 'y:1px',
        tꓺx13px = 'x:13px;',
        tꓺy13px = 'y:13px',
        tꓺinnerHTML = 'innerHTML',
        tꓺanimation = 'animation',
        tꓺx13pxy1px = tꓺx13px + tꓺy1px,
        tꓺx13pxy13px = tꓺx13px + tꓺy13px,
        tꓺx1pxy13px = tꓺx1px + tꓺy13px,
        tꓺx1pxy1px = tꓺx1px + tꓺy1px,
        tꓺanimationᱼdelay = tꓺanimation + '-delay',
        tꓺrectAtts = 'x="1" y="1" rx="1" width="10" height="10"';

    return $dom.create('x-preact-app-loading', {
        [tꓺrole]: 'status',
        [tꓺstyle]: 'z-index: 2147483647', // Maximum allowed value on 32-bit systems.
        [tꓺclass]: 'flex place-content-center fixed inset-0 w-screen h-screen bg-color-basic/75 pointer-events-none animate-fade-in',
        [tꓺinnerHTML]: `<${tꓺspan} ${tꓺclass}="sr-only">Loading</${tꓺspan}><${tꓺsvg} aria-hidden="true" ${tꓺclass}="h-auto w-10 stroke-color-primary-fg fill-color-primary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/${tꓺsvg}"><${tꓺstyle}>.${tꓺla4}{${tꓺanimation}:${tꓺla1} 2.4s -2.4s linear infinite}.${tꓺla2}{${tꓺanimationᱼdelay}:-1.6s}.${tꓺla3}{${tꓺanimationᱼdelay}:-.8s}@keyframes ${tꓺla1}{8.33%{${tꓺx13pxy1px}}25%{${tꓺx13pxy1px}}33.3%{${tꓺx13pxy13px}}50%{${tꓺx13pxy13px}}58.33%{${tꓺx1pxy13px}}75%{${tꓺx1pxy13px}}83.33%{${tꓺx1pxy1px}}}</${tꓺstyle}><${tꓺrect} ${tꓺclass}="${tꓺla4}" ${tꓺrectAtts}></${tꓺrect}><${tꓺrect} ${tꓺclass}="${tꓺla4} ${tꓺla2}" ${tꓺrectAtts}></${tꓺrect}><${tꓺrect} ${tꓺclass}="${tꓺla4} ${tꓺla3}" ${tꓺrectAtts}></${tꓺrect}></${tꓺsvg}>`,
    });
});

// ---
// Error handling.
// i.e., side effects.

/**
 * Previous error handler.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__e` = `._catchError`; {@see https://o5p.me/DxqGM3} in `mangle.json`.
 */
const prevErrorHandler = (preactꓺoptions as unknown as $type.Object).__e;

/**
 * Configures error handler in support of lazy loads.
 *
 * @param args Variadic args passed in by error hook in preact core.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__e` = `._catchError`; {@see https://o5p.me/DxqGM3} in `mangle.json`.
 */
(preactꓺoptions as unknown as $type.Object).__e = (...args: unknown[]): void => {
    let error = args[0] as $type.Object;
    let newVNode = args[1] as $type.Object;
    let oldVNode = args[2] as $type.Object | undefined;

    if ($is.promise(error) && $is.object(newVNode)) {
        let v = newVNode; // New vnode.

        while ((v = v.__ as $type.Object) /* While `._parent()` exists, recursively. */) {
            //
            if (v.__c && (v.__c as $type.Object).__c /* If `._component`.`_childDidSuspend()` exists. */) {
                if (null == newVNode.__e /* If `._dom()` is missing. */) {
                    newVNode.__e = oldVNode?.__e; // `._dom`.
                    newVNode.__k = oldVNode?.__k; // `._children`.
                }
                if (!newVNode.__k) newVNode.__k = []; // `._children`.

                // Calls `._component`.`_childDidSuspend()`.
                ((v.__c as $type.Object).__c as $type.Function)(error, newVNode);
                return; // Effectively skips `prevErrorHandler` in such a case.
            }
        }
    }
    if ($is.function(prevErrorHandler)) {
        prevErrorHandler(...args);
    }
};
