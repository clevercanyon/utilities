/**
 * Preact component.
 */

import { createContext as preactꓺcreateContext } from 'preact';
import type { Dispatch as preactꓺhooksꓺDispatch } from 'preact/hooks';
import { useContext as preactꓺhooksꓺuseContext, useReducer as preactꓺhooksꓺuseReducer } from 'preact/hooks';
import { pkgName as $appꓺpkgName } from '../../app.ts';
import { isTest as $envꓺisTest, isWeb as $envꓺisWeb } from '../../env.ts';
import type { ResponseConfig as $httpꓺResponseConfig } from '../../http.ts';
import { $preact } from '../../index.ts';
import { stringify as $jsonꓺstringify } from '../../json.ts';
import { mergeDeep as $objꓺmergeDeep, updateDeep as $objꓺupdateDeep } from '../../obj.ts';
import { get as $obpꓺget, set as $obpꓺset, toScriptCode as $obpꓺtoScriptCode } from '../../obp.ts';
import type { Fetcher as $preactꓺapisꓺisoꓺFetcher } from '../../preact/apis/iso.tsx';
import { obpPartSafe as $strꓺobpPartSafe } from '../../str.ts';
import type { PartialState as $preactꓺcomponentsꓺbodyꓺPartialState, State as $preactꓺcomponentsꓺbodyꓺState } from './body.tsx';
import type { PartialState as $preactꓺcomponentsꓺheadꓺPartialState, State as $preactꓺcomponentsꓺheadꓺState } from './head.tsx';
import type { PartialState as $preactꓺcomponentsꓺhtmlꓺPartialState, State as $preactꓺcomponentsꓺhtmlꓺState } from './html.tsx';

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
    status: number; // Marking this as required property.
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
    } /* Else, during server-side rendering the HTTP state is reset. */ else {
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
 *
 * @note HTTP state is semi-functional on web, but we discourage use outside testing.
 */
export const useHTTP = (): HTTPContextProps => {
    if ($envꓺisWeb() && !$envꓺisTest()) {
        throw new Error('Is web, not test.');
    }
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
 *
 * @note Dumping global script code on web works, but we discourage use outside testing.
 */
export const globalToScriptCode = (): string => {
    if ($envꓺisWeb() && !$envꓺisTest()) {
        throw new Error('Is web, not test.');
    }
    const { state } = useData();

    if (!state /* State not initialized? */) {
        throw new Error('Missing data state.');
    } else if (!globalObp) {
        throw new Error('Missing `globalObp`.');
    }
    const globalObpScriptCode = $obpꓺtoScriptCode(globalObp);

    let scriptCode = globalObpScriptCode.init; // Initialize.
    scriptCode += ' ' + globalObpScriptCode.set + '.html = ' + $jsonꓺstringify(state.html) + ';';
    scriptCode += ' ' + globalObpScriptCode.set + '.head = ' + $jsonꓺstringify(state.head) + ';';
    scriptCode += ' ' + globalObpScriptCode.set + '.body = ' + $jsonꓺstringify(state.body) + ';';
    scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

    return scriptCode;
};
