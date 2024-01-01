/**
 * Preact component.
 */

import '#@initialize.ts';

import { $class, $env, $preact, type $type } from '#index.ts';
import { createContext } from 'preact';

/**
 * Defines types.
 */
export type Props = $preact.BasicTreeProps<{ consentLogger?: $type.Logger }>;
export type Context = $type.LoggerInterface; // Logger or contextual interface.

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
export const useConsentLogger = (): Context => $preact.useContext(ContextObject);

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function ConsentLogger(props: Props = {}): $preact.VNode<Props> {
    return (
        <ContextObject.Provider
            value={
                props.consentLogger ||
                new ($class.getLogger())({
                    endpointToken: $env.get('APP_CONSENT_LOGGER_BEARER_TOKEN', { type: 'string', default: '' }),
                })
            }
        >
            {props.children}
        </ContextObject.Provider>
    );
}

// ---
// Misc exports.

/**
 * Defines named prop keys for easy reuse.
 *
 * @returns Array of named {@see ConsentLogger} prop keys.
 */
export const namedPropKeys = () => ['consentLogger'];
