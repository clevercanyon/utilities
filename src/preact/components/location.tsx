/**
 * Preact ISO.
 */

import '#@initialize.ts';

import { $app, $dom, $env, $is, $preact, $url, type $type } from '#index.ts';
import { createContext } from 'preact';

/**
 * Defines types.
 */
export type ActualState = $preact.State<{
    // A few flags.
    isInitial: boolean;
    isInitialHydration: boolean;
    wasPushed: boolean;

    // Relative `./` to base.
    pathQuery: string;

    // Base URL.
    baseURL: $type.URL;
}>;
export type PartialActualState = Partial<ActualState>;
export type PartialActualStateUpdates = Pick<PartialActualState, 'pathQuery'>;

export type State = $preact.State<{
    // A few flags.
    isInitial: boolean;
    isInitialHydration: boolean;
    wasPushed: boolean;

    // Base URL & path.
    baseURL: $type.URL;
    basePath: string;

    // Current URL w/o hash.
    url: $type.URL;
    canonicalURL: $type.URL;

    // Relative `./` to base.
    path: string;
    pathQuery: string;

    // Query variables.
    query: string;
    queryVars: { [x: string]: string };

    fromBase(parseable: $type.URL | string): string;
    pathFromBase(parseable: $type.URL | string): string;
}>;
export type Props = $preact.BasicTreeProps<{
    isHydration?: boolean;
    url?: $type.URL | string;
    baseURL?: $type.URL | string;
    onChange?: (state: State) => void;
}>;
export type Context = $preact.Context<{
    state: State;
    push: $preact.StateDispatcher<PartialActualStateUpdates | string>;
    updateState: $preact.StateDispatcher<PartialActualStateUpdates | MouseEvent | PopStateEvent | string>;
}>;
export type LocationChangeEvent = CustomEvent<{ state: State }>;

/**
 * Defines context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ContextObject = createContext({} as Context);

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useLocation = (): Context => $preact.useContext(ContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Location(props: Props = {}): $preact.VNode<Props> {
    const [actualState, updateState] = $preact.useReducer(reduceState, 0, () => initialState(props));

    const state = $preact.useMemo((): State => {
        const url = $url.parse(actualState.pathQuery, actualState.baseURL);
        const canonicalURL = $url.parse($url.toCanonical(url));

        // Forces a canonical path for consistency.
        url.pathname = canonicalURL.pathname; // Consistency.

        return {
            ...actualState, // State.
            // `isInitial: boolean`.
            // `isInitialHydration: boolean`.
            // `wasPushed: boolean`.

            // Base URL & path.
            baseURL: actualState.baseURL, // URL instance.
            // ↓ Typically has a trailing slash.
            basePath: $url.toPath(actualState.baseURL),

            // Current URL w/o hash.
            url, // URL instance.
            canonicalURL, // URL instance.

            // These are `./` relative to base.
            path: $url.removeBasePath($url.toPath(url), actualState.baseURL),
            pathQuery: $url.removeBasePath($url.toPathQuery(url), actualState.baseURL),

            // Query variables.
            query: url.search, // Leading `?`.
            queryVars: $url.getQueryVars(url),

            // Utility methods.

            fromBase(parseable: $type.URL | string) {
                return $url.parse(parseable, actualState.baseURL).toString();
            },
            pathFromBase(parseable: $type.URL | string) {
                return $url.toPathQueryHash($url.parse(parseable, actualState.baseURL));
            },
        };
    }, [actualState]);

    if ($env.isWeb() && !$env.isMajorCrawler()) {
        // Crawlers can detect SPAs by inspecting history event listeners.
        // So let’s not attach when it’s a major crawler, because we ask they do full page changes.
        // For further details, please review other instances of `$env.isMajorCrawler()` in this file.

        $preact.useEffect((): (() => void) => {
            addEventListener('click', updateState);
            addEventListener('popstate', updateState);

            return (): void => {
                removeEventListener('click', updateState);
                removeEventListener('popstate', updateState);
            };
        }, []); // i.e., On mount/unmount only.

        $preact.useEffect((): void => {
            if (state.isInitial) return;
            if (props.onChange) props.onChange(state);
            $dom.trigger(document, 'x:location:change', { state } as LocationChangeEvent['detail']);
        }, [state]);
    }
    return <ContextObject.Provider value={{ state, push: updateState, updateState }}>{props.children}</ContextObject.Provider>;
}

// ---
// Misc exports.

/**
 * Defines named prop keys for easy reuse.
 *
 * @returns Array of named {@see Location} prop keys; i.e., excludes `children`.
 */
export const namedPropKeys = (): string[] => ['isHydration', 'url', 'baseURL', 'onChange'];

// ---
// Misc utilities.

/**
 * Initial component state.
 *
 * @param   props Component props.
 *
 * @returns       Initial component state.
 */
const initialState = (props: Props): ActualState => {
    const { isHydration = false } = props;
    let { url, baseURL } = props; // Initialize.

    if (baseURL && $is.url(baseURL)) {
        baseURL = $url.parse(baseURL);
    } else if (baseURL && $is.string(baseURL)) {
        baseURL = $url.parse(baseURL);
    } else {
        baseURL = $url.parse($app.baseURL());
    }
    // We intentionally do not trim a trailing slash from the base URL.
    // The trailing slash is important to `URL()` when forming paths from base.

    if (url && $is.url(url)) {
        url = $url.parse(url, baseURL);
    } else if (url && $is.string(url)) {
        url = $url.parse(url, baseURL);
    } else if ($env.isWeb()) {
        url = $url.parse($url.current(), baseURL);
    } else {
        throw Error('EQA6sQqq'); // Missing `url`.
    }
    // Forces a canonical path for consistency.
    url.pathname = $url.parse($url.toCanonical(url)).pathname;

    if (url.origin !== baseURL.origin) {
        throw Error('2AVgp85w'); // URL `origin` mismatch.
    }
    return {
        isInitial: true,
        isInitialHydration: isHydration,
        wasPushed: true, // Initial location is also a push.
        baseURL, // e.g., `https://x.tld/`, `https://x.tld/base/`.
        pathQuery: $url.removeBasePath($url.toPathQuery(url), baseURL),
    };
};

/**
 * Reduces state.
 *
 * @param   state Current state.
 * @param   x     Event or another type of update.
 *
 * @returns       New state; else original state if no changes.
 */
const reduceState = (state: ActualState, x: Parameters<Context['updateState']>[0]): ActualState => {
    // Initialize.
    let url, isPush, isClick;

    // For reuse below.
    const isWeb = $env.isWeb();
    const isObject = $is.object(x);
    const isString = !isObject && $is.string(x);

    // ---
    // Full pages changes for all major crawlers.
    // i.e., Do not change state, do not prevent default.

    if (isWeb && $env.isMajorCrawler()) return state;

    // ---
    // Case handlers for various types of state updates.

    if (isObject && 'click' === (x as MouseEvent).type) {
        if (!isWeb) return state; // Not possible.

        const event = x as MouseEvent;
        isClick = isPush = true; // Click = push.

        // This checks things like mouse button, modifier keys, etc.
        if (!$is.leftClickMouseEvent(event)) return state; // Not a left-click.

        // Our custom `<x-hash>` tags are intentionally not considered here.
        // i.e., We don’t care about simple hash changes. Only actual location changes.
        const a = (event.target as HTMLElement)?.closest('a') as HTMLAnchorElement | undefined;

        if (!a || !a.href /* `a.href` is a fully computed hyperlink reference. */) {
            return state; // Not applicable; no `href` value.
        }
        if (!/^(_?self)?$/iu.test(a.target || '') /* Ignores target !== `_self`. */) {
            return state; // Not applicable; i.e., targets a different tab/window.
        }
        url = $url.parse(a.href, state.baseURL);
        //
    } else if (isObject && 'popstate' === (x as PopStateEvent).type) {
        if (!isWeb) return state; // Not applicable.
        // Popstate event is a change, not a push.

        // const unusedꓺevent = x as PopStateEvent;
        url = $url.parse(location.href, state.baseURL);
        //
    } else if (isObject) {
        isPush = true; // Object = push.

        if (!x.pathQuery || 'string' !== typeof x.pathQuery) {
            return state; // Not applicable.
        }
        url = $url.parse(x.pathQuery, state.baseURL);
        //
    } else if (isString) {
        isPush = true; // String = push.

        const pathQuery = x; // As `pathQuery`.
        if (!pathQuery) return state; // Not applicable.

        url = $url.parse(pathQuery, state.baseURL);
    }
    // ---
    // Validates a potential state update.

    if (!url /* Ignores empty URLs and/or invalid updates. */) {
        return state; // Not applicable.
    }
    if (url.origin !== state.baseURL.origin /* Ignores external URLs. */) {
        return state; // Not applicable.
    }
    if (!['http:', 'https:'].includes(url.protocol) /* Ignores `mailto:`, `tel:`, etc. */) {
        return state; // Not applicable.
    }
    // ---
    // Prepares data for a potential state update.

    // Forces a canonical path for consistency.
    url.pathname = $url.parse($url.toCanonical(url)).pathname;

    // Prepares variables that will be added to the returned state.
    const wasPushed = isPush || false; // `pathQuery` is `./` relative to base.
    const pathQuery = $url.removeBasePath($url.toPathQuery(url), state.baseURL);

    // ---
    // Cancels state update when `pathQuery` is not changing.
    // e.g., Ignores on-page hash changes. We let browser handle.

    if (state.pathQuery === pathQuery) {
        if (isWeb && isClick && !url.hash) {
            (x as MouseEvent).preventDefault();

            scrollWheelHandler?.cancel(), // Don’t stack these up.
                scrollHandler?.cancel(); // Same for inner handler.

            scrollWheelHandler = $dom.onWheelEnd((): void => {
                scrollHandler = $dom.afterNextFrame((): void => {
                    scrollTo({ top: 0, left: 0, behavior: 'auto' });
                });
            });
        }
        return state; // No point; we’re already at this location.
    }

    // ---
    // Updates history state.

    if (isWeb /* Only possible in a browser. */) {
        if (isClick) (x as MouseEvent).preventDefault();

        if (true === isPush) {
            history.pushState(null, '', url);
        } else if (false === isPush) {
            history.replaceState(null, '', url);
        }
    }
    return { ...state, isInitial: false, isInitialHydration: false, wasPushed, pathQuery };
};

/**
 * Scroll handlers.
 */
let scrollWheelHandler: ReturnType<typeof $dom.onWheelEnd> | undefined;
let scrollHandler: ReturnType<typeof $dom.afterNextFrame> | undefined;
