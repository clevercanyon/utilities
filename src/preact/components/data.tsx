/**
 * Preact component.
 */

import '#@initialize.ts';

import { type C9rProps as FetcherC9rProps } from '#@classes/fetcher.ts';
import { type LazyComponentPromises } from '#@preact/apis/iso.tsx';
import { $app, $class, $env, $is, $json, $obj, $obp, $preact, $str, type $type } from '#index.ts';
import { type default as HeadInstance, type PartialActualState as PartialActualHeadState } from '#preact/components/head.tsx';
import { Component, createContext } from 'preact';

/**
 * Defines data types.
 *
 * `<Data>` state contains some initial `<Head>` state keys. These serve as defaults for `<Head>` when they are not
 * defined elsewhere. e.g., `styleBundle`, `scriptBundle`. `<Data>` state also contains a high-level reference to the
 * current `<Head>` instance, such that it becomes available across all contexts.
 */
export type State = $preact.State<{
    globalObp: string;
    cspNonce: string;
    fetcher: $type.Fetcher;
    lazyCPs: LazyComponentPromises;
    head: {
        instance?: HeadInstance;
    } & Pick<PartialActualHeadState, PassableHeadStateKeys>;
}>;
export type PartialState = $preact.State<{
    globalObp?: State['globalObp'];
    cspNonce?: State['cspNonce'];
    fetcher?: State['fetcher'];
    lazyCPs?: State['lazyCPs'];
    head?: Partial<State['head']>;
}>;
export type PartialStateUpdates = $preact.State<
    Omit<Pick<PartialState, UpdatableStateKeys>, 'head'> & {
        head?: Partial<Pick<State['head'], UpdatableHeadStateKeys>>;
    }
>;
export type Props = $preact.BasicTreeProps<
    Omit<Pick<PartialState, PassableStateKeys>, 'head'> & {
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
    cspNonce: State['cspNonce'];
    head: Pick<PartialActualHeadState, PassableHeadStateKeys>;
}>;
export type PartialGlobalState = $preact.State<{
    cspNonce?: GlobalState['cspNonce'];
    head?: Partial<GlobalState['head']>;
}>;
export type MergeableGlobalState = $preact.State<
    Omit<Pick<PartialGlobalState, MergeableGlobalStateKeys>, 'head'> & {
        head?: Partial<Pick<GlobalState['head'], MergeableGlobalHeadStateKeys>>;
    }
>;

/**
 * Defines passable state keys.
 *
 * - These variables must remain `const`, as they keep types DRY.
 * - Please do not export these variables, they are for internal use only.
 */
const passableStateKeys = ['globalObp', 'cspNonce', 'fetcher', 'lazyCPs', 'head'] as const,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Used only as a type, for now.
    passableHeadStateKeys = ['styleBundle', 'scriptBundle'] as const;

type PassableStateKeys = $type.Writable<typeof passableStateKeys>[number];
type PassableHeadStateKeys = $type.Writable<typeof passableHeadStateKeys>[number];

/**
 * Defines updatable state keys.
 *
 * - These variables must remain `const`, as they keep types DRY.
 * - Please do not export these variables, they are for internal use only.
 */
const updatableStateKeys = ['head'] as const,
    updatableHeadStateKeys = ['instance'] as const;

type UpdatableStateKeys = $type.Writable<typeof updatableStateKeys>[number];
type UpdatableHeadStateKeys = $type.Writable<typeof updatableHeadStateKeys>[number];

/**
 * Defines mergable global state keys.
 *
 * - These variables must remain `const`, as they keep types DRY.
 * - Please do not export these variables, they are for internal use only.
 */
const mergeableGlobalStateKeys = ['cspNonce', 'head'] as const,
    mergeableGlobalHeadStateKeys = ['styleBundle', 'scriptBundle'] as const;

type MergeableGlobalStateKeys = $type.Writable<typeof mergeableGlobalStateKeys>[number];
type MergeableGlobalHeadStateKeys = $type.Writable<typeof mergeableGlobalHeadStateKeys>[number];

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
 * @returns Context; {@see Context}.
 */
export const useData = (): Context => $preact.useContext(ContextObject);

/**
 * Defines fetcher hook.
 *
 * @returns Fetcher; {@see $type.Fetcher}.
 */
export const useFetcher = (): $type.Fetcher => $preact.useContext(ContextObject).state.fetcher;

/**
 * Defines component.
 *
 * `<Data>` is a class component so we have more control over re-renders; e.g., to avoid re-rendering when `<Head>`
 * updates its `instance`. We’re using `Component`, not `$preact.Component`, because this occurs inline. We can’t use
 * our own cyclic utilities inline, only inside functions. So we use `Component` directly from `preact` in this case.
 */
export default class Data extends Component<Props, State> {
    /**
     * Keeps a count of state updates.
     */
    protected stateUpdates: number;

    /**
     * Context tools.
     */
    protected contextTools: {
        updateState: Data['updateState'];
        forceUpdate: Data['forceUpdate'];
    };

    /**
     * Constructor.
     *
     * @param props Props.
     */
    public constructor(props: Props = {}) {
        super(props); // Parent constructor.

        const globalObp = props.globalObp || defaultGlobalObp(),
            fetcher = props.fetcher || defaultFetcher(),
            lazyCPs = props.lazyCPs || defaultLazyCPs();

        lazyCPs.counter = -1; // Always starts @ `-1`.

        this.state = $obj.mergeDeep(
            { cspNonce: '', head: {} }, // Defaults.
            $obj.pick(initialGlobalState(globalObp), mergeableGlobalStateKeys as unknown as string[]),
            $preact.omitProps($obj.pick(props, passableStateKeys as unknown as string[]), ['globalObp', 'fetcher', 'lazyCPs']),
            { $set: { globalObp, fetcher, lazyCPs } }, // Set explicity.
        ) as unknown as State;

        this.stateUpdates = 0; // Initializes counter.
        this.contextTools = {
            updateState: (...args) => this.updateState(...args),
            forceUpdate: (...args) => this.forceUpdate(...args),
        };
    }

    /**
     * Updates component state.
     *
     * This does not allow the use of declarative ops.
     *
     * Returning `null` tells Preact not to update; {@see https://o5p.me/9BaxT3}.
     *
     * @param updates {@see PartialStateUpdates}.
     */
    public updateState<Updates extends PartialStateUpdates>(updates: Updates): void {
        this.setState((currentState: State): State | null => {
            const cleanUpdates = $obj.pick(updates, updatableStateKeys as unknown as string[]) as Updates;
            (cleanUpdates as $type.Writable<Updates>).head = $obj.pick(cleanUpdates.head || {}, updatableHeadStateKeys as unknown as string[]);
            const newState = $obj.updateDeepNoOps(currentState, cleanUpdates) as State;

            if (newState !== currentState) {
                this.stateUpdates++;
                return newState;
            }
            return null;
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
        const sameProps = nextProps === this.props,
            sameState = nextState === this.state;

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
        return <ContextObject.Provider value={{ state: this.state, ...this.contextTools }}>{this.props.children}</ContextObject.Provider>;
    }
}

// ---
// Misc exports.

/**
 * Defines named prop keys for easy reuse.
 *
 * @returns Array of named {@see Data} prop keys.
 */
export const namedPropKeys = (): string[] => passableStateKeys as unknown as string[];

/**
 * Defines default global object path.
 *
 * This is also called upon by our ISO renderer.
 *
 * @returns Default global object path string.
 */
export const defaultGlobalObp = (): string => {
    return $str.obpPartSafe($app.$pkgName) + '.data';
};

/**
 * Defines default fetcher.
 *
 * This is also called upon by our ISO renderer.
 *
 * @param   c9rProps                    Constructor props.
 *
 * @returns {@see $type.Fetcher}          Default fetcher instance.
 */
export const defaultFetcher = (c9rProps?: FetcherC9rProps): $type.Fetcher => {
    return new ($class.getFetcher())(c9rProps);
};

/**
 * Defines default lazy component promises.
 *
 * This is also called upon by our ISO renderer.
 *
 * @returns {@see LazyComponentPromises} Default lazy CPs.
 */
export const defaultLazyCPs = (): LazyComponentPromises => {
    return { counter: -1, promises: [] };
};

/**
 * Produces global state as embeddable script code.
 *
 * @param   state Current `<Data>` state.
 *
 * @returns       Global state as embeddable script code.
 *
 * @requiredEnv ssr -- Server-side only.
 */
export const globalToScriptCode = (state: State): string => {
    if (!$env.isSSR()) throw Error('MYPrYzaC');

    // We use `<Data>` state to acquire `globalObp`.
    const globalScriptCode = $obp.toScriptCode(state.globalObp);

    // We only need mergeable global state keys in script code, because that’s all that script code is used for.
    // Additionally, we only want mergeable global state keys in script code, because we only want JSON-serializable values.

    const globalState = $obj.pick(state, mergeableGlobalStateKeys as unknown as string[]) as $type.Writable<PartialGlobalState>;
    globalState.head = $obj.pick(globalState.head || {}, mergeableGlobalHeadStateKeys as unknown as string[]);

    let scriptCode = globalScriptCode.init; // Initializes global vars in script code.
    scriptCode += ' ' + globalScriptCode.set + ' = ' + $json.stringify(globalState) + ';';

    // We also dump a placeholder for the accompanying fetcher script code.
    scriptCode += state.fetcher ? ' ' + fetcherGlobalToScriptCodeReplacementCode() : '';

    return scriptCode; // To be used in a `<script>` tag.
};

/**
 * Get replacement code for `fetcher.globalToScriptCode`.
 *
 * We use a replacement code because when rendering server-side, fetcher state can be updated by any component; i.e., as
 * rendering occurs throughout a vNode tree. Therefore, it’s not until server-side rendering is completely finished that
 * we can inject a fetcher’s global script code. {@see $preact.iso.renderSPA()}.
 *
 * @returns Replacement code for `fetcher.globalToScriptCode`.
 */
export const fetcherGlobalToScriptCodeReplacementCode = (): string => {
    return "'{%-_{%-fetcher.globalToScriptCode-%}_-%}';";
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
 * @param   globalObp Object path.
 *
 * @returns           Initialized global state.
 */
const initialGlobalState = (globalObp: string): GlobalState => {
    let state; // Initialize.

    // Global state from a prior server-side rendering.
    if ($env.isWeb() && (state = $obp.get(globalThis, globalObp) as $type.Writable<PartialGlobalState>)) {
        state = $obj.pick(state, mergeableGlobalStateKeys as unknown as string[]);
        state.head = $obj.pick(state.head || {}, mergeableGlobalHeadStateKeys as unknown as string[]);
    }
    return (state || { cspNonce: '', head: {} }) as GlobalState;
};
