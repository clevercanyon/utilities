/**
 * Preact ISO.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $dom, $env, $is, $preact, $str, $url, type $type } from '../../index.ts';

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
export type Props = $preact.BasicProps<{
    isHydration?: boolean;
    url?: $type.URL | string;
    baseURL?: $type.URL | string;
    onChange?: (state: State) => void;
}>;
export type Context = $preact.Context<{
    state: State;
    push: $preact.Dispatch<PartialActualStateUpdates | string>;
    updateState: $preact.Dispatch<PartialActualStateUpdates | MouseEvent | PopStateEvent | string>;
}>;

/**
 * Defines context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ContextObject = createContext({} as Context);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Location(props: Props = {}): $preact.VNode<Props> {
    const [actualState, updateState] = $preact.useReducer(reducer, undefined, () => initialState(props));

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

        $preact.useEffect(() => {
            addEventListener('click', updateState);
            addEventListener('popstate', updateState);

            return () => {
                removeEventListener('click', updateState);
                removeEventListener('popstate', updateState);
            };
        }, []); // i.e., On mount/unmount only.

        $preact.useEffect(() => {
            if (state.isInitial) return;
            if (props.onChange) props.onChange(state);
            $dom.trigger(document, 'x:location:change', { state });
        }, [state]);
    }
    return <ContextObject.Provider value={{ state, push: updateState, updateState }}>{props.children}</ContextObject.Provider>;
}

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useLocation = (): Context => $preact.useContext(ContextObject);

/* ---
 * Misc utilities.
 */

/**
 * Global scroll handler.
 */
let scrollHandler: ReturnType<typeof $dom.onNextFrame> | ReturnType<typeof $dom.afterNextFrame> | undefined;

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
        baseURL = $url.parse($url.appBase());
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
        throw new Error(); // Missing `url`.
    }
    // Forces a canonical path for consistency.
    url.pathname = $url.parse($url.toCanonical(url)).pathname;

    if (url.origin !== baseURL.origin) {
        throw new Error(); // URL `origin` mismatch.
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
const reducer = (state: ActualState, x: Parameters<Context['updateState']>[0]): ActualState => {
    // Initialize.
    let url, isPush, isClick;

    // For reuse below.
    const isWeb = $env.isWeb();
    const isObject = $is.object(x);

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

        if ($is.number(event.button) && 0 !== event.button) {
            // {@see https://o5p.me/OJrHBs} for details.
            return state; // Not a left-click; let browser handle.
        }
        if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
            // {@see https://o5p.me/sxlcYO} for details.
            return state; // Not a plain left-click; let browser handle.
        }
        const a = (event.target as HTMLElement)?.closest('a[href]') as HTMLAnchorElement | undefined;
        const aHref = a ? a.getAttribute('href') : null; // String or `null`.

        if (!a || !a.href || !aHref) {
            return state; // Not applicable; no href value.
        }
        if ('#' === aHref[0] /* Ignores hashes on current path. */) {
            return state; // Not applicable; i.e., simply an on-page hash change.
        }
        if (!/^(_?self)?$/iu.test(a.target || '') /* Ignores target !== `_self`. */) {
            return state; // Not applicable; i.e., targets a different tab/window.
        }
        url = $url.parse(a.href, state.baseURL);
        //
    } else if (isObject && 'popstate' === (x as PopStateEvent).type) {
        if (!isWeb) return state; // Not applicable.

        const unusedꓺevent = x as PopStateEvent;
        // Popstate history event is a change, not a push.

        url = $url.parse(location.href, state.baseURL);
        //
    } else if (isObject) {
        isPush = true; // Object passed in is a push.

        if (!x.pathQuery || 'string' !== typeof x.pathQuery) {
            return state; // Not applicable.
        }
        url = $url.parse($str.lTrim(x.pathQuery, '/'), state.baseURL);
        //
    } else if (!isObject && $is.string(x)) {
        isPush = true; // String passed in is a push.

        const pathQuery = x; // As `pathQuery`.
        if (!pathQuery) return state; // Not applicable.

        url = $url.parse($str.lTrim(pathQuery, '/'), state.baseURL);
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
    // Further validates a potential state update.

    if (state.pathQuery === pathQuery) {
        if (isWeb && isClick && !url.hash) {
            (x as MouseEvent).preventDefault();
            scrollHandler?.cancel(), // i.e., Don’t stack these up.
                (scrollHandler = $dom.afterNextFrame(() => scrollTo({ top: 0, left: 0, behavior: 'auto' })));
        }
        return state; // No point; we’re already at this location.
        // This also ignores on-page hash changes. We let browser handle.
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
