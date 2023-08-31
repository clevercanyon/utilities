/**
 * Preact component.
 */

import { createContext } from 'preact';
import { useLocation } from './router.js';
import * as $preact from '../../preact.js';
import type * as $type from '../../type.js';
import type { Dispatch } from 'preact/hooks';
import type { State as DataState } from './data.js';
import { useReducer, useContext, useMemo } from 'preact/hooks';
import { useData, dataGlobalToScriptCode } from './data.js';
import { get as $envꓺget, isWeb as $envꓺisWeb } from '../../env.js';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.js';

/**
 * Defines types.
 */
export type State = {
	charset?: string;
	viewport?: string;

	robots?: string;
	canonical?: URL | $type.cfw.URL | string;
	siteName?: string;

	title?: string;
	titleSuffix?: string;
	description?: string;
	author?: string;

	pngIcon?: URL | $type.cfw.URL | string;
	svgIcon?: URL | $type.cfw.URL | string;

	ogSiteName?: string;
	ogType?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogURL?: URL | $type.cfw.URL | string;
	ogImage?: URL | $type.cfw.URL | string;

	mainStyleBundle?: URL | $type.cfw.URL | string;
	mainScriptBundle?: URL | $type.cfw.URL | string;
};
export type PartialState = Partial<State>;
export type Props = Omit<$preact.Props<PartialState>, 'classes'>;

export type ContextProps = {
	readonly state: State;
	readonly updateState: Dispatch<PartialState>;
};

/**
 * Defines context.
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
	return $objꓺmergeDeep(dataState.html?.head, $preact.cleanProps(props)) as unknown as State;
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
	return $objꓺupdateDeep(state, updates) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	const { state: locState } = useLocation();
	if (!locState) throw new Error('Missing location state.');

	const { state: dataState } = useData();
	if (!dataState) throw new Error('Missing data state.');

	const [state, updateState] = useReducer(reduceState, undefined, () => initialState(dataState, props));

	const headState = useMemo((): State => {
		const appBaseURL = String($envꓺget('@top', 'APP_BASE_URL', ''));
		const appBasePath = String($envꓺget('@top', 'APP_BASE_PATH', ''));

		let title = state.title || locState.url.hostname;
		const defaultDescription = 'Take the tiger by the tail.';

		if ('' !== state.titleSuffix) {
			if (state.titleSuffix || state.siteName) {
				title += ' • ' + ((state.titleSuffix || state.siteName) as string);
			}
		}
		return {
			...state,

			charset: state.charset || 'utf-8',
			viewport: state.viewport || 'width=device-width, initial-scale=1.0, minimum-scale=1.0',

			title, // See title generation above.
			description: state.description || defaultDescription,
			canonical: state.canonical || locState.canonicalURL,

			pngIcon: state.pngIcon || appBasePath + '/assets/icon.png',
			svgIcon: state.svgIcon || appBasePath + '/assets/icon.svg',

			ogSiteName: state.ogSiteName || state.siteName || locState.url.hostname,
			ogType: state.ogType || 'website',
			ogTitle: state.ogTitle || title,
			ogDescription: state.ogDescription || state.description || defaultDescription,
			ogURL: state.ogURL || state.canonical || locState.canonicalURL,
			ogImage: state.ogImage || appBaseURL + '/assets/og-image.png',
		};
	}, [locState, dataState, state]);
	return (
		<Context.Provider value={{ state: headState, updateState }}>
			<head>
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

				{!$envꓺisWeb() && headState.mainScriptBundle && <script dangerouslySetInnerHTML={{ __html: dataGlobalToScriptCode() }}></script>}
				{headState.mainScriptBundle && <script type='module' src={headState.mainScriptBundle.toString()}></script>}

				{props.children}
			</head>
		</Context.Provider>
	);
};

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useHead = (): ContextProps => useContext(Context);
