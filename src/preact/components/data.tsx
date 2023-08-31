/**
 * Preact component.
 */

import * as $preact from '../../preact.js';
import { json as $toꓺjson } from '../../to.js';
import { isWeb as $envꓺisWeb } from '../../env.js';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { createContext as preactꓺcreateContext } from 'preact';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import type { Dispatch as preactꓺhooksꓺDispatch } from 'preact/hooks';
import type { ResponseConfig as $httpꓺResponseConfig } from '../../http.js';
import type { Fetcher as $preactꓺapisꓺisoꓺFetcher } from '../../preact/apis/iso.js';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.js';
import { get as $obpꓺget, set as $obpꓺset, toScriptCode as $obpꓺtoScriptCode } from '../../obp.js';
import { useReducer as preactꓺhooksꓺuseReducer, useContext as preactꓺhooksꓺuseContext } from 'preact/hooks';
import type { State as $preactꓺcomponentsꓺhtmlꓺState, PartialState as $preactꓺcomponentsꓺhtmlꓺPartialState } from './html.js';
import type { State as $preactꓺcomponentsꓺheadꓺState, PartialState as $preactꓺcomponentsꓺheadꓺPartialState } from './head.js';
import type { State as $preactꓺcomponentsꓺbodyꓺState, PartialState as $preactꓺcomponentsꓺbodyꓺPartialState } from './body.js';

/**
 * Defines types.
 */
export type State = {
	globalObp: string;
	fetcher?: $preactꓺapisꓺisoꓺFetcher;
	html: $preactꓺcomponentsꓺhtmlꓺState;
	head: $preactꓺcomponentsꓺheadꓺState;
	body: $preactꓺcomponentsꓺbodyꓺState;
};
export type PartialState = {
	globalObp?: string;
	fetcher?: $preactꓺapisꓺisoꓺFetcher;
	html?: $preactꓺcomponentsꓺhtmlꓺPartialState;
	head?: $preactꓺcomponentsꓺheadꓺPartialState;
	body?: $preactꓺcomponentsꓺbodyꓺPartialState;
};
export type HTTPState = Partial<Omit<$httpꓺResponseConfig, 'body'>> & {
	status: number; // Present always.
};
export type HTTPPartialState = Partial<HTTPState>;

export type Props = Omit<$preact.Props<PartialState>, 'classes'>;
export type GlobalProps = Partial<Props & { http?: HTTPPartialState }>;

export type ContextProps = Readonly<{
	state: State;
	updateState: preactꓺhooksꓺDispatch<PartialState>;
}>;
export type HTTPContextProps = Readonly<{
	state: HTTPState;
	updateState: (updates: HTTPPartialState) => void;
}>;

/**
 * Global object path.
 */
let globalObp = ''; // Initialize.

/**
 * Defines data context.
 */
const Context = preactꓺcreateContext({} as ContextProps);

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
	} /* Else, during server-side rendering the HTTP state is reset here. */ else {
		$obpꓺset(globalThis, globalObp + '.http', initialHTTPState());
	}
	const state = $objꓺmergeDeep(
		{ html: {}, head: {}, body: {} },
		$preact.cleanProps(globalProps, ['http']),
		$preact.cleanProps(props), // `<Data>` props.
		{ globalObp }, // Calculated above.
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
	const [state, updateState] = preactꓺhooksꓺuseReducer(reduceState, undefined, () => initialState(props));
	return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
};

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useData = (): ContextProps => preactꓺhooksꓺuseContext(Context);

/**
 * Defines initial HTTP state.
 *
 * @returns Initialized HTTP state.
 */
const initialHTTPState = () => ({ status: 200 });

/**
 * Defines HTTP data hook.
 *
 * @returns Readonly props: `{ state, updateState }`.
 */
export const useHTTP = (): HTTPContextProps => {
	if ($envꓺisWeb()) throw new Error('Is web.');

	if (!globalObp /* State not initialized? */) {
		throw new Error('Missing `globalObp`.');
	}
	const state = $obpꓺget(globalThis, globalObp + '.http', initialHTTPState()) as HTTPState;
	return {
		state, // Current HTTP state.
		updateState: (updates: HTTPPartialState): void => {
			$obpꓺset(globalThis, globalObp + '.http', $objꓺupdateDeep(state, updates));
		},
	};
};

/**
 * Converts global into embeddable script code.
 *
 * @returns Global as embeddable script code; for SSR.
 */
export const globalToScriptCode = (): string => {
	if ($envꓺisWeb()) throw new Error('Is web.');

	const { state } = useData();

	if (!state /* State not initialized? */) {
		throw new Error('Missing data state.');
	} else if (!globalObp) {
		throw new Error('Missing `globalObp`.');
	}
	const globalObpScriptCode = $obpꓺtoScriptCode(globalObp);

	let scriptCode = globalObpScriptCode.init; // Initialize.
	scriptCode += ' ' + globalObpScriptCode.set + '.html = ' + $toꓺjson(state.html) + ';';
	scriptCode += ' ' + globalObpScriptCode.set + '.head = ' + $toꓺjson(state.head) + ';';
	scriptCode += ' ' + globalObpScriptCode.set + '.body = ' + $toꓺjson(state.body) + ';';
	scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

	return scriptCode;
};
