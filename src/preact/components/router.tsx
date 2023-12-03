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
export type ErrorBoundaryCoreProps = $preact.BasicTreeProps<{
    onLoadError?: (error: $type.Error) => void;
}>;
export type CoreProps = $preact.BasicTreeProps<{
    handleLoading?: boolean;
    handleScrolling?: boolean;
    onLoadStart?: (data: RouteLoadEventData) => void;
    onLoadEnd?: (data: RouteLoadEventData) => void;
    onLoaded?: (data: RouteLoadEventData) => void;
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
    const { onLoadError, children, ...restProps } = props;
    return (
        <ErrorBoundaryCore onLoadError={onLoadError}>
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
export const namedPropKeys = (): string[] => ['handleLoading', 'handleScrolling', 'onLoadError', 'onLoadStart', 'onLoadEnd', 'onLoaded'];

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
    // Attaches a possible error handler.
    this.componentDidCatch = props.onLoadError;

    return <>{props.children}</>;
}

/**
 * Renders router core.
 *
 * @param   props Router core component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__c` = `._childDidSuspend()`; {@see https://o5p.me/B8yq0g} in `mangle.json`.
 * @note This uses extensive caching and does not listen for any prop-change dynamics.
 *       Therefore, please set it up right, the first time!
 */
function RouterCore(this: $preact.Component<CoreProps>, props: CoreProps): $preact.VNode<CoreProps> {
    // Self-reference, as plain object value.
    const thisObj = this as unknown as $type.Object;

    // Gathers state.

    const { state: locationState } = $preact.useLocation();
    const parentContext = $preact.useRoute(); // i.e., Parent route.
    const [layoutTicks, updateLayoutTicks] = $preact.useReducer((c) => c + 1, 0);

    // Initializes route references.

    const routeCounter = $preact.useRef(0);
    const routerHasEverCommitted = $preact.useRef(false);

    // Initializes previous route reference.

    const previousRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;
    const previousRouteSnapshot = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;

    // Initializes current route references.

    const currentRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;
    const currentRouteContext = $preact.useRef() as $preact.Ref<RouteContext>;
    const currentRouteLoadEventData = $preact.useRef() as $preact.Ref<RouteLoadEventData>;
    const currentRoutePendingHydrationDOM = $preact.useRef() as $preact.Ref<HTMLElement>;

    // Initializes other current route references.

    const currentRouteDidSuspend = $preact.useRef(false);
    const currentRouteDidSuspendAndIsLoading = $preact.useRef(false);

    // Resets this flag on each and every attempt to re-render.
    // A thrown promise will change this back to `true`, when applicable.

    currentRouteDidSuspend.current = false;

    // Memoizes component for current route.
    // Note: This potentially alters `previousRoute`.
    // Note: This potentially alters `currentRouteContext`.

    currentRoute.current = $preact.useMemo(() => {
        // Initializes default and matching child vNodes.
        let defaultChildVNode: $preact.VNode<RouteProps> | undefined;
        let matchingChildVNode: $preact.VNode<RouteProps> | undefined;

        // Prevents diffing when we swap current to previous.
        if (thisObj.__v && (thisObj.__v as $type.Object | undefined)?.__k) {
            ((thisObj.__v as $type.Object).__k as unknown[]).reverse();
        }
        routeCounter.current++; // Increments monotonic route counter.
        // Current route is being defined, so 'current' is actually previous here.
        previousRoute.current = currentRoute.current; // Stores current as previous.

        // Configures current route context properties.
        // Current route context must reflect the `rest*` props.
        // i,e., In current context of potentially a parent route.
        currentRouteContext.current = {
            // These are `./` relative to base.
            // These are also relative `./` to parent route.
            path: parentContext.restPath || locationState.path,
            pathQuery: parentContext.restPathQuery || locationState.pathQuery,

            // These are `./` relative to base.
            // These are also relative `./` to parent route.
            restPath: '', // Potentially populated by `pathMatchesRoutePattern()`.
            restPathQuery: '', // Potentially populated by `pathMatchesRoutePattern()`.

            // Query variables.
            query: locationState.query, // Always the same query vars across all nested routes.
            queryVars: locationState.queryVars, // Always the same query vars across all nested routes.

            // Path parameter keys/values.
            params: {}, // Potentially populated by `pathMatchesRoutePattern()`.
        } as RouteContext;

        // Looks for a matching `<Route>` child component in the current router.
        ($preact.toChildArray(props.children) as $preact.VNode<RouteProps>[]).some((childVNode): boolean => {
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
    }, [locationState]);

    // Snapshots the previous route, and then resets it to `null`, for now.
    // Note: This uses `previousRoute`, which was potentially altered by the memo above.

    previousRouteSnapshot.current = previousRoute.current; // Snapshots previous route.
    previousRoute.current = null; // Resets previous route to `null`, for now.

    // Configures current load event data properties; {@see RouteLoadEventData}.
    // Note: This uses `currentRouteContext`, which was potentially altered by the memo above.

    currentRouteLoadEventData.current = $preact.useMemo(() => ({ locationState, routeContext: currentRouteContext.current as RouteContext }), [locationState]);

    // Configures the router’s `_childDidSuspend()` handler.
    // Minified `__c` = `_childDidSuspend()`. See: <https://o5p.me/3gXT4t>.

    thisObj.__c = $preact.useCallback(
        (thrownPromise: Promise<unknown>): void => {
            // Marks current render as having suspended.
            currentRouteDidSuspend.current = true;

            // Marks current render as having suspended and currently loading.
            currentRouteDidSuspendAndIsLoading.current = true;

            // Keeps previous route around while current route loads.
            previousRoute.current = previousRouteSnapshot.current;

            // Snapshots counter for comparison once promise resolves.
            const routeCounterSnapshot = routeCounter.current;

            // Handles effects of loading sequence starting.
            if ($env.isWeb() /* Only possible on the web. */) {
                // Appends `<x-preact-app-loading>` status indicator.
                if (false !== props.handleLoading && !locationState.isInitialHydration) {
                    loadingHandler?.cancel(); // Don’t stack these up.
                    loadingHandler = $dom.afterNextFrame((): void => {
                        $dom.body().appendChild(xPreactAppLoading());
                    });
                }
                // Fires an event indicating the current route is now loading.
                if (props.onLoadStart) props.onLoadStart(currentRouteLoadEventData.current as RouteLoadEventData);
                $dom.trigger(document, 'x:route:loadStart', currentRouteLoadEventData.current as RouteLoadEventData);
            }
            // Handles resolution of suspended state; i.e., once promise resolves.
            void thrownPromise.then(() => {
                // Ignores update if it isn't the most recently suspended update.
                if (routeCounterSnapshot !== routeCounter.current) return;

                // Successful route transition. Unsuspend after a tick and stop rendering the old route.
                (previousRoute.current = null), void resolvedPromise.then(updateLayoutTicks); // Triggers new effects.
            });
        },
        [locationState],
    );
    // Configures the router’s effects.
    // These are only applicable on the web.

    if ($env.isWeb()) {
        $preact.useLayoutEffect(() => {
            // Current route's hydration DOM cast as an `HTMLElement | null`.
            const currentRouteHydrationDOM = ((thisObj.__v as $type.Object | undefined)?.__e || null) as HTMLElement | null;

            // Ignores suspended renders.
            if (currentRouteDidSuspend.current) {
                if (!routerHasEverCommitted.current && !currentRoutePendingHydrationDOM.current) {
                    // If we've never committed, mark hydration DOM for removal.
                    currentRoutePendingHydrationDOM.current = currentRouteHydrationDOM;
                }
                return; // Stop while in a suspended state.
            }
            // Checks if hydration DOM needs to be removed now.
            if (!routerHasEverCommitted.current && currentRoutePendingHydrationDOM.current) {
                if (currentRoutePendingHydrationDOM.current !== currentRouteHydrationDOM) {
                    // Removes hydration DOM if first commit and we didn't use.
                    currentRoutePendingHydrationDOM.current.remove();
                }
                currentRoutePendingHydrationDOM.current = null; // Nullify now.
            }
            // Marks router as having committed now.
            routerHasEverCommitted.current = true;
        }, [locationState, layoutTicks]);

        $preact.useEffect((): void => {
            // Ignores suspended renders.
            if (currentRouteDidSuspend.current) {
                return; // Stop here.
            }
            // Loading sequence ended already?
            if (!currentRouteDidSuspendAndIsLoading.current) {
                return; // Stop here.
            }
            // Ends current route loading sequence.
            currentRouteDidSuspendAndIsLoading.current = false;

            // Handles removal of `<x-preact-app-loading>` status indicator.
            if (false !== props.handleLoading && !locationState.isInitialHydration) {
                loadingHandler?.cancel(); // Don’t stack these up.
                loadingHandler = $dom.afterNextFrame((): void => xPreactAppLoading().remove());
            }
            // Fires an event indicating the end of loading sequence.
            if (props.onLoadEnd) props.onLoadEnd(currentRouteLoadEventData.current as RouteLoadEventData);
            $dom.trigger(document, 'x:route:loadEnd', currentRouteLoadEventData.current as RouteLoadEventData);

            // Fires an event indicating the current route is loaded now.
            if (props.onLoaded) props.onLoaded(currentRouteLoadEventData.current as RouteLoadEventData);
            $dom.trigger(document, 'x:route:loaded', currentRouteLoadEventData.current as RouteLoadEventData);

            // Handles scroll position for current route location.
            if (false !== props.handleScrolling && locationState.wasPushed && !locationState.isInitialHydration) {
                scrollWheelHandler?.cancel(), // Don’t stack these up.
                    scrollHandler?.cancel(); // Same for inner handler.

                scrollWheelHandler = $dom.onWheelEnd((): void => {
                    scrollHandler = $dom.afterNextFrame((): void => {
                        (document.activeElement as HTMLElement | null)?.blur();

                        const currentHash = $url.currentHash(); // e.g., `id` without `#` prefix.
                        // We’re using an attribute selector because hash IDs that begin with a `~` are technically invalid in
                        // the eyes of `document.querySelector()`. We get around the nag by instead using an attribute selector.
                        const currentHashElement = currentHash ? $dom.query('[id="' + $str.escSelector(currentHash) + '"]') : null;

                        if (currentHashElement) {
                            currentHashElement.scrollIntoView({ behavior: 'auto' });
                        } else scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    });
                });
            }
        }, [locationState, layoutTicks]);
    }
    // Renders `currentRoute` and `previousRoute` components.
    // Note: `currentRoute` MUST render first to trigger a thrown promise.

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
let loadingHandler: ReturnType<typeof $dom.afterNextFrame> | undefined;
let scrollWheelHandler: ReturnType<typeof $dom.onWheelEnd> | undefined;
let scrollHandler: ReturnType<typeof $dom.afterNextFrame> | undefined;

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
    const tꓺsvg = 'svg',
        tꓺspan = 'span',
        tꓺrect = 'rect',
        tꓺclass = 'class',
        tꓺstyle = 'style',
        tꓺanimation = 'animation',
        tꓺanimationᱼdelay = tꓺanimation + '-delay',
        tꓺrectAtts = 'x="1" y="1" rx="1" width="10" height="10"';

    return $dom.create('x-preact-app-loading', {
        role: 'status',
        style: 'z-index: 2147483647', // Maximum allowed value on 32-bit systems.
        class: 'flex place-content-center fixed inset-0 w-screen h-screen bg-color-basic/50 pointer-events-none animate-fade-in',
        innerHTML: `<${tꓺspan} ${tꓺclass}="sr-only">Loading</${tꓺspan}><${tꓺsvg} aria-hidden="true" ${tꓺclass}="h-auto w-10 fill-color-tertiary" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/${tꓺsvg}"><${tꓺstyle}>.la4{${tꓺanimation}:_la1 2.4s -2.4s linear infinite}.la2{${tꓺanimationᱼdelay}:-1.6s}.la3{${tꓺanimationᱼdelay}:-.8s}@keyframes _la1{8.33%{x:13px;y:1px}25%{x:13px;y:1px}33.3%{x:13px;y:13px}50%{x:13px;y:13px}58.33%{x:1px;y:13px}75%{x:1px;y:13px}83.33%{x:1px;y:1px}}</${tꓺstyle}><${tꓺrect} ${tꓺclass}="la4" ${tꓺrectAtts}></${tꓺrect}><${tꓺrect} ${tꓺclass}="la4 la2" ${tꓺrectAtts}></${tꓺrect}><${tꓺrect} ${tꓺclass}="la4 la3" ${tꓺrectAtts}></${tꓺrect}></${tꓺsvg}>`,
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
