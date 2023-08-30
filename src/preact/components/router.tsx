/**
 * Preact component.
 */

import * as $preact from '../../preact.js';
import { default as Data } from './data.js';
import { empty as $isꓺempty } from '../../is.js';
import { Location, ErrorBoundary, Router, useRoute } from '../apis/iso.js';

import type { Props as DataProps } from './data.js';
import type { LocationProps, RouterProps } from '../apis/iso.js';

/**
 * Defines types.
 */
export type Props = Omit<$preact.Props<LocationProps & DataProps & RouterProps>, 'classes'>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	return $isꓺempty(useRoute()) ? (
		<Location url={props.url}>
			<Data globalObp={props.globalObp} html={props.html} fetcher={props.fetcher}>
				<ErrorBoundary>
					<Router onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
						{props.children}
					</Router>
				</ErrorBoundary>
			</Data>
		</Location>
	) : (
		<ErrorBoundary>
			<Router onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
				{props.children}
			</Router>
		</ErrorBoundary>
	);
};

/**
 * Exports our ISO API.
 */
export * from '../apis/iso.js';
