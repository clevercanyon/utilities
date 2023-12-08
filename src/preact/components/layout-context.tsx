/**
 * Preact component.
 */

import '#@init.ts';

import { $env, $preact, type $type } from '#index.ts';
import { type PartialActualState as PartialActualHeadState } from '#preact/components/head.tsx';
import { createContext } from 'preact';

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
export type Props = $preact.BasicTreeProps<PartialState>;
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
    const brand = $env.get('APP_BRAND') as $type.Brand;
    const [state, updateState] = $preact.useReducedState((): State => {
        return $preact.initialState(
            {
                theme: 'default',
                themeIsDark: brand.theme.isDark,

                type: 'default',
                head: {},
                data: {},
            },
            $preact.omitProps(props, ['children']),
        );
    });
    return <ContextObject.Provider value={{ state, updateState }}>{props.children}</ContextObject.Provider>;
}
