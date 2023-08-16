/**
 * Preact utilities.
 */

import preact from 'preact';
import { defaults as $objꓺdefaults } from './obj.js';
import { castArray as $toꓺcastArray } from './to.js';
import { render as preactꓺrenderToString } from 'preact-render-to-string';

/**
 * Defines types.
 */
export type Props = {
	readonly classes?: string | string[];
};
export type State = {
	// Nothing at this time.
};
export type VNode<P extends Props = Props> = preact.VNode<P>;
export type Component<P extends Props = Props, S extends State = State> = preact.AnyComponent<P, S>;

export type RenderToStringOptions = { context?: object };

/**
 * Renders vNode tree as string.
 *
 * @param   vNode   VNode to render as string.
 * @param   options Options (all optional); {@see RenderToStringOptions}.
 *
 * @returns         VNode tree rendered as string.
 */
export const renderToString = (vNode: VNode, options?: RenderToStringOptions): string => {
	const opts = $objꓺdefaults({}, options || {}, { context: {} }) as Required<RenderToStringOptions>;

	return preactꓺrenderToString(vNode, opts.context);
};

/**
 * Formats component classes.
 *
 * @param   classes Prefix class(es).
 * @param   props   Component props.
 *
 * @returns         Space separated classes.
 */
export const classes = (classes: string | string[], props: Props): string => {
	let propClasses = props.classes || [];

	classes = $toꓺcastArray('' === classes ? [] : classes);
	propClasses = $toꓺcastArray('' === propClasses ? [] : propClasses);

	return [...new Set(classes.concat(propClasses))].join(' ');
};
