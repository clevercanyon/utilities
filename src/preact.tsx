/**
 * Preact utilities.
 *
 * This file is intentionally lightweight. It contains only the most basic Preact utilities. The reason is because we do
 * a glob import of this entire suite of Preact utilities across many projects. Doing a glob import is how we keep our
 * individual `.tsx` files easy to create and maintain. Therefore, if you're planning to add a new Preact utility,
 * please consider building it as a new Preact API instead; i.e., tuck it into `./preact/apis`.
 */

import type * as preact from 'preact';
import type { $type } from './index.js';
import { omit as $objꓺomit } from './obj.js';
import { castArray as $toꓺcastArray } from './to.js';

/**
 * Defines types.
 */
export type VNode<P extends Props = Props> = preact.VNode<P>;
export type Component<P extends Props = Props> = preact.FunctionComponent<P>;
export type Props<P extends object = $type.Object> = preact.RenderableProps<Readonly<P & { classes?: string | string[] }>>;

/**
 * Defines dirty props.
 */
const dirtyProps = ['key', 'jsx', 'dangerouslySetInnerHTML', 'ref', 'children'];

/**
 * Cleans VNode props.
 *
 * @param   props           Props that will be cleaned up.
 * @param   otherDirtyProps Optional. Any other dirty props to clean up.
 *
 * @returns                 A clone of {props} stripped of all dirty props.
 *
 * @note This also removes props with undefined values.
 */
export const cleanProps = <Type extends Props, Key extends keyof Type>(props: Type, otherDirtyProps?: Key[]): Omit<Type, Key> => {
	return $objꓺomit(props, dirtyProps.concat((otherDirtyProps || []) as string[]) as Key[], { undefinedValues: true });
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
