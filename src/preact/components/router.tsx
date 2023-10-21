/**
 * Preact ISO.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $dom, $env, $preact, $str, $url, type $type } from '../../index.ts';
import { LazyErrorBoundary, type LazyErrorBoundaryProps } from '../../resources/preact/apis/iso/lazy.tsx';

/**
 * Defines types.
 */
export type CoreProps = Omit<
    $preact.Props<{
        onLoadEnd?: () => void;
        onLoadStart?: () => void;
        onRouteChange?: () => void;
    }>,
    $preact.ClassPropVariants
>;
export type Props = Omit<$preact.Props<LazyErrorBoundaryProps & CoreProps>, $preact.ClassPropVariants>;

export type RouteProps = Omit<
    $preact.Props<{
        path?: string;
        default?: boolean;
        component: $preact.AnyComponent<RoutedProps>;
    }>,
    $preact.ClassPropVariants
>;
export type RouteContextProps = $preact.Context<{
    // These are relative `./` to base.
    // And, these are relative `./` to parent route.
    path: string;
    pathQuery: string;

    // These are relative `./` to base.
    // And, these are relative `./` to parent route.
    restPath: string;
    restPathQuery: string;

    // Query variables.
    query: string;
    queryVars: { [x: string]: string };

    // Path parameter keys/values.
    params: { [x: string]: string };
}>;
export type RoutedProps = RouteProps & Omit<$preact.Props<RouteContextProps>, $preact.ClassPropVariants>;

/**
 * Defines context.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const RouteContext = createContext({} as RouteContextProps);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Router(props: Props = {}): $preact.VNode<Props> {
    return (
        <LazyErrorBoundary onError={props.onError}>
            <RouterCore onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
                {props.children}
            </RouterCore>
        </LazyErrorBoundary>
    );
}

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note This is weird, but it’s right. Our core router rewrites the original `<Route>` props internally.
 *       i.e., `RouteProps` are read, this component is cloned, and props are modified prior to rendering.
 *       A route will never see `RouteProps` alone, it will only receive the expanded set of `RoutedProps`.
 */
export const Route = (props: RouteProps): $preact.VNode<RouteProps> => {
    const { component: Route } = props;
    return <Route {...(props as RoutedProps)} />;
};

/**
 * Defines context hook.
 *
 * @returns Context props {@see RouteContextProps}.
 */
export const useRoute = (): RouteContextProps => $preact.useContext(RouteContext);

/* ---
 * Misc utilities.
 */

/**
 * A resolved promise.
 */
const resolvedPromise = Promise.resolve();

/**
 * Renders a ref’s current route.
 *
 * @param   props Component props with `r` (i.e., the ref).
 *
 * @returns       VNode / JSX element tree.
 */
const RenderRefRoute = ({
    r,
}: Omit<
    $preact.Props<{
        r: $preact.Ref<$preact.VNode<RoutedProps>>;
    }>,
    $preact.ClassPropVariants
>): $preact.Ref<$preact.VNode<RoutedProps>>['current'] => r.current;

/**
 * Router component and child Route components.
 *
 * @param   props Router component props.
 *
 * @returns       Rendered refs (current and previous routes).
 */
function RouterCore(this: $preact.Component<CoreProps>, props: CoreProps): $preact.VNode<CoreProps> {
    const thisObj = this as unknown as $type.Object; // As plain object.

    const context = $preact.useRoute();
    const { state: locState } = $preact.useLocation();
    const [layoutTicks, updateLayoutTicks] = $preact.useReducer((c) => c + 1, 0);

    const routeCounter = $preact.useRef(0);
    const routerHasEverCommitted = $preact.useRef(false);

    const previousRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;
    const prevLocationisInitial = $preact.useRef(locState.isInitial);
    const prevLocationWasPushed = $preact.useRef(locState.wasPushed);
    const prevLocationPathQuery = $preact.useRef(locState.pathQuery);

    const currentRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;
    const currentRouteDidSuspend = $preact.useRef(false);
    const currentRouteIsLoading = $preact.useRef(false);
    const currentRoutePendingHydrationDOM = $preact.useRef() as $preact.Ref<HTMLElement>;

    currentRouteDidSuspend.current = false; // Reinitialize.

    // Memoizes current route.
    currentRoute.current = $preact.useMemo(() => {
        let defaultChildVNode: $preact.VNode<RouteProps> | undefined;
        let matchingChildVNode: $preact.VNode<RouteProps> | undefined;

        // Prevents diffing when we swap `cur` to `prev`.
        if (thisObj.__v && (thisObj.__v as $type.Object | undefined)?.__k) {
            ((thisObj.__v as $type.Object).__k as unknown[]).reverse();
        }
        routeCounter.current++; // Increments monotonic route counter.
        previousRoute.current = currentRoute.current; // Stores current as previous.
        // ↑ Current route is being defined, so 'current' is actually previous here.

        // Current route context props must reflect the 'rest*' props.
        // i,e., In current context of potentially nested routers.
        let routeContext = {
            // These are `./` relative to base.
            // And, these are relative `./` to parent route.
            path: context.restPath || locState.path,
            pathQuery: context.restPathQuery || locState.pathQuery,

            // These are `./` relative to base.
            // And, these are relative `./` to parent route.
            restPath: '', // Potentially populated by `pathMatchesRoutePattern()`.
            restPathQuery: '', // Potentially populated by `pathMatchesRoutePattern()`.

            // Query variables.
            query: locState.query, // Always the same query vars across all nested routes.
            queryVars: locState.queryVars, // Always the same query vars across all nested routes.

            // Path parameter keys/values.
            params: {}, // Potentially populated by `pathMatchesRoutePattern()`.
        } as RouteContextProps;

        ($preact.toChildArray(props.children) as $preact.VNode<RouteProps>[]).some((childVNode): boolean => {
            let matchingRouteContext: RouteContextProps | undefined;

            if ((matchingRouteContext = pathMatchesRoutePattern(routeContext.path, childVNode.props.path || '', routeContext))) {
                return Boolean((matchingChildVNode = $preact.cloneElement(childVNode, (routeContext = matchingRouteContext))));
            }
            if (!defaultChildVNode && childVNode.props.default) {
                defaultChildVNode = $preact.cloneElement(childVNode, routeContext);
            }
            return false;
        });
        return <RouteContext.Provider value={routeContext}>{matchingChildVNode || defaultChildVNode}</RouteContext.Provider>;
        //
    }, [locState.isInitial, locState.wasPushed, locState.pathQuery]);

    // If rendering succeeds synchronously, we shouldn't render previous children.
    const previousRouteSnapshot = previousRoute.current;
    previousRoute.current = null; // Reset previous children.

    // Minified `__c` = `_childDidSuspend()`. See: <https://o5p.me/3gXT4t>.
    thisObj.__c = (thrownPromise: Promise<unknown>) => {
        // Mark current render as having suspended.
        currentRouteDidSuspend.current = true;

        // The new route suspended, so keep the previous route around while it loads.
        previousRoute.current = previousRouteSnapshot;

        // Fire an event saying we're waiting for the route.
        if (props.onLoadStart) props.onLoadStart();

        // Flag as currently loading.
        currentRouteIsLoading.current = true;

        // Re-render on un-suspension.
        const routeCounterSnapshot = routeCounter.current; // Snapshot.

        void thrownPromise.then((/* When no longer in a suspended state. */) => {
            // Ignore this update if it isn't the most recently suspended update.
            if (routeCounterSnapshot !== routeCounter.current) return;

            // Successful route transition: un-suspend after a tick and stop rendering the old route.
            (previousRoute.current = null), void resolvedPromise.then(updateLayoutTicks); // Triggers a new layout effect below.
        });
    };
    $preact.useLayoutEffect(() => {
        // Current route's hydration DOM.
        const currentRouteHydrationDOM = ((thisObj.__v as $type.Object | undefined)?.__e || null) as HTMLElement | null;

        // Ignore suspended renders (failed commits).
        if (currentRouteDidSuspend.current) {
            // If we've never committed, mark any hydration DOM for removal on the next commit.
            if (!routerHasEverCommitted.current && !currentRoutePendingHydrationDOM.current) {
                currentRoutePendingHydrationDOM.current = currentRouteHydrationDOM;
            }
            return; // Stop here in this case.
        }
        // If this is the first ever successful commit and we didn't use the hydration DOM, remove it.
        if (!routerHasEverCommitted.current && currentRoutePendingHydrationDOM.current) {
            if (currentRoutePendingHydrationDOM.current !== currentRouteHydrationDOM) {
                currentRoutePendingHydrationDOM.current?.remove();
            }
            currentRoutePendingHydrationDOM.current = null; // Nullify after check complete.
        }
        // Mark router as having committed; i.e., as we are doing now.
        routerHasEverCommitted.current = true; // Obviously true at this point.

        // The new current route is loaded and rendered?
        if (
            prevLocationisInitial.current !== locState.isInitial ||
            prevLocationWasPushed.current !== locState.wasPushed ||
            prevLocationPathQuery.current !== locState.pathQuery //
        ) {
            if (locState.wasPushed && $env.isWeb() /* Handles scroll location. */) {
                const currentHash = $url.currentHash(); // e.g., `id` without `#` prefix.
                const currentHashElement = currentHash ? $dom.query('#' + currentHash) : undefined;

                if (currentHashElement) {
                    currentHashElement.scrollIntoView({ behavior: 'auto' });
                } else scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }
            if (props.onLoadEnd && currentRouteIsLoading.current) props.onLoadEnd();
            if (props.onRouteChange) props.onRouteChange();

            (prevLocationisInitial.current = locState.isInitial), //
                (prevLocationWasPushed.current = locState.wasPushed),
                (prevLocationPathQuery.current = locState.pathQuery);
            currentRouteIsLoading.current = false; // Loading complete.
        }
    }, [locState.isInitial, locState.wasPushed, locState.pathQuery, layoutTicks]);

    // Note: `currentRoute` MUST render first to trigger a thrown promise.
    return <>{[$preact.createElement(RenderRefRoute, { r: currentRoute }), $preact.createElement(RenderRefRoute, { r: previousRoute })]}</>;
}

/**
 * Checks if a path matches a route pattern.
 *
 * @param   path         Relative location path; e.g., `./path/foo/bar` | `/path/foo/bar` | `path/foo/bar`.
 * @param   routePattern Relative route pattern; e.g., `./path/foo/*` | `/path/foo/*` | `path/foo/*`.
 * @param   routeContext Route context; {@see RouteContextProps}.
 *
 * @returns              A New `routeContext` clone when path matches route. When path does not match route pattern,
 *   `undefined` is returned. It’s perfectly OK to use `!` when testing if the return value is falsy.
 */
const pathMatchesRoutePattern = (path: string, routePattern: string, routeContext: RouteContextProps): RouteContextProps | undefined => {
    if (!path || !routePattern || !routeContext) {
        return; // Not possible.
    }
    // These are `./` relative to base.
    const pathParts = $str.lTrim(path, './').split('/').filter(Boolean);
    const routePatternParts = $str.lTrim(routePattern, './').split('/').filter(Boolean);

    // Produces a deep clone that we may return.
    const newRouteContext = structuredClone(routeContext) as $type.Writable<RouteContextProps>;

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
            if (pathPart === routePatternPartValue) continue;

            if ('*' === routePatternPartFlag) {
                // These are `./` relative to base.
                // And, these are relative `./` to parent route.
                newRouteContext.restPath = './' + pathParts.slice(i).join('/');
                newRouteContext.restPathQuery = newRouteContext.restPath + newRouteContext.query;
                break; // We can stop here; i.e., the rest can be parsed by nested routes.
            }
            return; // Part is not an exact match, and not a wildcard `*` match either.
        }
    }
    return newRouteContext;
};
