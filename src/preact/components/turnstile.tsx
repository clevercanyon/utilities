/**
 * Preact component.
 */

import '#@initialize.ts';

import { $env, $preact, type $type } from '#index.ts';
import { createContext } from 'preact';

/**
 * Defines types.
 */
declare type API = typeof import('#@preact/apis/web/turnstile.ts');
export type Props = $preact.BasicTreeProps<{}>;
export type Context = {
    promise: Promise<API>;
    effect: (selectors: string) => () => () => void;
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
    const effect = $preact.useRef((elementOrSelectors: string | HTMLElement): (() => () => void) => {
        return (): (() => void) => {
            let ref: {
                remove: $type.Turnstile['remove'];
                id: ReturnType<$type.Turnstile['render']>;
            };
            void promise.current.then(({ deploy, siteKey }): void => {
                void deploy().then(({ render, remove }): void => {
                    ref = {
                        remove,
                        id: render(elementOrSelectors, {
                            sitekey: siteKey(),
                            // @ts-ignore -- property ok.
                            'response-field-name': 'turnstile',
                        }),
                    };
                });
            });
            return (): void => {
                // Unmount cleanup routine.
                if (ref && ref.id) ref.remove(ref.id);
            };
        };
    });
    return <ContextObject.Provider value={{ promise: promise.current, effect: effect.current }}>{props.children}</ContextObject.Provider>;
}
