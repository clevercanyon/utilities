/**
 * Preact component.
 */

import '#@initialize.ts';

import { $dom, $env, $fn, $is, $json, $obj, $person, $preact, $time, $url, type $type } from '#index.ts';
import { globalToScriptCode as dataGlobalToScriptCode, type Context as DataContext } from '#preact/components/data.tsx';
import { type State as HTMLState } from '#preact/components/html.tsx';
import { Component } from 'preact';

/**
 * Defines types.
 */
export type ActualState = $preact.State<{
    charset?: string;
    themeColor?: string;
    viewport?: string;

    robots?: string;
    canonical?: $type.URL | string;

    siteName?: string;
    title?: string;
    titleSuffix?: string | boolean;
    description?: string;
    category?: string;
    tags?: string[];
    image?: $type.URL | string;

    author?: $type.Person | string;
    publishTime?: $type.Time | string;
    lastModifiedTime?: $type.Time | string;

    humans?: string;
    manifest?: string;
    structuredData?: object;

    pngIcon?: $type.URL | string;
    svgIcon?: $type.URL | string;

    ogSiteName?: string;
    ogType?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogCategory?: string;
    ogTags?: string[];
    ogURL?: $type.URL | string;
    ogImage?: $type.URL | string;

    styleBundle?: $type.URL | string;
    scriptBundle?: $type.URL | string;

    append?: $preact.VNode[];
}>;
export type PartialActualState = Partial<ActualState>;
export type PartialActualStateUpdates = Omit<PartialActualState, ImmutableStateKeys>;

export type State = $preact.State<{
    charset: string;
    themeColor: string;
    viewport: string;

    robots: string;
    canonical: string; // Absolute URL.

    siteName: string;
    title: string;
    titleSuffix: string | boolean;
    suffixedTitle: string;
    description: string;
    category: string;
    tags: string[];
    image: string; // Absolute URL.

    author?: $type.Person;
    publishTime?: $type.Time;
    lastModifiedTime?: $type.Time;

    humans: string;
    manifest: string;
    structuredData?: object;

    pngIcon: string; // Absolute URL.
    svgIcon: string; // Absolute URL.

    ogSiteName: string;
    ogType: string;
    ogTitle: string;
    ogSuffixedTitle: string;
    ogDescription: string;
    ogCategory: string;
    ogTags: string[];
    ogURL: string; // Absolute URL.
    ogImage: string; // Absolute URL.

    styleBundle: string; // Potentially a relative URL.
    scriptBundle: string; // Potentially a relative URL.

    append: $preact.VNode[];
}>;
export type Props = $preact.CleanProps<PartialActualState> & {
    // There’s really not a great way to enforce the child vNode type.
    // Internal JSX types use things that are too generic for that to work.
    // For now, we go ahead and add them here, but we also allow for any `$preact.Children`.
    // Not to worry, as there are conditionals in code that will throw if invalid children are given.
    children?: ChildVNode | ChildVNode[] | $preact.Children;
};
export type ChildVNode = Omit<$preact.VNode, 'type' | 'props'> & {
    type: string; // i.e., Intrinsic HTML tags only.
    props: $preact.CleanProps<{}> & {
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
type GetComputedStateOptions = { useLayoutState?: boolean };

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
    tꓺarticle = 'article',
    tꓺauthor = 'author',
    tꓺbase = 'base',
    tꓺbaseURL = tꓺbase + 'URL',
    tꓺcanonical = 'canonical',
    tꓺcaption = 'caption',
    tꓺcategory = 'category',
    tꓺcolor = 'color',
    tꓺcontent = 'content',
    tꓺමcontext = '@context',
    tꓺCorporation = 'Corporation',
    tꓺfounder = 'founder',
    tꓺfounderImg = tꓺfounder + 'Img',
    tꓺfoundingDate = 'foundingDate',
    tꓺgenre = 'genre',
    tꓺමgraph = '@graph',
    tꓺcharset = 'charset',
    tꓺdangerouslySetInnerHTML = 'dangerouslySetInnerHTML',
    tꓺdataᱼkey = 'data-key',
    tꓺdate = 'date',
    tꓺdatePublished = tꓺdate + 'Published',
    tꓺdateModified = tꓺdate + 'Modified',
    tꓺdescription = 'description',
    tꓺheadline = 'headline',
    tꓺheight = 'height',
    tꓺhref = 'href',
    tꓺhttpsꓽⳇⳇ = 'https://',
    tꓺicon = 'icon',
    tꓺappleTouchIcon = 'appleTouchIcon',
    tꓺappleᱼtouchᱼicon = 'apple-touch-' + tꓺicon,
    tꓺ__html = '__html',
    tꓺhumans = 'humans',
    tꓺImageObject = 'ImageObject',
    tꓺid = 'id',
    tꓺමid = '@' + tꓺid,
    tꓺimage = 'image',
    tꓺimageⳇpng = tꓺimage + '/png',
    tꓺimageⳇsvg = tꓺimage + '/svg+xml',
    tꓺinLanguage = 'inLanguage',
    tꓺisPartOf = 'isPartOf',
    tꓺjobTitle = 'jobTitle',
    tꓺkeywords = 'keywords',
    tꓺlegalName = 'legalName',
    tꓺlink = 'link',
    tꓺlocale = 'locale',
    tꓺlogo = 'logo',
    tꓺmanifest = 'manifest',
    tꓺmeta = 'meta',
    tꓺmedia = 'media',
    tꓺmodule = 'module',
    tꓺname = 'name',
    tꓺnumberOfEmployees = 'numberOfEmployees',
    tꓺogꓽ = 'og:',
    tꓺogArticle = 'ogArticle',
    tꓺogꓽarticleꓽ = tꓺogꓽ + tꓺarticle + ':',
    tꓺogArticleAuthor = tꓺogArticle + 'Author',
    tꓺogArticlePublishedTime = tꓺogArticle + 'PublishedTime',
    tꓺogArticleModifiedTime = tꓺogArticle + 'ModifiedTime',
    tꓺogArticleSection = tꓺogArticle + 'Section',
    tꓺogArticleTag = tꓺogArticle + 'Tag',
    tꓺogLocale = 'ogLocale',
    tꓺogSiteName = 'ogSiteName',
    tꓺogType = 'ogType',
    tꓺogTitle = 'ogTitle',
    tꓺogSuffixedTitle = 'ogSuffixedTitle',
    tꓺogDescription = 'ogDescription',
    tꓺogCategory = 'ogCategory',
    tꓺogTags = 'ogTags',
    tꓺogURL = 'ogURL',
    tꓺogImage = 'ogImage',
    tꓺogImageWidth = tꓺogImage + 'Width',
    tꓺogImageHeight = tꓺogImage + 'Height',
    tꓺOrganization = 'Organization',
    tꓺparentOrganization = 'parent' + tꓺOrganization,
    tꓺsubOrganization = 'sub' + tꓺOrganization,
    tꓺpage = 'page',
    tꓺpageAuthor = tꓺpage + 'Author',
    tꓺpageAuthorImg = tꓺpageAuthor + 'Img',
    tꓺpagePrimaryImg = tꓺpage + 'PrimaryImg',
    tꓺPerson = 'Person',
    tꓺpostalCode = 'postalCode',
    tꓺPostalAddress = 'PostalAddress',
    tꓺpreactISOData = 'preactISOData',
    tꓺprefetch = 'prefetch',
    tꓺdnsPrefetch = 'dns-' + tꓺprefetch,
    tꓺprefetchWorkers = tꓺprefetch + 'Workers',
    tꓺprimaryImageOfPage = 'primaryImageOfPage',
    tꓺproperty = 'property',
    tꓺpublisher = 'publisher',
    tꓺpublishTime = 'publishTime',
    tꓺlastModifiedTime = 'lastModifiedTime',
    tꓺtextⳇplain = 'text/plain',
    tꓺtheme = 'theme',
    tꓺthemeColor = 'themeColor',
    tꓺthemeᱼcolor = tꓺtheme + '-' + tꓺcolor,
    tꓺtime = 'time',
    tꓺpublished_time = 'published_' + tꓺtime,
    tꓺmodified_time = 'modified_' + tꓺtime,
    tꓺrel = 'rel',
    tꓺrobots = 'robots',
    tꓺsameAs = 'sameAs',
    tꓺsection = 'section',
    tꓺscript = 'script',
    tꓺsite = 'site',
    tꓺsiteName = 'siteName',
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
    tꓺtag = 'tag',
    tꓺtags = 'tags',
    tꓺtitle = 'title',
    tꓺtitleSuffix = 'titleSuffix',
    tꓺsuffixedTitle = 'suffixedTitle',
    tꓺtype = 'type',
    tꓺමtype = '@' + tꓺtype,
    tꓺurl = 'url',
    tꓺvꓺundefined = undefined,
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
const immutableStateKeys = [tꓺcharset, tꓺviewport, tꓺbaseURL, tꓺscriptBundle] as const;
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

        const isSSR = $env.isSSR(),
            isC10n = $env.isC10n(),
            isLocalVite = $env.isLocalVite();

        // Acquires app’s brand from environment var.

        const brand = $env.get('APP_BRAND') as $type.Brand,
            brandꓺogImage = brand.ogImage;

        // Gathers state from various contexts.

        const { state: locationState } = $preact.useLocation(),
            { state: dataState, ...data } = $preact.useData(),
            { state: htmlState } = $preact.useHTML();

        // Initializes local variables.

        const { children } = this.props, // Current children.
            actualState = this.state; // Current actual state.
        let state: State; // Populated below w/ computed state.

        // Updates instance / cross-references.

        if (dataState.head.instance !== this) {
            dataState.head.instance = this; // Updates `<Head>` instance reference in real-time.
            this.forceDataUpdate = data.forceUpdate; // Allow us to force a `<Data>` update from `<Head>`.
        }
        // Memoizes computed state.

        state = this.computedState = getComputedState(actualState);

        // Memoizes vNodes for all keyed & unkeyed children.

        const childVNodes = $preact.useMemo((): ChildVNodes => {
            const h = $preact.h;
            const {
                charset,
                themeColor,
                viewport,
                //
                robots,
                canonical,
                //
                suffixedTitle,
                description,
                tags,
                //
                author,
                publishTime,
                lastModifiedTime,
                //
                humans,
                manifest,
                //
                svgIcon,
                pngIcon,
                //
                ogSiteName,
                ogType,
                ogSuffixedTitle,
                ogDescription,
                ogCategory,
                ogTags,
                ogURL,
                ogImage,
                //
                scriptBundle,
                styleBundle,
                //
                append,
            } = state;
            const { baseURL } = locationState;
            const authorꓺname = $is.person(author) ? author.name : author;

            const vNodes: { [x: string]: $preact.VNode } = {
                [tꓺcharset]: h(tꓺmeta, { [tꓺcharset]: charset }),
                [tꓺbaseURL]: h(tꓺbase, { [tꓺhref]: baseURL.toString() }),

                [tꓺthemeColor]: h(tꓺmeta, { [tꓺname]: tꓺthemeᱼcolor, [tꓺcontent]: themeColor }),
                [tꓺviewport]: h(tꓺmeta, { [tꓺname]: tꓺviewport, [tꓺcontent]: viewport }),

                ...(robots ? { [tꓺrobots]: h(tꓺmeta, { [tꓺname]: tꓺrobots, [tꓺcontent]: robots }) } : {}),
                [tꓺcanonical]: h(tꓺlink, { [tꓺrel]: tꓺcanonical, [tꓺhref]: canonical }),

                [tꓺtitle]: h(tꓺtitle, {}, suffixedTitle),
                [tꓺdescription]: h(tꓺmeta, { [tꓺname]: tꓺdescription, [tꓺcontent]: description }),
                ...(tags.length ? { [tꓺkeywords]: h(tꓺmeta, { [tꓺname]: tꓺkeywords, [tꓺcontent]: tags.join(', ') }) } : {}),
                ...(authorꓺname ? { [tꓺauthor]: h(tꓺmeta, { [tꓺname]: tꓺauthor, [tꓺcontent]: authorꓺname }) } : {}),

                [tꓺhumans]: h(tꓺlink, { [tꓺrel]: tꓺauthor, [tꓺtype]: tꓺtextⳇplain, [tꓺhref]: humans }),
                ...(isLocalVite ? {} : { [tꓺmanifest]: h(tꓺlink, { [tꓺrel]: tꓺmanifest, [tꓺhref]: manifest }) }),

                [tꓺsvgIcon]: h(tꓺlink, { [tꓺrel]: tꓺicon, [tꓺtype]: tꓺimageⳇsvg, [tꓺsizes]: tꓺany, [tꓺhref]: svgIcon }),
                [tꓺpngIcon]: h(tꓺlink, { [tꓺrel]: tꓺicon, [tꓺtype]: tꓺimageⳇpng, [tꓺsizes]: tꓺany, [tꓺhref]: pngIcon }),
                [tꓺappleTouchIcon]: h(tꓺlink, { [tꓺrel]: tꓺappleᱼtouchᱼicon, [tꓺtype]: tꓺimageⳇpng, [tꓺsizes]: tꓺany, [tꓺhref]: pngIcon }),

                // Note: `og:` prefixed meta tags do not require a `prefix="og: ..."` attribute on `<head>`,
                // because `og:` is baked into RDFa already; {@see https://www.w3.org/2011/rdfa-context/rdfa-1.1}.

                [tꓺogLocale]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺlocale, [tꓺcontent]: htmlState.lang.replaceAll('-', '_') }),
                [tꓺogSiteName]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺsite + '_' + tꓺname, [tꓺcontent]: ogSiteName }),

                [tꓺogType]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺtype, [tꓺcontent]: ogType }),
                [tꓺogTitle]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺtitle, [tꓺcontent]: ogSuffixedTitle }),
                [tꓺogDescription]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺdescription, [tꓺcontent]: ogDescription }),
                [tꓺogURL]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺurl, [tꓺcontent]: ogURL }),

                [tꓺogImage]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺimage, [tꓺcontent]: ogImage }),
                [tꓺogImageWidth]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺimage + ':' + tꓺwidth, [tꓺcontent]: String(brandꓺogImage.width) }),
                [tꓺogImageHeight]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽ + tꓺimage + ':' + tꓺheight, [tꓺcontent]: String(brandꓺogImage.height) }),

                ...(tꓺarticle === ogType // {@see https://ogp.me/#type_article}.
                    ? {
                          ...(authorꓺname ? { [tꓺogArticleAuthor]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽarticleꓽ + tꓺauthor, [tꓺcontent]: authorꓺname }) } : {}), // prettier-ignore
                          ...(publishTime ? { [tꓺogArticlePublishedTime]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽarticleꓽ + tꓺpublished_time, [tꓺcontent]: publishTime?.toISO() || '' }) } : {}), // prettier-ignore
                          ...(lastModifiedTime ? { [tꓺogArticleModifiedTime]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽarticleꓽ + tꓺmodified_time, [tꓺcontent]: lastModifiedTime?.toISO() || '' }) } : {}), // prettier-ignore
                          ...(ogCategory ? { [tꓺogArticleSection]: h(tꓺmeta, { [tꓺproperty]: tꓺogꓽarticleꓽ + tꓺsection, [tꓺcontent]: ogCategory }) } : {}), // prettier-ignore
                          ...Object.fromEntries(ogTags.map((tag, i) => [tꓺogArticleTag + String(i), h(tꓺmeta, { [tꓺproperty]: tꓺogꓽarticleꓽ + tꓺtag, [tꓺcontent]: tag })])), // prettier-ignore
                      }
                    : {}),
                ...(scriptBundle && isC10n ? { [tꓺprefetchWorkers]: h(tꓺlink, { [tꓺrel]: tꓺdnsPrefetch, [tꓺhref]: tꓺhttpsꓽⳇⳇ + 'workers.hop.gdn/' }) } : {}), // prettier-ignore

                ...(styleBundle ? { [tꓺstyleBundle]: h(tꓺlink, { [tꓺrel]: tꓺstylesheet, [tꓺhref]: styleBundle, [tꓺmedia]: tꓺall }) } : {}), // prettier-ignore
                ...(scriptBundle && isSSR ? { [tꓺpreactISOData]: h(tꓺscript, { [tꓺid]: 'preact-iso-data', [tꓺdangerouslySetInnerHTML]: { [tꓺ__html]: dataGlobalToScriptCode(dataState) } }) } : {}), // prettier-ignore
                ...(scriptBundle ? { [tꓺscriptBundle]: h(tꓺscript, { [tꓺtype]: tꓺmodule, [tꓺsrc]: scriptBundle }) } : {}), // prettier-ignore

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
                    else if (isLocalVite && 'SCRIPT' === node.tagName && '/@vite/client' === node.getAttribute('src')) {
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
// Misc exports.

/**
 * Gets computed `<Head>` state.
 *
 * This variant is slightly different than our internal {@see getComputedState()}. It doesn’t utilize current layout
 * state, because this particular utility is primarily intended to be used in; e.g., archive views that need to compute
 * state while iterating arrays or maps of content that define frontMatter.
 *
 * Please be cautious about the context in which this is used. It leverages preact hooks and contexts, and therefore it
 * must only be used inside a component’s render method, at the top-level, in order to maintain hook index integrity.
 *
 * @param   head Actual; i.e., raw state.
 *
 * @returns      Fully computed state.
 */
export const computeHead = (head: ActualState): State => {
    return getComputedState(head, { useLayoutState: false });
};

// ---
// Misc utilities.

/**
 * Gets computed `<Head>` state.
 *
 * @param   head Actual; i.e., raw state.
 *
 * @returns      Fully computed state.
 */
const getComputedState = (head: ActualState, options?: GetComputedStateOptions): State => {
    // Resolves options.

    const defaultOpts = { useLayoutState: true },
        opts = $obj.defaults({}, options || {}, defaultOpts) as Required<GetComputedStateOptions>,
        { useLayoutState } = opts;

    // Checks environment.

    const isLocalVite = $env.isLocalVite();

    // Acquires app’s brand from environment var.

    const brand = $env.get('APP_BRAND') as $type.Brand,
        brandꓺtheme = brand.theme,
        brandꓺicon = brand.icon,
        brandꓺogImage = brand.ogImage;

    // Gathers state from various contexts.

    const { state: locationState } = $preact.useLocation(),
        { state: dataState } = $preact.useData(),
        { state: layoutState } = $preact.useLayout();

    // Memoizes computed state.

    return $preact.useMemo((): State => {
        let {
            charset,
            themeColor,
            viewport,
            //
            robots,
            canonical,
            //
            siteName,
            title,
            titleSuffix,
            description,
            category,
            tags,
            image,
            //
            author,
            publishTime,
            lastModifiedTime,
            //
            humans,
            manifest,
            //
            pngIcon,
            svgIcon,
            //
            ogSiteName,
            ogType,
            ogTitle,
            ogDescription,
            ogCategory,
            ogTags,
            ogURL,
            ogImage,
            //
            styleBundle,
            scriptBundle,
        } = {
            ...(useLayoutState ? { ...layoutState?.head } : {}),
            ...head, // Actual `<Head>` state.
        };
        // Extracts data/utilities from location state.
        const { url, canonicalURL, fromBase } = locationState;

        // Resolves titles for suffixed variants below.
        title = title || ogTitle || url.hostname; // No port.
        ogTitle = ogTitle || title; // Variant for open graph tag.

        let suffixedTitle = title, // Initializes suffixed titles.
            ogSuffixedTitle = ogTitle; // Uses `ogTitle` variant.

        if (titleSuffix /* String or `true`. If truthy, it converts to a string here. */) {
            if (!$is.string(titleSuffix)) titleSuffix = ' • ' + (siteName || ogSiteName || brand.name);
            (suffixedTitle += titleSuffix), (ogSuffixedTitle += titleSuffix);
        }
        let defaultDescription = 'Why is the rum gone?';
        let defaultStyleBundle, defaultScriptBundle; // When possible.

        if (!styleBundle && '' !== styleBundle && isLocalVite) {
            defaultStyleBundle = './index.css'; // For vite dev server.
        }
        if (!scriptBundle && '' !== scriptBundle && isLocalVite) {
            defaultScriptBundle = './index.tsx'; // For vite dev server.
        }
        const asAbsoluteURLString = (parseable: $type.URL | string): string => {
            return $url.isAbsolute((parseable = parseable.toString())) ? parseable : fromBase(parseable);
        };
        return {
            ...(useLayoutState ? { ...layoutState?.head } : {}),
            ...head, // Actual `<Head>` state.

            [tꓺcharset]: charset || 'utf-8',
            [tꓺthemeColor]: themeColor || brandꓺtheme.color,
            [tꓺviewport]: viewport || 'width=device-width, initial-scale=1, minimum-scale=1',

            [tꓺrobots]: robots || '', // Default is empty string.
            [tꓺcanonical]: asAbsoluteURLString(canonical || canonicalURL),

            [tꓺsiteName]: siteName || brand.name || url.hostname,
            [tꓺtitle]: title, // Computed above.
            [tꓺtitleSuffix]: titleSuffix || '',
            [tꓺsuffixedTitle]: suffixedTitle,
            [tꓺdescription]: description || defaultDescription,
            [tꓺcategory]: category || ogCategory || '',
            [tꓺtags]: tags || ogTags || [],
            [tꓺimage]: asAbsoluteURLString(image || ogImage || brandꓺogImage.png),

            [tꓺauthor]: $is.string(author) ? $fn.try(() => $person.get(author as string), tꓺvꓺundefined)() : author,
            [tꓺpublishTime]: publishTime ? $time.parse(publishTime) : tꓺvꓺundefined,
            [tꓺlastModifiedTime]: lastModifiedTime ? $time.parse(lastModifiedTime) : tꓺvꓺundefined,

            [tꓺhumans]: humans || './' + tꓺhumans + '.txt',
            [tꓺmanifest]: manifest || './' + tꓺmanifest + '.json',

            [tꓺsvgIcon]: asAbsoluteURLString(svgIcon || brandꓺicon.svg),
            [tꓺpngIcon]: asAbsoluteURLString(pngIcon || brandꓺicon.png),

            [tꓺogSiteName]: ogSiteName || siteName || brand.name || url.hostname,
            [tꓺogType]: ogType || tꓺarticle,
            [tꓺogTitle]: ogTitle, // Computed above.
            [tꓺogSuffixedTitle]: ogSuffixedTitle,
            [tꓺogDescription]: ogDescription || description || defaultDescription,
            [tꓺogCategory]: ogCategory || category || '',
            [tꓺogTags]: ogTags || tags || [],
            [tꓺogURL]: asAbsoluteURLString(ogURL || canonical || canonicalURL),
            [tꓺogImage]: asAbsoluteURLString(ogImage || image || brandꓺogImage.png),

            // These URLs are potentially relative, and that’s as it should be. They don’t have to be absolute.
            [tꓺstyleBundle]: ('' === styleBundle ? '' : styleBundle || dataState.head.styleBundle || defaultStyleBundle || '').toString(),
            [tꓺscriptBundle]: ('' === scriptBundle ? '' : scriptBundle || dataState.head.scriptBundle || defaultScriptBundle || '').toString(),

            // Concatenated, not merged, as they are potentially arrays.
            [tꓺappend]: ((useLayoutState && layoutState?.head.append) || []).concat(head.append || []),
        };
    }, [useLayoutState, isLocalVite, brand, locationState, dataState, layoutState, head]);
};

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
    // Extracts brand and state from options.
    const { brand, htmlState, state } = options;

    // Extracts brand images.
    const brandꓺlogo = brand.logo;
    const brandꓺlogoꓺonLightBg = brandꓺlogo.onLightBg;
    const brandꓺogImage = brand.ogImage;

    // Organization graph(s).
    // {@see https://schema.org/Corporation}.
    // {@see https://schema.org/Organization}.

    const orgGraphs = []; // Initialize.
    (() => {
        let currentOrg = brand.org,
            previousOrg = undefined;

        while (currentOrg && currentOrg !== previousOrg) {
            // Extracts current org data.
            const currentOrgꓺfounder = currentOrg.founder,
                currentOrgꓺfounderꓺgravatar = currentOrgꓺfounder.gravatar,
                currentOrgꓺaddress = currentOrg.address,
                currentOrgꓺlogo = currentOrg.logo,
                currentOrgꓺlogoꓺonLightBg = currentOrgꓺlogo.onLightBg;

            orgGraphs.unshift({
                [tꓺමtype]: 'corp' === currentOrg.type ? tꓺCorporation : tꓺOrganization,
                [tꓺමid]: currentOrg.url + '#' + currentOrg.type,

                [tꓺurl]: currentOrg.url,
                [tꓺname]: currentOrg.name,
                [tꓺlegalName]: currentOrg.legalName,
                [tꓺaddress]: {
                    [tꓺමtype]: tꓺPostalAddress,
                    [tꓺමid]: currentOrg.url + '#' + tꓺaddr,

                    [tꓺstreetAddress]: currentOrgꓺaddress.street,
                    [tꓺaddressLocality]: currentOrgꓺaddress.city,
                    [tꓺaddressRegion]: currentOrgꓺaddress.state,
                    [tꓺpostalCode]: currentOrgꓺaddress.zip,
                    [tꓺaddressCountry]: currentOrgꓺaddress.country,
                },
                [tꓺfounder]: {
                    [tꓺමtype]: tꓺPerson,
                    [tꓺමid]: currentOrgꓺfounder.url + '#' + tꓺfounder,

                    [tꓺname]: currentOrgꓺfounder.name,
                    [tꓺjobTitle]: currentOrgꓺfounder.headline,
                    [tꓺdescription]: currentOrgꓺfounder.description,
                    [tꓺurl]: currentOrgꓺfounder.url,
                    [tꓺimage]: {
                        [tꓺමtype]: tꓺImageObject,
                        [tꓺමid]: currentOrgꓺfounder.url + '#' + tꓺfounderImg,

                        [tꓺurl]: currentOrgꓺfounderꓺgravatar.url,
                        [tꓺwidth]: currentOrgꓺfounderꓺgravatar.width,
                        [tꓺheight]: currentOrgꓺfounderꓺgravatar.height,
                        [tꓺcaption]: currentOrgꓺfounder.name,
                    },
                },
                [tꓺfoundingDate]: currentOrg.foundingDate,
                [tꓺnumberOfEmployees]: currentOrg.numberOfEmployees,

                [tꓺslogan]: currentOrg.slogan,
                [tꓺdescription]: currentOrg.description,
                [tꓺlogo]: {
                    [tꓺමtype]: tꓺImageObject,
                    [tꓺමid]: currentOrg.url + '#' + tꓺlogo,

                    [tꓺurl]: currentOrgꓺlogoꓺonLightBg.png,
                    [tꓺwidth]: currentOrgꓺlogo.width,
                    [tꓺheight]: currentOrgꓺlogo.height,
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

            [tꓺurl]: brandꓺlogoꓺonLightBg.png,
            [tꓺwidth]: brandꓺlogo.width,
            [tꓺheight]: brandꓺlogo.height,
            [tꓺcaption]: brand.name,
        },
        [tꓺsameAs]: Object.values(brand.socialProfiles),
        ...(orgGraphs.length ? { [tꓺpublisher]: { [tꓺමid]: orgGraphs.at(-1)?.[tꓺමid] } } : {}),
    };
    // WebPage graph.
    // {@see https://schema.org/WebPage}.

    const pageꓺogURL = state.ogURL,
        pageꓺogTitle = state.ogTitle,
        pageꓺogSuffixedTitle = state.ogSuffixedTitle,
        pageꓺogDescription = state.ogDescription,
        pageꓺogCategory = state.ogCategory,
        pageꓺogTags = state.ogTags,
        pageꓺogImage = state.ogImage,
        pageꓺauthor = state.author,
        pageꓺauthorꓺgravatar = pageꓺauthor?.gravatar;

    const pageGraph = $obj.mergeDeep(
        {
            [tꓺමtype]: tꓺWebPage,
            [tꓺමid]: pageꓺogURL + '#' + tꓺpage,

            [tꓺurl]: pageꓺogURL,
            [tꓺname]: pageꓺogTitle,
            [tꓺheadline]: pageꓺogSuffixedTitle,
            [tꓺdescription]: pageꓺogDescription,
            [tꓺgenre]: pageꓺogCategory,
            [tꓺkeywords]: pageꓺogTags.join(', '),

            [tꓺinLanguage]: htmlState.lang,
            [tꓺauthor]: [
                { [tꓺමid]: (siteGraph as $type.Object)[tꓺමid] },
                ...(pageꓺauthor && pageꓺauthorꓺgravatar ? [{
                        [tꓺමtype]: tꓺPerson,
                        [tꓺමid]: pageꓺauthor.url + '#' + tꓺpageAuthor,

                        [tꓺname]: pageꓺauthor.name,
                        [tꓺjobTitle]: pageꓺauthor.headline,
                        [tꓺdescription]: pageꓺauthor.description,
                        [tꓺurl]: pageꓺauthor.url,
                        [tꓺimage]: {
                            [tꓺමtype]: tꓺImageObject,
                            [tꓺමid]: pageꓺauthor.url + '#' + tꓺpageAuthorImg,
                            [tꓺurl]: pageꓺauthorꓺgravatar.url,
                            [tꓺwidth]: pageꓺauthorꓺgravatar.width,
                            [tꓺheight]: pageꓺauthorꓺgravatar.height,
                            [tꓺcaption]: pageꓺauthor.name,
                        },
                }] : []), // prettier-ignore
            ],
            [tꓺdatePublished]: state.publishTime?.toISO() || '',
            [tꓺdateModified]: state.lastModifiedTime?.toISO() || '',

            ...(pageꓺogImage
                ? {
                      [tꓺprimaryImageOfPage]: {
                          [tꓺමtype]: tꓺImageObject,
                          [tꓺමid]: pageꓺogURL + '#' + tꓺpagePrimaryImg,

                          [tꓺurl]: pageꓺogImage,
                          [tꓺwidth]: brandꓺogImage.width,
                          [tꓺheight]: brandꓺogImage.height,
                          [tꓺcaption]: pageꓺogDescription,
                      },
                      [tꓺimage]: [{ [tꓺමid]: pageꓺogURL + '#' + tꓺpagePrimaryImg }],
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
