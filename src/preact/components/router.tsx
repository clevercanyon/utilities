/**
 * Preact component.
 */

import '../../resources/init.ts';

import { ErrorBoundary, Router as ISORouter, Route, lazyRoute } from '@clevercanyon/preact-iso.fork';
import { type ErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
import { type RouterProps as ISORouterProps, type RouteContextAsProps } from '@clevercanyon/preact-iso.fork/router';
import { $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type Props = Omit<$preact.Props<ErrorBoundaryProps & ISORouterProps>, $preact.ClassPropVariants>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Router(props: Props = {}): $preact.VNode<Props> {
    return (
        <ErrorBoundary onError={props.onError}>
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
export const lazyComponent = <Props extends $preact.Props = $preact.Props>(asyncComponent: $preact.AsyncFnComponent<Props>): $preact.FnComponent<Props> => {
    const higherOrder = { props: {} as Props }; // Contains async component props, which we access by reference.

    const ComponentRoute = lazyRoute(async (): Promise<$preact.FnComponent<RouteContextAsProps>> => {
        const renderedAsyncComponentVNode = await asyncComponent(higherOrder.props);
        return (unusedꓺprops: RouteContextAsProps) => renderedAsyncComponentVNode;
    });
    const ComponentRouter = (props: Parameters<$preact.AsyncFnComponent<Props>>[0]): Awaited<ReturnType<$preact.AsyncFnComponent<Props>>> => {
        higherOrder.props = props; // Populates async component props.
        return (
            <Router>
                <Route default component={ComponentRoute} />
            </Router>
        );
    };
    if (asyncComponent.name /* For debugging. */) {
        ComponentRouter.displayName = asyncComponent.name + 'Router';
        ComponentRoute.displayName = asyncComponent.name + 'Route';
    }
    return ComponentRouter;
};

/**
 * Exports ISO router-related utilities.
 */
export { ErrorBoundary, Location, Route, Router, lazyRoute, useLocation, useRoute } from '@clevercanyon/preact-iso.fork';
export { type ErrorBoundaryProps } from '@clevercanyon/preact-iso.fork/lazy';
export { type LocationContext, type LocationProps, type RouteContext, type RouteContextAsProps, type RouteProps, type RouterProps } from '@clevercanyon/preact-iso.fork/router';
