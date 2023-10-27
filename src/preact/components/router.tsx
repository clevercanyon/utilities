/**
 * Preact ISO.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $dom, $env, $preact, $str, $url, type $type } from '../../index.ts';
import { LazyErrorBoundary, type LazyErrorBoundaryProps } from '../../resources/preact/apis/iso/lazy.tsx';
import { type State as LocationState } from './location.tsx';

/**
 * Defines types.
 */
export type CoreProps = $preact.BasicProps<{
    onLoadStart?: (data: { locState: LocationState; routeContext: RouteContextProps }) => void;
    onLoadEnd?: (data: { locState: LocationState; routeContext: RouteContextProps }) => void;
}>;
export type Props = $preact.BasicProps<LazyErrorBoundaryProps & CoreProps>;

export type RouteProps = $preact.BasicProps<{
    path?: string;
    default?: boolean;
    component: $preact.AnyComponent<RoutedProps>;
}>;
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
export type RoutedProps = $preact.BasicProps<RouteProps & RouteContextProps>;

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
            <RouterCore onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd}>
                {props.children}
            </RouterCore>
        </LazyErrorBoundary>
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
 * Global scroll position event handler.
 */
let scrollPositionHandler: ReturnType<typeof $dom.afterNextFrame> | undefined;

/**
 * Renders a ref’s current route.
 *
 * @param   props Component props with `r` (i.e., the ref).
 *
 * @returns       VNode / JSX element tree.
 */
const RenderRefRoute = ({ r }: $preact.BasicProps<{
    r: $preact.Ref<$preact.VNode<RoutedProps>>;
}>): $preact.Ref<$preact.VNode<RoutedProps>>['current'] => r.current; // prettier-ignore

/**
 * Router component and child Route components.
 *
 * @param   props Router component props.
 *
 * @returns       Rendered refs (current and previous routes).
 */
function RouterCore(this: $preact.Component<CoreProps>, props: CoreProps): $preact.VNode<CoreProps> {
    // Self-reference, as plain object value.
    const thisObj = this as unknown as $type.Object;

    // Gathers state.
    const context = $preact.useRoute();
    const { state: locState } = $preact.useLocation();
    const [layoutTicks, updateLayoutTicks] = $preact.useReducer((c) => c + 1, 0);

    // Initializes route references.
    const routeCounter = $preact.useRef(0);
    const routerHasEverCommitted = $preact.useRef(false);

    // Initializes previous route reference.
    const previousRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;

    // Initializes current route references.
    const currentRoute = $preact.useRef() as $preact.Ref<$preact.VNode<RoutedProps>>;
    const currentRoutePendingHydrationDOM = $preact.useRef() as $preact.Ref<HTMLElement>;

    // Initializes other current route references.
    const currentRouteDidSuspend = $preact.useRef(false);
    const currentRouteDidSuspendAndIsLoading = $preact.useRef(false);

    // Resets this flag on each and every attempt to re-render.
    // A thrown promise will change this back to `true`, when applicable.
    currentRouteDidSuspend.current = false;

    // Memoizes component for current route.
    // Note: This potentially alters `previousRoute`.
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
        // Current route context props must reflect the 'rest*' props.
        // i,e., In the current context of potentially nested routers.
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

        // Looks for a matching `<Route>` child component in the current router.
        ($preact.toChildArray(props.children) as $preact.VNode<RouteProps>[]).some((childVNode): boolean => {
            let matchingRouteContext: RouteContextProps | undefined;

            if ((matchingRouteContext = pathMatchesRoutePattern(routeContext.path, childVNode.props.path || '', routeContext))) {
                return Boolean((matchingChildVNode = $preact.clone(childVNode, (routeContext = matchingRouteContext))));
            }
            if (!defaultChildVNode && childVNode.props.default) {
                defaultChildVNode = $preact.clone(childVNode, routeContext);
            }
            return false;
        });
        // It is possible for this to render with `matchingChildVNode` & `defaultChildVNode` empty.
        // In such a case, there are simply no children to render in the current route. Therefore, it becomes
        // important for a top-level pre-renderer to look for cases where no route matched, and treat it as a 404.
        return <RouteContext.Provider value={routeContext}>{matchingChildVNode || defaultChildVNode}</RouteContext.Provider>;
    }, [locState]);

    // Snapshots the previous route, and then resets it to `null`, for now.
    // i.e., If rendering succeeds synchronously, we shouldn't render previous children.
    const previousRouteSnapshot = previousRoute.current; // Snapshots previous route.
    previousRoute.current = null; // Resets previous route to `null`.

    // Configures the router’s `_childDidSuspend()` handler.
    // Minified `__c` = `_childDidSuspend()`. See: <https://o5p.me/3gXT4t>.
    thisObj.__c = (thrownPromise: Promise<unknown>) => {
        // Marks current render as having suspended.
        currentRouteDidSuspend.current = true;

        // Marks current render as having suspended and currently loading.
        currentRouteDidSuspendAndIsLoading.current = true;

        // Keeps previous route around while current route loads.
        previousRoute.current = previousRouteSnapshot;

        // Snapshots counter for comparison once promise resolves.
        const routeCounterSnapshot = routeCounter.current;

        // Fires an event indicating the current route is now loading.
        if ($env.isWeb() && props.onLoadStart) props.onLoadStart({ locState, routeContext: context });

        // Handles resolution of suspended state; i.e., once promise resolves.
        void thrownPromise.then(() => {
            // Ignores update if it isn't the most recently suspended update.
            if (routeCounterSnapshot !== routeCounter.current) return;

            // Successful route transition: un-suspend after a tick and stop rendering the old route.
            (previousRoute.current = null), void resolvedPromise.then(updateLayoutTicks); // Triggers a new layout effect below.
        });
    };
    // Configures the router’s effects.
    // These are only applicable on the web.
    if ($env.isWeb()) {
        $preact.useLayoutEffect(() => {
            // Current route's hydration DOM cast as an `HTMLElement | null`.
            const currentRouteHydrationDOM = ((thisObj.__v as $type.Object | undefined)?.__e || null) as HTMLElement | null;

            // Ignores suspended renders; i.e., failed commits.
            if (currentRouteDidSuspend.current) {
                // If we've never committed, mark hydration DOM for removal.
                if (!routerHasEverCommitted.current && !currentRoutePendingHydrationDOM.current) {
                    currentRoutePendingHydrationDOM.current = currentRouteHydrationDOM;
                }
                return; // Stop here while in a suspended state.
            }
            // Removes hydration DOM if this is the first ever commit and we didn't use.
            if (!routerHasEverCommitted.current && currentRoutePendingHydrationDOM.current) {
                if (currentRoutePendingHydrationDOM.current !== currentRouteHydrationDOM) {
                    currentRoutePendingHydrationDOM.current.remove();
                }
                currentRoutePendingHydrationDOM.current = null; // Nullify now.
            }
            // Marks router as having committed; i.e., we are committing now.
            routerHasEverCommitted.current = true;

            // Handles scroll position for current route location.
            if (locState.wasPushed /* Includes initial location. */) {
                if (scrollPositionHandler) scrollPositionHandler.cancel();
                scrollPositionHandler = $dom.afterNextFrame(() => {
                    const currentHash = $url.currentHash(); // e.g., `id` without `#` prefix.
                    const currentHashElement = currentHash ? $dom.query('#' + currentHash) : null;

                    if (currentHashElement) {
                        currentHashElement.scrollIntoView({ behavior: 'auto' });
                    } else scrollTo({ top: 0, left: 0, behavior: 'instant' });
                });
            }
            // Ends the loading sequence of the current route.
            // i.e., It was suspended at one point, and still loading?
            if (currentRouteDidSuspendAndIsLoading.current) {
                // Updates loading status; i.e., ends loading.
                currentRouteDidSuspendAndIsLoading.current = false;

                // Fires an event indicating the current route is loaded now.
                if (props.onLoadEnd) props.onLoadEnd({ locState, routeContext: context });
            }
        }, [locState, layoutTicks]);
    }
    // Renders `currentRoute` and `previousRoute` components.
    // Note: `currentRoute` MUST render first to trigger a thrown promise.
    return <>{[$preact.create(RenderRefRoute, { r: currentRoute }), $preact.create(RenderRefRoute, { r: previousRoute })]}</>;
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
    // And, these are relative `./` to parent route.
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
            if (!routePatternPartValue && '*' === routePatternPartFlag) {
                // These are `./` relative to base.
                // And, these are relative `./` to parent route.
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
