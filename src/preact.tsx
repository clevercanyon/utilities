/**
 * Preact utilities.
 *
 * This file is intentionally lightweight. It contains only the most basic Preact utilities. The reason is because we do
 * a glob import of this entire suite of Preact utilities across many projects. Doing a glob import is how we keep our
 * individual `.tsx` files easy to create and maintain. Therefore, if you're planning to add a new Preact utility,
 * please consider building it as a new Preact API instead; i.e., tuck it into `./preact/apis`.
 */

import type * as preact from 'preact';
import { omit as $objꓺomit } from './obj.js';
import { castArray as $toꓺcastArray } from './to.js';

/**
 * Defines types.
 */
export type VNode<P extends Props = Props> = preact.VNode<P>;
export type Component<P extends Props = Props, S extends object = object> = preact.AnyComponent<P, S>;
export type Props<P extends object = object> = preact.RenderableProps<P & { classes?: string | string[] }>;
export type InheritedProps = 'key' | 'jsx' | 'ref' | 'children';

/**
 * Cleans VNode props.
 *
 * @param   props Props that will be cleaned up.
 * @param   clean Optional. Aside from inherited props, also remove these.
 *
 * @returns       A clone of {props} stripped of inherited props and any others to {clean}.
 */
export const cleanProps = <Type extends Props, Key extends keyof Type>(props: Type, clean?: Key[]): Omit<Type, Key> => {
	return $objꓺomit(props, ['key', 'jsx', 'ref', 'children'].concat((clean || []) as string[]) as Key[]);
};

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
