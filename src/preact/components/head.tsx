/**
 * Preact component.
 */

import '../../resources/init.ts';

import { Component } from 'preact';
import { $dom, $env, $is, $json, $obj, $preact, type $type } from '../../index.ts';
import { globalToScriptCode as dataGlobalToScriptCode, type Context as DataContext } from './data.tsx';
import { type State as HTMLState } from './html.tsx';

/**
 * Defines types.
 */
export type ActualState = $preact.State<{
    charset?: string;
    viewport?: string;

    robots?: string;
    publishTime?: $type.Time | string;
    lastModifiedTime?: $type.Time | string;
    canonical?: $type.URL | string;
    structuredData?: object;

    siteName?: string;
    title?: string;
    titleSuffix?: string | boolean;
    description?: string;
    author?: string;

    pngIcon?: $type.URL | string;
    svgIcon?: $type.URL | string;

    ogSiteName?: string;
    ogType?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogURL?: $type.URL | string;
    ogImage?: $type.URL | string;

    styleBundle?: $type.URL | string;
    scriptBundle?: $type.URL | string;

    append?: $preact.VNode[];
}>;
export type PartialActualState = Partial<ActualState>;
export type PartialActualStateUpdates = Omit<PartialActualState, ImmutableStateKeys>;

export type State = ActualState &
    Required<
        Pick<
            ActualState,
            | 'charset'
            | 'viewport'
            //
            | 'canonical'
            //
            | 'title'
            | 'description'
            //
            | 'pngIcon'
            | 'svgIcon'
            //
            | 'ogSiteName'
            | 'ogType'
            | 'ogTitle'
            | 'ogDescription'
            | 'ogURL'
            | 'ogImage'
            //
            | 'styleBundle'
            | 'scriptBundle'
            //
            | 'append'
        >
    >;
export type Props = $preact.BasicPropsNoKeyRefChildren<PartialActualState> & {
    // There’s really not a great way to enforce the child vNode type.
    // Internal JSX types use things that are too generic for that to work.
    // For now, we go ahead and add them here, but we also allow for any `$preact.Children`.
    // Not to worry, as there are conditionals in code that will throw if invalid children are given.
    children?: ChildVNode | ChildVNode[] | $preact.Children;
};
export type ChildVNode = Omit<$preact.VNode, 'type' | 'props'> & {
    type: string; // i.e., Intrinsic HTML tags only.
    props: Partial<$preact.BasicPropsNoKeyRefChildren> & {
        [x: string]: unknown;
        'data-key': string;
        children?: $type.Primitive;
    };
};
export type ChildVNodes = { [x: string]: ChildVNode };

export type Context = $preact.Context<{
    state: State;
    append: Head['append'];
    updateState: Head['updateState'];
    forceFullUpdate: Head['forceFullUpdate'];
}>;

/**
 * Defines a list of immutable state keys.
 *
 * Some state keys are immutable. For example, we don’t want `scriptBundle` to change, because that leads to it being
 * removed, then added back in again, based on state. When added back in, the script re-initialzes, which is bad; e.g.,
 * attemting to rehydrate, etc. Note: This variable must remain a `const`, as it keeps types DRY.
 *
 * - `charset`: There is simply no valid reason for this to ever change within a document.
 * - `viewport`: No valid reason to change, as it may disrupt a user who has zoomed in/out already.
 * - `baseURL`: Cannot change whatsoever. Safari and Firefox only parse this once on first load.
 * - `scriptBundle`: Cannot load/unload, then load again. That leads to a variety of problems.
 */
const immutableStateKeys = ['charset', 'viewport', 'baseURL', 'scriptBundle'] as const;
type ImmutableStateKeys = $type.Writable<typeof immutableStateKeys>[number];

/**
 * Defines pseudo context hook.
 *
 * `<Data>` state contains a high-level reference to the current `<Head>` instance, such that it becomes available
 * across all contexts vs. standalone, as `<Head>` actually is. We update the `<Head>` reference on render, so this
 * works anytime after `<Head>` has rendered for the first time; i.e., pretty much anywhere within an app.
 *
 * If you simply need to append something to `<Head>`, this hook provides an `append()` utility. Otherwise, use the
 * `updateState()` utility. Please remember that some `<Head>` state keys are immutable; {@see ImmutableStateKeys}.
 *
 * In reality, `<Head>` stands alone. Updating its state will not re-render anything except `<Head>` itself. This is
 * intentionally the case, as it allows for things to get dropped into the `<Head>`, like styles/scripts, without it
 * causing a full re-render. However, there are a few things that do cause `<Head>` to re-render.
 *
 * - If `<Location>` changes state, everything re-renders, including `<Head>`, which is the most common scenario. When you
 *   want `<Head>` to change, alter `<Location>` state. This is fundamentally how `<Head>` is intended to work.
 * - If anything else above `<Head>` re-renders; e.g., `<Data>` or `<HTML>`, then most everything re-renders.
 *
 * Otherwise, if you update `<Head>` state in a way that should result in a full re-rendering of everything from
 * `<Data>` on down, you can use the `forceFullUpdate()` utility provided by this hook. The `forceFullUpdate()` utility
 * indirectly fires `forceUpdate()` on the `<Data>` component instance.
 *
 * @returns Pseudo context {@see Context}.
 */
export const useHead = (): Context => {
    const { state: dataState } = $preact.useData();
    const instance = dataState.head.instance;

    if (!instance?.computedState) {
        throw new Error(); // Missing `computedState`.
    }
    return {
        state: instance.computedState,
        append: (...args) => instance.append(...args),
        updateState: (...args) => instance.updateState(...args),
        forceFullUpdate: (...args) => instance.forceFullUpdate(...args),
    };
};

/**
 * Defines component.
 *
 * Any children of the `<Head>` component must each have a unique `data-key` prop that identifies their intended
 * purpose; e.g., `xyzScript`, `xyzStyle`, `xyzMeta`. You may only include children with intrinsic HTML tag names, so no
 * components are allowed as children of `<Head>`. Additionally, children of `<Head>` are only allowed to contain
 * primitive children of their own; i.e., text nodes. No further nesting is allowed in `<Head>`.
 *
 * `<Head>` is a class component so there can be external references to the current `<Head>` component instance. We’re
 * using `Component`, not `$preact.Component`, because this occurs inline. We can’t use our own cyclic utilities inline,
 * only inside functions. So we use `Component` directly from `preact` in this case.
 *
 * `<Data>` state contains some initial, passable `<Head>` state keys. These serve as default props for `<Head>` when
 * they are not defined elsewhere. e.g., `styleBundle`, `scriptBundle`. `<Data>` state also contains a high-level
 * reference to the current `<Head>` `instance`, such that it becomes available across all contexts.
 */
export default class Head extends Component<Props, ActualState> {
    /**
     * Constructor.
     *
     * @param props Props.
     */
    public constructor(props: Props = {}) {
        super(props); // Parent constructor.
        this.state = $preact.omitProps(props, ['children']);
    }

    /**
     * Computed state. Defined at first render time.
     */
    public computedState: State | undefined;

    /**
     * Forces a `<Data>` update. Defined at first render time.
     */
    protected forceDataUpdate: DataContext['forceUpdate'] | undefined;

    /**
     * Forces a full update.
     *
     * @param callback Optional callback.
     */
    public forceFullUpdate(callback?: () => void): void {
        if (!this.forceDataUpdate) throw new Error();
        this.forceDataUpdate(callback);
    }

    /**
     * Appends child vNode(s) to `<Head>`.
     *
     * @param childVNodes One or more child vNodes.
     */
    public append(childVNodes: ChildVNode | ChildVNode[]): void {
        // Note: We have to achieve this without the use of declarative ops.
        this.updateState({ append: $preact.toChildArray([this.state.append || [], childVNodes]) } as PartialActualStateUpdates);
    }

    /**
     * Updates component state.
     *
     * This does not allow the use of declarative ops.
     *
     * @param updates Partial state updates; {@see ImmutableStateKeys}.
     */
    public updateState<Updates extends PartialActualStateUpdates>(updates: Updates): void {
        this.setState((currentState: ActualState): Updates | null => {
            // Some `<Head>` state keys are immutable.
            updates = $obj.omit(updates, immutableStateKeys as unknown as string[]) as Updates;

            const newState = $obj.updateDeepNoOps(currentState, updates);
            // Returning `null` tells Preact no; {@see https://o5p.me/9BaxT3}.
            return newState !== currentState ? (newState as Updates) : null;
        });
    }

    /**
     * Renders component.
     *
     * @returns VNode / JSX element tree, or `undefined`.
     *
     *   - On the web this returns `undefined`; i.e., effects only.
     */
    public render(): $preact.VNode<Props> | undefined {
        // Checks environment.

        const isSSR = $env.isSSR();
        const isC10n = $env.isC10n();
        const isLocalWebVite = $env.isLocalWebVite();

        // Acquires app’s brand from environment var.

        const brand = $env.get('APP_BRAND') as $type.Brand;

        // Gathers state from various contexts.

        const { state: locationState } = $preact.useLocation();
        const { state: dataState, ...data } = $preact.useData();
        const { state: htmlState } = $preact.useHTML();

        // Initializes local variables.

        const { children } = this.props; // Current children.
        const actualState = this.state; // Current actual state.
        let state: State; // Populated below w/ computed state.

        // Updates instance / cross-references.

        if (dataState.head.instance !== this) {
            dataState.head.instance = this; // Updates `<Head>` instance reference in real-time.
            data.updateState({ head: { instance: this } }); // Async update to ensure data integrity.
            this.forceDataUpdate = data.forceUpdate; // Allow us to force a `<Data>` update from `<Head>`.
        }
        // Memoizes computed state.

        state = this.computedState = $preact.useMemo((): State => {
            let title = actualState.title || locationState.url.hostname;
            const defaultDescription = 'Take the tiger by the tail.';

            if (actualState.titleSuffix /* String or `true` to enable. */) {
                if ($is.string(actualState.titleSuffix)) {
                    title += actualState.titleSuffix;
                } else if (actualState.siteName || brand.name) {
                    title += ' • ' + (actualState.siteName || brand.name);
                }
            }
            let defaultStyleBundle, defaultScriptBundle; // When applicable/possible.

            if (!actualState.styleBundle && '' !== actualState.styleBundle && isLocalWebVite) {
                defaultStyleBundle = './index.scss'; // Vite dev server uses original extension.
            }
            if (!actualState.scriptBundle && '' !== actualState.scriptBundle && isLocalWebVite) {
                defaultScriptBundle = './index.tsx'; // Vite dev server uses original extension.
            }
            return {
                ...actualState,

                charset: actualState.charset || 'utf-8',
                viewport: actualState.viewport || 'width=device-width, initial-scale=1, minimum-scale=1',

                title, // See title generation above.
                description: actualState.description || defaultDescription,
                canonical: actualState.canonical || locationState.canonicalURL,

                pngIcon: actualState.pngIcon || locationState.fromBase('./assets/icon.png'),
                svgIcon: actualState.svgIcon || locationState.fromBase('./assets/icon.svg'),

                ogSiteName: actualState.ogSiteName || actualState.siteName || brand.name || locationState.url.hostname,
                ogType: actualState.ogType || 'website',
                ogTitle: actualState.ogTitle || title,
                ogDescription: actualState.ogDescription || actualState.description || defaultDescription,
                ogURL: actualState.ogURL || actualState.canonical || locationState.canonicalURL,
                ogImage: actualState.ogImage || locationState.fromBase('./assets/og-image.png'),

                styleBundle: '' === actualState.styleBundle ? '' : actualState.styleBundle || dataState.head.styleBundle || defaultStyleBundle || '',
                scriptBundle: '' === actualState.scriptBundle ? '' : actualState.scriptBundle || dataState.head.scriptBundle || defaultScriptBundle || '',

                append: actualState.append || [], // Default to an empty array.
            };
        }, [brand, locationState, dataState, actualState]);

        // Memoizes vNodes for all keyed & unkeyed children.

        const childVNodes = $preact.useMemo((): ChildVNodes => {
            const h = $preact.h; // We prefer more concise code here.

            const vNodes: { [x: string]: $preact.VNode } = {
                charset: h('meta', { charset: state.charset }),
                baseURL: h('base', { href: locationState.baseURL.toString() }),
                viewport: h('meta', { name: 'viewport', content: state.viewport }),

                canonical: h('link', { rel: 'canonical', href: state.canonical.toString() }),
                ...(state.robots ? { robots: h('meta', { name: 'robots', content: state.robots }) } : {}),

                title: h('title', {}, state.title),
                description: h('meta', { name: 'description', content: state.description }),
                ...(state.author ? { author: h('meta', { name: 'author', content: state.author }) } : {}),

                svgIcon: h('link', { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: state.svgIcon.toString() }),
                pngIcon: h('link', { rel: 'icon', type: 'image/png', sizes: 'any', href: state.pngIcon.toString() }),
                appleTouchIcon: h('link', { rel: 'apple-touch-icon', type: 'image/png', sizes: 'any', href: state.pngIcon.toString() }),

                // Note: `og:` prefixed meta tags do not require a `prefix="og: ..."` attribute on `<head>`,
                // because they are baked into RDFa already; {@see https://www.w3.org/2011/rdfa-context/rdfa-1.1}.

                ogSiteName: h('meta', { property: 'og:site_name', content: state.ogSiteName }),
                ogType: h('meta', { property: 'og:type', content: state.ogType }),
                ogTitle: h('meta', { property: 'og:title', content: state.ogTitle }),
                ogDescription: h('meta', { property: 'og:description', content: state.ogDescription }),
                ogURL: h('meta', { property: 'og:url', content: state.ogURL.toString() }),
                ogImage: h('meta', { property: 'og:image', content: state.ogImage.toString() }),

                ...(state.scriptBundle && isC10n ? { prefetchWorkers: h('link', { rel: 'dns-prefetch', href: 'https://workers.hop.gdn/' }) } : {}), // prettier-ignore
                ...(state.styleBundle && isC10n ? { prefetchGoogleFonts: h('link', { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com/' }) } : {}), // prettier-ignore

                ...(state.styleBundle ? { styleBundle: h('link', { rel: 'stylesheet', href: state.styleBundle.toString(), media: 'all' }) } : {}), // prettier-ignore
                ...(state.scriptBundle && isSSR ? { preactISOData: h('script', { id: 'preact-iso-data', dangerouslySetInnerHTML: { __html: dataGlobalToScriptCode(dataState) } }) } : {}), // prettier-ignore
                ...(state.scriptBundle ? { scriptBundle: h('script', { type: 'module', src: state.scriptBundle.toString() }) } : {}), // prettier-ignore

                structuredData: h('script', { type: 'application/ld+json', dangerouslySetInnerHTML: { __html: generateStructuredData({ brand, htmlState, state }) } }),

                ...Object.fromEntries(
                    $preact
                        .toChildArray([children, state.append])
                        .filter((child: unknown) => {
                            // Children must be vNodes; i.e., not primitives.
                            if (!$is.vNode(child)) throw new Error(); // Invalid vNode.

                            const { type } = child; // Extracts locals.
                            const { children, 'data-key': key } = child.props;

                            // Numeric keys throw because they alter object insertion order.
                            // Also, because numeric keys imply 'order'. We need an identifier.

                            // We only support string vNode types; i.e., intrinsic HTML tag names.
                            // We choose not to support component functions, classes, or any further nesting.

                            if (!type || !$is.string(type) || !key || !$is.string(key) || $is.numeric(key) || !$is.primitive(children)) {
                                throw new Error(); // Missing or invalid child vNode. Please review `<Head>` component docBlock.
                            }
                            // Ensure all keyed children have `_` prefixed keys so they don’t collide with built-in keys.
                            if (!(key as string).startsWith('_')) child.props['data-key'] = '_' + (key as string);

                            return true;
                        })
                        .map((c) => [(c as $preact.VNode).props['data-key'] as string, c]),
                ),
            } as unknown as { [x: string]: $preact.VNode };

            for (const [key, { props }] of Object.entries(vNodes)) {
                (props as $type.Object)['data-key'] = key; // Keys all vNodes.
            }
            return vNodes as ChildVNodes;
        }, [brand, locationState, dataState, htmlState, children, state]);

        // Configures client-side effects.

        if ($env.isWeb()) {
            // Memoizes effect that runs whenever `locationState` changes.
            // We only remove nodes when location state changes. This allows appended nodes,
            // whether they come from children, state, or are added by script code at runtime;
            // to survive until location state changes; i.e., just as they would in a non-preact app.

            $preact.useEffect((): void => {
                if (locationState.isInitialHydration) return;
                // No need for an initial cleanup when hydrating.

                // Using `Array.from()` so we’re working on a copy, not the live list.
                // Nodes get removed here, so a copy avoids issues with in-loop removals.

                for (const node of Array.from($dom.head().childNodes)) {
                    if (!$is.htmlElement(node)) node.remove(); // e.g., Text or comment node.
                    //
                    else if (isLocalWebVite && 'SCRIPT' === node.tagName && '/@vite/client' === node.getAttribute('src')) {
                        continue; // Allow `/@vite/client` to exist locally.
                        //
                    } else if (!node.dataset.key || !Object.hasOwn(childVNodes, node.dataset.key)) {
                        node.remove(); // Removes unkeyed nodes, and keyed nodes that are stale.
                    }
                }
            }, [locationState]);

            // Memoizes effect that runs whenever `childVNodes` changes.
            // This runs anytime `childVNodes` is altered, such that we are capable of modifying
            // `<head>` at runtime whenever something is added or removed from the `<Head>` component.
            // e.g., If a component elsewhere does a `useHead()` to `append()` or `updateState()`.

            $preact.useEffect((): void => {
                if (locationState.isInitialHydration) return;
                // No need for an initial diff when hydrating.

                const head = $dom.head(); // Memoized `<head>`.
                let existing; // Potentially an existing element node.
                // This is reused below as we’re iterating each child vNode.

                for (const [, { type, props }] of Object.entries(childVNodes)) {
                    if ((existing = $dom.query('head > [data-key=' + props['data-key'] + ']'))) {
                        $dom.setAtts(existing, props); // Updates existing node.
                    } else {
                        head.appendChild($dom.create(type, props));
                    }
                }
            }, [childVNodes]);

            return; // Client-side has effects only.
        }
        return <head>{Object.values(childVNodes)}</head>; // Server-side.
    }
}

// ---
// Misc utilities.

/**
 * Generates structured data.
 *
 * @param   options See types in signature.
 *
 * @returns         JSON-encoded structured data.
 *
 * @see https://schema.org/ -- for details regarding graph entries.
 * @see https://o5p.me/bgYQaB -- for details from Google regarding what they need, and why.
 */
const generateStructuredData = (options: { brand: $type.Brand; htmlState: HTMLState; state: State }): string => {
    const { brand, htmlState, state } = options;

    // Organization graph(s).

    const orgGraphs = []; // Initialize.
    (() => {
        let currentOrg = brand.org; // Initialize.
        let previousOrg = undefined; // Initialize.

        // {@see https://schema.org/Corporation}.
        // {@see https://schema.org/Organization}.

        while (currentOrg && currentOrg !== previousOrg) {
            orgGraphs.unshift({
                '@type':
                    'corp' === currentOrg.type
                        ? 'Corporation' //
                        : 'Organization',
                '@id': currentOrg.url + '#' + currentOrg.type,

                url: currentOrg.url,
                name: currentOrg.name,
                legalName: currentOrg.legalName,
                address: {
                    '@type': 'PostalAddress',
                    '@id': currentOrg.url + '#addr',
                    streetAddress: currentOrg.address.street,
                    addressLocality: currentOrg.address.city,
                    addressRegion: currentOrg.address.state,
                    postalCode: currentOrg.address.zip,
                    addressCountry: currentOrg.address.country,
                },
                founder: {
                    '@type': 'Person',
                    '@id': currentOrg.founder.website + '#founder',
                    name: currentOrg.founder.name,
                    description: currentOrg.founder.description,
                    image: {
                        '@type': 'ImageObject',
                        '@id': currentOrg.founder.website + '#founderImg',
                        url: currentOrg.founder.image.url,
                        width: currentOrg.founder.image.width,
                        height: currentOrg.founder.image.height,
                        caption: currentOrg.founder.name,
                    },
                },
                foundingDate: currentOrg.foundingDate,
                numberOfEmployees: currentOrg.numberOfEmployees,

                slogan: currentOrg.slogan,
                description: currentOrg.description,
                logo: {
                    '@type': 'ImageObject',
                    '@id': currentOrg.url + '#logo',
                    url: currentOrg.logo.png,
                    width: currentOrg.logo.width,
                    height: currentOrg.logo.height,
                    caption: currentOrg.name,
                },
                image: { '@id': currentOrg.url + '#logo' },
                sameAs: Object.values(currentOrg.socialProfiles),

                ...(previousOrg ? { subOrganization: { '@id': previousOrg.url + '#' + previousOrg.type } } : {}),
                ...(currentOrg.org !== currentOrg ? { parentOrganization: { '@id': currentOrg.org.url + '#' + currentOrg.org.type } } : {}),
            });
            (previousOrg = currentOrg), (currentOrg = currentOrg.org);
        }
    })();
    // WebSite graph.
    // {@see https://schema.org/WebSite}.

    const siteGraph = {
        '@type': 'WebSite',
        '@id': brand.url + '#' + brand.type,

        url: brand.url,
        name: brand.name,
        description: brand.description,

        image: {
            '@type': 'ImageObject',
            '@id': brand.url + '#logo',
            url: brand.logo.png,
            width: brand.logo.width,
            height: brand.logo.height,
            caption: brand.name,
        },
        sameAs: Object.values(brand.socialProfiles),
        ...(orgGraphs.length ? { publisher: { '@id': orgGraphs.at(-1)?.['@id'] } } : {}),
    };
    // WebPage graph.
    // {@see https://schema.org/WebPage}.

    const pageURL = state.ogURL.toString();
    const pageTitle = (state.ogTitle || '').split(' • ')[0];
    const pageDescription = state.ogDescription || '';

    const pageGraph = $obj.mergeDeep(
        {
            '@type': 'WebPage',
            '@id': pageURL + '#page',

            url: pageURL,
            name: pageTitle,
            headline: pageTitle,
            description: pageDescription,

            inLanguage: htmlState.lang || 'en-US',
            author: [
                { '@id': siteGraph['@id'] }, // Site, and maybe a person.
                ...(state.author ? [{ '@type': 'Person', name: state.author }] : []),
            ],
            datePublished: state.publishTime?.toString() || '',
            dateModified: state.lastModifiedTime?.toString() || '',

            ...(state.ogImage
                ? {
                      primaryImageOfPage: {
                          '@type': 'ImageObject',
                          '@id': pageURL + '#primaryImg',

                          width: brand.ogImage.width,
                          height: brand.ogImage.height,
                          url: state.ogImage.toString(),
                          caption: state.ogDescription || '',
                      },
                      image: [{ '@id': pageURL + '#primaryImg' }],
                  }
                : {}),
            about: { '@id': siteGraph['@id'] },
            isPartOf: { '@id': siteGraph['@id'] },
            ...(orgGraphs.length ? { publisher: { '@id': orgGraphs.at(-1)?.['@id'] } } : {}),
        },
        state.structuredData, // Allows `<Head>` to merge customizations.
    );
    // Composition.
    // {@see https://schema.org/}.

    const data = {
        '@context': 'https://schema.org/',
        '@graph': [...orgGraphs, siteGraph, pageGraph],
    };
    return $json.stringify(data, { pretty: true });
};
