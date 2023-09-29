/**
 * Preact component.
 */

import * as preact from 'preact';
import { $obj, $preact } from '../../index.ts';
import { type State as DataState } from './data.tsx';

/**
 * Defines types.
 */
export type State = {
    classes?: string | string[];
    lang?: string;
};
export type PartialState = {
    classes?: string | string[];
    lang?: string;
};
export type Props = $preact.Props<PartialState>;

export type ContextProps = {
    readonly state: State;
    readonly updateState: $preact.Dispatch<PartialState>;
};

/**
 * Defines context.
 */
const Context = preact.createContext({} as ContextProps);

/**
 * Produces initial state.
 *
 * @param   dataState <Data> state.
 * @param   props     Component props.
 *
 * @returns           Initialized state.
 */
const initialState = (dataState: DataState, props: Props = {}): State => {
    return $obj.mergeDeep({ lang: 'en' }, dataState.html, $preact.cleanProps(props)) as unknown as State;
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
export default function HTML(props: Props = {}): $preact.VNode<Props> {
    const { state: dataState } = $preact.useData();
    if (!dataState) throw new Error('Missing data state.');

    // Props from current `<Data>` state will only have an impact on 'initial' `<HTML>` state.
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(dataState, props));

    return (
        <Context.Provider value={{ state, updateState }}>
            <html lang={state.lang} class={$preact.classes('preact', state.classes)}>
                {props.children}
            </html>
        </Context.Provider>
    );
}

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useHTML = (): ContextProps => $preact.useContext(Context);
