/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $dom, $env, $obj, $preact } from '../../index.ts';

/**
 * Defines types.
 */
export type State = $preact.State<
    Partial<$preact.Intrinsic['html']> & {
        lang: string; // String value only.
    } & { [x in $preact.ClassPropVariants]?: $preact.Classes }
>;
export type PartialState = Partial<State>;
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
    return $obj.mergeDeep({ lang: 'en-US' }, $preact.omitProps(props, ['children'])) as unknown as State;
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
    const [actualState, updateState] = $preact.useReducer(reduceState, undefined, () => initialState(props));

    const state = $preact.useMemo((): State => {
        return {
            ...$preact.omitProps(actualState, ['class', 'lang']),
            class: $preact.classes(actualState),
            lang: actualState.lang,
        };
    }, [actualState]);

    if ($env.isWeb()) {
        $preact.useLayoutEffect(() => {
            $dom.newAtts($dom.require('html'), state);
        }, [state]);
    }
    return (
        <Context.Provider value={{ state, updateState }}>
            {/* Client-side renders context only. <html> server-side. */}
            {/* eslint-disable-next-line jsx-a11y/html-has-lang -- lang is ok. */}
            {$env.isWeb() ? <>{props.children}</> : <html {...state}>{props.children}</html>}
        </Context.Provider>
    );
}

/**
 * Defines context hook.
 *
 * @returns Context props {@see ContextProps}.
 */
export const useHTML = (): ContextProps => $preact.useContext(Context);
