/**
 * Preact component.
 *
 * This depends on our consent API, which is web-only. For that reason, this component must be loaded and introduced
 * only by effects, and not inserted into DOM via SSR, or initial hydration, which would case diffing issues.
 *
 * @requiredEnv web
 */

import '../../resources/init.ts';

import FluentEmojiFlatCookie from '~icons/fluent-emoji-flat/cookie';
import { $preact } from '../../index.ts';
import { default as As } from './as.tsx';

/**
 * Defines types.
 */
export type Props = $preact.BasicPropsNoKeyRefChildren<object>;

/**
 * Renders component.
 *
 * @param   props Component props.
 *
 * @returns       VNode / JSX element tree.
 *
 * @note `z-index` for our consent icon uses `102`, which is right under our consent dialog at `103`, `104`.
 *        Also, it sits on top of a site’s header and navigation dialog, which should be at `100`, `101`.
 */
export default function ConsentIcon(unusedꓺprops: Props = {}): $preact.VNode<Props> {
    const onClick = $preact.useCallback((): void => {
        void $preact.useConsent().then(({ openDialog }) => openDialog());
    }, []);
    return (
        <As tag='x-preact-app-consent-icon'>
            <div style={{ zIndex: 102 }} class='fixed bottom-0 left-0'>
                <button type='button' onClick={onClick} class='mb-2 ml-1 opacity-20 hover:opacity-100' title='Consent Preferences'>
                    <span class='sr-only'>Consent Preferences</span>
                    <FluentEmojiFlatCookie class='inline-block h-auto w-9' aria-hidden='true' />
                </button>
            </div>
        </As>
    );
}
