/**
 * Preact component.
 */

import { createContext } from 'preact';
import * as $preact from '../../preact.js';
import type { Dispatch } from 'preact/hooks';
import { json as $toꓺjson } from '../../to.js';
import { isWeb as $envꓺisWeb } from '../../env.js';
import { useReducer, useContext } from 'preact/hooks';
import { pkgName as $appꓺpkgName } from '../../app.js';
import type { Fetcher } from '../../preact/apis/iso.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import type { State as HTMLState, PartialState as HTMLPartialState } from './html.js';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.js';
import { get as $obpꓺget, set as $obpꓺset, toScriptCode as $obpꓺtoScriptCode } from '../../obp.js';

/**
 * Defines types.
 */
export type State = {
	globalObp: string;
	html: HTMLState;
	fetcher?: Fetcher;
};
export type PartialState = {
	globalObp?: string;
	html?: HTMLPartialState;
	fetcher?: Fetcher;
};
export type Props = Omit<$preact.Props<PartialState>, 'classes'>;
export type GlobalProps = Partial<Props> & { httpStatus?: number };

export type ContextProps = Readonly<{
	state: State;
	updateState: Dispatch<PartialState>;
}>;
export type HTTPStatusProps = Readonly<{
	state: number;
	updateState: (status: number) => void;
}>;

/**
 * Global object path.
 */
let globalObp = ''; // Initialize.

/**
 * Defines data context.
 */
const Context = createContext({} as ContextProps);

/**
 * Produces initial state.
 *
 * @param   props Component props.
 *
 * @returns       Initialized state.
 */
const initialState = (props: Props = {}): State => {
	let globalProps: GlobalProps = {}; // Initialize.
	globalObp = props.globalObp || $strꓺobpPartSafe($appꓺpkgName) + '.preactISOData';

	if ($envꓺisWeb() /* These props only used for initial web state. */) {
		globalProps = $obpꓺget(globalThis, globalObp, {}) as GlobalProps;
	} /* Else, during server-side rendering the HTTP status is reset here. */ else {
		$obpꓺset(globalThis, globalObp + '.httpStatus', 200); // Resets HTTP status.
	}
	const state = $objꓺmergeDeep(
		$preact.cleanProps(globalProps, ['httpStatus']),
		$preact.cleanProps(props), // `<Data>` props.
		{ globalObp, html: { /* HTML structure. */ head: {}, body: {} } },
	) as unknown as State;

	return state; // Initial state.
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
	const [state, updateState] = useReducer(reduceState, undefined, () => initialState(props));
	return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
};

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useData = (): ContextProps => useContext(Context);

/**
 * Defines HTTP status hook.
 *
 * @returns Readonly props: `{ state, updateState }`.
 */
export const useHTTPStatus = (): HTTPStatusProps => {
	if (!globalObp /* State not initialized? */) {
		throw new Error('Missing `globalObp`.');
	}
	return {
		state: Number($obpꓺget(globalThis, globalObp + '.httpStatus', 200)),
		updateState: (status: number): void => {
			if ($envꓺisWeb()) return; // Not applicable.
			$obpꓺset(globalThis, globalObp + '.httpStatus', status);
		},
	};
};

/**
 * Converts global into embeddable script code.
 *
 * @returns Global as embeddable script code; for SSR.
 */
export const dataGlobalToScriptCode = (): string => {
	const { state } = useData();

	if (!state /* State not initialized? */) {
		throw new Error('Missing data state.');
	} else if (!globalObp) {
		throw new Error('Missing `globalObp`.');
	}
	const globalObpScriptCode = $obpꓺtoScriptCode(globalObp);

	let scriptCode = globalObpScriptCode.init; // Initialize.
	scriptCode += ' ' + globalObpScriptCode.set + '.html = ' + $toꓺjson(state.html) + ';';
	scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

	return scriptCode;
};
