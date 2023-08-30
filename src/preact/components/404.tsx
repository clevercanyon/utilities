/**
 * Preact component.
 */

import HTML from './html.js';
import Head from './head.js';
import Body from './body.js';

import { useHTTPStatus } from './data.js';
import * as $preact from '../../preact.js';
import { isWeb as $envꓺisWeb } from '../../env.js';

import type { RouteContextAsProps } from './router.js';

/**
 * Defines types.
 */
export type Props = Omit<$preact.Props<RouteContextAsProps>, 'classes'>;
export type StandAloneProps = Omit<$preact.Props, 'classes'>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note No SSR style/script bundles, as this is a purely static page.
 */
export default (unusedꓺprops: Props): $preact.VNode<Props> => {
	const { updateState: updateHTTPStatus } = useHTTPStatus();
	updateHTTPStatus(404); // Record status being a 404 error.

	return (
		<HTML>
			<Head
				robots={'noindex, nofollow'}
				title={'404 Error: Not Found'}
				description={'The resource you are looking for could not be found.'}
				{...(!$envꓺisWeb() ? { mainStyleBundle: '', mainScriptBundle: '' } : {})}
			>
				<link rel='stylesheet' href='https://cdn.clevercanyon.com/assets/uploads/404.css' media='all' />
			</Head>
			<Body>
				<CommonBodyContents />
			</Body>
		</HTML>
	);
};

/**
 * Renders component (stand-alone).
 *
 * @param   props Stand-alone component props.
 *
 * @returns       Stand-alone vNode / JSX element tree.
 *
 * @note This component should be easy to render as a string and then for it be easily
 * dropped into any system, serving as a 404 error page; e.g., for a Cloudflare Pages site.
 */
export const StandAlone = (unusedꓺprops: StandAloneProps = {}): $preact.VNode<StandAloneProps> => {
	return (
		<html lang={'en'}>
			<head>
				<meta charSet={'utf-8'} />
				<meta name='robots' content={'noindex, nofollow'} />
				<meta name='viewport' content={'width=device-width, initial-scale=1.0, minimum-scale=1.0'} />

				<title>{'404 Error: Not Found'}</title>
				<meta name='description' content={'The resource you are looking for could not be found.'} />

				<link rel='stylesheet' href='https://cdn.clevercanyon.com/assets/uploads/404.css' media='all' />
			</head>
			<body>
				<CommonBodyContents />
			</body>
		</html>
	);
};

/**
 * Produces 404 page body contents.
 *
 * @returns Component tree.
 */
const CommonBodyContents = (): $preact.VNode => {
	return (
		<>
			<div class='noise' />
			<div class='overlay' />
			<div class='terminal'>
				<h1>
					{'404 Error: '}
					<span class='error-message'>{'Not Found'}</span>
				</h1>
				<p class='output'>{'The resource you are looking for could not be found.'}</p>
				<p class='output'>
					{'Please '}
					{/* eslint-disable */}
					{/* @ts-ignore ... onClick intentionally stringified here. */}
					<a href='#' onClick={'event.preventDefault(); event.stopImmediatePropagation(); history.back();'}>
						{'go back'}
					</a>
					{/* eslint-enable */}
					{' or '}
					<a href='/'>{'return to the front page'}</a>
					{'.'}
				</p>
				<p class='output'>{'Good luck.'}</p>
			</div>
		</>
	);
};
