/**
 * Preact API.
 */

import * as $preact from '../../../preact.js';
import { defaults as $objꓺdefaults } from '../../../obj.js';
import { render as preactꓺrenderToString } from 'preact-render-to-string';

/**
 * Defines types.
 */
export type RenderToStringOptions = { context?: $preact.Context };

/**
 * Renders vNode tree as a string.
 *
 * @param   vNode   VNode to render as a string.
 * @param   options Options (all optional); {@see RenderToStringOptions}.
 *
 * @returns         VNode tree rendered as a string.
 */
export const renderToString = (vNode: $preact.VNode, options?: RenderToStringOptions): string => {
	const opts = $objꓺdefaults({}, options || {}, { context: {} }) as Required<RenderToStringOptions>;
	return preactꓺrenderToString(vNode, opts.context);
};
