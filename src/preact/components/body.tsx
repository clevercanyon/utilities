/**
 * Preact component.
 */

import { createContext } from 'preact';
import { $obj, $preact } from '../../index.ts';
import { type State as DataState } from './data.tsx';

/**
 * Defines types.
 */
export type State = Partial<$preact.JSX.IntrinsicElements['body']> & {
    [x in $preact.ClassPropVariants]?: $preact.Classes;
};
export type PartialState = Partial<State>;
export type Props = $preact.Props<PartialState>;

export type ContextProps = Readonly<{
    state: State;
    updateState: $preact.Dispatch<PartialState>;
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
 * @param   dataState <Data> state.
 * @param   props     Component props.
 *
 * @returns           Initialized state.
 */
const initialState = (dataState: DataState, props: Props = {}): State => {
    return $obj.mergeDeep(dataState.body, $preact.omitProps(props, ['children'])) as unknown as State;
};

/**
 * Reduces state updates.
 *
 * @param   state   Current state.
 * @param   updates State updates.
 *
 * @returns         New state, if changed; else old state.
 */
const reduceState = (state: State, updates: PartialState): State => {
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
    const { state: dataState } = $preact.useData();
    if (!dataState) throw new Error('Missing data state.');

    // Props from current `<Data>` state will only have an impact on 'initial' `<Body>` state.
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(dataState, props));

    return (
        <Context.Provider value={{ state, updateState }}>
            <body
                {...{
                    ...$preact.omitProps(props, ['class', 'children']),
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
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useBody = (): ContextProps => $preact.useContext(Context);
