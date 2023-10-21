/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $app, $env, $is, $json, $obj, $obp, $preact, $str, type $type } from '../../index.ts';
import { type PartialState as PartialHeadState } from './head.tsx';

/**
 * Defines data types.
 *
 * @note `<Data>` props contains some initial passable `<Head>` component props.
 *       These props only have an impact on initial `<Head>` state; {@see PassableHeadProps}.
 *       e.g., `mainStyleBundle`, `mainScriptBundle`.
 * ---
 * @note `<Head>` state is stored in `<Data>` so it’s available
 *       across all contexts; i.e., at any nested level of the DOM.
 */
export type State = $preact.State<{
    globalObp: string;
    fetcher: $preact.iso.Fetcher;
    head: PartialHeadState;
}>;
export type PartialState = $preact.State<{
    globalObp?: string;
    fetcher?: $preact.iso.Fetcher;
    head?: PartialHeadState;
}>;
export type PartialStateUpdates = Omit<PartialState, 'globalObp'>;

export type Props = Omit<
    $preact.Props<
        Omit<PartialState, 'head'> & {
            head?: Pick<PartialHeadState, PassableHeadProps>;
        } // Passable head props only.
    >, // Omits class prop variants.
    $preact.ClassPropVariants
>;
export type ContextProps = $preact.Context<{
    state: State;
    updateState: $preact.Dispatch<PartialStateUpdates>;
}>;
export type HTTPContextProps = $preact.Context<{
    state: GlobalState['http'];
    updateState: $preact.Dispatch<PartialGlobalStateUpdates['http']>;
}>;

/**
 * Defines global types.
 *
 * Global, meaning via a global variable.
 *
 * @note All of these must be JSON serializable.
 *       Why? We dump it into preact ISO script code.
 * ---
 * @note Global state is how we store server-side rendering info
 *       and share it with the browser, which reads global ISO state.
 *       Global state is made available to a browser via script code.
 */
export type GlobalState = $preact.State<{
    http: { status: number };
    head: Pick<PartialHeadState, PassableHeadProps>;
}>;
export type PartialGlobalState = $preact.State<{
    http?: { status?: number };
    head?: Pick<PartialHeadState, PassableHeadProps>;
}>;
export type PartialGlobalStateUpdates = Omit<PartialGlobalState, 'head'>;

/**
 * Defines default global object path.
 */
export const defaultGlobalObp = (): string => {
    return $str.obpPartSafe($app.pkgName) + '.preactISOData';
};

/**
 * Defines passable head props.
 *
 * @note All of these must be JSON serializable.
 *       Why? We dump it into preact ISO script code.
 * ---
 * @note `<Data>` props contains some initial passable `<Head>` component props.
 *       These props only have an impact on initial `<Head>` state.
 *       e.g., `mainStyleBundle`, `mainScriptBundle`.
 * ---
 * @note Must remain a `const`. This keeps types DRY in this file.
 */
const passableHeadProps = ['mainStyleBundle', 'mainScriptBundle'] as const;
type PassableHeadProps = $type.Writable<typeof passableHeadProps>[number];

/**
 * Defines context.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const Context = createContext({} as ContextProps);

/**
 * Produces initial global state.
 *
 * @param   globalObp Object path.
 * @param   props     Component props.
 *
 * @returns           Initialized global state.
 */
const initialGlobalState = (globalObp: string, props: Props): GlobalState => {
    const webState = $env.isWeb() ? $obp.get(globalThis, globalObp) : {};

    const state = $obj.mergeDeep(
        { http: { status: 200 }, head: props.head || {} },
        // Our initial HTTP state is always the same, and only relevant server-side.
        // In fact, HTTP state should only be updated server-side via `useHTTP()`.
        $obj.omit(webState || {}, ['http']),
    ) as unknown as GlobalState;

    // Synchronizes global object path.
    $obp.set(globalThis, globalObp, state);

    return state; // Initial state.
};

/**
 * Produces initial state.
 *
 * @param   props Component props.
 *
 * @returns       Initialized state.
 */
const initialState = (props: Props): State => {
    const globalObp = props.globalObp || defaultGlobalObp();
    const global = initialGlobalState(globalObp, props); // @ `globalObp`.
    const fetcher = props.fetcher || $preact.iso.replaceNativeFetch();

    const state = $obj.mergeDeep(
        { head: {} }, // Before props.
        $preact.omitProps(global, ['http']),
        $preact.omitProps(props, ['children']),
        { $set: { globalObp, fetcher } },
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
const reduceState = (state: State, updates: PartialStateUpdates): State => {
    return $obj.updateDeep(state, $obj.omit(updates, ['globalObp'])) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note Using `shouldComponentUpdate()` to gain control over renders at this super high level of the DOM tree.
 *       The goal is to avoid re-rendering when `<Data>` state changes, if possible, because it re-renders everything.
 *       In particular, `<Head>` does state updates to initialize itself, and we definitely don’t want to re-render.
 */
export default function Data(this: $preact.Component<Props>, props: Props = {}): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(props));

    this.shouldComponentUpdate = (nextProps: Props, nextState: State): boolean => {
        const sameProps = nextProps === props;
        const sameState = nextState === state;

        if (!sameProps) return true; // Must re-render.
        if (sameState) return false; // No reason to re-render.

        const { head: unusedꓺnextHead, ...nextStateWithoutHead } = nextState;
        const { head: unusedꓺcurrentHead, ...currentStateWithoutHead } = state;

        if ($is.deepEqual(nextStateWithoutHead, currentStateWithoutHead)) {
            return false; // No reason to re-render. Only `<Head>` updating.
        }
        return true; // Otherwise.
    };
    return <Context.Provider value={{ state, updateState }}>{props.children}</Context.Provider>;
}

/**
 * Defines context hook.
 *
 * @returns Context props {@see ContextProps}.
 */
export const useData = (): ContextProps => $preact.useContext(Context);

/**
 * Defines HTTP pseudo context hook.
 *
 * @returns Pseudo context props {@see HTTPContextProps}.
 *
 * @note Server-side use only, with an exception for automated testing.
 * @note HTTP state is semi-functional on web, but we discourage use outside testing.
 */
export const useHTTP = (): HTTPContextProps => {
    if ($env.isWeb() && !$env.isTest()) {
        throw $env.errServerSideOnly;
    }
    const { state } = useData();

    if (!state || !state.globalObp) {
        throw new Error('Missing `globalObp`.');
    }
    const httpState = $obp.get(globalThis, state.globalObp + '.http') as GlobalState['http'];

    return {
        state: httpState as unknown as HTTPContextProps['state'],
        updateState: (updates: Parameters<HTTPContextProps['updateState']>[0]): ReturnType<HTTPContextProps['updateState']> => {
            $obp.set(globalThis, state.globalObp + '.http', $obj.mergeDeep(httpState, updates));
        },
    };
};

/**
 * Converts global state into embeddable script code.
 *
 * @returns Global state as embeddable script code; for preact ISO.
 *
 * @note Server-side use only, with an exception for automated testing.
 * @note Dumping global script code on web works, but we discourage use outside testing.
 */
export const globalToScriptCode = (): string => {
    if ($env.isWeb() && !$env.isTest()) {
        throw $env.errServerSideOnly;
    }
    const { state } = useData();
    const { state: httpState } = useHTTP();

    if (!state || !state.globalObp) {
        throw new Error('Missing `globalObp`.');
    } else if (!httpState || !httpState.status) {
        throw new Error('Missing `httpState`.');
    }
    const globalScriptCode = $obp.toScriptCode(state.globalObp);

    const httpProps = httpState; // All of this must be JSON serializable.
    const headProps = $obj.pick(state.head, passableHeadProps as unknown as PassableHeadProps[]);

    let scriptCode = globalScriptCode.init; // Initializes global variables.
    scriptCode += ' ' + globalScriptCode.set + '.http = ' + $json.stringify(httpProps) + ';';
    scriptCode += ' ' + globalScriptCode.set + '.head = ' + $json.stringify(headProps) + ';';

    // We also dump the script code from our accompanying fetcher.
    scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

    return scriptCode; // i.e., Global variables to be used in a `<script>` tag.
};
