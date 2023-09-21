/**
 * Preact component.
 */

import { createContext as preactꓺcreateContext } from 'preact';
import type { Dispatch as preactꓺhooksꓺDispatch } from 'preact/hooks';
import { useContext as preactꓺhooksꓺuseContext, useReducer as preactꓺhooksꓺuseReducer } from 'preact/hooks';
import { $preact } from '../../index.ts';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.ts';
import type { State as $preactꓺcomponentsꓺdataꓺState } from './data.tsx';
import { useData as $preactꓺcomponentsꓺdataꓺuseData } from './data.tsx';

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
    readonly updateState: preactꓺhooksꓺDispatch<PartialState>;
};

/**
 * Defines context.
 */
const Context = preactꓺcreateContext({} as ContextProps);

/**
 * Produces initial state.
 *
 * @param   dataState <Data> state.
 * @param   props     Component props.
 *
 * @returns           Initialized state.
 */
const initialState = (dataState: $preactꓺcomponentsꓺdataꓺState, props: Props = {}): State => {
    return $objꓺmergeDeep({ lang: 'en' }, dataState.html, $preact.cleanProps(props)) as unknown as State;
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
    return $objꓺupdateDeep(state, updates) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
    const { state: dataState } = $preactꓺcomponentsꓺdataꓺuseData();
    if (!dataState) throw new Error('Missing data state.');

    const [state, updateState] = preactꓺhooksꓺuseReducer(reduceState, undefined, () => initialState(dataState, props));
    return (
        <Context.Provider value={{ state, updateState }}>
            <html lang={state.lang} class={$preact.classes(state.classes)} data-preact-iso>
                {props.children}
            </html>
        </Context.Provider>
    );
};

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useHTML = (): ContextProps => preactꓺhooksꓺuseContext(Context);
