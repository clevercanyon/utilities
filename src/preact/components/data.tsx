/**
 * Preact component.
 */

import {
	omit as $objꓺomit, //
	updateDeep as $objꓺupdateDeep,
} from '../../obj.js';

import { createContext } from 'preact';
import * as $preact from '../../preact.js';
import { getFetcher } from '../apis/iso.js';
import { useReducer, useContext } from 'preact/hooks';

import type { Dispatch } from 'preact/hooks';

/**
 * Defines types.
 */
export type State = {
	fetcher?: object;
};
export type Props = $preact.Props<State>;

/**
 * Data context.
 */
const Context = createContext({} as { state: State; updateState: Dispatch<State> });

/**
 * Data context hooks.
 */
export const useData = (): { state: State; updateState: Dispatch<State> } => useContext(Context);

/**
 * Data state reducer.
 */
const stateReducer = (state: State, updates: State): State => {
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
	const [state, updateState] = useReducer(stateReducer, {
		...$objꓺomit(props, ['children', 'ref']),
		fetcher: props.fetcher || getFetcher(),
	} as State);

	return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
};
