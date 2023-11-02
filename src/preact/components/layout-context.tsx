/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $obj, $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type State = $preact.State<{
    variant: string;
}>;
export type PartialState = Partial<State>;
export type Props = $preact.BasicProps<PartialState>;

export type Context = $preact.Context<{
    state: State;
    updateState: $preact.Dispatcher<PartialState>;
}>;

/**
 * Defines context.
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
    return $obj.mergeDeep({ variant: 'default' }, $preact.omitProps(props, ['children'])) as unknown as State;
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
export default function LayoutContext(props: Props): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(props));
    return <ContextObject.Provider value={{ state, updateState }}>{props.children}</ContextObject.Provider>;
}

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useLayout = (): Context => $preact.useContext(ContextObject);
