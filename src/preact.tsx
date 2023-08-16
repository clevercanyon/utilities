/**
 * React utilities.
 */

import Preact from 'preact';
import { castArray as $toꓺcastArray } from './to.js';

/**
 * Defines types.
 */
export type Props = {
	readonly classes?: string | string[];
};
export type Component<P extends Props = Props> = Preact.FunctionComponent<P>;
export type ClassComponent<P extends Props = Props> = Preact.ComponentClass<P>;
export type AnyComponent<P extends Props = Props> = Component<P> | ClassComponent<P>;
export type Element<P extends Props = Props> = Preact.VNode<P>;

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
