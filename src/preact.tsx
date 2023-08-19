/**
 * Preact utilities.
 *
 * This file is intentionally lightweight. It contains only the most basic Preact utilities. The reason is because we do
 * a glob import of this entire suite of Preact utilities across many projects. Doing a glob import is how we keep our
 * individual `.tsx` files easy to create and maintain. Therefore, if you're planning to add a new Preact utility,
 * please consider building it as a new Preact API instead; i.e., tuck it into `./preact/apis`.
 */

import type * as preact from 'preact';
import { castArray as $toꓺcastArray } from './to.js';

/**
 * Defines types.
 */
export type VNode<P extends Props = Props> = preact.VNode<P>;
export type Component<P extends Props = Props, S extends object = object> = preact.AnyComponent<P, S>;
export type Props<P extends object = object> = preact.RenderableProps<P & { classes?: string | string[] }>;

/**
 * Formats component classes.
 *
 * @param   classes      Prefix class(es).
 * @param   otherClasses Other class(es); e.g., from component props.
 *
 * @returns              Space separated classes.
 */
export const classes = (classes?: string | string[], otherClasses?: string | string[]): string => {
	classes = classes || [];
	otherClasses = otherClasses || [];

	classes = $toꓺcastArray('' === classes ? [] : classes);
	otherClasses = $toꓺcastArray('' === otherClasses ? [] : otherClasses);

	return [...new Set(classes.concat(otherClasses))].join(' ');
};
