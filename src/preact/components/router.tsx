/**
 * Preact component.
 */

import {
	ErrorBoundary as $preactISOꓺErrorBoundary,
	Location as $preactISOꓺLocation,
	Router as $preactISOꓺRouter,
	useRoute as $preactISOꓺuseRoute,
} from '@clevercanyon/preact-iso.fork';
import type { ErrorBoundaryProps as $preactISOꓺErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
import type { LocationProps as $preactISOꓺLocationProps, RouterProps as $preactISOꓺRouterProps } from '@clevercanyon/preact-iso.fork/router';
import { $preact } from '../../index.ts';
import { empty as $isꓺempty } from '../../is.ts';
import type { Props as $preactꓺcomponentsꓺdataꓺProps } from './data.tsx';
import { default as $preactꓺcomponentsꓺData } from './data.tsx';

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
export { ErrorBoundary, Location, Route, Router, lazyRoute, useLocation, useRoute } from '@clevercanyon/preact-iso.fork';
export type { ErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
export type { LocationContext, LocationProps, RouteContext, RouteContextAsProps, RouteProps, RouterProps } from '@clevercanyon/preact-iso.fork/router';
