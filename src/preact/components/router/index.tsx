/**
 * Preact component.
 */

import * as $preact from '../../../preact.js';
import { Location, ErrorBoundary, Router } from '../../apis/iso.js';

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
export default (props: Props = {}): $preact.VNode<Props> => {
	return (
		<Location url={props.url}>
			<ErrorBoundary>
				<Router>{props.children}</Router>
			</ErrorBoundary>
		</Location>
	);
};
