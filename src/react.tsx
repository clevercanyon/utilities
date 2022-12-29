/**
 * Utility class.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { isWeb as $envꓺisWeb } from './env.js';

/**
 * React interfaces.
 */
export interface Props {
	readonly classes?: string | string[];
}
export type Component<P extends Props = Props> = React.FunctionComponent<P>;
export type ClassComponent<P extends Props = Props> = React.ComponentClass<P>;
export type AnyComponent<P extends Props = Props> = Component<P> | ClassComponent<P>;

export type Element<P extends Props = Props> = React.ReactElement<P>;
export type Rendering<P extends Props = Props> = Element<P> | null;

/**
 * Renders App component into DOM.
 *
 * @param App  Any App component function|class.
 * @param opts Optional App component render options.
 */
export function domRenderApp(App: AnyComponent, opts: { root?: string | object | null } = {}): void {
	if (!$envꓺisWeb()) {
		throw new Error('Not web.');
	}
	let { root } = opts;

	if (!root || typeof root === 'string') {
		root = document.querySelector(root || '#root');
	}
	if (!(root instanceof globalThis.Element)) {
		throw new Error('Missing `root: Element`.');
	}
	ReactDOM.createRoot(root).render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
}

/**
 * Formats component classes.
 *
 * @param   classes Prefix class(es).
 * @param   props   Component props.
 *
 * @returns         Space separated classes.
 */
export function classes(classes: string | string[], props: Props): string {
	classes = '' === classes ? [] : classes;
	classes = !Array.isArray(classes) ? Array(classes) : classes;

	let propClasses = props.classes || [];
	propClasses = '' === propClasses ? [] : propClasses;
	propClasses = !Array.isArray(propClasses) ? Array(propClasses) : propClasses;

	return classes.concat(propClasses).join(' ');
}
