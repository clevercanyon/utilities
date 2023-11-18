/**
 * Preact component.
 */

import '../../resources/init.ts';

import { createContext } from 'preact';
import { $env, $preact } from '../../index.ts';

/**
 * Defines types.
 */
declare type API = typeof import('../../resources/preact/apis/web/turnstile.ts');
export type Props = $preact.BasicPropsNoKeyRef<object>;
export type ActualContext = Promise<API>;
export type Context = ReturnType<API['deploy']>;

/**
 * Defines context object.
 *
 * Using `createContext()`, not `$preact.createContext()`, because this occurs inline. We can’t use our own cyclic
 * utilities inline, only inside functions. So we use `createContext()` directly from `preact` in this specific case.
 */
const ActualContextObject = createContext({} as ActualContext);

/**
 * Defines context hook.
 *
 * @returns Context {@see Context}.
 */
export const useTurnstile = async (): Context => {
    return $preact.useContext(ActualContextObject).then(({ deploy }): Context => deploy());
};

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function Turnstile(props: Props = {}): $preact.VNode<Props> {
    const promise = $preact.useRef(
        new Promise<API>((resolve): void => {
            if (!$env.isWeb()) return; // It will simply never resolve.
            void import('../../resources/preact/apis/web/turnstile.ts').then((api): void => {
                void api.initialize().then((): void => resolve(api));
            });
        }),
    );
    return <ActualContextObject.Provider value={promise.current}>{props.children}</ActualContextObject.Provider>;
}
