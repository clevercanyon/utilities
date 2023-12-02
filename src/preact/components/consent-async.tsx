/**
 * Preact component.
 *
 * @requiredEnv web
 */

import '#@init.ts';

import { $preact } from '#index.ts';
import { default as As } from '#preact/components/as.tsx';

/**
 * Defines types.
 */
export type State = $preact.State<{
    Dialog?: typeof import('#preact/components/consent-dialog.tsx').default;
    Icon?: typeof import('#preact/components/consent-icon.tsx').default;
}>;
export type Props = $preact.NoProps;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function ConsentAsync(/* props: Props = {} */): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducedState((): State => ({}));
    const { Dialog, Icon } = state; // Initially undefined.

    $preact.useEffect((): void => {
        void import('#preact/components/consent-dialog.tsx').then(({ default: ConsentDialog }) => {
            void import('#preact/components/consent-icon.tsx').then(({ default: ConsentIcon }) => {
                updateState({ Dialog: ConsentDialog, Icon: ConsentIcon });
            });
        });
    }, []);
    return (
        <As tag='x-preact-app-consent'>
            {Dialog && <Dialog />}
            {Icon && <Icon />}
        </As>
    );
}
