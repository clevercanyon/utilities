/**
 * Preact component.
 */

import {
	get as $envꓺget, //
	isWeb as $envꓺisWeb,
} from '../../env.js';

import { useLocation } from './router.js';
import * as $preact from '../../preact.js';
import { rTrim as $strꓺrTrim } from '../../str.js';
import { tryParse as $urlꓺtryParse } from '../../url.js';
import { useData, dataGlobalToScriptCode } from './data.js';

import type * as $type from '../../type.js';

/**
 * Defines types.
 */
export type State = {
	classes?: string | string[];

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
export type Props = $preact.Props<PartialState>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	const location = useLocation();
	const { state, updateState } = useData();

	if (!location.url || !state || !updateState) {
		throw new Error('Missing location|state.');
	}
	const { head } = state.html; // Head config.

	const appBaseURL = $urlꓺtryParse(String($envꓺget('@top', 'APP_BASE_URL', '')));
	if (!appBaseURL) throw new Error('Missing or invalid `APP_BASE_URL` environment variable.');
	const appBaseURLStr = $strꓺrTrim(appBaseURL.toString(), '/');

	let title = props.title || location.url.hostname;
	const defaultDescription = 'Take the tiger by the tail.';

	if ('' !== head.titleSuffix) {
		if (head.titleSuffix || head.siteName) {
			title += ' • ' + ((head.titleSuffix || head.siteName) as string);
		}
	}
	updateState({
		html: {
			head: {
				...$preact.cleanProps(props),

				charset: props.charset || 'utf-8',
				viewport: props.viewport || 'width=device-width, initial-scale=1.0, minimum-scale=1.0',

				title, // See title generation above.
				description: props.description || defaultDescription,
				canonical: props.canonical || location.canonicalURL,

				pngIcon: props.pngIcon || appBaseURLStr + '/assets/icon.png',
				svgIcon: props.svgIcon || appBaseURLStr + '/assets/icon.svg',

				ogSiteName: props.ogSiteName || props.siteName || location.url.hostname,
				ogType: props.ogType || 'website',
				ogTitle: props.ogTitle || title,
				ogDescription: props.ogDescription || props.description || defaultDescription,
				ogURL: props.ogURL || props.canonical || location.canonicalURL,
				ogImage: props.ogImage || appBaseURLStr + '/assets/og-image.png',
			},
		},
	});
	return (
		<head class={$preact.classes(head.classes)}>
			{head.charset && <meta charSet={head.charset} />}
			{head.viewport && <meta name='viewport' content={head.viewport} />}

			{head.robots && <meta name='robots' content={head.robots} />}
			{head.canonical && <link rel='canonical' href={head.canonical.toString()} />}

			{head.title && <title>{head.title}</title>}
			{head.description && <meta name='description' content={head.description} />}
			{head.author && <meta name='author' content={head.author} />}

			{head.pngIcon && <link rel='icon' href={head.pngIcon.toString()} type='image/png' />}
			{head.svgIcon && <link rel='icon' href={head.svgIcon.toString()} type='image/svg+xml' />}

			{head.ogSiteName && head.ogType && head.ogTitle && head.ogDescription && head.ogURL && head.ogImage && (
				<>
					<meta property='og:site_name' content={head.ogSiteName} />
					<meta property='og:type' content={head.ogType} />
					<meta property='og:title' content={head.ogTitle} />
					<meta property='og:description' content={head.ogDescription} />
					<meta property='og:url' content={head.ogURL.toString()} />
					<meta property='og:image' content={head.ogImage.toString()} />
				</>
			)}
			{head.mainStyleBundle && <link rel='stylesheet' href={head.mainStyleBundle.toString()} media='all' />}

			{!$envꓺisWeb() && head.mainScriptBundle && <script>{dataGlobalToScriptCode()}</script>}
			{head.mainScriptBundle && <script type='module' src={head.mainScriptBundle.toString()}></script>}

			{props.children}
		</head>
	);
};
