/**
 * Preact component.
 */

import { useLocation } from './router.js';
import * as $preact from '../../preact.js';
import { rTrim as $strꓺrTrim } from '../../str.js';
import { tryParse as $urlꓺtryParse } from '../../url.js';
import { mergeDeep as $objꓺmergeDeep } from '../../obj.js';
import { useData, dataGlobalToScriptCode } from './data.js';
import { get as $envꓺget, isWeb as $envꓺisWeb } from '../../env.js';

import type * as $type from '../../type.js';

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

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	const { state: dataState } = useData();
	if (!dataState) throw new Error('Data context missing.');

	const location = useLocation();
	if (!location) throw new Error('Location context missing.');

	const partialState = $objꓺmergeDeep(
		$preact.cleanProps(props), //
		dataState.html?.head,
	) as unknown as PartialState;

	const appBaseURL = $urlꓺtryParse(String($envꓺget('@top', 'APP_BASE_URL', '')));
	if (!appBaseURL) throw new Error('Missing or invalid `APP_BASE_URL` env var.');
	const appBaseURLPrefix = $strꓺrTrim(appBaseURL.toString(), '/');

	let title = partialState.title || location.url.hostname;
	const defaultDescription = 'Take the tiger by the tail.';

	if ('' !== partialState.titleSuffix) {
		if (partialState.titleSuffix || partialState.siteName) {
			title += ' • ' + ((partialState.titleSuffix || partialState.siteName) as string);
		}
	}
	const state: State = {
		...partialState,

		charset: partialState.charset || 'utf-8',
		viewport: partialState.viewport || 'width=device-width, initial-scale=1.0, minimum-scale=1.0',

		title, // See title generation above.
		description: partialState.description || defaultDescription,
		canonical: partialState.canonical || location.canonicalURL,

		pngIcon: partialState.pngIcon || appBaseURLPrefix + '/assets/icon.png',
		svgIcon: partialState.svgIcon || appBaseURLPrefix + '/assets/icon.svg',

		ogSiteName: partialState.ogSiteName || partialState.siteName || location.url.hostname,
		ogType: partialState.ogType || 'website',
		ogTitle: partialState.ogTitle || title,
		ogDescription: partialState.ogDescription || partialState.description || defaultDescription,
		ogURL: partialState.ogURL || partialState.canonical || location.canonicalURL,
		ogImage: partialState.ogImage || appBaseURLPrefix + '/assets/og-image.png',

		// This particular prop takes precedence over global data-state. Only when it's set to `''` in a server-side render.
		// The reason is because this particular property is added to our global data-state dynamically at the topmost ISO `<App>` layer.
		// So by the time the `<Head>` component is rendered farther down the tree, `mainScriptBundle` is already in global data-state.
		// Routes using the `<Head>` component can choose to set `mainScriptBundle` to an empty string during server-side renders.
		// So, for example, for a purely static route you could do: `<Head {...(!$env.isWeb() ? { mainScriptBundle: '' } : {})} />`.
		// See `./404.tsx` as an example where `mainScriptBundle` is updated to an empty string during server-side renders.
		// The objective is to allow specific routes to choose not to load the main script bundle for purely static pages.

		mainScriptBundle: '' === props.mainScriptBundle && !$envꓺisWeb() ? '' : partialState.mainScriptBundle,
	};
	return (
		<head>
			{state.charset && <meta charSet={state.charset} />}
			{state.viewport && <meta name='viewport' content={state.viewport} />}

			{state.robots && <meta name='robots' content={state.robots} />}
			{state.canonical && <link rel='canonical' href={state.canonical.toString()} />}

			{state.title && <title>{state.title}</title>}
			{state.description && <meta name='description' content={state.description} />}
			{state.author && <meta name='author' content={state.author} />}

			{state.pngIcon && <link rel='icon' href={state.pngIcon.toString()} type='image/png' />}
			{state.svgIcon && <link rel='icon' href={state.svgIcon.toString()} type='image/svg+xml' />}

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

			{!$envꓺisWeb() && state.mainScriptBundle && <script dangerouslySetInnerHTML={{ __html: dataGlobalToScriptCode() }}></script>}
			{state.mainScriptBundle && <script type='module' src={state.mainScriptBundle.toString()}></script>}

			{props.children}
		</head>
	);
};
