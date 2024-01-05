/**
 * Preact component.
 */

import '#@initialize.ts';

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
    fetcher: $type.Fetcher;
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
    head: Pick<PartialActualHeadState, PassableHeadStateKeys>;
}>;
export type PartialGlobalState = $preact.State<{
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
const passableStateKeys = ['globalObp', 'fetcher', 'head'] as const,
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
const mergeableGlobalStateKeys = ['head'] as const,
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
            fetcher = props.fetcher || defaultFetcher(globalObp);

        this.state = $obj.mergeDeep(
            $obj.pick(initialGlobalState(globalObp), mergeableGlobalStateKeys as unknown as string[]),
            $preact.omitProps($obj.pick(props, passableStateKeys as unknown as string[]), ['globalObp', 'fetcher']), //
            { $set: { globalObp, fetcher }, head: {} }, // Also ensures that `head` exists.
        ) as unknown as State;

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
     * @param updates {@see PartialStateUpdates}.
     */
    public updateState<Updates extends PartialStateUpdates>(updates: Updates): void {
        // Returning `null` tells Preact not to update; {@see https://o5p.me/9BaxT3}.
        this.setState((currentState: State): Updates | null => {
            const cleanUpdates = $obj.pick(updates, updatableStateKeys as unknown as string[]) as $type.Writable<Updates>;
            cleanUpdates.head = $obj.pick(cleanUpdates.head || {}, updatableHeadStateKeys as unknown as string[]);

            const newState = $obj.updateDeepNoOps(currentState, cleanUpdates);
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
 * This is also called upon by our ISO prerenderer.
 *
 * @returns Default global object path.
 */
export const defaultGlobalObp = (): string => {
    return $str.obpPartSafe($app.$pkgName) + '.preactISOData';
};

/**
 * Defines default fetcher.
 *
 * This is also called upon by our ISO prerenderer.
 *
 * @param   globalObp                    Default is {@see defaultGlobalObp()}.
 *
 * @returns {@see $type.Fetcher}           Default fetcher instance.
 */
export const defaultFetcher = (globalObp?: string): $type.Fetcher => {
    return new ($class.getFetcher())({ globalObp: globalObp || defaultGlobalObp() });
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
    return (state || { head: {} }) as GlobalState;
};
