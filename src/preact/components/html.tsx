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
import type { State as HeadState, PartialState as HeadPartialState, Props as HeadProps } from './head.js';
import type { State as BodyState, PartialState as BodyPartialState, Props as BodyProps } from './body.js';

/**
 * Defines types.
 */
export type State = {
	classes?: string | string[];
	lang?: string;
	head: HeadState;
	body: BodyState;
};
export type PartialState = {
	classes?: string | string[];
	lang?: string;
	head?: HeadPartialState;
	body?: BodyPartialState;
};
export type Props = $preact.Props<
	PartialState & {
		head?: HeadProps;
		body?: BodyProps;
	}
>;
export type ContextProps = {
	readonly state: State;
	readonly updateState: Dispatch<PartialState>;
};

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
	return $objꓺmergeDeep({ lang: 'en', head: {}, body: {} }, dataState.html, $preact.cleanProps(props)) as unknown as State;
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
export const useHTML = (): ContextProps => useContext(Context);
