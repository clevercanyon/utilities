/**
 * Preact component.
 */

import * as $preact from '../../preact.js';
import { empty as $isꓺempty } from '../../is.js';
import { default as Data, useData } from './data.js';
import { Location, ErrorBoundary, Router, useLocation } from '../apis/iso.js';

import type { Props as DataProps } from './data.js';
import type { LocationProps } from '../apis/iso.js';

/**
 * Props interface.
 */
export type Props = $preact.Props<DataProps & LocationProps>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
const Component = (props: Props = {}): $preact.VNode<Props> => {
	return $isꓺempty(useData()) && $isꓺempty(useLocation()) ? (
		<Data fetcher={props.fetcher}>
			<Location url={props.url}>
				<ErrorBoundary>
					<Router>{props.children}</Router>
				</ErrorBoundary>
			</Location>
		</Data>
	) : (
		<ErrorBoundary>
			<Router>{props.children}</Router>
		</ErrorBoundary>
	);
};

/**
 * Exports the rest of our ISO APIs.
 */
export { Route, useLocation, useRoute, lazy, prerender, hydrate } from '../apis/iso.js';
export type { LocationProps, LocationContext, RouterProps, RouteProps, RouteContext } from '../apis/iso.js';

/**
 * Exports component by name.
 */
export { Component as Router };

/**
 * Default export.
 */
export default Component;
