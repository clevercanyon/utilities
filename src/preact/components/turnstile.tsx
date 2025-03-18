/**
 * Preact component.
 */

import '#@initialize.ts';

import { $env, $is, $preact, type $type } from '#index.ts';
import { createContext } from 'preact';

/**
 * Defines types.
 */
declare type API = typeof import('#@preact/apis/web/turnstile.ts');
export type Props = $preact.BasicTreeProps<{}>;
export type Context = {
    promise: Promise<API>;
    effect: (ers: HTMLElement | $preact.Ref<HTMLElement> | string) => () => () => void;
};

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
export const useTurnstile = (): Context => $preact.useContext(ContextObject);

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
            void import('#@preact/apis/web/turnstile.ts').then((api): void => {
                void api.initialize().then((): void => resolve(api));
            });
        }),
    );
    const effect = $preact.useRef((ers: HTMLElement | $preact.Ref<HTMLElement> | string): (() => () => void) => {
        return (): (() => void) => {
            let tsRender: {
                remove: $type.Turnstile['remove'];
                id: ReturnType<$type.Turnstile['render']>;
            };
            void promise.current.then(({ deploy, siteKey }): void => {
                void deploy().then((turnstile): void => {
                    tsRender = {
                        remove: (...args) => turnstile.remove(...args),
                        id: turnstile.render(($is.object(ers) ? ers.current || ers : ers) as HTMLElement | string, {
                            sitekey: siteKey(),
                            'response-field-name': 'turnstile',
                        }),
                    };
                });
            });
            return (): void => {
                // Unmount cleanup routine.
                if (tsRender?.id) tsRender.remove(tsRender.id);
            };
        };
    });
    return <ContextObject.Provider value={{ promise: promise.current, effect: effect.current }}>{props.children}</ContextObject.Provider>;
}
