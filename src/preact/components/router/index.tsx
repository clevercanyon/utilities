/**
 * Preact component.
 */

import * as $preact from '../../../preact.js';
import { empty as $isꓺempty } from '../../../is.js';
import { Location, ErrorBoundary, Router, useLocation } from '../../apis/iso.js';

/**
 * Props interface.
 */
export interface Props extends $preact.Props {
	url?: string; // Required for server-side prerendering.
}

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
const Component = (props: Props = {}): $preact.VNode<Props> => {
	const RouterJSX = (
		<ErrorBoundary>
			<Router>{props.children}</Router>
		</ErrorBoundary>
	);
	return $isꓺempty(useLocation()) ? <Location url={props.url}>{RouterJSX}</Location> : RouterJSX;
};

/**
 * Exports the rest of our ISO APIs.
 */
export { Route, useLocation, useRoute, lazy, prerender, hydrate } from '../../apis/iso.js';

/**
 * Exports component by name.
 */
export { Component as Router };

/**
 * Default export.
 */
export default Component;
