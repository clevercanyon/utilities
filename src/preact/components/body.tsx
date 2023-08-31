/**
 * Preact component.
 */

import { useData } from './data.js';
import { createContext } from 'preact';
import * as $preact from '../../preact.js';
import type { Dispatch } from 'preact/hooks';
import type { State as DataState } from './data.js';
import { useReducer, useContext } from 'preact/hooks';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.js';

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
	updateState: Dispatch<PartialState>;
}>;

/**
 * Defines context.
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
	return $objꓺmergeDeep(dataState.html?.body, $preact.cleanProps(props)) as unknown as State;
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
	const { state: dataState } = useData();
	if (!dataState) throw new Error('Missing data state.');

	const [state, updateState] = useReducer(reduceState, undefined, () => initialState(dataState, props));
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
export const useBody = (): ContextProps => useContext(Context);
