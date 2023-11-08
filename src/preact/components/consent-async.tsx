/**
 * Preact component.
 *
 * @requiredEnv web
 */

import '../../resources/init.ts';

import { $preact } from '../../index.ts';
import { default as As } from './as.tsx';

/**
 * Defines types.
 */
export type State = $preact.State<{
    Dialog?: typeof import('./consent-dialog.tsx').default;
    Icon?: typeof import('./consent-icon.tsx').default;
}>;
export type Props = $preact.BasicPropsNoKeyRefChildren<object>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 */
export default function ConsentAsync(unusedꓺprops: Props = {}): $preact.VNode<Props> {
    const [state, updateState] = $preact.useReducedState((): State => ({}));
    const { Dialog, Icon } = state; // Initially undefined.

    $preact.useEffect((): void => {
        void import('./consent-dialog.tsx').then(({ default: ConsentDialog }) => {
            void import('./consent-icon.tsx').then(({ default: ConsentIcon }) => {
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
