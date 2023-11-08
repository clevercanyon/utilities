/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $dom, $env, $preact } from '../../index.ts';
import { default as As } from './as.tsx';
import { default as ConsentAsync } from './consent-async.tsx';

/**
 * Defines types.
 */
export type State = $preact.State<
    Partial<$preact.Intrinsic['body']> & {
        [x in $preact.ClassPropVariants]?: $preact.Classes;
    }
>;
export type PartialState = Partial<State>;
export type PartialStateUpdates = PartialState;
export type Props = $preact.BasicPropsNoKeyRef<PartialState>;
export type Context = $preact.Context<{
    state: State;
    updateState: $preact.StateDispatcher<PartialStateUpdates>;
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
    const [actualState, updateState] = $preact.useReducedState((): State => {
        return $preact.initialState($preact.omitProps(props, ['children']));
    });
    const state = $preact.useMemo((): State => {
        return { ...$preact.omitProps(actualState, ['class']), class: $preact.classes(actualState) };
    }, [actualState]);

    const xPreactAppClasses = $preact.useMemo((): string => {
        const hFullClass = 'h-full'; // Special case of needing this to match w/ <body>.
        return 'block' + ($preact.classMap(actualState).has(hFullClass) ? ' ' + hFullClass : '');
    }, [actualState]);

    if ($env.isWeb()) {
        $preact.useLayoutEffect(() => {
            $dom.newAtts($dom.body(), state);
            const xPreactApp = $dom.xPreactApp();
            if (xPreactApp) $dom.setAtts(xPreactApp, { class: xPreactAppClasses });
        }, [state]);
    }
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
