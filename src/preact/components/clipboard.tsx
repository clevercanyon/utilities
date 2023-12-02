/**
 * Preact component.
 */

import '#@init.ts';

import { $env, $preact } from '#index.ts';
import { createContext } from 'preact';

/**
 * Defines types.
 */
declare type API = typeof import('#@preact/apis/web/clipboard.ts');
export type Props = $preact.BasicTreeProps<{}>;
export type Context = Promise<API>;

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
export const useClipboard = (): Context => $preact.useContext(ContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Clipboard(props: Props = {}): $preact.VNode<Props> {
    const promise = $preact.useRef(
        new Promise<API>((resolve): void => {
            if (!$env.isWeb()) return; // It will simply never resolve.
            void import('#@preact/apis/web/clipboard.ts').then((api): void => {
                void api.initialize().then((): void => resolve(api));
            });
        }),
    );
    return <ContextObject.Provider value={promise.current}>{props.children}</ContextObject.Provider>;
}
