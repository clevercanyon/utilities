/**
 * Preact component.
 */

import { createContext } from 'preact';
import { $env, $obj, $preact, $url, type $type } from '../../index.ts';
import { globalToScriptCode as dataGlobalToScriptCode, type State as DataState } from './data.tsx';

/**
 * Defines types.
 */
export type State = Partial<$preact.JSX.IntrinsicElements['head']> & {
    charset?: string;
    viewport?: string;

    robots?: string;
    canonical?: $type.URL | string;
    siteName?: string;

    title?: string;
    titleSuffix?: string;
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
} & { [x in $preact.ClassPropVariants]?: $preact.Classes };

export type PartialState = Partial<State>;
export type Props = $preact.Props<PartialState>;

export type ContextProps = {
    readonly state: State;
    readonly updateState: $preact.Dispatch<PartialState>;
};

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
    return $obj.mergeDeep(dataState.head, $preact.omitProps(props, ['children'])) as unknown as State;
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
    const { state: locState } = $preact.useLocation();
    if (!locState) throw new Error('Missing location state.');

    const { state: dataState } = $preact.useData();
    if (!dataState) throw new Error('Missing data state.');

    // Props from current `<Data>` state will only have an impact on 'initial' `<Head>` state.
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(dataState, props));

    const headState = $preact.useMemo((): State => {
        let title = state.title || locState.url.hostname;
        const defaultDescription = 'Take the tiger by the tail.';

        if ('' !== state.titleSuffix) {
            if (state.titleSuffix || state.siteName) {
                title += ' • ' + ((state.titleSuffix || state.siteName) as string);
            }
        }
        // We include local testing fallbacks here for Vite’s dev server.
        let defaultMainStyleBundle, defaultMainScriptBundle; // Initialize.

        if (!state.mainStyleBundle && '' !== state.mainStyleBundle && $env.isLocalWeb()) {
            defaultMainStyleBundle = $url.pathFromAppBase('/index.scss');
        }
        if (!state.mainScriptBundle && '' !== state.mainScriptBundle && $env.isLocalWeb()) {
            defaultMainScriptBundle = $url.pathFromAppBase('/index.tsx');
        }
        return {
            ...state,

            charset: state.charset || 'utf-8',
            viewport: state.viewport || 'width=device-width, initial-scale=1.0, minimum-scale=1.0',

            title, // See title generation above.
            description: state.description || defaultDescription,
            canonical: state.canonical || locState.canonicalURL,

            pngIcon: state.pngIcon || $url.fromAppBase('/assets/icon.png'),
            svgIcon: state.svgIcon || $url.fromAppBase('/assets/icon.svg'),

            ogSiteName: state.ogSiteName || state.siteName || locState.url.hostname,
            ogType: state.ogType || 'website',
            ogTitle: state.ogTitle || title,
            ogDescription: state.ogDescription || state.description || defaultDescription,
            ogURL: state.ogURL || state.canonical || locState.canonicalURL,
            ogImage: state.ogImage || $url.fromAppBase('/assets/og-image.png'),

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
                        'children',

                        'charset',
                        'viewport',

                        'robots',
                        'canonical',
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
                {headState.viewport && <meta name='viewport' content={headState.viewport} />}

                {headState.robots && <meta name='robots' content={headState.robots} />}
                {headState.canonical && <link rel='canonical' href={headState.canonical.toString()} />}

                {headState.title && <title>{headState.title}</title>}
                {headState.description && <meta name='description' content={headState.description} />}
                {headState.author && <meta name='author' content={headState.author} />}

                {headState.pngIcon && <link rel='icon' href={headState.pngIcon.toString()} type='image/png' />}
                {headState.svgIcon && <link rel='icon' href={headState.svgIcon.toString()} type='image/svg+xml' />}

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
            </head>
        </Context.Provider>
    );
}

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useHead = (): ContextProps => $preact.useContext(Context);
