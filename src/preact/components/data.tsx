/**
 * Preact component.
 */

import { createContext } from 'preact';
import * as $preact from '../../preact.js';
import { json as $toꓺjson } from '../../to.js';
import { useReducer, useContext } from 'preact/hooks';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { get as $obpꓺget, toCode as $obpꓺtoCode } from '../../obp.js';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.js';

import type { Dispatch } from 'preact/hooks';
import type { Fetcher as $preactꓺisoꓺFetcher } from '../apis/iso.js';
import type { State as HTMLState, PartialState as HTMLPartialState } from './html.js';

/**
 * Defines types.
 */
export type State = {
	globalObp: string;
	html: HTMLState;
	fetcher?: $preactꓺisoꓺFetcher;
};
export type PartialState = {
	globalObp?: string;
	html?: HTMLPartialState;
	fetcher?: $preactꓺisoꓺFetcher;
};
export type Props = Omit<$preact.Props<PartialState>, 'classes'>;

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
	const globalObp = props.globalObp || $strꓺobpPartSafe($appꓺpkgName) + '.preactISOData';
	const globalProps = $obpꓺget(globalThis, globalObp, {}) as Props;

	const initialState = $objꓺmergeDeep(
		$preact.cleanProps(props), //
		$preact.cleanProps(globalProps),
		{ globalObp, html: { head: {}, body: {} } },
	) as unknown as State; // Initial global date-state.

	const [state, updateState] = useReducer(updateStateReducer, initialState);

	return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
};

/**
 * Converts global into embeddable script code.
 *
 * @returns Global as embeddable script code; for SSR.
 */
export const dataGlobalToScriptCode = (): string => {
	const { state } = useData();
	if (!state) throw new Error('Data context missing.');

	const code = $obpꓺtoCode(state.globalObp);

	let scriptCode = code.init; // Initialize.
	scriptCode += ' ' + code.set + '.html = ' + $toꓺjson(state.html) + ';';
	scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

	return scriptCode;
};
