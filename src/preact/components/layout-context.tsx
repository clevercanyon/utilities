/**
 * Preact component.
 */

import { createContext } from 'preact';
import { $preact } from '../../index.ts';

/**
 * Props interface.
 */
export type Props = Omit<
    $preact.Props<{
        variant?: string;
    }>,
    $preact.ClassPropVariants
>;
export type ContextProps = Readonly<{
    variant: string | 'default';
}>;

/**
 * Defines context.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const Context = createContext({} as ContextProps);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element.
 */
export default function LayoutContext(props: Props): $preact.VNode<Props> {
    return <Context.Provider value={{ variant: props.variant || 'default' }}>{props.children}</Context.Provider>;
}

/**
 * Defines context hook.
 *
 * @returns Context props {@see ContextProps}.
 */
export const useLayout = (): ContextProps => $preact.useContext(Context);
