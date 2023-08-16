/**
 * Preact utilities.
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
