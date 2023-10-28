/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $dom, $env, $obj, $preact } from '../../index.ts';
import { default as As } from './as.tsx';

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
export type Props = $preact.Props<PartialState>;

export type Context = $preact.Context<{
    state: State;
    updateState: $preact.Dispatch<PartialStateUpdates>;
}>;

/**
 * Defines context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ContextObject = createContext({} as Context);

/**
 * Produces initial state.
 *
 * @param   props Component props.
 *
 * @returns       Initialized state.
 */
const initialState = (props: Props = {}): State => {
    return $obj.mergeDeep({}, $preact.omitProps(props, ['children'])) as unknown as State;
};

/**
 * Reduces state updates.
 *
 * @param   state   Current state.
 * @param   updates State updates.
 *
 * @returns         New state, if changed; else old state.
 */
const reduceState = (state: State, updates: PartialStateUpdates): State => {
    return $obj.updateDeep(state, updates) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Body(props: Props = {}): $preact.VNode<Props> {
    const [actualState, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(props));

    const state = $preact.useMemo((): State => {
        return {
            ...$preact.omitProps(actualState, ['class']),
            class: $preact.classes(actualState),
        };
    }, [actualState]);

    if ($env.isWeb()) {
        $preact.useLayoutEffect(() => {
            $dom.newAtts($dom.body(), state);
        }, [state]);
    }
    return (
        <ContextObject.Provider value={{ state, updateState }}>
            {/* Client-side renders context only. <body> server-side. */}
            {$env.isWeb() ? (
                <>{props.children}</>
            ) : (
                <body {...state}>
                    <As tag='x-preact-app' data-hydrate={''}>
                        {props.children}
                    </As>
                </body>
            )}
        </ContextObject.Provider>
    );
}

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useBody = (): Context => $preact.useContext(ContextObject);
