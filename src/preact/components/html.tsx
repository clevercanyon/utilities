/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $obj, $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type State = $preact.State<
    Partial<$preact.JSX.IntrinsicElements['html']> & {
        lang: string; // String value only.
    } & { [x in $preact.ClassPropVariants]?: $preact.Classes }
>;
export type PartialState = $preact.State<Partial<State>>;
export type PartialStateUpdates = PartialState;
export type Props = $preact.Props<PartialState>;

export type ContextProps = $preact.Context<{
    state: State;
    updateState: $preact.Dispatch<PartialStateUpdates>;
}>;

/**
 * Defines context.
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
const initialState = (props: Props): State => {
    return $obj.mergeDeep({ lang: 'en' }, $preact.omitProps(props, ['children'])) as unknown as State;
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
    return $obj.updateDeep(state, updates) as unknown as State;
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function HTML(props: Props = {}): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(props));
    return (
        <Context.Provider value={{ state, updateState }}>
            <html
                {...{
                    ...$preact.omitProps(state, ['class', 'lang']),
                    class: $preact.classes(state, 'preact'),
                    lang: state.lang,
                }}
            >
                {props.children}
            </html>
        </Context.Provider>
    );
}

/**
 * Defines context hook.
 *
 * @returns Context props {@see ContextProps}.
 */
export const useHTML = (): ContextProps => $preact.useContext(Context);
