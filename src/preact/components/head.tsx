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
 * Defines plain text tokens.
 *
 * Why are there so many crazy variables here? The intention is to optimize for minification. i.e., By using as many
 * variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome. Remember,
 * variable names can be minified, so variable name length is not an issue.
 */
const tꓺabout = 'about',
    tꓺaddr = 'addr',
    tꓺaddress = tꓺaddr + 'ess',
    tꓺaddressCountry = tꓺaddress + 'Country',
    tꓺaddressLocality = tꓺaddress + 'Locality',
    tꓺaddressRegion = tꓺaddress + 'Region',
    tꓺall = 'all',
    tꓺany = 'any',
    tꓺappend = 'append',
    tꓺauthor = 'author',
    tꓺbase = 'base',
    tꓺbaseURL = tꓺbase + 'URL',
    tꓺcanonical = 'canonical',
    tꓺcaption = 'caption',
    tꓺcontent = 'content',
    tꓺමcontext = '@context',
    tꓺCorporation = 'Corporation',
    tꓺfounder = 'founder',
    tꓺfounderImg = tꓺfounder + 'Img',
    tꓺfoundingDate = 'foundingDate',
    tꓺමgraph = '@graph',
    tꓺcharset = 'charset',
    tꓺdangerouslySetInnerHTML = 'dangerouslySetInnerHTML',
    tꓺdataᱼkey = 'data-key',
    tꓺdatePublished = 'datePublished',
    tꓺdateModified = 'dateModified',
    tꓺdescription = 'description',
    tꓺdnsPrefetch = 'dns-prefetch',
    tꓺheadline = 'headline',
    tꓺheight = 'height',
    tꓺhref = 'href',
    tꓺhttpsꓽⳇⳇ = 'https://',
    tꓺicon = 'icon',
    tꓺappleTouchIcon = 'appleTouchIcon',
    tꓺappleᱼtouchᱼicon = 'apple-touch-' + tꓺicon,
    tꓺ__html = '__html',
    tꓺImageObject = 'ImageObject',
    tꓺid = 'id',
    tꓺමid = '@' + tꓺid,
    tꓺimage = 'image',
    tꓺimageⳇpng = tꓺimage + '/png',
    tꓺimageⳇsvg = tꓺimage + '/svg+xml',
    tꓺinLanguage = 'inLanguage',
    tꓺisPartOf = 'isPartOf',
    tꓺlegalName = 'legalName',
    tꓺlink = 'link',
    tꓺlogo = 'logo',
    tꓺmeta = 'meta',
    tꓺmedia = 'media',
    tꓺmodule = 'module',
    tꓺname = 'name',
    tꓺnumberOfEmployees = 'numberOfEmployees',
    tꓺogꓽ = 'og:',
    tꓺogSiteName = 'ogSiteName',
    tꓺogType = 'ogType',
    tꓺogTitle = 'ogTitle',
    tꓺogDescription = 'ogDescription',
    tꓺogURL = 'ogURL',
    tꓺogImage = 'ogImage',
    tꓺOrganization = 'Organization',
    tꓺparentOrganization = 'parent' + tꓺOrganization,
    tꓺsubOrganization = 'sub' + tꓺOrganization,
    tꓺpage = 'page',
    tꓺPerson = 'Person',
    tꓺpostalCode = 'postalCode',
    tꓺPostalAddress = 'PostalAddress',
    tꓺpreactISOData = 'preactISOData',
    tꓺprefetchWorkers = 'prefetchWorkers',
    tꓺprefetchGoogleFonts = 'prefetchGoogleFonts',
    tꓺprimaryImageOfPage = 'primaryImageOfPage',
    tꓺprimaryImg = 'primaryImg',
    tꓺproperty = 'property',
    tꓺpublisher = 'publisher',
    tꓺrel = 'rel',
    tꓺrobots = 'robots',
    tꓺsameAs = 'sameAs',
    tꓺscript = 'script',
    tꓺsite = 'site',
    tꓺslogan = 'slogan',
    tꓺsizes = 'sizes',
    tꓺsrc = 'src',
    tꓺstreetAddress = 'streetAddress',
    tꓺstructuredData = 'structuredData',
    tꓺstyleBundle = 'styleBundle',
    tꓺscriptBundle = 'scriptBundle',
    tꓺstylesheet = 'stylesheet',
    tꓺpngIcon = 'pngIcon',
    tꓺsvgIcon = 'svgIcon',
    tꓺtitle = 'title',
    tꓺtype = 'type',
    tꓺමtype = '@' + tꓺtype,
    tꓺurl = 'url',
    tꓺviewport = 'viewport',
    tꓺWeb = 'Web',
    tꓺWebPage = tꓺWeb + 'Page',
    tꓺWebSite = tꓺWeb + 'Site',
    tꓺwidth = 'width';

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
 *
 * Why are there so many crazy variables here? The intention is to optimize for minification. i.e., By using as many
 * variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome. Remember,
 * variable names can be minified, so variable name length is not an issue.
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
        const { state: layoutState } = $preact.useLayout();
        const { state: htmlState } = $preact.useHTML();

        // Initializes local variables.

        const { children } = this.props; // Current children.
        const actualState = this.state; // Current actual state.
        let state: State; // Populated below w/ computed state.

        // Updates instance / cross-references.

        if (dataState.head.instance !== this) {
            dataState.head.instance = this; // Updates `<Head>` instance reference in real-time.
            this.forceDataUpdate = data.forceUpdate; // Allow us to force a `<Data>` update from `<Head>`.
        }
        // Memoizes computed state.

        state = this.computedState = $preact.useMemo((): State => {
            const {
                charset,
                viewport,
                titleSuffix,
                description,
                canonical,
                pngIcon,
                svgIcon,
                siteName,
                ogSiteName,
                ogType,
                ogTitle,
                ogDescription,
                ogURL,
                ogImage,
                styleBundle,
                scriptBundle,
            } = { ...layoutState?.head, ...actualState };
            const { url, canonicalURL, fromBase } = locationState;

            let title = actualState.title || url.hostname;
            const defaultDescription = 'Take the tiger by the tail.';

            if (titleSuffix /* String or `true` to enable. */) {
                if ($is.string(titleSuffix)) {
                    title += titleSuffix;
                } else if (siteName || brand.name) {
                    title += ' • ' + (siteName || brand.name);
                }
            }
            let defaultStyleBundle, defaultScriptBundle; // When applicable/possible.

            if (!styleBundle && '' !== styleBundle && isLocalWebVite) {
                defaultStyleBundle = './index.scss'; // Vite dev server uses original extension.
            }
            if (!scriptBundle && '' !== scriptBundle && isLocalWebVite) {
                defaultScriptBundle = './index.tsx'; // Vite dev server uses original extension.
            }
            return {
                ...layoutState?.head,
                ...actualState,

                [tꓺcharset]: charset || 'utf-8',
                [tꓺviewport]: viewport || 'width=device-width, initial-scale=1, minimum-scale=1',

                [tꓺtitle]: title, // Title generated above.
                [tꓺdescription]: description || defaultDescription,
                [tꓺcanonical]: canonical || canonicalURL,

                [tꓺpngIcon]: pngIcon || fromBase('./assets/icon.png'),
                [tꓺsvgIcon]: svgIcon || fromBase('./assets/icon.svg'),

                [tꓺogSiteName]: ogSiteName || siteName || brand.name || url.hostname,
                [tꓺogType]: ogType || 'website',
                [tꓺogTitle]: ogTitle || title,
                [tꓺogDescription]: ogDescription || description || defaultDescription,
                [tꓺogURL]: ogURL || canonical || canonicalURL,
                [tꓺogImage]: ogImage || fromBase('./assets/og-image.png'),

                [tꓺstyleBundle]: '' === styleBundle ? '' : styleBundle || dataState.head.styleBundle || defaultStyleBundle || '',
                [tꓺscriptBundle]: '' === scriptBundle ? '' : scriptBundle || dataState.head.scriptBundle || defaultScriptBundle || '',

                // Concatenated, not merged, as they are potentially arrays.
                [tꓺappend]: (layoutState?.head.append || []).concat(actualState.append || []),
            };
        }, [brand, locationState, dataState, actualState]);

        // Memoizes vNodes for all keyed & unkeyed children.

        const childVNodes = $preact.useMemo((): ChildVNodes => {
            const h = $preact.h;
            const {
                charset,
                viewport,
                canonical,
                robots,
                title,
                description,
                author,
                svgIcon,
                pngIcon,
                ogSiteName,
                ogType,
                ogTitle,
                ogDescription,
                ogURL,
                ogImage,
                scriptBundle,
                styleBundle,
                append,
            } = state;
            const { baseURL } = locationState;

            const vNodes: { [x: string]: $preact.VNode } = {
                [tꓺcharset]: h(tꓺmeta, { [tꓺcharset]: charset }),
                [tꓺbaseURL]: h(tꓺbase, { [tꓺhref]: baseURL.toString() }),
                [tꓺviewport]: h(tꓺmeta, { [tꓺname]: tꓺviewport, [tꓺcontent]: viewport }),

                [tꓺcanonical]: h(tꓺlink, { [tꓺrel]: tꓺcanonical, [tꓺhref]: canonical.toString() }),
                ...(robots ? { [tꓺrobots]: h(tꓺmeta, { [tꓺname]: tꓺrobots, [tꓺcontent]: robots }) } : {}),

                [tꓺtitle]: h(tꓺtitle, {}, title),
                [tꓺdescription]: h(tꓺmeta, { [tꓺname]: tꓺdescription, [tꓺcontent]: description }),
                ...(author ? { [tꓺauthor]: h(tꓺmeta, { [tꓺname]: tꓺauthor, [tꓺcontent]: author }) } : {}),

                [tꓺsvgIcon]: h(tꓺlink, { [tꓺrel]: tꓺicon, [tꓺtype]: tꓺimageⳇsvg, [tꓺsizes]: tꓺany, [tꓺhref]: svgIcon.toString() }),
                [tꓺpngIcon]: h(tꓺlink, { [tꓺrel]: tꓺicon, [tꓺtype]: tꓺimageⳇpng, [tꓺsizes]: tꓺany, [tꓺhref]: pngIcon.toString() }),
                [tꓺappleTouchIcon]: h(tꓺlink, { [tꓺrel]: tꓺappleᱼtouchᱼicon, [tꓺtype]: tꓺimageⳇpng, [tꓺsizes]: tꓺany, [tꓺhref]: pngIcon.toString() }),

                // Note: `og:` prefixed meta tags do not require a `prefix="og: ..."` attribute on `<head>`,
                // because they are baked into RDFa already; {@see https://www.w3.org/2011/rdfa-context/rdfa-1.1}.

                [tꓺogSiteName]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺsite + '_' + tꓺname, [tꓺcontent]: ogSiteName }),
                [tꓺogType]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺtype, [tꓺcontent]: ogType }),
                [tꓺogTitle]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺtitle, [tꓺcontent]: ogTitle }),
                [tꓺogDescription]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺdescription, [tꓺcontent]: ogDescription }),
                [tꓺogURL]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺurl, [tꓺcontent]: ogURL.toString() }),
                [tꓺogImage]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺimage, [tꓺcontent]: ogImage.toString() }),

                ...(scriptBundle && isC10n ? { [tꓺprefetchWorkers]: h(tꓺlink, { [tꓺrel]: tꓺdnsPrefetch, [tꓺhref]: tꓺhttpsꓽⳇⳇ + 'workers.hop.gdn/' }) } : {}), // prettier-ignore
                ...(styleBundle && isC10n ? { [tꓺprefetchGoogleFonts]: h(tꓺlink, { [tꓺrel]: tꓺdnsPrefetch, [tꓺhref]: tꓺhttpsꓽⳇⳇ + 'fonts.googleapis.com/' }) } : {}), // prettier-ignore

                ...(styleBundle ? { [tꓺstyleBundle]: h(tꓺlink, { [tꓺrel]: tꓺstylesheet, [tꓺhref]: styleBundle.toString(), [tꓺmedia]: tꓺall }) } : {}), // prettier-ignore
                ...(scriptBundle && isSSR ? { [tꓺpreactISOData]: h(tꓺscript, { [tꓺid]: 'preact-iso-data', [tꓺdangerouslySetInnerHTML]: { [tꓺ__html]: dataGlobalToScriptCode(dataState) } }) } : {}), // prettier-ignore
                ...(scriptBundle ? { [tꓺscriptBundle]: h(tꓺscript, { [tꓺtype]: tꓺmodule, [tꓺsrc]: scriptBundle.toString() }) } : {}), // prettier-ignore

                [tꓺstructuredData]: h(tꓺscript, {
                    [tꓺtype]: 'application/ld+json',
                    [tꓺdangerouslySetInnerHTML]: { [tꓺ__html]: generateStructuredData({ brand, htmlState, state }) },
                }),
                ...Object.fromEntries(
                    $preact
                        .toChildArray([children, append])
                        .filter((child: unknown) => {
                            // Children must be vNodes; i.e., not primitives.
                            if (!$is.vNode(child)) throw new Error(); // Invalid vNode.

                            const { type, props } = child; // Extracts locals.
                            const { children, [tꓺdataᱼkey]: key } = props;

                            // Numeric keys throw because they alter object insertion order.
                            // Also, because numeric keys imply 'order'. We need an identifier.

                            // We only support string vNode types; i.e., intrinsic HTML tag names.
                            // We choose not to support component functions, classes, or any further nesting.

                            if (!type || !$is.string(type) || !key || !$is.string(key) || $is.numeric(key) || !$is.primitive(children)) {
                                throw new Error(); // Missing or invalid child vNode. Please review `<Head>` component docBlock.
                            }
                            // Ensure all keyed children have `_` prefixed keys so they don’t collide with built-in keys.
                            if (!(key as string).startsWith('_')) props[tꓺdataᱼkey] = '_' + (key as string);

                            return true;
                        })
                        .map((c) => [(c as $preact.VNode).props[tꓺdataᱼkey] as string, c]),
                ),
            } as unknown as { [x: string]: $preact.VNode };

            for (const [key, { props }] of Object.entries(vNodes)) {
                (props as $type.Object)[tꓺdataᱼkey] = key; // Keys all vNodes.
            }
            return vNodes as ChildVNodes;
        }, [brand, locationState, dataState, htmlState, children, state]);

        // Configures client-side effects.

        if ($env.isWeb()) {
            // Memoizes effect that runs whenever `locationState` changes.
            // We only remove nodes when location state changes. This allows appended nodes,
            // whether they come from children, state, or are added by script code at runtime;
            // to survive until location state changes; i.e., just as they normally would.

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
 * Why are there so many crazy variables here? The intention is to optimize for minification. i.e., By using as many
 * variables as we can reasonably achieve. Variables reduce number of bytes needed to reach desired outcome. Remember,
 * variable names can be minified, so variable name length is not an issue.
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
    const brandLogo = brand.logo;
    const brandLogoOnLightBg = brandLogo.onLightBg;
    const brandOGImage = brand.ogImage;

    // Organization graph(s).

    const orgGraphs = []; // Initialize.
    (() => {
        let currentOrg = brand.org; // Initialize.
        let previousOrg = undefined; // Initialize.

        // {@see https://schema.org/Corporation}.
        // {@see https://schema.org/Organization}.

        while (currentOrg && currentOrg !== previousOrg) {
            const currentOrgFounder = currentOrg.founder;
            const currentOrgFounderImage = currentOrgFounder.image;
            const currentOrgAddress = currentOrg.address;
            const currentOrgLogo = currentOrg.logo;
            const currentOrgLogoOnLightBg = currentOrgLogo.onLightBg;

            orgGraphs.unshift({
                [tꓺමtype]: 'corp' === currentOrg.type ? tꓺCorporation : tꓺOrganization,
                [tꓺමid]: currentOrg.url + '#' + currentOrg.type,

                [tꓺurl]: currentOrg.url,
                [tꓺname]: currentOrg.name,
                [tꓺlegalName]: currentOrg.legalName,
                [tꓺaddress]: {
                    [tꓺමtype]: tꓺPostalAddress,
                    [tꓺමid]: currentOrg.url + '#' + tꓺaddr,
                    [tꓺstreetAddress]: currentOrgAddress.street,
                    [tꓺaddressLocality]: currentOrgAddress.city,
                    [tꓺaddressRegion]: currentOrgAddress.state,
                    [tꓺpostalCode]: currentOrgAddress.zip,
                    [tꓺaddressCountry]: currentOrgAddress.country,
                },
                [tꓺfounder]: {
                    [tꓺමtype]: tꓺPerson,
                    [tꓺමid]: currentOrgFounder.website + '#' + tꓺfounder,
                    [tꓺname]: currentOrgFounder.name,
                    [tꓺdescription]: currentOrgFounder.description,
                    [tꓺimage]: {
                        [tꓺමtype]: tꓺImageObject,
                        [tꓺමid]: currentOrgFounder.website + '#' + tꓺfounderImg,
                        [tꓺurl]: currentOrgFounderImage.url,
                        [tꓺwidth]: currentOrgFounderImage.width,
                        [tꓺheight]: currentOrgFounderImage.height,
                        [tꓺcaption]: currentOrgFounder.name,
                    },
                },
                [tꓺfoundingDate]: currentOrg.foundingDate,
                [tꓺnumberOfEmployees]: currentOrg.numberOfEmployees,

                [tꓺslogan]: currentOrg.slogan,
                [tꓺdescription]: currentOrg.description,
                [tꓺlogo]: {
                    [tꓺමtype]: tꓺImageObject,
                    [tꓺමid]: currentOrg.url + '#' + tꓺlogo,
                    [tꓺurl]: currentOrgLogoOnLightBg.png,
                    [tꓺwidth]: currentOrgLogo.width,
                    [tꓺheight]: currentOrgLogo.height,
                    [tꓺcaption]: currentOrg.name,
                },
                [tꓺimage]: { [tꓺමid]: currentOrg.url + '#' + tꓺlogo },
                [tꓺsameAs]: Object.values(currentOrg.socialProfiles),

                ...(previousOrg ? { [tꓺsubOrganization]: { [tꓺමid]: previousOrg.url + '#' + previousOrg.type } } : {}),
                ...(currentOrg.org !== currentOrg ? { [tꓺparentOrganization]: { [tꓺමid]: currentOrg.org.url + '#' + currentOrg.org.type } } : {}),
            });
            (previousOrg = currentOrg), (currentOrg = currentOrg.org);
        }
    })();
    // WebSite graph.
    // {@see https://schema.org/WebSite}.

    const siteGraph = {
        [tꓺමtype]: tꓺWebSite,
        [tꓺමid]: brand.url + '#' + brand.type,

        [tꓺurl]: brand.url,
        [tꓺname]: brand.name,
        [tꓺdescription]: brand.description,

        [tꓺimage]: {
            [tꓺමtype]: tꓺImageObject,
            [tꓺමid]: brand.url + '#' + tꓺlogo,
            [tꓺurl]: brandLogoOnLightBg.png,
            [tꓺwidth]: brandLogo.width,
            [tꓺheight]: brandLogo.height,
            [tꓺcaption]: brand.name,
        },
        [tꓺsameAs]: Object.values(brand.socialProfiles),
        ...(orgGraphs.length ? { [tꓺpublisher]: { [tꓺමid]: orgGraphs.at(-1)?.[tꓺමid] } } : {}),
    };
    // WebPage graph.
    // {@see https://schema.org/WebPage}.

    const pageURL = state.ogURL.toString();
    const pageTitle = (state.ogTitle || '').split(' • ')[0];
    const pageDescription = state.ogDescription || '';

    const pageGraph = $obj.mergeDeep(
        {
            [tꓺමtype]: tꓺWebPage,
            [tꓺමid]: pageURL + '#' + tꓺpage,

            [tꓺurl]: pageURL,
            [tꓺname]: pageTitle,
            [tꓺheadline]: pageTitle,
            [tꓺdescription]: pageDescription,

            [tꓺinLanguage]: htmlState.lang || 'en-US',
            [tꓺauthor]: [
                { [tꓺමid]: (siteGraph as $type.Object)[tꓺමid] }, // And maybe a person.
                ...(state.author ? [{ [tꓺමtype]: tꓺPerson, [tꓺname]: state.author }] : []),
            ],
            [tꓺdatePublished]: state.publishTime?.toString() || '',
            [tꓺdateModified]: state.lastModifiedTime?.toString() || '',

            ...(state.ogImage
                ? {
                      [tꓺprimaryImageOfPage]: {
                          [tꓺමtype]: tꓺImageObject,
                          [tꓺමid]: pageURL + '#' + tꓺprimaryImg,

                          [tꓺwidth]: brandOGImage.width,
                          [tꓺheight]: brandOGImage.height,
                          [tꓺurl]: state.ogImage.toString(),
                          [tꓺcaption]: state.ogDescription || '',
                      },
                      [tꓺimage]: [{ [tꓺමid]: pageURL + '#' + tꓺprimaryImg }],
                  }
                : {}),
            [tꓺabout]: { [tꓺමid]: (siteGraph as $type.Object)[tꓺමid] },
            [tꓺisPartOf]: { [tꓺමid]: (siteGraph as $type.Object)[tꓺමid] },
            ...(orgGraphs.length ? { [tꓺpublisher]: { [tꓺමid]: orgGraphs.at(-1)?.[tꓺමid] } } : {}),
        },
        state.structuredData, // Allows `<Head>` to merge customizations.
    );
    // Composition.
    // {@see https://schema.org/}.

    const data = {
        [tꓺමcontext]: tꓺhttpsꓽⳇⳇ + 'schema.org/',
        [tꓺමgraph]: [...orgGraphs, siteGraph, pageGraph],
    };
    return $json.stringify(data, { pretty: true });
};
