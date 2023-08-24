/**
 * Preact component.
 */

import HTML from './html.js';
import Head from './head.js';
import Body from './body.js';
import * as $preact from '../../preact.js';
import type { RouteProps } from './router.js';
import { isWeb as $envꓺisWeb } from '../../env.js';

/**
 * Defines types.
 */
export type Props = $preact.Props<Partial<RouteProps>>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note This component should be easy to render as a string and then for it be easily
 * dropped into any system, serving as a 404 error page; e.g., for a Cloudflare Pages site.
 */
export default (/* props: Props = {} */): $preact.VNode<Props> => {
	return (
		<HTML>
			<Head
				robots={'noindex, nofollow'}
				title={'404 Error: Not Found'}
				description={'The resource you are looking for could not be found.'}
				{...(!$envꓺisWeb() ? { mainScriptBundle: '' } : {})}
			>
				<link rel='stylesheet' href='https://cdn.clevercanyon.com/assets/uploads/404.css' media='all' />
			</Head>
			<Body>
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
			</Body>
		</HTML>
	);
};
