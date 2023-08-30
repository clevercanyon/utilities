/**
 * Preact component.
 */

import { createContext } from 'preact';
import * as $preact from '../../preact.js';
import { json as $toꓺjson } from '../../to.js';
import { isWeb as $envꓺisWeb } from '../../env.js';
import { useReducer, useContext } from 'preact/hooks';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.js';
import { get as $obpꓺget, set as $obpꓺset, toScriptCode as $obpꓺtoScriptCode } from '../../obp.js';

import type { Fetcher } from './router.js';
import type { Dispatch } from 'preact/hooks';
import type { State as HTMLState, PartialState as HTMLPartialState } from './html.js';

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
export type GlobalObpProps = Props & { httpStatus?: number };

export type ContextProps = {
	state: State;
	updateState: Dispatch<PartialState>;
};
export type HTTPStatusProps = {
	state: number;
	updateState: (status: number) => void;
};

/**
 * Initializes global object path.
 */
let globalObp = '';

/**
 * Defines global data context.
 */
const Context = createContext({} as ContextProps);

/**
 * Produces initial global data state.
 *
 * @param   props Global data component props.
 *
 * @returns       Initialized global data state.
 */
const initialState = (props: Props = {}): State => {
	let globalObpProps: Partial<GlobalObpProps> = {}; // Initialize.
	globalObp = props.globalObp || $strꓺobpPartSafe($appꓺpkgName) + '.preactISOData';

	if ($envꓺisWeb() /* These props only used for initial web state. */) {
		globalObpProps = $obpꓺget(globalThis, globalObp, {}) as Partial<GlobalObpProps>;
	} /* Else, during server-side rendering the HTTP status is reset here. */ else {
		$obpꓺset(globalThis, globalObp + '.httpStatus', 200); // Resets default HTTP status.
	}
	const state = $objꓺmergeDeep(
		$preact.cleanProps(props), // `<Data>` props.
		$preact.cleanProps(globalObpProps, ['httpStatus']),
		{ globalObp, html: { /* HTML structure. */ head: {}, body: {} } },
	) as unknown as State;

	return state; // Initial state.
};

/**
 * Reduces global data state updates.
 *
 * @param   state   Current global data state.
 * @param   updates Global data state updates.
 *
 * @returns         New global data state; else original state if no changes.
 */
const reduceState = (state: State, updates: PartialState): State => {
	return $objꓺupdateDeep(state, updates) as unknown as State;
};

/**
 * Renders global data component.
 *
 * @param   props Global data component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default (props: Props = {}): $preact.VNode<Props> => {
	const [state, updateState] = useReducer(reduceState, undefined, () => initialState(props));
	return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
};

/**
 * Defines global data context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useData = (): Readonly<ContextProps> => useContext(Context);

/**
 * Defines global HTTP status props hook.
 *
 * @returns Readonly props: `{ state, updateState }`.
 */
export const useHTTPStatus = (): Readonly<HTTPStatusProps> => {
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
 * Converts global data state into embeddable script code.
 *
 * @returns Global data state as embeddable script code; for SSR.
 */
export const dataGlobalToScriptCode = (): string => {
	const { state } = useData();

	if (!state /* State not initialized? */) {
		throw new Error('Missing data context.');
	} else if (!globalObp) {
		throw new Error('Missing `globalObp`.');
	}
	const globalObpScriptCode = $obpꓺtoScriptCode(globalObp);

	let scriptCode = globalObpScriptCode.init; // Initialize.
	scriptCode += ' ' + globalObpScriptCode.set + '.html = ' + $toꓺjson(state.html) + ';';
	scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

	return scriptCode;
};
