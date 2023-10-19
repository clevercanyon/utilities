/**
 * Preact ISO.
 */

import { options as preactꓺoptions } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { $is, $preact, type $type } from '../../../../index.ts';
import { Route, Router, type RoutedProps } from '../../../../preact/components.tsx';

/**
 * Defines types.
 */
export type LazyErrorBoundaryProps = Omit<
    $preact.Props<{
        onError?: (error: $type.Error) => void;
    }>,
    $preact.ClassPropVariants
>;
export type LazyRouteLoader = () => Promise<{ default: $preact.AnyComponent<RoutedProps> } | $preact.AnyComponent<RoutedProps>>;

/**
 * Lazy error boundary.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__c` = `._childDidSuspend()`; {@see https://o5p.me/B8yq0g} in `mangle.json`.
 */
export function LazyErrorBoundary(this: $preact.Component<LazyErrorBoundaryProps>, props: LazyErrorBoundaryProps): $preact.VNode<LazyErrorBoundaryProps> {
    (this as unknown as $type.Object).__c = (thrownPromise: Promise<unknown>): void => {
        void thrownPromise.then(() => this.forceUpdate());
    };
    this.componentDidCatch = props.onError;
    return <>{props.children}</>;
}

/**
 * Produces a lazy loaded route component.
 *
 * @param   loader For details {@see LazyRouteLoader}.
 *
 * @returns        Higher order route component; {@see $preact.FnComponent}.
 */
export const lazyRoute = (loader: LazyRouteLoader): $preact.FnComponent<RoutedProps> => {
    let promise: ReturnType<LazyRouteLoader> | undefined;
    let component: $preact.AnyComponent<RoutedProps> | undefined;

    const Route = (props: $preact.Props<RoutedProps>): $preact.VNode<RoutedProps> => {
        const didChainPromiseResolution = useRef(false);
        const [, updateResolvedState] = useState(false);

        if (!promise) {
            promise = loader().then((exportsOrComponent): Awaited<ReturnType<LazyRouteLoader>> => {
                return (component = (exportsOrComponent as { default: $preact.AnyComponent<RoutedProps> }).default || exportsOrComponent);
            });
        }
        if (undefined !== component) {
            return $preact.createElement(component, props);
            //
        } else if (!didChainPromiseResolution.current) {
            didChainPromiseResolution.current = true;

            void promise.then((component): $preact.AnyComponent<RoutedProps> => {
                updateResolvedState(true); // Triggers re-render.
                return component as $preact.AnyComponent<RoutedProps>;
            });
        }
        throw promise;
    };
    if (loader.name /* For debugging. */) {
        Route.displayName = loader.name;
    }
    return Route;
};

/**
 * Produces a lazy loaded component.
 *
 * @param   asyncComponent Async component to be lazy loaded.
 *
 * @returns                Higher order component that will be lazy loaded.
 */
export const lazyComponent = <Props extends $preact.Props = $preact.Props>(asyncComponent: $preact.AsyncFnComponent<Props>): $preact.FnComponent<Props> => {
    const higherOrder = { props: {} as Props }; // Contains async component props, which we access by reference.

    const ComponentRoute = lazyRoute(async (): ReturnType<LazyRouteLoader> => {
        const renderedAsyncComponentVNode = await asyncComponent(higherOrder.props);
        return (unusedꓺprops: RoutedProps) => renderedAsyncComponentVNode;
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

/* ---
 * Side effects.
 */

/**
 * Previous error handler.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__e` = `._catchError`; {@see https://o5p.me/DxqGM3} in `mangle.json`.
 */
const prevErrorHandler = (preactꓺoptions as unknown as $type.Object).__e;

/**
 * Configures error handler in support of lazy loads.
 *
 * @param args Variadic args passed in by error hook in preact core.
 *
 * @note Inspired by `Suspense` from preact/compat. See: <https://o5p.me/TA863r>.
 * @note `__e` = `._catchError`; {@see https://o5p.me/DxqGM3} in `mangle.json`.
 */
(preactꓺoptions as unknown as $type.Object).__e = (...args: unknown[]): void => {
    let error = args[0] as $type.Object;
    let newVNode = args[1] as $type.Object;
    let oldVNode = args[2] as $type.Object | undefined;

    if ($is.promise(error) && $is.object(newVNode)) {
        let v = newVNode; // New vnode.

        while ((v = v.__ as $type.Object) /* While `._parent()` exists, recursively. */) {
            //
            if (v.__c && (v.__c as $type.Object).__c /* If `._component`.`_childDidSuspend()` exists. */) {
                if (null == newVNode.__e /* If `._dom()` is missing. */) {
                    newVNode.__e = oldVNode?.__e; // `._dom`.
                    newVNode.__k = oldVNode?.__k; // `._children`.
                }
                if (!newVNode.__k) newVNode.__k = []; // `._children`.

                // Calls `._component`.`_childDidSuspend()`.
                ((v.__c as $type.Object).__c as $type.Function)(error, newVNode);
                return; // Effectively skips `prevErrorHandler` in such a case.
            }
        }
    }
    if ($is.function(prevErrorHandler)) {
        prevErrorHandler(...args);
    }
};
