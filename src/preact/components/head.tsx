/**
 * Preact component.
 */

import '../../resources/init.ts';

import { $env, $is, $json, $obj, $preact, type $type } from '../../index.ts';
import { globalToScriptCode as dataGlobalToScriptCode } from './data.tsx';

/**
 * Defines types.
 */
export type State = $preact.State<
    Partial<$preact.JSX.IntrinsicElements['head']> & {
        // State initialized yet?
        initialized?: boolean;

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

        mainStyleBundle?: $type.URL | string;
        mainScriptBundle?: $type.URL | string;
    } & { [x in $preact.ClassPropVariants]?: $preact.Classes }
>;
export type PartialState = $preact.State<Partial<State>>;
export type PartialStateUpdates = Omit<PartialState, 'initialized'>;

export type Props = $preact.Props<PartialState>;

export type ContextProps = $preact.Context<{
    state: State;
    updateState: $preact.Dispatch<PartialStateUpdates>;
}>;
type StructuredDataꓺHelperProps = $preact.Props<{ brand: $type.Brand; state: State }>;

/**
 * Produces initial state.
 *
 * @param   dataHeadState Head state.
 * @param   props         Component props.
 *
 * @returns               Initialized state.
 *
 * @note `<Data>` props contains some initial passable `<Head>` component props.
 *       These props only have an impact on initial `<Head>` state; {@see Data.PassableHeadProps}.
 *       e.g., `mainStyleBundle`, `mainScriptBundle`.
 */
const initialState = (dataHeadState: PartialState, props: Props = {}): State => {
    return $obj.mergeDeep({ initialized: true }, dataHeadState, $preact.omitProps(props, ['children'])) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note `<Head>` state is stored in `<Data>` so it’s available
 *       across all contexts; i.e., at any nested level of the DOM.
 */
export default function Head(props: Props = {}): $preact.VNode<Props> {
    const brand = $env.get('APP_BRAND') as $type.Brand;
    if (!brand) throw new Error('Missing brand.');

    const { state: locState } = $preact.useLocation();
    if (!locState) throw new Error('Missing location state.');

    const { state: dataState, updateState: updateDataState } = $preact.useData();
    if (!dataState) throw new Error('Missing data state.');

    let { head: actualState } = dataState; // `<Data>` holds `<Head>` state.
    if (!actualState.initialized /* If not initialized, do it now, in real-time. */) {
        // Absent a real-time update, SSR fails, as it doesn’t wait for an async update.
        actualState = initialState(actualState, props);
        updateDataState({ head: actualState });
    }
    const state = $preact.useMemo((): State => {
        let title = actualState.title || locState.url.hostname;
        let defaultMainStyleBundle, defaultMainScriptBundle;
        const defaultDescription = 'Take the tiger by the tail.';

        if (!actualState.mainStyleBundle && '' !== actualState.mainStyleBundle) {
            // Local test fallback assumes we are loading with Vite’s dev server.
            defaultMainStyleBundle = $env.isLocalWeb() ? './index.scss' : './index.css';
        }
        if (!actualState.mainScriptBundle && '' !== actualState.mainScriptBundle) {
            // Local test fallback assumes we are loading with Vite’s dev server.
            defaultMainScriptBundle = $env.isLocalWeb() ? './index.tsx' : './index.js';
        }
        if (actualState.titleSuffix /* String or `true` to enable. */) {
            if ($is.string(actualState.titleSuffix)) {
                title += actualState.titleSuffix;
            } else if (actualState.siteName || brand.name) {
                title += ' • ' + (actualState.siteName || brand.name);
            }
        }
        return {
            ...actualState,

            charset: actualState.charset || 'utf-8',
            viewport: actualState.viewport || 'width=device-width, initial-scale=1.0, minimum-scale=1.0',

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

            mainStyleBundle: actualState.mainStyleBundle || defaultMainStyleBundle,
            mainScriptBundle: actualState.mainScriptBundle || defaultMainScriptBundle,
        };
    }, [locState, actualState]);

    return (
        <head
            {...{
                ...$preact.omitProps(state, [
                    'class',
                    'initialized',

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

                    'mainStyleBundle',
                    'mainScriptBundle',
                ]),
                class: $preact.classes(state),
            }}
        >
            {state.charset && <meta charSet={state.charset} />}
            {locState.baseURL && <base href={locState.baseURL.toString()} />}
            {state.viewport && <meta name='viewport' content={state.viewport} />}

            {state.robots && <meta name='robots' content={state.robots} />}
            {state.canonical && <link rel='canonical' href={state.canonical.toString()} />}

            {state.title && <title>{state.title}</title>}
            {state.description && <meta name='description' content={state.description} />}
            {state.author && <meta name='author' content={state.author} />}

            {state.svgIcon && <link rel='icon' type='image/svg+xml' sizes='any' href={state.svgIcon.toString()} />}
            {state.pngIcon && <link rel='icon' type='image/png' sizes='any' href={state.pngIcon.toString()} />}
            {state.pngIcon && <link rel='apple-touch-icon' type='image/png' sizes='any' href={state.pngIcon.toString()} />}

            {state.ogSiteName && state.ogType && state.ogTitle && state.ogDescription && state.ogURL && state.ogImage && (
                <>
                    <meta property='og:site_name' content={state.ogSiteName} />
                    <meta property='og:type' content={state.ogType} />
                    <meta property='og:title' content={state.ogTitle} />
                    <meta property='og:description' content={state.ogDescription} />
                    <meta property='og:url' content={state.ogURL.toString()} />
                    <meta property='og:image' content={state.ogImage.toString()} />
                </>
            )}
            {state.mainStyleBundle && <link rel='stylesheet' href={state.mainStyleBundle.toString()} media='all' />}
            {state.mainScriptBundle && (!$env.isWeb() || $env.isTest()) && <script id='preact-iso-data' dangerouslySetInnerHTML={{ __html: dataGlobalToScriptCode() }}></script>}
            {state.mainScriptBundle && <script type='module' src={state.mainScriptBundle.toString()}></script>}

            {props.children}

            <StructuredDataꓺHelper {...{ brand, state }} />
        </head>
    );
}

/**
 * Helps render component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @see https://schema.org/ -- for details regarding graph entries.
 * @see https://o5p.me/bgYQaB -- for details from Google regarding what they need, and why.
 */
const StructuredDataꓺHelper = (props: StructuredDataꓺHelperProps): $preact.VNode<StructuredDataꓺHelperProps> => {
    const { state: htmlState } = $preact.useHTML();
    if (!htmlState) throw new Error('Missing HTML state.');

    const { brand, state } = props;
    if (!state.ogURL) throw new Error('Missing ogURL.');

    // Organization graph(s).

    const orgGraphs = []; // Initialize.
    let _currentOrg = brand.org; // Initialize.
    let _previousOrg = undefined; // Initialize.

    // {@see https://schema.org/Corporation}.
    // {@see https://schema.org/Organization}.

    while (_currentOrg && _currentOrg !== _previousOrg) {
        orgGraphs.unshift({
            '@type':
                'corp' === _currentOrg.type
                    ? 'Corporation' //
                    : 'Organization',
            '@id': _currentOrg.url + '#' + _currentOrg.type,

            url: _currentOrg.url,
            name: _currentOrg.name,
            legalName: _currentOrg.legalName,
            address: {
                '@type': 'PostalAddress',
                '@id': _currentOrg.url + '#addr',
                streetAddress: _currentOrg.address.street,
                addressLocality: _currentOrg.address.city,
                addressRegion: _currentOrg.address.state,
                postalCode: _currentOrg.address.zip,
                addressCountry: _currentOrg.address.country,
            },
            founder: {
                '@type': 'Person',
                '@id': _currentOrg.founder.website + '#founder',
                name: _currentOrg.founder.name,
                description: _currentOrg.founder.description,
                image: {
                    '@type': 'ImageObject',
                    '@id': _currentOrg.founder.website + '#founderImg',
                    url: _currentOrg.founder.image.url,
                    width: _currentOrg.founder.image.width,
                    height: _currentOrg.founder.image.height,
                    caption: _currentOrg.founder.name,
                },
            },
            foundingDate: _currentOrg.foundingDate,
            numberOfEmployees: _currentOrg.numberOfEmployees,

            slogan: _currentOrg.slogan,
            description: _currentOrg.description,
            logo: {
                '@type': 'ImageObject',
                '@id': _currentOrg.url + '#logo',
                url: _currentOrg.logo.png,
                width: _currentOrg.logo.width,
                height: _currentOrg.logo.height,
                caption: _currentOrg.name,
            },
            image: { '@id': _currentOrg.url + '#logo' },
            sameAs: Object.values(_currentOrg.socialProfiles),

            ...(_previousOrg ? { subOrganization: { '@id': _previousOrg.url + '#' + _previousOrg.type } } : {}),
            ...(_currentOrg.org !== _currentOrg ? { parentOrganization: { '@id': _currentOrg.org.url + '#' + _currentOrg.org.type } } : {}),
        });
        (_previousOrg = _currentOrg), (_currentOrg = _currentOrg.org);
    }
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

            inLanguage: htmlState.lang || 'en',
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
    return <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: $json.stringify(data, { pretty: true }) }}></script>;
};

/**
 * Defines pseudo context hook.
 *
 * @returns Pseudo context props {@see ContextProps}.
 *
 * @note `<Head>` state is stored in `<Data>` so it’s available
 *       across all contexts; i.e., at any nested level of the DOM.
 */
export const useHead = (): ContextProps => {
    const { state: dataState, updateState: updateDataState } = $preact.useData();
    if (!dataState) throw new Error('Missing data state.');

    return {
        state: dataState.head as unknown as ContextProps['state'],
        updateState: (updates: Parameters<ContextProps['updateState']>[0]): ReturnType<ContextProps['updateState']> => {
            updateDataState({ head: $obj.omit(updates, ['initialized']) });
        },
    };
};
