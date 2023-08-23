/**
 * Preact component.
 */

import { createContext } from 'preact';
import * as $preact from '../../preact.js';
import { json as $toꓺjson } from '../../to.js';
import { useReducer, useContext } from 'preact/hooks';
import { pkgName as $appꓺpkgName } from '../../app.js';
import { updateDeep as $objꓺupdateDeep } from '../../obj.js';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.js';
import { get as $obpꓺget, toCode as $obpꓺtoCode } from '../../obp.js';

import type { Dispatch } from 'preact/hooks';
import type { Fetcher as $preactꓺisoꓺFetcher } from '../apis/iso.js';
import type { State as HTMLState, PartialState as HTMLPartialState } from './html.js';

/**
 * Defines types.
 */
export type State = {
	globalObp: string;
	html: HTMLState; // <Head> & <Body>.
	fetcher?: $preactꓺisoꓺFetcher;
};
export type PartialState = {
	globalObp?: string;
	html?: HTMLPartialState; // <Head> & <Body>.
	fetcher?: $preactꓺisoꓺFetcher;
};
export type Props = Exclude<$preact.Props<PartialState>, 'classes'>;

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
	const globalObp = props.globalObp || $strꓺobpPartSafe($appꓺpkgName) + '.preactData';
	const globalProps = $obpꓺget(globalThis, globalObp, {}) as Props;

	const [state, updateState] = useReducer(updateStateReducer, {
		...$preact.cleanProps(globalProps),
		...$preact.cleanProps(props),
		globalObp: globalObp, // Calculated above.
		html: {
			head: {
				// Routes using the `<Head>` component can choose to set `scriptURL` to an empty string during SSR renders.
				// Emptying `styleURL` makes no sense. Emptying `scriptURL` does, in some cases; e.g., if a route is purely static.
				// So, for example, for a purely static route you could do: `<Head {...(!$env.isWeb() ? { scriptURL: '' } : {})} />`.
				// See `./404.tsx` as an example where `scriptURL` is updated to an empty string during server-side renders.
			}, // Initial `<Head>` state.
			body: {}, // Initial `<Body>` state.
		},
	});
	return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
};

/**
 * Converts global into embeddable script code.
 *
 * @returns Global as embeddable script code; for SSR.
 */
export const dataToScriptCode = (): string => {
	const { state } = useData();
	const code = $obpꓺtoCode(state.globalObp);

	let scriptCode = code.init; // Initialize.
	scriptCode += ' ' + code.set + '.html = ' + $toꓺjson(state.html) + ';';
	scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

	return scriptCode;
};
