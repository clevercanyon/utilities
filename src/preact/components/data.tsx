/**
 * Preact component.
 */

import { createContext } from 'preact';
import * as $preact from '../../preact.js';
import { useReducer, useContext } from 'preact/hooks';
import { updateDeep as $objꓺupdateDeep } from '../../obj.js';

import type { Dispatch } from 'preact/hooks';
import type { Fetcher as $preactꓺisoꓺFetcher } from '../apis/iso.js';
import type { State as HTMLState, PartialState as HTMLPartialState } from './html.js';

/**
 * Defines types.
 */
export type State = {
	fetcher?: $preactꓺisoꓺFetcher;
	html: HTMLState; // Includes head & body.
};
export type PartialState = {
	fetcher?: $preactꓺisoꓺFetcher;
	html?: HTMLPartialState; // Includes head & body.
};
export type Props = Exclude<$preact.Props<Exclude<PartialState, 'html'>>, 'classes'>;

export type ContextProps = {
	state: State;
	updateState: Dispatch<PartialState>;
};

/**
 * Defines data context.
 */
const Context = createContext({} as ContextProps);

/**
 * Defines data context hook.
 */
export const useData = (): Readonly<ContextProps> => useContext(Context);

/**
 * Reduces state updates.
 */
const updateStateReducer = (state: State, updates: PartialState): State => {
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
	const [state, updateState] = useReducer(updateStateReducer, {
		...$preact.cleanProps(props),
		html: { head: {}, body: {} }, // Initial HTML state.
	});
	return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
};
