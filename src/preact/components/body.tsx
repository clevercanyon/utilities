/**
 * Preact component.
 */

import '#@initialize.ts';

import { $dom, $env, $preact } from '#index.ts';
import { default as As } from '#preact/components/as.tsx';
import { default as ConsentAsync } from '#preact/components/consent-async.tsx';
import { createContext } from 'preact';

/**
 * Defines types.
 */
export type ActualState = $preact.State<
    Partial<$preact.Intrinsic['body']> & {
        [x in $preact.ClassPropVariants]?: $preact.Classes;
    }
>;
export type State = $preact.State<Partial<$preact.Intrinsic['body']>>;
export type PartialActualState = Partial<ActualState>;
export type PartialActualStateUpdates = PartialActualState;
export type Props = $preact.BasicTreeProps<PartialActualState>;
export type Context = $preact.Context<{
    state: State;
    updateState: $preact.StateDispatcher<PartialActualStateUpdates>;
}>;

/**
 * Defines context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ContextObject = createContext({} as Context);

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useBody = (): Context => $preact.useContext(ContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Body(props: Props = {}): $preact.VNode<Props> {
    const [actualState, updateState] = $preact.useReducedState((): ActualState => {
        return $preact.initialState($preact.omitProps(props, ['children']));
    });
    const state = $preact.useMemo((): State => {
        return { ...$preact.omitProps(actualState, ['class']), class: $preact.classes(actualState) };
    }, [actualState]);

    const xPreactAppClasses = $preact.useMemo((): string => {
        const hFull = 'h-full'; // Need this to match w/ <body>.
        return 'block' + ($preact.classMap(actualState).has(hFull) ? ' ' + hFull : '');
    }, [actualState]);

    $preact.useLayoutEffect((): void => {
        $dom.newAtts($dom.body(), state);
        const xPreactApp = $dom.xPreactApp();
        if (xPreactApp) $dom.setAtts(xPreactApp, { class: xPreactAppClasses });
    }, [state]);

    return (
        <ContextObject.Provider value={{ state, updateState }}>
            {$env.isWeb() ? (
                <>
                    {props.children}
                    <ConsentAsync />
                </>
            ) : (
                <body {...state}>
                    <As tag='x-preact-app' class={xPreactAppClasses} data-hydrate={''}>
                        {props.children}
                    </As>
                </body>
            )}
        </ContextObject.Provider>
    );
}
