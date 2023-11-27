/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $preact, type $type } from '../../index.ts';
import { type PartialActualState as PartialActualHeadState } from './head.tsx';

/**
 * Defines types.
 */
export type State = $preact.State<{
    theme: string;
    themeIsDark: boolean;

    type: string;
    head: PartialActualHeadState;
    data: $type.Object;
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
        return $preact.initialState(
            {
                theme: 'default',
                themeIsDark: true,

                type: 'default',
                head: {},
                data: {},
            },
            $preact.omitProps(props, ['children']),
        );
    });
    return <ContextObject.Provider value={{ state, updateState }}>{props.children}</ContextObject.Provider>;
}
