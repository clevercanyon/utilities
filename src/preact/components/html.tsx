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
        [x in $preact.ClassPropVariants]?: $preact.Classes;
    }
>;
export type PartialState = Partial<State>;
export type PartialStateUpdates = PartialState;
export type Props = $preact.BasicPropsNoKeyRef<PartialState>;

export type Context = $preact.Context<{
    state: State;
    updateState: $preact.Dispatcher<PartialStateUpdates>;
}>;

/**
 * Defines context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ContextObject = createContext({} as Context);

/**
 * Produces initial state.
 *
 * @param   props Component props.
 *
 * @returns       Initialized state.
 */
const initialState = (props: Props): State => {
    return $obj.mergeDeep({ lang: 'en-US', dir: 'ltr' }, $preact.omitProps(props, ['children'])) as unknown as State;
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
            ...$preact.omitProps(actualState, ['class']),
            class: $preact.classes(actualState),
        };
    }, [actualState]);

    if ($env.isWeb()) {
        $preact.useLayoutEffect(() => {
            $dom.newAtts($dom.html(), state);
        }, [state]);
    }
    return (
        <ContextObject.Provider value={{ state, updateState }}>
            {/* Client-side renders context only. <html> server-side. */}
            {/* eslint-disable-next-line jsx-a11y/html-has-lang -- lang is ok. */}
            {$env.isWeb() ? <>{props.children}</> : <html {...state}>{props.children}</html>}
        </ContextObject.Provider>
    );
}

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useHTML = (): Context => $preact.useContext(ContextObject);
