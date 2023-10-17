/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $obj, $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type State = $preact.State<
    Partial<$preact.JSX.IntrinsicElements['body']> & {
        [x in $preact.ClassPropVariants]?: $preact.Classes;
    }
>;
export type PartialState = $preact.State<Partial<State>>;
export type PartialStateUpdates = PartialState;
export type Props = $preact.Props<PartialState>;

export type ContextProps = $preact.Context<{
    state: State;
    updateState: $preact.Dispatch<PartialStateUpdates>;
}>;

/**
 * Defines context.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const Context = createContext({} as ContextProps);

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
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(props));
    return (
        <Context.Provider value={{ state, updateState }}>
            <body
                {...{
                    ...$preact.omitProps(state, ['class']),
                    class: $preact.classes(state),
                }}
            >
                {props.children}
            </body>
        </Context.Provider>
    );
}

/**
 * Defines context hook.
 *
 * @returns {@see ContextProps} Context.
 */
export const useBody = (): ContextProps => $preact.useContext(Context);
