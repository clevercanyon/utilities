/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $preact, type $type } from '../../index.ts';

/**
 * Defines types.
 */
export type State = $preact.State<{
    variant: string;
}>;
export type PartialState = $type.PartialDeep<State>;
export type Props = $preact.BasicPropsNoKeyRef<PartialState>;
export type Context = $preact.Context<{
    state: State;
    updateState: $preact.StateDispatcher<PartialState>;
}>;

/**
 * Defines context.
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
export const useLayout = (): Context => $preact.useContext(ContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function LayoutContext(props: Props): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducedState((): State => {
        return $preact.initialState({ variant: 'default' }, $preact.omitProps(props, ['children']));
    });
    return <ContextObject.Provider value={{ state, updateState }}>{props.children}</ContextObject.Provider>;
}
