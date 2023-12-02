/**
 * Preact component.
 */

import '#@init.ts';

import { $app, $env, $is, $json, $obj, $obp, $preact, $str, type $type } from '#index.ts';
import { type default as HeadInstance, type PartialActualState as PartialActualHeadState } from '#preact/components/head.tsx';
import { Component, createContext } from 'preact';

/**
 * Defines data types.
 *
 * `<Data>` state contains some initial, passable `<Head>` state keys. These serve as default props for `<Head>` when
 * they are not defined elsewhere. e.g., `styleBundle`, `scriptBundle`. `<Data>` state also contains a high-level
 * reference to the current `<Head>` instance, such that it becomes available across all contexts.
 */
export type State = $preact.State<{
    globalObp: string;
    fetcher: $preact.iso.Fetcher;
    head: {
        instance?: HeadInstance;
    } & Pick<PartialActualHeadState, PassableHeadStateKeys>;
}>;
export type PartialState = $preact.State<{
    globalObp?: State['globalObp'];
    fetcher?: State['fetcher'];
    head?: Partial<State['head']>;
}>;
export type PartialStateUpdates = $preact.State<
    Omit<Pick<PartialState, UpdatableStateKeys>, 'head'> & {
        head?: Partial<Pick<State['head'], UpdatableHeadStateKeys>>;
    }
>;
export type Props = $preact.BasicTreeProps<
    Omit<PartialState, 'head'> & {
        head?: Partial<Pick<State['head'], PassableHeadStateKeys>>;
    }
>;
export type Context = $preact.Context<{
    state: State;
    updateState: Data['updateState'];
    forceUpdate: Data['forceUpdate'];
}>;

/**
 * Defines global types.
 *
 * Global, meaning via a global variable. Global state is how we store server-side rendering info and share it with the
 * browser, which reads global ISO state. Global state is made available to a browser via script code. Please remember,
 * all of these must be JSON serializable. Why? We dump them into preact ISO script code.
 */
export type GlobalState = $preact.State<{
    http: { status: number };
    head: Pick<PartialActualHeadState, PassableHeadStateKeys>;
}>;
export type PartialGlobalState = $preact.State<{
    http?: Partial<GlobalState['http']>;
    head?: Partial<GlobalState['head']>;
}>;
export type MergeableGlobalState = $preact.State<
    Omit<Pick<PartialGlobalState, MergeableGlobalStateKeys>, 'head'> & {
        head?: Partial<Pick<GlobalState['head'], MergeableGlobalHeadStateKeys>>;
    }
>;
export type PartialGlobalStateUpdates = $preact.State<
    Omit<Pick<PartialGlobalState, UpdatableGlobalStateKeys>, 'http'> & {
        http?: Partial<Pick<GlobalState['http'], UpdatableGlobalHTTPStateKeys>>;
    }
>;

/**
 * Defines global HTTP types.
 *
 * HTTP state lives within global state. We export an SSR-only hook so it’s easy to access its psuedo-context within
 * global state, which is what is being defined here. For further details, {@see useHTTP()}.
 */
export type HTTPContext = $preact.Context<{
    state: GlobalState['http'];
    updateState: $preact.StateDispatcher<PartialGlobalStateUpdates['http']>;
}>;

/**
 * Defines passable `<Head>` state keys.
 *
 * - This variable must remain a `const`, as it keeps types DRY.
 * - Please do not export this variable, it is for internal use only.
 */
const passableHeadStateKeys = ['styleBundle', 'scriptBundle'] as const;
type PassableHeadStateKeys = $type.Writable<typeof passableHeadStateKeys>[number];

/**
 * Defines updatable keys in state.
 *
 * - These variables must remain `const`, as they keep types DRY.
 * - Please do not export these variables, they are for internal use only.
 */
const updatableStateKeys = ['head'] as const;
const updatableHeadStateKeys = ['instance'] as const;

type UpdatableStateKeys = $type.Writable<typeof updatableStateKeys>[number];
type UpdatableHeadStateKeys = $type.Writable<typeof updatableHeadStateKeys>[number];

/**
 * Defines mergable keys in global state.
 *
 * - These variables must remain `const`, as they keep types DRY.
 * - Please do not export these variables, they are for internal use only.
 */
const mergeableGlobalStateKeys = ['head'] as const;
const mergeableGlobalHeadStateKeys = ['styleBundle', 'scriptBundle'] as const;

type MergeableGlobalStateKeys = $type.Writable<typeof mergeableGlobalStateKeys>[number];
type MergeableGlobalHeadStateKeys = $type.Writable<typeof mergeableGlobalHeadStateKeys>[number];

/**
 * Defines updatable keys in global state.
 *
 * - These variables must remain `const`, as they keep types DRY.
 * - Please do not export these variables, they are for internal use only.
 */
const updatableGlobalStateKeys = ['http'] as const;
const updatableGlobalHTTPStateKeys = ['status'] as const;

type UpdatableGlobalStateKeys = $type.Writable<typeof updatableGlobalStateKeys>[number];
type UpdatableGlobalHTTPStateKeys = $type.Writable<typeof updatableGlobalHTTPStateKeys>[number];

/**
 * Defines context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ContextObject = createContext({} as Context);

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useData = (): Context => $preact.useContext(ContextObject);

/**
 * Defines HTTP pseudo context hook.
 *
 * @returns Pseudo context {@see HTTPContext}.
 *
 * @requiredEnv ssr -- This hook must only be used server-side.
 */
export const useHTTP = (): HTTPContext => {
    if (!$env.isSSR()) throw $env.errSSROnly;

    const { state } = useData();

    // Intentionally not exporting this. HTTP state should only be accessed via `useHTTP()` hook.
    // An exception is that our ISO prerenderer does some reads/writes using `globalObp`, after prerendering.
    const getHTTPState = (): GlobalState['http'] => {
        return $obp.get(globalThis, state.globalObp + '.http') as GlobalState['http'];
    };
    return {
        state: getHTTPState(),
        // Note: This does not allow the use of declarative ops.
        updateState: (updates) => {
            updates = $obj.pick(updates, updatableGlobalHTTPStateKeys as unknown as string[]);
            $obp.set(globalThis, state.globalObp + '.http', $obj.updateDeepNoOps(getHTTPState(), updates));
        },
    };
};

/**
 * Defines component.
 *
 * `<Data>` is a class component so we have more control over re-renders; e.g., to avoid re-rendering when `<Head>`
 * updates its `instance`. We’re using `Component`, not `$preact.Component`, because this occurs inline. We can’t use
 * our own cyclic utilities inline, only inside functions. So we use `Component` directly from `preact` in this case.
 *
 * The order of precedence in the initial deep state merge, from left to right, is: relevant keys in global state,
 * followed by relevant `<Data>` props; and then `<Data>` state keys satisfied explicitly by our initializer.
 */
export default class Data extends Component<Props, State> {
    /**
     * Constructor.
     *
     * @param props Props.
     */
    public constructor(props: Props = {}) {
        super(props); // Parent constructor.

        const globalObp = props.globalObp || defaultGlobalObp();
        const globalState = initialGlobalState(globalObp, props);
        const fetcher = props.fetcher || $preact.iso.replaceNativeFetch();

        this.state = $obj.mergeDeep(
            $obj.pick(globalState, mergeableGlobalStateKeys as unknown as string[]),
            $preact.omitProps(props, ['globalObp', 'fetcher', 'children']), //
            { $set: { globalObp, fetcher }, head: {} },
        ) as unknown as State;
    }

    /**
     * Updates component state.
     *
     * This does not allow the use of declarative ops.
     *
     * @param updates Partial state updates; {@see UpdatableStateKeys} {@see UpdatableHeadStateKeys}.
     */
    public updateState<Updates extends PartialStateUpdates>(updates: Updates): void {
        this.setState((currentState: State): Updates | null => {
            const cleanUpdates = $obj.pick(updates, updatableStateKeys as unknown as string[]) as $type.Writable<Updates>;
            cleanUpdates.head = $obj.pick(cleanUpdates.head || {}, updatableHeadStateKeys as unknown as string[]);

            const newState = $obj.updateDeepNoOps(currentState, cleanUpdates);
            // Returning `null` tells Preact no; {@see https://o5p.me/9BaxT3}.
            return newState !== currentState ? (newState as Updates) : null;
        });
    }

    /**
     * Determines whether component should update.
     *
     * @param   nextProps Next props.
     * @param   nextState Next state.
     *
     * @returns           True if component should update.
     */
    public shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        const sameProps = nextProps === this.props;
        const sameState = nextState === this.state;

        if (!sameProps) return true; // Must re-render.
        if (sameState) return false; // No reason to re-render.

        const nextRelevantState = $obj.pick(nextState, updatableStateKeys as unknown as string[]) as $type.Writable<PartialState>;
        nextRelevantState.head = $obj.pick(nextRelevantState.head || {}, updatableHeadStateKeys as unknown as string[]);

        const currentRelevantState = $obj.pick(this.state, updatableStateKeys as unknown as string[]) as $type.Writable<PartialState>;
        currentRelevantState.head = $obj.pick(currentRelevantState.head || {}, updatableHeadStateKeys as unknown as string[]);

        // We don’t want to re-render when `<Head>` simply updates its instance.
        delete nextRelevantState.head.instance, delete currentRelevantState.head.instance;

        if ($is.deepEqual(nextRelevantState, currentRelevantState)) {
            return false; // No reason to re-render.
        }
        return true; // Otherwise.
    }

    /**
     * Renders component.
     *
     * @returns VNode / JSX element tree.
     */
    public render(): $preact.VNode<Props> {
        return (
            <ContextObject.Provider
                value={{
                    state: this.state,
                    updateState: (...args) => this.updateState(...args),
                    forceUpdate: (...args) => this.forceUpdate(...args),
                }}
            >
                {this.props.children}
            </ContextObject.Provider>
        );
    }
}

// ---
// Misc exports.

/**
 * Defines named prop keys for easy reuse.
 *
 * @returns Array of named {@see Data} prop keys; i.e., excludes `children`.
 */
export const namedPropKeys = () => ['globalObp', 'fetcher', 'head'];

/**
 * Defines default global object path.
 *
 * This is also called upon by our ISO prerenderer.
 */
export const defaultGlobalObp = (): string => {
    return $str.obpPartSafe($app.pkgName) + '.preactISOData';
};

/**
 * Converts global state into embeddable script code.
 *
 * @param   state Current `<Data>` state.
 *
 * @returns       Global state as embeddable script code; for preact ISO.
 *
 * @requiredEnv ssr -- This utility must only be used server-side.
 */
export const globalToScriptCode = (state: State): string => {
    if (!$env.isSSR()) throw $env.errSSROnly;

    // We use `<Data>` state to acquire `globalObp`.
    const globalScriptCode = $obp.toScriptCode(state.globalObp);

    // We only need mergeable global state keys in script code, because that’s all that script code is used for.
    // Additionally, we only want mergeable global state keys in script code, because we only want JSON-serializable values.

    const cleanGlobalState = $obj.pick(state, mergeableGlobalStateKeys as unknown as string[]) as $type.Writable<PartialGlobalState>;
    cleanGlobalState.head = $obj.pick(cleanGlobalState.head || {}, mergeableGlobalHeadStateKeys as unknown as string[]);

    let scriptCode = globalScriptCode.init; // Initializes global vars in script code.
    scriptCode += ' ' + globalScriptCode.set + ' = ' + $json.stringify(cleanGlobalState) + ';';

    // We also dump the script code from our accompanying fetcher.
    scriptCode += state.fetcher ? ' ' + state.fetcher.globalToScriptCode() : '';

    return scriptCode; // To be used in a `<script>` tag.
};

// ---
// Misc utilities.

/**
 * Produces initial global state.
 *
 * Global, meaning via a global variable. Global state is how we store server-side rendering info and share it with the
 * browser, which reads global ISO state. Global state is made available to a browser via script code. Please remember,
 * all of these must be JSON serializable. Why? We dump them into preact ISO script code.
 *
 * Our initial HTTP state is always the same, and only relevant server-side. Also, HTTP state is pseudo-state stored in
 * the global state variable, but is not actually a part of the `<Data>` state. It’s just handled here in the `<Data>`
 * layer along with the {@see useHTTP()} hook, which provides a way to update the global HTTP state.
 *
 * The order of precedence in the initial deep state merge, from left to right, is: global state from a prior
 * server-side rendering; i.e., if now on the web; followed by relevant `<Data>` props, which form our default state,
 * and then finally any props satisfied explicitly by our global state initializer.
 *
 * @param   globalObp Object path.
 * @param   props     Component props.
 *
 * @returns           Initialized global state.
 */
const initialGlobalState = (globalObp: string, props: Props): GlobalState => {
    let cleanSSRState; // Initialize.

    // Global state from a prior server-side rendering.
    if ($env.isWeb() && (cleanSSRState = $obp.get(globalThis, globalObp) as $type.Writable<PartialGlobalState>)) {
        cleanSSRState = $obj.pick(cleanSSRState, mergeableGlobalStateKeys as unknown as string[]);
        cleanSSRState.head = $obj.pick(cleanSSRState.head || {}, mergeableGlobalHeadStateKeys as unknown as string[]);
    }
    // Default state based only on props.
    const propState = {
        http: { status: 200 }, // Our initial HTTP state is always the same.
        head: $obj.pick(props.head || {}, mergeableGlobalHeadStateKeys as unknown as string[]),
    };
    // Current prop state is merged into global SSR state.
    const state = $obj.mergeDeep(cleanSSRState || {}, propState) as GlobalState;

    // Synchronizes global object path.
    $obp.set(globalThis, globalObp, state);

    return state; // Initial state.
};
