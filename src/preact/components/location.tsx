/**
 * Preact ISO.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $env, $is, $preact, $str, $url, type $type } from '../../index.ts';

/**
 * Defines types.
 */
export type Props = Omit<
    $preact.Props<{
        url?: $type.URL | string;
        baseURL?: $type.URL | string;
    }>,
    $preact.ClassPropVariants
>;
export type ActualState = $preact.State<{
    wasPush: boolean; // URL push?
    baseURL: $type.URL; // Base URL.
    pathQuery: string; // Relative `./` to base.
}>;
export type PartialActualState = $preact.State<Partial<ActualState>>;
export type PartialActualStateUpdates = Omit<PartialActualState, 'wasPush' | 'baseURL'>;

export type State = $preact.State<{
    // URL push?
    wasPush: boolean;

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
export type PartialState = $preact.State<Partial<State>>;

export type ContextProps = $preact.Context<{
    state: State;
    updateState: $preact.Dispatch<PartialActualStateUpdates | MouseEvent | PopStateEvent | string>;
}>;

/**
 * Defines context.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const Context = createContext({} as ContextProps);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Location(props: Props = {}): $preact.VNode<Props> {
    const [actualState, updateState] = $preact.useReducer(reducer, undefined, () => initialState(props));
    const contextProps = /* Updates only when actual state changes. */ $preact.useMemo(() => {
        const url = $url.parse(actualState.pathQuery, actualState.baseURL);
        const canonicalURL = $url.parse($url.toCanonical(url));

        // Forces a canonical path for consistency.
        url.pathname = canonicalURL.pathname; // Consistency.

        return {
            state: {
                ...actualState, // State.
                // `wasPush: boolean`.

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
            },
            updateState, // i.e., Location reducer updates state.
        };
    }, [actualState.wasPush, actualState.pathQuery]) as ContextProps;

    $preact.useLayoutEffect(() => {
        addEventListener('click', updateState);
        addEventListener('popstate', updateState);

        return () => {
            removeEventListener('click', updateState);
            removeEventListener('popstate', updateState);
        };
    }, [actualState.wasPush, actualState.pathQuery]);

    return <Context.Provider value={contextProps}>{props.children}</Context.Provider>;
}

/**
 * Defines context hook.
 *
 * @returns Context props {@see ContextProps}.
 */
export const useLocation = (): ContextProps => $preact.useContext(Context);

/* ---
 * Misc utilities.
 */

/**
 * Initial component state.
 *
 * @param   props Component props.
 *
 * @returns       Initial component state.
 */
const initialState = (props: Props): ActualState => {
    let { url, baseURL } = props; // Initialize.

    if (baseURL && $is.url(baseURL)) {
        baseURL = $url.parse(baseURL);
    } else if (baseURL && $is.string(baseURL)) {
        baseURL = $url.parse(baseURL);
    } else if ($env.isWeb()) {
        baseURL = $url.parse($url.currentBase());
    } else {
        throw new Error('Missing `baseURL`.');
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
        throw new Error('Missing `url`.');
    }
    // Forces a canonical path for consistency.
    url.pathname = $url.parse($url.toCanonical(url)).pathname;

    if (url.origin !== baseURL.origin) {
        throw new Error('URL `origin` mismatch.');
    }
    return {
        wasPush: true,
        baseURL, // Does not change.
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
const reducer = (state: ActualState, x: Parameters<ContextProps['updateState']>[0]): ActualState => {
    let url, isPush, isClick; // Initialize.
    const xIsObject = $is.object(x);
    // ---
    // Case handlers for various types of state updates.

    if (xIsObject && 'click' === (x as MouseEvent).type) {
        const event = x as MouseEvent;
        isClick = isPush = true; // Click event is a push.

        if (!$env.isWeb()) {
            return state; // Not possible.
        }
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
    } else if (xIsObject && 'popstate' === (x as PopStateEvent).type) {
        const unusedꓺevent = x as PopStateEvent;
        // Popstate history event is a change, not a push.

        if (!$env.isWeb()) {
            return state; // Not applicable.
        }
        url = $url.parse(location.href, state.baseURL);
        //
    } else if (xIsObject) {
        isPush = true; // Object passed in is a push.

        if (!x.pathQuery || 'string' !== typeof x.pathQuery) {
            return state; // Not applicable.
        }
        url = $url.parse($str.lTrim(x.pathQuery, '/'), state.baseURL);
        //
    } else if (!xIsObject && $is.string(x)) {
        isPush = true; // String passed in is a push.

        const pathQuery = x; // As `pathQuery`.

        if (!pathQuery) {
            return state; // Not applicable.
        }
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
    const wasPush = isPush || false; // `pathQuery` is `./` relative to base.
    const pathQuery = $url.removeBasePath($url.toPathQuery(url), state.baseURL);

    // ---
    // Further validates a potential state update.

    if (state.pathQuery === pathQuery) {
        return state; // No point; we’re already at this location.
        // This also ignores on-page hash changes. We let browser handle.
        // If `pathQuery` *and* hash change, our router handles hash changes.
    }

    // ---
    // Updates history state.

    if ($env.isWeb() /* Only possible in a browser. */) {
        if (isClick) (x as MouseEvent).preventDefault();

        if (true === isPush) {
            history.pushState(null, '', url);
        } else if (false === isPush) {
            history.replaceState(null, '', url);
        }
    }
    return { ...state, wasPush, pathQuery };
};
