/**
 * Preact component.
 */

import {
	Router as $preactISOꓺRouter,
	useRoute as $preactISOꓺuseRoute,
	Location as $preactISOꓺLocation,
	ErrorBoundary as $preactISOꓺErrorBoundary,
} from '@clevercanyon/preact-iso.fork';

import * as $preact from '../../preact.js';
import { empty as $isꓺempty } from '../../is.js';
import { default as $preactꓺcomponentsꓺData } from './data.js';
import type { Props as $preactꓺcomponentsꓺdataꓺProps } from './data.js';
import type { ErrorBoundaryProps as $preactISOꓺErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
import type { LocationProps as $preactISOꓺLocationProps, RouterProps as $preactISOꓺRouterProps } from '@clevercanyon/preact-iso.fork/router';

/**
 * Defines types.
 */
export type Props = Omit<$preact.Props<$preactISOꓺLocationProps & $preactꓺcomponentsꓺdataꓺProps & $preactISOꓺRouterProps & $preactISOꓺErrorBoundaryProps>, 'classes'>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	return $isꓺempty($preactISOꓺuseRoute()) ? (
		<$preactISOꓺLocation url={props.url}>
			<$preactꓺcomponentsꓺData globalObp={props.globalObp} fetcher={props.fetcher} html={props.html} head={props.head} body={props.body}>
				<$preactISOꓺErrorBoundary onError={props.onError}>
					<$preactISOꓺRouter onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
						{props.children}
					</$preactISOꓺRouter>
				</$preactISOꓺErrorBoundary>
			</$preactꓺcomponentsꓺData>
		</$preactISOꓺLocation>
	) : (
		<$preactISOꓺErrorBoundary>
			<$preactISOꓺRouter onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
				{props.children}
			</$preactISOꓺRouter>
		</$preactISOꓺErrorBoundary>
	);
};

/**
 * Exports preact ISO router-related utilities.
 */
export type { ErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
export { Location, ErrorBoundary, Router, Route, useLocation, useRoute, lazyComponent } from '@clevercanyon/preact-iso.fork';
export type { LocationProps, LocationContext, RouterProps, RouteProps, RouteContext, RouteContextAsProps } from '@clevercanyon/preact-iso.fork/router';
