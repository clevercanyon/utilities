/**
 * Preact component.
 */

import {
	omit as $objꓺomit, //
	updateDeep as $objꓺupdateDeep,
} from '../../../obj.js';

import { createContext } from 'preact';
import * as $preact from '../../../preact.js';
import { useReducer, useContext } from 'preact/hooks';

import type { Dispatch } from 'preact/hooks';
import type { Props as HeadProps } from '../head/index.js';
import type { Props as BodyProps } from '../body/index.js';

/**
 * Defines types.
 */
export type State = {
	lang?: string;
} & HeadProps & BodyProps; // prettier-ignore

export type Props = $preact.Props<State>;

/**
 * HTML contexts.
 */
const Context = createContext({} as { state: State; updateState: Dispatch<State> });

/**
 * HTML context hooks.
 */
export const useHTML = (): { state: State; updateState: Dispatch<State> } => useContext(Context);

/**
 * HTML state reducer.
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
		...$objꓺomit(props, ['children']),
		lang: props.lang || 'en',
	} as State);

	return (
		<Context.Provider value={{ state, updateState }}>
			<html lang={state.lang} class={$preact.classes(state.classes)}>
				{props.children}
			</html>
		</Context.Provider>
	);
};
