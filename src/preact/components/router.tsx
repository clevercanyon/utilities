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
export type Props = Omit<$preact.Props<Partial<DataProps> & Partial<LocationProps> & RouterProps>, 'classes'>;

/**
 * Exports our ISO API.
 */
export * from '../apis/iso.js';

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	return $isꓺempty(useRoute()) ? (
		<Data globalObp={props.globalObp} html={props.html} fetcher={props.fetcher}>
			<Location url={props.url}>
				<ErrorBoundary>
					<Router onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
						{props.children}
					</Router>
				</ErrorBoundary>
			</Location>
		</Data>
	) : (
		<ErrorBoundary>
			<Router onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
				{props.children}
			</Router>
		</ErrorBoundary>
	);
};
