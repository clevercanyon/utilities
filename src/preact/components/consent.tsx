/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $env, $preact } from '../../index.ts';

/**
 * Defines types.
 */
declare type API = typeof import('../../resources/preact/apis/web/consent.ts');
export type Props = $preact.BasicPropsNoKeyRef<object>;
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
export const useConsent = (): Context => $preact.useContext(ContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Consent(props: Props = {}): $preact.VNode<Props> {
    const promise = $preact.useRef(
        new Promise<API>((resolve): void => {
            if (!$env.isWeb()) return; // It will simply never resolve.
            void import('../../resources/preact/apis/web/consent.ts').then((api) => {
                void api.initialize().then(() => resolve(api));
            });
        }),
    );
    return <ContextObject.Provider value={promise.current}>{props.children}</ContextObject.Provider>;
}
