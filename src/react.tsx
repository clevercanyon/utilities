/**
 * React utilities.
 */

import {
	string as $isꓺstring, //
	element as $isꓺelement,
} from './is.js';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { isWeb as $envꓺisWeb } from './env.js';
import { defaults as $objꓺdefaults } from './obj.js';
import { castArray as $toꓺcastArray } from './to.js';

/**
 * Defines types.
 */
export type Props = {
	readonly classes?: string | string[];
};
export type Component<P extends Props = Props> = React.FunctionComponent<P>;
export type ClassComponent<P extends Props = Props> = React.ComponentClass<P>;
export type AnyComponent<P extends Props = Props> = Component<P> | ClassComponent<P>;

export type Element<P extends Props = Props> = React.ReactElement<P>;
export type Rendering<P extends Props = Props> = Element<P> | null;

export type DOMRenderOptions = { root?: string | object | null };

/**
 * Renders App component into DOM.
 *
 * @param App     Any App component function|class.
 * @param options Optional App component render options.
 */
export const domRenderApp = (App: AnyComponent, options: DOMRenderOptions = {}): void => {
	if (!$envꓺisWeb()) {
		throw new Error('Not web.');
	}
	const opts = $objꓺdefaults({}, options, { root: '#root' }) as Required<DOMRenderOptions>;
	let { root } = opts; // DOM node or selector.

	if (root && $isꓺstring(root)) {
		root = document.querySelector(root);
	}
	if (!$isꓺelement(root)) {
		throw new Error('Missing `root`.');
	}
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
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
