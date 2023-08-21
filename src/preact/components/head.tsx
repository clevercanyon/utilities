/**
 * Preact component.
 */

import { useData } from './data.js';
import { useLocation } from './router.js';
import * as $preact from '../../preact.js';
import { get as $envꓺget, isWeb as $envꓺisWeb } from '../../env.js';

/**
 * Defines types.
 */
export type State = {
	classes?: string | string[];

	charset?: string;
	viewport?: string;

	robots?: string;
	canonical?: string;
	siteName?: string;

	title?: string;
	titleSuffix?: string;
	description?: string;
	author?: string;

	pngIcon?: string;
	svgIcon?: string;

	ogSiteName?: string;
	ogType?: string;
	ogTitle?: string;
	ogDescription?: string;
	ogURL?: string;
	ogImage?: string;

	stylePath?: string;
	scriptPath?: string;
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
	const appBaseURL = $envꓺget('@top', 'APP_BASE_URL', '') as string;

	const { state, updateState } = useData();
	const { head } = state.html; // Head config.

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
				canonical: props.canonical || location.canonicalURL.toString(),

				pngIcon: props.pngIcon || appBaseURL + '/assets/site/icon.png',
				svgIcon: props.svgIcon || appBaseURL + '/assets/site/icon.svg',

				ogSiteName: props.ogSiteName || props.siteName || location.url.hostname,
				ogType: props.ogType || 'website',
				ogTitle: props.ogTitle || title,
				ogDescription: props.ogDescription || props.description || defaultDescription,
				ogURL: props.ogURL || props.canonical || location.canonicalURL.toString(),
				ogImage: props.ogImage || appBaseURL + '/assets/site/og-image.png',
			},
		},
	});
	return (
		<head class={$preact.classes(head.classes)}>
			{head.charset && <meta charSet={head.charset} />}
			{head.viewport && <meta name='viewport' content={head.viewport} />}

			{head.robots && <meta name='robots' content={head.robots} />}
			{head.canonical && <link rel='canonical' href={head.canonical} />}

			{head.title && <title>{head.title}</title>}
			{head.description && <meta name='description' content={head.description} />}
			{head.author && <meta name='author' content={head.author} />}

			{head.pngIcon && <link rel='icon' href={head.pngIcon} type='image/png' />}
			{head.svgIcon && <link rel='icon' href={head.svgIcon} type='image/svg+xml' />}

			{head.ogSiteName && head.ogType && head.ogTitle && head.ogDescription && head.ogURL && head.ogImage && (
				<>
					<meta property='og:site_name' content={head.ogSiteName} />
					<meta property='og:type' content={head.ogType} />
					<meta property='og:title' content={head.ogTitle} />
					<meta property='og:description' content={head.ogDescription} />
					<meta property='og:url' content={head.ogURL} />
					<meta property='og:image' content={head.ogImage} />
				</>
			)}
			{head.stylePath && <link rel='stylesheet' media='all' href={head.stylePath} />}
			{head.scriptPath && <script type='module' src={head.scriptPath}></script>}
			{!$envꓺisWeb() && state.fetcher && state.fetcher.containerCacheToScriptTag()}

			{props.children}
		</head>
	);
};
