/**
 * Preact component.
 */

import { ErrorBoundary, Router as ISORouter, Location, Route, lazyRoute, useRoute } from '@clevercanyon/preact-iso.fork';
import { type ErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
import { type RouterProps as ISORouterProps, type LocationProps, type RouteContextAsProps } from '@clevercanyon/preact-iso.fork/router';
import { $is, $preact } from '../../index.ts';
import { default as Data, type Props as DataProps } from './data.tsx';

/**
 * Defines types.
 */
export type Props = Omit<$preact.Props<LocationProps & DataProps & ErrorBoundaryProps & ISORouterProps>, $preact.ClassPropVariants>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Router(props: Props = {}): $preact.VNode<Props> {
    return $is.empty(useRoute()) ? (
        <Location url={props.url}>
            <Data globalObp={props.globalObp} fetcher={props.fetcher} html={props.html} head={props.head} body={props.body}>
                <ErrorBoundary onError={props.onError}>
                    <ISORouter onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
                        {props.children}
                    </ISORouter>
                </ErrorBoundary>
            </Data>
        </Location>
    ) : (
        <ErrorBoundary>
            <ISORouter onLoadStart={props.onLoadStart} onLoadEnd={props.onLoadEnd} onRouteChange={props.onRouteChange}>
                {props.children}
            </ISORouter>
        </ErrorBoundary>
    );
}

/**
 * Produces a lazy component.
 *
 * @param   asyncComponent Async component to be lazy loaded by ISO prerenderer.
 *
 * @returns                Preact component that will be lazy loaded by ISO prerenderer.
 */
export const lazyComponent = <P extends $preact.Props = $preact.Props>(asyncComponent: $preact.AsyncFnComponent<P>): $preact.FnComponent<P> => {
    const higherOrder = { props: {} as P }; // Contains async component props, which we access by reference.

    const ComponentRoute = lazyRoute(async (): Promise<$preact.FnComponent<RouteContextAsProps>> => {
        const renderedAsyncComponentVNode = await asyncComponent(higherOrder.props);
        return (unusedꓺprops: RouteContextAsProps) => renderedAsyncComponentVNode;
    });
    const ComponentRouter = (props: Parameters<$preact.AsyncFnComponent<P>>[0]): Awaited<ReturnType<$preact.AsyncFnComponent<P>>> => {
        higherOrder.props = props; // Populates async component props.
        return (
            <Router>
                <Route default component={ComponentRoute} />
            </Router>
        );
    };
    if (asyncComponent.name /* For debugging. */) {
        ComponentRoute.displayName = asyncComponent.name + 'Route';
        ComponentRouter.displayName = asyncComponent.name + 'Router';
    }
    return ComponentRouter;
};

/**
 * Exports ISO router-related utilities.
 */
export { ErrorBoundary, Location, Route, Router, lazyRoute, useLocation, useRoute } from '@clevercanyon/preact-iso.fork';
export { type ErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
export { type LocationContext, type LocationProps, type RouteContext, type RouteContextAsProps, type RouteProps, type RouterProps } from '@clevercanyon/preact-iso.fork/router';
