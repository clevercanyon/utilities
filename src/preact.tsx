/**
 * Preact utilities.
 */

import {
	Router, //
	Route,
	Link,
	Switch,
	Redirect,
	useRoute,
	useLocation,
	useRouter,
} from 'wouter-preact';

import preact from 'preact';
import { castArray as $toꓺcastArray } from './to.js';
import { defaults as $objꓺdefaults } from './obj.js';
import { render as preactꓺrenderToString } from 'preact-render-to-string';

/**
 * Defines types.
 */
export type VNode<P extends Props = Props> = preact.VNode<P>;
export type Component<P extends Props = Props, S extends State = State> = preact.AnyComponent<P, S>;
export type Props<P extends object = object> = preact.RenderableProps<P & { classes?: string | string[] }>;

export type Context = object; // Nothing to inherit from preact types.
export type State = object; // Nothing to inherit from preact types.

export type RenderToStringOptions = { context?: Context };

/**
 * Exports Wouter components.
 */
export { Router, Route, Link, Switch, Redirect };

/**
 * Exports Wouter APIs.
 */
export { useRoute, useLocation, useRouter };

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

/**
 * Renders vNode tree as a string.
 *
 * @param   vNode   VNode to render as a string.
 * @param   options Options (all optional); {@see RenderToStringOptions}.
 *
 * @returns         VNode tree rendered as a string.
 */
export const renderToString = (vNode: VNode, options?: RenderToStringOptions): string => {
	const opts = $objꓺdefaults({}, options || {}, { context: {} }) as Required<RenderToStringOptions>;
	return preactꓺrenderToString(vNode, opts.context);
};
