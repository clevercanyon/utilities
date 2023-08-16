/**
 * Preact API.
 */

import * as $preact from '../../preact.js';
import { defaults as $objꓺdefaults } from '../../obj.js';

// @ts-ignore ... `preact-ssr-prepass` types are broken.
import { default as preactꓺssrPrepass } from 'preact-ssr-prepass';

import { render as preactꓺrenderToString } from 'preact-render-to-string';

/**
 * Defines types.
 */
export type RenderToStringOptions = { context?: $preact.Context; awaitLazyLoads?: boolean };

/**
 * Renders vNode tree as a string.
 *
 * @param   vNode   VNode to render as a string.
 * @param   options Options (all optional); {@see RenderToStringOptions}.
 *
 * @returns         VNode tree rendered as a promise string.
 */
export const renderToString = async (vNode: $preact.VNode, options?: RenderToStringOptions): Promise<string> => {
	const opts = $objꓺdefaults({}, options || {}, { context: {}, awaitLazyLoads: true }) as Required<RenderToStringOptions>;

	// @ts-ignore ... `preact-ssr-prepass` types are broken.
	// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	await preactꓺssrPrepass(vNode); // Waits for lazy loading to complete.

	return preactꓺrenderToString(vNode, opts.context);
};
