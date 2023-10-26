/**
 * Preact component.
 */

import '../../resources/init.ts';

import { Component } from 'preact';
import { $dom, $env, $is, $json, $obj, $preact, type $type } from '../../index.ts';
import { globalToScriptCode as dataGlobalToScriptCode, type ContextProps as DataContextProps } from './data.tsx';
import { type State as HTMLState } from './html.tsx';

/**
 * Defines types.
 */
export type State = $preact.State<
    Partial<$preact.Intrinsic['head']> & {
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
    } & { [x in $preact.ClassPropVariants]?: $preact.Classes }
>;
export type PartialState = Partial<State>;
export type PartialStateUpdates = Omit<PartialState, ImmutableStateKeys>;

export type ComputedState = State &
    Required<
        Pick<
            State,
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
            | 'append'
        >
    >;
export type Props = Omit<$preact.Props<PartialState>, 'children'> & {
    children?: ChildVNode | ChildVNode[];
};
export type ChildVNode = Omit<$preact.VNode, 'type' | 'props'> & {
    type: string; // i.e., Intrinsic HTML tags.
    props: Omit<$preact.Props, 'children'> & {
        'data-key': string;
        children?: $type.Primitive;
    };
};
export type ChildVNodes = { [x: string]: ChildVNode };

export type ContextProps = $preact.Context<{
    state: ComputedState;
    append: Head['append'];
    updateState: Head['updateState'];
    forceFullUpdate: Head['forceFullUpdate'];
}>;

/**
 * Defines a list of all true prop keys in state.
 *
 * We need this so it’s possible to filter state and distinguish between intrinsic `<head>` attributes and true
 * configurable props to the `<Head>` component, all of which, except `children`, will end up in state.
 *
 * This variable must remain a `const`, as it keeps types DRY. Also, please be advised that because this is a `const`,
 * we cannot include class prop variants here. Please be sure this is only used with {@see $preact.omitProps()}, so that
 * class prop variants can be handled properly, based only on the existence of `class`.
 */
const truePropKeysInState = [
    'class',

    'charset',
    'viewport',

    'robots',
    'publishTime',
    'lastModifiedTime',
    'canonical',
    'structuredData',

    'siteName',
    'title',
    'titleSuffix',
    'description',
    'author',

    'pngIcon',
    'svgIcon',

    'ogSiteName',
    'ogType',
    'ogTitle',
    'ogDescription',
    'ogURL',
    'ogImage',

    'styleBundle',
    'scriptBundle',

    'append',
] as const; // Expanded into a type.
type TruePropKeysInState = $type.Writable<typeof truePropKeysInState>[number];

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
 * Defines component.
 *
 * Using a class component so there can be external references to the current `<Head>` component instance. Using
 * `Component`, not `$preact.Component`, because this occurs inline. We can’t use our own cyclic utilities inline, only
 * inside functions. So we use `Component` directly from `preact` in this specific case.
 *
 * `<Data>` state contains some initial, passable `<Head>` state keys. These serve as default props for `<Head>` when
 * they are not defined elsewhere. e.g., `styleBundle`, `scriptBundle`. `<Data>` state also contains a high-level
 * reference to the current `<Head>` `instance`, such that it becomes available across all contexts.
 */
export default class Head extends Component<Props, State> {
    // These are defined on first render.
    forceDataUpdate: DataContextProps['forceUpdate'] | undefined;
    computedState: ComputedState | undefined;

    constructor(props: Props = {}) {
        super(props); // Parent constructor.

        this.state = $preact.omitProps(props, ['children']);
        // this.forceDataUpdate ...defined on first render.
        // this.computedState ...defined on first render.
    }

    append(childVNodes: ChildVNode | ChildVNode[]): void {
        // Note: We have to achieve this without the use of declarative ops.
        this.updateState({ append: $preact.toChildArray([this.state.append || [], childVNodes]) } as PartialStateUpdates);
    }

    // Note: This does not allow the use of declarative ops.
    updateState<Updates extends PartialStateUpdates>(updates: Updates): void {
        this.setState((currentState: State): Updates | null => {
            // Some `<Head>` state keys are immutable.
            updates = $obj.omit(updates, immutableStateKeys as unknown as string[]) as Updates;

            const newState = $obj.updateDeepNoOps(currentState, updates);
            // Returning `null` tells Preact no; {@see https://o5p.me/9BaxT3}.
            return newState !== currentState ? (newState as Updates) : null;
        });
    }

    forceFullUpdate(callback?: () => void): void {
        if (!this.forceDataUpdate) throw new Error();
        this.forceDataUpdate(callback);
    }

    render(): $preact.VNode<Props> | undefined {
        // Each app must configure its brand at runtime.
        const brand = $env.get('APP_BRAND') as $type.Brand;

        // Gathers state.

        const { state: locState } = $preact.useLocation();
        const { state: dataState, ...data } = $preact.useData();
        const { state: htmlState } = $preact.useHTML();

        // Initializes local variables.

        const { children } = this.props; // Current children.
        const actualState = this.state; // Current actual state.
        let state: ComputedState; // Populated below w/ computed state.

        // Updates instance / cross-references.

        dataState.head.instance = this; // Updates `<Head>` instance reference in real-time.
        data.updateState({ head: { instance: this } }); // Async update to ensure data integrity.
        this.forceDataUpdate = data.forceUpdate; // Allow us to force a `<Data>` update from `<Head>`.

        // Memoizes computed state.

        state = this.computedState = $preact.useMemo((): ComputedState => {
            let title = actualState.title || locState.url.hostname;
            const defaultDescription = 'Take the tiger by the tail.';

            if (actualState.titleSuffix /* String or `true` to enable. */) {
                if ($is.string(actualState.titleSuffix)) {
                    title += actualState.titleSuffix;
                } else if (actualState.siteName || brand.name) {
                    title += ' • ' + (actualState.siteName || brand.name);
                }
            }
            let defaultStyleBundle, defaultScriptBundle; // When applicable/possible.

            if (!actualState.styleBundle && '' !== actualState.styleBundle && $env.isLocalWebVite()) {
                defaultStyleBundle = './index.scss'; // Vite dev server uses original extension.
            }
            if (!actualState.scriptBundle && '' !== actualState.scriptBundle && $env.isLocalWebVite()) {
                defaultScriptBundle = './index.tsx'; // Vite dev server uses original extension.
            }
            return {
                ...actualState,

                charset: actualState.charset || 'utf-8',
                viewport: actualState.viewport || 'width=device-width, initial-scale=1, minimum-scale=1',

                title, // See title generation above.
                description: actualState.description || defaultDescription,
                canonical: actualState.canonical || locState.canonicalURL,

                pngIcon: actualState.pngIcon || locState.fromBase('./assets/icon.png'),
                svgIcon: actualState.svgIcon || locState.fromBase('./assets/icon.svg'),

                ogSiteName: actualState.ogSiteName || actualState.siteName || brand.name || locState.url.hostname,
                ogType: actualState.ogType || 'website',
                ogTitle: actualState.ogTitle || title,
                ogDescription: actualState.ogDescription || actualState.description || defaultDescription,
                ogURL: actualState.ogURL || actualState.canonical || locState.canonicalURL,
                ogImage: actualState.ogImage || locState.fromBase('./assets/og-image.png'),

                styleBundle: '' === actualState.styleBundle ? '' : actualState.styleBundle || dataState.head.styleBundle || defaultStyleBundle || '',
                scriptBundle: '' === actualState.scriptBundle ? '' : actualState.scriptBundle || dataState.head.scriptBundle || defaultScriptBundle || '',

                append: actualState.append || [], // Default to an empty array.
            };
        }, [brand, locState, dataState, actualState]);

        // Memoizes attributes.

        const atts = $preact.useMemo((): PartialState => {
            return {
                ...$preact.omitProps(state, truePropKeysInState as unknown as TruePropKeysInState[]),
                class: $preact.classes(state),
            };
        }, [state]);

        // Memoizes vNodes for all keyed & unkeyed children.

        const childVNodes = $preact.useMemo((): ChildVNodes => {
            const h = $preact.h; // We prefer more concise code here.

            const vNodes = {
                charset: h('meta', { charset: state.charset }),
                baseURL: h('base', { href: locState.baseURL.toString() }),
                viewport: h('meta', { name: 'viewport', content: state.viewport }),

                canonical: h('link', { rel: 'canonical', href: state.canonical.toString() }),
                ...(state.robots ? { robots: h('meta', { name: 'robots', content: state.robots }) } : {}),

                title: h('title', {}, state.title),
                description: h('meta', { name: 'description', content: state.description }),
                ...(state.author ? { author: h('meta', { name: 'author', content: state.author }) } : {}),

                svgIcon: h('link', { rel: 'icon', type: 'image/svg+xml', sizes: 'any', href: state.svgIcon.toString() }),
                pngIcon: h('link', { rel: 'icon', type: 'image/png', sizes: 'any', href: state.pngIcon.toString() }),
                appleTouchIcon: h('link', { rel: 'apple-touch-icon', type: 'image/png', sizes: 'any', href: state.pngIcon.toString() }),

                ogSiteName: h('meta', { property: 'og:site_name', content: state.ogSiteName }),
                ogType: h('meta', { property: 'og:type', content: state.ogType }),
                ogTitle: h('meta', { property: 'og:title', content: state.ogTitle }),
                ogDescription: h('meta', { property: 'og:description', content: state.ogDescription }),
                ogURL: h('meta', { property: 'og:url', content: state.ogURL.toString() }),
                ogImage: h('meta', { property: 'og:image', content: state.ogImage.toString() }),

                ...(state.styleBundle ? { styleBundle: h('link', { rel: 'stylesheet', href: state.styleBundle.toString(), media: 'all' }) } : {}), // prettier-ignore
                ...(state.scriptBundle && $env.isSSR() ? { preactISOData: h('script', { id: 'preact-iso-data', dangerouslySetInnerHTML: { __html: dataGlobalToScriptCode(dataState) } }) } : {}), // prettier-ignore
                ...(state.scriptBundle ? { scriptBundle: h('script', { type: 'module', src: state.scriptBundle.toString() }) } : {}), // prettier-ignore

                structuredData: h('script', { type: 'application/ld+json', dangerouslySetInnerHTML: { __html: generateStructuredData({ brand, htmlState, state }) } }), // prettier-ignore

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
                            // We choose not to support component functions, classes, or any nesting.

                            if (!type || !$is.string(type) || !key || !$is.string(key) || $is.numeric(key) || !$is.primitive(children)) {
                                throw new Error(); // Missing or invalid child vNode.
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
        }, [brand, locState, dataState, htmlState, children, state]);

        // Configures client-side effects.

        if ($env.isWeb()) {
            // Memoizes effect that runs when `atts` changes.

            $preact.useEffect((): void => {
                $dom.newAtts($dom.require('head'), atts); // `<head {...atts}>`.
            }, [atts]);

            // Memoizes effect that runs when `locState` changes.

            $preact.useEffect((): void => {
                // No need for an initial cleanup when hydrating.
                if (locState.isInitial && locState.isHydration) return;

                $dom.require('head').childNodes.forEach((node: ChildNode) => {
                    if (!$is.htmlElement(node) || !node.dataset.key) {
                        node.remove(); // Removes unkeyed nodes.
                    } else if (!Object.hasOwn(childVNodes, node.dataset.key)) {
                        node.remove(); // Removes keyed nodes that are stale.
                    }
                });
            }, [locState]);

            // Memoizes effect that runs when `childVNodes` changes.

            $preact.useEffect((): void => {
                // No need for an initial diff when hydrating.
                if (locState.isInitial && locState.isHydration) return;

                const head = $dom.require('head');
                let existing; // An existing element node.

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
        return <head {...atts}>{Object.values(childVNodes)}</head>; // Server-side.
    }
}

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
const generateStructuredData = (options: { brand: $type.Brand; htmlState: HTMLState; state: ComputedState }): string => {
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
 * @returns Pseudo context props {@see ContextProps}.
 */
export const useHead = (): ContextProps => {
    const { state: dataState } = $preact.useData();
    const instance = dataState.head.instance;

    if (!instance) throw new Error(); // Missing `instance`.
    if (!instance.computedState) throw new Error(); // Missing `computedState`.
    return {
        state: instance.computedState,
        append: (...args) => instance.append(...args),
        updateState: (...args) => instance.updateState(...args),
        forceFullUpdate: (...args) => instance.forceFullUpdate(...args),
    };
};
