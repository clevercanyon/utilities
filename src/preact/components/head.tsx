/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $env, $is, $json, $obj, $preact, type $type } from '../../index.ts';
import { globalToScriptCode as dataGlobalToScriptCode, type State as DataState } from './data.tsx';

/**
 * Defines types.
 */
export type State = $preact.State<
    Partial<$preact.JSX.IntrinsicElements['head']> & {
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
export type Props = $preact.Props<PartialState>;

export type ContextProps = $preact.Context<{
    state: State;
    updateState: $preact.Dispatch<PartialState>;
}>;
type StructuredDataProps = $preact.Props<{ brand: $type.Brand; headState: State }>;

/**
 * Defines context.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const Context = createContext({} as ContextProps);

/**
 * Produces initial state.
 *
 * @param   dataState <Data> state.
 * @param   props     Component props.
 *
 * @returns           Initialized state.
 */
const initialState = (dataState: DataState, props: Props = {}): State => {
    return $obj.mergeDeep({}, dataState.head, $preact.omitProps(props, ['children'])) as unknown as State;
};

/**
 * Reduces state updates.
 *
 * @param   state   Current state.
 * @param   updates State updates.
 *
 * @returns         New state, if changed; else old state.
 */
const reduceState = (state: State, updates: PartialState): State => {
    return $obj.updateDeep(state, updates) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Head(props: Props = {}): $preact.VNode<Props> {
    const brand = $env.get('APP_BRAND') as $type.Brand;
    if (!brand) throw new Error('Missing brand.');

    const { state: locState } = $preact.useLocation();
    if (!locState) throw new Error('Missing location state.');

    const { state: dataState } = $preact.useData();
    if (!dataState) throw new Error('Missing data state.');

    // Props from current `<Data>` state will only have an impact on 'initial' `<Head>` state.
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(dataState, props));

    const headState = $preact.useMemo((): State => {
        let title = state.title || locState.url.hostname;
        const defaultDescription = 'Take the tiger by the tail.';

        if (state.titleSuffix /* String or `true` to enable. */) {
            if ($is.string(state.titleSuffix)) {
                title += state.titleSuffix;
            } else if (state.siteName || brand.name) {
                title += ' • ' + (state.siteName || brand.name);
            }
        }
        // We include local test fallbacks for Vite’s dev server.
        let defaultMainStyleBundle, defaultMainScriptBundle;

        if (!state.mainStyleBundle && '' !== state.mainStyleBundle && $env.isLocalWeb()) {
            defaultMainStyleBundle = './index.scss';
        }
        if (!state.mainScriptBundle && '' !== state.mainScriptBundle && $env.isLocalWeb()) {
            defaultMainScriptBundle = './index.tsx';
        }
        return {
            ...state,

            charset: state.charset || 'utf-8',
            viewport: state.viewport || 'width=device-width, initial-scale=1.0, minimum-scale=1.0',

            title, // See title generation above.
            description: state.description || defaultDescription,
            canonical: state.canonical || locState.canonicalURL,

            pngIcon: state.pngIcon || locState.fromBase('./assets/icon.png'),
            svgIcon: state.svgIcon || locState.fromBase('./assets/icon.svg'),

            ogSiteName: state.ogSiteName || state.siteName || brand.name || locState.url.hostname,
            ogType: state.ogType || 'website',
            ogTitle: state.ogTitle || title,
            ogDescription: state.ogDescription || state.description || defaultDescription,
            ogURL: state.ogURL || state.canonical || locState.canonicalURL,
            ogImage: state.ogImage || locState.fromBase('./assets/og-image.png'),

            mainStyleBundle: state.mainStyleBundle || defaultMainStyleBundle,
            mainScriptBundle: state.mainScriptBundle || defaultMainScriptBundle,
        };
    }, [locState, dataState, state]);

    return (
        <Context.Provider value={{ state: headState, updateState }}>
            <head
                {...{
                    ...$preact.omitProps(headState, [
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

                        'mainStyleBundle',
                        'mainScriptBundle',
                    ]),
                    class: $preact.classes(headState),
                }}
            >
                {headState.charset && <meta charSet={headState.charset} />}
                {locState.baseURL && <base href={locState.baseURL.toString()} />}
                {headState.viewport && <meta name='viewport' content={headState.viewport} />}

                {headState.robots && <meta name='robots' content={headState.robots} />}
                {headState.canonical && <link rel='canonical' href={headState.canonical.toString()} />}

                {headState.title && <title>{headState.title}</title>}
                {headState.description && <meta name='description' content={headState.description} />}
                {headState.author && <meta name='author' content={headState.author} />}

                {headState.svgIcon && <link rel='icon' type='image/svg+xml' sizes='any' href={headState.svgIcon.toString()} />}
                {headState.pngIcon && <link rel='icon' type='image/png' sizes='any' href={headState.pngIcon.toString()} />}
                {headState.pngIcon && <link rel='apple-touch-icon' type='image/png' sizes='any' href={headState.pngIcon.toString()} />}

                {headState.ogSiteName && headState.ogType && headState.ogTitle && headState.ogDescription && headState.ogURL && headState.ogImage && (
                    <>
                        <meta property='og:site_name' content={headState.ogSiteName} />
                        <meta property='og:type' content={headState.ogType} />
                        <meta property='og:title' content={headState.ogTitle} />
                        <meta property='og:description' content={headState.ogDescription} />
                        <meta property='og:url' content={headState.ogURL.toString()} />
                        <meta property='og:image' content={headState.ogImage.toString()} />
                    </>
                )}
                {headState.mainStyleBundle && <link rel='stylesheet' href={headState.mainStyleBundle.toString()} media='all' />}
                {headState.mainScriptBundle && (!$env.isWeb() || $env.isTest()) && (
                    <script id='preact-iso-data' dangerouslySetInnerHTML={{ __html: dataGlobalToScriptCode() }}></script>
                )}
                {headState.mainScriptBundle && <script type='module' src={headState.mainScriptBundle.toString()}></script>}

                {props.children}

                <StructuredData {...{ brand, headState }} />
            </head>
        </Context.Provider>
    );
}

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @see https://schema.org/ -- for details regarding graph entries.
 * @see https://o5p.me/bgYQaB -- for details from Google regarding what they need, and why.
 */
const StructuredData = (props: StructuredDataProps): $preact.VNode<StructuredDataProps> => {
    const { state: htmlState } = $preact.useHTML();
    if (!htmlState) throw new Error('Missing HTML state.');

    const { brand, headState } = props;
    if (!headState.ogURL) throw new Error('Missing ogURL.');

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

    const pageURL = headState.ogURL.toString();
    const pageTitle = (headState.ogTitle || '').split(' • ')[0];
    const pageDescription = headState.ogDescription || '';

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
                ...(headState.author ? [{ '@type': 'Person', name: headState.author }] : []),
            ],
            datePublished: headState.publishTime?.toString() || '',
            dateModified: headState.lastModifiedTime?.toString() || '',

            ...(headState.ogImage
                ? {
                      primaryImageOfPage: {
                          '@type': 'ImageObject',
                          '@id': pageURL + '#primaryImg',

                          width: brand.ogImage.width,
                          height: brand.ogImage.height,
                          url: headState.ogImage.toString(),
                          caption: headState.ogDescription || '',
                      },
                      image: [{ '@id': pageURL + '#primaryImg' }],
                  }
                : {}),
            about: { '@id': siteGraph['@id'] },
            isPartOf: { '@id': siteGraph['@id'] },
            ...(orgGraphs.length ? { publisher: { '@id': orgGraphs.at(-1)?.['@id'] } } : {}),
        },
        headState.structuredData, // Allows `<Head>` to merge customizations.
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
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useHead = (): ContextProps => $preact.useContext(Context);
