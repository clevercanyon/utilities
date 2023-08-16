/**
 * Preact utilities.
 *
 * This file is intentionally lightweight. It contains only the most basic Preact utilities. The reason is because we do
 * a glob import of this entire suite of Preact utilities across many projects. Doing a glob import is how we keep our
 * individual `.tsx` files easy to create and maintain. Therefore, if you're planning to add a new Preact utility,
 * please consider building it as a new Preact API instead; i.e., tuck it into `./preact/apis`.
 */

import preact from 'preact';
import { castArray as $toꓺcastArray } from './to.js';

/**
 * Defines types.
 */
export type VNode<P extends Props = Props> = preact.VNode<P>;
export type Component<P extends Props = Props, S extends State = State> = preact.AnyComponent<P, S>;
export type Props<P extends object = object> = preact.RenderableProps<P & { classes?: string | string[] }>;

export type Context = object; // Nothing to inherit from preact types.
export type State = object; // Nothing to inherit from preact types.

/**
 * Exports frequently-used exports provided by `preact/compat`.
 */
export { Suspense, lazy } from 'preact/compat';

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
