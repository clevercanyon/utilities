/**
 * Preact component.
 */

import '#@initialize.ts';

import { $dom, $env, $preact } from '#index.ts';
import { createContext } from 'preact';

/**
 * Defines types.
 */
export type ActualState = $preact.State<
    Partial<$preact.Intrinsic['html']> & {
        [x in $preact.ClassPropVariants]?: $preact.Classes;
    } & {
        lang?: string; // String value only.
        dir?: string; // String value only.
    }
>;
export type State = $preact.State<
    Partial<$preact.Intrinsic['html']> & {
        lang: string; // Populated by computed state.
        dir: string; // Populated by computed state.
    }
>;
export type PartialActualState = Partial<ActualState>;
export type PartialActualStateUpdates = PartialActualState;
export type Props = $preact.BasicTreeProps<PartialActualState>;
export type Context = $preact.Context<{
    state: State;
    updateState: $preact.StateDispatcher<PartialActualStateUpdates>;
}>;

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
export const useHTML = (): Context => $preact.useContext(ContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function HTML(props: Props = {}): $preact.VNode<Props> {
    const { state: layoutState } = $preact.useLayout();
    const [actualState, updateState] = $preact.useReducedState((): ActualState => {
        return $preact.initialState($preact.omitProps(props, ['children']));
    });
    const state = $preact.useMemo((): State => {
        return {
            ...$preact.omitProps(actualState, ['lang', 'dir', 'class']),
            lang: actualState.lang || 'en-US',
            dir: actualState.dir || 'ltr',
            class: $preact.classes(actualState, layoutState && layoutState.theme + '-theme'),
        };
    }, [actualState]);

    if ($env.isWeb()) {
        const clipboard = $preact.useClipboard();

        $preact.useLayoutEffect((): void => {
            $dom.newAtts($dom.html(), state);
        }, [state]);

        $preact.useEffect((): void => {
            void clipboard.then(({ addListeners }) => void addListeners());
            void import('#@preact/apis/web/elements/x-hash.ts').then((module): void => {
                module.define(); // Defines `<x-hash>`: `CustomHTMLHashElement`.
            });
        }, []);
    }
    return (
        <ContextObject.Provider value={{ state, updateState }}>
            {/* eslint-disable-next-line jsx-a11y/html-has-lang -- lang is ok. */}
            {$env.isWeb() ? <>{props.children}</> : <html {...state}>{props.children}</html>}
        </ContextObject.Provider>
    );
}
