/**
 * Preact component.
 */

import { createContext } from 'preact';
import { $app, $env, $http, $json, $obj, $obp, $preact, $str } from '../../index.ts';
import { type State as BodyState, type PartialState as PartialBodyState } from './body.tsx';
import { type State as HeadState, type PartialState as PartialHeadState } from './head.tsx';
import { type State as HTMLState, type PartialState as PartialHTMLState } from './html.tsx';

/**
 * Defines types.
 */
export type State = {
    globalObp: string;
    fetcher?: $preact.iso.Fetcher;
    html: Omit<HTMLState, keyof HTMLState>; // None, for now.
    head: Pick<HeadState, 'mainStyleBundle' | 'mainScriptBundle'>; // Just these.
    body: Omit<BodyState, keyof BodyState>; // None, for now.
};
export type PartialState = {
    globalObp?: string;
    fetcher?: $preact.iso.Fetcher;
    html?: Omit<PartialHTMLState, keyof PartialHTMLState>; // None, for now.
    head?: Pick<PartialHeadState, 'mainStyleBundle' | 'mainScriptBundle'>; // Just these.
    body?: Omit<PartialBodyState, keyof PartialBodyState>; // None, for now.
};
export type HTTPState = Partial<Omit<$http.ResponseConfig, 'body'>> & {
    status: number; // Marking this as required property.
};
export type HTTPPartialState = Partial<HTTPState>;

export type Props = Omit<$preact.Props<PartialState>, $preact.ClassPropVariants>;
export type GlobalProps = Partial<Omit<Props, 'children'> & { http?: HTTPPartialState }>;

export type ContextProps = Readonly<{
    state: State;
    updateState: $preact.Dispatch<PartialState>;
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
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
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
    globalObp = props.globalObp || $str.obpPartSafe($app.pkgName) + '.preactISOData';

    if ($env.isWeb() /* These props only used for initial web state. */) {
        globalProps = $obp.get(globalThis, globalObp, {}) as GlobalProps;
    } /* Else, during server-side rendering the HTTP state is reset. */ else {
        $obp.set(globalThis, globalObp + '.http', initialHTTPState());
    }
    const state = $obj.mergeDeep(
        { html: {}, head: {}, body: {} },
        $preact.omitProps(globalProps, ['http']),
        $preact.omitProps(props, ['children']),
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
    return $obj.updateDeep(state, updates) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Data(props: Props = {}): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(props));
    return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
}

/**
 * Defines context hook.
 *
 * @returns Readonly context: `{ state, updateState }`.
 */
export const useData = (): ContextProps => $preact.useContext(Context);

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
 * @note Server-side use only, with an exception for automated testing.
 * @note HTTP state is semi-functional on web, but we discourage use outside testing.
 */
export const useHTTP = (): HTTPContextProps => {
    if ($env.isWeb() && !$env.isTest()) {
        throw $env.errServerSideOnly;
    }
    if (!globalObp /* State not initialized? */) {
        throw new Error('Missing `globalObp`.');
    }
    // Props from current `globalObp` will only have an impact on 'initial' HTTP state.
    const state = $obp.get(globalThis, globalObp + '.http', initialHTTPState()) as HTTPState;

    return {
        state, // Current HTTP state.
        updateState: (updates: HTTPPartialState): void => {
            $obp.set(globalThis, globalObp + '.http', $obj.updateDeep(state, updates));
        },
    };
};

/**
 * Converts global into embeddable script code.
 *
 * @returns Global as embeddable script code; for SSR.
 *
 * @note Server-side use only, with an exception for automated testing.
 * @note Dumping global script code on web works, but we discourage use outside testing.
 */
export const globalToScriptCode = (): string => {
    if ($env.isWeb() && !$env.isTest()) {
        throw $env.errServerSideOnly;
    }
    const { state } = useData();

    if (!state /* State not initialized? */) {
        throw new Error('Missing data state.');
    } else if (!globalObp) {
        throw new Error('Missing `globalObp`.');
    }
    const globalObpScriptCode = $obp.toScriptCode(globalObp);

    let scriptCode = globalObpScriptCode.init; // Initialize.
    scriptCode += ' ' + globalObpScriptCode.set + '.html = ' + $json.stringify(state.html) + ';';
    scriptCode += ' ' + globalObpScriptCode.set + '.head = ' + $json.stringify(state.head) + ';';
    scriptCode += ' ' + globalObpScriptCode.set + '.body = ' + $json.stringify(state.body) + ';';
    scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

    return scriptCode;
};
