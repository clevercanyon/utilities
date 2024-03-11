/**
 * Preact component.
 */

import '#@initialize.ts';

import { $env, $obj, $preact } from '#index.ts';
import { createContext } from 'preact';

/**
 * Defines types.
 */
export type State = $preact.State<{
    status: number;
}>;
export type PartialState = Partial<State>;
export type PartialStateUpdates = PartialState;
export type Props = $preact.BasicTreeProps<{
    httpState?: PartialState;
}>;
export type Context = $preact.Context<{
    state: State;
    updateState: $preact.StateDispatcher<PartialStateUpdates>;
}>;

/**
 * Defines context.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ContextObject = createContext({} as Context);

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 *
 * @requiredEnv ssr -- Server-side only.
 */
export const useHTTP = (): Context => {
    if (!$env.isSSR()) throw Error('7nvGAmE5');
    return $preact.useContext(ContextObject);
};

/**
 * Reduces state updates.
 *
 * @param   state   Current state.
 * @param   updates State updates.
 *
 * @returns         Existing state, patched by reference.
 *
 * @note State is patched by reference, which comes from props.
 */
const reduceState = (state: State, updates: PartialStateUpdates): State => {
    return $obj.patchDeep(state, updates) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note State is patched by reference, which typically comes from props.
 */
export default function HTTP(props: Props): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducer(reduceState, undefined, (): State => {
        return $obj.patchDeep(props.httpState || {}, { status: 200 }) as unknown as State;
    });
    return <ContextObject.Provider value={{ state, updateState }}>{props.children}</ContextObject.Provider>;
}

// ---
// Misc exports.

/**
 * Defines named prop keys for easy reuse.
 *
 * @returns Array of named {@see HTTP} prop keys.
 */
export const namedPropKeys = (): string[] => ['httpState'];
