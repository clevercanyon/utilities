/**
 * Preact component.
 */

import { useHTML } from './html.js';
import * as $preact from '../../preact.js';
import { omit as $objꓺomit } from '../../obj.js';

/**
 * Props interface.
 */
export type Props = $preact.Props<{
	headClasses?: string | string[];

	charset?: string;
	viewport?: string;

	robots?: string;
	canonical?: string;

	title?: string;
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

	style?: string;
	script?: string;
}>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	const { state, updateState } = useHTML();

	updateState({
		...$objꓺomit(props, ['classes', 'children', 'ref']),
		headClasses: props.classes || [],
		charset: props.charset || 'utf-8',
		viewport: props.viewport || 'width=device-width, initial-scale=1.0, minimum-scale=1.0',
	});
	return (
		<head class={$preact.classes(state.headClasses)}>
			{state.charset && <meta charSet={state.charset} />}
			{state.viewport && <meta name='viewport' content={state.viewport} />}

			{state.robots && <meta name='robots' content={state.robots} />}
			{state.canonical && <link rel='canonical' href={state.canonical} />}

			{state.title && <title>{state.title}</title>}
			{state.description && <meta name='description' content={state.description} />}
			{state.author && <meta name='author' content={state.author} />}

			{state.pngIcon && <link rel='icon' href={state.pngIcon} type='image/png' />}
			{state.svgIcon && <link rel='icon' href={state.svgIcon} type='image/svg+xml' />}

			{state.ogSiteName && state.ogType && state.ogTitle && state.ogDescription && state.ogURL && state.ogImage && (
				<>
					<meta property='og:site_name' content={state.ogSiteName} />
					<meta property='og:type' content={state.ogType} />
					<meta property='og:title' content={state.ogTitle} />
					<meta property='og:description' content={state.ogDescription} />
					<meta property='og:url' content={state.ogURL} />
					<meta property='og:image' content={state.ogImage} />
				</>
			)}
			{state.style && <link rel='stylesheet' media='all' href={state.style} />}
			{state.script && <script type='module' src={state.script}></script>}

			{props.children}
		</head>
	);
};
