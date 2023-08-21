/**
 * Preact component.
 */

import * as $preact from '../../preact.js';
import { empty as $isꓺempty } from '../../is.js';
import { default as Data, useData } from './data.js';
import { Location, ErrorBoundary, Router } from '../apis/iso.js';

import type { Props as DataProps } from './data.js';
import type { LocationProps, RouterProps } from '../apis/iso.js';

/**
 * Defines types.
 */
export type Props = $preact.Props<Partial<DataProps> & Partial<LocationProps> & RouterProps>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
const Component = (props: Props = {}): $preact.VNode<Props> => {
	return !$isꓺempty(useData()) ? (
		<ErrorBoundary>
			<Router onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
				{props.children}
			</Router>
		</ErrorBoundary>
	) : (
		<Data fetcher={props.fetcher}>
			<Location url={props.url}>
				<ErrorBoundary>
					<Router onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
						{props.children}
					</Router>
				</ErrorBoundary>
			</Location>
		</Data>
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
