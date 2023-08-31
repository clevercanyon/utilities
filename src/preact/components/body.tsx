/**
 * Preact component.
 */

import * as $preact from '../../preact.js';
import { createContext as preactꓺcreateContext } from 'preact';
import type { Dispatch as preactꓺhooksꓺDispatch } from 'preact/hooks';
import { useData as $preactꓺcomponentsꓺdataꓺuseData } from './data.js';
import type { State as $preactꓺcomponentsꓺdataꓺState } from './data.js';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.js';
import { useReducer as preactꓺhooksꓺuseReducer, useContext as preactꓺhooksꓺuseContext } from 'preact/hooks';

/**
 * Defines types.
 */
export type State = {
	classes?: string | string[];
};
export type PartialState = Partial<State>;
export type Props = $preact.Props<PartialState>;

export type ContextProps = Readonly<{
	state: State;
	updateState: preactꓺhooksꓺDispatch<PartialState>;
}>;

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
	return $objꓺmergeDeep(dataState.body, $preact.cleanProps(props)) as unknown as State;
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
			<body class={$preact.classes(state.classes)}>{props.children}</body>
		</Context.Provider>
	);
};

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useBody = (): ContextProps => preactꓺhooksꓺuseContext(Context);
